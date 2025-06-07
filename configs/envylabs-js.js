import js from "@eslint/js";
import { importX } from "eslint-plugin-import-x";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
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
      "prettier/prettier": "warn",
    },
  },
];
