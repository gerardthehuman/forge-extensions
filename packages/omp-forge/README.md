# Forge for OMP

Use Forge Models, Forge MCP and Forge Router for OMP.

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

Billing selections are saved with the session and apply to Desktop, Router, and worker requests.
Billing notices appear in the transcript and stay outside model context. Project balances show the
remaining amount because Forge does not provide their total allocation.

Saved model catalogs load before network discovery. Both plugins share the cache. Run
`/forge:refresh` to update model availability, pricing, and limits in the current session. Type
`/forge:` to autocomplete the available commands.

## Forge Router

To use Forge Router, use the `/providers` command and choose `Forge Router` then provide your API
key.
