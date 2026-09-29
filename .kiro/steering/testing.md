---
inclusion: fileMatch
fileMatchPattern: "test/**/*.js"
---
# Testing guidance (loaded when editing tests)
- Name properties `P<n>` and reference the spec requirement they validate.
- Prefer `fc.integer` with explicit bounds; keep `numRuns` at the default (100) or higher.
- When a property fails, add the shrunk counter-example as an example-based test.
