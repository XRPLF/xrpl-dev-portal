---
html: amm_info.html
parent: path-and-order-book-methods.html
seo:
    description: Get info about an Automated Market Maker (AMM) instance.
labels:
  - Decentralized Exchange
  - Cross-Currency
  - AMM
---
# amm_info
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AMMInfo.cpp "Source")

The {% code-page-name /%} method gets information about an Automated Market Maker (AMM) instance.

_(Added by the [AMM amendment][])_


### Request Format

An example of the request format:

{% raw-partial file="/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "{% $frontmatter.seo.title %}",
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency": "TST",
      "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
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
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs.altnet.rippletest.net%3A51233%2F#amm_info)

The request includes the following parameters:

| `Field`       | Type             | Required? | Description |
|:--------------|:-----------------|:----------|-------------|
| `account`     | String - [Address][] | No    | Show only LP Tokens held by this liquidity provider. |
| `amm_account` | String - [Address][] | No    | The address of the AMM's special AccountRoot. (This is the `issuer` of the AMM's LP Tokens.) |
| `asset`       | Object           | No        | One of the assets of the AMM to look up, as an object with `currency` and `issuer` fields (omit `issuer` for XRP), like [currency amounts][Currency Amount]. |
| `asset2`      | Object           | No        | The other of the assets of the AMM, as an object with `currency` and `issuer` fields (omit `issuer` for XRP), like [currency amounts][Currency Amount]. |

You must specify _either_ `amm_account` or both `asset` and `asset2`.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "amm": {
      "account": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
      "amount": "296890496",
      "amount2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value": "25.81656470648473"
      },
      "asset2_frozen": false,
      "auction_slot": {
        "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
        "auth_accounts": [
          {
            "account": "r3f2WpQMsAd8k4Zoijv2PZ78EYFJ2EdvgV"
          },
          {
            "account": "rnW8FAPgpQgA6VoESnVrUVJHBdq9QAtRZs"
          }
        ],
        "discounted_fee": 60,
        "expiration": "2023-Jan-26 00:28:40.000000000 UTC",
        "price": {
          "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
          "value": "0"
        },
        "time_interval": 0
      },
      "lp_token": {
        "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
        "value": "87533.41976112682"
      },
      "trading_fee": 600,
      "vote_slots": [
        {
          "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "trading_fee": 600,
          "vote_weight": 9684
        }
      ]
    },
    "ledger_current_index": 316725,
    "validated": false
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
    "amm": {
      "account": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
      "amount": "296890496",
      "amount2": {
        "currency": "TST",
        "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value": "25.81656470648473"
      },
      "asset2_frozen": false,
      "auction_slot": {
        "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
        "auth_accounts": [
          {
            "account": "r3f2WpQMsAd8k4Zoijv2PZ78EYFJ2EdvgV"
          },
          {
            "account": "rnW8FAPgpQgA6VoESnVrUVJHBdq9QAtRZs"
          }
        ],
        "discounted_fee": 0,
        "expiration": "2023-Jan-26 00:28:40.000000000 UTC",
        "price": {
          "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
          "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
          "value": "0"
        },
        "time_interval": 0
      },
      "lp_token": {
        "currency": "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
        "issuer": "rp9E3FN3gNmvePGhYnf414T2TkUuoxu8vM",
        "value": "87533.41976112682"
      },
      "trading_fee": 600,
      "vote_slots": [
        {
          "account": "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
          "trading_fee": 600,
          "vote_weight": 9684
        }
      ]
    },
    "ledger_current_index": 316745,
    "status": "success",
    "validated": false
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field                  | Type             | Description                                               |
|:-----------------------|:-----------------|:----------------------------------------------------------|
| `amm`                  | Object           | An [**AMM Description Object**](#amm-description-object) for the requested asset pair. |
| `ledger_current_index` | [Ledger Index][] | _(Omitted if `ledger_index` is provided instead)_ The [ledger index][] of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_hash`          | [Hash][]         | _(Omitted if `ledger_current_index` is provided instead)_ The identifying hash of the ledger version that was used when retrieving this data. |
| `ledger_index`         | [Ledger Index][] | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index][] of the ledger version used when retrieving this information. |
| `validated`            | Boolean          | If `true`, the ledger used for this request is validated and these results are final; if omitted or set to `false`, the data is pending and may change. |


### AMM Description Object

The `amm` field is an object describing the current status of an Automated Market Maker (AMM) in the ledger, and contains the following fields:

| Field           | Type                | Description |
|-----------------|---------------------|-------------|
| `account`   | String              | The [Address][] of the AMM Account. |
| `amount`        | [Currency Amount][] | The total amount of one asset in the AMM's pool. (Note: This could be `asset` _or_ `asset2` from the request.) |
| `amount2`       | [Currency Amount][] | The total amount of the other asset in the AMM's pool. (Note: This could be `asset` _or_ `asset2` from the request.) |
| `asset_frozen`  | Boolean             | _(Omitted for XRP)_ If `true`, the `amount` currency is currently [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `asset2_frozen` | Boolean             | _(Omitted for XRP)_ If `true`, the `amount2` currency is currently [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `auction_slot`  | Object              | _(May be omitted)_ An [Auction Slot Object](#auction-slot-object) describing the current auction slot holder, if there is one. |
| `lp_token`      | [Currency Amount][] | The total amount of this AMM's LP Tokens outstanding. If the request specified a liquidity provider in the `account` field, instead, this is the amount of this AMM's LP Tokens held by that liquidity provider. |
| `trading_fee`   | Number              | The AMM's current trading fee, in units of 1/100,000; a value of 1 is equivalent to a 0.001% fee. |
| `vote_slots`    | Array               | _(May be omitted)_ The current votes for the AMM's trading fee, as [Vote Slot Objects](#vote-slot-objects). |


### Auction Slot Object

The `auction_slot` field of the `amm` object describes the current auction slot holder of the AMM, and contains the following fields:

| Field            | Type                | Description |
|------------------|---------------------|-------------|
| `account`        | String              | The [Address][] of the account that owns the auction slot. |
| `auth_accounts`  | Array               | A list of additional accounts that the auction slot holder has designated as being eligible of the discounted trading fee. Each member of this array is an object with one field, `account`, containing the address of the designated account. |
| `discounted_fee` | Number              | The discounted trading fee that applies to the auction slot holder, and any eligible accounts, when trading against this AMM. This is 1/10 of the AMM's normal trading fee. |
| `expiration`     | String              | The ISO 8601 UTC timestamp after which this auction slot expires. After expired, the auction slot does not apply (but the data can remain in the ledger until another transaction replaces it or cleans it up). |
| `price`          | [Currency Amount][] | The amount, in LP Tokens, that the auction slot holder paid to win the auction slot. This affects the price to outbid the current slot holder. |
| `time_interval`  | Number              | The current 72-minute time interval this auction slot is in, from 0 to 19. The auction slot expires after 24 hours (20 intervals of 72 minutes) and affects the cost to outbid the current holder and how much the current holder is refunded if someone outbids them. |


### Vote Slot Objects

Each entry in the `vote_slots` array represents one liquidity provider's vote to set the trading fee, and contains the following fields:

| Field         | Type   | Description |
|---------------|--------|-------------|
| `account`     | String | The [Address][] of this liquidity provider. |
| `trading_fee` | Number | The trading fee this liquidity provider voted for, in units of 1/100,000. |
| `vote_weight` | Number | How much this liquidity provider's vote counts towards the final trading fee. This is proportional to how much of the AMM's LP Tokens this liquidity provider holds. The value is equal to 100,000 times the number of this LP Tokens this liquidity provider holds, divided by the total number of LP Tokens outstanding. For example, a value of 1000 means that the liquidity provider holds 1% of this AMM's LP Tokens. |


### Possible Errors

- Any of the [universal error types][].
- `actNotFound` - The AMM for this asset pair does not exist, or an account specified in the request does not exist.
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.


## See Also

 - [AMM object](../../../protocol/ledger-data/ledger-entry-types/amm.md) - The canonical storage format of the AMM object
 - [AMMBid][] - More info on the auction slot and bidding mechanism
 - [AMMVote][] - More info on the trading fee voting mechanism

{% raw-partial file="/docs/_snippets/common-links.md" /%}
