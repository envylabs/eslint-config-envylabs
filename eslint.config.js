import eslintConfigEnvylabs from "./index.js";

export default [...eslintConfigEnvylabs.full, { ignores: ["test/fixtures/"] }];
