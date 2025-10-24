import { importX } from "eslint-plugin-import-x";
import { configs as tseslintConfigs } from "typescript-eslint";

import eslintPluginEnvylabs from "./envylabs-js.js";

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
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
