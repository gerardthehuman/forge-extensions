const open = async (cwd: string, cmd: readonly string[], env: Record<string, string>) => {
  const child = Bun.spawn([...cmd], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["inherit", "inherit", "inherit"],
  });

  process.exitCode = await child.exited;
};

const [agent, ...args] = Bun.argv.slice(2);

const Agents = {
  omp: {
    commands: ["omp"],
    env: {
      PI_CODING_AGENT_DIR: `${import.meta.dir}/omp/.state`,
      PI_CONFIG_FILES: `${import.meta.dir}/omp/config.yml`,
    },
  },
  opencode: {
    commands: ["opencode", "--standalone"],
    env: {
      XDG_CONFIG_HOME: `${import.meta.dir}/opencode/.state/config`,
      XDG_DATA_HOME: `${import.meta.dir}/opencode/.state/data`,
      XDG_STATE_HOME: `${import.meta.dir}/opencode/.state/state`,
    },
  },
};

if (agent !== "omp" && agent !== "opencode") {
  throw new Error(`Usage: bun run sandbox [${Object.keys(Agents).join("|")}]`);
}

const config = Agents[agent];

await open(`${import.meta.dir}/${agent}`, [...config.commands, ...args], config.env);
