import { watch } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { useForgeClient } from "@forge/code-client";
import {
  readDesktopCatalog,
  readRouterCatalog,
  refreshDesktopCatalog,
} from "@forge/models/catalogs";
import type { DesktopCatalog } from "@forge/models/catalogs";
import { Plugin, Integration } from "@opencode/plugin";
import type { Model } from "@opencode/plugin";
import { Provider } from "@opencode/schema/provider";

import { billingAccount, billingNotice, registerBilling, usageMessage } from "./src/billing.ts";
import { forgeModels } from "./src/forge-models.ts";
import { registerResponses } from "./src/responses.ts";
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

const reportRouterError = (cause: unknown) => {
  console.error(`[forge-router] ${message(cause)}`);
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

    let routerConnection: Awaited<ReturnType<typeof ctx.integration.connection.active>>;

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

      editor.add({
        info: routerProviderInfo(),
        models: state.routerModels ?? [],
        sourceConnection: routerConnection,
      });
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

    let desktopCached = false;
    let routerCached = false;
    let forgeSignature: string | undefined;

    const publishForge = async ({ options, models }: DesktopCatalog) => {
      const signature = JSON.stringify({ models, options });

      if (forgeSignature === signature) {
        return state.forge?.models.length ?? 0;
      }

      state.forge = {
        info: providerInfo(forgeProviderID, {
          activation: "enabled",
          headers: options.headers,
          name: "Forge",
          package: OPENAI_COMPATIBLE_PACKAGE,
          settings: { apiKey: options.apiKey, baseURL: options.baseURL },
        }),
        models: forgeModels(models, forgeProviderID),
      };
      await ctx.provider.reload();
      forgeSignature = signature;

      return state.forge.models.length;
    };

    const refreshForge = async () => await publishForge(await refreshDesktopCatalog());

    const loadForge = async () => {
      try {
        const catalog = await readDesktopCatalog();
        desktopCached = catalog !== undefined;
        await publishForge(catalog ?? (await refreshDesktopCatalog()));
      } catch {
        console.error("[forge] Forge is unavailable; cached models retained.");
      }
    };

    const refreshMcp = async () => {
      const forge = await useForgeClient();
      const mcp = await forge.mcp.servers();
      const url = new URL(mcp.forge.url);
      // An empty skills value allows all skills; an empty CSV list selects none.
      url.searchParams.set("skills", ",");
      state.forgeMcp = { headers: mcp.forge.headers, url: url.href };
      await ctx.mcp.reload();
    };

    const loadRouter = async (force: boolean) => {
      const connection = await ctx.integration.connection.active(ROUTER_ID);

      const key = routerKey(
        connection ? await ctx.integration.connection.resolve(connection) : undefined
      );

      if (key === undefined || key === "") {
        routerConnection = undefined;
        state.routerKey = undefined;
        state.routerModels = undefined;
        await ctx.provider.reload();

        return;
      }

      if (!force && key === state.routerKey) {
        return;
      }

      // Never publish one connection's inventory while another connection is loading.
      if (key !== state.routerKey && state.routerKey !== undefined) {
        state.routerModels = undefined;
        state.routerKey = undefined;
        await ctx.provider.reload();
      }

      const catalog = force ? undefined : await readRouterCatalog(baseUrl, key);
      routerCached = catalog !== undefined;
      const discovered = catalog?.data ?? (await discoverRouterModels(baseUrl, key));
      const models = routerModels(discovered, routerProviderID);

      const changed =
        key !== state.routerKey ||
        JSON.stringify(models) !== JSON.stringify(state.routerModels) ||
        JSON.stringify(connection) !== JSON.stringify(routerConnection);

      state.routerModels = models;
      routerConnection = connection;
      state.routerKey = key;

      if (changed) {
        await ctx.provider.reload();
      }
    };

    let routerRefresh: Promise<void> | undefined;

    const refreshRouter = async (force = false) => {
      if (routerRefresh !== undefined) {
        try {
          await routerRefresh;
        } catch {
          // Recheck the active connection even if the preceding refresh failed.
        }
      }

      routerRefresh ??= loadRouter(force);
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
          refreshMcp().catch(reportForgeError);
        }, 500);
      });
    } catch (error) {
      console.error(`[forge] Could not watch ${serverFile}: ${message(error)}`);
    }

    const controller = new AbortController();

    await registerBilling(ctx);
    await registerResponses(ctx, controller.signal);

    const observeIntegrationChanges = async () => {
      for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
        if (
          event.type === "integration.updated" ||
          event.type === "credential.updated" ||
          event.type === "credential.switched"
        ) {
          await refreshRouter().catch(reportRouterError);
        }
      }
    };

    observeIntegrationChanges().catch(reportEventError);

    await ctx.command.transform((editor) => {
      editor.add({
        description: "Show the current Forge billing account and available budget",
        execute: async ({ sessionID }) => {
          let text: string;

          try {
            text = usageMessage(await billingAccount(ctx, await useForgeClient(), sessionID));
          } catch {
            text =
              "Forge balance unavailable. Start Forge Desktop and wait for its usage snapshot, then run /forge:usage again.";
          }

          await billingNotice(ctx, sessionID, text);
        },
        name: "forge:usage",
      });
      editor.add({
        description: "Refresh Forge models and the shared cache",
        execute: async ({ sessionID }) => {
          const results = await Promise.allSettled([refreshForge(), refreshRouter(true)]);
          const [desktop, router] = results;
          let routerMessage = "Forge Router: not connected";

          if (router.status === "rejected") {
            routerMessage = "Forge Router refresh failed; cached models retained.";
          } else if (state.routerKey !== undefined) {
            routerMessage = `Forge Router: ${state.routerModels?.length ?? 0} models`;
          }

          const text = [
            desktop.status === "fulfilled"
              ? `Forge Desktop: ${desktop.value} models`
              : "Forge Desktop refresh failed; cached models retained.",
            routerMessage,
          ].join("\n");

          await ctx.session.synthetic({ description: text, resume: false, sessionID, text });
        },
        name: "forge:refresh",
      });
    });

    // Await the local snapshots so early sessions see the registered models.
    await Promise.all([loadForge(), refreshRouter().catch(reportRouterError)]);

    if (desktopCached) {
      refreshForge().catch(reportForgeError);
    }

    if (routerCached) {
      refreshRouter(true).catch(reportRouterError);
    }

    refreshMcp().catch(reportForgeError);

    return () => {
      controller.abort();
      clearTimeout(refreshTimer);
      watcher?.close();
    };
  },
});
