import { watch } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { useForgeClient } from "@forge/code-client";
import { Plugin, Integration } from "@opencode/plugin";
import type { Model } from "@opencode/plugin";
import { Provider } from "@opencode/schema/provider";

import { forgeModels } from "./src/forge-models.ts";
import { routerModels } from "./src/router-models.ts";
import { discoverRouterModels, routerKey } from "./src/router.ts";

const serverFile = path.join(homedir(), ".forge", "server.json");
const ROUTER_ID = "forge-router";

// Matches the Forge Router endpoint the OMP plugin uses.
const DEFAULT_ROUTER_BASE_URL = "https://forge.forgeworkspace.dev/functions/v1/forge-api/v1";
const OPENAI_COMPATIBLE_PACKAGE = "@opencode/ai/providers/openai-compatible";

const ROUTER_COMPATIBILITY = { maxTokensField: "max_tokens", streamUsage: true } as const;

// Provider.Info.empty returns a class instance; Object.assign keeps its prototype intact.
const providerInfo = (id: Provider.ID, fields: Partial<Provider.Info>): Provider.Info =>
  Object.assign(Provider.Info.empty(id), fields);

const message = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

const reportForgeError = (cause: unknown) => {
  console.error(`[forge] ${message(cause)}`);
};

const reportEventError = (cause: unknown) => {
  console.error(`[forge-router] Event stream failed: ${message(cause)}`);
};

interface PluginState {
  forge: { info: Provider.Info; models: Model.Info[] } | undefined;
  forgeMcp: { url: string; headers?: Record<string, string> } | undefined;
  routerKey: string | undefined;
  routerModels: Model.Info[] | undefined;
}

export default Plugin.define({
  id: "forge",
  async setup(ctx) {
    const configuredUrl = process.env.FORGE_ROUTER_BASE_URL;

    const baseUrl = (
      configuredUrl === undefined || configuredUrl === "" ? DEFAULT_ROUTER_BASE_URL : configuredUrl
    ).replace(/\/+$/u, "");

    const forgeProviderID = Provider.ID.make("forge");
    const routerProviderID = Provider.ID.make(ROUTER_ID);

    const state: PluginState = {
      forge: undefined,
      forgeMcp: undefined,
      routerKey: undefined,
      routerModels: undefined,
    };

    const routerProviderInfo = (): Provider.Info =>
      providerInfo(routerProviderID, {
        activation: "enabled",
        compatibility: ROUTER_COMPATIBILITY,
        integrationID: Integration.ID.make(ROUTER_ID),
        name: "Forge Router",
        package: OPENAI_COMPATIBLE_PACKAGE,
        settings: { baseURL: baseUrl },
      });

    await ctx.provider.transform((editor) => {
      if (state.forge) {
        editor.add(state.forge);
      }

      editor.add({ info: routerProviderInfo(), models: state.routerModels ?? [] });
    });

    await ctx.mcp.transform((editor) => {
      if (state.forgeMcp) {
        editor.set("forge", {
          headers: state.forgeMcp.headers,
          type: "remote",
          url: state.forgeMcp.url,
        });
      }
    });

    await ctx.integration.transform((editor) => {
      editor.update(ROUTER_ID, (integration) => {
        integration.name = "Forge Router";
      });
      editor.method.update({
        integrationID: ROUTER_ID,
        method: { label: "Forge Router API key", type: "key" },
      });
    });

    // A missing or restarted Forge must not abort loading other plugins, and a
    // transient refresh failure must not drop a provider that worked moments ago.
    const refreshForge = async () => {
      try {
        const forge = await useForgeClient();
        // Forge budget days follow local midnight, not UTC.
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

        const [providers, catalog, mcp] = await Promise.all([
          forge.providers(),
          forge.models({ tz }),
          forge.mcp.servers(),
        ]);

        const { options } = providers.forge;
        state.forge = {
          info: providerInfo(forgeProviderID, {
            activation: "enabled",
            headers: options.headers,
            name: "Forge",
            package: OPENAI_COMPATIBLE_PACKAGE,
            settings: { apiKey: options.apiKey, baseURL: options.baseURL },
          }),
          models: forgeModels(catalog, forgeProviderID),
        };
        state.forgeMcp = { headers: mcp.forge.headers, url: mcp.forge.url };
      } catch (error) {
        if (!state.forge) {
          console.error(`[forge] Forge is unavailable: ${message(error)}`);
        }
      }

      await ctx.provider.reload();

      await ctx.mcp.reload();
    };

    const loadRouter = async () => {
      const connection = await ctx.integration.connection.active(ROUTER_ID);

      const key = routerKey(
        connection ? await ctx.integration.connection.resolve(connection) : undefined
      );

      if (key === undefined || key === "" || key === state.routerKey) {
        return;
      }

      try {
        const discovered = await discoverRouterModels(baseUrl, key);
        state.routerModels = routerModels(discovered, routerProviderID);
        state.routerKey = key;
        await ctx.provider.reload();
      } catch (error) {
        console.error(`[forge-router] ${message(error)}`);
      }
    };

    let routerRefresh: Promise<void> | undefined;

    const refreshRouter = async () => {
      if (routerRefresh !== undefined) {
        await routerRefresh;
      }

      routerRefresh ??= loadRouter();
      const pending = routerRefresh;

      try {
        await pending;
      } finally {
        if (routerRefresh === pending) {
          routerRefresh = undefined;
        }
      }
    };

    // Forge Desktop rewrites server.json when the broker restarts.
    let watcher: ReturnType<typeof watch> | undefined;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      watcher = watch(serverFile, () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          refreshForge().catch(reportForgeError);
        }, 500);
      });
    } catch (error) {
      console.error(`[forge] Could not watch ${serverFile}: ${message(error)}`);
    }

    const controller = new AbortController();

    const observeIntegrationChanges = async () => {
      for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
        if (
          event.type === "integration.updated" ||
          event.type === "credential.updated" ||
          event.type === "credential.switched"
        ) {
          await refreshRouter();
        }
      }
    };

    observeIntegrationChanges().catch(reportEventError);

    const refreshProviders = async () => {
      await Promise.all([refreshForge(), refreshRouter()]);
    };

    refreshProviders().catch(reportForgeError);

    return () => {
      controller.abort();
      clearTimeout(refreshTimer);
      watcher?.close();
    };
  },
});
