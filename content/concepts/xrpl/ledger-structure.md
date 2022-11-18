---
html: ledger-structure.html
parent: ledgers.html
blurb: A closer look at the elements to be found in each XRP Ledger entry.
labels:
  - Ledgers
---

# XRP Ledger Structure

The XRP Ledger is a block chain system, linking immutable data blocks in a meaningful sequence. This topic examines the data blocks that make up the XRPL block chain.

The XRP Ledger processes transactions in blocks called _ledger versions_. Each ledger version contains state data, a transaction set, and metadata.

The main job of the XRP Ledger Consensus Protocol is to agree on a set of transactions to apply to the previous ledger, apply them in a well defined order, then confirm that all validators get the same results. When this happens successfully, a ledger version is considered _validated_, and final. From there, the process continues by building the next ledger version.

[![Ledger Version](img/ledger.png)](img/ledger.png)

Each data block in the XRPL chain is a _ledger version_. A ledger version is comprised of the following elements.

The _ledger index_ identifies the ledger version position in the chain at the time of its validation. It builds on the version with an index that is one lower, back to the starting point known as the _genesis ledger_. This forms a public history of all transactions and results.

[![Sequence Number](img/ledger1-sequence-number.png)](img/ledger1-sequence-number.png)

Each ledger version also identifies itself with a unique 64-character hexidecimal _hash number_.

[![Hash Number](img/ledger2-unique-hash.png)](img/ledger2-unique-hash.png)

Ledger versions are largely defined as the difference between the current version and its _parent version_, identified by its unique hash number.

[![Parent Version](img/ledger3-parent-version.png)](img/ledger3-parent-version.png)

Every change made from version to version is the result of a validated transaction. The ledger version stores information about transactions in its scope.

[![Transactions](img/ledger4-transactions.png)](img/ledger4-transactions.png)

The ledger version contains _state data_ for all accounts, along with some miscellaneous housekeeping information. 99% or more of the data tends to be the same from version to version. While every rippled server keeps a copy of the entire ledger history, each ledger version saves only the updates to the state data.

[![State Data](img/ledger5-state-data.png)](img/ledger5-state-data.png)

Every transaction has a minor cost that removes a small amount of XRP from the available pool. The ledger version keeps track of the full amount of _available XRP_ still in circulation, in drops. The number of actual XRP in circulation is smaller than the amount in the ledger due to some XRP having been sent to "black hole" accounts where the access information is unknown, either by default or design.

[![Available XRP](img/ledger6-available-xrp.png)](img/ledger6-available-zrp.png)

_Close Flags_ is a bit map of flags related to the close of the ledger. Currently, the only flag defined is **sLCF_NoConsensusTime** (value 1). It means that validators disagreed on the close time, but otherwise built the same ledger, so they have decided to "agree to disagree" on the close time. Other flags might be defined in future amendments to the XRP Ledger.

[![Close Flags](img/ledger7-close-flags.png)](img/ledger7-close-flags.png)

_Close Time_ is the official timestamp when the final validated ledger version is created and closed.

[![Close Time](img/ledger8-close-time.png)](img/ledger8-close-time.png)

80% or more of the validators in the server's Unique Node List must agree on the contents of the ledger. Once it is validated, it is immutable. The ledger can only be changed by subsequent transactions.

[![Validated Ledger](img/ledger.png)](img/ledger.png)


## Tree Format

<!-- This needs an illustration -->

As its name might suggest, a ledger's state tree is a tree data structure. Each object in the state tree is identified by a 256-bit object ID. In JSON, a ledger object's ID is the `index` field, which contains a 64-character hexadecimal string like `"193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94"`. Every object in the state tree has an ID that you can use to look up that object; every transaction has an identifying hash that you can use to look up the transaction in the transaction tree. Do not confuse the `index` (ID) of a ledger object with the `ledger_index` (sequence number) of a ledger.

**Tip:** Sometimes, an object in the ledger's state tree is called a _ledger node_. For example, transaction metadata returns a list of `AffectedNodes`. Do not confuse this with a _node_ (server) in the peer-to-peer network.

In the case of transactions, the identifying hash is based on the signed transaction instructions. When you look up the transaction, its contents contain the results and metadata of the transaction, which are not taken into account when generating the hash.





