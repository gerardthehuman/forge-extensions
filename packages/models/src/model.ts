import { z } from "zod";

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const modelName = (name: string): string => name.replace(/^[^:]+:\s+/u, "");

const LimitSchema = z.number().int().positive();
const RateSchema = z.number().nonnegative();

const TokenCostSchema = z.object({
  cacheRead: RateSchema,
  cacheWrite: RateSchema,
  input: RateSchema,
  output: RateSchema,
});

export type TokenCost = z.infer<typeof TokenCostSchema>;

export const ModelSchema = z
  .object({
    contextWindow: LimitSchema.optional(),
    cost: TokenCostSchema.extend({
      tiers: z.array(TokenCostSchema.extend({ inputThreshold: LimitSchema })),
    }).optional(),
    efforts: z.array(z.string()),
    id: z.string().min(1),
    input: z.array(z.string()),
    maxTokens: LimitSchema.optional(),
    name: z.string(),
    output: z.array(z.string()).min(1),
    reasoning: z.boolean(),
    supportsTools: z.boolean(),
  })
  .superRefine((model, ctx) => {
    if (!model.output.includes("text") && !model.output.includes("decisions")) {
      return;
    }

    for (const field of ["cost", "contextWindow", "maxTokens"] as const) {
      if (model[field] === undefined) {
        ctx.addIssue({ code: "custom", message: "Required for text models", path: [field] });
      }
    }

    if (!model.input.includes("text")) {
      ctx.addIssue({ code: "custom", message: "Text input is required", path: ["input"] });
    }
  });

export type Model = z.infer<typeof ModelSchema>;
