# Research Notes

This project was selected after avoiding overlap with the user's existing public-launch repos:

- `mcp-fire-drill`: MCP and agent security drills
- `context-cal`: agent context budget auditing
- `screenlint`: rendered UI checking
- `mcp-flightcheck`: MCP server contract checks
- `webmcp-formkit`: WebMCP form metadata migration
- `agent-pr-brief`: deterministic PR review brief generation
- `test-lane-finder`: verification lane planning

The current opportunity is dependency API hallucination. AI coding agents are good at writing plausible code, but package APIs are version-specific. A named import can look correct while being absent in the locally installed version.

TypeScript often catches this, but not every repo runs typecheck on every loop, and JS projects may not typecheck at all. A fast local preflight focused only on named imports can be useful before the heavier checks.

This first release deliberately stays narrow:

- package named imports only
- local package surfaces only
- no network documentation lookup
- no model judgement

Useful current references:

- https://www.wiz.io/blog/ai-package-hallucination
- https://socket.dev/blog/ai-package-hallucinations
- https://www.npmjs.com/package/typescript
