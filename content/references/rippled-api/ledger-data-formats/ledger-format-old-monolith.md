# XRP Ledger Data Format

The XRP Ledger is a shared, global ledger that is open to all. Individual participants can trust the integrity of the ledger without having to trust any single institution to manage it. The `rippled` server software accomplishes this by managing a ledger database that can only be updated according to very specific rules. Each instance of `rippled` keeps a full copy of the ledger, and the peer-to-peer network of `rippled` servers distributes candidate transactions among themselves. The consensus process determines which transactions get applied to each new version of the ledger. See also: [The Consensus Process](https://ripple.com/build/ripple-ledger-consensus-process/).

![Diagram: Each ledger is the result of applying transactions to the previous ledger version.](img/ledger-process.png)

The shared global ledger is actually a series of individual ledgers, or ledger versions, which `rippled` keeps in its internal database. Every ledger version has a [ledger index](#ledger-index) which identifies the order in which ledgers occur. Each closed ledger version also has an identifying hash value, which uniquely identifies the contents of that ledger. At any given time, a `rippled` instance has an in-progress "current" open ledger, plus some number of closed ledgers that have not yet been approved by consensus, and any number of historical ledgers that have been validated by consensus. Only the validated ledgers are certain to be correct and immutable.

A single ledger version consists of several parts:

![Diagram: A ledger has transactions, a state tree, and a header with the close time and validation info](img/ledger-components.png)

* A **header** - The [ledger index](#ledger-index), hashes of its other contents, and other metadata.
* A **transaction tree** - The [transactions](reference-transaction-format.html) that were applied to the previous ledger to make this one. Transactions are the _only_ way to change the ledger.
* A **state tree** - All the [ledger objects](#ledger-object-types) that contain the settings, balances, and objects in the ledger as of this version.


## Tree Format

As its name might suggest, a ledger's state tree is a tree data structure. Each object in the state tree is identified by a 256-bit object ID. In JSON, a ledger object's ID is the `index` field, which contains a 64-character hexadecimal string like `"193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94"`. Every object in the state tree has an ID that you can use to look up that object; every transaction has an indentifying hash that you can use to look up the transaction in the transaction tree. Do not confuse the `index` (ID) of a ledger object with the [`ledger_index` (sequence number) of a ledger](#ledger-index).

**Tip:** Sometimes, an object in the ledger's state tree is called a "ledger node". For example, transaction metadata returns a list of `AffectedNodes`. Do not confuse this with a "node" (server) in the peer-to-peer network.

In the case of transactions, the identifying hash is based on the signed transaction instructions, but the contents of the transaction object when you look it up also contain the results and metadata of the transaction, which are not taken into account when generating the hash.

## Object IDs
<a id="sha512half"></a>

All objects in a ledger' state tree have a unique ID. This field is returned as the `index` field in JSON, at the same level as the object's contents. The ID is derived by hashing important contents of the object, along with a [namespace identifier](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/LedgerFormats.h#L97). The ledger object type determines which namespace identifier to use and which contents to include in the hash. This ensures every ID is unique. To calculate the hash, `rippled` uses SHA-512 and then truncates the result to the first 256 bytes. This algorithm, informally called **SHA-512Half**, provides an output that has comparable security to SHA-256, but runs faster on 64-bit processors.

![Diagram: rippled uses SHA-512Half to generate IDs for ledger objects. The space key prevents IDs for different object types from colliding.](img/ledger-indexes.png)


## Header Format
[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/ledger/ReadView.h#L71 "Source")

Every ledger version has a unique header that describes the contents. You can look up a ledger's header information with the [`ledger` command](reference-rippled.html#ledger). The contents of the ledger header are as follows:

| Field           | JSON Type | [Internal Type][] | Description |
|-----------------|-----------|-------------------|-------------|
| [`ledger_index`](#ledger-index)   | String    | UInt32            | The sequence number of the ledger. Some API methods display this as a quoted integer; some display it as a native JSON number. |
| `ledger_hash`    | String    | Hash256           | The [SHA-512Half](#sha512half) of the ledger header, excluding the `ledger_hash` itself. This serves as a unique identifier for this ledger and all its contents. |
| `account_hash`   | String    | Hash256           | The [SHA-512Half](#sha512half) of this ledger's state tree information. |
| `close_time`     | Number    | UInt32            | The approximate time this ledger closed, as the number of seconds since the Ripple Epoch of 2000-01-01 00:00:00. This value is rounded based on the `close_time_resolution`, so later ledgers can have the same value. |
| `closed`          | Boolean   | bool              | If true, this ledger version is no longer accepting new transactions. (However, unless this ledger version is validated, it might be replaced by a different ledger version with a different set of transactions.) |
| `parent_hash`    | String    | Hash256           | The `ledger_hash` value of the previous ledger that was used to build this one. If there are different versions of the previous ledger index, this indicates from which one the ledger was derived. |
| `total_coins`    | String    | UInt64            | The total number of [drops of XRP][XRP, in drops] owned by accounts in the ledger. This omits XRP that has been destroyed by transaction fees. The actual amount of XRP in circulation is lower because some accounts are "black holes" whose keys are not known by anyone. |
| `transaction_hash` | String  | Hash256           | The [SHA-512Half](#sha512half) of the transactions included in this ledger. |
| `close_time_resolution` | Number | Uint8        | An integer in the range \[2,120\] indicating the maximum number of seconds by which the `close_time` could be rounded. |
| [`closeFlags`](#close-flags) | (Omitted) | UInt8             | A bit-map of flags relating to the closing of this ledger. |

[Internal Type]: https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp


### Ledger Index
{% include '_snippets/data_types/ledger_index.md' %}
[Hash]: reference-rippled.html#hashes

### Close Flags

The ledger has only one flag defined for closeFlags: **sLCF_NoConsensusTime** (value `1`). If this flag is enabled, it means that validators had different close times for the ledger, but built otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, the consensus ledger version contains a `close_time` value that is 1 second after that of the previous ledger. (In this case, there is no official close time, but the actual real-world close time is probably 3-6 seconds later than the specified `close_time`.)

The `closeFlags` field is not included in any JSON representations of a ledger, but is included in the binary representation of a ledger, and is one of the fields that determine the ledger's hash.



# Ledger Object Types

There are several different kinds of objects that can appear in the ledger's state tree:

* [**AccountRoot** - The settings, XRP balance, and other metadata for one account.](#accountroot)
* [**Amendments** - Singleton object with status of enabled and pending amendments.](#amendments)
* [**Check** - A check that can be redeemed for money by its destination](#check)
* [**DirectoryNode** - Contains links to other objects.](#directorynode)
* [**Escrow** - Contains XRP held for a conditional payment.](#escrow)
* [**FeeSettings** - Singleton object with consensus-approved base transaction cost and reserve requirements.](#feesettings)
* [**LedgerHashes** - Lists of prior ledger versions' hashes for history lookup.](#ledgerhashes)
* [**Offer** - An offer to exchange currencies, known in finance as an _order_.](#offer)
* [**PayChannel** - A channel for asynchronous XRP payments.](#paychannel)
* [**RippleState** - Links two accounts, tracking the balance of one currency between them. The concept of a _trust line_ is really an abstraction of this object type.](#ripplestate)
* [**SignerList** - A list of addresses for multi-signing transactions.](#signerlist)

Each ledger object consists of several fields. In the peer protocol that `rippled` servers use to communicate with each other, ledger objects are represented in their raw binary format. In other [`rippled` APIs](reference-rippled.html), ledger objects are represented as JSON objects.

{% include 'ledger-objects/accountroot.md' %}

{% include 'ledger-objects/amendments.md' %}

{% include 'ledger-objects/check.md' %}

{% include 'ledger-objects/directorynode.md' %}

{% include 'ledger-objects/escrow.md' %}

{% include 'ledger-objects/feesettings.md' %}

{% include 'ledger-objects/ledgerhashes.md' %}

{% include 'ledger-objects/offer.md' %}

{% include 'ledger-objects/paychannel.md' %}

{% include 'ledger-objects/ripplestate.md' %}

{% include 'ledger-objects/signerlist.md' %}

{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/tx-type-links.md' %}
