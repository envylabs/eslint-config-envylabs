import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint, Linter } from "eslint";
import { describe, expect, it } from "vitest";

import tsConfig from "../configs/envylabs-ts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const linter = new Linter({ configType: "flat" });

// Strip type-info requirements so rules can be tested against inline code. The
// switch-exhaustiveness-check rule needs real files (see below).
const inlineConfig: Linter.Config[] = [
  ...tsConfig.map((cfg) => {
    const parserOpts = cfg.languageOptions?.parserOptions as
      | Record<string, unknown>
      | undefined;

    if (!parserOpts?.projectService) {
      return cfg;
    }

    const { projectService: _ps, ...parserOptions } = parserOpts;
    const { "@typescript-eslint/switch-exhaustiveness-check": _sec, ...rules } =
      cfg.rules ?? {};

    return {
      ...cfg,
      languageOptions: { ...cfg.languageOptions, parserOptions },
      rules,
    };
  }),
  {
    rules: {
      "import-x/default": "off",
      "import-x/named": "off",
      "import-x/no-unresolved": "off",
      "import-x/namespace": "off",
      "prettier/prettier": "off",
    },
  },
];

describe("@typescript-eslint/no-require-imports", () => {
  it("errors when require() is used in a TypeScript file", () => {
    const messages = linter.verify(
      'const fs = require("fs");\n',
      inlineConfig,
      { filename: "test.ts" },
    );

    expect(messages).toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-require-imports",
      }),
    );
  });

  it("does not error when using an ESM import in a TypeScript file", () => {
    const messages = linter.verify(
      'import fs from "fs";\n\nexport { fs };\n',
      inlineConfig,
      { filename: "test.ts" },
    );

    expect(messages).not.toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-require-imports",
      }),
    );
  });
});

describe("@typescript-eslint/no-unused-vars", () => {
  it("warns on unused variables in TypeScript files", () => {
    const messages = linter.verify("const unused = 1;\n", inlineConfig, {
      filename: "test.ts",
    });

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    );
  });

  it("does not warn on variables prefixed with an underscore", () => {
    const messages = linter.verify("const _unused = 1;\n", inlineConfig, {
      filename: "test.ts",
    });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    );
  });

  it("does not apply to .js files (rule is turned off)", () => {
    const messages = linter.verify("const unused = 1;\n", inlineConfig, {
      filename: "test.js",
    });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    );
  });

  it("does not apply to .jsx files (rule is turned off)", () => {
    const messages = linter.verify("const unused = 1;\n", inlineConfig, {
      filename: "test.jsx",
    });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    );
  });
});

describe("@typescript-eslint/explicit-module-boundary-types", () => {
  it("errors when an exported function lacks a return type in a .ts file", () => {
    const messages = linter.verify(
      "export function add(a, b) {\n  return a + b;\n}\n",
      inlineConfig,
      { filename: "test.ts" },
    );

    expect(messages).toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/explicit-module-boundary-types",
      }),
    );
  });

  it("does not error when an exported function has a return type", () => {
    const messages = linter.verify(
      "export function add(a: number, b: number): number {\n  return a + b;\n}\n",
      inlineConfig,
      { filename: "test.ts" },
    );

    expect(messages).not.toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/explicit-module-boundary-types",
      }),
    );
  });

  it("does not apply to .tsx files", () => {
    const messages = linter.verify(
      "export function add(a, b) {\n  return a + b;\n}\n",
      inlineConfig,
      { filename: "test.tsx" },
    );

    expect(messages).not.toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/explicit-module-boundary-types",
      }),
    );
  });
});

describe("@typescript-eslint/switch-exhaustiveness-check", () => {
  const fixturesDir = path.join(__dirname, "fixtures/ts");

  async function lintFixture(filename: string) {
    const eslint = new ESLint({
      overrideConfigFile: path.join(fixturesDir, "eslint.config.js"),
      overrideConfig: tsConfig,
    });
    const results = await eslint.lintFiles([path.join(fixturesDir, filename)]);

    return results[0].messages;
  }

  it("errors when a switch on a union type is missing a case statement", async () => {
    const messages = await lintFixture("missing-case.ts");

    expect(messages).toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/switch-exhaustiveness-check",
      }),
    );
  });

  it("does not error when all union cases are handled", async () => {
    const messages = await lintFixture("exhaustive-switch.ts");

    expect(messages).not.toContainEqual(
      expect.objectContaining({
        ruleId: "@typescript-eslint/switch-exhaustiveness-check",
      }),
    );
  });
});
