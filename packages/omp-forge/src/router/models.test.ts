import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import type { Model } from "@forge/models";
import { AuthStorage } from "@oh-my-pi/pi-ai";
import { ModelRegistry, Settings } from "@oh-my-pi/pi-coding-agent";
import { cfgExtendedContext } from "@oh-my-pi/pi-coding-agent/session/context-settings";

import { mapOpenRouterModels } from "./models.ts";

const model = (id = "example/chat"): Model => ({
  contextWindow: 1_000_000,
  cost: {
    cacheRead: 0.2,
    cacheWrite: 0,
    input: 2,
    output: 10,
    tiers: [{ cacheRead: 0.2, cacheWrite: 0, input: 4, inputThreshold: 200_000, output: 10 }],
  },
  efforts: ["low", "high"],
  id,
  input: ["text", "image", "audio"],
  maxTokens: 128_000,
  name: "Reasoner",
  output: ["text"],
  reasoning: true,
  supportsTools: true,
});

test("maps shared metadata to OMP costs, capabilities and thinking", () => {
  const [mapped] = mapOpenRouterModels([model()]);
  expect(mapped.cost).toEqual({
    cacheRead: 0.2,
    cacheWrite: 0,
    input: 2,
    longContext: { cacheRead: 0.2, cacheWrite: 0, input: 4, inputThreshold: 200_000, output: 10 },
    output: 10,
  });
  expect(mapped.contextWindow).toBe(200_000);
  expect(mapped.maxTokens).toBe(128_000);
  expect(mapped.input).toEqual(["text", "image"]);
  expect(mapped.supportsTools).toBe(true);
  expect(
    mapped.thinking?.mode === "effort" ? mapped.thinking.efforts?.map(String) : undefined
  ).toEqual(["low", "high"]);
  expect(mapped.compat).toMatchObject({ thinkingFormat: "openrouter" });
});

test("registers decisions as judge models and omits media-only models", () => {
  const chat = model();
  const judge = { ...model("typesafe/jev-1.13"), output: ["decisions"] };

  const media = ["image", "video"].map((output) => ({
    ...model(`example/${output}`),
    output: [output],
  }));

  expect(mapOpenRouterModels([chat, judge, ...media]).map(({ api, id }) => ({ api, id }))).toEqual([
    { api: "openai-completions", id: chat.id },
    { api: "openrouter-decisions", id: judge.id },
  ]);
});

test("uses the standard context by default and restores the maximum through OMP extended context", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-context-policy-"));
  const auth = await AuthStorage.create(path.join(directory, "auth.db"));

  try {
    const settings = Settings.isolated({ extendedContext: false });
    const registry = new ModelRegistry(auth, path.join(directory, "models.yml"), { settings });
    registry.registerProvider("forge-router", {
      api: "openai-completions",
      apiKey: "test-only-key",
      baseUrl: "https://router.example/v1",
      models: mapOpenRouterModels([model()]),
    });
    expect(registry.find("forge-router", "example/chat")?.contextWindow).toBe(200_000);
    cfgExtendedContext.override(settings, true);
    await registry.reapplyModelPolicies();
    expect(registry.find("forge-router", "example/chat")?.contextWindow).toBe(1_000_000);
    cfgExtendedContext.override(settings, false);
    await registry.reapplyModelPolicies();
    expect(registry.find("forge-router", "example/chat")?.contextWindow).toBe(200_000);
  } finally {
    auth.close();
    await rm(directory, { force: true, recursive: true });
  }
});
