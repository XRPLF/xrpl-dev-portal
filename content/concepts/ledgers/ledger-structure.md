---
html: ledger-structure.html
parent: ledgers.html
blurb: A closer look at the elements of an individual ledger block.
---
# Ledger Structure

The XRP Ledger is a blockchain, which means it consists of a history of data blocks in sequence. A block in the XRP Ledger blockchain is called a _ledger version_ or a _ledger_ for short.

The consensus protocol takes a previous ledger version as a starting point, forms an agreement among validators on a set of transactions to apply next, then confirms that everyone got the same results from applying those transactions. When this happens successfully, the result is a new _validated_ ledger version. From there, the process repeats to build the next ledger version.

Each ledger version contains _state data_, a _transaction set_, and a _header_ containing metadata.

<!-- TODO: update the diagrams to match the redone order -->

## State Data

[![State Data](img/ledger5-state-data.png)](img/ledger5-state-data.png)

The _state data_ represents a snapshot of all accounts, balances, settings, and other information as of this ledger version. When a server connects to the network, one of the first things it does is download a full set of the current state data so that it can process new transactions and answer queries about the current state. Since every server in the network has a full copy of the state data, all data is public and every copy is equally valid.

The state data consists of individual objects called _ledger entries_, stored in a tree format. Each ledger entry has a unique 256-bit ID that you can use to look it up in the state tree.

## Transaction Set

[![Transactions](img/ledger4-transactions.png)](img/ledger4-transactions.png)

Every change made to the ledger is the result of a transaction. Each ledger version contains a _transaction set_ which is a group of transactions that have been newly applied in a specific order. If you take the previous ledger version's state data, and apply this ledger's transaction set on top of it, you get this ledger's state data as a result.

Every transaction in a ledger's transaction set has both of the following parts:

- _Transaction instructions_ showing what its sender told the ledger to do.
- _Transaction metadata_ showing exactly how the transaction was processed and how it affected the ledger's state data.


## Ledger Header

[![Ledger Version](img/ledger.png)](img/ledger.png)

The _ledger header_ is a block of data that summarizes a ledger version. Like the cover of a report, it uniquely identifies the ledger version, lists its contents, and shows the time it was created, along with some other notes. The ledger header contains the following information:

- The _ledger index_, which identifies the ledger version's position in the chain. It builds on the ledger with an index that is one lower, back to the starting point known as the _genesis ledger_. This forms a public history of all transactions and results.
- The _ledger hash_, which uniquely identifies the ledger's contents. The hash is calculated so that if any detail of the ledger version changes, the hash is completely different, which makes it also like a checksum that shows that none of the data in the ledger has been lost, modified, or corrupted.
- The _parent ledger hash_. A ledger version is largely defined by the difference from the _parent ledger_ that came before it, so the header also contains the unique hash of its parent ledger.
- The _close time_, the official timestamp when this ledger's contents were finalized. This number is rounded off by a number of seconds, usually 10.
- A _state data hash_ and _transaction set hash_, which act as a checksum on those contents.
- A few other notes like the total amount of XRP in existence and the amount the close time was rounded by.

A ledger's transaction set and state data can be unlimited in size, but the ledger header is always a fixed size.


## Validation Status

[![Validated Ledger](img/ledger.png)](img/ledger.png)

When a consensus of validators in a server's Unique Node List agree on the contents of a ledger version, that ledger version is marked as validated and immutable. The ledger's contents can only change by subsequent transactions making a new ledger version, continuing the chain.

When a ledger version is first created, it is not yet validated. Due to differences in when candidate transactions arrive at different servers, the network may build and propose multiple different ledger versions to be the next step in the chain. The [consensus protocol](consensus.html) decides which one of them becomes validated. (Any candidate transactions that weren't in the validated ledger version can typically be included in the next ledger version's transaction set instead.)


## Ledger Index or Ledger Hash?

There are two different ways of identifying a ledger version, its ledger index and its ledger hash. These two fields can both identify a ledger, but they serve different purposes. The ledger index tells you _when_ to place a ledger in history, but not necessarily what its contents are. Two ledgers with the same ledger index might be the same, but they might be from different chains, or they could even be different candidates to be the next ledger on the same chain. Two ledgers with the same ledger hash are always completely identical, but the hash by itself doesn't tell you which one came first.
