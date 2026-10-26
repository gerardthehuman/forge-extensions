# Presets for OMP

Use named model-role and thinking presets in OMP, with session-only activation by default.

> This plugin requires OMP 18.6.1 and might conflict with any plugins that register the
> `/preset` command.

## Installation

If the marketplace is not registered, add it:

```sh
omp plugin marketplace add gerardthehuman/forge-extensions
```

Install using the OMP CLI:

```sh
omp plugin install presets@omp-forge
```

## Commands

| Command                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `/preset`               | Open the searchable picker                            |
| `/preset <name>`        | Apply a preset to the current session                 |
| `/preset list`          | List saved presets                                    |
| `/preset save <name>`   | Save current roles and thinking as a global preset    |
| `/preset delete <name>` | Delete a global preset, subject to native scope rules |
| `/preset switch <name>` | Apply a preset persistently                           |
