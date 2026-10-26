import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import {
  applyModelPreset,
  deleteModelPreset,
  formatModelPresetSwitch,
  getModelPreset,
  getModelPresetNames,
  isCleanModelPresetSwitch,
  modelPresetSavedMessage,
  saveModelPreset,
} from "@oh-my-pi/pi-coding-agent/config/model-presets";
import type { ModelPresetSession } from "@oh-my-pi/pi-coding-agent/config/model-presets";
import { findScopedSettings } from "@oh-my-pi/pi-coding-agent/config/settings";
import type { Settings } from "@oh-my-pi/pi-coding-agent/config/settings";

import {
  activatePreset,
  installPresetRoles,
  restoreOverrides,
  SESSION_ENTRY,
  thinkingLevelSetter,
} from "./presets.ts";
import type { SettingsOverrides } from "./presets.ts";

const ACTIONS = ["save", "list", "delete", "switch"];

const notify = (ctx: ExtensionContext, text: string, error = false): void => {
  ctx.ui.notify(text, error ? "warning" : "info");
};

export default function presetsPlugin(pi: ExtensionAPI) {
  let currentSettings: Settings | undefined;
  let baseline: SettingsOverrides | undefined;
  let activeSession: string | undefined;

  const settingsFor = (ctx: ExtensionContext): Settings => {
    const settings = findScopedSettings(ctx.cwd);

    if (!settings) {
      throw new Error("No session-scoped OMP settings are available");
    }

    currentSettings = settings;

    return settings;
  };

  const restoreSession = (ctx: ExtensionContext): void => {
    const settings = settingsFor(ctx);
    const sessionId = ctx.sessionManager.getSessionId();

    if (activeSession === sessionId) {
      return;
    }

    if (baseline) {
      restoreOverrides(settings, baseline);
    }

    baseline = undefined;
    activeSession = sessionId;

    // Store a snapshot, not a preset name: edits/deletion must not change a resumed session.
    const entry = ctx.sessionManager
      .getBranch()
      .findLast(
        (candidate) => candidate.type === "custom" && candidate.customType === SESSION_ENTRY
      );

    const snapshot: unknown = entry?.type === "custom" ? entry.data : undefined;

    if (entry?.type === "custom" && Boolean(snapshot)) {
      const preview = settings.overlay({ modelPresets: { restored: snapshot } });
      const lookup = getModelPreset(preview, "restored");

      if (lookup.kind === "found") {
        baseline = settings.overlayLayers().overrides;

        installPresetRoles(settings, lookup.preset);
      }
    }
  };

  const switchToPreset = async (
    ctx: ExtensionContext,
    settings: Settings,
    name: string
  ): Promise<void> => {
    const previous = settings.overlayLayers().overrides;

    if (baseline) {
      restoreOverrides(settings, baseline);
    }

    const session: ModelPresetSession = {
      getAvailableModels: () => ctx.models.list(),
      modelRegistry: ctx.modelRegistry,
      scopedModels: [],
      setModel: async (model) => {
        if (!(await pi.setModel(model))) {
          throw new Error("Could not switch model");
        }

        return { switched: true };
      },
      setThinkingLevel: thinkingLevelSetter(pi).setThinkingLevel,
    };

    let result;

    try {
      result = await applyModelPreset(settings, session, name);
    } catch (error) {
      restoreOverrides(settings, previous);

      throw error;
    }

    if (result.kind === "switched" || result.kind === "failed") {
      baseline = undefined;

      pi.appendEntry(SESSION_ENTRY, null);

      await settings.flush();
    } else {
      restoreOverrides(settings, previous);
    }

    notify(ctx, formatModelPresetSwitch(name, result), !isCleanModelPresetSwitch(result));
  };

  const activateFallback = async (
    ctx: ExtensionContext,
    settings: Settings,
    action: string,
    rest: string[]
  ): Promise<void> => {
    let target = action;

    if (!target) {
      const names = getModelPresetNames(settings);

      if (!names.length) {
        notify(ctx, "No model presets saved. Use /preset save <name> to create one.");

        return;
      }

      if (!ctx.hasUI) {
        throw new Error("Usage: /preset <name> (picker requires interactive UI)");
      }

      target =
        (await ctx.ui.select(
          "Model presets · session only",
          names.map((presetName) => {
            const lookup = getModelPreset(settings, presetName);

            return {
              description:
                lookup.kind === "found"
                  ? ["default", "slow", "smol"]
                      .map((role) => `${role}: ${lookup.preset.modelRoles[role] ?? "(unset)"}`)
                      .join("\n")
                  : "Invalid preset",
              label: presetName,
            };
          })
        )) ?? "";

      if (!target) {
        return;
      }
    } else if (rest.length) {
      throw new Error("Usage: /preset <name>");
    }

    const previous = settings.overlayLayers().overrides;

    await activatePreset(pi, ctx, settings, target);

    baseline ??= previous;

    notify(ctx, `Using preset "${target}" for this session only`);
  };

  pi.on("session_start", (_event, ctx) => {
    restoreSession(ctx);
  });
  pi.on("session_switch", (_event, ctx) => {
    restoreSession(ctx);
  });
  pi.on("session_tree", (_event, ctx) => {
    activeSession = undefined;
    restoreSession(ctx);
  });

  pi.registerCommand("preset", {
    description:
      "Apply native model presets to this session; save/list/delete/switch manage native presets",
    getArgumentCompletions(prefix) {
      const settings = currentSettings ?? findScopedSettings();

      if (!settings) {
        return null;
      }

      const names = getModelPresetNames(settings);
      const match = /^(?<action>switch|delete)\s+(?<target>.*)$/u.exec(prefix);

      if (match) {
        const action = match.groups?.action ?? "";
        const target = match.groups?.target ?? "";

        return names
          .filter((name) => name.startsWith(target))
          .map((name) => ({
            label: name,
            value: `${action} ${name}`,
          }));
      }

      if (/\s/u.test(prefix)) {
        return null;
      }

      return [...new Set([...names, ...ACTIONS])].flatMap((name) =>
        name.startsWith(prefix) ? [{ label: name, value: name }] : []
      );
    },
    async handler(args, ctx) {
      try {
        restoreSession(ctx);

        const settings = settingsFor(ctx);
        const [action = "", ...rest] = args.trim().split(/\s+/u);
        const name = rest.join(" ");

        if (action === "list") {
          const names = getModelPresetNames(settings);

          notify(
            ctx,
            names.length
              ? `Model presets: ${names.join(", ")}`
              : "No model presets saved. Use /preset save <name> to create one."
          );

          return;
        }

        if (action === "save") {
          if (!name) {
            throw new Error("Usage: /preset save <name>");
          }

          saveModelPreset(settings, name);

          await settings.flush();

          notify(ctx, modelPresetSavedMessage(settings, name));

          return;
        }

        if (action === "delete") {
          if (!name) {
            throw new Error("Usage: /preset delete <name>");
          }

          const result = deleteModelPreset(settings, name);

          await settings.flush();

          let message: string;

          if (result === "deleted") {
            message = `Deleted model preset "${name}"`;
          } else if (result === "project") {
            message = `Preset "${name}" is defined by a project or --config file; remove it there`;
          } else {
            message = `Preset not found: ${name}`;
          }

          notify(ctx, message, result !== "deleted");

          return;
        }

        if (action === "switch") {
          if (!name) {
            throw new Error("Usage: /preset switch <name>");
          }

          await switchToPreset(ctx, settings, name);

          return;
        }

        await activateFallback(ctx, settings, action, rest);
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    },
  });
}
