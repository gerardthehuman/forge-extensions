import path from "node:path";
import { fileURLToPath } from "node:url";

import { useForgeClient } from "@forge/code-client";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { getCapability, registerProvider } from "@oh-my-pi/pi-coding-agent/capability";
import { mcpCapability } from "@oh-my-pi/pi-coding-agent/capability/mcp";
import type { MCPServer } from "@oh-my-pi/pi-coding-agent/capability/mcp";
import { findScopedSettings } from "@oh-my-pi/pi-coding-agent/config/settings";

import { McpEndpointSchema } from "./mcp-config.ts";

export const registerForgeMcp = (pi: ExtensionAPI, entrypoint: string): void => {
  const source = fileURLToPath(entrypoint);
  const id = `forge-mcp:${source}`;

  // Capability providers live for the process; extension factories also run on reload.
  if (
    getCapability<MCPServer>(mcpCapability.id)?.providers.some((provider) => provider.id === id) ===
    true
  ) {
    return;
  }

  registerProvider<MCPServer>(mcpCapability.id, {
    description: "Discover Forge Desktop's HTTP MCP endpoint",
    displayName: "Forge",
    id,
    load: async (ctx) => {
      const settings = findScopedSettings(ctx.cwd, ctx.agentDir);

      if (!settings) {
        return { items: [] };
      }

      // A process can host multiple sessions or unload this extension. Contribute
      // only where the host still discovers this entrypoint as an active extension.
      const roots = ctx.extensionRoots;

      const extensions = await pi.pi.discoverSessionExtensionPaths(
        roots === undefined ? {} : { extensionRoots: () => roots },
        ctx.cwd,
        settings
      );

      if (!extensions.some((extension) => path.resolve(ctx.cwd, extension) === source)) {
        return { items: [] };
      }

      try {
        const forge = await useForgeClient();
        const { url, headers } = McpEndpointSchema.parse(await forge.mcp.servers());

        return {
          items: [
            {
              _source: { level: "user", path: source, provider: id, providerName: "Forge" },
              headerPolicy: "origin-locked",
              headers,
              name: "forge",
              transport: "http",
              url: url.href,
            },
          ],
        };
      } catch {
        // SDK and HTTP errors can contain credentials or response bodies.
        return {
          items: [],
          warnings: ["Forge MCP is unavailable. Start Forge Desktop, then restart OMP."],
        };
      }
    },
    priority: 50,
  });
};
