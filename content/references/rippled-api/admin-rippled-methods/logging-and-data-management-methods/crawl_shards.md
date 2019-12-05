# crawl_shards
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/CrawlShards.cpp "Source")

Requests information from peer servers about which [shards of historical ledger data](history-sharding.html) they have available. [New in: rippled 1.2.0][]

_The `crawl_shards` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

### Request Format

An example of the request format:

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

**Note:** There is no command-line syntax for this method. Use the [json method][] to access this from the command line.

The request includes the following fields:

| `Field`  | Type    | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `pubkey` | Boolean | _(Optional)_ If `true`, the response includes the node public keys (for peer-to-peer communications) of servers that were crawled. The default is `false`. |
| `limit`  | Number  | _(Optional)_ How many hops deep to search. The default is 0, which searches direct peers only. With a limit of `1`, searches peers' peers also. The maximum value is `3`. |

**Caution:** The number of peers potentially searched grows exponentially as `limit` increases. With a limit of 2 or 3, it can take several seconds for the server to respond to the API request.


### Response Format

An example of a successful response:

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

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`           | Type   | Description                                     |
|:------------------|:-------|:------------------------------------------------|
| `complete_shards` | String | _(May be omitted)_ The range of [history shards](history-sharding.html) that are available on the local server. This may be an empty string, or a disjointed range. For example, `1-2,5,7-9` indicates that shards 1, 2, 5, 7, 8, and 9 are available. Omitted if this server does not have history sharding enabled. |
| `peers`           | Array  | List of **Peer Shard Objects** (see below) describing which history shards each peer has available. |

#### Peer Shard Objects

Each member of the `peers` array of the response is an object that describes one server in the peer-to-peer network. The list only includes peers that have at least one complete [history shard](history-sharding.html) available. Each object in the array has the following fields:


| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `complete_shards` | String | The range of history shards this peer has available. This may be disjointed. For example, `1-2,5,7-9` indicates that shards 1, 2, 5, 7, 8, and 9 are available. |
| `ip` | String | _(May be omitted)_ The IP address of the peer this object describes. This may be an IPv4 or IPv6 address. Omitted if this is a [private peer](peer-protocol.html#private-peers). |
| `public_key` | String | _(Omitted unless the request specified `"pubkey": true`)_ The public key this peer uses for peer-to-peer communications, in the XRP Ledger's [base58 format](base58-encodings.html). |


### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more required fields were omitted from the request, or a provided field was specified as the wrong data type.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
