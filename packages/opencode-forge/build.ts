import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { OpenCodePluginExternals } from "./build-config.ts";

const PackageMetadataSchema = z.object({
  description: z.string().optional(),
  license: z.string().optional(),
  name: z.string(),
  private: z.boolean().optional(),
  version: z.string(),
});

const root = import.meta.dir;
const destination = path.resolve(root, "../../plugins/opencode-forge");
const entrypoints = ["index.ts", "tui.ts"];

const manifestResult = PackageMetadataSchema.safeParse(
  JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"))
);

if (!manifestResult.success) {
  throw new Error("opencode-forge package.json is invalid.");
}

const manifest = manifestResult.data;

const result = await Bun.build({
  entrypoints: entrypoints.map((entry) => path.join(root, entry)),
  env: "disable",
  external: OpenCodePluginExternals,
  format: "esm",
  metafile: true,
  minify: { syntax: true },
  packages: "bundle",
  root,
  target: "node",
});

if (!result.success || !result.metafile) {
  throw new AggregateError(result.logs, `opencode-forge bundle generation failed`);
}

const { metafile, outputs } = result;

await rm(destination, { force: true, recursive: true });

await mkdir(destination, { recursive: true });

const built = await Promise.all(
  outputs.map(async (output) => {
    const fileName = path.basename(output.path);
    const metadata = metafile.outputs[output.path];
    const packageRoots = new Set<string>();

    for (const input of Object.keys(metadata.inputs)) {
      const match = /^(?<packageRoot>.*node_modules\/(?:@[^/]+\/)?[^/]+)(?:\/|$)/u.exec(input);

      if (match?.groups?.packageRoot !== undefined) {
        const { packageRoot } = match.groups;
        packageRoots.add(
          path.isAbsolute(packageRoot) ? packageRoot : path.resolve(root, packageRoot)
        );
      }
    }

    const licenseNotices = await Promise.all(
      [...packageRoots].toSorted().map(async (directory) => {
        const parsed = PackageMetadataSchema.safeParse(
          JSON.parse(await readFile(path.join(directory, "package.json"), "utf-8"))
        );

        if (!parsed.success) {
          throw new Error(`Invalid package.json in ${directory}.`);
        }

        const dependency = parsed.data;

        try {
          const license = await readFile(path.join(directory, "LICENSE"), "utf-8");

          return `${dependency.name}@${dependency.version}\n${license.trimEnd()}`;
        } catch (error) {
          if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
            throw error;
          }

          if (dependency.license !== undefined) {
            return `${dependency.name}@${dependency.version}\nLicense: ${dependency.license} (package contains no LICENSE file)`;
          }

          if (dependency.private !== true) {
            throw error;
          }

          return null;
        }
      })
    );

    const notices = licenseNotices.filter((notice): notice is string => notice !== null);

    const footer = notices.length
      ? `\n// Third-party licenses\n${notices
          .join("\n\n")
          .split("\n")
          .map((line) => `// ${line}`.trimEnd())
          .join("\n")}\n`
      : "";

    await writeFile(path.join(destination, fileName), (await output.text()) + footer);

    return fileName;
  })
);

for (const name of built) {
  console.log(`Built opencode-forge/${name}`);
}

const runtime = {
  description: manifest.description,
  exports: { ".": "./index.js", "./tui": "./tui.js" },
  name: manifest.name,
  private: true,
  type: "module",
  version: manifest.version,
};

await writeFile(path.join(destination, "package.json"), `${JSON.stringify(runtime, null, 2)}\n`);
