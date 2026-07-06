import { defineConfig } from "eslint/config";

import eslintPluginEnvylabs from "./envylabs-ts.js";

const config = defineConfig(...eslintPluginEnvylabs, {
  ignores: ["**/node_modules/"],
});

export default config;
