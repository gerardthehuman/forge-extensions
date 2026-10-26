import { mock } from "bun:test";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { initializeWithSettings, loadCapability } from "@oh-my-pi/pi-coding-agent/capability";
import type { MCPServer } from "@oh-my-pi/pi-coding-agent/capability/mcp";
import { Settings } from "@oh-my-pi/pi-coding-agent/config/settings";
import {
  ExtensionRuntime,
  loadExtensionFromFactory,
} from "@oh-my-pi/pi-coding-agent/extensibility/extensions/loader";
import { cfgDisabledExtensions } from "@oh-my-pi/pi-coding-agent/extensibility/settings";
import { connectToServer, disconnectServer, listTools } from "@oh-my-pi/pi-coding-agent/mcp/client";
import { loadAllMCPConfigs } from "@oh-my-pi/pi-coding-agent/mcp/config";
import { EventBus } from "@oh-my-pi/pi-coding-agent/utils/event-bus";
import { z } from "zod";

const RequestSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.object({ clientInfo: z.object({ name: z.string() }).optional() }).optional(),
});

let clientName: string | undefined;
let authorization: string | null = null;

const server = Bun.serve({
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(null, { status: 405 });
    }

    const message = RequestSchema.parse(await request.json());
    authorization = request.headers.get("authorization");

    if (message.method === "initialize") {
      clientName = message.params?.clientInfo?.name;

      return Response.json({
        id: message.id,
        jsonrpc: "2.0",
        result: {
          capabilities: { tools: {} },
          protocolVersion: "2025-03-26",
          serverInfo: { name: "forge-fixture", version: "1.0.0" },
        },
      });
    }

    if (message.method === "tools/list") {
      return Response.json({
        id: message.id,
        jsonrpc: "2.0",
        result: { tools: [{ inputSchema: { type: "object" }, name: "fixture_read" }] },
      });
    }

    return new Response(null, { status: 202 });
  },
  hostname: "127.0.0.1",
  port: 0,
});

let url = new URL("/mcp", server.url).href;
let credential = "Bearer first-fixture-credential";
let unavailable = false;
let calls = 0;

await mock.module("@forge/code-client", () => ({
  useForgeClient: async () => {
    calls += 1;

    if (unavailable) {
      throw new Error("Failure containing private-fixture-credential");
    }

    return await Promise.resolve({
      mcp: {
        servers: async () =>
          await Promise.resolve({
            forge: { headers: { Authorization: credential }, type: "remote", url },
          }),
      },
    });
  },
}));

const { registerForgeMcp } = await import("./mcp.ts");
const entrypoint = path.join(import.meta.dir, "index.ts");
const settings = Settings.isolated({ extensions: [entrypoint] });
const release = initializeWithSettings(settings);

const roots = {
  configured: [],
  configuredLevel: "user",
  explicit: [entrypoint],
  mode: "explicit-only",
} as const;

const discover = async (explicit: string[] = [entrypoint]) =>
  await loadAllMCPConfigs(process.cwd(), {
    extensionRoots: { ...roots, explicit },
  });

try {
  const factory = (pi: Parameters<typeof registerForgeMcp>[0]) => {
    registerForgeMcp(pi, pathToFileURL(entrypoint).href);
  };

  const runtime = new ExtensionRuntime();
  const events = new EventBus();
  await loadExtensionFromFactory(factory, process.cwd(), events, runtime);
  await loadExtensionFromFactory(factory, process.cwd(), events, runtime);
  const initial = await discover();
  const config = initial.configs.forge;

  if (config.type !== "http") {
    throw new Error("Forge was not discovered as native HTTP MCP");
  }

  const connection = await connectToServer("forge", config);
  let tools: string[];

  try {
    const listed = await listTools(connection);
    tools = listed.map((tool) => tool.name);
  } finally {
    await disconnectServer(connection);
  }

  const callsAfterStartup = calls;
  url = new URL("/restarted", server.url).href;
  credential = "Bearer restarted-fixture-credential";
  const refreshed = await discover();
  const refreshedConfig = refreshed.configs.forge;
  const excluded = await discover([]);
  const callsAfterExclusion = calls;
  cfgDisabledExtensions.override(settings, ["mcp:forge"]);
  const disabled = await discover();
  cfgDisabledExtensions.override(settings, []);
  unavailable = true;

  const failed = await loadCapability<MCPServer>("mcps", {
    extensionRoots: { ...roots, explicit: [entrypoint] },
  });

  console.log(
    JSON.stringify({
      authorization,
      callsAfterExclusion,
      callsAfterStartup,
      clientName,
      disabled: disabled.configs.forge === undefined,
      excluded: excluded.configs.forge === undefined,
      failureHidden: !JSON.stringify(failed).includes("private-fixture-credential"),
      failureWarning: failed.warnings.some((warning) =>
        warning.includes("Forge MCP is unavailable")
      ),
      freshCredentials:
        refreshedConfig.type === "http" && refreshedConfig.headers?.Authorization === credential,
      freshUrl: refreshedConfig.type === "http" && refreshedConfig.url === url,
      headerPolicy: config.headerPolicy,
      tools,
      unavailable: failed.items.every((item) => item.name !== "forge"),
    })
  );
} finally {
  release();
  settings.stopWatching();
  await server.stop(true);
}
