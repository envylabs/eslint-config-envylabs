import js from "@eslint/js";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: { perfectionist: eslintPluginPerfectionist },
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
      "perfectionist/sort-array-includes": "warn",
      "perfectionist/sort-classes": "warn",
      "perfectionist/sort-decorators": "warn",
      "perfectionist/sort-enums": "warn",
      "perfectionist/sort-export-attributes": "warn",
      "perfectionist/sort-exports": "warn",
      "perfectionist/sort-heritage-clauses": "warn",
      "perfectionist/sort-import-attributes": "warn",
      "perfectionist/sort-interfaces": "warn",
      "perfectionist/sort-intersection-types": "warn",
      "perfectionist/sort-jsx-props": "warn",
      "perfectionist/sort-maps": "warn",
      "perfectionist/sort-modules": "warn",
      "perfectionist/sort-named-exports": "warn",
      "perfectionist/sort-named-imports": "warn",
      "perfectionist/sort-object-types": "warn",
      "perfectionist/sort-objects": "warn",
      "perfectionist/sort-sets": "warn",
      "perfectionist/sort-switch-case": "warn",
      "perfectionist/sort-union-types": "warn",
      "perfectionist/sort-variable-declarations": "warn",
      "prettier/prettier": "warn",
    },
  },
];
