---
html: ledgers.html
parent: concepts.html
blurb: The history of 
labels:
  - Blockchain
  - Data Retention
---
# Ledgers

The XRP Ledger is a shared, global ledger that is open to all. Individual participants can trust the integrity of the ledger without having to trust any single institution to manage it. The XRP Ledger protocol accomplishes this by managing a ledger database that can only be updated according to very specific rules. Each server in the peer-to-peer network keeps a full copy of the ledger database, and the network distributes candidate transactions, which are applied in blocks according to the [consensus process](consensus.html).

{{ include_svg("img/ledger-changes.svg", "Diagram: Each ledger is the result of applying transactions to the previous ledger version.") }}

The shared global ledger consists of a series of blocks, called ledger versions or simply _ledgers_. Every ledger version has a [Ledger Index][] which identifies the correct order of ledgers. Each permanent, closed ledger also has a unique, identifying hash value.

At any given time, each XRP Ledger server has an in-progress _open_ ledger, a number of pending _closed_ ledgers, and a history of _validated_ ledgers that are immutable.

A single ledger version consists of several parts:

{{ include_svg("img/anatomy-of-a-ledger-simplified.svg", "Diagram: A ledger has transactions, a state tree, and a header with the close time and validation info") }}

* A **header** - The [Ledger Index][], hashes of its other contents, and other metadata.
* A **transaction tree** - The [transactions](transaction-formats.html) that were applied to the previous ledger to make this one.
* A **state tree** - All the data in the ledger, as [ledger entries](ledger-object-types.html): balances, settings, and so on.



## See Also

- For more information about ledger headers, ledger object IDs, and ledger object types, see [Ledger Data Formats](ledger-data-formats.html)
- For information on how servers track the history of changes to ledger state, see [Ledger History](ledger-history.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
