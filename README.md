# Envy Labs ESLint configuration

Opinionated linting configuration used across Envy Labs projects. Valid for JavaScript or TypeScript projects.

## How to use

1. Install the dependency

```sh
npm add -D eslint-config-envylabs
```

2. Add it to your `eslint.config.js`:

```js
import eslintConfigEnvylabs from "eslint-config-envylabs";

export default [
  // If you're using JavaScript
  ...eslintConfigEnvylabs.js,
  // ...or if you're using TypeScript. The TypeScript config includes the
  // JavaScript one, so you don't need to include both in that case.
  ...eslintConfigEnvylabs.ts,
  {
    // Your config here
  },
];
```

Also, you can use the `full` config, which includes the `js`, `ts` and very opinionated Envy Labs configs:

```js
import eslintConfigEnvylabs from "eslint-config-envylabs";

export default [
  ...eslintConfigEnvylabs.full,
  {
    // Your config here
  },
];
```

## What it does

- Lints JavaScript using [
  `eslint:recommended`](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-eslintrecommended).
- Additionally, lints TypeScript using [`@typescript-eslint/recommended`](https://typescript-eslint.io/docs/linting/configs).
- Uses rules inside the [configs](configs) folder.
