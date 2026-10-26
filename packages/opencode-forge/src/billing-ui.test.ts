import { expect, test } from "bun:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import { BillingRpc } from "./billing-rpc.ts";

test("billing forms reject free text and transcript notices stay out of model requests", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-billing-"));
  const plugin = path.join(directory, "plugin");
  const config = path.join(directory, "config/opencode");
  await Promise.all([mkdir(plugin), mkdir(config, { recursive: true })]);

  const build = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "billing.fixture.ts")],
    naming: "index.js",
    outdir: plugin,
    target: "bun",
  });

  expect(build.success).toBe(true);
  await writeFile(path.join(config, "opencode.json"), JSON.stringify({ plugins: [plugin] }));

  const proc = Bun.spawn(
    [
      path.resolve(import.meta.dir, "../../../node_modules/.bin/opencode"),
      "serve",
      "--stdio",
      "--port",
      "0",
    ],
    {
      cwd: directory,
      env: {
        ...process.env,
        OPENCODE_DISABLE_MODELS_FETCH: "1",
        OPENCODE_PASSWORD: "billing-test",
        XDG_CONFIG_HOME: path.join(directory, "config"),
        XDG_DATA_HOME: path.join(directory, "data"),
        XDG_STATE_HOME: path.join(directory, "state"),
      },
      stderr: "pipe",
      stdin: "pipe",
      stdout: "pipe",
    }
  );

  const logs = new Response(proc.stderr).text();
  const controller = new AbortController();

  try {
    const startup = proc.stdout.pipeThrough(new TextDecoderStream()).getReader();
    const first = await startup.read();
    const { url } = z.object({ url: z.url() }).parse(JSON.parse(first.value?.split("\n")[0] ?? ""));

    const headers = {
      authorization: `Basic ${Buffer.from("opencode:billing-test").toString("base64")}`,
      "content-type": "application/json",
    };

    const request = async (
      route: string,
      body?: z.infer<ReturnType<typeof z.json>>,
      method = body === undefined ? "GET" : "POST"
    ) => {
      const options: RequestInit = {
        headers,
        method,
        signal: AbortSignal.timeout(10_000),
      };

      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${url}${route}`, options);

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

    const stream = await fetch(`${url}/api/event`, {
      headers,
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
    });

    if (stream.body === null) {
      throw new Error("The event stream has no body");
    }

    const reader = stream.body.getReader();
    const decoder = new TextDecoder();

    const event = (async () => {
      let buffer = "";

      while (true) {
        // SSE chunks arrive sequentially, and a frame can span chunks.
        // oxlint-disable-next-line no-await-in-loop
        const chunk = await reader.read();

        if (chunk.done) {
          throw new Error("The event stream ended before the form appeared");
        }

        buffer += decoder.decode(z.instanceof(Uint8Array).parse(chunk.value), { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const parsed = z
            .object({
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
            .safeParse(JSON.parse(line.slice(6)));

          if (parsed.success) {
            return parsed.data;
          }
        }
      }
    })();

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
    controller.abort();
    proc.kill();
    await proc.exited;
    await logs;
    await rm(directory, { force: true, recursive: true });
  }
}, 15_000);
