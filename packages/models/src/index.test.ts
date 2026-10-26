import { afterEach, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import { ModelSchema } from "./model.ts";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(
    directories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    })
  );
});

const directory = async () => {
  const cache = await mkdtemp(path.join(tmpdir(), "forge-models-"));
  directories.push(cache);

  return cache;
};

const ResultSchema = z.object({
  cacheDirectory: z.string(),
  calls: z.number(),
  error: z.string().optional(),
  fetchedAt: z.number().optional(),
  models: z.array(ModelSchema),
});

const CacheEntrySchema = z.object({ fetchedAt: z.number(), model: ModelSchema });

type Result = z.infer<typeof ResultSchema>;

const run = async (
  cache: string,
  mode: string,
  ids = ["example/chat"]
): Promise<Result & { code: number }> => {
  const child = Bun.spawn(
    [process.execPath, path.join(import.meta.dir, "cache.fixture.ts"), cache, mode, ...ids],
    { stderr: "pipe", stdout: "pipe" }
  );

  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);

  const result = ResultSchema.safeParse(JSON.parse(stdout));

  if (!result.success) {
    throw new Error(`Invalid fixture output: ${stdout}\n${stderr}`);
  }

  return { ...result.data, code };
};

const cacheEntries = async (cacheDirectory: string) => {
  const files = await readdir(cacheDirectory);

  return await Promise.all(
    files.map(async (filename) => {
      const file = path.join(cacheDirectory, filename);
      const entry = CacheEntrySchema.parse(JSON.parse(await readFile(file, "utf-8")));

      return { entry, file };
    })
  );
};

test("persists normalized metadata as JSON files shared across processes", async () => {
  const cache = await directory();
  const online = await run(cache, "online");
  expect(online.code).toBe(0);
  expect(online.calls).toBe(1);
  expect(online.cacheDirectory).toBe(path.join(cache, "models"));
  const offline = await run(cache, "offline");
  expect(offline.code).toBe(0);
  expect(offline.calls).toBe(0);
  expect(offline.models).toEqual(online.models);
  const entries = await cacheEntries(online.cacheDirectory);
  expect(entries).toHaveLength(1);
  expect(entries[0].entry.model).toEqual(online.models[0]);
  expect(entries[0].file.endsWith(".json")).toBe(true);
});

test("shares an upstream request across concurrent IDs and keeps normalized-key collisions distinct", async () => {
  const ids = ["example/first", "example/second:free", "example/second/free", "example/first"];
  const result = await run(await directory(), "online", ids);
  expect(result.code).toBe(0);
  expect(result.calls).toBe(1);
  expect(result.models.map((model) => model.id)).toEqual(ids);
  const persisted = await cacheEntries(result.cacheDirectory);
  expect(persisted.map(({ entry }) => entry.model.id).toSorted()).toEqual([
    "example/first",
    "example/second/free",
    "example/second:free",
  ]);
});

test("keeps entries intact when separate processes write overlapping model catalogs", async () => {
  const cache = await directory();

  const writers = await Promise.all([
    run(cache, "online", ["example/shared", "example/first"]),
    run(cache, "online", ["example/shared", "example/second"]),
  ]);

  expect(writers.map(({ code }) => code)).toEqual([0, 0]);
  const ids = ["example/shared", "example/first", "example/second"];
  const offline = await run(cache, "offline", ids);
  expect(offline.code).toBe(0);
  expect(offline.calls).toBe(0);
  expect(offline.models.map(({ id }) => id)).toEqual(ids);
  expect(await readdir(offline.cacheDirectory)).toHaveLength(3);
});

test("refreshes expired metadata, retains stale metadata offline, and replaces corrupt entries", async () => {
  const cache = await directory();
  const original = await run(cache, "online");
  const [{ entry, file }] = await cacheEntries(original.cacheDirectory);
  await writeFile(file, JSON.stringify({ ...entry, fetchedAt: 0 }));
  const offline = await run(cache, "offline");
  expect(offline.code).toBe(0);
  expect(offline.calls).toBe(1);
  expect(offline.models).toEqual(original.models);
  const refreshed = await run(cache, "online");
  expect(refreshed.code).toBe(0);
  expect(refreshed.calls).toBe(1);
  await writeFile(file, "{}");
  const repaired = await run(cache, "online");
  expect(repaired.code).toBe(0);
  expect(repaired.calls).toBe(1);
  expect(repaired.models).toEqual(original.models);
});

test("reports missing models and invalid pricing without caching failures", async () => {
  const cache = await directory();
  const missing = await run(cache, "missing");
  expect(missing.code).toBe(1);
  expect(missing.error).toContain("missing from OpenRouter metadata");
  const invalid = await run(cache, "invalid");
  expect(invalid.code).toBe(1);
  expect(invalid.error).toContain("Invalid OpenRouter price");
  const offline = await run(cache, "offline");
  expect(offline.code).toBe(1);
  expect(offline.error).toBe("Offline");
});

test("recovers after a blocked cache directory becomes writable", async () => {
  const cache = await directory();
  const blocked = path.join(cache, "blocked");
  await writeFile(blocked, "not a directory");
  const result = await run(blocked, "retry");
  expect(result.code).toBe(0);
  expect(result.calls).toBe(1);
  expect(result.models.map((model) => model.id)).toEqual(["example/chat"]);
});

test("retains the upstream fetch timestamp when another model uses the in-memory catalog", async () => {
  const result = await run(await directory(), "aged", ["example/first", "example/second"]);
  expect(result.code).toBe(0);
  expect(result.calls).toBe(1);
  const entries = await cacheEntries(result.cacheDirectory);
  const fetchedAt = z.number().parse(result.fetchedAt);
  expect(entries.map(({ entry }) => entry.fetchedAt)).toEqual([fetchedAt, fetchedAt]);
});

test("strips provider prefixes from fresh and stale cached models", async () => {
  const cache = await directory();
  const original = await run(cache, "online");
  const [{ entry, file }] = await cacheEntries(original.cacheDirectory);
  const prefixed = { ...entry, model: { ...entry.model, name: "OpenAI: Cached Chat" } };
  await writeFile(file, JSON.stringify(prefixed));
  const fresh = await run(cache, "offline");
  expect(fresh.code).toBe(0);
  expect(fresh.calls).toBe(0);
  expect(fresh.models).toEqual([{ ...original.models[0], name: "Cached Chat" }]);
  await writeFile(file, JSON.stringify({ ...prefixed, fetchedAt: 0 }));
  const stale = await run(cache, "offline");
  expect(stale.code).toBe(0);
  expect(stale.calls).toBe(1);
  expect(stale.models).toEqual(fresh.models);
});
