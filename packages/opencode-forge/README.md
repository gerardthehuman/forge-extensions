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

## Forge MCP

Forge MCP tools are available in OpenCode. Skill prompts from this connection do not appear as slash
commands.

## Forge Router

To use Forge Router, use the `/connect` command and choose `Forge Router` then provide your API key.
