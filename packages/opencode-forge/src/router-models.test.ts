import { expect, test } from "bun:test";

import type { Model } from "@forge/models";
import { Provider } from "@opencode/schema/provider";

import { routerModels } from "./router-models.ts";

const providerID = Provider.ID.make("forge-router");

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

test("maps shared model metadata into OpenCode costs and effort variants", () => {
  const [mapped] = routerModels([model()], providerID);
  expect(mapped.name).toBe("Reasoner");
  expect(mapped.limit).toEqual({ context: 1_000_000, output: 128_000 });
  expect(mapped.capabilities).toEqual({
    input: ["text", "image"],
    output: ["text"],
    temperature: true,
    tools: true,
  });
  expect(mapped.variants.map(({ body, id }) => ({ body, id: String(id) }))).toEqual([
    { body: { reasoning_effort: "low" }, id: "low" },
    { body: { reasoning_effort: "high" }, id: "high" },
  ]);
  expect(
    mapped.cost?.map((entry) => [
      Number(entry.input),
      Number(entry.output),
      Number(entry.cache.read),
      Number(entry.cache.write),
      entry.tier,
    ])
  ).toEqual([
    [2, 10, 0.2, 0, undefined],
    [4, 10, 0.2, 0, { size: 200_000, type: "context" }],
  ]);
});

test("keeps unsupported input and output out of OpenCode chat", () => {
  expect(() => routerModels([{ ...model(), input: ["audio"] }], providerID)).toThrow(
    "Unsupported OpenRouter input"
  );
  expect(routerModels([{ ...model(), output: ["image"] }], providerID)).toEqual([]);
});

test("retains chat models when the router also offers judge and media models", () => {
  const chat = model();
  const judge = { ...model("example/judge"), output: ["decisions"] };
  const image = { ...model("example/image"), input: [], output: ["image"] };
  const video = { ...model("example/video"), input: [], output: ["video"] };
  expect(
    routerModels([chat, judge, image, video], providerID).map((entry) => String(entry.id))
  ).toEqual([chat.id]);
});
