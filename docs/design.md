# Import Proof Design

## Problem

AI-generated code often imports APIs that look plausible but do not exist in the installed package version. TypeScript or runtime checks eventually catch many of these, but the error can be noisy and late.

## Scope

`import-proof` is a local static CLI for JavaScript and TypeScript named imports. It parses source files with the TypeScript compiler API, reads local package type/source surfaces, and reports named imports that are absent.

The first release focuses on package imports, not relative imports or full type checking.

## Commands

- `scan`: scan source files under the current repository.
- `files`: scan explicit files.
- `demo`: generate a small local package and report.

## Verification

The release gate is `npm run check`, demo generation, and `npm pack --dry-run --ignore-scripts`.
