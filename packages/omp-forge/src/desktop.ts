import { readDesktopCatalog, refreshDesktopCatalog } from "@forge/models/catalogs";
import type { DesktopCatalog } from "@forge/models/catalogs";
import { readForgeUsage } from "@forge/models/usage";
import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";

import { mapForgeModels } from "./models.ts";

const UNAVAILABLE =
  "Forge is unavailable or returned an invalid catalog. Start Forge Desktop, then restart OMP.";

export default async function forgeDesktopPlugin(pi: ExtensionAPI) {
  let loadError: string | undefined;
  let registered = false;
  let signature: string | undefined;
  let cached = false;

  const show = (content: string): void => {
    pi.sendMessage({ content, customType: "forge", display: true }, { triggerTurn: false });
  };

  const register = ({ options, models: catalog }: DesktopCatalog): number => {
    const models = mapForgeModels(catalog);
    const updated = JSON.stringify({ catalog, options });

    if (signature === updated) {
      return models.length;
    }

    if (registered) {
      pi.unregisterProvider("forge");
    }

    pi.registerProvider("forge", {
      api: "openai-completions",
      apiKey: options.apiKey,
      // OMP appends /chat/completions itself; Forge does not use /v1.
      baseUrl: options.baseURL,
      fetchDynamicModels: async () => await Promise.resolve(models),
      headers: options.headers,
      models,
    });
    registered = true;
    signature = updated;
    loadError = undefined;

    return models.length;
  };

  const refresh = async () => register(await refreshDesktopCatalog());

  const update = async (ctx: ExtensionContext) => {
    await refresh();
    await ctx.modelRegistry.refreshRuntimeProviders("online");
  };

  pi.registerCommand("forge", {
    description: "Forge: /forge usage",
    handler: async (args) => {
      const [command, ...rest] = args.trim().split(/\s+/u);

      if (command === "usage" && rest.length === 0) {
        try {
          show(await readForgeUsage());
        } catch {
          show(
            "Forge balance unavailable. Start Forge Desktop and wait for its usage snapshot, then run /forge usage again."
          );
        }

        return;
      }

      show("Usage: /forge usage");
    },
  });

  pi.on("session_start", (_event, ctx) => {
    if (loadError !== undefined) {
      ctx.ui.notify(loadError, "error");
    }

    if (cached) {
      ctx.setTimeout(() => {
        update(ctx).catch(() => {
          ctx.ui.notify("Forge refresh failed; cached models retained.", "warning");
        });
      }, 0);
    }
  });

  try {
    const catalog = await readDesktopCatalog();
    cached = catalog !== undefined;
    register(catalog ?? (await refreshDesktopCatalog()));
  } catch {
    // A missing gateway must not abort loading unrelated extensions. A fixed
    // message also avoids exposing credentials from endpoint/error payloads.
    loadError = UNAVAILABLE;
    console.error(`[forge] ${loadError}`);
  }

  return refresh;
}
