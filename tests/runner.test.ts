import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { writeDemo } from "../src/runner.js";

describe("writeDemo", () => {
  it("writes a demo workspace plus JSON and Markdown reports", async () => {
    const out = await mkdtemp(path.join(os.tmpdir(), "import-proof-"));

    const report = await writeDemo(out);

    expect(report.totals.errors).toBe(1);
    await expect(readFile(path.join(out, "workspace", "src", "app.ts"), "utf8")).resolves.toContain("missingExport");
    await expect(readFile(path.join(out, "import-proof.json"), "utf8")).resolves.toContain("missing-named-export");
    await expect(readFile(path.join(out, "import-proof.md"), "utf8")).resolves.toContain("Import Proof Report");
  });
});
