export interface NamedImport {
  file: string;
  moduleName: string;
  importedName: string;
  localName: string;
  line: number;
}

export interface PackageSurface {
  moduleName: string;
  exports: string[];
  sourceFile?: string;
  found: boolean;
}

export interface ImportFinding {
  severity: "error" | "warning";
  code: string;
  message: string;
  file: string;
  line?: number;
  moduleName: string;
  importedName?: string;
}

export interface ImportProofReport {
  files: string[];
  imports: NamedImport[];
  packages: PackageSurface[];
  findings: ImportFinding[];
  totals: {
    files: number;
    imports: number;
    errors: number;
    warnings: number;
  };
}
