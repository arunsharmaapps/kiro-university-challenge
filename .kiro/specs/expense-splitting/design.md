# Design: Expense Splitting

## Overview
Pure functions in `src/splitter.js` (integer cents). `src/cli.js` and `mcp-server/server.js` are thin wrappers.

## Components
- `splitEqual(total, n)` → shares[]
- `computeBalances(expenses)` → `{name: cents}`
- `settle(balances)` → greedy largest-debtor-to-largest-creditor transfers

## Correctness Properties
*For any* valid input:
- **Property 1** (Req 1.1, 1.2): `splitEqual` shares sum to total and differ by ≤ 1.
- **Property 2** (Req 2.2): `computeBalances` values sum to 0.
- **Property 3** (Req 3.1): applying `settle` transfers zeroes every balance.
- **Property 4** (Req 3.2): `settle` returns ≤ people−1 transfers, all positive, from ≠ to.

## Error Handling
Invalid totals/participant counts throw `RangeError`; the MCP server maps errors to `isError` results.

## Testing Strategy
Example tests for known cases + fast-check property tests for Properties 1–4 (`test/splitter.test.js`).
