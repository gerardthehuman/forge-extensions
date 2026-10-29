import { Model, Plugin, Provider } from "@opencode/plugin";
import { Money } from "@opencode/schema/money";

import { registerBilling } from "./billing.ts";
import { registerResponses } from "./responses.ts";

export default Plugin.define({
  id: "forge-response-test",
  async setup(ctx) {
    for (const provider of ["forge", "forge-router"]) {
      const providerID = Provider.ID.make(provider);
      // The fixture needs both provider registrations before the session starts.
      // oxlint-disable-next-line no-await-in-loop
      await ctx.provider.transform((editor) => {
        editor.add({
          info: Object.assign(Provider.Info.empty(providerID), {
            activation: "enabled" as const,
            name: provider,
            package: "@opencode/ai/providers/openai-compatible",
            settings: { apiKey: "test", baseURL: process.env.FORGE_RESPONSE_TEST_URL },
          }),
          models: [
            {
              ...Model.Info.default(providerID, Model.ID.make("expensive")),
              cost: [
                {
                  cache: {
                    read: Money.USDPerMillionTokens.make(0),
                    write: Money.USDPerMillionTokens.make(0),
                  },
                  input: Money.USDPerMillionTokens.make(1000),
                  output: Money.USDPerMillionTokens.make(1000),
                },
              ],
            },
            Model.Info.default(providerID, Model.ID.make("vendor/floor")),
            Model.Info.default(providerID, Model.ID.make("manual")),
          ],
        });
      });
    }

    await registerBilling(ctx);
    await registerResponses(ctx);
    await ctx.session.hook("title", (event) => {
      event.result = "Test";
    });
  },
});
