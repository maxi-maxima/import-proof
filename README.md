<div align="center">

# Import Proof

**Catch hallucinated named imports before TypeScript or runtime does.**

[简体中文](README.zh-CN.md)

</div>

AI coding agents often write imports that look right but do not exist in the installed package version:

```ts
import { createMagicClient } from "some-sdk";
```

Maybe the SDK exports `createClient`. Maybe the docs changed. Maybe the agent invented a nice API. `import-proof` checks named imports against the local package surface and reports the mismatch early.

No API keys. No model call. No network.

## 30 Second Demo

```bash
npx github:maxi-maxima/import-proof demo
```

The demo creates a tiny workspace with a fake package and writes:

```text
reports/demo/workspace/
reports/demo/import-proof.json
reports/demo/import-proof.md
```

## Scan A Project

```bash
npx github:maxi-maxima/import-proof scan --out reports/import-proof
```

## Scan Explicit Files

```bash
npx github:maxi-maxima/import-proof files src/app.ts src/api.ts
```

## What It Checks

`import-proof` parses JavaScript and TypeScript with the TypeScript compiler API, extracts package named imports, then reads local package surfaces from:

- `types` / `typings` in `package.json`
- root `exports["."].types`
- `index.d.ts`
- `dist/index.d.ts`
- `src/index.ts`

It reports:

| Finding | Severity | Meaning |
| --- | --- | --- |
| `missing-named-export` | error | The local package surface exists, but the named export is absent. |
| `package-surface-not-found` | warning | The package or readable type/source entry was not found. |

## What It Does Not Do Yet

- It does not replace `tsc`.
- It does not validate default imports.
- It does not fully evaluate conditional exports.
- It skips relative imports and Node built-ins.

The narrow goal is fast feedback for a common AI-agent failure mode: plausible package APIs that are not real.

## Development

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## License

MIT
