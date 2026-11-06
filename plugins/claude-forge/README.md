# Forge for Claude Code

Adds Forge Desktop's MCP tools to Claude Code. This plugin has no models, commands, or hooks.
Forge MCP prompts do not appear as slash commands.

## Installation

```sh
claude plugin marketplace add gerardthehuman/forge-extensions
claude plugin install forge@claude-forge
```

Start Forge Desktop before you start Claude Code. Forge picks a new port and token each time it
launches, so the plugin reads `~/.forge/server.json` at runtime. If Forge restarts, the plugin finds
the new endpoint on the next request. Node.js 18 or later is required.
