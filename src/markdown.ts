import type { ImportProofReport } from "./types.js";

export function toMarkdown(report: ImportProofReport): string {
  const lines = [
    "# Import Proof Report",
    "",
    "| Files | Named imports | Errors | Warnings |",
    "| ---: | ---: | ---: | ---: |",
    `| ${report.totals.files} | ${report.totals.imports} | ${report.totals.errors} | ${report.totals.warnings} |`,
    "",
    "## Package Surfaces",
    "",
    "| Package | Found | Exports | Source |",
    "| --- | --- | ---: | --- |"
  ];

  for (const surface of report.packages) {
    lines.push(
      `| \`${surface.moduleName}\` | ${surface.found ? "yes" : "no"} | ${surface.exports.length} | ${surface.sourceFile ? `\`${surface.sourceFile}\`` : ""} |`
    );
  }

  lines.push("");
  lines.push("## Findings");
  lines.push("");

  if (report.findings.length === 0) {
    lines.push("No findings.");
  } else {
    lines.push("| Severity | Code | File | Module | Import | Message |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const finding of report.findings) {
      lines.push(
        `| ${finding.severity} | \`${finding.code}\` | \`${finding.file}${finding.line ? `:${finding.line}` : ""}\` | \`${finding.moduleName}\` | ${finding.importedName ? `\`${finding.importedName}\`` : ""} | ${finding.message} |`
      );
    }
  }

  lines.push("");
  lines.push("## Named Imports");
  lines.push("");
  lines.push("| File | Module | Import | Local |");
  lines.push("| --- | --- | --- | --- |");
  for (const namedImport of report.imports) {
    lines.push(
      `| \`${namedImport.file}:${namedImport.line}\` | \`${namedImport.moduleName}\` | \`${namedImport.importedName}\` | \`${namedImport.localName}\` |`
    );
  }

  lines.push("");
  return lines.join("\n");
}
