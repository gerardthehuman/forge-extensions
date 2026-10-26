import type { Model as EnrichedModel } from "@forge/models";
import type { Effort, Model } from "@oh-my-pi/pi-ai";
import type { ProviderModelConfig } from "@oh-my-pi/pi-coding-agent";

type ModelDefinition = ProviderModelConfig &
  Pick<Model, "supportsTools" | "cost"> & { maxContextWindow: number };

type Compatibility = NonNullable<ProviderModelConfig["compat"]>;

const EFFORT_PAYLOADS = ["minimal", "low", "medium", "high", "xhigh", "max"] as const;

const isEffort = (value: unknown): value is Effort =>
  typeof value === "string" && EFFORT_PAYLOADS.some((payload) => payload === value);

const OMP_EFFORTS = EFFORT_PAYLOADS.map((payload) => {
  if (!isEffort(payload)) {
    throw new Error(`Unknown thinking effort: ${payload}`);
  }

  return payload;
});

export const mapOpenRouterModels = (data: EnrichedModel[]): ModelDefinition[] =>
  data.flatMap((model) => {
    if (!model.output.includes("text") && !model.output.includes("decisions")) {
      return [];
    }

    const { contextWindow, maxTokens, cost: pricing, reasoning } = model;

    if (contextWindow === undefined || maxTokens === undefined || pricing === undefined) {
      throw new Error(`Incomplete model metadata: ${model.id}`);
    }

    const efforts = OMP_EFFORTS.filter((effort) => model.efforts.includes(effort));

    const cost: Model["cost"] = {
      cacheRead: pricing.cacheRead,
      cacheWrite: pricing.cacheWrite,
      input: pricing.input,
      output: pricing.output,
    };

    const [tier] = pricing.tiers;

    if (tier !== undefined) {
      cost.longContext = { ...tier };
    }

    // A direct router URL (or vendor lineage) must not select a native-vendor
    // reasoning dialect. Apply the same OpenRouter wire contract when thinking.
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
      requiresReasoningContentForToolCalls: reasoning,
      requiresThinkingAsText: false,
      supportsReasoningEffort: efforts.length > 0,
      supportsReasoningParams: true,
      thinkingFormat: "openrouter",
    };

    return [
      {
        api: model.output.includes("decisions") ? "openrouter-decisions" : "openai-completions",
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
          whenThinking: reasoningCompat,
          wireModelIdMode: "raw",
        },
        contextWindow: Math.min(contextWindow, tier?.inputThreshold ?? contextWindow),
        cost,
        id: model.id,
        input: model.input.filter((type) => type === "text" || type === "image"),
        maxContextWindow: contextWindow,
        maxTokens,
        name: model.name,
        reasoning,
        supportsTools: model.supportsTools,
        thinking: reasoning && efforts.length ? { efforts, mode: "effort" } : undefined,
      },
    ];
  });
