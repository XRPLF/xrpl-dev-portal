---
html: ledger-data-formats.html
parent: protocol-reference.html
seo:
    description: Learn about individual entries that comprise the XRP Ledger's shared state data.
metadata:
  indexPage: true
---
# Ledger Data Formats

Each [ledger version](../../../concepts/ledgers/index.md) in the XRP Ledger is made up of three parts:

- **[Ledger Header](ledger-header.md)**: Data about this ledger version itself.
- **[Transaction Set](../transactions/index.md)**: The transactions that were executed to create this ledger version.
- **[State Data](ledger-entry-types/index.md)**: A list of ledger entries, representing all accounts, settings, and balances as of this ledger version. (This is also called the "account state".)

## State Data

{% partial file="/docs/_snippets/ledger-objects-intro.md" /%}

{% child-pages /%}

