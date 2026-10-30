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

To start the OpenCode web sandbox, run:

```sh
bun run sandbox web
```

Open the one-use sign-in link that the server prints. If the link expires, open the server address
and use the printed password. The web sandbox loads the Forge plugin for every project. It uses
separate OpenCode state and an available localhost port. The sandboxes do not restrict filesystem or
network access.

Each sandbox exposes only Forge and Forge Router providers. Log in to Forge Router separately in
each sandbox. Rebuild the plugins and restart the sandbox after source changes.
