/* eslint-disable func-style -- Named declarations keep response handling easy to follow. */
import { observeResponseData, responseObservation, switchNotice } from "@forge/models/response";
import type { ResponseObservation } from "@forge/models/response";
import type { Context } from "@opencode/plugin/promise/plugin";
import { makeParser } from "effect/encoding/Sse";
import { z } from "zod";

const MaxEventLength = 10 * 1024 * 1024;

type SessionID = Parameters<Context["session"]["get"]>[0]["sessionID"];

function responseReader(observation: ResponseObservation, contentType: string) {
  const decoder = new TextDecoder();
  const isEventStream = contentType.toLowerCase().includes("text/event-stream");
  let buffer = "";
  let parseFailed = false;

  const parser = makeParser(
    (event) => {
      if (event._tag !== "Event") {
        return;
      }

      if (event.data !== "[DONE]") {
        observeResponseData(observation, event.data);
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
    finish() {
      if (isEventStream) {
        feed(decoder.decode());
      } else if (buffer.length <= MaxEventLength) {
        observeResponseData(observation, buffer + decoder.decode());
      }
    },
    push(bytes: Uint8Array) {
      const text = decoder.decode(bytes, { stream: true });

      if (isEventStream) {
        feed(text);
      } else if (buffer.length <= MaxEventLength) {
        buffer += text;
      }
    },
  };
}

export function watchResponse(
  response: Response,
  observation: ResponseObservation,
  complete: () => void
): Response {
  if (!response.body) {
    complete();

    return response;
  }

  const source = response.body.getReader();
  const parser = responseReader(observation, response.headers.get("content-type") ?? "");
  let finished = false;

  const finish = () => {
    if (finished) {
      return;
    }

    finished = true;
    parser.finish();
    complete();
  };

  const body = new ReadableStream<Uint8Array>({
    async cancel(reason) {
      try {
        await source.cancel(reason);
      } finally {
        finish();
      }
    },
    async pull(controller) {
      try {
        const chunk = await source.read();

        if (chunk.done) {
          finish();
          controller.close();

          return;
        }

        const bytes = z.instanceof(Uint8Array).parse(chunk.value);
        parser.push(bytes);
        controller.enqueue(bytes);
      } catch (error) {
        finish();
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

  for (const providerID of ["forge", "forge-router"]) {
    // Hook registration order is deterministic.
    // oxlint-disable-next-line no-await-in-loop
    await ctx.session.hook(
      "http.response",
      (event) => {
        if (!event.response.ok) {
          return;
        }

        const observation = responseObservation(event.response.headers);
        const requested = event.model.id;
        const { sessionID } = event;

        event.response = watchResponse(event.response, observation, () => {
          const notice = switchNotice(requested, observation);

          if (notice !== undefined) {
            queueNotice(sessionID, notice);
          }
        });
      },
      { providerID }
    );
  }
}
