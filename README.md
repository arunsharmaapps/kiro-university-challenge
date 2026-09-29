# SplitSmart

Split shared expenses and get the fewest transfers to settle up. Built with [Kiro](https://kiro.dev).

## Usage
```bash
npm install
npm run demo                      # runs examples/trip.json
node src/cli.js my-expenses.json  # your own file
npm test                          # example + property-based tests
```
Expense format: `[{ "paidBy": "Asha", "amountCents": 12000, "participants": ["Asha","Ben"] }]`

## MCP Tools
`npm run mcp` starts a stdio MCP server with `compute_balances` and `settle_up` (configured in `.kiro/settings/mcp.json`).

## Kiro features used
| Feature | Where |
|---|---|
| Specs | `.kiro/specs/expense-splitting/` |
| Steering | `.kiro/steering/` |
| Hooks | `.kiro/hooks/` |
| Property-based tests | `test/splitter.test.js` (fast-check) |
| Powers | `.kiro/powers/splitsmart-power/`, `plugin.json` |
| MCP | `mcp-server/server.js`, `.kiro/settings/mcp.json` |
| Custom agents | `.kiro/agents/` |
