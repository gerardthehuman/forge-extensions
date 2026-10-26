import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const BuildManifestSchema = z.object({
  description: z.string(),
  name: z.string(),
  version: z.string(),
});

const DependencyManifestSchema = z.object({
  name: z.string(),
  private: z.boolean().optional().catch(undefined),
  version: z.string(),
});

interface BundledOutput {
  name: string;
  text: string;
}

const parseBuildManifest = (source: string) => {
  const parsed = BuildManifestSchema.safeParse(JSON.parse(source));

  if (!parsed.success) {
    throw new Error("omp-presets package.json does not match the expected manifest contract");
  }

  return parsed.data;
};

const parseDependencyManifest = (source: string) => {
  const parsed = DependencyManifestSchema.safeParse(JSON.parse(source));

  if (!parsed.success) {
    throw new Error("Dependency package.json does not match the expected manifest contract");
  }

  return parsed.data;
};

const loadNotice = async (directory: string): Promise<string | undefined> => {
  const dependency = parseDependencyManifest(
    await readFile(path.join(directory, "package.json"), "utf-8")
  );

  try {
    const license = await readFile(path.join(directory, "LICENSE"), "utf-8");

    return `${dependency.name}@${dependency.version}\n${license.trimEnd()}`;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT" &&
      dependency.private === true
    ) {
      return undefined;
    }

    throw error;
  }
};

const root = import.meta.dir;
const destination = path.resolve(root, "../../plugins/omp-presets");
const manifest = parseBuildManifest(await readFile(path.join(root, "package.json"), "utf-8"));
const entrypoints = ["src/index.ts"];

const result = await Bun.build({
  entrypoints: entrypoints.map((entry) => path.join(root, entry)),
  env: "disable",
  external: [],
  format: "esm",
  metafile: true,
  minify: { syntax: true },
  packages: "external",
  root,
  target: "node",
});

if (!result.success || !result.metafile) {
  throw new AggregateError(result.logs, `omp-presets bundle generation failed`);
}

const { metafile } = result;

await rm(destination, { force: true, recursive: true });

await mkdir(destination, { recursive: true });

const bundled: BundledOutput[] = await Promise.all(
  result.outputs.map(async (output) => {
    const metadata = metafile.outputs[output.path];
    const packageRoots = new Set<string>();

    for (const input of Object.keys(metadata.inputs)) {
      const match = /^(?<root>.*node_modules\/(?:@[^/]+\/)?[^/]+)(?:\/|$)/u.exec(input);

      if (match?.groups?.root !== undefined) {
        const packageRoot = match.groups.root;

        packageRoots.add(
          path.isAbsolute(packageRoot) ? packageRoot : path.resolve(root, packageRoot)
        );
      }
    }

    const notices: string[] = [];
    const resolved = await Promise.all([...packageRoots].toSorted().map(loadNotice));

    for (const notice of resolved) {
      if (notice !== undefined) {
        notices.push(notice);
      }
    }

    const footer = notices.length
      ? `\n// Third-party licenses\n${notices
          .join("\n\n")
          .split("\n")
          .map((line) => `// ${line}`)
          .join("\n")}\n`
      : "";

    return {
      name: path.basename(output.path),
      text: (await output.text()) + footer,
    };
  })
);

await Promise.all(
  bundled.map(async ({ name, text }) => {
    await writeFile(path.join(destination, name), text);
  })
);

for (const { name } of bundled) {
  console.log(`Built omp-presets/${name}`);
}

const runtime = {
  description: manifest.description,
  name: manifest.name,
  omp: { extensions: ["index.js"] },
  private: true,
  type: "module",
  version: manifest.version,
};

await writeFile(path.join(destination, "package.json"), `${JSON.stringify(runtime, null, 2)}\n`);
