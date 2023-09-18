---
html: ledger-data-formats.html
parent: protocol-reference.html
blurb: Learn about individual entries that comprise the XRP Ledger's shared state data.
---
# Ledger Data Formats

Each [ledger version](ledgers.html) in the XRP Ledger is made up of three parts:

- **[Ledger Header](ledger-header.html)**: Data about this ledger version itself.
- **[Transaction Set](transaction-formats.html)**: The transactions that were executed to create this ledger version.
- **[State Data](ledger-entries.html)**: A list of ledger entries, representing all accounts, settings, and balances as of this ledger version. (This is also called the "account state".)

## State Data

{% include '_snippets/ledger-objects-intro.md' %}

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
