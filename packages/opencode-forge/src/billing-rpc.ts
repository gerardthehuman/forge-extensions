import { Rpc } from "@opencode/schema/rpc";
import { z } from "zod";

export const BillingQuestionPrefix = "call_forge_billing_";
export const BillingQuestion = "Which budget should pay for this session and its subagents?";
export const ProjectChargePrefix = "project:";

export const ChargeSchema = z.union([
  z.literal("personal"),
  z.templateLiteral([ProjectChargePrefix, z.uuid()]),
]);

const SessionInput = z.object({ sessionID: z.string() });

export const BillingRpc = Rpc.define({
  events: {},
  id: "forge.billing",
  methods: {
    choices: {
      input: SessionInput,
      output: z.object({
        choices: z.array(
          z.object({ description: z.string(), label: z.string(), target: ChargeSchema })
        ),
        current: ChargeSchema,
        sessionID: z.string(),
      }),
    },
    switch: {
      input: SessionInput.extend({ target: ChargeSchema }),
      output: z.null(),
    },
  },
});
