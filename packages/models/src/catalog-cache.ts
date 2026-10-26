import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import envPaths from "env-paths";
import type { z } from "zod";

import type { DesktopCatalog } from "./desktop-catalog.ts";
import type { RouterCatalog } from "./router-catalog.ts";

const Directory = path.join(envPaths("forge-extensions", { suffix: "" }).cache, "catalogs");

const filename = (scope: readonly string[]): string => {
  const hash = createHash("sha256").update(JSON.stringify(scope)).digest("hex");

  return path.join(Directory, `${hash}.json`);
};

export const readCatalog = async <T>(
  scope: readonly string[],
  schema: z.ZodType<T>
): Promise<T | undefined> => {
  try {
    const result = schema.safeParse(JSON.parse(await readFile(filename(scope), "utf-8")));

    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
};

export const writeCatalog = async (
  scope: readonly string[],
  catalog: DesktopCatalog | RouterCatalog
): Promise<void> => {
  await mkdir(Directory, { mode: 0o700, recursive: true });
  const destination = filename(scope);
  const temporary = `${destination}.${randomUUID()}.tmp`;

  try {
    await writeFile(temporary, `${JSON.stringify(catalog)}\n`, { mode: 0o600 });
    await rename(temporary, destination);
  } finally {
    await rm(temporary, { force: true });
  }
};
