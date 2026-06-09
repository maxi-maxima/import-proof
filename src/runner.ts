import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { checkImports } from "./check.js";
import { toMarkdown } from "./markdown.js";
import type { ImportProofReport } from "./types.js";

export async function scanProject(root: string, outDir: string): Promise<ImportProofReport> {
  const files = await fg(["**/*.{ts,tsx,js,jsx,mjs,cjs}"], {
    cwd: root,
    onlyFiles: true,
    ignore: ["node_modules/**", "dist/**", "coverage/**", "reports/**"]
  });
  const report = await checkImports(root, files);
  await writeReport(report, outDir);
  return report;
}

export async function scanFiles(root: string, files: string[], outDir: string): Promise<ImportProofReport> {
  const report = await checkImports(root, files);
  await writeReport(report, outDir);
  return report;
}

export async function writeReport(report: ImportProofReport, outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "import-proof.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "import-proof.md"), toMarkdown(report), "utf8");
}

export async function writeDemo(outDir: string): Promise<ImportProofReport> {
  const root = path.join(outDir, "workspace");
  await mkdir(path.join(root, "src"), { recursive: true });
  await mkdir(path.join(root, "node_modules", "demo-pkg"), { recursive: true });
  await writeFile(
    path.join(root, "node_modules", "demo-pkg", "package.json"),
    JSON.stringify({ name: "demo-pkg", types: "index.d.ts" }, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(root, "node_modules", "demo-pkg", "index.d.ts"),
    "export declare const realExport: string;\nexport declare function runDemo(): void;\n",
    "utf8"
  );
  await writeFile(path.join(root, "src", "app.ts"), 'import { realExport, missingExport } from "demo-pkg";\n', "utf8");
  return scanFiles(root, ["src/app.ts"], outDir);
}
