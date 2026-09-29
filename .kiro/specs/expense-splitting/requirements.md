# Requirements: Expense Splitting

## Introduction
Friends record shared expenses; SplitSmart computes who owes whom and the fewest transfers to settle.

## Requirements

### Requirement 1: Equal split
**User Story:** As a group member, I want an expense divided equally among participants, so that everyone pays a fair share.
#### Acceptance Criteria
1. WHEN an expense of T cents has N participants THEN the system SHALL produce N shares that sum to exactly T.
2. WHEN T is not divisible by N THEN the system SHALL distribute leftover cents so shares differ by at most 1 cent.

### Requirement 2: Balances
**User Story:** As a group member, I want to see each person's net balance, so I know who is owed and who owes.
#### Acceptance Criteria
1. WHEN expenses are processed THEN the system SHALL credit the payer the full amount and debit each participant their share.
2. THE system SHALL guarantee all balances sum to zero.

### Requirement 3: Settle up
**User Story:** As a group member, I want the fewest payments to settle everything, so we avoid many small transfers.
#### Acceptance Criteria
1. WHEN transfers are applied THEN every balance SHALL become zero.
2. THE system SHALL return at most (people − 1) transfers, each with a positive amount and from ≠ to.

### Requirement 4: Interfaces
**User Story:** As a user or AI agent, I want a CLI and an MCP server, so I can use SplitSmart from a terminal or from Kiro.
#### Acceptance Criteria
1. WHEN `splitsmart <file.json>` is run THEN the CLI SHALL print balances and settlement transfers.
2. THE MCP server SHALL expose `compute_balances` and `settle_up` tools.
