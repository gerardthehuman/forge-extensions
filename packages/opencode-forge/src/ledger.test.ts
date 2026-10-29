/* oxlint-disable func-style, require-await -- Async fakes match the storage interface. */
import { expect, spyOn, test } from "bun:test";

import { responseObservation } from "@forge/models/response";
import type { Context } from "@opencode/plugin/promise/plugin";

import { createResponseLedger } from "./ledger.ts";

type Value = Parameters<Context["storage"]["set"]>[1];

function fixture() {
  const entries = new Map<string, Value>();
  let failing = false;
  let unreadable = false;

  const storage = {
    scan: async ({ prefix }: { prefix: string }) => {
      if (unreadable) {
        throw new Error("Storage read failed");
      }

      return {
        entries: [...entries].flatMap(([key, value]) =>
          key.startsWith(prefix) ? [{ key, value }] : []
        ),
      };
    },
    set: async (key: string, value: Value) => {
      if (failing) {
        throw new Error("Storage write failed");
      }

      entries.set(key, value);
    },
  };

  return {
    entries,
    failReads: () => {
      unreadable = true;
    },
    failWrites: (value: boolean) => {
      failing = value;
    },
    ledger: createResponseLedger(storage),
  };
}

const request = { kind: "primary", provider: "forge", requested: "premium" } as const;

test("failed writes cannot be reported as a free session", async () => {
  const f = fixture();
  const logs = spyOn(console, "error").mockImplementation(() => {});

  try {
    f.failWrites(true);
    const record = await f.ledger.start("session", request);
    await f.ledger.finish(record, { ...responseObservation(), cost: 1.25 }, true);
    const report = await f.ledger.report("session");
    expect(report).toContain("No reported costs recorded.");
    expect(report).toContain("Recording failures: 1");
    expect(report).toContain("The recorded total is incomplete.");
    expect(report).not.toContain("Forge reported cost: $0.00");
  } finally {
    logs.mockRestore();
  }
});

test("a successful final write clears an earlier recording failure", async () => {
  const f = fixture();
  const logs = spyOn(console, "error").mockImplementation(() => {});

  try {
    f.failWrites(true);
    const record = await f.ledger.start("session", request);
    f.failWrites(false);
    await f.ledger.finish(record, { ...responseObservation(), cost: 0 }, true);
    const report = await f.ledger.report("session");
    expect(report).toContain("Forge reported cost: $0.00");
    expect(report).toContain("Responses with reported cost: 1");
    expect(report).not.toContain("Recording failures");
  } finally {
    logs.mockRestore();
  }
});

test("unreadable records make the reported total incomplete", async () => {
  const f = fixture();
  f.entries.set("responses/session/bad", null);
  const report = await f.ledger.report("session");
  expect(report).toContain("Unreadable records: 1");
  expect(report).toContain("The recorded total is incomplete.");
});

test("read failures report an unavailable total", async () => {
  const f = fixture();
  const logs = spyOn(console, "error").mockImplementation(() => {});

  try {
    f.failReads();
    expect(await f.ledger.report("session")).toBe(
      "Forge cost records could not be read. The total is unavailable."
    );
  } finally {
    logs.mockRestore();
  }
});
