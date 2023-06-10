---
html: open-closed-validated-ledgers.html
parent: consensus.html
blurb: Ledger objects have one of three states — open, closed, or validated.
labels:
  - Blockchain
---
## Open, Closed, and Validated Ledgers

The `rippled` server makes a distinction between ledger versions that are _open_, _closed_, and _validated_. A server has one open ledger, any number of closed but unvalidated ledgers, and an immutable history of validated ledgers. The following table summarizes the difference:

| Ledger Type:                     | Open                        | Closed                                     | Validated |
|:---------------------------------|:----------------------------|:-------------------------------------------|:--|
| **Purpose:**                     | Temporary workspace         | Proposed next state                        | Confirmed previous state |
| **Number used:**                 | 1                           | Any number, but usually 0 or 1             | One per ledger index, growing over time |
| **Can contents change?**         | Yes                         | No, but the whole ledger could be replaced | Never |
| **Transactions are applied in:** | The order they are received | Canonical order                            | Canonical order |

Unintuitively, the XRP Ledger never "closes" an open ledger to convert it into a closed ledger. Instead, the server throws away the open ledger, creates a new closed ledger by applying transactions on top of a previous closed ledger, then creates a new open ledger using the latest closed ledger as a base. This is a consequence of [how consensus solves the double-spend problem](consensus-principles-and-rules.html#simplifying-the-problem).

For an open ledger, servers apply transactions in the order those transactions appear, but different servers may see transactions in different orders. Since there is no central timekeeper to decide which transaction was actually first, servers may disagree on the exact order of transactions that were sent around the same time. Thus, the process for calculating a closed ledger version that is eligible for [validation](consensus-structure.html#validation) is different than the process of building an open ledger from proposed transactions in the order they arrive. To create a "closed" ledger, each XRP Ledger server starts with a set of transactions and a previous, or "parent", ledger version. The server puts the transactions in a canonical order, then applies them to the previous ledger in that order. The canonical order is designed to be deterministic and efficient, but hard to game, to increase the difficulty of front-running Offers in the [decentralized exchange](decentralized-exchange.html).

Thus, an open ledger is only ever used as a temporary workspace, which is a major reason why transactions' [tentative results may vary from their final results](finality-of-results.html).
