import type { Model } from "@forge/models";
import { refreshRouterCatalog } from "@forge/models/catalogs";
import type { Credential } from "@opencode/plugin";

export const routerKey = (credential: Credential.Value | undefined): string | undefined =>
  credential?.type === "key" ? credential.key : undefined;

export const discoverRouterModels = async (
  baseUrl: string,
  key: string | undefined
): Promise<Model[]> => {
  if (key === undefined || key === "") {
    throw new Error("Connect Forge Router with an API key before discovering models.");
  }

  const catalog = await refreshRouterCatalog(baseUrl, key);

  return catalog.data;
};
