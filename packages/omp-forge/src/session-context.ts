/* eslint-disable func-style -- Named declarations describe the session lifecycle. */
import type { SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import { AgentRegistry } from "@oh-my-pi/pi-coding-agent";
import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";

export interface RequestContext {
  ctx: ExtensionContext;
  pi: ExtensionAPI;
  notices: Set<string>;
}

const Contexts = new Map<string, RequestContext>();

export function requestContext(options: SimpleStreamOptions | undefined): RequestContext {
  const sessionId = options?.sessionId;

  const active = AgentRegistry.global()
    .list()
    .find((agent) => agent.session?.sessionId === sessionId);

  const context = active?.session
    ? Contexts.get(active.session.sessionManager.getSessionId())
    : undefined;

  const entry = context ?? (sessionId === undefined ? undefined : Contexts.get(sessionId));

  if (!entry) {
    throw new Error("Cannot resolve the Forge billing account for this request.");
  }

  return entry;
}

export function rememberContext(ctx: ExtensionContext, pi: ExtensionAPI): RequestContext {
  const sessionId = ctx.sessionManager.getSessionId();
  const notices = Contexts.get(sessionId)?.notices ?? new Set<string>();
  const entry = { ctx, notices, pi };
  Contexts.set(sessionId, entry);

  return entry;
}

export function isCurrentContext(entry: RequestContext, sessionId: string): boolean {
  const current = Contexts.get(sessionId);

  return (
    entry.ctx.sessionManager.getSessionId() === sessionId &&
    current?.notices === entry.notices &&
    current.pi === entry.pi
  );
}

export function forgetContext(sessionId: string): void {
  Contexts.delete(sessionId);
}
