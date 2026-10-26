import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import {
  acquireModelRoleMutation,
  getModelPreset,
} from "@oh-my-pi/pi-coding-agent/config/model-presets";
import type { ModelPresetSession } from "@oh-my-pi/pi-coding-agent/config/model-presets";
import {
  pickDefaultAvailableModel,
  resolveModelRoleValue,
} from "@oh-my-pi/pi-coding-agent/config/model-resolver";
import { cfgModelRoles } from "@oh-my-pi/pi-coding-agent/config/model-settings";
import type { ModelPreset } from "@oh-my-pi/pi-coding-agent/config/model-settings";
import type { Settings } from "@oh-my-pi/pi-coding-agent/config/settings";
import { cfgDefaultThinkingLevel } from "@oh-my-pi/pi-coding-agent/session/settings";

export const SESSION_ENTRY = "native-presets/session";

export type SettingsOverrides = ReturnType<Settings["overlayLayers"]>["overrides"];

export const roleOverrides = (
  settings: Settings,
  preset: ModelPreset
): Record<string, string | null> => {
  const roles: Record<string, string | null> = {};

  for (const role of Object.keys(settings.getModelRoles())) {
    roles[role] = null;
  }

  return Object.assign(roles, preset.modelRoles);
};

export const installPresetRoles = (settings: Settings, preset: ModelPreset): void => {
  // Records merge across layers: null tombstones prevent omitted roles leaking in.
  settings.writeValue(cfgModelRoles, roleOverrides(settings, preset), "override");

  if (preset.defaultThinkingLevel !== undefined) {
    cfgDefaultThinkingLevel.override(settings, preset.defaultThinkingLevel);
  }
};

export const restoreOverrides = (settings: Settings, overrides: SettingsOverrides): void => {
  for (const setting of [cfgModelRoles, cfgDefaultThinkingLevel]) {
    const value = overrides[setting.id];

    if (value === undefined) {
      settings.clearOverrideValue(setting);
    } else {
      settings.writeValue(setting, value, "override");
    }
  }
};

// Thinking levels crossing the extension boundary are plain string payloads,
// while `Effort` is a type-only const enum. Decode payloads into the host union
// with a membership check instead of an assertion.
type SessionThinkingLevel = NonNullable<
  Parameters<Pick<ModelPresetSession, "setThinkingLevel">["setThinkingLevel"]>[0]
>;

const CONFIGURED_THINKING_LEVELS = [
  "auto",
  "inherit",
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];

const isConfiguredThinkingLevel = (value: string): value is SessionThinkingLevel =>
  CONFIGURED_THINKING_LEVELS.some((level) => level === value);

// The host session accepts configured thinking levels (including "auto") while the
// extension signature omits that alias. The narrowed property type below stays
// bivariant with the host's method signature, so session adapters can forward
// configured levels unchanged.
export const thinkingLevelSetter = (
  pi: ExtensionAPI
): Pick<ModelPresetSession, "setThinkingLevel"> => ({
  setThinkingLevel: (level: Parameters<ExtensionAPI["setThinkingLevel"]>[0]) => {
    pi.setThinkingLevel(level);
  },
});

export const activatePreset = async (
  pi: ExtensionAPI,
  ctx: ExtensionContext,
  settings: Settings,
  name: string
): Promise<ModelPreset> => {
  const release = await acquireModelRoleMutation();
  const { setThinkingLevel } = thinkingLevelSetter(pi);

  try {
    const lookup = getModelPreset(settings, name);

    if (lookup.kind === "missing") {
      throw new Error(`Preset not found: ${name}`);
    }

    if (lookup.kind === "invalid") {
      throw new Error(`Preset "${name}" is malformed: ${lookup.reason}`);
    }

    const { preset } = lookup;
    const candidates = ctx.models.list();
    const preview = settings.overlay();

    installPresetRoles(preview, preset);

    const selector = preset.modelRoles.default;

    const resolved = selector
      ? resolveModelRoleValue(selector, candidates, { settings: preview })
      : undefined;

    const model = selector
      ? resolved?.model
      : pickDefaultAvailableModel(
          candidates.filter((candidate) => ctx.modelRegistry.hasConfiguredAuth(candidate)),
          (provider) => ctx.modelRegistry.hasConcreteAuth(provider)
        );

    if (!model) {
      throw new Error(`Preset "${name}" has no available default model`);
    }

    if (!ctx.modelRegistry.hasConfiguredAuth(model)) {
      throw new Error(`No credentials for ${model.provider}/${model.id}`);
    }

    const previous = settings.overlayLayers().overrides;

    installPresetRoles(settings, preset);

    try {
      // The host API emits model_changed and records model_change via AgentSession.setModel.
      if (!(await pi.setModel(model))) {
        throw new Error(`Could not select ${model.provider}/${model.id}`);
      }

      const thinking =
        resolved?.explicitThinkingLevel === true
          ? resolved.thinkingLevel
          : (preset.defaultThinkingLevel ?? cfgDefaultThinkingLevel.get(settings));

      if (thinking !== undefined && thinking !== "inherit" && isConfiguredThinkingLevel(thinking)) {
        setThinkingLevel(thinking);
      }
    } catch (error) {
      restoreOverrides(settings, previous);

      throw error;
    }

    pi.appendEntry(SESSION_ENTRY, preset);

    return preset;
  } finally {
    release();
  }
};
