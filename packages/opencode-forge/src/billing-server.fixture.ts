/* eslint-disable func-style -- Named declarations describe the test server lifecycle. */
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import { OpenCodePluginExternals } from "../build-config.ts";

export async function startBillingServer(
  config: Record<string, z.infer<ReturnType<typeof z.json>>> = {}
) {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-billing-"));
  const plugin = path.join(directory, "plugin");
  const configDirectory = path.join(directory, "config/opencode");
  await Promise.all([mkdir(plugin), mkdir(configDirectory, { recursive: true })]);

  const build = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "billing.fixture.ts")],
    external: OpenCodePluginExternals,
    naming: "index.js",
    outdir: plugin,
    target: "bun",
  });

  if (!build.success) {
    await rm(directory, { force: true, recursive: true });
    throw new AggregateError(build.logs, "Could not build the billing test plugin");
  }

  await writeFile(
    path.join(configDirectory, "opencode.json"),
    JSON.stringify({ ...config, plugins: [plugin] })
  );

  const binary =
    process.env.OPENCODE_TEST_BINARY ??
    path.resolve(import.meta.dir, "../../../node_modules/.bin/opencode");

  const proc = Bun.spawn([binary, "serve", "--stdio", "--port", "0"], {
    cwd: directory,
    env: {
      ...process.env,
      OPENCODE_DISABLE_MODELS_FETCH: "1",
      OPENCODE_PASSWORD: "billing-test",
      XDG_CONFIG_HOME: path.join(directory, "config"),
      XDG_DATA_HOME: path.join(directory, "data"),
      XDG_STATE_HOME: path.join(directory, "state"),
    },
    stderr: "pipe",
    stdin: "pipe",
    stdout: "pipe",
  });

  const logs = new Response(proc.stderr).text();
  const controller = new AbortController();

  const stop = async () => {
    controller.abort();
    proc.kill();
    await proc.exited;
    await logs;
    await rm(directory, { force: true, recursive: true });
  };

  try {
    const startup = proc.stdout.pipeThrough(new TextDecoderStream()).getReader();
    const first = await startup.read();
    const { url } = z.object({ url: z.url() }).parse(JSON.parse(first.value?.split("\n")[0] ?? ""));

    const headers = {
      authorization: `Basic ${Buffer.from("opencode:billing-test").toString("base64")}`,
      "content-type": "application/json",
    };

    const request = async (
      route: string,
      body?: z.infer<ReturnType<typeof z.json>>,
      method = body === undefined ? "GET" : "POST"
    ) => {
      const options: RequestInit = { headers, method, signal: AbortSignal.timeout(10_000) };

      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }

      return await fetch(`${url}${route}`, options);
    };

    const events = async () => {
      const stream = await fetch(`${url}/api/event`, {
        headers,
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
      });

      if (stream.body === null) {
        throw new Error("The event stream has no body");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const next = async <T>(schema: z.ZodType<T>, matches: (event: T) => boolean = () => true) => {
        while (true) {
          const end = buffer.indexOf("\n");

          if (end === -1) {
            // SSE chunks arrive sequentially, and a frame can span chunks.
            // oxlint-disable-next-line no-await-in-loop
            const chunk = await reader.read();

            if (chunk.done) {
              throw new Error("The event stream ended before the expected event");
            }

            buffer += decoder.decode(z.instanceof(Uint8Array).parse(chunk.value), { stream: true });
            continue;
          }

          const line = buffer.slice(0, end);
          buffer = buffer.slice(end + 1);

          if (!line.startsWith("data: ")) {
            continue;
          }

          const parsed = schema.safeParse(JSON.parse(line.slice(6)));

          if (parsed.success && matches(parsed.data)) {
            return parsed.data;
          }
        }
      };

      return { next };
    };

    return { directory, events, request, stop };
  } catch (error) {
    await stop();
    throw error;
  }
}
