import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

import forgeDesktopPlugin from "./desktop.ts";
import { registerForgeMcp } from "./mcp.ts";
import forgeRouterPlugin from "./router/index.ts";

export default async function forgePlugin(pi: ExtensionAPI) {
  registerForgeMcp(pi, import.meta.url);

  await Promise.all([forgeDesktopPlugin(pi), forgeRouterPlugin(pi)]);
}
