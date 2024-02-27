---
html: crawl_shards.html
parent: logging-and-data-management-methods.html
seo:
    description: Request information about which history shards peers have.
labels:
  - Data Retention
---
# crawl_shards
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/CrawlShards.cpp "Source")

Requests information from peer servers about which [shards of historical ledger data](../../../../infrastructure/configuration/data-retention/history-sharding.md) they have available.

_The `crawl_shards` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "crawl_shards",
  "public_key": true,
  "limit": 0
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "crawl_shards",
  "params": [
    {
      "public_key": true,
      "limit": 0
    }
  ]
}
```
{% /tab %}

{% /tabs %}

**Note:** There is no command-line syntax for this method. Use the [json method][] to access this from the command line.

The request includes the following fields:

| `Field`  | Type    | Description                                             |
|:---------|:--------|:--------------------------------------------------------|
| `public_key` | Boolean | _(Optional)_ If `true`, the response includes the node public keys (for peer-to-peer communications) of servers that were crawled. The default is `false`. |
| `limit`  | Number  | _(Optional)_ How many hops deep to search. The default is 0, which searches direct peers only. With a limit of `1`, searches peers' peers also. The maximum value is `3`. |

**Caution:** The number of peers potentially searched grows exponentially as `limit` increases. With a limit of 2 or 3, it can take several seconds for the server to respond to the API request.


### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`           | Type   | Description                                     |
|:------------------|:-------|:------------------------------------------------|
| `complete_shards` | String | _(May be omitted)_ The range of [history shards](../../../../infrastructure/configuration/data-retention/history-sharding.md) that are available on the local server. This may be an empty string, or a disjointed range. For example, `1-2,5,7-9` indicates that shards 1, 2, 5, 7, 8, and 9 are available. Omitted if this server does not have history sharding enabled. |
| `peers`           | Array  | _(May be omitted)_ List of **Peer Shard Objects** (see below) describing which history shards each peer has available. The response omits this field if no peers within the number of hops specified by `limit` have any shards. |

#### Peer Shard Objects

Each member of the `peers` array of the response is an object that describes one server in the peer-to-peer network. The list only includes peers that have at least one complete [history shard](../../../../infrastructure/configuration/data-retention/history-sharding.md) available. Each object in the array has the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `complete_shards` | String | The range of complete history shards this peer has available. This may be disjointed. For example, `1-2,5,7-9` indicates that shards 1, 2, 5, 7, 8, and 9 are available. |
| `incomplete_shards` | String | _(May be omitted)_ A comma-separated list of history shards this peer has partially downloaded, and percent completion for each. For example, `1:50,2:25` indicates that shard 1 is 50% downloaded and shard 2 is 25% downloaded. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}New in: rippled 1.8.1{% /badge %} |
| `public_key` | String | _(Omitted unless the request specified `"public_key": true`)_ The public key this peer uses for peer-to-peer communications, in the XRP Ledger's [base58 format](../../../protocol/data-types/base58-encodings.md). |

The `ip` field is no longer provided. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}Removed in: rippled 1.8.1{% /badge %}


### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more required fields were omitted from the request, or a provided field was specified as the wrong data type.
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
