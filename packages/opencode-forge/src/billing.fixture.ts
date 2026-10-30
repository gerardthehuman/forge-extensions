/* eslint-disable require-await -- The test double implements asynchronous Forge APIs. */
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { Model, Provider } from "@opencode/plugin";

import { registerBilling } from "./billing.ts";
import { withServerRuntime } from "./server-runtime.ts";

export default withServerRuntime({
  id: "billing-test",
  async setup(ctx, runtime) {
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

    const projects = [
      {
        accentColor: null,
        canCharge: true,
        projectId: "11111111-1111-4111-8111-111111111111",
        remainingUsd: 42,
        status: "active" as const,
        title: "Test Project",
      },
      {
        accentColor: null,
        canCharge: true,
        projectId: "22222222-2222-4222-8222-222222222222",
        remainingUsd: 21.1,
        status: "active" as const,
        title: "Personal Budget",
      },
    ];

    const bridgeReached = Promise.withResolvers<undefined>();
    const releaseBridge = Promise.withResolvers<undefined>();
    const latePolicyReached = Promise.withResolvers<undefined>();
    const releaseLatePolicy = Promise.withResolvers<undefined>();
    const stopStarted = Promise.withResolvers<undefined>();

    await ctx.permission.hook("evaluate", async (event) => {
      if (event.agent === "billing-policy" && event.action === "question" && event.source) {
        event.effect = "ask";
      }

      if (event.agent === "billing-hook-denied" && event.action === "question") {
        event.effect = "deny";
        event.message = "Denied by the test policy";
      }

      if (event.agent === "billing-late-policy" && event.action === "question" && event.source) {
        bridgeReached.resolve(undefined);
        await releaseBridge.promise;
      }
    });

    const stopBilling = await registerBilling(ctx, runtime, async () => ({
      projectBudget: {
        chargeContext: async () => ({
          enabled: true,
          projects,
        }),
        sessionSwitch: async () => ({ ok: true }),
        state: async (projectId) => {
          const project = projects.find((item) => item.projectId === projectId);

          if (project === undefined) {
            throw new Error("Project not found");
          }

          return project;
        },
      },
      usage: () => ({
        value: Promise.resolve({ budget: { dailyBudgetUsd: 50, remainingUsd: 12.34 } }),
      }),
    }));

    await ctx.command.transform((editor) => {
      editor.add({
        execute: async () => {
          const stopping = stopBilling();
          stopStarted.resolve(undefined);
          await stopping;
        },
        name: "billing-test:stop",
      });
      editor.add({
        execute: async () => {
          await stopStarted.promise;
        },
        name: "billing-test:wait-stop",
      });
      editor.add({
        execute: async ({ sessionID }) => {
          await ctx.permission.assert({ action: "question", resources: ["*"], sessionID });
        },
        name: "billing-test:permission",
      });
      editor.add({
        execute: async () => {
          await bridgeReached.promise;
        },
        name: "billing-test:wait-bridge",
      });
      editor.add({
        execute: async () => {
          await ctx.permission.hook("evaluate", async (event) => {
            if (
              event.agent === "billing-late-policy" &&
              event.action === "question" &&
              event.source === undefined &&
              event.metadata?.forgeBillingApproval !== undefined
            ) {
              latePolicyReached.resolve(undefined);
              await releaseLatePolicy.promise;
            }
          });
          releaseBridge.resolve(undefined);
        },
        name: "billing-test:add-late-policy",
      });
      editor.add({
        execute: async () => {
          await latePolicyReached.promise;
        },
        name: "billing-test:wait-late-policy",
      });
      editor.add({
        execute: async () => {
          releaseLatePolicy.resolve(undefined);
        },
        name: "billing-test:release-late-policy",
      });
    });

    await ctx.session.hook("context", async (event) => {
      await writeFile(
        path.join(ctx.location.directory, "model-context.json"),
        JSON.stringify(event.messages)
      );
      throw new Error("Captured the model request before network access");
    });

    return stopBilling;
  },
});
