import { describe, expect, it } from "vitest";
import { parseNamedImports } from "../src/parse.js";

describe("parseNamedImports", () => {
  it("extracts named imports with aliases and line numbers", () => {
    const imports = parseNamedImports(
      "src/app.ts",
      `import defaultThing, { realExport, missingExport as localMissing } from "demo-pkg";
import type { TypeExport } from "types-pkg";
import { local } from "./local";
import { readFile } from "node:fs/promises";
import { futureApi } from "node:future";
import { stat } from "fs";
import { access } from "fs/promises";
`
    );

    expect(imports).toEqual([
      {
        file: "src/app.ts",
        moduleName: "demo-pkg",
        importedName: "realExport",
        localName: "realExport",
        line: 1
      },
      {
        file: "src/app.ts",
        moduleName: "demo-pkg",
        importedName: "missingExport",
        localName: "localMissing",
        line: 1
      },
      {
        file: "src/app.ts",
        moduleName: "types-pkg",
        importedName: "TypeExport",
        localName: "TypeExport",
        line: 2
      }
    ]);
  });
});
