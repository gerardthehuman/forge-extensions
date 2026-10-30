/* eslint-disable func-style -- Named declarations describe the sandbox test fixture. */
import { expect, test } from "bun:test";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

const Repository = path.resolve(import.meta.dir, "../../..");
const OpenCodeSandbox = path.join(Repository, "sandbox/opencode");

const CaptureSchema = z.object({
  args: z.array(z.string()),
  cwd: z.string(),
  env: z.object({
    cache: z.string().optional(),
    config: z.string().optional(),
    configFile: z.string().optional(),
    data: z.string().optional(),
    hasConfigContent: z.boolean(),
    hasConfigDirectory: z.boolean(),
    hasConfigFile: z.boolean(),
    hasConfigProjectDisable: z.boolean(),
    hasDatabaseOverride: z.boolean(),
    hasLegacyConfigProjectDisable: z.boolean(),
    hasPassword: z.boolean(),
    hasPtyHandoff: z.boolean(),
    hasServerPassword: z.boolean(),
    hasSession: z.boolean(),
    ompConfig: z.string().optional(),
    ompState: z.string().optional(),
    state: z.string().optional(),
  }),
});

async function runSandbox(
  agent: string,
  args: string[],
  server?: { url: string; password: string; proxy?: string }
) {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-sandbox-test-"));
  const bin = path.join(directory, "bin");
  const capture = path.join(directory, "capture.json");
  await mkdir(bin);

  const executable = path.join(bin, "opencode");
  await writeFile(
    executable,
    `#!${process.execPath}
await Bun.write(process.env.SANDBOX_CAPTURE_PATH, JSON.stringify({
  args: Bun.argv.slice(2),
  cwd: process.cwd(),
  env: {
    cache: process.env.XDG_CACHE_HOME,
    config: process.env.XDG_CONFIG_HOME,
    configFile: process.env.OPENCODE_CONFIG,
    data: process.env.XDG_DATA_HOME,
    state: process.env.XDG_STATE_HOME,
    hasConfigContent: process.env.OPENCODE_CONFIG_CONTENT !== undefined,
    hasConfigDirectory: process.env.OPENCODE_CONFIG_DIR !== undefined,
    hasConfigFile: process.env.OPENCODE_CONFIG !== undefined,
    hasConfigProjectDisable: process.env.OPENCODE_CONFIG_PROJECT_DISABLE !== undefined,
    hasDatabaseOverride: process.env.OPENCODE_DB !== undefined,
    hasLegacyConfigProjectDisable: process.env.OPENCODE_DISABLE_PROJECT_CONFIG !== undefined,
    hasPassword: process.env.OPENCODE_PASSWORD !== undefined,
    hasPtyHandoff: process.env.OPENCODE_PTY_HANDOFF !== undefined,
    hasServerPassword: process.env.OPENCODE_SERVER_PASSWORD !== undefined,
    hasSession: process.env.OPENCODE_SESSION_ID !== undefined,
    ompConfig: process.env.PI_CONFIG_FILES,
    ompState: process.env.PI_CODING_AGENT_DIR,
  },
}));
if (process.env.SANDBOX_FAKE_SERVER_URL) {
  console.log("server listening on " + process.env.SANDBOX_FAKE_SERVER_URL);
  console.log("server password " + process.env.SANDBOX_FAKE_SERVER_PASSWORD);
}
`
  );
  await chmod(executable, 0o755);
  await copyFile(executable, path.join(bin, "omp"));

  try {
    const proxy = server?.proxy;

    const proxyEnv =
      proxy === undefined
        ? {}
        : {
            ALL_PROXY: proxy,
            HTTPS_PROXY: proxy,
            HTTP_PROXY: proxy,
            NODE_USE_ENV_PROXY: "1",
            NO_PROXY: "",
            all_proxy: proxy,
            http_proxy: proxy,
            https_proxy: proxy,
            no_proxy: "",
          };

    const child = Bun.spawn(
      [process.execPath, path.join(Repository, "sandbox/run.ts"), agent, ...args],
      {
        cwd: Repository,
        env: {
          ...process.env,
          ...proxyEnv,
          OPENCODE_CONFIG: path.join(directory, "parent.json"),
          OPENCODE_CONFIG_CONTENT: '{"plugins":["parent-plugin"]}',
          OPENCODE_CONFIG_DIR: path.join(directory, "parent-config"),
          OPENCODE_CONFIG_PROJECT_DISABLE: "1",
          OPENCODE_DB: path.join(directory, "parent.db"),
          OPENCODE_DISABLE_PROJECT_CONFIG: "1",
          OPENCODE_PASSWORD: "parent-test-password",
          OPENCODE_PTY_HANDOFF: "parent-test-handoff",
          OPENCODE_SERVER_PASSWORD: "parent-test-server-password",
          OPENCODE_SESSION_ID: "ses_parent",
          PATH: `${bin}${path.delimiter}${process.env.PATH ?? ""}`,
          PI_CODING_AGENT_DIR: undefined,
          PI_CONFIG_FILES: undefined,
          SANDBOX_CAPTURE_PATH: capture,
          SANDBOX_FAKE_SERVER_PASSWORD: server?.password,
          SANDBOX_FAKE_SERVER_URL: server?.url,
        },
        stderr: "pipe",
        stdout: "pipe",
      }
    );

    const stderr = new Response(child.stderr).text();
    const stdout = new Response(child.stdout).text();
    const exit = await child.exited;
    const output = await stderr;

    if (exit !== 0) {
      throw new Error(`Sandbox exited with ${exit}: ${output}`);
    }

    return {
      ...CaptureSchema.parse(JSON.parse(await readFile(capture, "utf-8"))),
      output: await stdout,
      stderr: output,
    };
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

test("the web sandbox starts a private server with separate state", async () => {
  const result = await runSandbox("web", ["--stdio"]);
  const state = path.join(OpenCodeSandbox, ".state/web");

  expect(result.args).toEqual(["serve", "--hostname", "127.0.0.1", "--port", "0", "--stdio"]);
  expect(result.cwd).toBe(OpenCodeSandbox);
  expect(result.env).toEqual({
    cache: path.join(state, "cache"),
    config: path.join(state, "config"),
    configFile: path.join(OpenCodeSandbox, "sandbox.json"),
    data: path.join(state, "data"),
    hasConfigContent: false,
    hasConfigDirectory: false,
    hasConfigFile: true,
    hasConfigProjectDisable: false,
    hasDatabaseOverride: false,
    hasLegacyConfigProjectDisable: false,
    hasPassword: false,
    hasPtyHandoff: false,
    hasServerPassword: false,
    hasSession: false,
    state: path.join(state, "state"),
  });
});

test("the OpenCode terminal sandbox still forwards arguments", async () => {
  const result = await runSandbox("opencode", ["--help"]);
  const state = path.join(OpenCodeSandbox, ".state");

  expect(result.args).toEqual(["--standalone", "--help"]);
  expect(result.cwd).toBe(OpenCodeSandbox);
  expect(result.env.configFile).toBe(path.join(OpenCodeSandbox, "sandbox.json"));
  expect(result.env.config).toBe(path.join(state, "config"));
  expect(result.env.data).toBe(path.join(state, "data"));
  expect(result.env.state).toBe(path.join(state, "state"));
});

test("the OMP sandbox still forwards arguments", async () => {
  const result = await runSandbox("omp", ["--help"]);

  expect(result.args).toEqual(["--help"]);
  expect(result.cwd).toBe(path.join(Repository, "sandbox/omp"));
  expect(result.env.ompState).toBe(path.join(Repository, "sandbox/omp/.state"));
  expect(result.env.ompConfig).toBe(path.join(Repository, "sandbox/omp/config.yml"));
});

async function serverURL(stdout: ReadableStream<Uint8Array>) {
  const reader = stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (!buffer.includes("\n")) {
    // Server startup may arrive in more than one chunk.
    // oxlint-disable-next-line no-await-in-loop
    const chunk = await reader.read();

    if (chunk.done) {
      throw new Error("The sandbox server exited before reporting its address.");
    }

    buffer += decoder.decode(chunk.value, { stream: true });
  }

  const result = z.object({ url: z.url() }).parse(JSON.parse(buffer.split("\n")[0]));

  return new URL(result.url);
}

test("the web sandbox prints a single-use sign-in link", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-sandbox-pair-"));

  const binary =
    process.env.OPENCODE_TEST_BINARY ?? path.join(Repository, "node_modules/.bin/opencode");

  const password = "sandbox-pairing-test-password";

  const server = Bun.spawn([binary, "serve", "--hostname", "127.0.0.1", "--port", "0", "--stdio"], {
    cwd: directory,
    env: {
      HOME: directory,
      OPENCODE_DISABLE_MODELS_FETCH: "1",
      OPENCODE_PASSWORD: password,
      PATH: process.env.PATH ?? "",
      XDG_CACHE_HOME: path.join(directory, "cache"),
      XDG_CONFIG_HOME: path.join(directory, "config"),
      XDG_DATA_HOME: path.join(directory, "data"),
      XDG_STATE_HOME: path.join(directory, "state"),
    },
    stderr: "pipe",
    stdin: "pipe",
    stdout: "pipe",
  });

  const logs = new Response(server.stderr).text();
  let proxyRequests = 0;

  const proxy = Bun.serve({
    fetch: () => {
      proxyRequests += 1;

      return new Response("Proxy used unexpectedly", { status: 502 });
    },
    hostname: "127.0.0.1",
    port: 0,
  });

  try {
    const address = await serverURL(server.stdout);

    const result = await runSandbox("web", [], {
      password,
      proxy: `http://127.0.0.1:${proxy.port}`,
      url: address.origin,
    });

    const link = result.output
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith(`${address.origin}/auth/connect/`));

    if (link === undefined) {
      throw new Error("The sandbox did not print a one-time sign-in link.");
    }

    expect(link.includes(password)).toBe(false);
    expect(result.output.includes("one-use link within 300 seconds")).toBe(true);
    expect(proxyRequests).toBe(0);

    const redeemed = await fetch(link, {
      headers: { accept: "text/html" },
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });

    const cookie = redeemed.headers.get("set-cookie")?.split(";")[0] ?? "";

    expect(redeemed.status).toBe(302);

    const info = await fetch(new URL("/api/info", address), {
      headers: { cookie },
      signal: AbortSignal.timeout(5000),
    });

    expect(info.status).toBe(200);

    const reused = await fetch(link, {
      headers: { accept: "text/html" },
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });

    expect(reused.status).toBe(401);
  } finally {
    await proxy.stop(true);
    await server.stdin.end();
    await server.exited;
    await logs;
    await rm(directory, { force: true, recursive: true });
  }
}, 20_000);

test("the web sandbox keeps the password available if pairing fails", async () => {
  const server = Bun.serve({
    fetch: () => new Response("Pairing unavailable", { status: 503 }),
    hostname: "127.0.0.1",
    port: 0,
  });

  const password = "sandbox-fallback-test-password";

  try {
    const result = await runSandbox("web", [], {
      password,
      url: `http://127.0.0.1:${server.port}`,
    });

    expect(result.output.includes(`server password ${password}`)).toBe(true);
    expect(result.stderr).toContain("Could not create a sign-in link. Use the password above.");
  } finally {
    await server.stop(true);
  }
});

test("the web sandbox starts alongside another OpenCode server", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-web-sandbox-"));
  const sandbox = path.join(directory, "sandbox/opencode");
  await mkdir(sandbox, { recursive: true });
  await copyFile(path.join(Repository, "sandbox/run.ts"), path.join(directory, "sandbox/run.ts"));
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify({ scripts: { sandbox: "bun run sandbox/run.ts" } })
  );
  await writeFile(
    path.join(sandbox, "sandbox.json"),
    JSON.stringify({ plugins: [path.join(Repository, "plugins/opencode-forge")] })
  );

  const binary =
    process.env.OPENCODE_TEST_BINARY ?? path.join(Repository, "node_modules/.bin/opencode");

  const existing = Bun.spawn(
    [binary, "serve", "--hostname", "127.0.0.1", "--port", "0", "--stdio"],
    {
      cwd: directory,
      env: {
        HOME: directory,
        OPENCODE_DISABLE_MODELS_FETCH: "1",
        OPENCODE_PASSWORD: "existing-test-password",
        PATH: process.env.PATH ?? "",
        XDG_CACHE_HOME: path.join(directory, "existing/cache"),
        XDG_CONFIG_HOME: path.join(directory, "existing/config"),
        XDG_DATA_HOME: path.join(directory, "existing/data"),
        XDG_STATE_HOME: path.join(directory, "existing/state"),
      },
      stderr: "pipe",
      stdin: "pipe",
      stdout: "pipe",
    }
  );

  const existingLogs = new Response(existing.stderr).text();
  let web: typeof existing | undefined;
  let webLogs: Promise<string> | undefined;

  try {
    const existingURL = await serverURL(existing.stdout);

    const headers = {
      authorization: `Basic ${Buffer.from("opencode:existing-test-password").toString("base64")}`,
    };

    const before = await fetch(new URL("/api/info", existingURL), {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    expect(before.status).toBe(200);

    web = Bun.spawn([process.execPath, "run", "sandbox", "web", "--stdio"], {
      cwd: directory,
      env: {
        HOME: directory,
        OPENCODE_CONFIG_CONTENT: '{"plugins":["parent-plugin"]}',
        OPENCODE_DB: path.join(directory, "existing/opencode.db"),
        OPENCODE_DISABLE_MODELS_FETCH: "1",
        OPENCODE_PASSWORD: "existing-test-password",
        PATH: `${path.dirname(binary)}${path.delimiter}${process.env.PATH ?? ""}`,
      },
      stderr: "pipe",
      stdin: "pipe",
      stdout: "pipe",
    });
    webLogs = new Response(web.stderr).text();

    const webURL = await serverURL(web.stdout);
    expect(webURL.hostname).toBe("127.0.0.1");
    expect(webURL.port).not.toBe(existingURL.port);

    const page = await fetch(webURL, { signal: AbortSignal.timeout(5000) });
    expect(page.status).toBe(200);
    expect(page.headers.get("content-type")).toContain("text/html");

    const parentCredentials = await fetch(new URL("/api/info", webURL), {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    expect(parentCredentials.status).toBe(401);

    const after = await fetch(new URL("/api/info", existingURL), {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    expect(after.status).toBe(200);
  } finally {
    if (web !== undefined) {
      await web.stdin.end();
      await web.exited;
      await webLogs;
    }

    await existing.stdin.end();
    await existing.exited;
    await existingLogs;
    await rm(directory, { force: true, recursive: true });
  }
}, 20_000);
