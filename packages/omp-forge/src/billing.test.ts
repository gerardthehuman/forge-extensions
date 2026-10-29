/* oxlint-disable func-style, no-await-in-loop, anti-slop/no-reflect-apply, promise/prefer-await-to-callbacks -- Exercise the real extension against a partial host fixture. */
import { expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { AuthStorage, registerCustomApi, streamSimple } from "@oh-my-pi/pi-ai";
import type { Model } from "@oh-my-pi/pi-ai";
import {
  AgentRegistry,
  ModelRegistry,
  SessionManager,
  convertToLlm,
} from "@oh-my-pi/pi-coding-agent";

import {
  BillingProvider,
  billingModels,
  billingSession,
  chargeTo,
  registerBilling,
} from "./billing.ts";

const ProjectId = "a7d2dcae-c1e1-4d6c-a8d1-195e74d1802d";

function fixture() {
  const session = SessionManager.inMemory("/test");
  void session.setSessionName("Billing test");

  const notices: {
    content: [];
    customType: string;
    details: { text: string };
    display: boolean;
  }[] = [];

  const warnings: string[] = [];
  const noticeWaiters = new Map<string, ReturnType<typeof Promise.withResolvers<string>>>();
  const switches: { from: string; to: string }[] = [];
  let choice: number | undefined = 1;
  let denied = false;
  let writeFailure = false;
  let idle = true;
  let currentModel: Model | undefined;
  let modelChanges = 0;
  const availableModels = new Map<string, Model>();
  const selectors: { label: string; description: string; target: string }[][] = [];

  const handlers = new Map<
    string,
    (event: { messages?: unknown[] }, ctx: typeof context) => { messages: unknown[] } | undefined
  >();

  const commands = new Map<string, (args: string, ctx: typeof context) => Promise<void>>();

  const context = {
    agent: { id: "Main", kind: "main" },
    cwd: "/test",
    hasUI: true,
    isIdle: () => idle,
    get model() {
      return currentModel;
    },
    modelRegistry: {
      find: (provider: string, id: string) => availableModels.get(`${provider}/${id}`),
    },
    sessionManager: session,
    setTimeout: (callback: () => void) => {
      callback();
    },
    ui: {
      notify: (message: string) => warnings.push(message),
      select: async (
        _title: string,
        options: { label: string; description: string; target: string }[]
      ) => {
        selectors.push(options);

        return await Promise.resolve(choice === undefined ? undefined : options[choice]?.label);
      },
    },
  };

  const pi = {
    appendEntry: (type: string, data: { chargeTo: string }) => {
      if (writeFailure) {
        throw new Error("Write denied");
      }

      session.appendCustomEntry(type, data);
    },
    on: (
      type: string,
      handler: (
        event: { messages?: unknown[] },
        ctx: typeof context
      ) => { messages: unknown[] } | undefined
    ) => handlers.set(type, handler),
    registerCommand: (
      name: string,
      options: { handler: (args: string, ctx: typeof context) => Promise<void> }
    ) => {
      commands.set(name, options.handler);
    },
    registerMessageRenderer: () => {
      /* Rendering is checked through the stored notice details. */
    },
    sendMessage: (message: (typeof notices)[number], options: { triggerTurn: boolean }) => {
      expect(options.triggerTurn).toBe(false);
      notices.push(message);

      noticeWaiters.get(message.details.text)?.resolve(message.details.text);
      noticeWaiters.delete(message.details.text);
    },
    setModel: async (model: Model) => {
      modelChanges += 1;
      currentModel = model;

      return await Promise.resolve(true);
    },
  };

  const forge = {
    projectBudget: {
      chargeContext: async () =>
        await Promise.resolve({
          enabled: true,
          projects: [
            {
              canCharge: true,
              projectId: ProjectId,
              remainingUsd: 42,
              status: "active",
              title: "Test Project",
            },
            {
              canCharge: false,
              projectId: "not-eligible",
              remainingUsd: 5,
              status: "active",
              title: "Forbidden",
            },
          ],
        }),
      sessionSwitch: async (input: { from: string; to: string }) => {
        if (denied) {
          throw new Error("Project access denied");
        }

        switches.push(input);
        await Promise.resolve();
      },
      state: async () => await Promise.resolve({ remainingUsd: 42, title: "Test Project" }),
    },
    usage: () => ({
      value: Promise.resolve({ budget: { dailyBudgetUsd: 50, remainingUsd: 12.34 } }),
    }),
  };

  Reflect.apply(registerBilling, undefined, [pi, async () => await Promise.resolve(forge)]);

  handlers.get("session_start")?.({}, context);

  return {
    addModel: (model: Model) => availableModels.set(`${model.provider}/${model.id}`, model),
    choose: (value: number | undefined) => {
      choice = value;
    },
    chooseModel: (model: Model) => {
      currentModel = model;
    },
    context,
    deny: () => {
      denied = true;
    },
    failWrite: () => {
      writeFailure = true;
    },
    handlers,
    modelChanges: () => modelChanges,
    notices,
    run: async (args: string) => {
      const command = commands.get(`forge:${args}`);

      if (command === undefined) {
        throw new Error(`Forge command is missing: forge:${args}`);
      }

      await command("", context);
    },
    selectors,
    session,
    setIdle: (value: boolean) => {
      idle = value;
    },
    switches,
    waitForNotice: async (text: string) => {
      const waiter = Promise.withResolvers<string>();
      noticeWaiters.set(text, waiter);

      return await waiter.promise;
    },
    warnings,
  };
}

test("OMP billing picker persists selection, formats current usage and hides notices from model context", async () => {
  const host = fixture();
  await host.run("usage");
  expect(host.notices.at(-1)?.details.text).toBe("Forge Billing: Personal\n$12.34 of $50.00 left");
  await host.run("billing");
  expect(host.selectors[0]).toEqual([
    { description: "$12.34 available", label: "1. Personal Budget (current)", target: "personal" },
    { description: "$42.00 available", label: "2. Test Project", target: `project:${ProjectId}` },
  ]);
  expect(chargeTo(host.session)).toBe(`project:${ProjectId}`);
  expect(host.notices.at(-1)?.details.text).toBe(
    "Forge Billing: Personal → Test Project\n$42.00 left"
  );
  await host.run("usage");
  expect(host.notices.at(-1)?.details.text).toBe("Forge Billing: Test Project\n$42.00 left");
  host.choose(0);
  await host.run("billing");
  expect(host.notices.at(-1)?.details.text).toBe(
    "Forge Billing: Test Project → Personal\n$12.34 left"
  );
  expect(chargeTo(host.session)).toBe("personal");

  const messages = host.notices.map((notice) => ({
    ...notice,
    role: "custom" as const,
    timestamp: Date.now(),
  }));

  expect(JSON.stringify(convertToLlm(messages))).not.toContain("Forge Billing");

  const conversation = [
    { content: "Keep the user's request", role: "user", timestamp: 0 },
    { content: "Keep another extension's note", customType: "other-extension", role: "custom" },
  ];

  expect(
    host.handlers.get("context")?.({ messages: [...conversation, ...messages] }, host.context)
      ?.messages
  ).toEqual(conversation);
});

test("OMP cancellation, denied projects and metadata write failures preserve previous billing", async () => {
  const cancelled = fixture();
  cancelled.choose(undefined);
  await cancelled.run("billing");
  expect(chargeTo(cancelled.session)).toBe("personal");
  expect(cancelled.switches).toEqual([]);
  const denied = fixture();
  denied.deny();
  await denied.run("billing");
  expect(chargeTo(denied.session)).toBe("personal");
  expect(denied.warnings).toEqual(["Project access denied"]);
  const failed = fixture();
  failed.failWrite();
  await failed.run("billing");
  expect(chargeTo(failed.session)).toBe("personal");
  expect(failed.switches.map(({ from, to }) => ({ from, to }))).toEqual([
    { from: "personal", to: `project:${ProjectId}` },
    { from: `project:${ProjectId}`, to: "personal" },
  ]);
});

test("OMP custom streaming preserves the native wire contract with one request permit", async () => {
  const host = fixture();
  await host.run("billing");
  const received: { headers: Headers; body: Promise<unknown> }[] = [];

  const server = Bun.serve({
    fetch: async (request) => {
      received.push({
        body: Promise.resolve(await request.json()),
        headers: new Headers(request.headers),
      });

      return new Response(
        'data: {"id":"test","choices":[{"index":0,"delta":{"content":"OK"},"finish_reason":null}]}\n\ndata: {"id":"test","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n',
        { headers: { "content-type": "text/event-stream" } }
      );
    },
    port: 0,
  });

  registerCustomApi(BillingProvider.api, BillingProvider.streamSimple);
  const auth = await AuthStorage.create(":memory:");

  const registry = new ModelRegistry(auth, "/tmp/forge-test-no-models.yml", {
    ignoreLocalModelConfig: true,
  });

  const baseline = registry.find("openai", "gpt-4o");

  if (!baseline) {
    throw new Error("Bundled OpenAI fixture model is missing");
  }

  try {
    for (const provider of ["forge", "forge-router"]) {
      registry.registerProvider(provider, {
        ...BillingProvider,
        apiKey: "local-test-key",
        baseUrl: server.url.toString(),
        models: billingModels(provider, [
          {
            api: "openai-completions",
            contextWindow: baseline.contextWindow ?? 1000,
            cost: baseline.cost,
            id: baseline.id,
            input: baseline.input,
            maxTokens: 100,
            name: baseline.name,
            reasoning: false,
          },
        ]),
      });
      const providerId = provider;
      // oxlint-disable-next-line unicorn/no-array-method-this-argument -- ModelRegistry.find takes provider and model IDs.
      const mapped = registry.find(providerId, baseline.id);

      if (!mapped) {
        throw new Error("Registered Forge fixture model is missing");
      }

      const result = await streamSimple(
        mapped,
        { messages: [] },
        {
          apiKey: "local-test-key",
          maxInFlightRequests: { [provider]: 1 },
          sessionId: host.session.getSessionId(),
          signal: AbortSignal.timeout(2000),
        }
      ).result();

      expect(result.stopReason).toBe("stop");
    }

    expect(received).toHaveLength(2);
    expect(received[0].headers.get("x-forge-charge-to")).toBe(`project:${ProjectId}`);
    expect(received[0].headers.get("x-forge-session-title")).toBe("Billing%20test");
    const body = await received[1].body;
    expect(body).toMatchObject({
      forge_usage: { chargeTo: `project:${ProjectId}`, sessionTitle: "Billing test" },
    });
  } finally {
    await server.stop(true);
    auth.close();
  }
});

test("OMP uses each response's served model and reported cost", async () => {
  const host = fixture();
  registerCustomApi(BillingProvider.api, BillingProvider.streamSimple);
  const auth = await AuthStorage.create(":memory:");

  const registry = new ModelRegistry(auth, "/tmp/forge-test-no-models.yml", {
    ignoreLocalModelConfig: true,
  });

  const baseline = registry.find("openai", "gpt-4o");

  if (!baseline) {
    throw new Error("Bundled OpenAI fixture model is missing");
  }

  try {
    for (const provider of ["forge", "forge-router"]) {
      registry.registerProvider(provider, {
        ...BillingProvider,
        apiKey: "test",
        baseUrl: "https://example.invalid",
        models: billingModels(provider, [
          {
            api: "openai-completions",
            contextWindow: baseline.contextWindow ?? 1000,
            cost: baseline.cost,
            id: baseline.id,
            input: baseline.input,
            maxTokens: 100,
            name: baseline.name,
            reasoning: false,
          },
        ]),
      });
    }

    const run = async (provider: string, served: string, cost?: number) => {
      // oxlint-disable-next-line unicorn/no-array-method-this-argument -- ModelRegistry.find takes provider and model IDs.
      const model = registry.find(provider, baseline.id);

      if (!model) {
        throw new Error("Fixture model is missing");
      }

      let observed = 0;

      const chunks = [
        {
          choices: [{ delta: { content: "OK" }, finish_reason: null, index: 0 }],
          id: "gen",
          model: served,
        },
        {
          choices: [{ delta: {}, finish_reason: "stop", index: 0 }],
          id: "gen",
          model: served,
          usage: { completion_tokens: 20, cost, prompt_tokens: 100, total_tokens: 120 },
        },
      ];

      const body = `${chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join("")}data: [DONE]\n\n`;

      const message = await streamSimple(
        model,
        { messages: [] },
        {
          apiKey: "test",
          fetch: async () =>
            await Promise.resolve(
              new Response(body, { headers: { "content-type": "text/event-stream" } })
            ),
          onSseEvent: () => {
            observed += 1;
          },
          sessionId: host.session.getSessionId(),
        }
      ).result();

      return { message, observed };
    };

    const [desktop, router] = await Promise.all([
      run("forge", "vendor/desktop", 0),
      run("forge-router", "vendor/router", 0.000001),
    ]);

    expect(desktop.message.upstreamModel).toBe("vendor/desktop");
    expect(desktop.message.usage.cost.total).toBe(0);
    expect(router.message.upstreamModel).toBe("vendor/router");
    expect(router.message.usage.cost.total).toBe(0.000001);
    expect(router.message.usage.cost.input + router.message.usage.cost.output).toBeCloseTo(
      0.000001
    );
    expect(desktop.observed).toBeGreaterThan(0);
    expect(router.observed).toBeGreaterThan(0);
    expect(host.notices.map((notice) => notice.details.text)).toContain(
      "Forge used vendor/desktop instead of gpt-4o."
    );
    expect(host.notices.map((notice) => notice.details.text)).toContain(
      "Forge used vendor/router instead of gpt-4o."
    );
    expect(host.warnings).toEqual([]);

    const missing = await run("forge", "gpt-4o");
    expect(missing.message.usage.cost.total).toBeGreaterThan(0);
    expect(host.notices.map((notice) => notice.details.text)).toContain(
      "Forge did not report a cost. The displayed cost is an estimate."
    );
    expect(host.notices.at(-1)?.details.text).not.toContain("Forge used");

    const requested = registry.find("forge", baseline.id);

    if (!requested) {
      throw new Error("Fixture model is missing");
    }

    const fallback = { ...requested, id: "vendor/desktop" };
    host.chooseModel(requested);
    host.addModel(fallback);
    host.setIdle(false);
    await run("forge", "vendor/desktop", 0);
    expect(host.context.model?.id).toBe(baseline.id);
    host.setIdle(true);
    const firstNotice = host.waitForNotice("Forge used vendor/desktop instead of gpt-4o.");
    host.handlers.get("agent_end")?.({}, host.context);
    await firstNotice;
    expect(host.context.model?.id).toBe(baseline.id);
    expect(host.modelChanges()).toBe(0);

    host.chooseModel(requested);
    host.setIdle(false);
    await run("forge", "vendor/desktop", 0);
    const manual = { ...requested, id: "vendor/manual" };
    host.chooseModel(manual);
    host.setIdle(true);
    const manualNotice = host.waitForNotice("Forge used vendor/desktop instead of gpt-4o.");
    host.handlers.get("agent_end")?.({}, host.context);
    await manualNotice;
    expect(host.context.model?.id).toBe("vendor/manual");

    host.chooseModel(requested);
    host.setIdle(false);
    await run("forge", "vendor/desktop", 0);
    await run("forge", "gpt-4o", 0);
    host.setIdle(true);
    const latestNotice = host.waitForNotice("Forge used vendor/desktop instead of gpt-4o.");
    host.handlers.get("agent_end")?.({}, host.context);
    await latestNotice;
    expect(host.context.model?.id).toBe(baseline.id);

    host.chooseModel(requested);
    host.setIdle(false);
    await run("forge", "vendor/unlisted", 0);
    host.setIdle(true);

    const unavailableNotice = host.waitForNotice("Forge used vendor/unlisted instead of gpt-4o.");

    host.handlers.get("agent_end")?.({}, host.context);
    await unavailableNotice;
    expect(host.context.model?.id).toBe(baseline.id);
    expect(host.modelChanges()).toBe(0);

    let attempts = 0;

    const retried = await streamSimple(
      requested,
      { messages: [] },
      {
        apiKey: "test",
        fetch: async () => {
          attempts += 1;
          const first = attempts === 1;

          const chunk = {
            choices: [{ delta: first ? {} : { content: "OK" }, finish_reason: "stop", index: 0 }],
            id: "retry",
            model: first ? "vendor/old" : "gpt-4o",
            usage: { completion_tokens: first ? 0 : 20, cost: first ? 99 : 0, prompt_tokens: 100 },
          };

          return await Promise.resolve(
            new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, {
              headers: { "content-type": "text/event-stream" },
            })
          );
        },
        providerRetryWait: async () => {
          await Promise.resolve();
        },
        sessionId: host.session.getSessionId(),
      }
    ).result();

    expect(attempts).toBe(2);
    expect(retried.upstreamModel).toBe("gpt-4o");
    expect(retried.usage.cost.total).toBe(99);

    let partialAttempts = 0;

    const partialNotice = host.waitForNotice(
      "Forge did not report costs for every attempt. The displayed cost excludes those attempts."
    );

    const partial = await streamSimple(
      requested,
      { messages: [] },
      {
        apiKey: "test",
        fetch: async () => {
          partialAttempts += 1;
          const first = partialAttempts === 1;

          const chunk = {
            choices: [{ delta: first ? {} : { content: "OK" }, finish_reason: "stop", index: 0 }],
            id: "partial-retry",
            model: "gpt-4o",
            usage: {
              completion_tokens: first ? 0 : 20,
              cost: first ? undefined : 0.5,
              prompt_tokens: 100,
            },
          };

          return await Promise.resolve(
            new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, {
              headers: { "content-type": "text/event-stream" },
            })
          );
        },
        providerRetryWait: async () => {
          await Promise.resolve();
        },
        sessionId: host.session.getSessionId(),
      }
    ).result();

    await partialNotice;
    expect(partialAttempts).toBe(2);
    expect(partial.usage.cost.total).toBe(0.5);

    const controller = new AbortController();
    const received = Promise.withResolvers<undefined>();
    const noticeCount = host.notices.length;
    host.chooseModel(requested);

    const aborted = streamSimple(
      requested,
      { messages: [] },
      {
        apiKey: "test",
        fetch: async () =>
          await Promise.resolve(
            new Response(
              new ReadableStream<Uint8Array>({
                start(stream) {
                  stream.enqueue(
                    new TextEncoder().encode(
                      'data: {"id":"abort","model":"vendor/desktop","choices":[{"index":0,"delta":{"content":"partial"}}]}\n\n'
                    )
                  );
                },
              }),
              { headers: { "content-type": "text/event-stream" } }
            )
          ),
        onSseEvent: () => {
          received.resolve(undefined);
        },
        sessionId: host.session.getSessionId(),
        signal: controller.signal,
      }
    );

    await received.promise;
    controller.abort();
    const interrupted = await aborted.result();
    expect(interrupted.stopReason).toBe("aborted");
    expect(host.context.model?.id).toBe(baseline.id);
    expect(host.notices.slice(noticeCount).map((notice) => notice.details.text)).toContain(
      "Forge did not report a cost. The displayed cost is an estimate."
    );

    const logged = host.notices.map((notice) => ({
      ...notice,
      role: "custom" as const,
      timestamp: 0,
    }));

    expect(JSON.stringify(convertToLlm(logged))).not.toContain("vendor/desktop");
    expect(host.handlers.get("context")?.({ messages: logged }, host.context)?.messages).toEqual(
      []
    );
    expect(host.modelChanges()).toBe(0);
  } finally {
    auth.close();
  }
});

test("OMP resumes saved billing and nested workers inherit their root session", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "forge-omp-billing-"));
  const registry = AgentRegistry.global();
  const session = SessionManager.create(directory, directory);

  try {
    session.appendCustomEntry("forge-billing", { chargeTo: `project:${ProjectId}` });
    await session.ensureOnDisk();
    await session.flush();
    const file = session.getSessionFile();

    if (file === undefined) {
      throw new Error("Billing session was not saved");
    }

    const restored = await SessionManager.open(file);
    expect(chargeTo(restored)).toBe(`project:${ProjectId}`);
    const child = SessionManager.inMemory(directory);
    Reflect.apply(registry.register.bind(registry), registry, [
      {
        displayName: "Main",
        id: "forge-billing-root",
        kind: "main",
        session: { sessionId: restored.getSessionId(), sessionManager: restored },
      },
    ]);
    Reflect.apply(registry.register.bind(registry), registry, [
      {
        displayName: "Child",
        id: "forge-billing-child",
        kind: "task",
        parentId: "forge-billing-root",
        session: { sessionId: child.getSessionId(), sessionManager: child },
      },
    ]);

    const manager = billingSession({
      agent: {
        depth: 1,
        id: "forge-billing-child",
        kind: "sub",
        name: "task",
        parentId: "forge-billing-root",
      },
      sessionManager: child,
    });

    expect(manager.getSessionId()).toBe(restored.getSessionId());
    expect(chargeTo(manager)).toBe(`project:${ProjectId}`);
    restored.appendCustomEntry("forge-billing", { chargeTo: "personal" });
    expect(
      chargeTo(
        billingSession({
          agent: { depth: 1, id: "forge-billing-child", kind: "sub", name: "task" },
          sessionManager: child,
        })
      )
    ).toBe("personal");
  } finally {
    registry.unregister("forge-billing-child");
    registry.unregister("forge-billing-root");
    await session.close();
    await rm(directory, { force: true, recursive: true });
  }
});
