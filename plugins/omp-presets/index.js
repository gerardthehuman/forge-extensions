// src/index.ts
import {
  applyModelPreset,
  deleteModelPreset,
  formatModelPresetSwitch,
  getModelPreset as getModelPreset2,
  getModelPresetNames,
  isCleanModelPresetSwitch,
  modelPresetSavedMessage,
  saveModelPreset
} from "@oh-my-pi/pi-coding-agent/config/model-presets";
import { findScopedSettings } from "@oh-my-pi/pi-coding-agent/config/settings";

// src/presets.ts
import {
  acquireModelRoleMutation,
  getModelPreset
} from "@oh-my-pi/pi-coding-agent/config/model-presets";
import {
  pickDefaultAvailableModel,
  resolveModelRoleValue
} from "@oh-my-pi/pi-coding-agent/config/model-resolver";
import { cfgModelRoles } from "@oh-my-pi/pi-coding-agent/config/model-settings";
import { cfgDefaultThinkingLevel } from "@oh-my-pi/pi-coding-agent/session/settings";
var SESSION_ENTRY = "native-presets/session", roleOverrides = (settings, preset) => {
  let roles = {};
  for (let role of Object.keys(settings.getModelRoles()))
    roles[role] = null;
  return Object.assign(roles, preset.modelRoles);
}, installPresetRoles = (settings, preset) => {
  if (settings.writeValue(cfgModelRoles, roleOverrides(settings, preset), "override"), preset.defaultThinkingLevel !== void 0)
    cfgDefaultThinkingLevel.override(settings, preset.defaultThinkingLevel);
}, restoreOverrides = (settings, overrides) => {
  for (let setting of [cfgModelRoles, cfgDefaultThinkingLevel]) {
    let value = overrides[setting.id];
    if (value === void 0)
      settings.clearOverrideValue(setting);
    else
      settings.writeValue(setting, value, "override");
  }
}, CONFIGURED_THINKING_LEVELS = [
  "auto",
  "inherit",
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
], isConfiguredThinkingLevel = (value) => CONFIGURED_THINKING_LEVELS.some((level) => level === value), thinkingLevelSetter = (pi) => ({
  setThinkingLevel: (level) => {
    pi.setThinkingLevel(level);
  }
}), activatePreset = async (pi, ctx, settings, name) => {
  let release = await acquireModelRoleMutation(), { setThinkingLevel } = thinkingLevelSetter(pi);
  try {
    let lookup = getModelPreset(settings, name);
    if (lookup.kind === "missing")
      throw Error(`Preset not found: ${name}`);
    if (lookup.kind === "invalid")
      throw Error(`Preset "${name}" is malformed: ${lookup.reason}`);
    let { preset } = lookup, candidates = ctx.models.list(), preview = settings.overlay();
    installPresetRoles(preview, preset);
    let selector = preset.modelRoles.default, resolved = selector ? resolveModelRoleValue(selector, candidates, { settings: preview }) : void 0, model = selector ? resolved?.model : pickDefaultAvailableModel(candidates.filter((candidate) => ctx.modelRegistry.hasConfiguredAuth(candidate)), (provider) => ctx.modelRegistry.hasConcreteAuth(provider));
    if (!model)
      throw Error(`Preset "${name}" has no available default model`);
    if (!ctx.modelRegistry.hasConfiguredAuth(model))
      throw Error(`No credentials for ${model.provider}/${model.id}`);
    let previous = settings.overlayLayers().overrides;
    installPresetRoles(settings, preset);
    try {
      if (!await pi.setModel(model))
        throw Error(`Could not select ${model.provider}/${model.id}`);
      let thinking = resolved?.explicitThinkingLevel === !0 ? resolved.thinkingLevel : preset.defaultThinkingLevel ?? cfgDefaultThinkingLevel.get(settings);
      if (thinking !== void 0 && thinking !== "inherit" && isConfiguredThinkingLevel(thinking))
        setThinkingLevel(thinking);
    } catch (error) {
      throw restoreOverrides(settings, previous), error;
    }
    return pi.appendEntry(SESSION_ENTRY, preset), preset;
  } finally {
    release();
  }
};

// src/index.ts
var ACTIONS = ["save", "list", "delete", "switch"], notify = (ctx, text, error = !1) => {
  ctx.ui.notify(text, error ? "warning" : "info");
};
function presetsPlugin(pi) {
  let currentSettings, baseline, activeSession, settingsFor = (ctx) => {
    let settings = findScopedSettings(ctx.cwd);
    if (!settings)
      throw Error("No session-scoped OMP settings are available");
    return currentSettings = settings, settings;
  }, restoreSession = (ctx) => {
    let settings = settingsFor(ctx), sessionId = ctx.sessionManager.getSessionId();
    if (activeSession === sessionId)
      return;
    if (baseline)
      restoreOverrides(settings, baseline);
    baseline = void 0, activeSession = sessionId;
    let entry = ctx.sessionManager.getBranch().findLast((candidate) => candidate.type === "custom" && candidate.customType === SESSION_ENTRY), snapshot = entry?.type === "custom" ? entry.data : void 0;
    if (entry?.type === "custom" && Boolean(snapshot)) {
      let preview = settings.overlay({ modelPresets: { restored: snapshot } }), lookup = getModelPreset2(preview, "restored");
      if (lookup.kind === "found")
        baseline = settings.overlayLayers().overrides, installPresetRoles(settings, lookup.preset);
    }
  }, switchToPreset = async (ctx, settings, name) => {
    let previous = settings.overlayLayers().overrides;
    if (baseline)
      restoreOverrides(settings, baseline);
    let session = {
      getAvailableModels: () => ctx.models.list(),
      modelRegistry: ctx.modelRegistry,
      scopedModels: [],
      setModel: async (model) => {
        if (!await pi.setModel(model))
          throw Error("Could not switch model");
        return { switched: !0 };
      },
      setThinkingLevel: thinkingLevelSetter(pi).setThinkingLevel
    }, result;
    try {
      result = await applyModelPreset(settings, session, name);
    } catch (error) {
      throw restoreOverrides(settings, previous), error;
    }
    if (result.kind === "switched" || result.kind === "failed")
      baseline = void 0, pi.appendEntry(SESSION_ENTRY, null), await settings.flush();
    else
      restoreOverrides(settings, previous);
    notify(ctx, formatModelPresetSwitch(name, result), !isCleanModelPresetSwitch(result));
  }, activateFallback = async (ctx, settings, action, rest) => {
    let target = action;
    if (!target) {
      let names = getModelPresetNames(settings);
      if (!names.length) {
        notify(ctx, "No model presets saved. Use /preset save <name> to create one.");
        return;
      }
      if (!ctx.hasUI)
        throw Error("Usage: /preset <name> (picker requires interactive UI)");
      if (target = await ctx.ui.select("Model presets · session only", names.map((presetName) => {
        let lookup = getModelPreset2(settings, presetName);
        return {
          description: lookup.kind === "found" ? ["default", "slow", "smol"].map((role) => `${role}: ${lookup.preset.modelRoles[role] ?? "(unset)"}`).join(`
`) : "Invalid preset",
          label: presetName
        };
      })) ?? "", !target)
        return;
    } else if (rest.length)
      throw Error("Usage: /preset <name>");
    let previous = settings.overlayLayers().overrides;
    await activatePreset(pi, ctx, settings, target), baseline ??= previous, notify(ctx, `Using preset "${target}" for this session only`);
  };
  pi.on("session_start", (_event, ctx) => {
    restoreSession(ctx);
  }), pi.on("session_switch", (_event, ctx) => {
    restoreSession(ctx);
  }), pi.on("session_tree", (_event, ctx) => {
    activeSession = void 0, restoreSession(ctx);
  }), pi.registerCommand("preset", {
    description: "Apply native model presets to this session; save/list/delete/switch manage native presets",
    getArgumentCompletions(prefix) {
      let settings = currentSettings ?? findScopedSettings();
      if (!settings)
        return null;
      let names = getModelPresetNames(settings), match = /^(?<action>switch|delete)\s+(?<target>.*)$/u.exec(prefix);
      if (match) {
        let action = match.groups?.action ?? "", target = match.groups?.target ?? "";
        return names.filter((name) => name.startsWith(target)).map((name) => ({
          label: name,
          value: `${action} ${name}`
        }));
      }
      if (/\s/u.test(prefix))
        return null;
      return [.../* @__PURE__ */ new Set([...names, ...ACTIONS])].flatMap((name) => name.startsWith(prefix) ? [{ label: name, value: name }] : []);
    },
    async handler(args, ctx) {
      try {
        restoreSession(ctx);
        let settings = settingsFor(ctx), [action = "", ...rest] = args.trim().split(/\s+/u), name = rest.join(" ");
        if (action === "list") {
          let names = getModelPresetNames(settings);
          notify(ctx, names.length ? `Model presets: ${names.join(", ")}` : "No model presets saved. Use /preset save <name> to create one.");
          return;
        }
        if (action === "save") {
          if (!name)
            throw Error("Usage: /preset save <name>");
          saveModelPreset(settings, name), await settings.flush(), notify(ctx, modelPresetSavedMessage(settings, name));
          return;
        }
        if (action === "delete") {
          if (!name)
            throw Error("Usage: /preset delete <name>");
          let result = deleteModelPreset(settings, name);
          await settings.flush();
          let message;
          if (result === "deleted")
            message = `Deleted model preset "${name}"`;
          else if (result === "project")
            message = `Preset "${name}" is defined by a project or --config file; remove it there`;
          else
            message = `Preset not found: ${name}`;
          notify(ctx, message, result !== "deleted");
          return;
        }
        if (action === "switch") {
          if (!name)
            throw Error("Usage: /preset switch <name>");
          await switchToPreset(ctx, settings, name);
          return;
        }
        await activateFallback(ctx, settings, action, rest);
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    }
  });
}
export {
  presetsPlugin as default
};
