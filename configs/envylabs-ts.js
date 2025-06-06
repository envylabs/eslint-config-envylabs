import tseslint from "typescript-eslint";
import eslintPluginEnvylabs from "./envylabs-js.js";

export default [
  ...eslintPluginEnvylabs,
  ...tseslint.configs.recommended,
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
  },
  {
    files: ["**/*.ts"],
    rules: {
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
