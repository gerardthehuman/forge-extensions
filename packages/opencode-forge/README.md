# Forge for OpenCode

Use Forge Models, Forge MCP and Forge Router for OpenCode.

> This requires OpenCode 2.1.4.

## Installation

Install using the OpenCode CLI:

```sh
opencode plugin add 'git+https://github.com/gerardthehuman/forge-extensions.git#path:plugins/opencode-forge'
```

Or, add to your configuration:

```json
{
  "plugins": [
    "git+https://github.com/gerardthehuman/forge-extensions.git#path:plugins/opencode-forge"
  ]
}
```

## Model Refresh

Saved model catalogs load before network discovery. Both plugins share the cache. Run
`/forge:refresh` to update Desktop and Router models, pricing, limits, and the shared cache.

## Usage

Run `/forge:usage` to show the current billing account and its available budget. Personal usage
shows the remaining and total daily dollar amounts. Project usage shows the available dollar amount
because Forge does not expose the total project allocation.

## Billing

Run `/forge:billing` in the TUI to choose Personal Budget or an available project budget. Each
choice shows its available balance. The picker accepts only the listed choices. Forge Desktop must
be running and signed in.

The choice applies to this session and its subagents for Forge Desktop and Forge Router requests.
Billing changes and usage results appear as transcript notices and stay out of model context.
Dismiss the picker to keep the current budget. The bundled TUI entrypoint loads automatically with
the server plugin.

## Forge MCP

Forge MCP tools are available in OpenCode. Skill prompts from this connection do not appear as slash
commands.

## Forge Router

To use Forge Router, use the `/connect` command and choose `Forge Router` then provide your API key.
