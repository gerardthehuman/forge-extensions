import { createHash, randomUUID } from "node:crypto";
import { readFile, mkdir, writeFile, rename, rm } from "node:fs/promises";
import path from "node:path";

import { createModel } from "@forge/models";
import type { Model } from "@forge/models";
import { z } from "zod";

import { mapOpenRouterModels } from "./models.ts";

const RouterCatalogSchema = z.object({ data: z.array(z.object({ id: z.string().min(1) })) });

type RouterCatalog = z.infer<typeof RouterCatalogSchema>;

export interface DiscoveredCatalog {
  fetchedAt: string;
  discoveredAt: string;
  data: Model[];
}

const TimestampSchema = z.string().refine((value) => Number.isFinite(Date.parse(value)));

const StartupCatalogSchema = RouterCatalogSchema.extend({
  discoveredAt: TimestampSchema,
  fetchedAt: TimestampSchema,
  version: z.literal(1),
});

const startupCatalogPath = (cacheDirectory: string, baseUrl: string, key: string): string => {
  const scope = createHash("sha256")
    .update(JSON.stringify([baseUrl, key]))
    .digest("hex");

  return path.join(cacheDirectory, `startup-catalog-${scope}.json`);
};

export const readStartupCatalog = async (
  cacheDirectory: string,
  baseUrl: string,
  key: string
): Promise<DiscoveredCatalog | undefined> => {
  try {
    const parsed = StartupCatalogSchema.safeParse(
      JSON.parse(await readFile(startupCatalogPath(cacheDirectory, baseUrl, key), "utf-8"))
    );

    if (!parsed.success) {
      return undefined;
    }

    const cached = parsed.data;
    const data = await Promise.all(cached.data.map(async ({ id }) => await createModel(id)));
    mapOpenRouterModels(data);

    return { data, discoveredAt: cached.discoveredAt, fetchedAt: cached.fetchedAt };
  } catch {
    return undefined;
  }
};

export const writeStartupCatalog = async (
  cacheDirectory: string,
  baseUrl: string,
  key: string,
  catalog: DiscoveredCatalog
): Promise<void> => {
  const cachePath = startupCatalogPath(cacheDirectory, baseUrl, key);
  await mkdir(cacheDirectory, { recursive: true });
  const temporary = `${cachePath}.${randomUUID()}.tmp`;

  try {
    await writeFile(temporary, `${JSON.stringify({ version: 1, ...catalog })}\n`, { mode: 0o600 });
    await rename(temporary, cachePath);
  } finally {
    await rm(temporary, { force: true });
  }
};

export const fetchRouterCatalog = async (
  baseUrl: string,
  key: string | undefined,
  {
    fetcher = fetch,
    signal,
  }: {
    fetcher?: (input: string, init?: RequestInit) => Promise<Response>;
    signal?: AbortSignal;
  } = {}
): Promise<RouterCatalog> => {
  if (key === undefined || key === "") {
    throw new Error("Log in to Forge Router with /login before discovering models.");
  }

  let response;

  try {
    response = await fetcher(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      redirect: "error",
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(8000)])
        : AbortSignal.timeout(8000),
    });
  } catch {
    throw new Error("Forge Router model endpoint is unreachable.");
  }

  if (!response.ok) {
    throw new Error(`Forge Router model endpoint returned HTTP ${response.status}.`);
  }

  const catalog = RouterCatalogSchema.safeParse(await response.json());

  if (!catalog.success) {
    throw new Error("Invalid Forge Router model catalog.");
  }

  return catalog.data;
};

export const discoverCatalog = async (
  baseUrl: string,
  key: string | undefined
): Promise<DiscoveredCatalog> => {
  const router = await fetchRouterCatalog(baseUrl, key);
  const ids = [...new Set(router.data.map((model) => model.id))];
  const data = await Promise.all(ids.map(async (id) => await createModel(id)));
  mapOpenRouterModels(data);
  const discoveredAt = new Date().toISOString();

  return { data, discoveredAt, fetchedAt: discoveredAt };
};
