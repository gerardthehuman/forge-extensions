import { Model } from "@opencode/plugin";
import { Money } from "@opencode/schema/money";
import type { Provider } from "@opencode/schema/provider";

export interface TokenCost {
  input: number;
  output: number;
  cache_read?: number;
  cache_write?: number;
}

export interface ContextTier extends TokenCost {
  /** Minimum prompt size, in tokens, this rate card applies from. */
  threshold: number;
}

export interface ModelDefinition {
  id: string;
  name: string;
  tool_call: boolean;
  input_modalities: string[];
  output_modalities: string[];
  reasoning: boolean;
  efforts: readonly string[];
  cost?: TokenCost;
  tiers: ContextTier[];
  context: number;
  output: number;
}

const price = (value: number): typeof Money.USDPerMillionTokens.Type =>
  Money.USDPerMillionTokens.make(value);

const costEntry = (cost: TokenCost, tier?: { type: "context"; size: number }) => {
  const entry = {
    cache: {
      read: price(cost.cache_read ?? 0),
      write: price(cost.cache_write ?? 0),
    },
    input: price(cost.input),
    output: price(cost.output),
  };

  if (tier) {
    return Model.Cost.make({ ...entry, tier });
  }

  return Model.Cost.make(entry);
};

/**
 * Builds an OpenCode model definition from shared Forge/OpenRouter shape.
 * Long-context rate cards become tiered cost entries sorted by threshold,
 * mirroring the broker's `/models` catalog order.
 */
export const buildModel = (providerID: Provider.ID, model: ModelDefinition): Model.Info => {
  const base = Model.Info.default(providerID, Model.ID.make(model.id));

  const variants = model.efforts.map((effort) => ({
    body: { reasoning_effort: effort },
    id: Model.VariantID.make(effort),
  }));

  return {
    ...base,
    capabilities: {
      input: model.input_modalities.filter((type) => type === "text" || type === "image"),
      output: model.output_modalities.filter((type) => type === "text"),
      temperature: true,
      tools: model.tool_call,
    },
    cost: [
      ...(model.cost ? [costEntry(model.cost)] : []),
      ...model.tiers.map((tier) => costEntry(tier, { size: tier.threshold, type: "context" })),
    ],
    limit: { context: model.context, output: model.output },
    name: model.name,
    variants,
  };
};
