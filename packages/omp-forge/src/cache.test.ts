import { expect, test } from "bun:test";
import path from "node:path";

import { z } from "zod";

const ResultSchema = z.object({
  cleared: z.boolean(),
  failureReported: z.boolean(),
  initialDesktop: z.string(),
  initialRouter: z.string(),
  mcpHeaders: z.record(z.string(), z.string()).optional(),
  mcpUrl: z.string().optional(),
  ms: z.number(),
  reloads: z.number(),
  retained: z.boolean(),
  savedRouter: z.string(),
  unchanged: z.boolean(),
  updatedDesktop: z.string(),
  updatedRouter: z.string(),
  usageReports: z.array(z.string()),
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
      expect(result.usageReports[0]).toBe(
        "Forge daily credits\nAvailable: 12.35 credits\nTotal: 100.00 credits"
      );
      expect(result.usageReports[1]).toBe(
        "Forge daily credits\nAvailable: 0.00 credits\nTotal: 100.00 credits"
      );
      expect(result.usageReports[2]).toContain("Forge balance unavailable.");
      expect(result.usageReports[3]).toContain("Forge balance unavailable.");
      expect(result.usageReports.join("\n")).not.toContain("Private");

      if (host === "opencode") {
        const url = new URL(z.string().parse(result.mcpUrl));
        expect(url.searchParams.get("skills")).toBe(",");
        expect(url.searchParams.get("providers")).toBe("example");
        expect(url.searchParams.get("writes")).toBe("1");
        expect(result.mcpHeaders).toEqual({ Authorization: "Bearer fixture-mcp" });
      }
    } finally {
      clearTimeout(timeout);
    }
  }, 10_000);
}
