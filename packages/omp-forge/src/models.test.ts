import { expect, test } from "bun:test";

import type { ForgeModel } from "@forge/code-client";

import { mapForgeModels } from "./models.ts";

const model = (): ForgeModel => ({
  attachment: true,
  cost: {
    input: 1,
    output: 2,
    tiers: [{ input: 2, output: 4, tier: { size: 272_000, type: "context" } }],
  },
  description: "Context policy fixture",
  id: "example/chat",
  last_updated: "2026-10-26",
  limit: { context: 1_000_000, output: 128_000 },
  metadata: { cost: { band: "$", tier: "low" }, speed: {} },
  modalities: { input: ["text"], output: ["text"] },
  name: "Chat",
  open_weights: false,
  reasoning: false,
  release_date: "2026-10-26",
  tool_call: true,
});

test("registers standard and maximum context windows separately for tiered Forge models", () => {
  const row = model();
  const [mapped] = mapForgeModels({ [row.id]: row });
  expect(mapped.contextWindow).toBe(272_000);
  expect(mapped.maxContextWindow).toBe(1_000_000);
  expect(mapped.cost?.longContext?.inputThreshold).toBe(272_000);
});

test("retains the full advertised context when Forge publishes no long-context tier", () => {
  const row = { ...model(), cost: { input: 1, output: 2 } };
  const [mapped] = mapForgeModels({ [row.id]: row });
  expect(mapped.contextWindow).toBe(1_000_000);
  expect(mapped.maxContextWindow).toBe(1_000_000);
});
