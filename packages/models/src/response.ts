/* eslint-disable func-style -- Named declarations describe response observations. */
import { z } from "zod";

const ModelSchema = z
  .string()
  .min(1)
  .max(256)
  .regex(/^[\w./:~-]+$/u);

const ChunkSchema = z.object({
  choices: z
    .array(z.object({ finish_reason: z.string().nullish() }))
    .optional()
    .catch(undefined),
  error: z.record(z.string(), z.unknown()).optional().catch(undefined),
  finish_reason: z.string().nullish().catch(undefined),
  model: ModelSchema.optional().catch(undefined),
  usage: z.object({ cost: z.number().nonnegative().optional() }).optional().catch(undefined),
});

const TerminalReasons = new Set([
  "stop",
  "tool_calls",
  "function_call",
  "length",
  "content_filter",
  "error",
]);

export interface ResponseObservation {
  model?: string;
  cost?: number;
  clamped: boolean;
  routedModel?: string;
}

export function responseObservation(headers?: Headers): ResponseObservation {
  const routed = ModelSchema.safeParse(headers?.get("x-forge-model"));

  return {
    clamped: headers?.get("x-forge-model-clamped") === "1",
    routedModel: routed.success ? routed.data : undefined,
  };
}

export function observeResponseData(observation: ResponseObservation, data: string): boolean {
  try {
    const parsed = ChunkSchema.safeParse(JSON.parse(data));

    if (parsed.success) {
      observation.model = parsed.data.model ?? observation.model;
      observation.cost = parsed.data.usage?.cost ?? observation.cost;

      return (
        parsed.data.error !== undefined ||
        (parsed.data.finish_reason !== undefined &&
          parsed.data.finish_reason !== null &&
          TerminalReasons.has(parsed.data.finish_reason)) ||
        (parsed.data.choices?.some(
          (choice) =>
            choice.finish_reason !== undefined &&
            choice.finish_reason !== null &&
            TerminalReasons.has(choice.finish_reason)
        ) ??
          false)
      );
    }
  } catch {
    // Comments, sentinels, and malformed provider events carry no usage.
  }

  return false;
}

export function switchNotice(
  requested: string,
  observation: ResponseObservation
): string | undefined {
  if (
    observation.clamped &&
    observation.routedModel !== undefined &&
    observation.routedModel !== requested
  ) {
    if (observation.model === undefined) {
      return `Forge routed ${requested} to ${observation.routedModel}. The responding model is unknown.`;
    }

    if (observation.model !== observation.routedModel) {
      return `Forge routed ${requested} to ${observation.routedModel}. The response reported ${observation.model}.`;
    }
  }

  if (observation.model !== undefined && observation.model !== requested) {
    return `Forge used ${observation.model} instead of ${requested}.`;
  }

  return undefined;
}
