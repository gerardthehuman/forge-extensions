import { expect, test } from "bun:test";

import { McpEndpointSchema } from "./mcp-config.ts";

test("retains MCP credentials and accepts local IPv4, hostname, and IPv6 endpoints", () => {
  for (const host of ["127.0.0.1", "localhost", "[::1]"]) {
    const url = `http://${host}:9123/mcp`;

    const endpoint = McpEndpointSchema.parse({
      forge: { headers: { Authorization: "Bearer fixture-key" }, type: "remote", url },
      otherServer: { type: "stdio" },
    });

    expect(endpoint.url.href).toBe(url);
    expect(endpoint.headers).toEqual({ Authorization: "Bearer fixture-key" });
  }

  expect(
    McpEndpointSchema.parse({ forge: { type: "remote", url: "https://localhost/mcp" } }).headers
  ).toBeUndefined();
});

test("rejects remote or credential-bearing MCP URLs before creating a transport", () => {
  for (const url of [
    "https://example.com/mcp",
    "file:///tmp/mcp",
    "http://user:secret@localhost/mcp",
  ]) {
    expect(() => McpEndpointSchema.parse({ forge: { type: "remote", url } })).toThrow(
      "Forge MCP must use a local HTTP endpoint."
    );
  }
});

test("rejects malformed MCP configs and headers with the existing diagnostics", () => {
  for (const config of [
    null,
    {},
    { forge: { type: "stdio" } },
    { forge: { type: "remote", url: 42 } },
  ]) {
    expect(() => McpEndpointSchema.parse(config)).toThrow("Forge MCP is not a remote endpoint.");
  }

  for (const headers of [null, [], ["header"], { Authorization: 42 }]) {
    expect(() =>
      McpEndpointSchema.parse({ forge: { headers, type: "remote", url: "http://localhost/mcp" } })
    ).toThrow("Forge MCP headers are invalid.");
  }
});
