/* eslint-disable func-style -- Named declarations keep the approval lifecycle easy to follow. */
import type { Context } from "@opencode/plugin/promise/plugin";

export type CancellablePermission = (
  input: Parameters<Context["permission"]["assert"]>[0],
  signal: AbortSignal
) => Promise<void>;

interface BillingQuestionSource {
  agent: string;
  callID: string;
  messageID: string;
  sessionID: string;
}

export function createBillingApprovalBridge(
  ctx: Context,
  assertPermission: CancellablePermission,
  signal: AbortSignal
) {
  const pending = new Set<Promise<void>>();

  const register = async ({ agent, callID, messageID, sessionID }: BillingQuestionSource) => {
    const token = crypto.randomUUID();
    let rejection: unknown;

    const registration = await ctx.permission.hook("evaluate", async (event) => {
      if (
        event.action !== "question" ||
        event.sessionID !== sessionID ||
        event.agent !== agent ||
        event.resources.length !== 1 ||
        event.resources[0] !== "*"
      ) {
        return;
      }

      if (event.source === undefined && event.metadata?.forgeBillingApproval === token) {
        if (event.effect !== "deny") {
          event.effect = signal.aborted ? "deny" : "ask";
        }

        return;
      }

      if (
        event.effect !== "ask" ||
        event.source?.type !== "tool" ||
        event.source.id !== callID ||
        event.source.messageID !== messageID
      ) {
        return;
      }

      if (signal.aborted) {
        event.effect = "deny";

        return;
      }

      // Repeat the decision without a fictitious tool source. Preserve an escalation to
      // "ask" even when another policy depends on the original source.
      const approval = assertPermission(
        {
          action: "question",
          agent,
          metadata: { forgeBillingApproval: token },
          resources: ["*"],
          sessionID,
        },
        signal
      );

      pending.add(approval);

      try {
        await approval;
        event.effect = signal.aborted ? "deny" : "allow";
      } catch (error) {
        rejection = error;
        event.effect = "deny";
        event.message = error instanceof Error ? error.message : String(error);
      } finally {
        pending.delete(approval);
      }
    });

    return { dispose: registration.dispose, rejection: () => rejection };
  };

  return {
    register,
    stop: async () => {
      await Promise.allSettled(pending);
    },
  };
}
