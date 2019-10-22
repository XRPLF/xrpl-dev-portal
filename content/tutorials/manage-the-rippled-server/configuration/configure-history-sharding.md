# Configure History Sharding

[History Sharding](history-sharding.html) lets servers contribute to preserving historical XRP Ledger data without each server needing to store the full history. By default, `rippled` servers do not store history shards.

**Tip:** While both validator and tracking (or stock) `rippled` servers can be configured to store history shards, Ripple recommends _not_ configuring validator `rippled` servers to store shards, to reduce overhead on those servers. If you run a validator and want to contribute to storing XRP Ledger history, Ripple recommends you run a separate `rippled` server with history sharding enabled.

To configure your `rippled` to store shards of ledger history, complete the following steps:

## 1. Determine how much space to allocate for the shard store

Before you configure your `rippled` server to store history shards, you must decide how much disk space to allocate to the history shard store. This also affects how much history you keep in the default ledger store. You should consider the following when deciding what size to configure your shard store:

- The ledger store (defined by the `[node_db]` stanza) is separate from the history shard store. The ledger store is required for all servers, and always contains a range of recent history, defined by how many ledgers to keep available in the `online_delete` parameter. (The default configuration stores the most recent 2000 ledgers.)
    - If you keep at least 2<sup>15</sup> ledgers (32768) in the ledger store, you can efficiently import chunks of recent history from the ledger store into the shard store.
- The history shard store (defined by the `[shard_db]` stanza) is only required for storing history shards. The configuration stanza should be omitted from servers that do not store history shards. The size of the history shard store is defined in gigabytes in the `max_size_gb` parameter; the server attempts to use as much of this space as possible to store complete shards. The history shard store _MUST_ be stored on a solid-state disk or similar fast media. Traditional spinning hard disks are insufficient.
- A shard consists of 2<sup>14</sup> ledgers (16384) and occupies approximately 200 MB to 4 GB based on the age of the shard. Older shards are smaller because there was less activity in the XRP Ledger at the time.
- The history shard store and the ledger store _MUST_ be stored at different file paths. You can configure the ledger store and history store to be on different disks or partitions if desired.
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

The `type` field can be omitted. If present, it _MUST_ be `NuDB`. [New in: rippled 1.3.1][]

**Caution:** If `rippled` detects the wrong type of data in the shard store path, it may [fail to start](server-wont-start.html). You should use a new folder for the shard store. If you previously used a RocksDB shard store (`rippled` 1.2.x and lower), use a different path or delete the RocksDB shard data.

For more information, reference the `[shard_db]` example in the [rippled.cfg configuration example](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg).

## 3. Restart the server

```
systemctl restart rippled
```

## 4. Wait for shards to download

After your server syncs to the network, it automatically starts downloading history shards to fill the available space in the shard store. You can see which shards are being downloaded by looking at which folders are created in the folder where you configured your shard store. (This is defined by the `path` field of the `[shard_db]` stanza in the `rippled.cfg` file.)

This folder should contain a numbered folder for each shard your server has. At any given time, up to one folder may contain a `control.txt` file, indicating it is incomplete.

You can instruct your server to download and import a shard from an archive file using the [download_shard method][].

To list the shards your server and its peers have available, you can use the [crawl_shards method][] or the [Peer Crawler](peer-crawler.html).


## See Also

- **Concepts:**
    - [Ledger History](ledger-history.html)
        - [Online Deletion](online-deletion.html)
- **Tutorials:**
    - [Configure Online Deletion](configure-online-deletion.html)
    - [Configure the Peer Crawler](configure-the-peer-crawler.html)
    - [Capacity Planning](capacity-planning.html)
- **References:**
    - [download_shard method][]
    - [crawl_shards method][]
    - [Ledger Data Formats](ledger-data-formats.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
