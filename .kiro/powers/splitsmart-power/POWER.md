---
name: "splitsmart"
displayName: "SplitSmart"
description: "Split shared expenses and compute minimal settle-up transfers using integer-cent math."
keywords: ["split", "expenses", "settle", "debts", "bill"]
author: "SplitSmart"
---
# SplitSmart Power
Use the `splitsmart` MCP server whenever the user asks who owes whom or how to split a bill.

## Tools
- `compute_balances(expenses)` – net cents per person.
- `settle_up(expenses)` – minimal transfers.

## Rules
- Amounts are **integer cents**. Convert dollars ×100 before calling, and format results back.
- See `steering/money-rules.md` for details.
