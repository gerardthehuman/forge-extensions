import { expect, test } from "bun:test";
import path from "node:path";

import { z } from "zod";

const ResultSchema = z.object({
  cleared: z.boolean(),
  failureReported: z.boolean(),
  initialDesktop: z.string(),
  initialRouter: z.string(),
  ms: z.number(),
  reloads: z.number(),
  retained: z.boolean(),
  savedRouter: z.string(),
  unchanged: z.boolean(),
  updatedDesktop: z.string(),
  updatedRouter: z.string(),
});

for (const host of ["omp", "opencode"]) {
  test(`${host} serves cached models before discovery completes and its refresh command updates the registry and shared cache`, async () => {
    const child = Bun.spawn(
      [process.execPath, path.join(import.meta.dir, "cache.fixture.ts"), host],
      { stderr: "pipe", stdout: "pipe" }
    );

    const timeout = setTimeout(() => {
      child.kill();
    }, 8000);

    try {
      const [code, stdout, stderr] = await Promise.all([
        child.exited,
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
      ]);

      if (code !== 0) {
        throw new Error(`Host cache fixture failed: ${stderr}`);
      }

      const result = ResultSchema.parse(JSON.parse(stdout));
      expect(result.initialDesktop).toBe("Desktop 1");
      expect(result.initialRouter).toBe("Router 1");
      expect(result.updatedDesktop).toBe("Desktop 2");
      expect(result.updatedRouter).toBe("Router 2");
      expect(result.savedRouter).toBe("Router 2");
      expect(result.unchanged).toBe(true);
      expect(result.retained).toBe(true);
      expect(result.failureReported).toBe(true);
      expect(result.cleared).toBe(true);
      expect(result.reloads).toBeGreaterThan(0);
    } finally {
      clearTimeout(timeout);
    }
  }, 10_000);
}
