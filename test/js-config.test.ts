import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import jsConfig from "../configs/envylabs-js.js";

const linter = new Linter({ configType: "flat" });

// Disable resolution-dependent rules so tests focus on what this config adds
const testConfig: Linter.Config[] = [
  ...jsConfig,
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

describe("no-warning-comments", () => {
  it("warns on TODO comments", () => {
    const messages = linter.verify(
      "// TODO: fix this\nconst x = 1;\n",
      testConfig,
      { filename: "test.js" },
    );

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: "no-warning-comments" }),
    );
  });

  it("does not warn on regular comments", () => {
    const messages = linter.verify(
      "// just a comment\nconst x = 1;\n",
      testConfig,
      { filename: "test.js" },
    );

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "no-warning-comments" }),
    );
  });
});

describe("curly", () => {
  it("warns when an if statement omits curly braces", () => {
    const messages = linter.verify("if (x) doSomething();\n", testConfig, {
      filename: "test.js",
    });

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: "curly" }),
    );
  });

  it("does not warn when an if statement uses curly braces", () => {
    const messages = linter.verify("if (x) { doSomething(); }\n", testConfig, {
      filename: "test.js",
    });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "curly" }),
    );
  });
});

describe("import-x/order", () => {
  it("warns when a sibling import precedes a builtin import", () => {
    const code = 'import foo from "./foo";\nimport fs from "fs";\n';
    const messages = linter.verify(code, testConfig, { filename: "test.js" });

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: "import-x/order" }),
    );
  });

  it("does not warn when builtin imports precede sibling imports", () => {
    const code = 'import fs from "fs";\n\nimport foo from "./foo";\n';
    const messages = linter.verify(code, testConfig, { filename: "test.js" });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "import-x/order" }),
    );
  });

  it("warns when external imports are not alphabetized", () => {
    const code = 'import z from "zzz";\nimport a from "aaa";\n';
    const messages = linter.verify(code, testConfig, { filename: "test.js" });

    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: "import-x/order" }),
    );
  });

  it("does not warn when external imports are alphabetized", () => {
    const code = 'import a from "aaa";\nimport z from "zzz";\n';
    const messages = linter.verify(code, testConfig, { filename: "test.js" });

    expect(messages).not.toContainEqual(
      expect.objectContaining({ ruleId: "import-x/order" }),
    );
  });
});
