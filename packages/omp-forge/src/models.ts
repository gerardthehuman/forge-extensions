import type { DesktopModels } from "@forge/models/catalogs";
import type { Effort, Model } from "@oh-my-pi/pi-ai";
import type { ProviderModelConfig } from "@oh-my-pi/pi-coding-agent";

type ModelDefinition = ProviderModelConfig &
  Pick<Model, "supportsTools" | "cost"> & { maxContextWindow: number };

type ModelCost = Model["cost"];

type Compatibility = NonNullable<ProviderModelConfig["compat"]>;

type TokenCost = NonNullable<DesktopModels[string]["cost"]>;

const EFFORT_PAYLOADS = ["minimal", "low", "medium", "high", "xhigh", "max"] as const;

const isEffort = (value: unknown): value is Effort =>
  typeof value === "string" && EFFORT_PAYLOADS.some((payload) => payload === value);

const OMP_EFFORTS = EFFORT_PAYLOADS.map((payload) => {
  if (!isEffort(payload)) {
    throw new Error(`Unknown thinking effort: ${payload}`);
  }

  return payload;
});

const tokenCost = (cost: TokenCost): ModelCost => ({
  cacheRead: cost.cache_read ?? 0,
  cacheWrite: cost.cache_write ?? 0,
  input: cost.input,
  output: cost.output,
});

const modelCost = (cost: DesktopModels[string]["cost"]): ModelCost => {
  if (!cost) {
    throw new Error("Forge model is missing token pricing.");
  }

  const mapped = tokenCost(cost);

  // OMP supports one long-context rate card, using the first context tier.
  const tiers = (cost.tiers ?? [])
    .filter(({ tier }) => tier?.type === "context")
    .toSorted((a, b) => a.tier.size - b.tier.size);

  if (tiers.length) {
    mapped.longContext = {
      ...tokenCost(tiers[0]),
      inputThreshold: tiers[0].tier.size,
    };
  }

  return mapped;
};

export const mapForgeModels = (catalog: DesktopModels): ModelDefinition[] =>
  Object.values(catalog).map((model) => {
    const effortValues =
      model.reasoning_options
        ?.filter((option) => option.type === "effort")
        .flatMap((option) => option.values) ?? [];

    // "none" is OMP's separate "off" control, not a thinking effort.
    const efforts = OMP_EFFORTS.filter((effort) =>
      effortValues.some((value) => isEffort(value) && value === effort)
    );

    const thinking: ProviderModelConfig["thinking"] =
      model.reasoning && efforts.length ? { efforts, mode: "effort" } : undefined;

    const cost = modelCost(model.cost);

    const contextWindow = Math.min(
      model.limit.context,
      cost.longContext?.inputThreshold ?? model.limit.context
    );

    // The endpoint speaks OpenRouter, even when model lineage or its loopback
    // URL would make OMP infer a native vendor/local-serving dialect.
    const reasoningCompat: Compatibility = {
      allowsSyntheticReasoningContentForToolCalls: true,
      disableReasoningOnForcedToolChoice: false,
      disableReasoningOnToolChoice: false,
      disableReasoningWithTools: false,
      extraBody: {},
      omitReasoningEffort: efforts.length === 0,
      qwenPreserveThinking: false,
      qwenTemplateReasoningEffort: false,
      reasoningContentField: "reasoning",
      reasoningDisableMode: "openrouter-enabled-false",
      reasoningEffortMap: Object.fromEntries(efforts.map((effort) => [effort, effort])),
      replayReasoningContent: false,
      requiresReasoningContentForAllAssistantTurns: false,
      requiresReasoningContentForToolCalls: model.reasoning,
      requiresThinkingAsText: false,
      supportsReasoningEffort: efforts.length > 0,
      supportsReasoningParams: true,
      thinkingFormat: "openrouter",
    };

    return {
      compat: {
        ...reasoningCompat,
        alwaysSendMaxTokens: false,
        clampOutputToModelMax: true,
        isOpenRouterHost: true,
        maxTokensField: "max_tokens",
        supportsDeveloperRole: false,
        supportsMultipleSystemMessages: true,
        supportsStore: false,
        supportsUsageInStreaming: true,
        // Override lineage-specific thinking variants as well as the baseline.
        whenThinking: reasoningCompat,
        wireModelIdMode: "raw",
      },
      contextWindow,
      cost,
      id: model.id,
      input: model.modalities.input.filter((type) => type === "text" || type === "image"),
      maxContextWindow: model.limit.context,
      maxTokens: model.limit.output,
      name: model.name,
      reasoning: model.reasoning,
      supportsTools: model.tool_call,
      thinking,
    };
  });
