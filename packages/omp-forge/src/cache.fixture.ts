/* oxlint-disable anti-slop/no-reflect-apply -- Exercise production factories against partial host fixtures. */
import { mock, spyOn } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import * as os from "node:os";
import path from "node:path";

import { z } from "zod";

const [host] = process.argv.slice(2);
const directory = await mkdtemp(path.join(os.tmpdir(), "forge-host-cache-"));
const baseUrl = "https://router.example/v1";
const key = "host-fixture-key";

process.env.FORGE_ROUTER_BASE_URL = baseUrl;

let generation = 1;
let offline = false;
let gate = Promise.withResolvers<undefined>();

gate.resolve(undefined);

await mkdir(path.join(directory, ".forge"));

await writeFile(path.join(directory, ".forge/server.json"), "host-fixture-session");

await mock.module("env-paths", () => ({ default: () => ({ cache: directory }) }));

await mock.module("node:os", () => ({ ...os, homedir: () => directory }));

await mock.module("@forge/code-client", () => ({
  useForgeClient: async () => {
    await gate.promise;

    if (offline) {
      throw new Error("Private desktop error");
    }

    return {
      mcp: {
        servers: async () => await Promise.resolve({ forge: { url: "http://localhost:9999/mcp" } }),
      },
      models: async () =>
        await Promise.resolve(
          generation === 3
            ? {}
            : {
                "example/chat": {
                  cost: { input: generation, output: 2 },
                  id: "example/chat",
                  limit: { context: 32_000, output: 8000 },
                  modalities: { input: ["text"], output: ["text"] },
                  name: `Desktop ${generation}`,
                  reasoning: false,
                  tool_call: true,
                },
              }
        ),
      providers: async () =>
        await Promise.resolve({ forge: { options: { baseURL: "http://localhost:9999" } } }),
    };
  },
}));

const fetcher = async (input: Parameters<typeof fetch>[0]) => {
  await gate.promise;

  if (offline) {
    throw new Error("Private router error");
  }

  const url = input instanceof Request ? input.url : input.toString();

  if (url === `${baseUrl}/models`) {
    return Response.json({ data: generation === 3 ? [] : [{ id: "example/chat" }] });
  }

  return Response.json({
    data: [
      {
        architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        context_length: 32_000,
        id: "example/chat",
        name: `Router ${generation}`,
        pricing: { completion: "0.000002", prompt: "0.000001" },
        supported_parameters: ["tools"],
        top_provider: { max_completion_tokens: 8000 },
      },
    ],
  });
};

spyOn(globalThis, "fetch").mockImplementation(
  Object.assign(fetcher, { preconnect: fetch.preconnect })
);

const catalogs = await import("@forge/models/catalogs");

await Promise.all([catalogs.refreshDesktopCatalog(), catalogs.refreshRouterCatalog(baseUrl, key)]);

gate = Promise.withResolvers<undefined>();

interface Inventory {
  models?: readonly { id: string; name?: string }[];
}

const providers = new Map<string, Inventory>();
const notifications: string[] = [];
let reloads = 0;
let publications = 0;

const context = {
  modelRegistry: {
    getApiKeyForProvider: async () => await Promise.resolve(key),
    refreshRuntimeProviders: async () => {
      reloads += 1;
      await Promise.resolve();
    },
  },
  ui: {
    notify: (text: string) => {
      notifications.push(text);
    },
  },
};

let refresh: (() => Promise<void>) | undefined;
let cleanup: (() => void) | undefined;
let ms = 0;

if (host === "omp") {
  const { default: plugin } = await import("./index.ts");

  const commands = new Map<
    string,
    { handler: (args: string, ctx: typeof context) => Promise<void> }
  >();

  const pi = {
    on: () => {
      /* Startup events remain paused while checking cached registration. */
    },
    pi: {
      discoverAuthStorage: async () =>
        await Promise.resolve({
          close: () => {
            /* The fixture owns no auth resources. */
          },
          keys: { peek: async () => await Promise.resolve(key) },
        }),
      getAgentDir: () => directory,
    },
    registerCommand: (
      name: string,
      command: { handler: (args: string, ctx: typeof context) => Promise<void> }
    ) => {
      commands.set(name, command);
    },
    registerProvider: (id: string, provider: Inventory) => {
      publications += 1;
      providers.set(id, provider);
    },
    unregisterProvider: (id: string) => {
      providers.delete(id);
    },
  };

  const start = performance.now();
  // Exercise the real extension factory with only the host methods it uses.
  await Reflect.apply(plugin, undefined, [pi]);
  ms = performance.now() - start;
  const command = commands.get("forge-refresh");

  if (!command) {
    throw new Error("OMP refresh command is missing");
  }

  refresh = async () => {
    await command.handler("", context);
  };
} else {
  const { default: plugin } = await import("../../opencode-forge/index.ts");

  let transform:
    | ((editor: {
        add: (provider: { info: { id: string }; models: Inventory["models"] }) => void;
      }) => void)
    | undefined;

  const ctx = {
    command: {
      transform: async (
        edit: (editor: {
          add: (command: {
            name: string;
            execute: (input: { sessionID: string }) => Promise<void>;
          }) => void;
        }) => void
      ) => {
        edit({
          add: (command) => {
            if (command.name === "forge:refresh") {
              refresh = async () => {
                await command.execute({ sessionID: "fixture" });
              };
            }
          },
        });
        await Promise.resolve();
      },
    },
    event: {
      async *subscribe() {
        await Promise.resolve();
        yield { type: "fixture.idle" };
      },
    },
    integration: {
      connection: {
        active: async () => await Promise.resolve({ id: "fixture" }),
        resolve: async () => await Promise.resolve({ key, type: "key" }),
      },
      transform: async () => {
        await Promise.resolve();
      },
    },
    mcp: {
      reload: async () => {
        await Promise.resolve();
      },
      transform: async () => {
        await Promise.resolve();
      },
    },
    provider: {
      reload: async () => {
        reloads += 1;
        publications += 1;
        providers.clear();
        transform?.({
          add: ({ info, models }) => {
            providers.set(info.id, { models });
          },
        });
        await Promise.resolve();
      },
      transform: async (edit: NonNullable<typeof transform>) => {
        transform = edit;
        await Promise.resolve();
      },
    },
    session: {
      synthetic: async ({ text }: { text: string }) => {
        notifications.push(text);
        await Promise.resolve();
      },
    },
  };

  const start = performance.now();
  // Exercise the real setup and transforms without starting a CLI session.
  const result: unknown = await Reflect.apply(plugin.setup, undefined, [ctx]);
  cleanup = z.function({ output: z.void() }).parse(result);
  ms = performance.now() - start;
}

try {
  const initialDesktop = providers.get("forge")?.models?.[0]?.name;
  const initialRouter = providers.get("forge-router")?.models?.[0]?.name;

  if (!refresh) {
    throw new Error("Refresh command is missing");
  }

  generation = 2;
  gate.resolve(undefined);
  await refresh();
  const updatedDesktop = providers.get("forge")?.models?.[0]?.name;
  const updatedRouter = providers.get("forge-router")?.models?.[0]?.name;
  const saved = await catalogs.readRouterCatalog(baseUrl, key);
  const published = publications;
  await refresh();
  const unchanged = publications === published;
  offline = true;
  await refresh();
  const retained = providers.get("forge-router")?.models?.[0]?.name === updatedRouter;
  const failureReported = notifications.at(-1)?.includes("failed");
  offline = false;
  generation = 3;
  await refresh();
  console.log(
    JSON.stringify({
      cleared:
        providers.get("forge")?.models?.length === 0 &&
        providers.get("forge-router")?.models?.length === 0,
      failureReported,
      initialDesktop,
      initialRouter,
      ms,
      reloads,
      retained,
      savedRouter: saved?.data[0]?.name,
      unchanged,
      updatedDesktop,
      updatedRouter,
    })
  );
} finally {
  cleanup?.();
  await rm(directory, { force: true, recursive: true });
}
