/* eslint-disable func-style -- Named declarations keep response handling easy to follow. */
import { observeResponseData, responseObservation, switchNotice } from "@forge/models/response";
import type { ResponseObservation } from "@forge/models/response";
import { createAssistantMessageEventStream } from "@oh-my-pi/pi-ai";
import type { AssistantMessage, AssistantMessageEventStream } from "@oh-my-pi/pi-ai";
import { AgentRegistry } from "@oh-my-pi/pi-coding-agent";

import { isCurrentContext } from "./session-context.ts";
import type { RequestContext } from "./session-context.ts";

export const NoticeType = "forge-response";

export function responseAttempts() {
  let current = responseObservation();
  let started = false;
  let received = false;
  const previous: ResponseObservation[] = [];

  return {
    begin() {
      if (started) {
        previous.push(current);
      }

      current = responseObservation();
      started = true;
      received = false;
    },
    headers(headers: Headers) {
      if (received) {
        previous.push(current);
        current = responseObservation();
      }

      current = { ...current, ...responseObservation(headers) };
      started = true;
      received = true;
    },
    observe(data: string) {
      observeResponseData(current, data);
    },
    result() {
      const attempts = started ? [...previous, current] : previous;

      const costs = attempts.flatMap((attempt) =>
        attempt.cost === undefined ? [] : [attempt.cost]
      );

      return {
        current,
        reportedCost: costs.length ? costs.reduce((sum, cost) => sum + cost, 0) : undefined,
        unreported:
          attempts.length === 0
            ? 1
            : attempts.filter((attempt) => attempt.cost === undefined).length,
      };
    },
  };
}

export async function settleNotices(entry: RequestContext, sessionId: string): Promise<void> {
  try {
    const session = AgentRegistry.global().get(entry.ctx.agent.id)?.session;

    if (session?.sessionManager.getSessionId() === sessionId) {
      await session.waitForIdle();
    }

    if (!entry.ctx.isIdle() || !isCurrentContext(entry, sessionId) || entry.notices.size === 0) {
      return;
    }

    const notices = [...entry.notices];
    entry.notices.clear();

    for (const text of notices) {
      entry.pi.sendMessage(
        { content: [], customType: NoticeType, details: { text }, display: true },
        { triggerTurn: false }
      );
    }
  } catch (error) {
    console.error("[forge] Could not record response information:", error);
  }
}

function reportedCost(message: AssistantMessage, cost: number): AssistantMessage {
  const current = message.usage.cost;

  if (current.total === 0) {
    return {
      ...message,
      usage: {
        ...message.usage,
        cost: { cacheRead: 0, cacheWrite: 0, input: cost, output: 0, total: cost },
      },
    };
  }

  const scale = cost / current.total;

  const components = {
    cacheRead: current.cacheRead * scale,
    cacheWrite: current.cacheWrite * scale,
    input: current.input * scale,
    output: current.output * scale,
  };

  return { ...message, usage: { ...message.usage, cost: { ...components, total: cost } } };
}

export function watchModelResponse(
  inner: AssistantMessageEventStream,
  entry: RequestContext,
  model: { id: string },
  attempts: ReturnType<typeof responseAttempts>
): AssistantMessageEventStream {
  const result = createAssistantMessageEventStream();

  const sessionId = entry.ctx.sessionManager.getSessionId();
  result.forwardLocalWorkFrom(inner);

  const finishMessage = (original: AssistantMessage): AssistantMessage => {
    const observed = attempts.result();
    let message = original;

    if (observed.current.model !== undefined) {
      message = { ...message, upstreamModel: observed.current.model };
    }

    if (observed.reportedCost !== undefined) {
      message = reportedCost(message, observed.reportedCost);
    }

    const notice = switchNotice(model.id, observed.current);

    if (notice !== undefined) {
      entry.notices.add(notice);
    }

    if (observed.unreported > 0) {
      entry.notices.add(
        observed.reportedCost === undefined
          ? "Forge did not report a cost. The displayed cost is an estimate."
          : "Forge did not report costs for every attempt. The displayed cost excludes those attempts."
      );
    }

    if (entry.notices.size && entry.ctx.isIdle()) {
      void settleNotices(entry, sessionId);
    }

    return message;
  };

  void (async () => {
    try {
      for await (const event of inner) {
        if (event.type === "done" || event.type === "error") {
          result.push(
            event.type === "done"
              ? { ...event, message: finishMessage(event.message) }
              : { ...event, error: finishMessage(event.error) }
          );
        } else {
          result.push(event);
        }
      }

      if (result.done) {
        result.end();
      } else {
        result.end(finishMessage(await inner.result()));
      }
    } catch (error) {
      result.fail(error);
    } finally {
      result.forwardLocalWorkFrom(undefined);
    }
  })();

  return result;
}
