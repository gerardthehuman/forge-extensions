import { expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

test("OpenCode records Forge response costs separately for both providers", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-response-"));
  const plugin = path.join(directory, "plugin");
  const config = path.join(directory, "config/opencode");
  await Promise.all([mkdir(plugin), mkdir(config, { recursive: true })]);

  const build = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "responses.fixture.ts")],
    naming: "index.js",
    outdir: plugin,
    target: "bun",
  });

  expect(build.success).toBe(true);
  await writeFile(path.join(config, "opencode.json"), JSON.stringify({ plugins: [plugin] }));

  let requests = 0;
  const payloads: string[] = [];
  const started = Promise.withResolvers<null>();
  const release = Promise.withResolvers<null>();
  const manualStarted = Promise.withResolvers<null>();
  const manualRelease = Promise.withResolvers<null>();

  const upstream = Bun.serve({
    fetch: async (request) => {
      requests += 1;

      if (requests > 15) {
        return new Response("Unexpected model loop", { status: 400 });
      }

      const payload = JSON.stringify(await request.json());
      payloads.push(payload);

      const twoSteps = payload.includes("TWO_STEPS");
      const afterTool = payload.includes('"role":"tool"');

      if (twoSteps && !afterTool) {
        const chunk = {
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    function: {
                      arguments: '{"filePath":"/missing-forge-response-test"}',
                      name: "read",
                    },
                    id: "call_test",
                    index: 0,
                    type: "function",
                  },
                ],
              },
              finish_reason: "tool_calls",
              index: 0,
            },
          ],
          id: "tool-gen",
          model: "vendor/floor",
          usage: { completion_tokens: 20, cost: 0.000001, prompt_tokens: 100 },
        };

        return new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, {
          headers: { "content-type": "text/event-stream" },
        });
      }

      if (payload.includes("WAIT_COST")) {
        started.resolve(null);
        await release.promise;
      }

      if (payload.includes("WAIT_MANUAL")) {
        manualStarted.resolve(null);
        await manualRelease.promise;
      }

      const missing = payload.includes("MISSING_COST");
      const zero = payload.includes("ZERO_COST");
      const unknown = payload.includes("UNKNOWN_MODEL");
      const headerOnly = payload.includes("HEADER_ONLY");
      let served = "vendor/floor";

      if (unknown) {
        served = "vendor/unlisted";
      } else if (missing || zero || (twoSteps && afterTool)) {
        served = "expensive";
      }

      const cost = zero ? 0 : 0.000001;

      const chunks = [
        {
          choices: [{ delta: { content: "OK" }, finish_reason: null, index: 0 }],
          id: "gen",
          model: headerOnly ? undefined : served,
        },
        {
          choices: [{ delta: {}, finish_reason: "stop", index: 0 }],
          id: "gen",
          model: headerOnly ? undefined : served,
          usage: {
            completion_tokens: 20,
            cost: missing ? undefined : cost,
            prompt_tokens: 100,
            total_tokens: 120,
          },
        },
      ];

      const body = `${chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("")}data: [DONE]\n\n`;

      return await Promise.resolve(
        new Response(body, {
          headers: {
            "content-type": "text/event-stream",
            "x-forge-model": "vendor/floor",
            "x-forge-model-clamped": "1",
          },
        })
      );
    },
    port: 0,
  });

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
        FORGE_RESPONSE_TEST_URL: upstream.url.toString().replace(/\/$/u, ""),
        OPENCODE_DISABLE_MODELS_FETCH: "1",
        OPENCODE_PASSWORD: "response-test",
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

  try {
    const startup = proc.stdout.pipeThrough(new TextDecoderStream()).getReader();
    const first = await startup.read();

    const { url } = z
      .object({ url: z.url() })
      .parse(JSON.parse(first.value?.split("\n")[0] ?? "{}"));

    const headers = {
      authorization: `Basic ${Buffer.from("opencode:response-test").toString("base64")}`,
      "content-type": "application/json",
    };

    const request = async (route: string, body?: z.infer<ReturnType<typeof z.json>>) => {
      const response = await fetch(`${url}${route}`, {
        body: body === undefined ? undefined : JSON.stringify(body),
        headers,
        method: body === undefined ? "GET" : "POST",
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`${route}: ${await response.text()}`);
      }

      const text = await response.text();

      return text ? z.json().parse(JSON.parse(text)) : undefined;
    };

    const sessions = await Promise.all(
      ["forge", "forge-router"].map(async (providerID) => {
        const created = await request("/api/session", {
          location: { directory },
          model: { id: "expensive", providerID },
        });

        const { id } = z.object({ data: z.object({ id: z.string() }) }).parse(created).data;
        await request(`/api/session/${id}/prompt`, { text: "Hello" });
        await request(`/api/experimental/session/${id}/wait`, {});

        return id;
      })
    );

    for (const id of sessions) {
      // Each command reads only its own session's reported costs.
      // oxlint-disable-next-line no-await-in-loop
      await request(`/api/session/${id}/command`, { name: "forge:cost", text: "" });
      // oxlint-disable-next-line no-await-in-loop
      const inbox = await request(`/api/session/${id}/inbox`);
      const text = JSON.stringify(inbox);
      expect(text).toContain("Forge used vendor/floor instead of expensive.");
      expect(text).not.toContain("Selected vendor/floor for future requests.");
      expect(text).toContain("Forge reported cost: $0.000001");
      expect(text).toContain("Responses with reported cost: 1");
      expect(text).toContain("Responses without reported cost: 0");
      expect(text).toContain("OpenCode's built-in cost remains an estimate.");
      expect(text).not.toContain("Interrupted responses:");
      // oxlint-disable-next-line no-await-in-loop
      const session = await request(`/api/session/${id}`);
      expect(
        z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(session).data
          .model.id
      ).toBe("expensive");
    }

    expect(requests).toBe(2);

    await request(`/api/session/${sessions[0]}/prompt`, { text: "Continue" });
    await request(`/api/experimental/session/${sessions[0]}/wait`, {});
    expect(payloads.at(-1)).not.toContain("Forge reported cost");
    expect(payloads.at(-1)).not.toContain("Forge used vendor/floor");
    expect(payloads.at(-1)).not.toContain("Selected vendor/floor for future requests");

    for (const [prompt, expected] of [
      ["MISSING_COST", "Responses without reported cost: 1"],
      ["ZERO_COST", "Responses with reported cost: 1"],
    ]) {
      // Each additional session exercises a distinct accounting outcome.
      // oxlint-disable-next-line no-await-in-loop
      const created = await request("/api/session", {
        location: { directory },
        model: { id: "expensive", providerID: "forge" },
      });

      const { id } = z.object({ data: z.object({ id: z.string() }) }).parse(created).data;
      // oxlint-disable-next-line no-await-in-loop
      await request(`/api/session/${id}/prompt`, { text: prompt });
      // oxlint-disable-next-line no-await-in-loop
      await request(`/api/experimental/session/${id}/wait`, {});
      // oxlint-disable-next-line no-await-in-loop
      await request(`/api/session/${id}/command`, { name: "forge:cost", text: "" });
      // oxlint-disable-next-line no-await-in-loop
      const inbox = await request(`/api/session/${id}/inbox`);
      expect(JSON.stringify(inbox)).toContain(expected);
      expect(JSON.stringify(inbox)).toContain(
        prompt === "MISSING_COST" ? "No reported costs recorded." : "Forge reported cost: $0.00"
      );
      expect(JSON.stringify(inbox)).not.toContain("Forge used");
      expect(JSON.stringify(inbox)).toContain(
        "Forge routed expensive to vendor/floor. The response reported expensive."
      );
    }

    expect(requests).toBe(5);

    const created = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const { id } = z.object({ data: z.object({ id: z.string() }) }).parse(created).data;
    await request(`/api/session/${id}/prompt`, { text: "WAIT_COST" });
    await started.promise;
    const command = request(`/api/session/${id}/command`, { name: "forge:cost", text: "" });
    release.resolve(null);
    await command;
    await request(`/api/experimental/session/${id}/wait`, {});
    expect(requests).toBe(6);
    const inbox = await request(`/api/session/${id}/inbox`);
    expect(JSON.stringify(inbox)).toContain("Responses with reported cost: 1");

    const unavailable = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const unavailableID = z.object({ data: z.object({ id: z.string() }) }).parse(unavailable)
      .data.id;

    await request(`/api/session/${unavailableID}/prompt`, { text: "UNKNOWN_MODEL" });
    await request(`/api/experimental/session/${unavailableID}/wait`, {});
    await request(`/api/session/${unavailableID}/command`, { name: "forge:cost", text: "" });
    const unavailableInbox = await request(`/api/session/${unavailableID}/inbox`);
    expect(JSON.stringify(unavailableInbox)).toContain("The response reported vendor/unlisted.");
    const unavailableSession = await request(`/api/session/${unavailableID}`);
    expect(
      z
        .object({ data: z.object({ model: z.object({ id: z.string() }) }) })
        .parse(unavailableSession).data.model.id
    ).toBe("expensive");

    const manual = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const manualID = z.object({ data: z.object({ id: z.string() }) }).parse(manual).data.id;
    await request(`/api/session/${manualID}/prompt`, { text: "WAIT_MANUAL" });
    await manualStarted.promise;
    await request(`/api/session/${manualID}/model`, {
      model: { id: "manual", providerID: "forge" },
    });
    manualRelease.resolve(null);
    await request(`/api/experimental/session/${manualID}/wait`, {});
    await request(`/api/session/${manualID}/command`, { name: "forge:cost", text: "" });
    const manualSession = await request(`/api/session/${manualID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(manualSession)
        .data.model.id
    ).toBe("manual");
    expect(requests).toBe(8);

    const headerOnly = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge-router" },
    });

    const headerID = z.object({ data: z.object({ id: z.string() }) }).parse(headerOnly).data.id;
    await request(`/api/session/${headerID}/prompt`, { text: "HEADER_ONLY" });
    await request(`/api/experimental/session/${headerID}/wait`, {});
    await request(`/api/session/${headerID}/command`, { name: "forge:cost", text: "" });
    const headerInbox = await request(`/api/session/${headerID}/inbox`);
    expect(JSON.stringify(headerInbox)).toContain("The responding model is unknown.");
    const headerSession = await request(`/api/session/${headerID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(headerSession)
        .data.model.id
    ).toBe("expensive");
    expect(requests).toBe(9);

    const multistep = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const multistepID = z.object({ data: z.object({ id: z.string() }) }).parse(multistep).data.id;
    await request(`/api/session/${multistepID}/prompt`, { text: "TWO_STEPS" });
    await request(`/api/experimental/session/${multistepID}/wait`, {});
    await request(`/api/session/${multistepID}/command`, { name: "forge:cost", text: "" });
    const multistepSession = await request(`/api/session/${multistepID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(multistepSession)
        .data.model.id
    ).toBe("expensive");
    expect(requests).toBe(11);
  } finally {
    proc.kill();
    await proc.exited;
    await logs;
    await upstream.stop(true);
    await rm(directory, { force: true, recursive: true });
  }
}, 20_000);
