---
html: ripple_path_find.html
parent: path-and-order-book-methods.html
seo:
    description: Find a path for payment between two accounts, once.
labels:
  - Cross-Currency
  - Tokens
---
# ripple_path_find
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/rpc/handlers/RipplePathFind.cpp "Source")

The `ripple_path_find` method is a simplified version of the [path_find method][] that provides a single response with a [payment path](../../../../concepts/tokens/fungible-tokens/paths.md) you can use right away. It is available in both the WebSocket and JSON-RPC APIs. However, the results tend to become outdated as time passes. Instead of making multiple calls to stay updated, you should instead use the [path_find method][] to subscribe to continued updates where possible.

Although the `rippled` server tries to find the cheapest path or combination of paths for making a payment, it is not guaranteed that the paths returned by this method are, in fact, the best paths.

{% admonition type="warning" name="Caution" %}Be careful with the pathfinding results from untrusted servers. A server could be modified to return less-than-optimal paths to earn money for its operators. A server may also return poor results when under heavy load. If you do not have your own server that you can trust with pathfinding, you should compare the results of pathfinding from multiple servers run by different parties, to minimize the risk of a single server returning poor results.{% /admonition %}

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 8,
    "command": "ripple_path_find",
    "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "source_currencies": [
        {
            "currency": "XRP"
        },
        {
            "currency": "USD"
        }
    ],
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_amount": {
        "value": "0.001",
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "ripple_path_find",
    "params": [
        {
            "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "destination_amount": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                "value": "0.001"
            },
            "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "source_currencies": [
                {
                    "currency": "XRP"
                },
                {
                    "currency": "USD"
                }
            ]
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax ripple_path_find json ledger_index|ledger_hash
rippled ripple_path_find '{"source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "source_currencies": [ { "currency": "XRP" }, { "currency": "USD" } ], "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "destination_amount": { "value": "0.001", "currency": "USD", "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" } }'
```
{% /tab %}

{% /tabs %}

{% try-it method="ripple_path_find" /%}

The request includes the following parameters:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|:------------|
| `source_account`      | String - [Address][] | Yes       | The account that would send funds |
| `destination_account` | String - [Address][] | Yes       | The account that would receive funds |
| `destination_amount`  | [Currency Amount][]  | Yes       | How much the destination account would receive. **Special case:** You can specify `"-1"` (for XRP) or provide -1 as the contents of the `value` field (for tokens). This requests a path to deliver as much as possible, while spending no more than the amount specified in `send_max` (if provided). |
| `domain`              | String - [Hash][]    | No        | The ledger entry ID of a permissioned domain. If provided, only return paths that use the corresponding [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md). _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |
| `ledger_hash`         | String - [Hash][]    | No        | The unique hash of the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | [Ledger Index][]     | No        | The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `send_max`            | [Currency Amount][]  | No        | Maximum amount that would be spent. Cannot be used with `source_currencies`. |
| `source_currencies`   | Array                | No        | Array of currencies that the source account might want to spend. Each entry in the array should be a JSON object with a mandatory `currency` field and optional `issuer` field, like how [currency amounts][Currency Amount] are specified. Cannot contain more than **18** source currencies. By default, uses all source currencies available up to a maximum of **88** different currency/issuer pairs. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 8,
    "status": "success",
    "type": "response",
    "result": {
        "alternatives": [
            {
                "paths_canonical": [],
                "paths_computed": [
                    [
                        {
                            "currency": "USD",
                            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rLpq4LgabRfm1xEX5dpWfJovYBH6g7z99q",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rPuBoajMjFoDjweJBrtZEBwUMkyruxpwwV",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ]
                ],
                "source_amount": "256987"
            }
        ],
        "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "destination_currencies": [
            "015841551A748AD2C1F76FF6ECB0CCCD00000000",
            "JOE",
            "DYM",
            "EUR",
            "CNY",
            "MXN",
            "BTC",
            "USD",
            "XRP"
        ]
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "alternatives": [
            {
                "paths_canonical": [],
                "paths_computed": [
                    [
                        {
                            "currency": "USD",
                            "issuer": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rfDeu7TPUmyvUrffexjMjq3mMcSQHZSYyA",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "raspZSGNiTKi5jmvFxUYCuYXPv1V8WhL5g",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ],
                    [
                        {
                            "currency": "USD",
                            "issuer": "rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
                            "type": 48,
                            "type_hex": "0000000000000030"
                        },
                        {
                            "account": "rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        },
                        {
                            "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                            "type": 1,
                            "type_hex": "0000000000000001"
                        }
                    ]
                ],
                "source_amount": "207414"
            }
        ],
        "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "destination_currencies": [
            "USD",
            "JOE",
            "BTC",
            "DYM",
            "CNY",
            "EUR",
            "015841551A748AD2C1F76FF6ECB0CCCD00000000",
            "MXN",
            "XRP"
        ],
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "alternatives" : [
         {
            "paths_canonical" : [],
            "paths_computed" : [
               [
                  {
                     "currency" : "USD",
                     "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                     "type" : 48,
                     "type_hex" : "0000000000000030"
                  }
               ]
            ],
            "source_amount" : "5212"
         },
         {
            "paths_canonical" : [],
            "paths_computed" : [
               [
                  {
                     "account" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  },
                  {
                     "account" : "rnx1RNE5cJbYzMsJbF3XzyQMxZNBPqdCVd",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  }
               ],
               [
                  {
                     "account" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  },
                  {
                     "account" : "ragizZ31TmpachYAuG3n56XCb1R5vc3cTQ",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  }
               ],
               [
                  {
                     "account" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  },
                  {
                     "account" : "r9JS9fLbtLzgBCdFCnS3LpVPUBJAmg7PnM",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  }
               ],
               [
                  {
                     "account" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  },
                  {
                     "account" : "rDc9zKqfxm43S9LwpNkwV9KgW6PKUPrT5u",
                     "type" : 1,
                     "type_hex" : "0000000000000001"
                  }
               ]
            ],
            "source_amount" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0.001002"
            }
         }
      ],
      "destination_account" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "destination_amount" : {
         "currency" : "USD",
         "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
         "value" : "0.001"
      },
      "destination_currencies" : [
         "USD",
         "015841551A748AD2C1F76FF6ECB0CCCD00000000",
         "BTC",
         "DYM",
         "CNY",
         "EUR",
         "JOE",
         "MXN",
         "XRP"
      ],
      "full_reply" : true,
      "source_account" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                  | Type   | Description                              |
|:-------------------------|:-------|:-----------------------------------------|
| `alternatives`           | Array  | Array of objects with possible paths to take, as described below. If empty, then there are no paths connecting the source and destination accounts. |
| `destination_account`    | String | Unique address of the account that would receive a payment transaction |
| `destination_currencies` | Array  | Array of strings representing the currencies that the destination accepts, as 3-letter codes like `"USD"` or as 40-character hex like `"015841551A748AD2C1F76FF6ECB0CCCD00000000"` |

Each element in the `alternatives` array is an object that represents a path from one possible source currency (held by the initiating account) to the destination account and currency. This object has the following fields:

| `Field`          | Type             | Description                            |
|:-----------------|:-----------------|:---------------------------------------|
| `paths_computed` | Array            | Array of arrays of objects defining [payment paths](../../../../concepts/tokens/fungible-tokens/paths.md) |
| `source_amount`  | String or Object | [Currency Amount][] that the source would have to send along this path for the destination to receive the desired amount |

The following fields are deprecated, and may be omitted: `paths_canonical`, and `paths_expanded`. If they appear, you should disregard them.

## Possible Errors

* Any of the [universal error types][].
* `tooBusy` - The server is under too much load to calculate paths. Not returned if you are connected as an admin.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `srcActMissing` - The `source_account` field is omitted from the request.
* `srcActMalformed` - The `source_account` field in the request is not formatted properly.
* `dstActMissing` - The `destination_account` field is omitted from the request.
* `dstActMalformed` - The `destination_account` field in the request is not formatted properly.
* `srcCurMalformed` - The `source_currencies` field is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more of the currency objects in the request is not valid.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
