/* eslint-disable promise/avoid-new -- Node's HTTP request API uses callbacks. */
/* eslint-disable anti-slop/no-runtime-typeof -- Validate the pairing response without runtime dependencies. */
import { request } from "node:http";

const PairingTimeoutMs = 5000;
const MaxPairingResponseLength = 16_384;
const MaxStartupLineLength = 16_384;

const open = async (
  cwd: string,
  cmd: readonly string[],
  env: Record<string, string | undefined>
) => {
  const child = Bun.spawn([...cmd], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["inherit", "inherit", "inherit"],
  });

  process.exitCode = await child.exited;
};

const pairingLink = async (address: string, password: string) => {
  const server = new URL(address);

  if (
    server.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(server.hostname) ||
    server.port === "" ||
    server.username !== "" ||
    server.password !== ""
  ) {
    throw new Error("The sandbox server is not on localhost.");
  }

  const body = await new Promise<string>((resolve, reject) => {
    const call = request(
      new URL("/api/pair", server),
      {
        agent: false,
        headers: {
          authorization: `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`,
        },
        method: "POST",
        signal: AbortSignal.timeout(PairingTimeoutMs),
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error("The sandbox server refused the sign-in request."));

          return;
        }

        let text = "";
        response.setEncoding("utf-8");
        response.on("data", (chunk: string) => {
          text += chunk;

          if (text.length > MaxPairingResponseLength) {
            call.destroy(new Error("The sign-in response is too large."));
          }
        });
        response.once("error", reject);
        response.once("end", () => {
          resolve(text);
        });
      }
    );

    call.once("error", reject);
    call.end();
  });

  const result: unknown = JSON.parse(body);

  if (
    typeof result !== "object" ||
    result === null ||
    !("code" in result) ||
    typeof result.code !== "string" ||
    !/^[\w-]+$/u.test(result.code) ||
    !("expires_in" in result) ||
    typeof result.expires_in !== "number" ||
    !Number.isSafeInteger(result.expires_in) ||
    result.expires_in <= 0
  ) {
    throw new Error("The sandbox server returned an invalid sign-in link.");
  }

  return {
    expiresIn: result.expires_in,
    url: new URL(`/auth/connect/${result.code}`, server).href,
  };
};

const reportPairingLink = async (address: string, password: string) => {
  try {
    const { expiresIn, url } = await pairingLink(address, password);
    console.log(`\nOpen this one-use link within ${expiresIn} seconds:\n${url}\n`);
  } catch {
    console.error("[sandbox] Could not create a sign-in link. Use the password above.");
  }
};

const openWeb = async (
  cwd: string,
  cmd: readonly string[],
  env: Record<string, string | undefined>
) => {
  const child = Bun.spawn([...cmd], {
    cwd,
    env: { ...process.env, ...env },
    stderr: "inherit",
    stdin: "inherit",
    stdout: "pipe",
  });

  const decoder = new TextDecoder();
  let buffer = "";
  let address: string | undefined;
  let password: string | undefined;
  let pairing: Promise<void> | undefined;

  for await (const chunk of child.stdout) {
    const text = decoder.decode(chunk, { stream: true });
    process.stdout.write(text);

    if (pairing !== undefined) {
      continue;
    }

    buffer += text;
    const lines = buffer.split("\n");
    buffer = (lines.pop() ?? "").slice(-MaxStartupLineLength);

    for (const line of lines) {
      if (line.startsWith("server listening on ")) {
        address = line.slice("server listening on ".length).trim();
      }

      if (line.startsWith("server password ")) {
        password = line.slice("server password ".length).trim();
      }
    }

    if (address !== undefined && password !== undefined) {
      pairing = reportPairingLink(address, password);
    }
  }

  await pairing;
  process.exitCode = await child.exited;
};

const [sandbox, ...args] = Bun.argv.slice(2);
const OpenCodeConfig = `${import.meta.dir}/opencode/sandbox.json`;
const WebState = `${import.meta.dir}/opencode/.state/web`;

const Sandboxes = {
  omp: {
    commands: ["omp"],
    directory: "omp",
    env: {
      PI_CODING_AGENT_DIR: `${import.meta.dir}/omp/.state`,
      PI_CONFIG_FILES: `${import.meta.dir}/omp/config.yml`,
    },
  },
  opencode: {
    commands: ["opencode", "--standalone"],
    directory: "opencode",
    env: {
      OPENCODE_CONFIG: OpenCodeConfig,
      XDG_CONFIG_HOME: `${import.meta.dir}/opencode/.state/config`,
      XDG_DATA_HOME: `${import.meta.dir}/opencode/.state/data`,
      XDG_STATE_HOME: `${import.meta.dir}/opencode/.state/state`,
    },
  },
  web: {
    commands: ["opencode", "serve", "--hostname", "127.0.0.1", "--port", "0"],
    directory: "opencode",
    env: {
      // Load the sandbox plugin for every project without inheriting the caller's configuration.
      OPENCODE_CONFIG: OpenCodeConfig,
      OPENCODE_CONFIG_CONTENT: undefined,
      OPENCODE_CONFIG_DIR: undefined,
      OPENCODE_CONFIG_PROJECT_DISABLE: undefined,
      OPENCODE_DB: undefined,
      OPENCODE_DISABLE_PROJECT_CONFIG: undefined,
      OPENCODE_PASSWORD: undefined,
      OPENCODE_PTY_HANDOFF: undefined,
      OPENCODE_SERVER_PASSWORD: undefined,
      OPENCODE_SESSION_ID: undefined,
      XDG_CACHE_HOME: `${WebState}/cache`,
      XDG_CONFIG_HOME: `${WebState}/config`,
      XDG_DATA_HOME: `${WebState}/data`,
      XDG_STATE_HOME: `${WebState}/state`,
    },
  },
};

if (sandbox !== "omp" && sandbox !== "opencode" && sandbox !== "web") {
  throw new Error(`Usage: bun run sandbox [${Object.keys(Sandboxes).join("|")}]`);
}

const config = Sandboxes[sandbox];

const cwd = `${import.meta.dir}/${config.directory}`;
const command = [...config.commands, ...args];

const start = sandbox === "web" && !args.includes("--stdio") ? openWeb : open;

await start(cwd, command, config.env);
