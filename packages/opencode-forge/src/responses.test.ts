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
  let completions = 0;

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
    () => {
      completions += 1;
    }
  );

  expect(await watched.text()).toBe(source);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBe(0);
  expect(completions).toBe(1);
});

test("response watcher reports cancellation and forwards it upstream", async () => {
  const observation = responseObservation();
  let cancelled = false;
  let completions = 0;

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
    () => {
      completions += 1;
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
  expect(completions).toBe(1);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBeUndefined();
});

test("response watcher forwards stream errors and completes once", async () => {
  const observation = responseObservation();
  let upstream: ReadableStreamDefaultController<Uint8Array> | undefined;
  let completions = 0;

  const source = new ReadableStream<Uint8Array>({
    start(controller) {
      upstream = controller;
      controller.enqueue(new TextEncoder().encode('data: {"model":"vendor/cheap"}\n\n'));
    },
  });

  const watched = watchResponse(
    new Response(source, { headers: { "content-type": "text/event-stream" } }),
    observation,
    () => {
      completions += 1;
    }
  );

  const reader = watched.body?.getReader();

  if (reader === undefined || upstream === undefined) {
    throw new Error("The response has no stream");
  }

  await reader.read();
  upstream.error(new Error("Upstream stream failed"));
  let failure: unknown;

  try {
    await reader.read();
  } catch (error) {
    failure = error;
  }

  expect(failure).toBeInstanceOf(Error);
  expect(failure).toHaveProperty("message", "Upstream stream failed");
  expect(observation.model).toBe("vendor/cheap");
  expect(completions).toBe(1);
});

test("response watcher observes non-streaming JSON without changing it", async () => {
  const observation = responseObservation();
  const body = '{"model":"vendor/cheap","usage":{"cost":0.00001}}';
  let completions = 0;

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "application/json" } }),
    observation,
    () => {
      completions += 1;
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/cheap");
  expect(observation.cost).toBe(0.00001);
  expect(completions).toBe(1);
});

test("response watcher observes CR-only SSE framing", async () => {
  const observation = responseObservation();
  const body = 'data: {"model":"vendor/floor","usage":{"cost":0.5}}\r\rdata: [DONE]\r\r';
  let completions = 0;

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    () => {
      completions += 1;
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/floor");
  expect(observation.cost).toBe(0.5);
  expect(completions).toBe(1);
});

test("a truncated SSE response retains the observed model", async () => {
  const observation = responseObservation();
  let completions = 0;

  const body =
    'data: {"model":"vendor/floor","choices":[{"delta":{"content":"partial"},"finish_reason":null}]}\n\n';

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    () => {
      completions += 1;
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/floor");
  expect(completions).toBe(1);
});

test("an SSE response without a done sentinel retains the observed model", async () => {
  const observation = responseObservation();
  let completions = 0;
  const body = 'data: {"model":"vendor/floor","choices":[{"delta":{},"finish_reason":"stop"}]}\n\n';

  const response = watchResponse(
    new Response(body, { headers: { "content-type": "text/event-stream" } }),
    observation,
    () => {
      completions += 1;
    }
  );

  expect(await response.text()).toBe(body);
  expect(observation.model).toBe("vendor/floor");
  expect(completions).toBe(1);
});

test("a response without a body still completes", () => {
  const observation = responseObservation(new Headers({ "x-forge-model": "vendor/floor" }));
  const source = new Response(null, { status: 204 });
  let completions = 0;

  const response = watchResponse(source, observation, () => {
    completions += 1;
  });

  expect(response).toBe(source);
  expect(observation.routedModel).toBe("vendor/floor");
  expect(completions).toBe(1);
});
