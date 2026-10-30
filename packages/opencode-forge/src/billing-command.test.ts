import { expect, test } from "bun:test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { BillingQuestionPrefix, BillingRpc } from "./billing-rpc.ts";
import { startBillingServer } from "./billing-server.fixture.ts";

const Project = "project:11111111-1111-4111-8111-111111111111";
const PersonalNamedProject = "project:22222222-2222-4222-8222-222222222222";

const FormEventSchema = z.object({
  data: z.object({
    form: z.object({
      fields: z.tuple([
        z.object({
          description: z.string(),
          key: z.string(),
          options: z.array(z.object({ description: z.string(), label: z.string() })),
          title: z.string(),
          type: z.literal("string"),
        }),
      ]),
      id: z.string(),
      metadata: z.object({ kind: z.literal("question"), tool: z.object({ id: z.string() }) }),
      sessionID: z.string(),
    }),
  }),
  location: z.object({ directory: z.string(), workspaceID: z.string().optional() }).optional(),
  type: z.literal("form.created"),
});

const PermissionEventSchema = z.object({
  data: z.object({
    action: z.string(),
    id: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    resources: z.array(z.string()),
    sessionID: z.string(),
    source: z.object({ id: z.string(), messageID: z.string(), type: z.literal("tool") }).optional(),
  }),
  location: z.object({ directory: z.string() }).optional(),
  type: z.literal("permission.asked"),
});

test("the server billing command asks for a listed budget and preserves cancellation", async () => {
  const { directory, events, request, stop } = await startBillingServer({
    agents: {
      "billing-denied": {
        mode: "primary",
        permissions: [{ action: "question", effect: "deny", resource: "*" }],
      },
      "billing-hook-denied": {
        mode: "primary",
        permissions: [{ action: "question", effect: "allow", resource: "*" }],
      },
      "billing-late-policy": {
        mode: "primary",
        permissions: [{ action: "question", effect: "ask", resource: "*" }],
      },
      "billing-policy": {
        mode: "primary",
        permissions: [{ action: "question", effect: "allow", resource: "*" }],
      },
    },
    default_agent: "billing-denied",
  });

  try {
    const created = await request("/api/session", {
      agent: "build",
      location: { directory },
      metadata: { other: "keep" },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: session } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await created.json());

    const childResponse = await request("/api/session", { agent: "build", parentID: session.id });

    const { data: child } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await childResponse.json());

    const beforeResponse = await request(`/api/session/${session.id}/context`);
    const contextBefore = await beforeResponse.json();

    const available = await request("/api/rpc/forge.billing/choices", {
      input: { sessionID: session.id },
    });

    const { output: choices } = z
      .object({ output: BillingRpc.methods.choices.output })
      .parse(await available.json());

    const commands = await request("/api/command");

    const inventory = z
      .object({ data: z.array(z.object({ name: z.string() })) })
      .parse(await commands.json());

    expect(inventory.data.map((command) => command.name)).toContain("forge:billing");

    const stream = await events();

    const nextForm = async (sessionID = session.id) => {
      const event = await stream.next(
        FormEventSchema,
        (item) => item.data.form.sessionID === sessionID
      );

      return { ...event.data.form, location: event.location };
    };

    const nextPermission = async (sessionID: string) => {
      const event = await stream.next(
        PermissionEventSchema,
        (item) => item.data.sessionID === sessionID
      );

      return { ...event.data, location: event.location };
    };

    const run = async (sessionID = session.id) =>
      await request(`/api/session/${sessionID}/command`, { name: "forge:billing", text: "" });

    const billing = async (sessionID = session.id) => {
      const response = await request("/api/rpc/forge.billing/choices", { input: { sessionID } });

      return z.object({ output: BillingRpc.methods.choices.output }).parse(await response.json())
        .output;
    };

    const deniedSessionResponse = await request("/api/session", {
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: deniedSession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await deniedSessionResponse.json());

    const denied = await run(deniedSession.id);

    expect(denied.status).toBe(500);
    expect(await denied.text()).toContain("Permission denied: question");

    const deniedAgain = await run(deniedSession.id);

    expect(deniedAgain.status).toBe(500);
    expect(await deniedAgain.text()).toContain("Permission denied: question");

    const askRootResponse = await request("/api/session", {
      agent: "build",
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
      permissions: [{ action: "question", effect: "ask", resource: "*" }],
    });

    const { data: askRoot } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await askRootResponse.json());

    const askChildResponse = await request("/api/session", {
      agent: "build",
      parentID: askRoot.id,
    });

    const { data: askChild } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await askChildResponse.json());

    const awaitingApproval = run(askChild.id);
    void awaitingApproval.catch(() => {});
    const permission = await nextPermission(askChild.id);

    expect(permission.action).toBe("question");
    expect(permission.resources).toEqual(["*"]);
    expect(permission.source).toBeUndefined();
    expect(permission.location).toBeUndefined();

    const pendingResponse = await request(`/api/session/${askChild.id}/permission`);

    const pendingPermissions = z
      .object({ data: z.array(PermissionEventSchema.shape.data) })
      .parse(await pendingResponse.json());

    expect(pendingPermissions.data).toHaveLength(1);
    expect(pendingPermissions.data[0].source).toBeUndefined();

    const approved = await request(
      `/api/session/${askChild.id}/permission/${permission.id}/reply`,
      {
        decision: "once",
      }
    );

    expect(approved.status).toBe(204);

    const approvedForm = await nextForm(askChild.id);
    expect(approvedForm.location?.directory).toBe(directory);
    await request(`/api/session/${askChild.id}/form/${approvedForm.id}/reply`, {
      answer: { [approvedForm.fields[0].key]: "Test Project" },
    });

    const approvalResult = await awaitingApproval;
    const approvedBudget = await billing(askRoot.id);

    expect(approvalResult.status).toBe(204);
    expect(approvedBudget.current).toBe(Project);

    const rejectingApproval = run(askChild.id);
    const rejectedPermission = await nextPermission(askChild.id);

    const otherResponse = await request("/api/session", {
      agent: "build",
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
      permissions: [{ action: "question", effect: "ask", resource: "*" }],
    });

    const { data: otherSession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await otherResponse.json());

    const otherCommand = request(`/api/session/${otherSession.id}/command`, {
      name: "billing-test:permission",
      text: "",
    });

    const otherPermission = await nextPermission(otherSession.id);
    expect(otherPermission.metadata?.forgeBillingApproval).toBeUndefined();
    await request(`/api/session/${otherSession.id}/permission/${otherPermission.id}/reply`, {
      decision: "once",
    });

    const otherResult = await otherCommand;
    expect(otherResult.status).toBe(204);

    await request(`/api/session/${askChild.id}/permission/${rejectedPermission.id}/reply`, {
      decision: "reject",
      message: "Do not change this budget",
    });
    const rejection = await rejectingApproval;
    const rejectedBudget = await billing(askRoot.id);

    expect(rejection.status).toBe(500);
    expect(await rejection.text()).toContain("Do not change this budget");
    expect(rejectedBudget.current).toBe(Project);

    const policyResponse = await request("/api/session", {
      agent: "billing-policy",
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: policySession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await policyResponse.json());

    const policyCommand = run(policySession.id);
    const policyPermission = await nextPermission(policySession.id);
    expect(policyPermission.source).toBeUndefined();
    await request(`/api/session/${policySession.id}/permission/${policyPermission.id}/reply`, {
      decision: "once",
    });
    const policyForm = await nextForm(policySession.id);
    await request(`/api/session/${policySession.id}/form/${policyForm.id}`, undefined, "DELETE");

    const policyResult = await policyCommand;
    expect(policyResult.status).toBe(204);

    const hookDeniedResponse = await request("/api/session", {
      agent: "billing-hook-denied",
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: hookDeniedSession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await hookDeniedResponse.json());

    const hookDenied = await run(hookDeniedSession.id);
    expect(hookDenied.status).toBe(500);
    expect(await hookDenied.text()).toContain("Permission denied: question");

    const otherDirectory = path.join(directory, "other-project");
    await mkdir(otherDirectory);

    const otherLocationResponse = await request("/api/session", {
      agent: "build",
      location: { directory: otherDirectory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: otherLocationSession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await otherLocationResponse.json());

    const choosingElsewhere = run(otherLocationSession.id);
    const otherLocationForm = await nextForm(otherLocationSession.id);

    expect(otherLocationForm.location?.directory).toBe(otherDirectory);
    await request(
      `/api/session/${otherLocationSession.id}/form/${otherLocationForm.id}`,
      undefined,
      "DELETE"
    );

    const elsewhereResult = await choosingElsewhere;
    expect(elsewhereResult.status).toBe(204);

    const choosing = run();
    const form = await nextForm();

    expect(form.location?.directory).toBe(directory);
    expect(form.fields[0]).toMatchObject({
      description:
        "Which budget should pay for this session and its subagents?\nCurrent budget: Personal Budget",
      options: choices.choices.map(({ description, label }) => ({ description, label })),
      title: "Forge billing",
      type: "string",
    });
    expect(form.fields[0].options).toContainEqual({
      description: "$21.10 available",
      label: "Personal Budget (22222222-2222-4222-8222-222222222222)",
    });

    const duplicate = await run(child.id);

    expect(duplicate.status).toBe(500);
    expect(await duplicate.text()).toContain("A Forge billing selection is already open");

    const selected = await request(`/api/session/${session.id}/form/${form.id}/reply`, {
      answer: { [form.fields[0].key]: "Test Project" },
    });

    const chosen = await choosing;
    const rootChoice = await billing();
    const childChoice = await billing(child.id);
    const afterChoice = await request(`/api/session/${session.id}/context`);

    expect(selected.status).toBe(204);
    expect(form.metadata.tool.id.startsWith(BillingQuestionPrefix)).toBe(true);
    expect(chosen.status).toBe(204);
    expect(rootChoice.current).toBe(Project);
    expect(childChoice.current).toBe(Project);
    expect(await afterChoice.json()).toEqual(contextBefore);

    const cancelling = run();
    const cancelledForm = await nextForm();

    expect(cancelledForm.fields[0].description).toContain("Current budget: Test Project");

    const cancelled = await request(
      `/api/session/${session.id}/form/${cancelledForm.id}`,
      undefined,
      "DELETE"
    );

    const cancellation = await cancelling;
    const afterCancellation = await billing();

    expect(cancelled.status).toBe(204);
    expect(cancellation.status).toBe(204);
    expect(afterCancellation.current).toBe(Project);

    const unavailableQuestion = run();
    const unavailableForm = await nextForm();
    await request(
      `/api/session/${session.id}/form/${unavailableForm.id}?message=client-cannot-show`,
      undefined,
      "DELETE"
    );
    const unavailableResult = await unavailableQuestion;
    const unavailableBudget = await billing();

    expect(unavailableResult.status).toBe(500);
    expect(await unavailableResult.text()).toContain("client-cannot-show");
    expect(unavailableBudget.current).toBe(Project);

    const choosingCustom = run();
    const customForm = await nextForm();

    const custom = await request(`/api/session/${session.id}/form/${customForm.id}/reply`, {
      answer: { [customForm.fields[0].key]: "personal" },
    });

    const customResult = await choosingCustom;
    const afterCustom = await billing();

    expect(custom.status).toBe(204);
    expect(customResult.status).toBe(500);
    expect(afterCustom.current).toBe(Project);

    const choosingNamedProject = run(child.id);
    const namedProjectForm = await nextForm(child.id);

    await request(`/api/session/${child.id}/form/${namedProjectForm.id}/reply`, {
      answer: {
        [namedProjectForm.fields[0].key]: "Personal Budget (22222222-2222-4222-8222-222222222222)",
      },
    });

    const namedProjectResult = await choosingNamedProject;
    const afterNamedProject = await billing();

    expect(namedProjectResult.status).toBe(204);
    expect(afterNamedProject.current).toBe(PersonalNamedProject);

    const choosingPersonal = run();
    const personalForm = await nextForm();

    await request(`/api/session/${session.id}/form/${personalForm.id}/reply`, {
      answer: { [personalForm.fields[0].key]: "Personal Budget" },
    });

    const personalResult = await choosingPersonal;
    const afterPersonal = await billing(child.id);
    const finalContext = await request(`/api/session/${session.id}/context`);

    expect(personalResult.status).toBe(204);
    expect(afterPersonal.current).toBe("personal");
    expect(await finalContext.json()).toEqual(contextBefore);
    expect(await Bun.file(path.join(directory, "model-context.json")).exists()).toBe(false);

    const duringCleanup = run(askChild.id);
    void duringCleanup.catch(() => {});
    const cleanupPermission = await nextPermission(askChild.id);
    expect(cleanupPermission.source).toBeUndefined();

    const unrelatedDuringCleanup = request(`/api/session/${askChild.id}/command`, {
      name: "billing-test:permission",
      text: "",
    });

    void unrelatedDuringCleanup.catch(() => {});
    const unrelatedPermission = await nextPermission(askChild.id);
    expect(unrelatedPermission.metadata?.forgeBillingApproval).toBeUndefined();

    const lateResponse = await request("/api/session", {
      agent: "billing-late-policy",
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: lateSession } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await lateResponse.json());

    const lateCommand = run(lateSession.id);
    void lateCommand.catch(() => {});
    await request(`/api/session/${session.id}/command`, {
      name: "billing-test:wait-bridge",
      text: "",
    });
    await request(`/api/session/${session.id}/command`, {
      name: "billing-test:add-late-policy",
      text: "",
    });
    await request(`/api/session/${session.id}/command`, {
      name: "billing-test:wait-late-policy",
      text: "",
    });

    const cleanupCommand = request(`/api/session/${session.id}/command`, {
      name: "billing-test:stop",
      text: "",
    });

    await request(`/api/session/${session.id}/command`, {
      name: "billing-test:wait-stop",
      text: "",
    });

    const cleanup = await cleanupCommand;
    expect(cleanup.status).toBe(204);

    await request(`/api/session/${session.id}/command`, {
      name: "billing-test:release-late-policy",
      text: "",
    });

    const cancelledDuringCleanup = await duringCleanup;
    const lateResult = await lateCommand;

    expect(cancelledDuringCleanup.status).toBe(204);
    expect(lateResult.status).toBe(204);

    const remainingPermissions = await request(`/api/session/${askChild.id}/permission`);

    const remaining = z
      .object({ data: z.array(z.object({ id: z.string() })) })
      .parse(await remainingPermissions.json());

    expect(remaining.data).toEqual([{ id: unrelatedPermission.id }]);
    await request(`/api/session/${askChild.id}/permission/${unrelatedPermission.id}/reply`, {
      decision: "once",
    });

    const unrelatedResult = await unrelatedDuringCleanup;
    expect(unrelatedResult.status).toBe(204);
    const remainingLate = await request(`/api/session/${lateSession.id}/permission`);
    expect(
      z.object({ data: z.array(z.object({ id: z.string() })) }).parse(await remainingLate.json())
        .data
    ).toEqual([]);
  } finally {
    await stop();
  }
}, 15_000);
