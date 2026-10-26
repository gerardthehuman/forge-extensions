import { Plugin } from "@opencode/plugin/tui";
import type { Context } from "@opencode/plugin/tui/context";
import { Form } from "@opencode/schema/form";
import type { z } from "zod";

import { BillingRpc, ChargeSchema } from "./src/billing-rpc.ts";

type BillingChoices = z.infer<typeof BillingRpc.methods.choices.output>;

const pickBudget = async (ctx: Context, choices: BillingChoices, signal: AbortSignal) => {
  signal.throwIfAborted();

  const id = Form.ID.create();

  const { promise: answer, resolve: finish } = Promise.withResolvers<string | undefined>();

  const reply = ctx.data.on("form.replied", (event) => {
    if (event.data.id === id) {
      const parsed = ChargeSchema.safeParse(event.data.answer.budget);
      finish(parsed.success ? parsed.data : undefined);
    }
  });

  const cancel = ctx.data.on("form.cancelled", (event) => {
    if (event.data.id === id) {
      finish(undefined);
    }
  });

  const abort = () => {
    finish(undefined);
  };

  signal.addEventListener("abort", abort, { once: true });

  try {
    await ctx.client.session.form.create({
      fields: [
        {
          custom: false,
          default: choices.choices.some((choice) => choice.target === choices.current)
            ? choices.current
            : "personal",
          key: "budget",
          options: choices.choices.map((choice) => ({
            description: choice.description,
            label: choice.label,
            value: choice.target,
          })),
          required: true,
          title: "Which budget should pay for this session and its subagents?",
          type: "string",
        },
      ],
      id,
      sessionID: choices.sessionID,
      title: "Forge billing",
    });
    await ctx.data.session.form.sync(choices.sessionID);

    return await answer;
  } finally {
    reply();
    cancel();
    signal.removeEventListener("abort", abort);

    if (signal.aborted) {
      await ctx.client.session.form
        .cancel({ formID: id, sessionID: choices.sessionID })
        .catch(() => {
          // The form may already have settled during plugin cleanup.
        });
    }
  }
};

export default Plugin.define({
  id: "forge",
  setup(ctx) {
    const controller = new AbortController();
    let pending = false;
    ctx.keymap.layer(() => ({
      commands: [
        {
          group: "Forge",
          id: "forge.billing",
          palette: true,
          run: async () => {
            if (pending) {
              return;
            }

            pending = true;

            try {
              const route = ctx.ui.router.current();

              const session =
                route.type === "session"
                  ? await ctx.client.session.get({ sessionID: route.sessionID })
                  : await ctx.client.session.create({ location: ctx.location });

              const billing = ctx.client.rpc(BillingRpc);
              const options = { location: session.location };
              const choices = await billing.choices({ sessionID: session.id }, options);
              ctx.ui.router.navigate({ sessionID: choices.sessionID, type: "session" });
              const target = await pickBudget(ctx, choices, controller.signal);

              if (target !== undefined) {
                await billing.switch(
                  { sessionID: choices.sessionID, target: ChargeSchema.parse(target) },
                  options
                );
              }
            } catch (error) {
              ctx.ui.toast.show({
                message: error instanceof Error ? error.message : String(error),
                title: "Forge billing",
                variant: "error",
              });
            } finally {
              pending = false;
            }
          },
          slash: { name: "forge:billing" },
          title: "Forge: choose billing budget",
        },
      ],
      mode: "global",
    }));

    return () => {
      controller.abort();
    };
  },
});
