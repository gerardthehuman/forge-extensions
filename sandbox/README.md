# Plugin Sandboxes

Test the built Forge plugins in isolated OMP and OpenCode sessions.

Build from the repository root:

```sh
bun install
bun run build
```

Start either sandbox:

```sh
bun run sandbox omp
bun run sandbox opencode
```

Both sandboxes expose only Forge and Forge Router providers. Log in to Forge Router separately in
each sandbox. Rebuild the plugins and restart the sandbox after source changes.
