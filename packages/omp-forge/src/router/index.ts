import path from "node:path";

import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

import {
  discoverCatalog,
  fetchRouterCatalog,
  readStartupCatalog,
  writeStartupCatalog,
} from "./catalog.ts";
import type { DiscoveredCatalog } from "./catalog.ts";
import { mapOpenRouterModels } from "./models.ts";

const PROVIDER = "forge-router";
const DEFAULT_BASE_URL = "https://forge.forgeworkspace.dev/functions/v1/forge-api/v1";

const forgeRouterPlugin = async (pi: ExtensionAPI) => {
  const configuredUrl = process.env.FORGE_ROUTER_BASE_URL;

  const baseUrl = (
    configuredUrl === undefined || configuredUrl === "" ? DEFAULT_BASE_URL : configuredUrl
  ).replace(/\/+$/u, "");

  const cacheDirectory = path.join(pi.pi.getAgentDir(), "cache", "forge-router");
  const auth = await pi.pi.discoverAuthStorage(pi.pi.getAgentDir());
  let startupKey: string | undefined;

  try {
    startupKey = await auth.keys.peek(PROVIDER);
  } finally {
    auth.close();
  }

  let catalog =
    startupKey !== undefined && startupKey !== ""
      ? await readStartupCatalog(cacheDirectory, baseUrl, startupKey)
      : undefined;

  let registered = false;
  let refresh: Promise<void> | undefined;

  const register = (discover: (key: string | undefined) => Promise<DiscoveredCatalog>) => {
    // Replacing the provider also clears removed and empty static catalogs.
    if (registered) {
      pi.unregisterProvider(PROVIDER);
    }

    pi.registerProvider(PROVIDER, {
      api: "openai-completions",
      authHeader: true,
      baseUrl,
      // Native discovery publishes this snapshot authoritatively, including empty catalogs.
      fetchDynamicModels: async () =>
        await Promise.resolve(catalog ? mapOpenRouterModels(catalog.data) : []),
      models: catalog ? mapOpenRouterModels(catalog.data) : [],
      oauth: {
        async login(callbacks) {
          const key = await callbacks.onPrompt({
            message: `Forge Router API key for ${baseUrl}`,
            secret: true,
          });

          if (key?.trim() === undefined || key.trim() === "") {
            throw new Error("Forge Router login cancelled: no API key supplied.");
          }

          await fetchRouterCatalog(baseUrl, key, {
            fetcher: callbacks.fetch ?? fetch,
            signal: callbacks.signal,
          });
          await discover(key);

          // A string tells native /login to persist an API-key credential.
          return key;
        },
        name: "Forge Router (API key)",
      },
    });
    registered = true;
  };

  const discover = async (key: string | undefined) => {
    if (key === undefined || key === "") {
      throw new Error("Log in to Forge Router with /login before discovering models.");
    }

    const updated = await discoverCatalog(baseUrl, key);
    await writeStartupCatalog(cacheDirectory, baseUrl, key, updated);
    catalog = updated;
    register(discover);

    return updated;
  };

  // Without a snapshot, discover before OMP resolves its configured default.
  if (!catalog && startupKey !== undefined && startupKey !== "") {
    try {
      await discover(startupKey);
    } catch {
      // Startup remains usable offline; the session refresh reports discovery errors.
    }
  }

  if (!registered) {
    register(discover);
  }

  pi.on("session_start", (_event, ctx) => {
    ctx.setTimeout(() => {
      refresh ??= (async () => {
        try {
          // Replace any older native discovery cache with the startup snapshot first.
          await ctx.modelRegistry.refreshRuntimeProviders("online");

          const key = await ctx.modelRegistry.getApiKeyForProvider(PROVIDER, undefined, {
            baseUrl,
          });

          if (key !== undefined && key !== "") {
            await discover(key);
            await ctx.modelRegistry.refreshRuntimeProviders("online");
          }
        } catch (error) {
          ctx.ui.notify(
            `Forge Router refresh failed; cached models retained: ${error instanceof Error ? error.message : String(error)}`,
            "warning"
          );
        } finally {
          refresh = undefined;
        }
      })();
    }, 0);
  });
};

export default forgeRouterPlugin;
