/* eslint-disable require-await -- Async fakes preserve the APIs' promise rejection behavior. */
import { expect, test } from "bun:test";
import assert from "node:assert/strict";

import type { ForgeClient } from "@forge/code-client";
import type { Context } from "@opencode/plugin/promise/plugin";

import { billingRequest, chargeTo, rootSession, switchBilling, usageMessage } from "./billing.ts";

const ProjectId = "11111111-1111-4111-8111-111111111111";
const Project = `project:${ProjectId}`;

const fixture = (initial = "personal") => {
  let metadata: NonNullable<Awaited<ReturnType<Context["session"]["get"]>>["metadata"]> = {
    forge: { chargeTo: initial, retained: true },
    other: "keep",
  };

  let childMetadata: typeof metadata = {
    forge: { chargeTo: Project, retained: "child" },
    other: "child",
  };

  const operations: string[] = [];
  let failWrite = false;
  let failLog = false;

  const session = {
    get: async ({ sessionID }) => ({
      cost: 0,
      id: sessionID,
      location: { directory: "/workspace" },
      metadata: sessionID === "child" ? childMetadata : metadata,
      parentID: sessionID === "child" ? "root" : undefined,
      projectID: "workspace",
      time: { created: 0, updated: 0 },
      tokens: { cache: { read: 0, write: 0 }, input: 0, output: 0, reasoning: 0 },
    }),
    update: async (input) => {
      operations.push("write");

      if (failWrite) {
        throw new Error("write failed");
      }

      if (input.sessionID === "child") {
        childMetadata = input.metadata ?? childMetadata;
      } else {
        metadata = input.metadata ?? metadata;
      }
    },
  } satisfies Pick<Context["session"], "get" | "update">;

  const forge = {
    projectBudget: {
      chargeContext: async () => ({ enabled: true, projects: [] }),
      sessionSwitch: async ({ from, to }) => {
        operations.push(`${from} -> ${to}`);

        if (failLog) {
          throw new Error("log failed");
        }

        return { ok: true };
      },
      state: async () => {
        throw new Error("unused");
      },
    },
  } satisfies Pick<ForgeClient, "projectBudget">;

  return {
    ctx: { session },
    failLog: () => {
      failLog = true;
    },
    failWrite: () => {
      failWrite = true;
    },
    forge,
    metadata: (sessionID = "root") => (sessionID === "child" ? childMetadata : metadata),
    operations,
  };
};

test("workers resolve the root's billing and preserve unrelated metadata", async () => {
  const f = fixture();
  const root = await rootSession(f.ctx, "child");
  expect({ chargeTo: chargeTo(root), id: root.id }).toEqual({ chargeTo: "personal", id: "root" });
  await switchBilling(f.ctx, f.forge, "child", Project);

  expect(f.operations).toEqual([`personal -> ${Project}`, "write"]);
  expect(chargeTo(await rootSession(f.ctx, "child"))).toBe(Project);
  expect(f.metadata()).toEqual({ forge: { chargeTo: Project, retained: true }, other: "keep" });
  expect(f.metadata("child")).toEqual({
    forge: { chargeTo: Project, retained: "child" },
    other: "child",
  });
});

test("a rejected project switch leaves the session on Personal", async () => {
  const f = fixture();
  f.failLog();
  await assert.rejects(switchBilling(f.ctx, f.forge, "root", Project), /log failed/u);
  expect(f.operations).toEqual([`personal -> ${Project}`]);
  expect(f.metadata()).toHaveProperty("forge.chargeTo", "personal");
});

test("a failed metadata write records a compensating project switch", async () => {
  const f = fixture();
  f.failWrite();
  await assert.rejects(switchBilling(f.ctx, f.forge, "root", Project), /write failed/u);
  expect(f.operations).toEqual([`personal -> ${Project}`, "write", `${Project} -> personal`]);
});

test("switching to Personal saves before recording the switch", async () => {
  const f = fixture(Project);
  await switchBilling(f.ctx, f.forge, "root", "personal");
  expect(f.operations).toEqual(["write", `${Project} -> personal`]);
  expect(f.metadata()).toHaveProperty("forge.chargeTo", "personal");
});

test("choosing the current budget does not write or log", async () => {
  const f = fixture(Project);
  await switchBilling(f.ctx, f.forge, "root", Project);
  expect(f.operations).toEqual([]);
});

test("invalid billing metadata fails instead of charging Personal", () => {
  expect(() => chargeTo({ metadata: { forge: { chargeTo: "project:invalid" } } })).toThrow(
    "invalid Forge billing"
  );
});

test("Desktop requests carry billing headers without changing the body", async () => {
  const original = new Request("http://localhost/chat/completions", {
    body: '{"model":"example"}',
    method: "POST",
  });

  const request = await billingRequest(original, "forge", Project, "Fix ü");
  expect(request.headers.get("x-forge-charge-to")).toBe(Project);
  expect(request.headers.get("x-forge-session-title")).toBe(encodeURIComponent("Fix ü"));
  expect(await request.text()).toBe('{"model":"example"}');
});

test("Router requests merge attribution and replace stale project billing", async () => {
  const original = new Request("http://localhost/chat/completions", {
    body: JSON.stringify({
      forge_usage: { chargeTo: Project, purpose: "retained" },
      model: "example",
    }),
    headers: { authorization: "Bearer test", "content-length": "1" },
    method: "POST",
  });

  const request = await billingRequest(original, "forge-router", "personal", "Session title");
  expect(await request.json()).toEqual({
    forge_usage: { chargeTo: "personal", purpose: "retained", sessionTitle: "Session title" },
    model: "example",
  });
  expect(request.headers.get("authorization")).toBe("Bearer test");
  expect(request.headers.has("content-length")).toBe(false);
});

test("usage names the selected account and shows totals only when available", () => {
  expect(usageMessage({ available: 12.34, name: "Personal", total: 50 })).toBe(
    "Forge Billing: Personal\n$12.34 of $50.00 left"
  );
  expect(usageMessage({ available: 42, name: "Test Project", total: undefined })).toBe(
    "Forge Billing: Test Project\n$42.00 left"
  );
});
