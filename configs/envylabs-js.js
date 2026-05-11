import js from "@eslint/js";
import { importX } from "eslint-plugin-import-x";
import { configs as eslintPluginPerfectionist } from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  eslintPluginPerfectionist["recommended-alphabetical"],
  {
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
    },
  },
];
