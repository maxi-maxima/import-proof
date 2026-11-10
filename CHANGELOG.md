# Changelog

## Unreleased

- Skip Node built-in modules even when imports omit the `node:` prefix.
- Remove the unused vulnerable Zod runtime dependency.

## 0.1.0

- Initial public release.
- Parse JavaScript and TypeScript named package imports.
- Read local package type/source surfaces.
- Report missing named exports and missing package surfaces.
- Include `scan`, `files`, and `demo` commands.
