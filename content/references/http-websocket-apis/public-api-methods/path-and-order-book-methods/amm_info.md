---
html: amm_info.html
parent: path-and-order-book-methods.html
blurb: Get info about an Automted Market Maker (AMM) instance.
status: not_enabled
labels:
  - Decentralized Exchange
  - Cross-Currency
  - AMM
---
# amm_info
[[Source]](https://github.com/gregtatcam/rippled/blob/amm-core-functionality/src/ripple/rpc/handlers/AMMInfo.cpp "Source")
<!-- TODO: Update source link to merged version when available -->

The `{{currentpage.name}}` method gets information about an Automated Market Maker (AMM) instance.

{% include '_snippets/amm-disclaimer.md' %}


### Request Format

An example of the request format:

{% include '_snippets/no-cli-syntax.md' %}

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "{{currentpage.name}}",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "TST",
      "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
      "asset": {
        "currency": "XRP"
      },
      "asset2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
      }
    }]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html?server=wss%3A%2F%2Famm.devnet.rippletest.net%3A51233%2F#amm_info)

The request includes the following parameters:

| `Field`  | Type             | Description                        |
|:---------|:-----------------|:-----------------------------------|
| `asset`  | Object or String | One of the assets of the AMM to look up, as an object with `currency` and `issuer` fields (omit `issuer` for XRP), like [currency amounts][Currency Amount]. For XRP, you can specify as the string `XRP` instead of as an object. |
| `asset2` | Object or String | The other of the assets of the AMM, as an object with `currency` and `issuer` fields (omit `issuer` for XRP), like [currency amounts][Currency Amount]. |


### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "amm": {
        "AMMAccount" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
        "Asset" : {
          "currency" : "XRP"
        },
        "Asset2" : {
          "currency" : "TST",
          "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
        },
        "AuctionSlot" : {
          "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "AuthAccounts" : [
              {
                "AuthAccount" : {
                    "Account" : "rMKXGCbJ5d8LbrqthdG46q3f969MVK2Qeg"
                }
              },
              {
                "AuthAccount" : {
                    "Account" : "rBepJuTLFJt3WmtLXYAxSjtBWAeQxVbncv"
                }
              }
          ],
          "DiscountedFee" : 0,
          "Expiration" : 721870180,
          "Price" : {
              "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
              "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
              "value" : "0.8696263565463045"
          }
        },
        "Flags" : 0,
        "LPTokenBalance" : {
          "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
          "value" : "71150.53584131501"
        },
        "TradingFee" : 600,
        "VoteSlots" : [
          {
              "VoteEntry" : {
                "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
                "TradingFee" : 600,
                "VoteWeight" : 100000
              }
          }
        ]
    },
    "ledger_current_index": 226645,
    "validated": false
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
    "amm": {
        "AMMAccount" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
        "Asset" : {
          "currency" : "XRP"
        },
        "Asset2" : {
          "currency" : "TST",
          "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
        },
        "AuctionSlot" : {
          "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "AuthAccounts" : [
              {
                "AuthAccount" : {
                    "Account" : "rMKXGCbJ5d8LbrqthdG46q3f969MVK2Qeg"
                }
              },
              {
                "AuthAccount" : {
                    "Account" : "rBepJuTLFJt3WmtLXYAxSjtBWAeQxVbncv"
                }
              }
          ],
          "DiscountedFee" : 0,
          "Expiration" : 721870180,
          "Price" : {
              "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
              "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
              "value" : "0.8696263565463045"
          }
        },
        "Flags" : 0,
        "LPTokenBalance" : {
          "currency" : "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer" : "rE54zDvgnghAoPopCgvtiqWNq3dU5y836S",
          "value" : "71150.53584131501"
        },
        "TradingFee" : 600,
        "VoteSlots" : [
          {
              "VoteEntry" : {
                "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
                "TradingFee" : 600,
                "VoteWeight" : 100000
              }
          }
        ]
    },
    "ledger_current_index": 226620,
    "status": "success",
    "validated": false
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type    | Description                                               |
|:-----------------------|:--------|:----------------------------------------------------------|
| `amm`                  | Object  | The [AMM object](amm.html) for the requested asset pair.  |
| `ledger_current_index` | Integer | _(Omitted if `ledger_index` is provided instead)_ The [ledger index][] of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_index`         | Integer | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index][] of the ledger version used when retrieving this information. |
| `validated`            | Boolean | If `true`, the ledger used for this request is validated and these results are final; if omitted or set to `false`, the data is pending and may change. |



### Possible Errors

- Any of the [universal error types][].
- `actNotFound` - The AMM for this asset pair does not exist, or an issuing account specified in the request does not exist.
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
