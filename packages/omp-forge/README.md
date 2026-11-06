# Forge for OMP

Use Forge Models, Forge MCP and Forge Router for OMP.

Forge MCP tools are available, but Forge MCP prompts do not appear as slash commands.

## Installation

If the marketplace is not registered, add it:

```sh
omp plugin marketplace add gerardthehuman/forge-extensions
```

Install Forge from the `omp-forge` marketplace:

```sh
omp plugin install forge@omp-forge
```

## Commands

| Command          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `/forge:usage`   | Show the current billing account and remaining budget in USD |
| `/forge:billing` | Choose Personal Budget or an eligible project budget         |
| `/forge:refresh` | Refresh Desktop and Router models and their shared cache     |
| `/forge:tools`   | Choose Forge MCP providers                                   |

`/forge:tools` lists providers currently available from Forge. Select **All** to enable current and
future providers, or select individual providers. A custom selection excludes new providers until
you select them. Providers marked **All only** cannot be selected individually because of a Forge
MCP limitation. Switching to a custom selection deselects them. The selection persists in OMP plugin
settings. Save it, then run `/mcp reload` to apply it. Forge MCP prompts remain disabled in every
mode.

Billing selections are saved with the session and apply to Desktop, Router, and worker requests.
Billing notices appear in the transcript and stay outside model context. Project balances show the
remaining amount because Forge does not provide their total allocation.

OMP adds a transcript notice when Forge reports a different model. The notice stays outside model
context. OMP does not change the selected model. OMP adds reported costs across retry attempts. If
an attempt has no reported cost, the transcript identifies the displayed cost as incomplete or
estimated. The input and output cost breakdown remains an estimate.

Saved model catalogs load before network discovery. Both plugins share the cache. Run
`/forge:refresh` to update model availability, pricing, and limits in the current session. Type
`/forge:` to autocomplete the available commands.

## Forge Router

To use Forge Router, use the `/providers` command and choose `Forge Router` then provide your API
key.
