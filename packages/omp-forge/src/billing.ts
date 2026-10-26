/* eslint-disable func-style -- Named declarations keep billing workflows easy to follow. */
import { useForgeClient } from "@forge/code-client";
import type { ForgeClient } from "@forge/code-client";
import { streamSimple } from "@oh-my-pi/pi-ai";
import type { Api, SimpleStreamOptions } from "@oh-my-pi/pi-ai";
import { AgentRegistry, Text } from "@oh-my-pi/pi-coding-agent";
import type {
  ExtensionAPI,
  ExtensionContext,
  ProviderModelConfig,
} from "@oh-my-pi/pi-coding-agent";
import { z } from "zod";

const ChargeSchema = z.union([z.literal("personal"), z.templateLiteral(["project:", z.uuid()])]);
const BillingSchema = z.object({ chargeTo: ChargeSchema });
const BillingType = "forge-billing";
const BillingApi = "forge-billing-completions";
const Contexts = new Map<string, ExtensionContext>();
const ModelApis = new Map<string, Api>();

type BillingClient = Pick<ForgeClient, "projectBudget"> & {
  usage: () => { value: Promise<{ budget: { dailyBudgetUsd: number; remainingUsd: number } }> };
};

export function billingSession(ctx: Pick<ExtensionContext, "agent" | "sessionManager">) {
  if (ctx.agent.kind === "main") {
    return ctx.sessionManager;
  }

  let agent = AgentRegistry.global().get(ctx.agent.id);
  const visited = new Set<string>();

  while (agent?.parentId !== undefined) {
    if (visited.has(agent.id)) {
      throw new Error("Cannot resolve the Forge billing session: circular parent agents.");
    }

    visited.add(agent.id);
    agent = AgentRegistry.global().get(agent.parentId);
  }

  if (!agent?.session) {
    throw new Error("Cannot resolve the parent Forge billing session.");
  }

  return agent.session.sessionManager;
}

export function chargeTo(session: Pick<ExtensionContext["sessionManager"], "getEntries">) {
  const entry = session
    .getEntries()
    .findLast((candidate) => candidate.type === "custom" && candidate.customType === BillingType);

  if (entry?.type !== "custom") {
    return "personal";
  }

  return BillingSchema.parse(entry.data).chargeTo;
}

export async function billingAccount(forge: BillingClient, target: string) {
  if (target === "personal") {
    const usage = await forge.usage().value;

    return {
      available: usage.budget.remainingUsd,
      name: "Personal",
      total: usage.budget.dailyBudgetUsd,
    };
  }

  const project = await forge.projectBudget.state(target.slice(8));

  return { available: project.remainingUsd, name: project.title, total: undefined };
}

export function usageMessage(account: Awaited<ReturnType<typeof billingAccount>>) {
  const amount = `$${account.available.toFixed(2)}`;

  return `Forge Billing: ${account.name}\n${account.total === undefined ? `${amount} left` : `${amount} of $${account.total.toFixed(2)} left`}`;
}

export function billingModels<T extends Pick<ProviderModelConfig, "id" | "api">>(
  provider: string,
  models: T[]
) {
  return models.map((model) => {
    ModelApis.set(`${provider}/${model.id}`, model.api ?? "openai-completions");

    return { ...model, api: BillingApi };
  });
}

function requestContext(options: SimpleStreamOptions | undefined) {
  const sessionId = options?.sessionId;

  const active = AgentRegistry.global()
    .list()
    .find((agent) => agent.session?.sessionId === sessionId);

  const context = active?.session
    ? Contexts.get(active.session.sessionManager.getSessionId())
    : undefined;

  const ctx = context ?? (sessionId === undefined ? undefined : Contexts.get(sessionId));

  if (!ctx) {
    throw new Error("Cannot resolve the Forge billing account for this request.");
  }

  return ctx;
}

export const BillingProvider = {
  api: BillingApi,
  streamSimple: ((model, context, options) => {
    const ctx = requestContext(options);
    const session = billingSession(ctx);
    const target = chargeTo(session);
    const title = (session.getSessionName() ?? "").slice(0, 200);
    const api = ModelApis.get(`${model.provider}/${model.id}`);

    if (api === undefined) {
      throw new Error(`Cannot resolve the Forge model API: ${model.id}`);
    }

    return streamSimple({ ...model, api }, context, {
      ...options,
      headers:
        model.provider === "forge"
          ? {
              ...options?.headers,
              "x-forge-charge-to": target,
              "x-forge-session-title": encodeURIComponent(title),
            }
          : options?.headers,
      // The host holds the custom stream permit. Native delegation must not reacquire it.
      loopGuard: { ...options?.loopGuard, enabled: false },
      maxInFlightRequests: {},
      onPayload: async (payload, originalModel, signal) => {
        const changed = await options?.onPayload?.(payload, originalModel, signal);

        if (model.provider !== "forge-router") {
          return changed;
        }

        const body = z.record(z.string(), z.unknown()).parse(changed ?? payload);
        const usage = z.record(z.string(), z.unknown()).parse(body.forge_usage ?? {});

        return { ...body, forge_usage: { ...usage, chargeTo: target, sessionTitle: title } };
      },
    });
  }) satisfies NonNullable<Parameters<ExtensionAPI["registerProvider"]>[1]["streamSimple"]>,
};

function canSelectBilling(ctx: Pick<ExtensionContext, "agent" | "hasUI">) {
  return ctx.hasUI && ctx.agent.kind === "main";
}

export function registerBilling(
  pi: ExtensionAPI,
  connect: () => Promise<BillingClient> = useForgeClient
) {
  const show = (text: string) => {
    // Render details, leaving the model-facing content empty even for auxiliary requests.
    pi.sendMessage(
      { content: [], customType: BillingType, details: { text }, display: true },
      { triggerTurn: false }
    );
  };

  pi.registerMessageRenderer<{ text: string }>(
    BillingType,
    (message) => new Text(message.details?.text ?? "", 0, 0)
  );

  pi.on("session_start", (_event, ctx) => {
    Contexts.set(ctx.sessionManager.getSessionId(), ctx);
  });
  pi.on("session_switch", (_event, ctx) => {
    Contexts.set(ctx.sessionManager.getSessionId(), ctx);
  });
  pi.on("before_agent_start", (_event, ctx) => {
    Contexts.set(ctx.sessionManager.getSessionId(), ctx);
  });

  pi.on("context", (event, ctx) => {
    Contexts.set(ctx.sessionManager.getSessionId(), ctx);

    return {
      messages: event.messages.filter(
        (message) => message.role !== "custom" || message.customType !== BillingType
      ),
    };
  });

  pi.on("session_shutdown", (_event, ctx) => {
    Contexts.delete(ctx.sessionManager.getSessionId());
  });

  pi.registerCommand("forge:usage", {
    description: "Show the current Forge billing account and remaining budget",
    handler: async (_args, ctx) => {
      try {
        const forge = await connect();
        show(usageMessage(await billingAccount(forge, chargeTo(billingSession(ctx)))));
      } catch {
        show(
          "Forge balance unavailable. Start Forge Desktop and wait for its usage snapshot, then run /forge:usage again."
        );
      }
    },
  });

  let selecting = false;

  pi.registerCommand("forge:billing", {
    description: "Choose Personal Budget or a project budget",
    handler: async (_args, ctx) => {
      if (selecting) {
        ctx.ui.notify("A Forge billing selection is already open.", "info");

        return;
      }

      selecting = true;

      try {
        if (!canSelectBilling(ctx)) {
          throw new Error("Run /forge:billing in the main interactive session.");
        }

        const session = billingSession(ctx);
        const sessionId = session.getSessionId();
        const previous = chargeTo(session);
        const forge = await connect();

        const [context, usage] = await Promise.all([
          forge.projectBudget.chargeContext(ctx.cwd),
          forge.usage().value,
        ]);

        const projects = context.enabled
          ? context.projects.filter((project) => project.canCharge && project.status === "active")
          : [];

        const choices = [
          {
            description: `$${usage.budget.remainingUsd.toFixed(2)} available`,
            label: "Personal Budget",
            target: "personal",
          },
          ...projects.map((project) => ({
            description: `$${project.remainingUsd.toFixed(2)} available`,
            label:
              projects.filter((candidate) => candidate.title === project.title).length > 1
                ? `${project.title} (${project.projectId})`
                : project.title,
            target: ChargeSchema.parse(`project:${project.projectId}`),
          })),
        ].map((choice, index) => ({
          ...choice,
          label: `${index + 1}. ${choice.label}${choice.target === previous ? " (current)" : ""}`,
        }));

        const answer = await ctx.ui.select("Forge Billing", choices, {
          initialIndex: Math.max(
            0,
            choices.findIndex((choice) => choice.target === previous)
          ),
          selectionMarker: "radio",
        });

        const selected = choices.find((choice) => choice.label === answer);

        if (!selected || selected.target === previous) {
          return;
        }

        if (sessionId !== ctx.sessionManager.getSessionId()) {
          throw new Error("The session changed. Run /forge:billing again.");
        }

        const target = ChargeSchema.parse(selected.target);

        const previousName =
          previous === "personal"
            ? "Personal"
            : await forge.projectBudget
                .state(previous.slice(8))
                .then((project) => project.title)
                .catch(() => previous);

        const account = await billingAccount(forge, target);
        const projectId = target === "personal" ? previous.slice(8) : target.slice(8);

        if (target !== "personal") {
          await forge.projectBudget.sessionSwitch({
            from: previous,
            projectId,
            sessionId,
            to: target,
          });
        }

        try {
          pi.appendEntry(BillingType, { chargeTo: target });
        } catch (error) {
          if (target !== "personal") {
            try {
              await forge.projectBudget.sessionSwitch({
                from: target,
                projectId,
                sessionId,
                to: previous,
              });
            } catch (rollbackError) {
              console.error("[forge] Could not record the billing rollback:", rollbackError);
            }
          }

          throw error;
        }

        if (target === "personal") {
          try {
            await forge.projectBudget.sessionSwitch({
              from: previous,
              projectId,
              sessionId,
              to: target,
            });
          } catch (error) {
            console.error(
              "[forge] Billing switched to Personal, but recording the switch failed:",
              error
            );
          }
        }

        show(
          `Forge Billing: ${previousName} → ${account.name}\n$${account.available.toFixed(2)} left`
        );
      } catch (error) {
        ctx.ui.notify(
          error instanceof Error ? error.message : "Forge billing is unavailable.",
          "error"
        );
      } finally {
        selecting = false;
      }
    },
  });
}
