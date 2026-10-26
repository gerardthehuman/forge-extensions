import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import * as models from "@forge/models";
import type { Model } from "@forge/models";

import { fetchRouterCatalog, readStartupCatalog, writeStartupCatalog } from "./catalog.ts";
import type { DiscoveredCatalog } from "./catalog.ts";

const baseUrl = "https://router.example/api/v1";
const key = "private-router-credential";
const directories: string[] = [];

afterEach(async () => {
  mock.restore();
  await Promise.all(
    directories.splice(0).map(async (directory) => {
      await rm(directory, { force: true, recursive: true });
    })
  );
});

const cacheDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-router-catalog-"));
  directories.push(directory);

  return directory;
};

const model = (id = "example/chat"): Model => ({
  contextWindow: 1_000_000,
  cost: {
    cacheRead: 0.2,
    cacheWrite: 0,
    input: 2,
    output: 10,
    tiers: [{ cacheRead: 0.2, cacheWrite: 0, input: 4, inputThreshold: 200_000, output: 10 }],
  },
  efforts: ["low", "high"],
  id,
  input: ["text", "image", "audio"],
  maxTokens: 128_000,
  name: "Reasoner",
  output: ["text"],
  reasoning: true,
  supportsTools: true,
});

const mediaModel = (id: string, output: string): Model => ({
  efforts: [],
  id,
  input: [],
  name: "Media",
  output: [output],
  reasoning: false,
  supportsTools: false,
});

const catalog = (): DiscoveredCatalog => ({
  data: [model()],
  discoveredAt: "2020-01-02T00:00:00.000Z",
  fetchedAt: "2020-01-01T00:00:00.000Z",
});

beforeEach(() => {
  spyOn(models, "createModel").mockImplementation(async (id) => {
    let enriched = model(id);

    if (id.endsWith("/image")) {
      enriched = mediaModel(id, "image");
    } else if (id.endsWith("/video")) {
      enriched = mediaModel(id, "video");
    }

    return await Promise.resolve(enriched);
  });
});

test("round-trips stale startup catalogs privately with no credential in the snapshot", async () => {
  const directory = await cacheDirectory();
  const snapshot = catalog();
  await writeStartupCatalog(directory, baseUrl, key, snapshot);
  expect(await readStartupCatalog(directory, baseUrl, key)).toEqual(snapshot);

  const scope = createHash("sha256")
    .update(JSON.stringify([baseUrl, key]))
    .digest("hex");

  const filename = `startup-catalog-${scope}.json`;
  expect(await readdir(directory)).toEqual([filename]);
  const cachePath = path.join(directory, filename);
  const contents = await readFile(cachePath, "utf-8");
  expect(contents).not.toContain(key);
  expect(JSON.parse(contents)).toEqual({ version: 1, ...snapshot });
  const metadata = await stat(cachePath);
  expect(metadata.mode % 0o1000).toBe(0o600);
});

test("isolates snapshots by both endpoint and credential", async () => {
  const directory = await cacheDirectory();
  const original = catalog();
  await writeStartupCatalog(directory, baseUrl, key, original);
  expect(await readStartupCatalog(directory, baseUrl, "other-credential")).toBeUndefined();
  expect(await readStartupCatalog(directory, "https://other.example/api/v1", key)).toBeUndefined();

  const otherCredential = { ...catalog(), data: [] };
  const otherEndpoint = { ...catalog(), discoveredAt: "2020-01-03T00:00:00.000Z" };
  await writeStartupCatalog(directory, baseUrl, "other-credential", otherCredential);
  await writeStartupCatalog(directory, "https://other.example/api/v1", key, otherEndpoint);
  expect(await readStartupCatalog(directory, baseUrl, key)).toEqual(original);
  expect(await readStartupCatalog(directory, baseUrl, "other-credential")).toEqual(otherCredential);
  expect(await readStartupCatalog(directory, "https://other.example/api/v1", key)).toEqual(
    otherEndpoint
  );
});

test("ignores missing, corrupt, unsupported, and invalid startup catalogs", async () => {
  const directory = await cacheDirectory();
  expect(await readStartupCatalog(directory, baseUrl, key)).toBeUndefined();
  await writeStartupCatalog(directory, baseUrl, key, catalog());
  const [filename] = await readdir(directory);
  const valid = { version: 1, ...catalog() };

  const invalid = [
    "{broken",
    "null",
    JSON.stringify({ ...valid, version: 2 }),
    JSON.stringify({ ...valid, version: undefined }),
    JSON.stringify({ ...valid, fetchedAt: "not a date" }),
    JSON.stringify({ ...valid, fetchedAt: null }),
    JSON.stringify({ ...valid, discoveredAt: "not a date" }),
    JSON.stringify({ ...valid, discoveredAt: 42 }),
    JSON.stringify({ ...valid, data: {} }),
    JSON.stringify({ ...valid, data: [null] }),
    JSON.stringify({ ...valid, data: [{ ...valid.data[0], id: "" }] }),
  ];

  await Promise.all(
    invalid.map(async (contents) => {
      const invalidDirectory = await cacheDirectory();
      const invalidPath = path.join(invalidDirectory, filename);
      await writeFile(invalidPath, contents);
      expect(await readStartupCatalog(invalidDirectory, baseUrl, key)).toBeUndefined();
    })
  );
});

test("an empty snapshot replaces and clears the previous startup catalog", async () => {
  const directory = await cacheDirectory();
  await writeStartupCatalog(directory, baseUrl, key, catalog());
  const empty = { ...catalog(), data: [] };
  await writeStartupCatalog(directory, baseUrl, key, empty);
  expect(await readStartupCatalog(directory, baseUrl, key)).toEqual(empty);
  expect(await readdir(directory)).toHaveLength(1);
});

test("accepts validated media-only snapshots without requiring chat metadata", async () => {
  const directory = await cacheDirectory();

  const media: DiscoveredCatalog = {
    ...catalog(),
    data: [mediaModel("example/image", "image"), mediaModel("example/video", "video")],
  };

  await writeStartupCatalog(directory, baseUrl, key, media);
  expect(await readStartupCatalog(directory, baseUrl, key)).toEqual(media);
});

test("ignores startup snapshots when shared enrichment fails", async () => {
  const directory = await cacheDirectory();
  await writeStartupCatalog(directory, baseUrl, key, catalog());
  spyOn(models, "createModel").mockRejectedValue(new Error("Metadata unavailable"));
  expect(await readStartupCatalog(directory, baseUrl, key)).toBeUndefined();
});

test("validates router IDs without rejecting empty catalogs or future metadata", async () => {
  const catalogs = [
    { data: [] },
    { data: [{ future: { field: true }, id: "example/chat" }], future: true },
  ];

  await Promise.all(
    catalogs.map(async (payload) => {
      const response = await fetchRouterCatalog(baseUrl, key, {
        fetcher: async () => await Promise.resolve(Response.json(payload)),
      });

      expect(response.data.map(({ id }) => id)).toEqual(payload.data.map(({ id }) => id));
    })
  );
});

test("rejects malformed router catalogs before enriching any models", async () => {
  const catalogs = [
    null,
    {},
    { data: {} },
    { data: [null] },
    { data: [{ id: "" }] },
    { data: [{ id: 42 }] },
  ];

  await Promise.all(
    catalogs.map(async (payload) => {
      let failure: Error | undefined;

      try {
        await fetchRouterCatalog(baseUrl, key, {
          fetcher: async () => await Promise.resolve(Response.json(payload)),
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        failure = error;
      }

      expect(failure?.message).toBe("Invalid Forge Router model catalog.");
    })
  );
});
