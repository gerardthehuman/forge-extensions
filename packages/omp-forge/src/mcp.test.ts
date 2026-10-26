import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

const ResultSchema = z.object({
  authorization: z.string(),
  callsAfterExclusion: z.number(),
  callsAfterStartup: z.number(),
  clientName: z.string(),
  disabled: z.boolean(),
  excluded: z.boolean(),
  failureHidden: z.boolean(),
  failureWarning: z.boolean(),
  freshCredentials: z.boolean(),
  freshUrl: z.boolean(),
  headerPolicy: z.string(),
  tools: z.array(z.string()),
  unavailable: z.boolean(),
});

test("discovers and connects native HTTP MCP with current credentials and extension scope", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-mcp-"));

  try {
    // Keep the SDK mock and OMP's capability registry out of the other test modules.
    const child = Bun.spawn([process.execPath, path.join(import.meta.dir, "mcp.fixture.ts")], {
      env: { ...process.env, PI_CODING_AGENT_DIR: directory, PI_CONFIG_FILES: "" },
      stderr: "pipe",
      stdout: "pipe",
    });

    const [code, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);

    if (code !== 0) {
      throw new Error(`MCP fixture failed: ${stderr}`);
    }

    const result = ResultSchema.parse(JSON.parse(stdout));
    expect(result).toEqual({
      authorization: "Bearer first-fixture-credential",
      callsAfterExclusion: 2,
      callsAfterStartup: 1,
      clientName: "omp-coding-agent",
      disabled: true,
      excluded: true,
      failureHidden: true,
      failureWarning: true,
      freshCredentials: true,
      freshUrl: true,
      headerPolicy: "origin-locked",
      tools: ["fixture_read"],
      unavailable: true,
    });
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}, 15_000);
