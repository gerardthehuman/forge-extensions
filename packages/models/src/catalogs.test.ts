import { afterEach, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

const directories: string[] = [];

const ResultSchema = z.object({
  clientCalls: z.number(),
  desktop: z.object({ models: z.record(z.string(), z.object({ name: z.string() })) }).optional(),
  failures: z.number(),
  httpCalls: z.number(),
  ms: z.number(),
  otherEndpoint: z.undefined().optional(),
  otherKey: z.undefined().optional(),
  router: z
    .object({ data: z.array(z.object({ contextWindow: z.number(), name: z.string() })) })
    .optional(),
});

const directory = async () => {
  const cache = await mkdtemp(path.join(tmpdir(), "forge-catalogs-"));
  directories.push(cache);

  return cache;
};

const run = async (cache: string, mode: string) => {
  const child = Bun.spawn(
    [process.execPath, path.join(import.meta.dir, "catalogs.fixture.ts"), cache, mode],
    {
      stderr: "pipe",
      stdout: "pipe",
    }
  );

  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);

  if (code !== 0) {
    throw new Error(`Catalog fixture failed: ${stderr}`);
  }

  return ResultSchema.parse(JSON.parse(stdout));
};

afterEach(async () => {
  await Promise.all(
    directories.splice(0).map(async (cache) => {
      await rm(cache, { force: true, recursive: true });
    })
  );
});

test("shares complete Desktop and Router catalogs across processes without any network access on read", async () => {
  const cache = await directory();
  const initial = await run(cache, "prime");
  expect(initial.failures).toBe(0);
  expect(initial.httpCalls).toBe(2);
  const saved = await run(cache, "read");
  expect(saved.desktop).toEqual(initial.desktop);
  expect(saved.router).toEqual(initial.router);
  expect(saved.clientCalls).toBe(0);
  expect(saved.httpCalls).toBe(0);
  expect(saved.otherKey).toBeUndefined();
  expect(saved.otherEndpoint).toBeUndefined();
  const files = await readdir(path.join(cache, "catalogs"));
  expect(files).toHaveLength(2);

  await Promise.all(
    files.map(async (filename) => {
      const file = path.join(cache, "catalogs", filename);
      const [metadata, contents] = await Promise.all([stat(file), readFile(file, "utf-8")]);
      expect(metadata.mode % 0o1000).toBe(0o600);
      expect(contents).not.toContain("fixture-router-key");
    })
  );
});

test("explicit refresh replaces fresh metadata and persists it for the next process", async () => {
  const cache = await directory();
  await run(cache, "prime");
  const refreshed = await run(cache, "refresh");
  expect(refreshed.desktop?.models["example/chat"].name).toBe("Desktop 2");
  expect(refreshed.router?.data[0]?.name).toBe("Router 2");
  expect(refreshed.router?.data[0]?.contextWindow).toBe(64_000);
  expect(refreshed.httpCalls).toBe(2);
  const saved = await run(cache, "read");
  expect(saved.router).toEqual(refreshed.router);
  const twice = await run(cache, "twice");
  expect(twice.router?.data[0]?.name).toBe("Router 3");
  expect(twice.httpCalls).toBe(4);
});

test("failed refreshes retain the previous complete catalogs", async () => {
  const cache = await directory();
  const initial = await run(cache, "prime");
  const failed = await run(cache, "failure");
  expect(failed.failures).toBe(2);
  expect(failed.desktop).toEqual(initial.desktop);
  expect(failed.router).toEqual(initial.router);
});

test("expired snapshots load without refreshing per-model metadata", async () => {
  const cache = await directory();
  const initial = await run(cache, "prime");
  await Promise.all(
    ["catalogs", "models"].map(async (name) => {
      const folder = path.join(cache, name);
      const files = await readdir(folder);
      await Promise.all(
        files.map(async (filename) => {
          const file = path.join(folder, filename);

          const saved = z
            .record(z.string(), z.unknown())
            .parse(JSON.parse(await readFile(file, "utf-8")));

          await writeFile(
            file,
            JSON.stringify({
              ...saved,
              fetchedAt: name === "catalogs" ? "2020-01-01T00:00:00.000Z" : 0,
            })
          );
        })
      );
    })
  );
  const saved = await run(cache, "read");
  expect(saved.desktop).toEqual(initial.desktop);
  expect(saved.router).toEqual(initial.router);
  expect(saved.httpCalls).toBe(0);
  expect(saved.clientCalls).toBe(0);
});

test("ignores corrupt snapshots without making network requests", async () => {
  const cache = await directory();
  await run(cache, "prime");
  const folder = path.join(cache, "catalogs");
  const files = await readdir(folder);
  await Promise.all(
    files.map(async (filename) => {
      await writeFile(path.join(folder, filename), "{}");
    })
  );
  const saved = await run(cache, "read");
  expect(saved.desktop).toBeUndefined();
  expect(saved.router).toBeUndefined();
  expect(saved.httpCalls).toBe(0);
  expect(saved.clientCalls).toBe(0);
});

test("empty catalogs clear removed models and a broker change invalidates Desktop credentials", async () => {
  const cache = await directory();
  await run(cache, "prime");
  const empty = await run(cache, "empty");
  expect(empty.desktop?.models).toEqual({});
  expect(empty.router?.data).toEqual([]);
  await writeFile(path.join(cache, ".forge/server.json"), "replacement-broker-session");
  const saved = await run(cache, "read");
  expect(saved.desktop).toBeUndefined();
  expect(saved.router?.data).toEqual([]);
});
