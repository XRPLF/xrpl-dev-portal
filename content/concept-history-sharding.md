# History Sharding

Rippled sharding is a feature that manages storing and sharing of distributed historical data, as shards. As servers operate, they naturally produce a database containing the nodes from the ledgers they witnessed or acquired during network runtime.

Ledger data is stored by the node store, but the online delete logic rotates these databases when their size exceeds configured space limitations. In this way, Rippled sharding provides a middle ground between running a rippled server with full-history and one with only recent ledger data. History shards do not replace the node store, but implement a reliable path towards distributed ledger history across the rippled network.

[![XRP Ledger Network: Nodes and Shard Store Diagram](img/xrp-ledger-network-node-and-shard-stores.png)](img/xrp-ledger-network-node-and-shard-stores.png)

## Acquiring and Sharing Shard Stores

Acquiring shards begins after synchronizing with the network and performing ledger backfilling. During this time of lower network activity, the shard database may be asked to select a shard to acquire. If a shard is selected, the ledger acquire process begins by retrieving the sequence of the last ledger in the shard and working backwards toward the first. Shards continue to be acquired until reaching the maximum allocated disk space for shards, at which point the current shard may replace an older shard.

Servers advertise to each other the groups of historical ledgers they have available, and servers maintain a map of the portions of the network they see. Periodically, for example every 256 ledgers, servers make a policy decision whether to start a new current ledger database. If they do, they also decide whether to keep or remove older databases. If they have sufficient disk space, they acquire a new range of ledgers or expand one they currently hold.

## Ledger Data Integrity

The history of all ledgers is shared by servers agreeing to keep particular ranges of historical ledgers. This makes it possible for servers to confirm that they have all the data they agreed to maintain, and trivializes the work required to produce proof trees or ledger deltas. Sharding also makes it possible to challenge servers to demonstrate they hold the data they claim to have, and verify their proofs.

When a `rippled` server has too much recent history in the node store, the server has two options. It can discard the shard from recent storage, or it can move the shared from recent storage to historical storage and eject an existing shard. This decision is made following the purge logic for the shard feature.

When a `rippled` server has more space than the configured allocation of shard store size, it assigns storage to begin storing shards or to store more shards. To increase the probability for an even distribution of the history of the network's ledgers, shards are selected randomly among the shards not currently held, with no preferences. Once chosen, the selected shard is fetched, validated, and committed to long term storage.

## Shard Configuration
Rippled can be configured to begin storing ledger history in shards by adding the `shard_db` section to the `rippled.cfg` file.

### Shard Configuration Example
The following snippet from an example `rippled.cfg` file shows the configuration fields for adding sharding to a `rippled` server:

```
# Begin Shard support
[shard_db]
type=NuDB
path=/Users/{username}/.rippled/db/shards/nudb
max_size_gb=50
# End shard support
```

**Tip:** Ripple recommends setting the `type=NuDB` to use the NuDB for sharding, instead of the `RocksDB`.

For more information, reference the `[shard_db]` example in the [rippled.cfg configuration example](https://github.com/ripple/rippled/blob/master/doc/rippled-example.cfg).

***TODO: Question: What reason can we state for recommending NuDB over RocksDB?***

***TODO: Question: Does this feature modify the NuDB header format with a network identifier and range of ledgers held, per David's article?***

***TODO: Followup Question: If so, and if we should document the header and any relevant concerns here, what might those be?***

### Sizing the Shard Store
Determining a suitable value for the shard store will involve carefully considering different aspects of the process. Although redundant, it is entirely possible to hold full history in the node store and the shard store. Servers can shrink the range of ledgers they hold by dropping a database and then re-acquiring whatever ledgers they decide they do want to hold.

The following concerns should each be considered in determining shard store sizing:

- Each shard of the node store is 2^14 ledgers (at time of publishing, Q1 2018), which may not be optimal.
- An effective configuration might limit the node store only to recent history.
- The node store history size should at minimum be twice the ledgers per shard, due to the fact that the current shard may be chosen to be stored and it would be wasteful to reacquire that data.
- The unit of work performed when the server decides to retain the current shard.
- The time to acquire, number of file handles, and memory cache usage is directly affected by sizing.
