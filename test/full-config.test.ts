import { describe, expect, it } from "vitest";

import fullConfig from "../configs/envylabs-full.js";

describe("envylabs-full config", () => {
  it("is a valid flat config array", () => {
    expect(fullConfig).not.toHaveLength(0);
  });

  it("includes ignores for common directories", () => {
    const ignoreConfig = fullConfig.find((c) => c.ignores);

    expect(ignoreConfig).toMatchObject({
      ignores: expect.arrayContaining([
        "**/node_modules/",
        "**/.next/",
        "**/.yarn/",
        "**/storybook-static/",
      ]),
    });
  });
});
