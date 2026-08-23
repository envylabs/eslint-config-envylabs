// Prettier options shared by this package's `prettier/prettier` ESLint rule and
// by the editors of consuming projects.
//
// Every option here is one that a project would otherwise inherit from two
// separate places that may disagree:
//
//   1. ESLint, via `eslint-plugin-prettier`, resolves options with
//      `prettier.resolveConfig()` and falls back to the defaults of whichever
//      Prettier version the project installed.
//   2. The VS Code Prettier extension, when (and only when) no Prettier config
//      file resolves for the file, falls back to the user's `prettier.*` VS
//      Code settings -- which carry their own defaults, frozen at whatever the
//      extension shipped with.
//
const prettierConfig = {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
} as const;

type PrettierConfig = typeof prettierConfig;

export type { PrettierConfig };

export default prettierConfig;
