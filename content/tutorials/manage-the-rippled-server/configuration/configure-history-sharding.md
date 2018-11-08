# Configure History Sharding

[History Sharding](history-sharding.html) lets servers contribute to preserving historical XRP Ledger data without each server needing to store the full history. By default, `rippled` servers do not store history shards.

**Tip:** While both validator and tracking (or stock) `rippled` servers can be configured to store history shards, Ripple recommends _not_ configuring validator `rippled` servers to store shards, to reduce overhead on those servers. If you run a validator and want to contribute to storing XRP Ledger history, Ripple recommends you run a separate `rippled` server with history sharding enabled.

To configure your `rippled` to store shards of ledger history, complete the following steps:

## 1. Determine how much space to allocate for the shard store

Before you configure your `rippled` server to store history shards, you must decide how much disk space to allocate to the history shard store. This also affects how much history you keep in the default ledger store. You should consider the following when deciding what size to configure your shard store:

- The ledger store (defined by the `[node_db]` stanza) is separate from the history shard store. The ledger store is required for all servers and _must_ contain a range of recent history, defined by how many ledgers to keep available in the `online_delete` parameter. (The default configuration stores the most recent 2000 ledgers.)
    - If you keep at least 2^15 ledgers (32768) in the ledger store, you can efficiently import chunks of recent history from the ledger store into the shard store.
- The history shard store (defined by the `[shard_db]` stanza) is only required for storing history shards. The configuration stanza should be omitted from servers that do not store history shards. The size of the history shard store is defined in gigabytes in the `max_size_gb` parameter; the server attempts to use as much of this space as possible to store complete shards.
- A shard consists of 2^14 ledgers (16384) and occupies approximately 200 MB to 4 GB based on the age of the shard. Older shards are smaller because there was less activity in the XRP Ledger at the time.
- The history shard store and the ledger store _must_ be stored at different file paths. You can configure the ledger store and history store to be on different disks or partitions if desired.
- It is possible but redundant to hold full ledger history in both the ledger store and the history shard store.
- The time to acquire a shard, number of file handles needed by the `rippled` server, and memory cache usage is directly affected by the size of the shard.

## 2. Edit rippled.cfg

Edit your `rippled.cfg` file to add a `[shard_db]` stanza.

{% include '_snippets/conf-file-location.md' %}<!--_ -->

The following snippet shows an example of a `[shard_db]` stanza:

```
[shard_db]
type=NuDB
path=/var/lib/rippled/db/shards/nudb
max_size_gb=50
```

**Tip:** Ripple recommends using NuDB for the shard store (`type=NuDB`). NuDB uses fewer file handles per shard than RocksDB. RocksDB uses memory that scales with the size of data it stores, which may require excessive memory overhead. However, NuDB is designed to be used with SSD drives and does not work with rotational disks.

**Caution:** If you enable history sharding, then later change the database type of your shard store, you must also change the path or delete the existing data from the configured path. If `rippled` detects the wrong type of data in the shard store path, it may [fail to start](server-wont-start.html).

For more information, reference the `[shard_db]` example in the [rippled.cfg configuration example](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg).

## 3. Restart the server

```
systemctl restart rippled
```

## 4. Wait for shards to download

After your server syncs to the network, it automatically starts downloading history shards to fill the available space in the shard store. You can see which shards are being downloaded by looking at which folders are created in the folder where you configured your shard store. (This is defined by the `path` field of the `[shard_db]` stanza in the `rippled.cfg` file.)

This folder should contain a numbered folder for each shard your server has. At any given time, up to one folder may contain a `control.txt` file, indicating it is incomplete.

<!-- TODO: add download_shard and crawl_shards commands when they get added. -->
