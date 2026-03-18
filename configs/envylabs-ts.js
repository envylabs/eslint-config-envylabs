import { importX } from "eslint-plugin-import-x";
import { configs as tseslintConfigs } from "typescript-eslint";

import eslintPluginEnvylabs from "./envylabs-js.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...eslintPluginEnvylabs,
  ...tseslintConfigs.recommended,
  importX.flatConfigs.typescript,
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
];
