import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [...(ultracite.ignorePatterns ?? []), "plugins/**", "AGENTS.md", ".agents/**"],
  printWidth: 100,
  proseWrap: "always",
});
