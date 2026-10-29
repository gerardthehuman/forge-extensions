/* eslint-disable func-style -- Named declarations keep response accounting easy to follow. */
import { observeResponseData, responseObservation } from "@forge/models/response";
import type { ResponseObservation } from "@forge/models/response";
import type { Context } from "@opencode/plugin/promise/plugin";
import { makeParser } from "effect/encoding/Sse";
import { z } from "zod";

import { createResponseLedger } from "./ledger.ts";

const MaxEventLength = 10 * 1024 * 1024;

type SessionID = Parameters<Context["session"]["get"]>[0]["sessionID"];

function responseReader(observation: ResponseObservation, contentType: string) {
  const decoder = new TextDecoder();
  const isEventStream = contentType.toLowerCase().includes("text/event-stream");
  let buffer = "";
  let sawDone = false;
  let terminal = false;
  let parseFailed = false;

  const parser = makeParser(
    (event) => {
      if (event._tag !== "Event") {
        return;
      }

      if (event.data === "[DONE]") {
        sawDone = true;
      } else if (observeResponseData(observation, event.data)) {
        terminal = true;
      }
    },
    { maxEventSize: MaxEventLength }
  );

  const feed = (text: string) => {
    if (parseFailed) {
      return;
    }

    if (parser.feed(text) !== undefined) {
      parseFailed = true;
      parser.reset();
    }
  };

  return {
    get done() {
      return sawDone;
    },
    finish() {
      if (isEventStream) {
        feed(decoder.decode());
      } else if (buffer.length <= MaxEventLength) {
        observeResponseData(observation, buffer + decoder.decode());
      }
    },
    isEventStream,
    push(bytes: Uint8Array) {
      const text = decoder.decode(bytes, { stream: true });

      if (isEventStream) {
        feed(text);
      } else if (buffer.length <= MaxEventLength) {
        buffer += text;
      }
    },
    get terminal() {
      return !parseFailed && terminal;
    },
  };
}

export function watchResponse(
  response: Response,
  observation: ResponseObservation,
  complete: (finished: boolean) => Promise<void>
): Response {
  if (!response.body) {
    void complete(false);

    return response;
  }

  const source = response.body.getReader();
  const parser = responseReader(observation, response.headers.get("content-type") ?? "");
  let finished = false;
  let cancelled = false;

  const finish = async (fullyRead: boolean) => {
    if (finished) {
      return;
    }

    finished = true;
    parser.finish();

    const completeResponse = parser.isEventStream
      ? parser.done || (fullyRead && !cancelled && parser.terminal)
      : fullyRead && !cancelled;

    await complete(completeResponse);
  };

  const body = new ReadableStream<Uint8Array>({
    async cancel(reason) {
      cancelled = true;

      try {
        await source.cancel(reason);
      } finally {
        await finish(false);
      }
    },
    async pull(controller) {
      try {
        const chunk = await source.read();

        if (chunk.done) {
          await finish(true);
          controller.close();

          return;
        }

        const bytes = z.instanceof(Uint8Array).parse(chunk.value);
        parser.push(bytes);
        controller.enqueue(bytes);
      } catch (error) {
        await finish(false);
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export async function registerResponses(ctx: Context, signal?: AbortSignal): Promise<void> {
  const ledger = createResponseLedger(ctx.storage);
  const updates = new Map<string, Set<string>>();
  const workers = new Map<string, Promise<void>>();
  const stopped = () => signal?.aborted === true;

  const queueNotice = (sessionID: SessionID, notice: string) => {
    const pending = updates.get(sessionID) ?? new Set<string>();
    pending.add(notice);
    updates.set(sessionID, pending);

    if (workers.has(sessionID)) {
      return;
    }

    const worker = (async () => {
      try {
        while (!stopped() && updates.has(sessionID)) {
          // Each batch waits until its session is idle before adding a transcript notice.
          // oxlint-disable-next-line no-await-in-loop
          await ctx.session.wait({ sessionID });

          if (stopped()) {
            return;
          }

          const batch = updates.get(sessionID) ?? new Set<string>();
          updates.delete(sessionID);
          const text = [...batch].join("\n");

          // oxlint-disable-next-line no-await-in-loop
          await ctx.session.synthetic({
            description: text,
            metadata: { forgeResponseNotice: true },
            resume: false,
            sessionID,
            text,
          });
        }
      } catch (error) {
        updates.delete(sessionID);
        console.error("[forge] Could not record the model switch:", error);
      } finally {
        workers.delete(sessionID);

        if (stopped()) {
          updates.delete(sessionID);
        }
      }
    })();

    workers.set(sessionID, worker);
  };

  await ctx.command.transform((editor) => {
    editor.add({
      description: "Show Forge's reported cost for this session",
      execute: async ({ sessionID }) => {
        // A synthetic notice admitted during an active turn starts another model call.
        await ctx.session.wait({ sessionID });

        while (workers.has(sessionID)) {
          // A second response can arrive while the first notice is being recorded.
          // oxlint-disable-next-line no-await-in-loop
          await workers.get(sessionID);
        }

        const text = await ledger.report(sessionID);
        await ctx.session.synthetic({
          description: text,
          metadata: { forgeResponseNotice: true },
          resume: false,
          sessionID,
          text,
        });
      },
      name: "forge:cost",
    });
  });

  for (const providerID of ["forge", "forge-router"]) {
    // Hook registration order is deterministic.
    // oxlint-disable-next-line no-await-in-loop
    await ctx.session.hook(
      "http.response",
      async (event) => {
        if (!event.response.ok) {
          return;
        }

        const observation = responseObservation(event.response.headers);

        const record = await ledger.start(event.sessionID, {
          kind: event.kind,
          provider: providerID,
          requested: event.model.id,
        });

        event.response = watchResponse(event.response, observation, async (finished) => {
          const notice = await ledger.finish(record, observation, finished);

          if (notice !== undefined) {
            queueNotice(event.sessionID, notice);
          }
        });
      },
      { providerID }
    );
  }
}
