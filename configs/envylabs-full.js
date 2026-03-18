import eslintPluginEnvylabs from "./envylabs-ts.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...eslintPluginEnvylabs,
  {
    ignores: [
      "**/.next/",
      "**/.storybook/",
      "**/.yarn/",
      "**/node_modules/",
      "**/storybook-static/",
    ],
  },
];
