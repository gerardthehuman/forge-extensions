import type { DesktopModels } from "@forge/models/catalogs";
import type { Provider } from "@opencode/schema/provider";

import { buildModel } from "./model-builder.ts";
import type { ContextTier, ModelDefinition } from "./model-builder.ts";

const EFFORTS = ["minimal", "low", "medium", "high", "xhigh", "max"] as const;

const modelDefinition = (model: DesktopModels[string]): ModelDefinition => {
  const efforts = EFFORTS.filter(
    (effort) =>
      model.reasoning_options?.some(
        (option) => option.type === "effort" && option.values.includes(effort)
      ) === true
  );

  const tiers: ContextTier[] = (model.cost?.tiers ?? [])
    .flatMap(({ tier, ...cost }) =>
      tier.type === "context" ? [{ threshold: tier.size, ...cost }] : []
    )
    .toSorted((a, b) => a.threshold - b.threshold);

  return {
    context: model.limit.context,
    cost: model.cost,
    efforts,
    id: model.id,
    input_modalities: model.modalities.input,
    name: model.name,
    output: model.limit.output,
    output_modalities: ["text"],
    reasoning: model.reasoning,
    tiers,
    tool_call: model.tool_call,
  };
};

/** Maps the Forge broker's `/models` catalog onto OpenCode model definitions. */
export const forgeModels = (catalog: DesktopModels, providerID: Provider.ID) =>
  Object.values(catalog).map((model) => buildModel(providerID, modelDefinition(model)));
