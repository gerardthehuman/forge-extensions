/* eslint-disable func-style -- Named declarations describe the accounting boundary. */
import { switchNotice } from "@forge/models/response";
import type { ResponseObservation } from "@forge/models/response";
import type { Context } from "@opencode/plugin/promise/plugin";
import { z } from "zod";

const RecordSchema = z.object({
  cost: z.number().nonnegative().nullable(),
  kind: z.enum(["primary", "compaction", "title", "generate"]),
  model: z.string().nullable(),
  notice: z.string().nullable(),
  provider: z.string(),
  requested: z.string(),
  status: z.enum(["pending", "complete", "incomplete"]),
});

type ResponseRecord = z.infer<typeof RecordSchema>;

type Storage = Pick<Context["storage"], "set" | "scan">;

type Request = Pick<ResponseRecord, "kind" | "provider" | "requested">;

const prefix = (sessionID: string) => `responses/${sessionID}/`;

function costMessage(records: ResponseRecord[], failed: number, unreadable: number): string {
  let reported = 0;
  let missing = 0;
  let pending = 0;
  let incomplete = 0;
  let total = 0;
  const switches = new Set<string>();
  const models = new Map<string, number>();

  for (const record of records) {
    if (record.cost === null) {
      missing += 1;
    } else {
      reported += 1;
      total += record.cost;
    }

    if (record.status === "pending") {
      pending += 1;
    }

    if (record.status === "incomplete") {
      incomplete += 1;
    }

    if (record.notice !== null) {
      switches.add(record.notice);
    }

    if (record.model !== null) {
      const label = `${record.provider}/${record.model} (${record.kind})`;
      models.set(label, (models.get(label) ?? 0) + 1);
    }
  }

  const amount =
    total > 0 && total < 0.000000000001
      ? total.toExponential(4)
      : total.toLocaleString("en-US", { maximumFractionDigits: 12, minimumFractionDigits: 2 });

  return [
    reported ? `Forge reported cost: $${amount}` : "No reported costs recorded.",
    `Responses with reported cost: ${reported}`,
    `Responses without reported cost: ${missing}`,
    ...(pending ? [`Responses still pending: ${pending}`] : []),
    ...(incomplete ? [`Interrupted responses: ${incomplete}`] : []),
    ...(failed ? [`Recording failures: ${failed}`] : []),
    ...(unreadable ? [`Unreadable records: ${unreadable}`] : []),
    ...(failed || unreadable ? ["The recorded total is incomplete."] : []),
    ...[...models].map(([model, count]) => `Reported model: ${model} ×${count}`),
    ...switches,
    "The total covers recorded responses only and may be incomplete.",
    "OpenCode's built-in cost remains an estimate.",
  ].join("\n");
}

export function createResponseLedger(storage: Storage) {
  const failures = new Map<string, Set<string>>();

  const mark = (sessionID: string, key: string, failed: boolean) => {
    const entries = failures.get(sessionID) ?? new Set<string>();

    if (failed) {
      entries.add(key);
    } else {
      entries.delete(key);
    }

    if (entries.size) {
      failures.set(sessionID, entries);
    } else {
      failures.delete(sessionID);
    }
  };

  const save = async (sessionID: string, key: string, record: ResponseRecord) => {
    try {
      await storage.set(key, record);
      mark(sessionID, key, false);
    } catch (error) {
      mark(sessionID, key, true);
      console.error("[forge] Could not record response usage:", error);
    }
  };

  return {
    async finish(
      ref: { key: string; record: ResponseRecord; sessionID: string },
      observation: ResponseObservation,
      complete: boolean
    ) {
      const notice = switchNotice(ref.record.requested, observation);

      await save(ref.sessionID, ref.key, {
        ...ref.record,
        cost: observation.cost ?? null,
        model: observation.model ?? null,
        notice: notice ?? null,
        status: complete ? "complete" : "incomplete",
      });

      return notice;
    },
    async report(sessionID: string) {
      const records: ResponseRecord[] = [];
      let unreadable = 0;
      let after: string | undefined;

      try {
        do {
          // oxlint-disable-next-line no-await-in-loop -- Storage pages must be read in cursor order.
          const page = await storage.scan({ after, prefix: prefix(sessionID) });

          for (const entry of page.entries) {
            const parsed = RecordSchema.safeParse(entry.value);

            if (parsed.success) {
              records.push(parsed.data);
            } else {
              unreadable += 1;
            }
          }

          after = page.next;
        } while (after !== undefined);
      } catch (error) {
        console.error("[forge] Could not read response usage:", error);

        return "Forge cost records could not be read. The total is unavailable.";
      }

      return costMessage(records, failures.get(sessionID)?.size ?? 0, unreadable);
    },
    async start(sessionID: string, request: Request) {
      const key = `${prefix(sessionID)}${crypto.randomUUID()}`;

      const record: ResponseRecord = {
        ...request,
        cost: null,
        model: null,
        notice: null,
        status: "pending",
      };

      await save(sessionID, key, record);

      return { key, record, sessionID };
    },
  };
}
