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

| Command          | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `/forge usage`   | Show available and total daily credits from Forge Desktop |
| `/forge-refresh` | Refresh Desktop and Router models and their shared cache  |

Saved model catalogs load before network discovery. Both plugins share the cache. Run
`/forge-refresh` to update model availability, pricing, and limits in the current session.

## Forge Router

To use Forge Router, use the `/providers` command and choose `Forge Router` then provide your API
key.
