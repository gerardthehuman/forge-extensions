/* eslint-disable anti-slop/no-chained-type-assertions, typescript/no-unsafe-type-assertion -- The fixture supplies only the APIs used by setup. */
/* eslint-disable func-style -- Named declarations keep the cache fixture easy to follow. */
import { expect, mock, test } from "bun:test";

import type { Context } from "@opencode/plugin/tui/context";

import { BillingQuestionPrefix } from "./billing-rpc.ts";

await mock.module("@opencode/plugin/tui", () => ({
  Plugin: { define: <T>(plugin: T) => plugin },
}));

const { default: plugin } = await import("../tui.ts");

interface FormEvent {
  data: { form: { metadata: unknown; sessionID: string } };
  location?: { directory: string };
}

function cachedRequests(serverRequests: string[]) {
  const synchronized: string[] = [];
  const invalidated: string[] = [];
  let cacheValid = true;
  let visible: string[] = [];

  return {
    invalidate: (sessionID: string) => {
      invalidated.push(sessionID);
      cacheValid = false;
    },
    invalidated,
    list: () => visible,
    sync: async (sessionID: string) => {
      synchronized.push(sessionID);

      // OpenCode does not refetch a list until its cached value is invalidated.
      if (!cacheValid) {
        visible = serverRequests;
        cacheValid = true;
      }

      await Promise.resolve();
    },
    synchronized,
  };
}

test("the TUI keeps its palette action and synchronizes unlocated billing questions", async () => {
  const layers: { commands: { id: string; palette?: boolean; slash?: unknown }[] }[] = [];
  const forms = cachedRequests(["ses_child"]);
  let stopped = false;

  let onForm: ((event: FormEvent) => void) | undefined;

  // SAFETY: Setup uses only these fixture APIs. This test does not run the palette command.
  const context = {
    data: {
      on: (_type: string, handler: (event: FormEvent) => void) => {
        onForm = handler;

        return () => {
          stopped = true;
        };
      },
      session: { form: forms },
    },
    keymap: {
      layer: (factory: () => (typeof layers)[number]) => layers.push(factory()),
    },
  } as unknown as Context;

  const cleanup = await plugin.setup(context);
  expect(layers).toHaveLength(1);
  expect(layers[0].commands).toHaveLength(1);
  expect(layers[0].commands[0]).toMatchObject({ id: "forge.billing", palette: true });
  expect(layers[0].commands[0]).not.toHaveProperty("slash");

  if (onForm === undefined) {
    throw new Error("The form listener was not registered");
  }

  const metadata = { kind: "question", tool: { id: `${BillingQuestionPrefix}test` } };
  onForm({ data: { form: { metadata, sessionID: "ses_child" } } });
  onForm({
    data: { form: { metadata, sessionID: "ses_located" } },
    location: { directory: "/workspace" },
  });
  onForm({
    data: {
      form: {
        metadata: { kind: "question", tool: { id: "another_tool" } },
        sessionID: "ses_other",
      },
    },
  });
  expect(forms.synchronized).toEqual(["ses_child"]);
  expect(forms.invalidated).toEqual(["ses_child"]);
  expect(forms.list()).toEqual(["ses_child"]);

  if (cleanup !== undefined) {
    await cleanup();
  }

  expect(stopped).toBe(true);
});
