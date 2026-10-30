/* eslint-disable func-style -- The wrapper is a named plugin factory. */
import { Plugin as EffectPlugin } from "@opencode/plugin/effect";
import { AssertInput } from "@opencode/plugin/permission";
import { fromPromise } from "@opencode/plugin/promise/adapter";
import type { CommandDefinition, CommandInvocation } from "@opencode/plugin/promise/command";
import type { Context, Plugin } from "@opencode/plugin/promise/plugin";
import { Effect, Schema } from "effect";
import type { Scope } from "effect";

import type { CancellablePermission } from "./billing-permission.ts";

type QuestionExecutor = Awaited<ReturnType<Context["tool"]["list"]>>[number]["execute"];

type QuestionCommand = Omit<CommandDefinition, "execute"> & {
  execute: (input: CommandInvocation, question: QuestionExecutor) => Promise<void>;
};

export interface ServerRuntime {
  assertPermission: CancellablePermission;
  registerQuestionCommand: (command: QuestionCommand) => Promise<void>;
}

interface ServerPlugin {
  id: string;
  setup: (ctx: Context, runtime: ServerRuntime) => ReturnType<Plugin["setup"]>;
}

export function withServerRuntime(plugin: ServerPlugin) {
  return EffectPlugin.define({
    effect: (host) =>
      Effect.gen(function* setupPlugin() {
        const scope = yield* Effect.context<Scope.Scope>();
        const run = Effect.runPromiseWith(scope);

        // The Promise API cannot interrupt a single pending permission request.
        const assertPermission: CancellablePermission = async (input, signal) => {
          await run(
            Schema.decodeUnknownEffect(AssertInput)(input).pipe(
              Effect.flatMap(host.permission.assert)
            ),
            { signal }
          );
        };

        const registerQuestionCommand: ServerRuntime["registerQuestionCommand"] = async (
          command
        ) => {
          await run(
            host.command.transform((editor) => {
              editor.add({
                description: command.description,
                execute: (invocation) =>
                  Effect.gen(function* executeCommand() {
                    // The command's context carries the session location for form events.
                    const location = yield* Effect.context();
                    const runLocated = Effect.runPromiseWith(location);

                    const question: QuestionExecutor = async (input, context) => {
                      const tools = await runLocated(host.tool.list());
                      const tool = tools.find((item) => item.id === "question");

                      if (tool === undefined) {
                        throw new Error("The OpenCode question tool is unavailable.");
                      }

                      return await runLocated(
                        tool.execute(input, {
                          agent: context.agent,
                          id: context.id,
                          messageID: context.messageID,
                          progress: (update) =>
                            Effect.promise(async () => {
                              await context.progress(update);
                            }),
                          sessionID: context.sessionID,
                        }),
                        { signal: context.signal }
                      );
                    };

                    yield* Effect.tryPromise({
                      catch: (error) => error,
                      try: async () => {
                        await command.execute(invocation, question);
                      },
                    });
                  }),
                name: command.name,
              });
            })
          );
        };

        yield* fromPromise({
          id: plugin.id,
          setup: async (ctx) =>
            await plugin.setup(ctx, { assertPermission, registerQuestionCommand }),
        }).effect(host);
      }),
    id: plugin.id,
  });
}
