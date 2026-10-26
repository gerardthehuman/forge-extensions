import { z } from "zod";

const ServersSchema = z.object({
  forge: z.object({ headers: z.unknown().optional(), type: z.literal("remote"), url: z.string() }),
});

const HeadersSchema = z.record(z.string(), z.string()).optional();

export const McpEndpointSchema = z.unknown().transform((servers, ctx) => {
  const parsed = ServersSchema.safeParse(servers);

  if (!parsed.success) {
    ctx.addIssue({ code: "custom", message: "Forge MCP is not a remote endpoint." });

    return z.NEVER;
  }

  const url = new URL(parsed.data.forge.url);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) ||
    url.username ||
    url.password
  ) {
    ctx.addIssue({ code: "custom", message: "Forge MCP must use a local HTTP endpoint." });

    return z.NEVER;
  }

  const headers = HeadersSchema.safeParse(parsed.data.forge.headers);

  if (!headers.success) {
    ctx.addIssue({ code: "custom", message: "Forge MCP headers are invalid." });

    return z.NEVER;
  }

  return { headers: headers.data, url };
});
