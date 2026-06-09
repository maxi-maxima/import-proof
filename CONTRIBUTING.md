# Contributing

Thanks for improving Import Proof.

## Local Setup

```bash
npm install
npm run check
```

## Development Rules

- Keep checks local and deterministic.
- Do not add model calls.
- Prefer AST parsing over string matching for source imports.
- Add tests for package surface edge cases.

## Pull Requests

Please include:

- a minimal package fixture
- the import pattern being checked
- verification output from `npm run check`
