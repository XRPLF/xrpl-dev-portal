---
html: ledger-data-formats.html
funnel: Build
doc_type: References
supercategory: rippled API
category: Ledger Data Formats
blurb: Learn about individual data objects that comprise the XRP Ledger's shared state.
---
# Ledger Data Formats

Each [ledger version](ledgers.html) in the XRP Ledger is made up of three parts:

- **[Ledger Header](ledger-header.html)**: Metadata about this ledger version itself.
- **[Transaction Set](transaction-formats.html)**: All the transactions that were executed to create this ledger version.
- **[State Data](ledger-object-types.html)**: The complete record of objects representing accounts, settings, and balances as of this ledger version. (This is also called the "account state".)

## State Data

The ledger's state data consists of objects, or _ledger entries_, stored in a trie format. To store or retrieve an object in the state data, the protocol uses that object's unique **[Ledger Object ID](ledger-object-ids.html)**.

A ledger object's data fields depend on the type of object; the XRP Ledger supports the following types:

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
