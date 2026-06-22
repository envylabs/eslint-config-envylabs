import fullConfig from "./configs/envylabs-full.js";
import jsConfig from "./configs/envylabs-js.js";
import tsConfig from "./configs/envylabs-ts.js";

const eslintConfigEnvylabs = {
  full: fullConfig,
  js: jsConfig,
  ts: tsConfig,
} as const;

type EslintConfigEnvylabs = typeof eslintConfigEnvylabs;

export type { EslintConfigEnvylabs };

export default eslintConfigEnvylabs;
