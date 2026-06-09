import { describe, expect, it } from "vitest";
import { toMarkdown } from "../src/markdown.js";
import type { ImportProofReport } from "../src/types.js";

describe("toMarkdown", () => {
  it("renders import totals and findings", () => {
    const markdown = toMarkdown({
      files: ["src/app.ts"],
      imports: [
        {
          file: "src/app.ts",
          moduleName: "demo-pkg",
          importedName: "missingExport",
          localName: "missingExport",
          line: 1
        }
      ],
      packages: [
        {
          moduleName: "demo-pkg",
          exports: ["realExport"],
          found: true,
          sourceFile: "node_modules/demo-pkg/index.d.ts"
        }
      ],
      findings: [
        {
          severity: "error",
          code: "missing-named-export",
          message: "demo-pkg does not export missingExport.",
          file: "src/app.ts",
          line: 1,
          moduleName: "demo-pkg",
          importedName: "missingExport"
        }
      ],
      totals: {
        files: 1,
        imports: 1,
        errors: 1,
        warnings: 0
      }
    } satisfies ImportProofReport);

    expect(markdown).toContain("# Import Proof Report");
    expect(markdown).toContain("missing-named-export");
    expect(markdown).toContain("demo-pkg");
  });
});
