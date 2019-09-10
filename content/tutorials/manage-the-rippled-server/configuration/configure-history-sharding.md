# History Sharding

[History Sharding](history-sharding.html) lets servers contribute to preserving historical XRP Ledger data, without each server needing to store the full history. By default, `rippled` servers do not store history shards. 

You can work with history sharding in two ways:

* [Configure History Sharding](#configure-history-sharding) so that your server syncs to the network and automatically starts downloading history shards.
* [Programmatically Invoke History Sharding](programmatically-invoke-history-sharding) using the [```crawl_shards```](https://xrpl.org/crawl_shards.html) and [```download_shard```](https://xrpl.org/download_shard.html) methods to retrieve information about shards available on peer servers and to download those shards. Note that you must first [configure history sharding](#configure-history-sharding) before you can use the ```download_shard``` method.


## Configure History Sharding

You can configure your server to automatically sync to the network and download history shards.

**Tip:** While both validator and tracking (or stock) `rippled` servers can be configured to store history shards, Ripple recommends _not_ configuring validator `rippled` servers to store shards, to reduce overhead on those servers. If you run a validator and want to contribute to storing XRP Ledger history, Ripple recommends you run a separate `rippled` server with history sharding enabled.

To configure your `rippled` server to store shards of ledger history, complete the following steps:

### 1. Determine how much space to allocate for the shard store

Before you configure your `rippled` server to store history shards, you must decide how much disk space to allocate to the history shard store. This also affects how much history you keep in the default ledger store. You should consider the following when deciding what size to configure your shard store:

- The ledger store (defined by the `[node_db]` stanza) is separate from the history shard store. The ledger store is required for all servers, and always contains a range of recent history, defined by how many ledgers to keep available in the `online_delete` parameter. (The default configuration stores the most recent 2000 ledgers.)
    - If you keep at least 2<sup>15</sup> ledgers (32768) in the ledger store, you can efficiently import chunks of recent history from the ledger store into the shard store.
- The history shard store (defined by the `[shard_db]` stanza) is only required for storing history shards. The configuration stanza should be omitted from servers that do not store history shards. The size of the history shard store is defined in gigabytes in the `max_size_gb` parameter; the server attempts to use as much of this space as possible to store complete shards. The history shard store _MUST_ be stored on a solid-state disk or similar fast media. Traditional spinning hard disks are insufficient.
- A shard consists of 2<sup>14</sup> ledgers (16384) and occupies approximately 200 MB to 4 GB based on the age of the shard. Older shards are smaller because there was less activity in the XRP Ledger at the time.
- The history shard store and the ledger store _MUST_ be stored at different file paths. You can configure the ledger store and history store to be on different disks or partitions if desired.
- It is possible but redundant to hold full ledger history in both the ledger store and the history shard store.
- The time to acquire a shard, number of file handles needed by the `rippled` server, and memory cache usage is directly affected by the size of the shard.

### 2. Edit rippled.cfg

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

### 3. Restart the server

```
systemctl restart rippled
```

### 4. Wait for shards to download

After your server syncs to the network, it automatically starts downloading history shards to fill the available space in the shard store. You can see which shards are being downloaded by looking at which folders are created in the folder where you configured your shard store. (This is defined by the `path` field of the `[shard_db]` stanza in the `rippled.cfg` file.)

This folder should contain a numbered folder for each shard your server has. At any given time, up to one folder may contain a `control.txt` file, indicating it is incomplete.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

## Programmatically Invoke History Sharding

You can programmatically retrieve information from peer servers to determine which shards of ledger data are available by invoking the [crawl_shards](https://xrpl.org/crawl_shards.html) method, and then download specific shards using the [download_shard](https://xrpl.org/download_shard.html) method.

These methods can be used to manually download shards or to set up a recurring process, such as an operating system service or daemon, to programmatically query and download history shards.

**Notes**: 
* The methods can only be run by admin users.
* You must first [configure history sharding](#configure-history-sharding) before you can use the ```download_shard``` method.


Follow the steps below to programmatically request information about shards from peer servers and download them:

### 1. Request information from peer servers

In the following example, the ```crawl_shards``` method is invoked with the ```pubkey```parameter set to ```true``` to indicate that node public keys (for peer-to-peer communications) should be returned in the response: 

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "crawl_shards",
  "pubkey": true,
  "limit": 0
}
```

*JSON-RPC*

```json
{
  "method": "crawl_shards",
  "params": [
    {
      "pubkey": true,
      "limit": 0
    }
  ]
}
```

<!-- MULTICODE_BLOCK_END -->

### 2. Parse the response

To determine which shards are available in each peer, parse the ```complete_shards``` field in the response. This field lists the shards that are available on the local server (i.e., the server on which the method was run) that are complete. The ```peers``` array lists the peer servers that contain shards, and the ```complete_shards``` field in each element lists the shards available on that peer, as shown in this example response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ]
  },
  "status": "success",
  "type": "response"
}
```


*JSON-RPC*

```json
200 OK

{
  "result": {
    "complete_shards": "1-2,5,8-9,584,1973,2358",
    "peers": [
      {
        "complete_shards": "1-2,8,47,371,464,554,653,857,1076,1402,1555,1708,1813,1867",
        "public_key": "n9LxFZiySnfDSvfh23N94UxsFkCjWyrchTeKHcYE6tJJQL5iejb2"
      },
      {
        "complete_shards": "8-9,584",
        "ip": "192.168.1.132",
        "public_key": "n9MN5xwYqbrj64rtfZAXQy7Y3sNxXZJeLt7Lj61a9DYEZ4SE2tQQ"
      }
    ],
    "status": "success"
  }
}
```


<!-- MULTICODE_BLOCK_END -->


### 3. Download Shards from Peer Servers

Using the information provided in the response returned from ```crawl_shards```, you can now download one or more shards from a known list of peer servers.

In the following example, the ```download_shard``` method is invoked and the ```shards``` array parameter specifies the shards to download from each server. The ```index```parameter specifies which shards to download, and the ```url``` parameter contains the URL of the peer server from which to download them:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "download_shard",
  "shards": [
    {"index": 1, "url": "https://example.com/1.tar.lz4"},
    {"index": 2, "url": "https://example.com/2.tar.lz4"},
    {"index": 5, "url": "https://example.com/5.tar.lz4"}
  ]
}
```

*JSON-RPC*

```json
{
  "method": "download_shard",
  "params": [
    {
      "shards": [
        {"index": 1, "url": "https://example.com/1.tar.lz4"},
        {"index": 2, "url": "https://example.com/2.tar.lz4"},
        {"index": 5, "url": "https://example.com/5.tar.lz4"}
      ]
    }
  ]
}
```

<!-- MULTICODE_BLOCK_END -->


The ```message``` field in the response indicates that the download process has started:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "message": "downloading shards 1-2,5"
  },
  "status": "success",
  "type": "response"
}
```


*JSON-RPC*

```json
200 OK

{
  "result": {
    "message": "downloading shards 1-2,5",
    "status": "success"
  }
}
```


<!-- MULTICODE_BLOCK_END -->


To see which shards have been downloaded to the local server, examine the subfolders in your configured location for the shard store.
