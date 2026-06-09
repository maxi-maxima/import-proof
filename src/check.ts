import type { ImportProofReport } from "./types.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseNamedImports } from "./parse.js";
import { readPackageSurface } from "./surface.js";

export async function checkImports(root: string, files: string[]): Promise<ImportProofReport> {
  const imports = [];
  for (const file of files) {
    const absolute = path.isAbsolute(file) ? file : path.join(root, file);
    const text = await readFile(absolute, "utf8");
    imports.push(...parseNamedImports(file.replaceAll("\\", "/"), text));
  }

  const moduleNames = [...new Set(imports.map((namedImport) => namedImport.moduleName))];
  const packages = await Promise.all(moduleNames.map((moduleName) => readPackageSurface(root, moduleName)));
  const packageMap = new Map(packages.map((surface) => [surface.moduleName, surface]));
  const findings = [];

  for (const namedImport of imports) {
    const surface = packageMap.get(namedImport.moduleName);
    if (!surface || !surface.found) {
      findings.push({
        severity: "warning" as const,
        code: "package-surface-not-found",
        message: `Could not find local type/source surface for ${namedImport.moduleName}.`,
        file: namedImport.file,
        line: namedImport.line,
        moduleName: namedImport.moduleName,
        importedName: namedImport.importedName
      });
      continue;
    }

    if (!surface.exports.includes(namedImport.importedName)) {
      findings.push({
        severity: "error" as const,
        code: "missing-named-export",
        message: `${namedImport.moduleName} does not export ${namedImport.importedName}.`,
        file: namedImport.file,
        line: namedImport.line,
        moduleName: namedImport.moduleName,
        importedName: namedImport.importedName
      });
    }
  }

  return {
    files,
    imports,
    packages,
    findings,
    totals: {
      files: files.length,
      imports: imports.length,
      errors: findings.filter((finding) => finding.severity === "error").length,
      warnings: findings.filter((finding) => finding.severity === "warning").length
    }
  };
}
