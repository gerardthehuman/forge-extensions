import { z } from "zod";

import { readCatalog, writeCatalog } from "./catalog-cache.ts";
import { refreshModels } from "./index.ts";
import { ModelSchema } from "./model.ts";

const RouterResponseSchema = z.object({ data: z.array(z.object({ id: z.string().min(1) })) });

const RouterCatalogSchema = z.object({
  data: z.array(ModelSchema),
  discoveredAt: z.iso.datetime(),
  fetchedAt: z.iso.datetime(),
  version: z.literal(1),
});

export type RouterCatalog = z.infer<typeof RouterCatalogSchema>;

const scope = (baseUrl: string, key: string): string[] => [
  "router",
  baseUrl.replace(/\/+$/u, ""),
  key,
];

export const readRouterCatalog = async (
  baseUrl: string,
  key: string
): Promise<RouterCatalog | undefined> =>
  await readCatalog(scope(baseUrl, key), RouterCatalogSchema);

const writeRouterCatalog = async (
  baseUrl: string,
  key: string,
  catalog: Omit<RouterCatalog, "version">
): Promise<void> => {
  await writeCatalog(scope(baseUrl, key), RouterCatalogSchema.parse({ ...catalog, version: 1 }));
};

const Pending = new Map<string, Promise<RouterCatalog>>();

export const refreshRouterCatalog = async (
  baseUrl: string,
  key: string
): Promise<RouterCatalog> => {
  const id = JSON.stringify(scope(baseUrl, key));
  let pending = Pending.get(id);

  if (!pending) {
    pending = (async () => {
      const response = await fetch(`${baseUrl.replace(/\/+$/u, "")}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Forge Router model endpoint returned HTTP ${response.status}.`);
      }

      const router = RouterResponseSchema.parse(await response.json());
      const ids = [...new Set(router.data.map(({ id: modelID }) => modelID))];
      const data = await refreshModels(ids);
      const timestamp = new Date().toISOString();

      const catalog: RouterCatalog = {
        data,
        discoveredAt: timestamp,
        fetchedAt: timestamp,
        version: 1,
      };

      await writeRouterCatalog(baseUrl, key, catalog);

      return catalog;
    })();
    Pending.set(id, pending);
  }

  try {
    return await pending;
  } finally {
    if (Pending.get(id) === pending) {
      Pending.delete(id);
    }
  }
};
