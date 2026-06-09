import type { NamedImport } from "./types.js";
import ts from "typescript";

export function parseNamedImports(file: string, sourceText: string): NamedImport[] {
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, scriptKind(file));
  const imports: NamedImport[] = [];

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    const moduleName = statement.moduleSpecifier.text;
    if (moduleName.startsWith(".") || moduleName.startsWith("node:")) {
      continue;
    }

    const clause = statement.importClause;
    if (!clause?.namedBindings || !ts.isNamedImports(clause.namedBindings)) {
      continue;
    }

    const line = source.getLineAndCharacterOfPosition(statement.getStart(source)).line + 1;
    for (const element of clause.namedBindings.elements) {
      imports.push({
        file,
        moduleName,
        importedName: (element.propertyName || element.name).text,
        localName: element.name.text,
        line
      });
    }
  }

  return imports;
}

function scriptKind(file: string): ts.ScriptKind {
  if (file.endsWith(".tsx")) {
    return ts.ScriptKind.TSX;
  }
  if (file.endsWith(".jsx")) {
    return ts.ScriptKind.JSX;
  }
  return ts.ScriptKind.TS;
}
