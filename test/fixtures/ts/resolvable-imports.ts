// Exercises the TypeScript import resolver: a bare package specifier, a
// type-only package specifier, and a relative import that relies on TypeScript
// extension rewriting (.js -> .ts). If the resolver is not wired up, import-x
// reports "Resolve error" / no-unresolved on these.
import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";

import { getFruitColor } from "./exhaustive-switch.js";

export function describeFruit(config: Linter.Config[]): string {
  return `${String(defineConfig(config).length)}:${getFruitColor("apple")}`;
}
