# download_shard
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/DownloadShard.cpp "Source")

Instructs the server to download a specific [shard of historical ledger data](history-sharding.html) from an external source. Your `rippled` server must be [configured to store history shards](configure-history-sharding.html). [New in: rippled 1.1.0][]

_The `download_shard` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

The external source must provide the shard as an [lz4-compressed](https://lz4.github.io/lz4/) [tar archive](https://en.wikipedia.org/wiki/Tar_(computing)) served via HTTPS. The archive must contain the shard directory and data files in NuDB format.

Downloading and importing shards using this method is usually faster than acquiring the shards individually from the peer-to-peer network. You can also use this method to choose a specific range or set of shards to provide from your server.

### Request Format

An example of the request format:

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


The request includes the following fields:

| `Field`    | Type    | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `shards`   | Array   | List of Shard Descriptor objects (see below) describing shards to download and where to download them from. |
| `validate` | Boolean | _(Optional)_ If `false`, skip validating the downloaded data. The default is `true`, which checks that the shard in the archive contains all the data objects for the shard and the shard is part of the ledger history of the current validated ledger. |

Each **Shard Descriptor object** in the `shards` array has the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `index` | Number | The index of the shard to retrieve. In the production XRP Ledger, the oldest shard has index 1 and contains ledgers 32750-32768. The next shard has index 2 and contains ledgers 32769-49152, and so on. |
| `url`   | String | The URL where this shard can be downloaded. The URL must start with `https://` and must end with `.tar.lz4` (not case-sensitive). The web server providing this download must use a valid TLS certificate signed by a trusted Certificate Authority (CA). (`rippled` uses the operating system's CA store.) |

### Response Format

An example of a successful response:

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

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | A message describing the actions taken in response to this request. |

**Tip:** To see which shards your server has available, use the [crawl_shards method][]. Alternatively, you can look at the subfolders in your configured location for the shard store (the `path` parameter of `[shard_db]` in your `rippled.cfg`). The folders are named to match the numbers of the shards; up to one of those folders may contain a `control.txt` file indicating that the shard is incomplete.

### Possible Errors

- Any of the [universal error types][].
- `notEnabled` - The server is not configured with a shard store.
- `tooBusy` - The server is already downloading the shard, either from the peer-to-peer network or as the result of a previous `download_shard` request.
- `invalidParams` - One or more required fields were omitted from the request, or a provided field was specified as the wrong data type.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
