#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { scanFiles, scanProject, writeDemo } from "./runner.js";
import type { ImportProofReport } from "./types.js";

const program = new Command();

program
  .name("import-proof")
  .description("Catch hallucinated named imports before TypeScript or runtime does.")
  .version("0.1.0");

program.command("scan").option("--out <dir>", "output directory", "reports/import-proof").action(async (options: { out: string }) => {
  const report = await scanProject(process.cwd(), options.out);
  printSummary(report);
  console.log(`Reports: ${options.out}`);
});

program
  .command("files")
  .argument("<files...>", "source files to check")
  .option("--out <dir>", "output directory", "reports/import-proof")
  .action(async (files: string[], options: { out: string }) => {
    const report = await scanFiles(process.cwd(), files, options.out);
    printSummary(report);
    console.log(`Reports: ${options.out}`);
  });

program.command("demo").option("--out <dir>", "output directory", "reports/demo").action(async (options: { out: string }) => {
  const report = await writeDemo(options.out);
  printSummary(report);
  console.log(`Demo workspace: ${options.out}/workspace`);
  console.log(`Reports: ${options.out}`);
});

program.parse();

function printSummary(report: ImportProofReport): void {
  const status = report.totals.errors > 0 ? pc.red("FAIL") : report.totals.warnings > 0 ? pc.yellow("WARN") : pc.green("PASS");
  console.log(`Import Proof ${status}`);
  console.log(`Files: ${report.totals.files}`);
  console.log(`Named imports: ${report.totals.imports}`);
  console.log(`Errors: ${report.totals.errors}`);
  console.log(`Warnings: ${report.totals.warnings}`);
}
