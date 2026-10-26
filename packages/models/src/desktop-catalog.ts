import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

import { useForgeClient } from "@forge/code-client";
import { z } from "zod";

import { readCatalog, writeCatalog } from "./catalog-cache.ts";

const RateSchema = z.object({
  cache_read: z.number().nonnegative().optional(),
  cache_write: z.number().nonnegative().optional(),
  input: z.number().nonnegative(),
  output: z.number().nonnegative(),
});

const DesktopModelSchema = z
  .object({
    cost: RateSchema.extend({
      tiers: z
        .array(
          RateSchema.extend({
            tier: z.object({ size: z.number().positive(), type: z.string() }),
          })
        )
        .optional(),
    }).optional(),
    id: z.string().min(1),
    limit: z.object({ context: z.number().positive(), output: z.number().positive() }),
    modalities: z.object({ input: z.array(z.string()), output: z.array(z.string()) }),
    name: z.string(),
    reasoning: z.boolean(),
    reasoning_options: z
      .array(
        z.discriminatedUnion("type", [
          z.object({ type: z.literal("effort"), values: z.array(z.string().nullable()) }),
          z.object({ type: z.literal("toggle") }),
          z.object({
            max: z.number().optional(),
            min: z.number().optional(),
            type: z.literal("budget_tokens"),
          }),
        ])
      )
      .optional(),
    tool_call: z.boolean(),
  })
  .refine((model) => model.cost !== undefined, {
    message: "Forge model is missing token pricing.",
  });

export type DesktopModels = Record<string, z.infer<typeof DesktopModelSchema>>;

const DesktopCatalogSchema = z.object({
  fetchedAt: z.iso.datetime(),
  models: z.record(z.string(), DesktopModelSchema),
  options: z.object({
    apiKey: z.string().optional(),
    baseURL: z.url(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
  version: z.literal(1),
});

export type DesktopCatalog = z.infer<typeof DesktopCatalogSchema>;

const ServerFile = path.join(homedir(), ".forge", "server.json");

const desktopScope = async (): Promise<string[]> => {
  const server = await readFile(ServerFile, "utf-8");
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const day = new Date().toLocaleDateString("en-CA", { timeZone: tz });

  // A broker restart, timezone change, or new budget day requires a new catalog.
  return ["desktop", server, tz, day];
};

export const readDesktopCatalog = async (): Promise<DesktopCatalog | undefined> => {
  try {
    return await readCatalog(await desktopScope(), DesktopCatalogSchema);
  } catch {
    return undefined;
  }
};

let pending: Promise<DesktopCatalog> | undefined;

export const refreshDesktopCatalog = async (): Promise<DesktopCatalog> => {
  pending ??= (async () => {
    // The SDK can find a Windows broker from WSL without a local server file.
    const scope = await desktopScope().catch(() => {
      // Use live discovery when the SDK resolves a broker outside the local home.
    });

    const forge = await useForgeClient();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const [providers, models] = await Promise.all([forge.providers(), forge.models({ tz })]);

    const catalog = DesktopCatalogSchema.parse({
      fetchedAt: new Date().toISOString(),
      models,
      options: providers.forge.options,
      version: 1,
    });

    if (scope !== undefined) {
      if (JSON.stringify(await desktopScope()) !== JSON.stringify(scope)) {
        throw new Error("Forge Desktop changed during model discovery. Refresh again.");
      }

      await writeCatalog(scope, catalog);
    }

    return catalog;
  })();

  try {
    return await pending;
  } finally {
    pending = undefined;
  }
};
