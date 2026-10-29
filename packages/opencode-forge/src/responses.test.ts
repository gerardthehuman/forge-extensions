import { expect, test } from "bun:test";

import { responseObservation } from "@forge/models/response";

import { watchResponse } from "./responses.ts";

test("response watcher preserves split SSE bytes and captures the final usage", async () => {
  const observation = responseObservation();

  const frames = [
    'data: {"model":"vendor/',
    'cheap","choices":[]}\r\n\r\n',
    'data: {"usage":{"cost":0}}\n\n',
    "data: [DONE]\n\n",
  ];

  const source = frames.join("");
  let completed: boolean | undefined;

  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const frame of frames) {
        controller.enqueue(new TextEncoder().encode(frame));
      }

      controller.close();
    },
  });

  const watched = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    async (finished) => {
      completed = finished;
      await Promise.resolve();
    }
  );

  expect(await watched.text()).toBe(source);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBe(0);
  expect(completed).toBe(true);
});

test("response watcher reports cancellation and forwards it upstream", async () => {
  const observation = responseObservation();
  let cancelled = false;
  let completed: boolean | undefined;

  const source = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
    start(controller) {
      controller.enqueue(new TextEncoder().encode('data: {"model":"vendor/cheap"}\n\n'));
    },
  });

  const watched = watchResponse(
    new Response(source, { headers: { "content-type": "text/event-stream" } }),
    observation,
    async (finished) => {
      completed = finished;
      await Promise.resolve();
    }
  );

  const reader = watched.body?.getReader();

  if (!reader) {
    throw new Error("The response has no body");
  }

  await reader.read();
  // Let the next pull start before the consumer cancels the stream.
  await Promise.resolve();
  await reader.cancel();
  expect(cancelled).toBe(true);
  expect(completed).toBe(false);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBeUndefined();
});

test("response watcher observes non-streaming JSON without changing it", async () => {
  const observation = responseObservation();
  const body = '{"model":"vendor/cheap","usage":{"cost":0.00001}}';

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "application/json" } }),
    observation,
    async () => {
      await Promise.resolve();
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBe(0.00001);
});

test("response watcher observes CR-only SSE framing", async () => {
  const observation = responseObservation();
  const body = 'data: {"model":"vendor/floor","usage":{"cost":0.5}}\r\rdata: [DONE]\r\r';
  let complete: boolean | undefined;

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    async (value) => {
      complete = value;
      await Promise.resolve();
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/floor");
  expect(observation.cost).toBe(0.5);
  expect(complete).toBe(true);
});

test("a truncated SSE response without a terminal signal is incomplete", async () => {
  const observation = responseObservation();
  let complete: boolean | undefined;

  const body =
    'data: {"model":"vendor/floor","choices":[{"delta":{"content":"partial"},"finish_reason":null}]}\n\n';

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    async (value) => {
      complete = value;
      await Promise.resolve();
    }
  );

  expect(await response.text()).toBe(body);
  expect(complete).toBe(false);
});

test("a terminal finish reason permits an SSE stream without a done sentinel", async () => {
  const observation = responseObservation();
  let complete: boolean | undefined;
  const body = 'data: {"model":"vendor/floor","choices":[{"delta":{},"finish_reason":"stop"}]}\n\n';

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    async (value) => {
      complete = value;
      await Promise.resolve();
    }
  );

  expect(await response.text()).toBe(body);
  expect(complete).toBe(true);
});
