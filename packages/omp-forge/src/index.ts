import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

import forgeDesktopPlugin from "./desktop.ts";
import { registerForgeMcp } from "./mcp.ts";
import forgeRouterPlugin from "./router/index.ts";

export default async function forgePlugin(pi: ExtensionAPI) {
  registerForgeMcp(pi, import.meta.url);

  const [refreshDesktop, refreshRouter] = await Promise.all([
    forgeDesktopPlugin(pi),
    forgeRouterPlugin(pi),
  ]);

  pi.registerCommand("forge-refresh", {
    description: "Refresh Forge models and the shared cache",
    handler: async (_args, ctx) => {
      const results = await Promise.allSettled([refreshDesktop(), refreshRouter(ctx)]);
      await ctx.modelRegistry.refreshRuntimeProviders("online");
      const [desktop, router] = results;
      ctx.ui.notify(
        [
          desktop.status === "fulfilled"
            ? `Forge Desktop: ${desktop.value} models`
            : "Forge Desktop refresh failed; cached models retained.",
          router.status === "fulfilled"
            ? router.value
            : "Forge Router refresh failed; cached models retained.",
        ].join("\n"),
        results.some((result) => result.status === "rejected") ? "warning" : "info"
      );
    },
  });
}
