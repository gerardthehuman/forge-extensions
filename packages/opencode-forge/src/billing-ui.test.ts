import { expect, test } from "bun:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { BillingRpc } from "./billing-rpc.ts";
import { startBillingServer } from "./billing-server.fixture.ts";

test("billing forms reject free text and transcript notices stay out of model requests", async () => {
  const server = await startBillingServer();
  const { directory } = server;

  try {
    const request = async (
      route: string,
      body?: z.infer<ReturnType<typeof z.json>>,
      method = body === undefined ? "GET" : "POST"
    ) => {
      const response = await server.request(route, body, method);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response;
    };

    const created = await request("/api/session", {
      location: { directory },
      model: { id: "test", providerID: "billing-test" },
    });

    const { data: session } = z
      .object({ data: z.object({ id: z.string() }) })
      .parse(await created.json());

    const before = await request(`/api/session/${session.id}/context`);
    const transcript = await before.json();

    const stream = await server.events();

    const event = stream.next(
      z.object({
        data: z.object({
          form: z.object({
            fields: z.array(
              z.object({
                custom: z.boolean(),
                options: z.array(z.object({ description: z.string(), label: z.string() })),
              })
            ),
            id: z.string(),
          }),
        }),
        location: z.object({ directory: z.string() }).optional(),
        type: z.literal("form.created"),
      })
    );

    const available = await request("/api/rpc/forge.billing/choices", {
      input: { sessionID: session.id },
    });

    const { output } = z
      .object({ output: BillingRpc.methods.choices.output })
      .parse(await available.json());

    await request(`/api/session/${session.id}/form`, {
      fields: [
        {
          custom: false,
          key: "budget",
          options: output.choices.map((choice) => ({
            description: choice.description,
            label: choice.label,
            value: choice.target,
          })),
          required: true,
          type: "string",
        },
      ],
      sessionID: session.id,
      title: "Forge billing",
    });
    const form = await event;
    // Creating the form through the client API supplies the TUI event location.
    expect(form.location?.directory).toBe(directory);
    expect(form.data.form.fields[0]).toEqual({
      custom: false,
      options: [
        { description: "$12.34 available", label: "Personal Budget" },
        { description: "$42.00 available", label: "Test Project" },
        {
          description: "$21.10 available",
          label: "Personal Budget (22222222-2222-4222-8222-222222222222)",
        },
      ],
    });
    await assert.rejects(
      request(`/api/session/${session.id}/form/${form.data.form.id}/reply`, {
        answer: { budget: "anything" },
      })
    );
    await request(`/api/session/${session.id}/form/${form.data.form.id}/reply`, {
      answer: { budget: "personal" },
    });
    await request("/api/rpc/forge.billing/switch", {
      input: { sessionID: session.id, target: "personal" },
    });
    const after = await request(`/api/session/${session.id}/context`);
    expect(await after.json()).toEqual(transcript);
    await request("/api/rpc/forge.billing/switch", {
      input: { sessionID: session.id, target: "project:11111111-1111-4111-8111-111111111111" },
    });
    const changed = await request(`/api/session/${session.id}/inbox`);

    const notice = z
      .object({
        data: z.array(
          z.object({
            payload: z.object({
              description: z.string().optional(),
              metadata: z.object({ forgeBillingNotice: z.boolean() }).optional(),
              text: z.string(),
            }),
            type: z.string(),
          })
        ),
      })
      .parse(await changed.json());

    expect(notice.data.map((item) => ({ type: item.type, ...item.payload }))).toEqual([
      {
        description: "Forge Billing: Personal → Test Project\n$42.00 left",
        metadata: { forgeBillingNotice: true },
        text: "Forge Billing: Personal → Test Project\n$42.00 left",
        type: "synthetic",
      },
    ]);
    await request("/api/rpc/forge.billing/switch", {
      input: { sessionID: session.id, target: "personal" },
    });
    const reverted = await request(`/api/session/${session.id}/inbox`);

    const descriptions = z
      .object({ data: z.array(z.object({ payload: z.object({ description: z.string() }) })) })
      .parse(await reverted.json());

    expect(descriptions.data.map((item) => item.payload.description)).toEqual([
      "Forge Billing: Personal → Test Project\n$42.00 left",
      "Forge Billing: Test Project → Personal\n$12.34 left",
    ]);
    await request(`/api/session/${session.id}/prompt`, { text: "Hello" });
    let captured = "";

    for (let attempt = 0; attempt < 100; attempt += 1) {
      // Wait for the isolated server to assemble the request and run its hooks.
      // oxlint-disable-next-line no-await-in-loop
      captured = await readFile(path.join(directory, "model-context.json"), "utf-8").catch(
        () => ""
      );

      if (captured !== "") {
        break;
      }

      // oxlint-disable-next-line no-await-in-loop
      await Bun.sleep(10);
    }

    expect(captured).toContain("Hello");
    expect(captured).not.toContain("Forge Billing");
  } finally {
    await server.stop();
  }
}, 15_000);
