import { describe, expect, it } from "vitest";

import prettierConfig from "../src/prettier.js";

describe("shared prettier config", () => {
  it("pins the options that editors and prettier/prettier would otherwise resolve separately", () => {
    expect(prettierConfig).toMatchObject({
      printWidth: 80,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "all",
    });
  });
});
