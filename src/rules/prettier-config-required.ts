import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import type { ESLint, Rule } from "eslint";

// The config file names Prettier searches for, in its own precedence order.
// Prettier only exposes this search asynchronously (`resolveConfigFile`), and
// ESLint rules run synchronously, so the list is mirrored here and has to be
// refreshed when Prettier adds a name.
const CONFIG_FILE_NAMES = [
  ".prettierrc",
  ".prettierrc.json",
  ".prettierrc.yml",
  ".prettierrc.yaml",
  ".prettierrc.json5",
  ".prettierrc.js",
  ".prettierrc.mjs",
  ".prettierrc.cjs",
  ".prettierrc.ts",
  ".prettierrc.mts",
  ".prettierrc.cts",
  ".prettierrc.toml",
  "prettier.config.js",
  "prettier.config.mjs",
  "prettier.config.cjs",
  "prettier.config.ts",
  "prettier.config.mts",
  "prettier.config.cts",
];

// Prettier also reads a "prettier" key out of the package manifest, in either
// format.
const MANIFEST_FILE_NAMES = ["package.json", "package.yaml"];

// Editors keep an ESLint server alive for the length of a session, so the
// lookup is cached to keep it off the hot path -- but only briefly, so that
// adding the config file clears the warnings without a restart.
const CACHE_TTL_MS = 10_000;

const cache = new Map<string, { checkedAt: number; found: null | string }>();

const hasPrettierKey = (manifestPath: string): boolean => {
  let contents: string;

  try {
    contents = readFileSync(manifestPath, "utf8");
  } catch {
    return false;
  }

  if (manifestPath.endsWith(".json")) {
    try {
      const parsed: unknown = JSON.parse(contents);

      return (
        typeof parsed === "object" && parsed !== null && "prettier" in parsed
      );
    } catch {
      return false;
    }
  }

  return /^prettier\s*:/m.test(contents);
};

const findPrettierConfig = (startDirectory: string): null | string => {
  let directory = resolve(startDirectory);

  for (;;) {
    for (const name of CONFIG_FILE_NAMES) {
      const candidate = join(directory, name);

      if (existsSync(candidate)) {
        return candidate;
      }
    }

    for (const name of MANIFEST_FILE_NAMES) {
      const manifest = join(directory, name);

      if (existsSync(manifest) && hasPrettierKey(manifest)) {
        return manifest;
      }
    }

    const parent = dirname(directory);

    if (parent === directory) {
      return null;
    }

    directory = parent;
  }
};

const findPrettierConfigCached = (startDirectory: string): null | string => {
  const cached = cache.get(startDirectory);
  const now = Date.now();

  if (cached && now - cached.checkedAt < CACHE_TTL_MS) {
    return cached.found;
  }

  const found = findPrettierConfig(startDirectory);

  cache.set(startDirectory, { checkedAt: now, found });

  return found;
};

const rule: Rule.RuleModule = {
  create(context) {
    return {
      Program(node) {
        const filename = context.physicalFilename;

        // Sources ESLint was handed without a path of their own are named
        // `<input>` or `<text>`, which no directory search can start from.
        if (!filename || filename.startsWith("<")) {
          return;
        }

        if (findPrettierConfigCached(dirname(filename)) !== null) {
          return;
        }

        context.report({
          loc: { column: 0, line: 1 },
          messageId: "missingPrettierConfig",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Require a project-local Prettier config file, so that editors and the prettier/prettier rule format code identically",
    },
    messages: {
      missingPrettierConfig:
        'No Prettier config file found for this project. Without one, your editor formats using its own defaults while prettier/prettier uses Prettier\'s, and the two will disagree. Add a prettier.config.js containing: export { default } from "eslint-config-envylabs/prettier";',
    },
    schema: [],
    type: "problem",
  },
};

const plugin: ESLint.Plugin = {
  rules: { "prettier-config-required": rule },
};

export default plugin;
