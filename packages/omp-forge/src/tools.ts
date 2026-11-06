import { useForgeClient } from "@forge/code-client";
import type { ExtensionAPI, ExtensionCommandContext } from "@oh-my-pi/pi-coding-agent";
import {
  connectToServer,
  disconnectServer,
  listResources,
  listTools,
} from "@oh-my-pi/pi-coding-agent/mcp/client";

import { McpEndpointSchema } from "./mcp-config.ts";
import { readToolsPreference, saveToolsPreference } from "./tools-config.ts";
import type { ToolsPreference } from "./tools-config.ts";

interface Provider {
  id: string;
  name: string;
}

const providerLabel = (provider: Provider): string =>
  provider.name === provider.id ? provider.id : `${provider.name} (${provider.id})`;

const All = "All";
const Save = "Save";
const MaxCandidates = 100;
const ProbeBatchSize = 4;

class ProviderCatalogError extends Error {
  override name = "ProviderCatalogError";
}

const connect = async (url: URL, headers: Record<string, string> | undefined) =>
  await connectToServer("forge-catalog", {
    headerPolicy: "origin-locked",
    headers,
    type: "http",
    url: url.href,
  });

const toolsFor = async (
  url: URL,
  headers: Record<string, string> | undefined,
  providers: string[]
): Promise<string[]> => {
  if (providers.length === 0) {
    return [];
  }

  const scoped = new URL(url);
  scoped.searchParams.set("providers", providers.join(","));
  const connection = await connect(scoped, headers);

  try {
    const tools = await listTools(connection);

    return tools.map((tool) => tool.name);
  } finally {
    await disconnectServer(connection);
  }
};

const probeProviders = async (
  url: URL,
  headers: Record<string, string> | undefined,
  candidates: string[]
) => {
  const matches: { id: string; tools: string[] }[] = [];

  for (let index = 0; index < candidates.length; index += ProbeBatchSize) {
    // Limit concurrent Forge sessions while probing unknown provider IDs.
    // eslint-disable-next-line no-await-in-loop
    const batch = await Promise.all(
      candidates.slice(index, index + ProbeBatchSize).map(async (id) => ({
        id,
        tools: await toolsFor(url, headers, [id]),
      }))
    );

    matches.push(...batch);
  }

  return matches;
};

export const discoverToolProviders = async (): Promise<Provider[]> => {
  const forge = await useForgeClient();
  const { url, headers } = McpEndpointSchema.parse(await forge.mcp.servers());
  url.searchParams.delete("providers");
  url.searchParams.set("skills", ",");
  const connection = await connect(url, headers);
  const providers = new Map<string, string>();
  let names: string[];

  try {
    const [resources, tools] = await Promise.all([
      listResources(connection),
      listTools(connection),
    ]);

    names = tools.map((tool) => tool.name);

    for (const resource of resources) {
      const match = /^forge:\/\/context\/(?<id>[^/]+)\/(?:system|snapshot)$/u.exec(resource.uri);
      const id = match?.groups?.id;

      if (id !== undefined && !id.includes(",")) {
        providers.set(id, resource.name.replace(/ — (?:connection|snapshot)$/u, ""));
      }
    }
  } finally {
    await disconnectServer(connection);
  }

  // Some Forge providers expose tools but no context resources. Ask Forge which
  // candidate prefixes own those tools instead of guessing where an ID ends.
  const covered = new Set(await toolsFor(url, headers, [...providers.keys()]));
  const attempted = new Set(providers.keys());

  const record = (matches: { id: string; tools: string[] }[]) => {
    for (const match of matches) {
      if (match.tools.length > 0) {
        providers.set(match.id, providers.get(match.id) ?? match.id);

        for (const name of match.tools) {
          covered.add(name);
        }
      }
    }
  };

  let missing = names.filter((name) => !covered.has(name));

  while (missing.length > 0) {
    const candidates = new Set<string>();

    for (const name of missing) {
      for (let index = name.indexOf("_"); index >= 0; index = name.indexOf("_", index + 1)) {
        const candidate = name.slice(0, index);

        if (!attempted.has(candidate)) {
          candidates.add(candidate);
          break;
        }
      }
    }

    if (candidates.size === 0) {
      break;
    }

    if (attempted.size + candidates.size > MaxCandidates) {
      throw new ProviderCatalogError("Forge returned too many unidentified tool providers.");
    }

    for (const id of candidates) {
      attempted.add(id);
    }

    // Each batch narrows the remaining candidate prefixes.
    // eslint-disable-next-line no-await-in-loop
    record(await probeProviders(url, headers, [...candidates]));
    missing = names.filter((name) => !covered.has(name));
  }

  if (missing.length > 0) {
    // Provider availability can change while Forge is queried; retry matching IDs once.
    const retry = [...attempted].filter((id) => missing.some((name) => name.startsWith(`${id}_`)));
    record(await probeProviders(url, headers, retry));
    missing = names.filter((name) => !covered.has(name));
  }

  if (missing.length > 0) {
    throw new ProviderCatalogError("Forge could not identify every tool provider. Please retry.");
  }

  return [...providers]
    .map(([id, name]) => ({ id, name }))
    .toSorted((a, b) => a.id.localeCompare(b.id));
};

const selectSupportedProviders = (
  ctx: ExtensionCommandContext,
  items: Provider[],
  selected: Set<string>
): void => {
  selected.clear();

  for (const item of items) {
    if (!item.id.includes("_")) {
      selected.add(item.id);
    }
  }

  if (items.some((item) => item.id.includes("_"))) {
    ctx.ui.notify(
      "Forge providers marked All only cannot be used in a custom selection.",
      "warning"
    );
  }
};

const initialSelection = (
  ctx: ExtensionCommandContext,
  available: Provider[],
  preference: ToolsPreference
) => {
  const providers = new Map(available.map((provider) => [provider.id, provider]));

  if (preference !== true) {
    for (const id of preference) {
      if (!providers.has(id)) {
        providers.set(id, { id, name: `${id} (not currently available)` });
      }
    }
  }

  const items = [...providers.values()].toSorted((a, b) => a.id.localeCompare(b.id));

  const selected = new Set(
    preference === true
      ? items.map((item) => item.id)
      : preference.filter((id) => !id.includes("_"))
  );

  if (preference !== true && preference.some((id) => id.includes("_"))) {
    ctx.ui.notify(
      "Providers marked All only will be removed if you save a custom selection.",
      "warning"
    );
  }

  return { all: preference === true, items, selected };
};

const chooseTools = async (
  ctx: ExtensionCommandContext,
  available: Provider[],
  preference: ToolsPreference
): Promise<ToolsPreference | undefined> => {
  const state = initialSelection(ctx, available, preference);
  const { items, selected } = state;
  let { all } = state;
  let initialIndex = 0;

  while (true) {
    const checkedIndices = [
      ...(all ? [0] : []),
      ...items.flatMap((item, index) => (selected.has(item.id) ? [index + 1] : [])),
    ];

    // Each choice changes the next dialog's checked state.
    // eslint-disable-next-line no-await-in-loop
    const choice = await ctx.ui.select(
      "Forge MCP providers",
      [
        { description: "Enable all current and future providers", label: All },
        ...items.map((item) => ({
          description: item.id.includes("_") ? "Available only in All mode" : undefined,
          label: providerLabel(item),
        })),
        { description: "Save the selection; reconnect Forge MCP to apply it", label: Save },
      ],
      {
        checkedIndices,
        helpText: "Select a provider to toggle it, then select Save. Escape cancels.",
        initialIndex,
        markableCount: items.length + 1,
        selectionMarker: "checkbox",
      }
    );

    if (choice === undefined) {
      return undefined;
    }

    if (choice === Save) {
      return all || (items.length > 0 && selected.size === items.length)
        ? true
        : [...selected].toSorted();
    }

    if (choice === All) {
      all = !all;
      selected.clear();

      if (all) {
        for (const item of items) {
          selected.add(item.id);
        }
      }

      initialIndex = 0;
      continue;
    }

    const index = items.findIndex((item) => providerLabel(item) === choice);

    if (index === -1) {
      throw new Error("Forge provider selection is invalid.");
    }

    const { id } = items[index];
    initialIndex = index + 1;

    if (all) {
      all = false;
      selectSupportedProviders(ctx, items, selected);

      if (id.includes("_")) {
        continue;
      }
    }

    if (id.includes("_")) {
      ctx.ui.notify("This provider is only supported in All mode.", "warning");
    } else if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
  }
};

export const registerToolsCommand = (pi: ExtensionAPI): void => {
  pi.registerCommand("forge:tools", {
    description: "Choose which Forge MCP providers are available",
    handler: async (_args, ctx) => {
      if (!ctx.hasUI) {
        ctx.ui.notify("Run /forge:tools in an interactive session.", "error");

        return;
      }

      try {
        const [available, preference] = await Promise.all([
          discoverToolProviders(),
          readToolsPreference(ctx.cwd),
        ]);

        const value = await chooseTools(ctx, available, preference);

        if (value === undefined) {
          return;
        }

        await saveToolsPreference(ctx.cwd, value);

        const effective = await readToolsPreference(ctx.cwd);

        ctx.ui.notify(
          JSON.stringify(effective) === JSON.stringify(value)
            ? "Forge provider selection saved. Run /mcp reload to apply it."
            : "Selection saved, but a project override takes precedence. Run /mcp reload after updating it.",
          "info"
        );
      } catch (error) {
        ctx.ui.notify(
          error instanceof ProviderCatalogError
            ? error.message
            : "Could not configure Forge providers. Check Forge Desktop and OMP plugin settings.",
          "error"
        );
      }
    },
  });
};
