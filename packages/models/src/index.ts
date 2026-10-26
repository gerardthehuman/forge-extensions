import { createHash } from "node:crypto";
import path from "node:path";

import envPaths from "env-paths";
import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import { z } from "zod";

import { CACHE_TTL_MS, modelName, ModelSchema } from "./model.ts";
import type { Model } from "./model.ts";
import { fetchModel, fetchModels } from "./openrouter.ts";

export type { Model } from "./model.ts";

export { ModelSchema } from "./model.ts";

const CachedModelSchema = z.object({ fetchedAt: z.number(), model: ModelSchema });

type CachedModel = z.infer<typeof CachedModelSchema>;

const Storage = createStorage({
  driver: fsLiteDriver({
    atomic: true,
    base: path.join(envPaths("forge-extensions", { suffix: "" }).cache, "models"),
  }),
});

const cacheKey = (id: string): string => `${createHash("sha256").update(id).digest("hex")}.json`;

const readCachedModel = async (id: string): Promise<CachedModel | undefined> => {
  try {
    const cached = CachedModelSchema.safeParse(await Storage.getItem(cacheKey(id)));

    if (!cached.success || cached.data.model.id !== id) {
      return undefined;
    }

    return {
      ...cached.data,
      model: { ...cached.data.model, name: modelName(cached.data.model.name) },
    };
  } catch {
    return undefined;
  }
};

export const createModel = async (id: string): Promise<Model> => {
  if (id.trim() === "") {
    throw new TypeError("A model ID is required.");
  }

  const cached = await readCachedModel(id);
  const age = Date.now() - (cached?.fetchedAt ?? 0);

  if (cached !== undefined && age >= 0 && age < CACHE_TTL_MS) {
    return cached.model;
  }

  try {
    const { fetchedAt, model } = await fetchModel(id);
    await Storage.setItem(cacheKey(id), { fetchedAt, model });

    return model;
  } catch (error) {
    if (cached !== undefined) {
      return cached.model;
    }

    throw error;
  }
};

export const refreshModels = async (ids: string[]): Promise<Model[]> => {
  const entries = await fetchModels(ids);
  await Promise.all(
    entries.map(async (entry) => {
      await Storage.setItem(cacheKey(entry.model.id), entry);
    })
  );

  return entries.map(({ model }) => model);
};
