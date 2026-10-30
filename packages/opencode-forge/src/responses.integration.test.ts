import { expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import { OpenCodePluginExternals } from "../build-config.ts";

const ResponseNoticeEventSchema = z.object({
  data: z.object({
    item: z.object({
      payload: z.object({
        metadata: z.object({ forgeResponseNotice: z.literal(true) }),
        text: z.string(),
      }),
      type: z.literal("synthetic"),
    }),
    sessionID: z.string(),
  }),
  type: z.literal("session.inbox.enqueued"),
});

test("OpenCode reports Forge model switches without a cost command", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-response-"));
  const plugin = path.join(directory, "plugin");
  const config = path.join(directory, "config/opencode");
  await Promise.all([mkdir(plugin), mkdir(config, { recursive: true })]);

  const build = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "responses.fixture.ts")],
    external: OpenCodePluginExternals,
    naming: "index.js",
    outdir: plugin,
    target: "bun",
  });

  expect(build.success).toBe(true);
  await writeFile(path.join(config, "opencode.json"), JSON.stringify({ plugins: [plugin] }));

  let requests = 0;
  const payloads: string[] = [];
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

  const binary =
    process.env.OPENCODE_TEST_BINARY ??
    path.resolve(import.meta.dir, "../../../node_modules/.bin/opencode");

  const proc = Bun.spawn([binary, "serve", "--stdio", "--port", "0"], {
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
  });

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

    const noticeWhile = async (sessionID: string, run: () => Promise<void>) => {
      const controller = new AbortController();

      const stream = await fetch(`${url}/api/event`, {
        headers,
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
      });

      if (stream.body === null) {
        throw new Error("The event stream has no body");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const nextNotice = async () => {
        while (true) {
          const end = buffer.indexOf("\n");

          if (end === -1) {
            // SSE frames can span multiple chunks.
            // oxlint-disable-next-line no-await-in-loop
            const chunk = await reader.read();

            if (chunk.done) {
              throw new Error("The event stream ended before the model switch notice");
            }

            buffer += decoder.decode(z.instanceof(Uint8Array).parse(chunk.value), { stream: true });
            continue;
          }

          const line = buffer.slice(0, end);
          buffer = buffer.slice(end + 1);

          if (!line.startsWith("data: ")) {
            continue;
          }

          const event = ResponseNoticeEventSchema.safeParse(JSON.parse(line.slice(6)));

          if (event.success && event.data.data.sessionID === sessionID) {
            return event.data.data.item.payload.text;
          }
        }
      };

      const pending = nextNotice();
      void pending.catch(() => {});

      try {
        await run();

        return await pending;
      } finally {
        controller.abort();
      }
    };

    const sessions = await Promise.all(
      ["forge", "forge-router"].map(async (providerID) => {
        const created = await request("/api/session", {
          location: { directory },
          model: { id: "expensive", providerID },
        });

        const { id } = z.object({ data: z.object({ id: z.string() }) }).parse(created).data;

        const notice = await noticeWhile(id, async () => {
          await request(`/api/session/${id}/prompt`, { text: "Hello" });
          await request(`/api/experimental/session/${id}/wait`, {});
        });

        return { id, notice };
      })
    );

    const location = new URLSearchParams({ "location[directory]": directory });

    const commands = z
      .object({ data: z.array(z.object({ name: z.string() })) })
      .parse(await request(`/api/command?${location.toString()}`));

    const commandNames = commands.data.map((command) => command.name);

    expect(commandNames).not.toContain("forge:cost");
    expect(commandNames).toContain("forge:billing");

    for (const { id, notice } of sessions) {
      expect(notice).toContain("Forge used vendor/floor instead of expensive.");
      expect(notice).not.toContain("Selected vendor/floor for future requests.");
      // oxlint-disable-next-line no-await-in-loop
      const session = await request(`/api/session/${id}`);
      expect(
        z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(session).data
          .model.id
      ).toBe("expensive");
    }

    expect(requests).toBe(2);

    await request(`/api/session/${sessions[0].id}/prompt`, { text: "Continue" });
    await request(`/api/experimental/session/${sessions[0].id}/wait`, {});
    expect(payloads.at(-1)).not.toContain("Forge used vendor/floor");
    expect(payloads.at(-1)).not.toContain("Selected vendor/floor for future requests");

    for (const prompt of ["MISSING_COST", "ZERO_COST"]) {
      // A missing or zero cost must not affect model switch notices.
      // oxlint-disable-next-line no-await-in-loop
      const created = await request("/api/session", {
        location: { directory },
        model: { id: "expensive", providerID: "forge" },
      });

      const { id } = z.object({ data: z.object({ id: z.string() }) }).parse(created).data;

      // oxlint-disable-next-line no-await-in-loop
      const notice = await noticeWhile(id, async () => {
        await request(`/api/session/${id}/prompt`, { text: prompt });
        await request(`/api/experimental/session/${id}/wait`, {});
      });

      expect(notice).not.toContain("Forge used");
      expect(notice).toContain(
        "Forge routed expensive to vendor/floor. The response reported expensive."
      );
    }

    expect(requests).toBe(5);

    const unavailable = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const unavailableID = z.object({ data: z.object({ id: z.string() }) }).parse(unavailable)
      .data.id;

    const unavailableNotice = await noticeWhile(unavailableID, async () => {
      await request(`/api/session/${unavailableID}/prompt`, { text: "UNKNOWN_MODEL" });
      await request(`/api/experimental/session/${unavailableID}/wait`, {});
    });

    expect(unavailableNotice).toContain("The response reported vendor/unlisted.");

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

    const manualNotice = await noticeWhile(manualID, async () => {
      await request(`/api/session/${manualID}/prompt`, { text: "WAIT_MANUAL" });
      await manualStarted.promise;
      await request(`/api/session/${manualID}/model`, {
        model: { id: "manual", providerID: "forge" },
      });
      manualRelease.resolve(null);
      await request(`/api/experimental/session/${manualID}/wait`, {});
    });

    expect(manualNotice).toContain("Forge used vendor/floor instead of expensive.");

    const manualSession = await request(`/api/session/${manualID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(manualSession)
        .data.model.id
    ).toBe("manual");
    expect(requests).toBe(7);

    const headerOnly = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge-router" },
    });

    const headerID = z.object({ data: z.object({ id: z.string() }) }).parse(headerOnly).data.id;

    const headerNotice = await noticeWhile(headerID, async () => {
      await request(`/api/session/${headerID}/prompt`, { text: "HEADER_ONLY" });
      await request(`/api/experimental/session/${headerID}/wait`, {});
    });

    expect(headerNotice).toContain("The responding model is unknown.");

    const headerSession = await request(`/api/session/${headerID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(headerSession)
        .data.model.id
    ).toBe("expensive");
    expect(requests).toBe(8);

    const multistep = await request("/api/session", {
      location: { directory },
      model: { id: "expensive", providerID: "forge" },
    });

    const multistepID = z.object({ data: z.object({ id: z.string() }) }).parse(multistep).data.id;

    const multistepNotice = await noticeWhile(multistepID, async () => {
      await request(`/api/session/${multistepID}/prompt`, { text: "TWO_STEPS" });
      await request(`/api/experimental/session/${multistepID}/wait`, {});
    });

    expect(multistepNotice).toContain("Forge used vendor/floor instead of expensive.");
    expect(multistepNotice).toContain(
      "Forge routed expensive to vendor/floor. The response reported expensive."
    );

    const multistepSession = await request(`/api/session/${multistepID}`);
    expect(
      z.object({ data: z.object({ model: z.object({ id: z.string() }) }) }).parse(multistepSession)
        .data.model.id
    ).toBe("expensive");
    expect(requests).toBe(10);
  } finally {
    proc.kill();
    await proc.exited;
    await logs;
    await upstream.stop(true);
    await rm(directory, { force: true, recursive: true });
  }
}, 20_000);
