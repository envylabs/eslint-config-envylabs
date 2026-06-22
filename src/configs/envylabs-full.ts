import { defineConfig } from "eslint/config";

import eslintPluginEnvylabs from "./envylabs-ts.js";

const config = defineConfig(...eslintPluginEnvylabs, {
  ignores: [
    "**/.next/",
    "**/.storybook/",
    "**/.yarn/",
    "**/node_modules/",
    "**/storybook-static/",
  ],
});

export default config;
