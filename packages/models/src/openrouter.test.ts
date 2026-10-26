import { expect, test } from "bun:test";

import { ModelSchema } from "./model.ts";
import { normalizeModel } from "./openrouter.ts";

const model = () => ({
  architecture: { input_modalities: ["text", "image", "audio"], output_modalities: ["text"] },
  context_length: 1_000_000,
  id: "example/reasoner",
  pricing: { completion: "0.00001", input_cache_read: "0.0000002", prompt: "0.000002" },
  reasoning: { supported_efforts: ["high", "none", "low", "future-effort"] },
  supported_parameters: ["reasoning_effort", "tools"],
  top_provider: { max_completion_tokens: 128_000 },
});

test("normalizes rates, limits, modalities, supported reasoning efforts and missing names", () => {
  const mapped = normalizeModel(model());
  expect(mapped.id).toBe("example/reasoner");
  expect(mapped.name).toBe(mapped.id);
  expect(mapped.input).toEqual(["text", "image", "audio"]);
  expect(mapped.output).toEqual(["text"]);
  expect(mapped.contextWindow).toBe(1_000_000);
  expect(mapped.maxTokens).toBe(128_000);
  expect(mapped.efforts).toEqual(["low", "high"]);
  expect(mapped.reasoning).toBe(true);
  expect(mapped.supportsTools).toBe(true);
  expect(mapped.cost?.input).toBe(2);
  expect(mapped.cost?.output).toBe(10);
  expect(mapped.cost?.cacheRead).toBeCloseTo(0.2, 12);
  expect(mapped.cost?.cacheWrite).toBe(0);
  expect(ModelSchema.safeParse(mapped).success).toBe(true);
  expect(normalizeModel({ ...model(), name: "" }).name).toBe("");
});

test("orders context price tiers and inherits omitted rates", () => {
  const row = model();

  const mapped = normalizeModel({
    ...row,
    pricing: {
      ...row.pricing,
      overrides: [
        { min_prompt_tokens: 300_000, prompt: "0.000006" },
        { min_prompt_tokens: 200_000, prompt: "0.000004" },
        { min_prompt_tokens: -1, prompt: "invalid" },
      ],
    },
  });

  expect(mapped.cost?.tiers.map((tier) => [tier.inputThreshold, tier.input, tier.output])).toEqual([
    [200_000, 4, 10],
    [300_000, 6, 10],
  ]);
  expect(mapped.cost?.tiers[0]?.cacheRead).toBeCloseTo(0.2, 12);
});

test("does not turn missing or invalid paid prices into free models", () => {
  for (const value of [undefined, "", "invalid", "-1"]) {
    const row = model();
    expect(() => normalizeModel({ ...row, pricing: { ...row.pricing, prompt: value } })).toThrow(
      "Invalid OpenRouter price"
    );
  }

  const row = model();
  expect(normalizeModel({ ...row, pricing: { ...row.pricing, prompt: "0" } }).cost?.input).toBe(0);
});

test("keeps decisions and media modalities without requiring chat metadata for media", () => {
  const judge = normalizeModel({
    ...model(),
    architecture: { input_modalities: ["text"], output_modalities: ["decisions"] },
  });

  expect(judge.output).toEqual(["decisions"]);
  expect(ModelSchema.safeParse(judge).success).toBe(true);

  const image = normalizeModel({
    architecture: { output_modalities: ["image"] },
    id: "example/image",
    pricing: "unused",
  });

  expect(image.output).toEqual(["image"]);
  expect(image.cost).toBeUndefined();
  expect(ModelSchema.safeParse(image).success).toBe(true);
  expect(() => normalizeModel({ id: "missing-output" })).toThrow(
    "Missing OpenRouter output modalities"
  );
  expect(() =>
    normalizeModel({
      ...model(),
      architecture: { input_modalities: ["audio"], output_modalities: ["text"] },
    })
  ).toThrow("Unsupported OpenRouter input");
});

test("rejects corrupt normalized cache data", () => {
  const normalized = normalizeModel(model());
  expect(ModelSchema.safeParse({ ...normalized, cost: undefined }).success).toBe(false);
  expect(ModelSchema.safeParse({ ...normalized, maxTokens: -1 }).success).toBe(false);
  expect(ModelSchema.safeParse({ ...normalized, efforts: [1] }).success).toBe(false);
});

test("preserves optional rate defaults and filters mixed modality and effort lists", () => {
  const row = model();

  const mapped = normalizeModel({
    ...row,
    architecture: { input_modalities: [false, "text", null], output_modalities: [42, "text"] },
    name: null,
    pricing: { ...row.pricing, input_cache_read: null, input_cache_write: undefined },
    reasoning: { supported_efforts: [null, "low", false, "future-effort"] },
  });

  expect(mapped.name).toBe(row.id);
  expect(mapped.input).toEqual(["text"]);
  expect(mapped.output).toEqual(["text"]);
  expect(mapped.efforts).toEqual(["low"]);
  expect(mapped.cost?.cacheRead).toBe(0);
  expect(mapped.cost?.cacheWrite).toBe(0);
});

test("does not coerce invalid token limits or nonfinite prices", () => {
  const row = model();

  for (const context_length of ["1000000", 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    expect(() => normalizeModel({ ...row, context_length })).toThrow(
      "Invalid OpenRouter token limit"
    );
  }

  for (const prompt of [Number.NaN, Infinity, -Infinity, " ", true]) {
    expect(() => normalizeModel({ ...row, pricing: { ...row.pricing, prompt } })).toThrow(
      "Invalid OpenRouter price"
    );
  }
});

test("strips provider prefixes while preserving model-name suffixes and IDs", () => {
  for (const [name, expected] of [
    ["OpenAI: GPT-6 Luna", "GPT-6 Luna"],
    ["Anthropic: Claude Opus 5", "Claude Opus 5"],
    ["SpaceXAI: Grok 4.7", "Grok 4.7"],
    ["Provider: Model: Special Edition", "Model: Special Edition"],
    ["Plain Model", "Plain Model"],
    ["Model:Variant", "Model:Variant"],
  ]) {
    const mapped = normalizeModel({ ...model(), name });
    expect(mapped.name).toBe(expected);
    expect(mapped.id).toBe("example/reasoner");
  }

  expect(normalizeModel({ ...model(), id: "example/reasoner:free" }).name).toBe(
    "example/reasoner:free"
  );
});
