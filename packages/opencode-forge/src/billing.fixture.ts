/* eslint-disable require-await -- The test double implements asynchronous Forge APIs. */
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { Model, Plugin, Provider } from "@opencode/plugin";

import { registerBilling } from "./billing.ts";

export default Plugin.define({
  id: "billing-test",
  async setup(ctx) {
    const providerID = Provider.ID.make("billing-test");
    await ctx.provider.transform((editor) => {
      editor.add({
        info: Object.assign(Provider.Info.empty(providerID), {
          activation: "enabled" as const,
          name: "Test",
          package: "@opencode/ai/providers/openai-compatible",
          settings: { apiKey: "test", baseURL: "http://127.0.0.1:1" },
        }),
        models: [Model.Info.default(providerID, Model.ID.make("test"))],
      });
    });
    await registerBilling(ctx, async () => ({
      projectBudget: {
        chargeContext: async () => ({
          enabled: true,
          projects: [
            {
              accentColor: null,
              canCharge: true,
              projectId: "11111111-1111-4111-8111-111111111111",
              remainingUsd: 42,
              status: "active",
              title: "Test Project",
            },
          ],
        }),
        sessionSwitch: async () => ({ ok: true }),
        state: async () => ({
          accentColor: null,
          canCharge: true,
          projectId: "11111111-1111-4111-8111-111111111111",
          remainingUsd: 42,
          status: "active",
          title: "Test Project",
        }),
      },
      usage: () => ({
        value: Promise.resolve({ budget: { dailyBudgetUsd: 50, remainingUsd: 12.34 } }),
      }),
    }));

    await ctx.session.hook("context", async (event) => {
      await writeFile(
        path.join(ctx.location.directory, "model-context.json"),
        JSON.stringify(event.messages)
      );
      throw new Error("Captured the model request before network access");
    });
  },
});
