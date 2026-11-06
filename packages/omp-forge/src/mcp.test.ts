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
  emptySelection: z.boolean(),
  excluded: z.boolean(),
  failureHidden: z.boolean(),
  failureWarning: z.boolean(),
  freshCredentials: z.boolean(),
  freshUrl: z.boolean(),
  headerPolicy: z.string(),
  invalidSelection: z.boolean(),
  prompts: z.array(z.string()),
  providers: z.string(),
  skills: z.string(),
  tools: z.array(z.string()),
  unavailable: z.boolean(),
  writes: z.string(),
});

test("discovers and connects native HTTP MCP with current credentials and extension scope", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-mcp-"));

  try {
    // Keep the SDK mock and OMP's capability registry out of the other test modules.
    const child = Bun.spawn([process.execPath, path.join(import.meta.dir, "mcp.fixture.ts")], {
      env: {
        ...process.env,
        HOME: directory,
        PI_CODING_AGENT_DIR: directory,
        PI_CONFIG_FILES: "",
        XDG_CACHE_HOME: path.join(directory, "xdg-cache"),
        XDG_CONFIG_HOME: path.join(directory, "xdg-config"),
        XDG_DATA_HOME: path.join(directory, "xdg-data"),
        XDG_STATE_HOME: path.join(directory, "xdg-state"),
      },
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
      callsAfterExclusion: 3,
      callsAfterStartup: 1,
      clientName: "omp-coding-agent",
      disabled: true,
      emptySelection: true,
      excluded: true,
      failureHidden: true,
      failureWarning: true,
      freshCredentials: true,
      freshUrl: true,
      headerPolicy: "origin-locked",
      invalidSelection: true,
      prompts: [],
      providers: "example",
      skills: ",",
      tools: ["fixture_read"],
      unavailable: true,
      writes: "1",
    });
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}, 15_000);
