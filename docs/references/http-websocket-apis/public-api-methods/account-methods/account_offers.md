---
html: account_offers.html
parent: account-methods.html
seo:
    description: Get info about an account's currency exchange offers.
labels:
  - Decentralized Exchange
---
# account_offers
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountOffers.cpp "Source")

The `account_offers` method retrieves a list of [offers](../../../../concepts/tokens/decentralized-exchange/offers.md) made by a given [account](../../../../concepts/accounts/index.md) that are outstanding as of a particular [ledger version](../../../../concepts/ledgers/index.md).

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 9,
  "command": "account_offers",
  "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_offers",
    "params": [
        {
            "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: account_offers account [ledger_index]
rippled account_offers rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM current
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#account_offers)

A request can include the following parameters:

| Field          | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `account`      | String - [Address][] | Yes       | Look up Offers placed by this account. |
| `ledger_hash`  | [Hash][]             | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | [Ledger Index][]     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Number               | No        | Limit the number of Offers to retrieve. The server may return fewer than this number of results. Must be within the inclusive range 10 to 400. Positive values outside this range are replaced with the closest valid option.The default is 200. |
| `marker`       | [Marker][]           | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |

The following parameters are deprecated should not be provided: `ledger`, `strict`.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 9,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
    "ledger_current_index": 18539550,
    "offers": [
      {
        "flags": 0,
        "quality": "0.00000000574666765650638",
        "seq": 6577664,
        "taker_gets": "33687728098",
        "taker_pays": {
          "currency": "EUR",
          "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
          "value": "193.5921774819578"
        }
      },
      {
        "flags": 0,
        "quality": "7989247009094510e-27",
        "seq": 6572128,
        "taker_gets": "2361918758",
        "taker_pays": {
          "currency": "XAU",
          "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
          "value": "0.01886995237307572"
        }
      },
      ... trimmed for length ...
    ],
    "validated": false
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
        "ledger_current_index": 18539596,
        "offers": [{
            "flags": 0,
            "quality": "0.000000007599140009999998",
            "seq": 6578020,
            "taker_gets": "29740867287",
            "taker_pays": {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                "value": "226.0050145327418"
            }
        }, {
            "flags": 0,
            "quality": "7989247009094510e-27",
            "seq": 6572128,
            "taker_gets": "2361918758",
            "taker_pays": {
                "currency": "XAU",
                "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
                "value": "0.01886995237307572"
            }
        }, {
            "flags": 0,
            "quality": "0.00000004059594001318974",
            "seq": 6576905,
            "taker_gets": "3892952574",
            "taker_pays": {
                "currency": "CNY",
                "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                "value": "158.0380691682966"
            }
        },

        ...

        ],
        "status": "success",
        "validated": false
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "account" : "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
      "ledger_current_index" : 57110969,
      "offers" : [
         {
            "flags" : 0,
            "quality" : "1499850014.892974",
            "seq" : 7916201,
            "taker_gets" : {
               "currency" : "BCH",
               "issuer" : "rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds",
               "value" : "0.5268598580881351"
            },
            "taker_pays" : "790210766"
         }
      ],
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                      | Description             |
|:-----------------------|:--------------------------|:------------------------|
| `account`              | String                    | Unique [Address][] identifying the account that made the offers |
| `offers`               | Array                     | Array of objects, where each object represents an offer made by this account that is outstanding as of the requested ledger version. If the number of offers is large, only returns up to `limit` at a time. |
| `ledger_current_index` | Number - [Ledger Index][] | _(Omitted if `ledger_hash` or `ledger_index` provided)_ The ledger index of the current in-progress ledger version, which was used when retrieving this data. |
| `ledger_index`         | Number - [Ledger Index][] | _(Omitted if `ledger_current_index` provided instead)_ The ledger index of the ledger version that was used when retrieving this data, as requested. |
| `ledger_hash`          | String - [Hash][]         | _(May be omitted)_ The identifying hash of the ledger version that was used when retrieving this data. |
| `marker`               | [Marker][]                | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no pages of information after this one. |


Each offer object contains the following fields:

| `Field`      | Type             | Description                                |
|:-------------|:-----------------|:-------------------------------------------|
| `flags`      | Unsigned integer | Options set for this offer entry as bit-flags. |
| `seq`        | Unsigned integer | Sequence number of the transaction that created this entry. (Transaction [sequence numbers](../../../protocol/data-types/basic-data-types.md#account-sequence) are relative to accounts.) |
| `taker_gets` | String or Object | The amount the account accepting the offer receives, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts][Currency Amount]) |
| `taker_pays` | String or Object | The amount the account accepting the offer provides, as a String representing an amount in XRP, or a currency specification object. (See [Specifying Currency Amounts][Currency Amount]) |
| `quality`    | String           | The exchange rate of the offer, as the ratio of the original `taker_pays` divided by the original `taker_gets`. When executing offers, the offer with the most favorable (lowest) quality is consumed first; offers with the same quality are executed from oldest to newest. |
| `expiration` | Unsigned integer | (May be omitted) A time after which this offer is considered unfunded, as the number of [seconds since the Ripple Epoch][]. See also: [Offer Expiration](../../../../concepts/tokens/decentralized-exchange/offers.md#offer-expiration). |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - The `marker` field provided is incorrect.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
