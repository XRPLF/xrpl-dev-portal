---
html: ledger-data-formats.html
parent: protocol-reference.html
blurb: Learn about individual entries that comprise the XRP Ledger's shared state data.
---
# Ledger Data Formats

Each [ledger version](../../../concepts/ledgers/index.md) in the XRP Ledger is made up of three parts:

- **[Ledger Header](ledger-header.md)**: Data about this ledger version itself.
- **[Transaction Set](../transactions/index.md)**: The transactions that were executed to create this ledger version.
- **[State Data](ledger-entry-types/index.md)**: A list of ledger entries, representing all accounts, settings, and balances as of this ledger version. (This is also called the "account state".)

## State Data

{% partial file="/_snippets/ledger-objects-intro.md" /%}

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
