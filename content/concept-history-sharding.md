# History Sharding

As servers operate, they naturally produce a database containing the nodes from the ledgers they witnessed or acquired during network runtime. This ledger data is stored by the node store, but the online delete logic rotates these databases when their size exceeds configured space limitations.

Rippled sharding is a feature that manages storing and sharing of distributed historical data as shards, which individually contain data for a segment of ledger history and are stored separately, in a shard store. In this way, Rippled sharding provides a middle ground between running a rippled server with full-history and one with only recent ledger data. A shard store does not replace a node store, but implements a reliable path towards distributed ledger history across the XRP Ledger Network.

[![XRP Ledger Network: Nodes and Shard Store Diagram](img/xrp-ledger-network-node-and-shard-stores.png)](img/xrp-ledger-network-node-and-shard-stores.png)

## Acquiring and Sharing Shards

Acquiring shards begins after synchronizing with the network and performing ledger backfilling. During this time of lower network activity, a `rippled` server set to maintain a `shard_db` randomly chooses a shard to add to its shard store. To increase the probability for an even distribution of the network ledger history, shards are randomly selected for acquisition, and the current shard is given no special consideration.

Once a shard is selected, the ledger acquire process begins by fetching the sequence of the last ledger in the shard and working backwards toward the first. The retrieval process begins with the server checking for the data locally. For data that are not available, the server requests data from its peer `rippled` servers. Those servers that have the data available for the requested period respond with their history. From the peer responses, the historical ledger data for that shard are assembled and added to the shard store.

If the system runs out of space before completely acquiring a shard, retrieval progress is halted until space becomes available and the process can continue. After that point the most recently completed shard may replace an older shard. If there is sufficient disk space, the `rippled` server acquires additional randomly selected shards to add to the shard store until reaching the maximum allocated disk space for shards (`max_size_gb`).

## Comparing the Node Store and Shard Store

Like the node store, the shard store derives from the base class `Database`. The common interface facilitates replacing the node store when storing or fetching from various places in the project. For example, the inbound ledger process uses synchronization filters to save data received from peers to either store. Specifying the database object for the filter allows `rippled` to decide which store receives the data. Similarly, a `Family` tells `SHAMaps` which database to use when fetching or storing. The derived stores themselves rely on these commonalities when copying ledgers from one store to another or validating their state and transaction trees.

## XRP Ledger Network Data Integrity

The history of all ledgers is shared by servers agreeing to keep particular ranges of historical ledgers. This makes it possible for servers to confirm that they have all the data they agreed to maintain, and produce proof trees or ledger deltas. Sharding also makes it possible to challenge servers to demonstrate they hold the data they claim to have, and verify their proofs.

## Shard Store Configuration
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

**Tip:** Ripple recommends using NuDB for sharding (`type=NuDB`). NuDB uses fewer file handles per shard than RocksDB, while RocksDB uses memory that scales with the size of data its storing, which, with many shards may require excessive memory overhead.

**Tip:** While both validator and tracking (or stock) `rippled` servers can run shard stores, Ripple recommends adding history sharding only for non-validator nodes to reduce overhead for validator nodes. If you run a validator node and want to manage ledger history with sharding, run a separate `rippled` server with a sharding.

For more information, reference the `[shard_db]` example in the [rippled.cfg configuration example](https://github.com/ripple/rippled/blob/master/doc/rippled-example.cfg).

### Sizing the Shard Store
Determining a suitable value for the shard store will involve carefully considering different aspects of the process. Although redundant, it is entirely possible to hold full history in the node store and the shard store. Servers can shrink the range of ledgers they hold by dropping the shard database and then re-acquiring ledgers through the acquisition process.

The following concerns should each be considered in determining shard store sizing:

- Each shard of the node store is 2^14 ledgers (at time of publishing, Q1 2018), which may not be optimal
- An effective configuration might limit the node store only to recent history
- The node store history size should at minimum be twice the ledgers per shard, due to the fact that the current shard may be chosen to be stored and it would be wasteful to reacquire that data
- The unit of work performed when the server decides to retain the current shard
- The time to acquire, number of file handles, and memory cache usage is directly affected by sizing

