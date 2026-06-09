import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkImports } from "../src/check.js";

describe("checkImports", () => {
  it("reports named imports that are absent from local package declarations", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "import-proof-"));
    await mkdir(path.join(root, "src"), { recursive: true });
    await mkdir(path.join(root, "node_modules", "demo-pkg"), { recursive: true });
    await writeFile(
      path.join(root, "node_modules", "demo-pkg", "package.json"),
      JSON.stringify({ name: "demo-pkg", types: "index.d.ts" }),
      "utf8"
    );
    await writeFile(path.join(root, "node_modules", "demo-pkg", "index.d.ts"), "export declare const realExport: string;\n", "utf8");
    await writeFile(path.join(root, "src", "app.ts"), 'import { realExport, missingExport } from "demo-pkg";\n', "utf8");

    const report = await checkImports(root, ["src/app.ts"]);

    expect(report.totals).toMatchObject({
      files: 1,
      imports: 2,
      errors: 1
    });
    expect(report.findings).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "missing-named-export",
        moduleName: "demo-pkg",
        importedName: "missingExport"
      })
    );
  });
});
