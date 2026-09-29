---
inclusion: always
---
# Tech conventions
- Node 22+, ES modules, no runtime dependencies (only `fast-check` as a dev dependency).
- **All money is integer cents.** Never use floating point for currency; format only at the edge (`formatCents`).
- Tests use `node:test`. Every invariant about money must have a fast-check property test.
- Public logic lives in `src/splitter.js`; CLI and MCP server are thin wrappers around it.
