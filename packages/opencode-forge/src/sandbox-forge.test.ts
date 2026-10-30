/* eslint-disable func-style -- Named declarations describe the isolated server fixture. */
import { expect, test } from "bun:test";
import { chmod, copyFile, cp, mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

const Repository = path.resolve(import.meta.dir, "../../..");

async function serverURL(stdout: ReadableStream<Uint8Array>) {
  const reader = stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (!buffer.includes("\n")) {
    // Server startup may span multiple chunks.
    // oxlint-disable-next-line no-await-in-loop
    const chunk = await reader.read();

    if (chunk.done) {
      throw new Error("The sandbox server exited before reporting its address.");
    }

    buffer += decoder.decode(chunk.value, { stream: true });
  }

  return z.object({ url: z.url() }).parse(JSON.parse(buffer.split("\n")[0])).url;
}

test("the web sandbox offers Forge commands and models in another project", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-web-project-"));
  const sandbox = path.join(directory, "sandbox/opencode");
  const project = path.join(directory, "another-project");
  const bin = path.join(directory, "bin");
  const forgeDirectory = path.join(directory, ".forge");

  const binary =
    process.env.OPENCODE_TEST_BINARY ?? path.join(Repository, "node_modules/.bin/opencode");

  const broker = Bun.serve({
    fetch: (request) => {
      const route = new URL(request.url).pathname;

      if (route === "/status") {
        return Response.json({ ready: true, signedIn: true });
      }

      if (route === "/providers") {
        return Response.json({
          forge: { options: { apiKey: "fake", baseURL: "http://127.0.0.1:1" } },
        });
      }

      if (route === "/models") {
        return Response.json({
          test: {
            cost: { input: 1, output: 1 },
            id: "test",
            limit: { context: 32_000, output: 1000 },
            modalities: { input: ["text"], output: ["text"] },
            name: "Test Model",
            reasoning: false,
            tool_call: true,
          },
        });
      }

      if (route === "/usage") {
        return Response.json({ budget: { dailyBudgetUsd: 50, remainingUsd: 12.34 } });
      }

      if (route === "/mcp") {
        return Response.json({
          forge: {
            headers: { authorization: "Bearer fake" },
            url: new URL("/dummy-mcp", request.url).href,
          },
        });
      }

      return Response.json({ error: "Not found" }, { status: 404 });
    },
    hostname: "127.0.0.1",
    port: 0,
  });

  try {
    await Promise.all([
      mkdir(sandbox, { recursive: true }),
      mkdir(project),
      mkdir(bin),
      mkdir(forgeDirectory),
      cp(
        path.join(Repository, "plugins/opencode-forge"),
        path.join(directory, "plugins/opencode-forge"),
        {
          recursive: true,
        }
      ),
    ]);
    await Promise.all([
      copyFile(path.join(Repository, "sandbox/run.ts"), path.join(directory, "sandbox/run.ts")),
      copyFile(
        path.join(Repository, "sandbox/opencode/sandbox.json"),
        path.join(sandbox, "sandbox.json")
      ),
      writeFile(
        path.join(forgeDirectory, "server.json"),
        JSON.stringify({
          appPath: directory,
          home: directory,
          host: "127.0.0.1",
          pid: process.pid,
          port: broker.port,
          started: new Date().toISOString(),
          token: "fake",
        })
      ),
      writeFile(
        path.join(bin, "opencode"),
        `#!${process.execPath}
const child = Bun.spawn([${JSON.stringify(binary)}, ...Bun.argv.slice(2)], {
  cwd: process.cwd(),
  env: { ...process.env, OPENCODE_PASSWORD: "sandbox-test" },
  stdio: ["inherit", "inherit", "inherit"],
});
process.exitCode = await child.exited;
`
      ),
    ]);
    await chmod(path.join(bin, "opencode"), 0o755);

    const server = Bun.spawn(
      [process.execPath, path.join(directory, "sandbox/run.ts"), "web", "--stdio"],
      {
        cwd: directory,
        env: {
          HOME: directory,
          OPENCODE_DISABLE_MODELS_FETCH: "1",
          PATH: `${bin}${path.delimiter}${process.env.PATH ?? ""}`,
        },
        stderr: "pipe",
        stdin: "pipe",
        stdout: "pipe",
      }
    );

    const logs = new Response(server.stderr).text();

    try {
      const url = await serverURL(server.stdout);

      const headers = {
        authorization: `Basic ${Buffer.from("opencode:sandbox-test").toString("base64")}`,
        "content-type": "application/json",
      };

      const inventory = async (location: string) => {
        const created = await fetch(`${url}/api/session`, {
          body: JSON.stringify({ agent: "build", location: { directory: location } }),
          headers,
          method: "POST",
          signal: AbortSignal.timeout(10_000),
        });

        const session = z
          .object({ data: z.object({ id: z.string() }) })
          .parse(await created.json());

        const command = await fetch(`${url}/api/session/${session.data.id}/command`, {
          body: JSON.stringify({ name: "forge:usage", text: "" }),
          headers,
          method: "POST",
          signal: AbortSignal.timeout(10_000),
        });

        const commandURL = new URL("/api/command", url);
        commandURL.searchParams.set("location[directory]", location);
        const modelURL = new URL("/api/model", url);
        modelURL.searchParams.set("location[directory]", location);
        const pluginURL = new URL("/api/plugin", url);
        pluginURL.searchParams.set("location[directory]", location);

        const [commands, models, plugins] = await Promise.all([
          fetch(commandURL, { headers, signal: AbortSignal.timeout(10_000) }),
          fetch(modelURL, { headers, signal: AbortSignal.timeout(10_000) }),
          fetch(pluginURL, { headers, signal: AbortSignal.timeout(10_000) }),
        ]);

        return {
          commandStatus: command.status,
          commands: z
            .object({ data: z.array(z.object({ name: z.string() })) })
            .parse(await commands.json()).data,
          models: z
            .object({ data: z.array(z.object({ id: z.string(), providerID: z.string() })) })
            .parse(await models.json()).data,
          plugins: z
            .object({
              data: z.array(
                z.object({
                  id: z.string(),
                  state: z.object({ error: z.string().optional(), status: z.string() }),
                })
              ),
            })
            .parse(await plugins.json()).data,
        };
      };

      const sandboxInventory = await inventory(sandbox);
      const canonicalSandboxInventory = await inventory(await realpath(sandbox));
      const projectInventory = await inventory(project);

      expect(sandboxInventory.commandStatus).toBe(204);
      expect(
        sandboxInventory.commands.filter((item) => item.name === "forge:billing")
      ).toHaveLength(1);
      expect(sandboxInventory.models).toContainEqual({ id: "test", providerID: "forge" });
      expect(sandboxInventory.plugins.filter((item) => item.id === "forge")).toEqual([
        { id: "forge", state: { status: "active" } },
      ]);
      expect(canonicalSandboxInventory.plugins.filter((item) => item.id === "forge")).toEqual([
        { id: "forge", state: { status: "active" } },
      ]);

      expect({
        billingCommands: projectInventory.commands.filter((item) => item.name === "forge:billing")
          .length,
        commandStatus: projectInventory.commandStatus,
        forgeModel: projectInventory.models.some(
          (item) => item.id === "test" && item.providerID === "forge"
        ),
        forgePlugins: projectInventory.plugins.filter(
          (item) => item.id === "forge" && item.state.status === "active"
        ).length,
      }).toEqual({ billingCommands: 1, commandStatus: 204, forgeModel: true, forgePlugins: 1 });
    } finally {
      await server.stdin.end();
      await server.exited;
      await logs;
    }
  } finally {
    await broker.stop(true);
    await rm(directory, { force: true, recursive: true });
  }
}, 30_000);
