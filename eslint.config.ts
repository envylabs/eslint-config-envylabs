import { globalIgnores } from "eslint/config";

import eslintConfigEnvylabs from "./src/index.js";

export default [
  ...eslintConfigEnvylabs.full,
  globalIgnores(["dist/", "test/fixtures/"]),
];
