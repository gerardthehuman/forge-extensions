import { z } from "zod";

import { CACHE_TTL_MS, modelName } from "./model.ts";
import type { Model, TokenCost } from "./model.ts";

type Metadata = string | number | boolean | null | undefined | Metadata[] | MetadataObject;

interface MetadataObject {
  [key: string]: Metadata;
}

const MetadataSchema: z.ZodType<Metadata> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.nan(),
    z.literal(Infinity),
    z.literal(-Infinity),
    z.boolean(),
    z.null(),
    z.undefined(),
    z.array(MetadataSchema),
    z.record(z.string(), MetadataSchema),
  ])
);

const MetadataObjectSchema = z.record(z.string(), MetadataSchema);
const CatalogSchema = z.object({ data: z.array(MetadataSchema) }).catchall(MetadataSchema);

const record = (value: Metadata): MetadataObject | undefined => {
  const parsed = MetadataObjectSchema.safeParse(value);

  return parsed.success ? parsed.data : undefined;
};

const TextsSchema = z
  .array(z.unknown())
  .transform((values) =>
    values.flatMap((value) => {
      const text = z.string().safeParse(value);

      return text.success ? [text.data] : [];
    })
  )
  .catch([]);

const PriceSchema = z
  .union([z.number(), z.string().trim().min(1).transform(Number)])
  .pipe(z.number().nonnegative())
  .transform((amount) => amount * 1_000_000);

const LimitSchema = z.number().int().positive();
const TierSchema = MetadataObjectSchema.and(z.object({ min_prompt_tokens: LimitSchema }));

const texts = (value: Metadata): string[] => TextsSchema.parse(value);

const price = (value: Metadata, field: string, optional = false): number => {
  if (optional && (value === undefined || value === null)) {
    return 0;
  }

  const amount = PriceSchema.safeParse(value);

  if (!amount.success) {
    throw new Error(`Invalid OpenRouter price: ${field}`);
  }

  return amount.data;
};

const tokenCosts = (pricing: MetadataObject): TokenCost => {
  const input = price(pricing.prompt, "prompt");
  const output = price(pricing.completion, "completion");

  return {
    cacheRead: price(pricing.input_cache_read, "input_cache_read", true),
    cacheWrite: price(pricing.input_cache_write, "input_cache_write", true),
    input,
    output,
  };
};

const costs = (pricing: MetadataObject): NonNullable<Model["cost"]> => {
  const base = tokenCosts(pricing);
  const overrides = Array.isArray(pricing.overrides) ? pricing.overrides : [];

  const tiers = overrides
    .flatMap((value) => {
      const tier = TierSchema.safeParse(value);

      if (!tier.success) {
        return [];
      }

      return [
        {
          ...tokenCosts({ ...pricing, ...tier.data }),
          inputThreshold: tier.data.min_prompt_tokens,
        },
      ];
    })
    .toSorted((a, b) => a.inputThreshold - b.inputThreshold);

  return { ...base, tiers };
};

const limit = (value: Metadata, field: string): number => {
  const parsed = LimitSchema.safeParse(value);

  if (!parsed.success) {
    throw new Error(`Invalid OpenRouter token limit: ${field}`);
  }

  return parsed.data;
};

const EFFORTS = ["minimal", "low", "medium", "high", "xhigh", "max"] as const;

export const normalizeModel = (payload: Metadata): Model => {
  const model = record(payload);

  const id = z.string().min(1).safeParse(model?.id);

  if (model === undefined || !id.success) {
    throw new TypeError("Invalid OpenRouter model ID");
  }

  const architecture = record(model.architecture);
  const output = texts(architecture?.output_modalities);

  if (output.length === 0) {
    throw new Error(`Missing OpenRouter output modalities: ${id.data}`);
  }

  const input = texts(architecture?.input_modalities);
  const parameters = texts(model.supported_parameters);
  const efforts = texts(record(model.reasoning)?.supported_efforts);
  const name = z.string().safeParse(model.name ?? id.data);

  if (!name.success) {
    throw new TypeError(`Invalid OpenRouter model name: ${id.data}`);
  }

  const normalized: Model = {
    efforts: EFFORTS.filter((effort) => efforts.includes(effort)),
    id: id.data,
    input,
    name: modelName(name.data),
    output,
    reasoning: parameters.includes("reasoning") || parameters.includes("reasoning_effort"),
    supportsTools: parameters.includes("tools"),
  };

  if (!output.includes("text") && !output.includes("decisions")) {
    return normalized;
  }

  if (!input.includes("text")) {
    throw new Error(`Unsupported OpenRouter input: ${id.data}`);
  }

  normalized.cost = costs(record(model.pricing) ?? {});
  normalized.contextWindow = limit(model.context_length, "context_length");
  normalized.maxTokens = limit(
    record(model.top_provider)?.max_completion_tokens,
    "max_completion_tokens"
  );

  return normalized;
};

const MODELS_URL = "https://openrouter.ai/api/v1/models?output_modalities=all";

interface CatalogSnapshot {
  data: Metadata[];
  fetchedAt: number;
}

let pending: Promise<CatalogSnapshot> | undefined;
let snapshot: CatalogSnapshot | undefined;

const fetchCatalog = async (): Promise<CatalogSnapshot> => {
  const response = await fetch(MODELS_URL, { signal: AbortSignal.timeout(8000) });

  if (!response.ok) {
    throw new Error(`OpenRouter returned HTTP ${response.status}.`);
  }

  const catalog = CatalogSchema.safeParse(await response.json());

  if (!catalog.success) {
    throw new TypeError("Invalid OpenRouter catalog.");
  }

  return { data: catalog.data.data, fetchedAt: Date.now() };
};

const readCatalog = async (): Promise<CatalogSnapshot> => {
  const age = Date.now() - (snapshot?.fetchedAt ?? 0);

  if (snapshot !== undefined && age >= 0 && age < CACHE_TTL_MS) {
    return snapshot;
  }

  pending ??= fetchCatalog();

  try {
    snapshot = await pending;

    return snapshot;
  } finally {
    pending = undefined;
  }
};

export const fetchModel = async (id: string): Promise<{ fetchedAt: number; model: Model }> => {
  const catalog = await readCatalog();

  const model = catalog.data.find((entry) => record(entry)?.id === id);

  if (model === undefined) {
    throw new Error(`Router model missing from OpenRouter metadata: ${id}`);
  }

  return { fetchedAt: catalog.fetchedAt, model: normalizeModel(model) };
};
