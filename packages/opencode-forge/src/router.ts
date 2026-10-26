import { createModel } from "@forge/models";
import type { Model } from "@forge/models";
import type { Credential } from "@opencode/plugin";
import { z } from "zod";

const RouterCatalogSchema = z.object({ data: z.array(z.object({ id: z.string().min(1) })) });

type RouterCatalog = z.infer<typeof RouterCatalogSchema>;

export const routerKey = (credential: Credential.Value | undefined): string | undefined =>
  credential?.type === "key" ? credential.key : undefined;

export const fetchRouterCatalog = async (
  baseUrl: string,
  key: string | undefined
): Promise<RouterCatalog> => {
  if (key === undefined || key === "") {
    throw new Error("Connect Forge Router with an API key before discovering models.");
  }

  let response;

  try {
    response = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
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

export const discoverRouterModels = async (
  baseUrl: string,
  key: string | undefined
): Promise<Model[]> => {
  const router = await fetchRouterCatalog(baseUrl, key);
  const ids = [...new Set(router.data.map((model) => model.id))];

  return await Promise.all(ids.map(async (id) => await createModel(id)));
};
