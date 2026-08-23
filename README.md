# Envy Labs ESLint configuration

Opinionated linting configuration used across Envy Labs projects. Valid for JavaScript or TypeScript projects. Ships with bundled TypeScript type declarations, so editors and `eslint.config.ts` get full type support out of the box.

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

3. Add a project-local Prettier config

```sh
npm add -D prettier
```

```js
// prettier.config.js
export { default } from "eslint-config-envylabs/prettier";
```

This step is not optional, and this package will warn until you do it. Prettier
resolves its options twice in a project like yours, and the two resolvers only
agree when a config file exists:

- ESLint, through `eslint-plugin-prettier`, resolves your Prettier config and
  otherwise falls back to the defaults of the Prettier version you installed.
- Your editor's Prettier integration falls back to its own settings when no
  config file resolves. The VS Code extension, for instance, applies every
  `prettier.*` VS Code setting in that case -- including any you or a previous
  workspace set globally, and defaults frozen at whatever version of the
  extension you happen to have installed.

Without the file, format-on-save writes code that `prettier/prettier` then warns
about -- most visibly as trailing commas being added and removed on every save.
Sharing the config file above makes both sides read the same values, and pins
them against future changes to Prettier's own defaults.

If you would rather keep the check quiet, turn the rule off in your
`eslint.config.js` (formatting will still drift):

```js
{
  rules: { "envylabs/prettier-config-required": "off" },
}
```

For belt and suspenders, tell VS Code to never format without a config file:

```json
// .vscode/settings.json
{
  "prettier.requireConfig": true
}
```

## What it does

- Lints JavaScript using [
  `eslint:recommended`](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-eslintrecommended).
- Additionally, lints TypeScript using [`@typescript-eslint/recommended`](https://typescript-eslint.io/docs/linting/configs).
- Lints code formatting using [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier).
- Ships Prettier options as a shareable config at
  `eslint-config-envylabs/prettier`, and warns
  (`envylabs/prettier-config-required`) when a project has no Prettier config
  file for its editor to find.
- Lints imports using [`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x).
- Uses rules inside the [src/configs](src/configs) folder.
