/* eslint-disable func-style -- Named declarations keep billing workflows easy to follow. */
import { useForgeClient } from "@forge/code-client";
import type { ForgeClient } from "@forge/code-client";
import type { Context } from "@opencode/plugin/promise/plugin";
import { Agent } from "@opencode/schema/agent";
import { SessionMessage } from "@opencode/schema/session-message";
import { Tool } from "@opencode/schema/tool";
import { z } from "zod";

import { createBillingApprovalBridge } from "./billing-permission.ts";
import {
  BillingQuestionPrefix,
  BillingQuestion,
  BillingRpc,
  ChargeSchema,
  ProjectChargePrefix,
} from "./billing-rpc.ts";
import type { ServerRuntime } from "./server-runtime.ts";

const MetadataSchema = z.object({
  forge: z.object({ chargeTo: ChargeSchema.optional() }).optional(),
});

type BillingSession = Awaited<ReturnType<Context["session"]["get"]>>;

interface BillingContext {
  session: Pick<Context["session"], "get" | "update">;
}

export async function rootSession(ctx: BillingContext, sessionID: string) {
  const visited = new Set<string>();
  let session = await ctx.session.get({ sessionID });

  while (session.parentID !== undefined) {
    if (visited.has(session.id)) {
      throw new Error("Cannot resolve the billing session: circular parent sessions.");
    }

    visited.add(session.id);
    // Each parent ID comes from the preceding session lookup.
    // oxlint-disable-next-line no-await-in-loop
    session = await ctx.session.get({ sessionID: session.parentID });
  }

  return session;
}

export function chargeTo(session: Pick<BillingSession, "metadata">) {
  const parsed = MetadataSchema.safeParse(session.metadata ?? {});

  if (!parsed.success) {
    throw new Error("The session has an invalid Forge billing setting.");
  }

  return parsed.data.forge?.chargeTo ?? "personal";
}

function billingMetadata(session: BillingSession, target: string) {
  const previous = z.record(z.string(), z.json()).catch({}).parse(session.metadata?.forge);

  return { ...session.metadata, forge: { ...previous, chargeTo: target } };
}

export async function switchBilling(
  ctx: BillingContext,
  forge: Pick<ForgeClient, "projectBudget">,
  sessionID: string,
  target: string
) {
  const next = ChargeSchema.parse(target);
  const session = await rootSession(ctx, sessionID);
  const previous = chargeTo(session);

  if (previous === next) {
    return;
  }

  const write = async () => {
    const fresh = await ctx.session.get({ sessionID: session.id });
    await ctx.session.update({ metadata: billingMetadata(fresh, next), sessionID: session.id });
  };

  if (next === "personal") {
    await write();

    if (previous !== "personal") {
      try {
        await forge.projectBudget.sessionSwitch({
          from: previous,
          projectId: previous.slice(ProjectChargePrefix.length),
          sessionId: session.id,
          to: next,
        });
      } catch (error) {
        console.error(
          "[forge] Billing switched to Personal, but recording the switch failed:",
          error
        );
      }
    }

    return;
  }

  const projectId = next.slice(ProjectChargePrefix.length);
  await forge.projectBudget.sessionSwitch({
    from: previous,
    projectId,
    sessionId: session.id,
    to: next,
  });

  try {
    await write();
  } catch (error) {
    try {
      await forge.projectBudget.sessionSwitch({
        from: next,
        projectId,
        sessionId: session.id,
        to: previous,
      });
    } catch (rollbackError) {
      console.error("[forge] Could not record the billing rollback:", rollbackError);
    }

    throw error;
  }
}

export async function billingRequest(
  request: Request,
  providerID: string,
  target: string,
  title: string
) {
  if (providerID === "forge") {
    const headers = new Headers(request.headers);
    headers.set("x-forge-charge-to", target);
    headers.set("x-forge-session-title", encodeURIComponent(title.slice(0, 200)));

    return new Request(request, { headers });
  }

  const body = z.record(z.string(), z.unknown()).parse(await request.clone().json());
  const usage = z.record(z.string(), z.unknown()).parse(body.forge_usage ?? {});
  body.forge_usage = { ...usage, chargeTo: target, sessionTitle: title.slice(0, 200) };
  const headers = new Headers(request.headers);
  headers.delete("content-length");

  return new Request(request, { body: JSON.stringify(body), headers, method: request.method });
}

type BillingClient = Pick<ForgeClient, "projectBudget"> & {
  usage: () => { value: Promise<{ budget: { dailyBudgetUsd: number; remainingUsd: number } }> };
};

type BillingChoices = z.infer<typeof BillingRpc.methods.choices.output>["choices"];

function uniqueChoices(choices: BillingChoices) {
  const labels = new Set<string>();

  return choices.map((choice) => {
    let { label } = choice;
    let suffix = 0;

    while (labels.has(label)) {
      suffix += 1;

      const account =
        choice.target === "personal" ? "personal" : choice.target.slice(ProjectChargePrefix.length);

      label = `${choice.label} (${account}${suffix > 1 ? `, ${suffix}` : ""})`;
    }

    labels.add(label);

    return { ...choice, label };
  });
}

export async function billingAccount(ctx: BillingContext, forge: BillingClient, sessionID: string) {
  const root = await rootSession(ctx, sessionID);
  const target = chargeTo(root);

  if (target === "personal") {
    const usage = await forge.usage().value;

    return {
      available: usage.budget.remainingUsd,
      name: "Personal",
      total: usage.budget.dailyBudgetUsd,
    };
  }

  const project = await forge.projectBudget.state(target.slice(ProjectChargePrefix.length));

  return { available: project.remainingUsd, name: project.title, total: undefined };
}

export function usageMessage(account: Awaited<ReturnType<typeof billingAccount>>) {
  const amount = `$${account.available.toFixed(2)}`;

  return `Forge Billing: ${account.name}\n${account.total === undefined ? `${amount} left` : `${amount} of $${account.total.toFixed(2)} left`}`;
}

export async function billingNotice(
  ctx: Pick<Context, "session">,
  sessionID: string,
  description: string
) {
  await ctx.session.synthetic({
    description,
    metadata: { forgeBillingNotice: true },
    resume: false,
    sessionID,
    text: description,
  });
}

export async function registerBilling(
  ctx: Context,
  runtime: ServerRuntime,
  connect: () => Promise<BillingClient> = useForgeClient
) {
  const controller = new AbortController();
  const pending = new Set<string>();
  const approvals = createBillingApprovalBridge(ctx, runtime.assertPermission, controller.signal);

  await ctx.rpc.register(BillingRpc, {
    choices: async ({ sessionID }) => {
      const root = await rootSession(ctx, sessionID);
      const forge = await connect();

      const [context, usage] = await Promise.all([
        forge.projectBudget.chargeContext(root.location.directory),
        forge.usage().value,
      ]);

      const projects = context.enabled
        ? context.projects.filter((project) => project.canCharge && project.status === "active")
        : [];

      return {
        choices: uniqueChoices([
          {
            description: `$${usage.budget.remainingUsd.toFixed(2)} available`,
            label: "Personal Budget",
            target: "personal" as const,
          },
          ...projects.map((project) => ({
            description: `$${project.remainingUsd.toFixed(2)} available`,
            label:
              projects.filter((candidate) => candidate.title === project.title).length > 1
                ? `${project.title} (${project.projectId})`
                : project.title,
            target: ChargeSchema.parse(`${ProjectChargePrefix}${project.projectId}`),
          })),
        ]),
        current: chargeTo(root),
        sessionID: root.id,
      };
    },
    switch: async ({ sessionID, target }) => {
      const root = await rootSession(ctx, sessionID);
      const previous = chargeTo(root);

      if (previous === target) {
        return null;
      }

      const forge = await connect();
      let previousName = "Personal";

      if (previous !== "personal") {
        try {
          const project = await forge.projectBudget.state(
            previous.slice(ProjectChargePrefix.length)
          );

          previousName = project.title;
        } catch {
          // An unavailable previous project must not prevent switching away from it.
          previousName = previous;
        }
      }

      await switchBilling(ctx, forge, root.id, target);
      const account = await billingAccount(ctx, forge, root.id);
      await billingNotice(
        ctx,
        root.id,
        `Forge Billing: ${previousName} → ${account.name}\n$${account.available.toFixed(2)} left`
      );

      return null;
    },
  });

  await runtime.registerQuestionCommand({
    description: "Choose the Forge budget for this session",
    execute: async ({ sessionID }, question) => {
      const root = await rootSession(ctx, sessionID);

      if (pending.has(root.id)) {
        throw new Error("A Forge billing selection is already open for this session.");
      }

      pending.add(root.id);

      try {
        const billing = ctx.rpc(BillingRpc);
        const choices = await billing.choices({ sessionID: root.id });
        const options = choices.choices;
        const current = options.find((option) => option.target === choices.current);
        const askingSession = root.id === sessionID ? root : await ctx.session.get({ sessionID });
        let { agent } = askingSession;

        if (agent === undefined) {
          const availableAgents = await ctx.agent.list();
          agent =
            availableAgents.data.find(
              (candidate) => candidate.mode !== "subagent" && !candidate.hidden
            )?.id ?? "build";
        }

        // The question tool requires tool IDs, but a server command has no corresponding message.
        const callID = Tool.CallID.make(`${BillingQuestionPrefix}${crypto.randomUUID()}`);
        const messageID = SessionMessage.ID.create();
        const agentID = Agent.ID.make(agent);

        const permission = await approvals.register({
          agent: agentID,
          callID,
          messageID,
          sessionID,
        });

        let result;

        try {
          result = await question(
            {
              questions: [
                {
                  header: "Forge billing",
                  options: options.map(({ description, label }) => ({ description, label })),
                  question: `${BillingQuestion}\nCurrent budget: ${current?.label ?? "Unavailable"}`,
                },
              ],
            },
            {
              agent: agentID,
              id: callID,
              messageID,
              // The question tool does not report progress.
              // oxlint-disable-next-line typescript/promise-function-async
              progress: () => Promise.resolve(),
              sessionID,
              signal: controller.signal,
            }
          );
        } catch (error) {
          if (
            controller.signal.aborted ||
            (error instanceof Error && error.message.includes("The user dismissed this question"))
          ) {
            return;
          }

          const approvalError = permission.rejection();

          if (approvalError instanceof Error) {
            throw approvalError;
          }

          if (approvalError !== undefined) {
            throw new Error("Forge billing approval was rejected.", { cause: error });
          }

          throw error;
        } finally {
          await permission.dispose();
        }

        if (controller.signal.aborted) {
          return;
        }

        const answer = z.object({ answers: z.tuple([z.array(z.string())]) }).parse(result.output);
        const [selected] = answer.answers;

        const choice =
          selected.length === 1
            ? options.find((option) => option.label === selected[0])
            : undefined;

        if (choice === undefined) {
          throw new Error("Choose one of the listed Forge budgets.");
        }

        await billing.switch({ sessionID: root.id, target: choice.target });
      } finally {
        pending.delete(root.id);
      }
    },
    name: "forge:billing",
  });

  // Notices are durable UI annotations. Remove them from every model request,
  // including compaction, auxiliary generation, and title generation.
  for (const kind of ["context", "compaction", "generate", "title"] as const) {
    // Hook registration order is deterministic.
    // oxlint-disable-next-line no-await-in-loop
    await ctx.session.hook(kind, async (event) => {
      const history = await ctx.session.context({ sessionID: event.sessionID });

      const notices = new Set(
        history
          .filter(
            (message) =>
              message.metadata?.forgeBillingNotice === true ||
              message.metadata?.forgeResponseNotice === true
          )
          .map((message) => message.id)
      );

      event.messages = event.messages.filter(
        (message) => message.id === undefined || !notices.has(message.id)
      );
    });
  }

  for (const providerID of ["forge", "forge-router"]) {
    // Preserve hook registration order during plugin setup.
    // oxlint-disable-next-line no-await-in-loop
    await ctx.session.hook(
      "http.request",
      async (event) => {
        const root = await rootSession(ctx, event.sessionID);
        event.request = await billingRequest(
          event.request,
          providerID,
          chargeTo(root),
          root.title ?? ""
        );
      },
      { providerID }
    );
  }

  return async () => {
    controller.abort();
    await approvals.stop();
  };
}
