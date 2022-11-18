---
html: ledgers.html
parent: concepts.html
blurb: The XRP Ledger is a blockchain that records transactions of XRP and other tokens between accounts.
labels:
  - Ledgers
---

# Ledgers

The XRP Ledger is a global distributed blockchain that is open to all. Individual participants can trust the integrity of the ledger without having to trust any single institution to manage it. The `rippled` server software accomplishes this by managing a ledger database that can only be updated according to very specific rules.

Each instance of `rippled` keeps a full copy of the ledger. The peer-to-peer network of `rippled` servers distributes candidate transactions to all other `rippled` servers. The consensus process determines which transactions are applied to each new version of the ledger.

The shared global ledger is a series of individual ledger versions that `rippled` keeps in its internal database. Every ledger version has a Ledger Index value that identifies the order of ledger versions. Each permanent, closed ledger version has a unique, identifying hash value.

At any given time, a `rippled` instance has an in-progress _open_ ledger, a number of _closed_ ledgers that have not yet been approved, and any number of ledgers that have been _validated_ by consensus. Only the validated ledgers are certain to be correct and immutable.  The following table summarizes the difference:

A single ledger version consists of three parts:

* A **header** - The Ledger Index, hashes of its other contents, and other metadata.
* A **transaction tree** - The transactions that were applied to the previous ledger version to create this version. Transactions are the _only_ way to change the ledger.
* A **state tree** - All the ledger objects that contain the settings, balances, and objects in the ledger as of this version.

See [Ledger Structure](ledger-structure.html) for a complete description of the elements of an XRP Ledger object.

