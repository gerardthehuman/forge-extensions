// Bridges Claude Code's stdio MCP transport to Forge Desktop's local HTTP MCP endpoint.
// Forge picks a new port and token on every launch, so the endpoint is discovered at runtime.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

const UNAVAILABLE = "Forge MCP is unavailable. Start Forge Desktop, then retry.";

let endpoint;
let sessionId;

const discover = async () => {
  const { host = "127.0.0.1", port, token } = JSON.parse(
    await readFile(join(homedir(), ".forge", "server.json"), "utf8")
  );
  const response = await fetch(`http://${host}:${port}/mcp`, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Forge returned ${response.status}.`);
  }

  const { forge } = await response.json();
  const url = new URL(forge.url);

  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) {
    throw new Error("Forge MCP must use a local endpoint.");
  }

  return { headers: forge.headers ?? {}, url: url.href };
};

const post = async (message) => {
  endpoint ??= await discover();

  return await fetch(endpoint.url, {
    body: JSON.stringify(message),
    headers: {
      ...endpoint.headers,
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...(sessionId === undefined ? {} : { "mcp-session-id": sessionId }),
    },
    method: "POST",
  });
};

const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);

const readEvents = (text) =>
  text
    .split(/\r?\n\r?\n/u)
    .map((event) =>
      event
        .split(/\r?\n/u)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n")
    )
    .filter(Boolean)
    .map((data) => JSON.parse(data));

const handle = async (message) => {
  try {
    let response;

    try {
      response = await post(message);
    } catch {
      // Forge may have restarted: rediscover the endpoint once.
      endpoint = undefined;
      sessionId = undefined;
      response = await post(message);
    }

    sessionId = response.headers.get("mcp-session-id") ?? sessionId;

    if (response.status === 202 || message.id === undefined) {
      return;
    }

    const text = await response.text();
    const type = response.headers.get("content-type") ?? "";
    const replies = type.includes("text/event-stream") ? readEvents(text) : [JSON.parse(text)];

    for (const reply of replies.flat()) {
      send(reply);
    }
  } catch {
    // Errors can contain credentials or response bodies, so report a fixed message.
    if (message.id !== undefined) {
      send({ error: { code: -32_000, message: UNAVAILABLE }, id: message.id, jsonrpc: "2.0" });
    }
  }
};

// Handle messages in order so the session id from `initialize` applies to later requests.
let queue = Promise.resolve();

createInterface({ input: process.stdin }).on("line", (line) => {
  if (line.trim()) {
    const message = JSON.parse(line);
    queue = queue.then(() => handle(message));
  }
});
