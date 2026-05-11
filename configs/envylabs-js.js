import js from "@eslint/js";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginSortDestructureKeys from "eslint-plugin-sort-destructure-keys";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "sort-destructure-keys": eslintPluginSortDestructureKeys,
    },
    rules: {
      curly: "warn",
      "import-x/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
      "no-warning-comments": "warn",
      "prettier/prettier": "warn",
      "sort-destructure-keys/sort-destructure-keys": "warn",
    },
  },
];
