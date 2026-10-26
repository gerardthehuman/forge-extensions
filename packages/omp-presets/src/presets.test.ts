import { describe, expect, test } from "bun:test";

import type { Effort } from "@oh-my-pi/pi-ai";
import { cfgModelRoles } from "@oh-my-pi/pi-coding-agent/config/model-settings";
import { Settings } from "@oh-my-pi/pi-coding-agent/config/settings";
import { cfgDefaultThinkingLevel } from "@oh-my-pi/pi-coding-agent/session/settings";

import { installPresetRoles, restoreOverrides } from "./presets.ts";

const EFFORT_PAYLOADS = ["minimal", "low", "medium", "high", "xhigh", "max"];

const isEffort = (value: string): value is Effort =>
  EFFORT_PAYLOADS.some((payload) => payload === value);

const effort = (value: string): Effort => {
  if (!isEffort(value)) {
    throw new Error(`Unknown thinking effort: ${value}`);
  }

  return value;
};

const settingsWithCliRoles = (): Settings => {
  const settings = Settings.isolated();
  settings.writeValue(
    cfgModelRoles,
    { default: "provider/cli", summarizer: "provider/cli" },
    "global"
  );

  return settings;
};

describe("installPresetRoles", () => {
  test("installs model roles and marks overrides as runtime", () => {
    const settings = settingsWithCliRoles();
    installPresetRoles(settings, {
      modelRoles: { default: "provider/new", slow: "@default" },
    });

    expect(settings.getModelRoles()).toEqual({ default: "provider/new", slow: "@default" });
    expect(settings.getProvenance(cfgModelRoles)).toBe("runtime");
    expect(settings.overlayLayers().overrides).toEqual({
      modelRoles: { default: "provider/new", slow: "@default", summarizer: null },
    });
  });

  test("restoring runtime overrides preserves original CLI roles and thinking", () => {
    const settings = settingsWithCliRoles();
    settings.writeValue(cfgDefaultThinkingLevel, effort("high"), "global");
    const previous = settings.overlayLayers().overrides;

    installPresetRoles(settings, {
      defaultThinkingLevel: effort("low"),
      modelRoles: { default: "provider/new", slow: "@default" },
    });
    restoreOverrides(settings, previous);

    expect(settings.getModelRoles()).toEqual({
      default: "provider/cli",
      summarizer: "provider/cli",
    });
    expect(cfgDefaultThinkingLevel.get(settings)).toBe(effort("high"));
    expect(settings.getProvenance(cfgModelRoles)).toBe("global");
  });

  test("restoring absent overrides reveals current persisted values", () => {
    const settings = settingsWithCliRoles();
    const previous = settings.overlayLayers().overrides;

    installPresetRoles(settings, {
      defaultThinkingLevel: effort("low"),
      modelRoles: { default: "provider/new", slow: "@default" },
    });
    settings.writeValue(
      cfgModelRoles,
      { default: "provider/global", summarizer: "provider/global" },
      "global"
    );
    restoreOverrides(settings, previous);

    expect(settings.getModelRoles()).toEqual({
      default: "provider/global",
      summarizer: "provider/global",
    });
    expect(settings.getProvenance(cfgModelRoles)).toBe("global");
  });
});
