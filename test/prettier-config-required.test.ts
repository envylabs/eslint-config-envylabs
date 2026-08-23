import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Linter } from "eslint";
import { afterAll, describe, expect, it } from "vitest";

import envylabsPlugin from "../src/rules/prettier-config-required.js";

const config: Linter.Config = {
  plugins: { envylabs: envylabsPlugin },
  rules: { "envylabs/prettier-config-required": "warn" },
};

// Each case gets its own directory tree so the rule's lookup cache, which is
// keyed by directory, cannot leak a verdict between tests.
const roots: string[] = [];

const makeProject = (configFileName?: string): string => {
  const root = mkdtempSync(join(tmpdir(), "envylabs-prettier-"));

  roots.push(root);

  // A package.json without a "prettier" key must not count as a config.
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "t" }));

  if (configFileName) {
    writeFileSync(join(root, configFileName), "{}");
  }

  const source = join(root, "src");

  mkdirSync(source);

  return source;
};

// The linter's cwd has to be the temp project, or ESLint matches nothing in it
// and reports "No matching configuration found" instead of running the rule.
const lint = (directory: string, cwd = directory): Linter.LintMessage[] =>
  new Linter({ configType: "flat", cwd }).verify("const x = 1;\n", [config], {
    filename: join(directory, "index.js"),
  });

afterAll(() => {
  for (const root of roots) {
    rmSync(root, { force: true, recursive: true });
  }
});

describe("envylabs/prettier-config-required", () => {
  it("warns when the project has no prettier config file", () => {
    const messages = lint(makeProject());

    expect(messages).toHaveLength(1);
    expect(messages).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining("No Prettier config file found"),
        ruleId: "envylabs/prettier-config-required",
        severity: 1,
      }),
    );
  });

  it.each([".prettierrc", ".prettierrc.json", "prettier.config.js"])(
    "does not warn when the project has a %s",
    (configFileName) => {
      // An empty result also proves the rule ran at all -- a non-matching
      // file would show up here as "No matching configuration found".
      expect(lint(makeProject(configFileName))).toStrictEqual([]);
    },
  );

  it("finds a config in an ancestor directory", () => {
    const source = makeProject("prettier.config.js");
    const nested = join(source, "deeply", "nested");

    mkdirSync(nested, { recursive: true });

    expect(lint(nested, source)).toStrictEqual([]);
  });

  it("accepts a prettier key in package.yaml", () => {
    const root = mkdtempSync(join(tmpdir(), "envylabs-prettier-"));

    roots.push(root);
    writeFileSync(
      join(root, "package.yaml"),
      "name: t\nprettier:\n  semi: true\n",
    );

    expect(lint(root)).toStrictEqual([]);
  });

  it("ignores a package.yaml with no prettier key", () => {
    const root = mkdtempSync(join(tmpdir(), "envylabs-prettier-"));

    roots.push(root);
    writeFileSync(join(root, "package.yaml"), "name: t\n");

    expect(lint(root)).toHaveLength(1);
  });

  it("accepts a prettier key in package.json", () => {
    const root = mkdtempSync(join(tmpdir(), "envylabs-prettier-"));

    roots.push(root);
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "t", prettier: { trailingComma: "all" } }),
    );

    expect(lint(root)).toStrictEqual([]);
  });

  // ESLint names such sources `<input>`; matching on that, rather than on the
  // shape of the path, keeps the rule working on Windows.
  it("stays quiet for sources with no path to search from", () => {
    const messages = new Linter({ configType: "flat" }).verify(
      "const x = 1;\n",
      [config],
    );

    expect(messages).toStrictEqual([]);
  });
});
