import { getPluginSettings } from "@oh-my-pi/pi-coding-agent/extensibility/plugins/loader";
import { PluginManager } from "@oh-my-pi/pi-coding-agent/extensibility/plugins/manager";
import { z } from "zod";

const PluginName = "@forge/omp";

const ProviderId = z
  .string()
  .min(1)
  .refine((value) => value === value.trim() && !value.includes(","));

const ToolsSchema = z.union([z.literal(true), z.array(ProviderId)]);

export type ToolsPreference = z.infer<typeof ToolsSchema>;

export const readToolsPreference = async (cwd: string): Promise<ToolsPreference> => {
  const settings = await getPluginSettings(PluginName, cwd);

  return ToolsSchema.parse(settings.tools === undefined ? true : settings.tools);
};

export const saveToolsPreference = async (cwd: string, value: ToolsPreference): Promise<void> => {
  const manager = new PluginManager(cwd);
  await manager.setPluginSetting(PluginName, "tools", ToolsSchema.parse(value));
};

export const applyToolsPreference = (url: URL, preference: ToolsPreference): void => {
  if (preference !== true) {
    if (preference.some((id) => id.includes("_"))) {
      throw new Error("Forge cannot scope a provider whose ID contains an underscore.");
    }

    url.searchParams.set("providers", preference.length === 0 ? "," : preference.join(","));
  }
};
