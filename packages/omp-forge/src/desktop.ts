import { useForgeClient } from "@forge/code-client";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

import { localTimezone, readForgeUsage } from "./forge.ts";
import { mapForgeModels } from "./models.ts";

const UNAVAILABLE =
  "Forge is unavailable or returned an invalid catalog. Start Forge Desktop, then restart OMP.";

export default async function forgeDesktopPlugin(pi: ExtensionAPI) {
  let loadError: string | undefined;

  const show = (content: string): void => {
    pi.sendMessage({ content, customType: "forge", display: true }, { triggerTurn: false });
  };

  const loadModels = async (): Promise<void> => {
    const forge = await useForgeClient();

    const [providers, catalog] = await Promise.all([
      forge.providers(),
      forge.models({ tz: localTimezone() }),
    ]);

    const { options } = providers.forge;
    const models = mapForgeModels(catalog);
    pi.registerProvider("forge", {
      api: "openai-completions",
      apiKey: options.apiKey,
      // OMP appends /chat/completions itself; Forge does not use /v1.
      baseUrl: options.baseURL,
      headers: options.headers,
      models,
    });
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
  });

  try {
    await loadModels();
  } catch {
    // A missing gateway must not abort loading unrelated extensions. A fixed
    // message also avoids exposing credentials from endpoint/error payloads.
    loadError = UNAVAILABLE;
    console.error(`[forge] ${loadError}`);
  }
}
