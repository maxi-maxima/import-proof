import type { PackageSurface } from "./types.js";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

export async function readPackageSurface(root: string, moduleName: string): Promise<PackageSurface> {
  const packageRoot = path.join(root, "node_modules", ...moduleName.split("/"));
  const packageJsonPath = path.join(packageRoot, "package.json");

  try {
    await access(packageJsonPath);
  } catch {
    return {
      moduleName,
      exports: [],
      found: false
    };
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    types?: string;
    typings?: string;
    module?: string;
    main?: string;
    exports?: unknown;
  };
  const entry = packageJson.types || packageJson.typings || inferExportTypes(packageJson.exports) || packageJson.module || packageJson.main || "index.d.ts";
  const candidates = [
    path.join(packageRoot, entry),
    path.join(packageRoot, "index.d.ts"),
    path.join(packageRoot, "dist", "index.d.ts"),
    path.join(packageRoot, "src", "index.ts")
  ];

  for (const candidate of candidates) {
    try {
      const text = await readFile(candidate, "utf8");
      return {
        moduleName,
        exports: extractExports(text).sort((a, b) => a.localeCompare(b)),
        sourceFile: path.relative(root, candidate).replaceAll("\\", "/"),
        found: true
      };
    } catch {
      // Try the next likely entry point.
    }
  }

  return {
    moduleName,
    exports: [],
    found: false
  };
}

function inferExportTypes(exportsField: unknown): string | undefined {
  if (!exportsField || typeof exportsField !== "object") {
    return undefined;
  }
  const rootExport = (exportsField as Record<string, unknown>)["."];
  if (rootExport && typeof rootExport === "object") {
    const types = (rootExport as Record<string, unknown>).types;
    return typeof types === "string" ? types : undefined;
  }
  return undefined;
}

function extractExports(text: string): string[] {
  const names = new Set<string>();
  const source = text;
  const patterns = [
    /export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
    /export\s*\{([^}]+)\}/g
  ];

  for (const match of source.matchAll(patterns[0])) {
    names.add(match[1]);
  }

  for (const match of source.matchAll(patterns[1])) {
    for (const part of match[1].split(",")) {
      const clean = part.trim();
      if (!clean || clean.startsWith("type ")) {
        continue;
      }
      const aliasMatch = /(?:[A-Za-z_$][\w$]*\s+as\s+)?([A-Za-z_$][\w$]*)$/.exec(clean);
      if (aliasMatch) {
        names.add(aliasMatch[1]);
      }
    }
  }

  return [...names];
}
