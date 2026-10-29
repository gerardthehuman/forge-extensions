import { expect, test } from "bun:test";

import { observeResponseData, responseObservation, switchNotice } from "./response.ts";

test("response observations keep the actual model and zero cost", () => {
  const response = responseObservation(
    new Headers({ "x-forge-model": "vendor/floor", "x-forge-model-clamped": "1" })
  );

  observeResponseData(response, '{"model":"vendor/actual","usage":{"cost":0}}');
  observeResponseData(response, "[DONE]");
  expect(response).toEqual({
    clamped: true,
    cost: 0,
    model: "vendor/actual",
    routedModel: "vendor/floor",
  });
  expect(switchNotice("vendor/requested", response)).toBe(
    "Forge routed vendor/requested to vendor/floor. The response reported vendor/actual."
  );
});

test("a clamp header does not claim its model responded", () => {
  const response = responseObservation(
    new Headers({ "x-forge-model": "vendor/floor", "x-forge-model-clamped": "1" })
  );

  expect(switchNotice("vendor/requested", response)).toBe(
    "Forge routed vendor/requested to vendor/floor. The responding model is unknown."
  );
  observeResponseData(response, '{"model":"vendor/requested"}');
  expect(switchNotice("vendor/requested", response)).toBe(
    "Forge routed vendor/requested to vendor/floor. The response reported vendor/requested."
  );
});

test("invalid models and costs do not overwrite valid observations", () => {
  const response = responseObservation();
  observeResponseData(response, '{"model":"vendor/model","usage":{"cost":0.123}}');
  observeResponseData(response, '{"model":"unsafe\\u001bmodel","usage":{"cost":-1}}');
  observeResponseData(response, "not json");
  expect(response.model).toBe("vendor/model");
  expect(response.cost).toBe(0.123);
});
