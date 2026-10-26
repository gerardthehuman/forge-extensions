import type { Model } from "@forge/models";
import type { Provider } from "@opencode/schema/provider";

import { buildModel } from "./model-builder.ts";

export const routerModels = (data: Model[], providerID: Provider.ID) =>
  data.flatMap((model) => {
    if (!model.output.includes("text")) {
      return [];
    }

    if (!model.input.includes("text")) {
      throw new Error(`Unsupported OpenRouter input: ${model.id}`);
    }

    if (
      model.contextWindow === undefined ||
      model.maxTokens === undefined ||
      model.cost === undefined
    ) {
      throw new Error(`Incomplete model metadata: ${model.id}`);
    }

    return [
      buildModel(providerID, {
        context: model.contextWindow,
        cost: {
          cache_read: model.cost.cacheRead,
          cache_write: model.cost.cacheWrite,
          input: model.cost.input,
          output: model.cost.output,
        },
        efforts: model.efforts,
        id: model.id,
        input_modalities: model.input,
        name: model.name,
        output: model.maxTokens,
        output_modalities: model.output,
        reasoning: model.reasoning,
        tiers: model.cost.tiers.map((tier) => ({
          cache_read: tier.cacheRead,
          cache_write: tier.cacheWrite,
          input: tier.input,
          output: tier.output,
          threshold: tier.inputThreshold,
        })),
        tool_call: model.supportsTools,
      }),
    ];
  });
