import eslintPluginEnvylabs from "./envylabs-ts.js";

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
