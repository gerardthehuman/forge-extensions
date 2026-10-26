import { mock, spyOn } from "bun:test";
import { mkdir, writeFile } from "node:fs/promises";
import * as os from "node:os";
import path from "node:path";

const [directory, mode] = process.argv.slice(2);

if (directory === undefined || mode === undefined) {
  throw new Error("Expected a cache directory and scenario");
}

const baseUrl = "https://router.example/v1";
const key = "fixture-router-key";
let generation = mode === "refresh" ? 2 : 1;
let httpCalls = 0;
let clientCalls = 0;
const offline = mode === "read" || mode === "failure";

await mock.module("env-paths", () => ({ default: () => ({ cache: directory }) }));

await mock.module("node:os", () => ({ ...os, homedir: () => directory }));

await mock.module("@forge/code-client", () => ({
  useForgeClient: async () => {
    clientCalls += 1;

    if (offline) {
      throw new Error("Offline");
    }

    return await Promise.resolve({
      models: async () =>
        await Promise.resolve(
          mode === "empty"
            ? {}
            : {
                "example/chat": {
                  cost: { input: generation, output: generation * 2 },
                  id: "example/chat",
                  limit: { context: generation * 32_000, output: 8000 },
                  modalities: { input: ["text"], output: ["text"] },
                  name: `Desktop ${generation}`,
                  reasoning: false,
                  tool_call: true,
                },
              }
        ),
      providers: async () =>
        await Promise.resolve({
          forge: { options: { apiKey: "fixture-desktop-key", baseURL: "http://localhost:9999" } },
        }),
    });
  },
}));

const fetcher = async (input: Parameters<typeof fetch>[0]) => {
  httpCalls += 1;

  if (offline) {
    throw new Error("Offline");
  }

  const url = input instanceof Request ? input.url : input.toString();

  if (url === `${baseUrl}/models`) {
    return await Promise.resolve(
      Response.json({ data: mode === "empty" ? [] : [{ id: "example/chat" }] })
    );
  }

  return await Promise.resolve(
    Response.json({
      data: [
        {
          architecture: { input_modalities: ["text"], output_modalities: ["text"] },
          context_length: generation * 32_000,
          id: "example/chat",
          name: `Router ${generation}`,
          pricing: {
            completion: String(generation * 0.000002),
            prompt: String(generation * 0.000001),
          },
          supported_parameters: ["tools"],
          top_provider: { max_completion_tokens: 8000 },
        },
      ],
    })
  );
};

spyOn(globalThis, "fetch").mockImplementation(
  Object.assign(fetcher, { preconnect: fetch.preconnect })
);

const catalogs = await import("./catalogs.ts");

if (mode === "prime") {
  await mkdir(path.join(directory, ".forge"), { recursive: true });
  await writeFile(path.join(directory, ".forge/server.json"), "fixture-broker-session");
}

let failures = 0;

if (mode !== "read") {
  const results = await Promise.allSettled([
    catalogs.refreshDesktopCatalog(),
    catalogs.refreshRouterCatalog(baseUrl, key),
  ]);

  failures = results.filter((result) => result.status === "rejected").length;
}

if (mode === "twice") {
  generation = 3;
  await Promise.all([
    catalogs.refreshDesktopCatalog(),
    catalogs.refreshRouterCatalog(baseUrl, key),
  ]);
}

const start = performance.now();

const [desktop, router] = await Promise.all([
  catalogs.readDesktopCatalog(),
  catalogs.readRouterCatalog(baseUrl, key),
]);

const ms = performance.now() - start;
const otherKey = await catalogs.readRouterCatalog(baseUrl, "another-key");
const otherEndpoint = await catalogs.readRouterCatalog("https://another.example", key);

console.log(
  JSON.stringify({ clientCalls, desktop, failures, httpCalls, ms, otherEndpoint, otherKey, router })
);
