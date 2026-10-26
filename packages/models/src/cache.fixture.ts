import { mock, spyOn } from "bun:test";
import { rm } from "node:fs/promises";
import path from "node:path";

const [directory, mode, ...ids] = process.argv.slice(2);

if (directory === undefined || mode === undefined) {
  throw new Error("Expected cache directory and fetch mode");
}

await mock.module("env-paths", () => ({ default: () => ({ cache: directory }) }));

const { createModel } = await import("./index.ts");
let calls = 0;

const fetcher: typeof fetch = Object.assign(
  async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
    calls += 1;

    const url = input instanceof Request ? input.url : input.toString();

    if (
      url !== "https://openrouter.ai/api/v1/models?output_modalities=all" ||
      init?.headers !== undefined
    ) {
      throw new Error("Unexpected request or forwarded credentials");
    }

    if (mode === "offline") {
      throw new Error("Offline");
    }

    const data =
      mode === "missing"
        ? []
        : ids.map((id) => ({
            architecture: { input_modalities: ["text", "image"], output_modalities: ["text"] },
            context_length: 32_000,
            id,
            pricing: {
              completion: "0.000002",
              prompt: mode === "invalid" ? "invalid" : "0.000001",
            },
            supported_parameters: ["tools"],
            top_provider: { max_completion_tokens: 8000 },
          }));

    return await Promise.resolve(Response.json({ data }));
  },
  { preconnect: fetch.preconnect }
);

spyOn(globalThis, "fetch").mockImplementation(fetcher);

let fetchedAt: number | undefined;

try {
  if (mode === "retry") {
    let failed = false;

    try {
      await createModel(ids[0] ?? "example/chat");
    } catch {
      failed = true;
    }

    if (!failed) {
      throw new Error("Expected initial cache write failure");
    }

    await rm(directory, { force: true });
  }

  if (mode === "aged") {
    fetchedAt = Date.now();
    spyOn(Date, "now").mockReturnValue(fetchedAt);
    await createModel(ids[0] ?? "example/first");
    const later = fetchedAt + 23 * 60 * 60 * 1000;
    spyOn(Date, "now").mockReturnValue(later);
  }

  const models = await Promise.all(ids.map(async (id) => await createModel(id)));
  console.log(
    JSON.stringify({
      cacheDirectory: path.join(directory, "models"),
      calls,
      fetchedAt,
      models,
    })
  );
} catch (error) {
  console.log(
    JSON.stringify({
      cacheDirectory: path.join(directory, "models"),
      calls,
      error: error instanceof Error ? error.message : String(error),
      models: [],
    })
  );
  process.exitCode = 1;
}
