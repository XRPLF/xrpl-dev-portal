---
html: open-closed-validated-ledgers.html
parent: validation.html
blurb: Ledger objects have one of three states — open, closed, or validated.
labels:
  - Ledgers
---

# Open, Closed, and Validated Ledgers

The `rippled` server makes a distinction between ledger versions that are open, closed, and validated. A server has one open ledger, any number of closed but unvalidated ledgers, and an immutable history of validated ledgers.

 The following table summarizes the difference:

| Ledger Type:                     | Open                        | Closed                                     | Validated |
|:---------------------------------|:----------------------------|:-------------------------------------------|:--|
| **Purpose:**                     | Temporary workspace         | Proposed next state                        | Confirmed previous state |
| **Number used:**                 | 1                           | Any number, but usually 0 or 1             | One per ledger index, growing over time |
| **Can contents change?**         | Yes                         | No, but the whole ledger could be replaced | Never |
| **Transactions are applied in:** | The order they are received | Canonical order                            | Canonical order |

The XRP Ledger never "closes" an open ledger to convert it into a closed ledger. Instead, the server throws away the open ledger, creates a new closed ledger by applying transactions on top of a previous closed ledger, then creates a new open ledger using the latest closed ledger as a base.

For an open ledger, servers apply transactions in the order those transactions appear, but different servers might see transactions different orders. Since there is no central timekeeper to decide which transaction was actually first, servers can disagree on the exact order of transactions that were sent around the same time. The process for calculating a closed ledger version that is eligible for [validation](consensus.html#validation) is different than the process of building an open ledger from proposed transactions in the order they arrive. To create a "closed" ledger, each XRP Ledger server starts with a set of transactions and a previous, or "parent", ledger version. The server puts the transactions in a canonical order, then applies them to the previous ledger in that order. The canonical order is designed to be deterministic, efficient, and hard to game.

An open ledger is only used as a temporary workspace. The temporary results might vary from the validated ledger.

## See Also

- For more information on how the XRP Ledger calculates unique close times for each ledger see [Ledger Close Times](ledger-close-times.html)

- For more information about ledger headers, ledger object IDs, and ledger object types, see [Ledger Data Formats](ledger-data-formats.html)
- For information on how servers track the history of changes to ledger state, see [Ledger History](ledger-history.html)
