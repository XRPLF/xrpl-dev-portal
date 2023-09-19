---
html: download_shard.html
parent: logging-and-data-management-methods.html
blurb: Download a specific shard of ledger history.
labels:
  - Data Retention
---
# download_shard
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/DownloadShard.cpp "Source")

Instructs the server to download a specific [shard of historical ledger data](history-sharding.html) from an external source. Your `rippled` server must be [configured to store history shards](configure-history-sharding.html). [Updated in: rippled 1.6.0][]

_The `download_shard` method is an [admin method](admin-api-methods.html) that cannot be run by unprivileged users._

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

*Commandline*

```sh
# Syntax: download_shard [[<index> <url>]]
rippled download_shard 1 https://example.com/1.tar.lz4 2 https://example.com/2.tar.lz4 5 https://example.com/5.tar.lz4
```

<!-- MULTICODE_BLOCK_END -->


The request includes the following field:

| `Field`    | Type    | Description                                           |
|:-----------|:--------|:------------------------------------------------------|
| `shards`   | Array   | List of Shard Descriptor objects (see below) describing shards to download and where to download them from. |

The `validate` field is deprecated and may be removed in a future version. (The server always checks the integrity of shards when it imports them.) [Updated in: rippled 1.6.0][]

Each **Shard Descriptor object** in the `shards` array has the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `index` | Number | The index of the shard to retrieve. In the production XRP Ledger, the oldest shard has index 1 and contains ledgers 32750-32768. The next shard has index 2 and contains ledgers 32769-49152, and so on. |
| `url`   | String | The URL where this shard can be downloaded. The URL must start with `http://` or `https://` and must end with `.tar.lz4` (not case-sensitive). The web server providing this download must use a valid TLS certificate signed by a trusted Certificate Authority (CA). (`rippled` uses the operating system's CA store.) [Updated in: rippled 1.7.0][] |

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

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

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
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
