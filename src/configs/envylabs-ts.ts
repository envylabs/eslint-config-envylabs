import { defineConfig } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import { configs as tseslintConfigs } from "typescript-eslint";

import eslintPluginEnvylabs from "./envylabs-js.js";

// importX.flatConfigs.typescript registers the resolver by its legacy string
// name ("import-x/resolver": { typescript: true }), which makes
// eslint-plugin-import-x resolve eslint-import-resolver-typescript from the
// *consuming* project's root. That only works when npm happens to hoist the
// resolver out of this package's node_modules, so a routine lockfile refresh in
// a consumer can nest it and break every import-x rule with "typescript with
// invalid interface loaded as resolver". Importing the factory here resolves it
// relative to this package instead, so hoisting no longer matters.
// "import-x/resolver-next" takes precedence over the legacy key, which is
// dropped below so the stale setting can never be reached.
const typescriptSettings: Record<string, unknown> = {
  ...importX.flatConfigs.typescript.settings,
};
delete typescriptSettings["import-x/resolver"];

const config = defineConfig(
  ...eslintPluginEnvylabs,
  ...tseslintConfigs.recommended,
  {
    ...importX.flatConfigs.typescript,
    settings: {
      ...typescriptSettings,
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
      },
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          allowDefaultCaseForExhaustiveSwitch: true,
          considerDefaultExhaustiveForUnions: true,
          requireDefaultForNonUnion: true,
        },
      ],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      // Only enable @typescript-eslint/explicit-module-boundary-types in .ts
      // files (not .tsx) because React component return types (e.g.
      // JSX.Element) are verbose and almost always omitted in .tsx files.
      // Enforcing this rule there would add friction without much benefit.
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);

export default config;
