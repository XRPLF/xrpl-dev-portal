---
html: nft_sell_offers.html
parent: path-and-order-book-methods.html
seo:
    description: Get a list of all sell offers for a NFToken.
labels:
  - Non-fungible Tokens, NFTs, NFTokens
---
# nft_sell_offers
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/NFTOffers.cpp "Source")

The `nft_sell_offers` method returns a list of sell offers for a given [NFToken][] object.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Request Format
An example of the request format:

{% raw-partial file="/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "nft_sell_offers",
  "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "nft_sell_offers",
    "params": [
        {
            "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#nft_sell_offers)

The request includes the following parameters:

| Field          | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `nft_id`       | String           | The unique identifier of a [NFToken][] object. |
| `ledger_hash`  | String           | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Number | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Integer          | _(Optional)_ Limit the number of NFT sell offers to retrieve. This value cannot be lower than 50 or more than 500. Positive values outside this range are replaced with the closest valid option. The default is 250. |
| `marker`       | [Marker][]       | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. |

## Response Format
An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1000",
        "flags": 1,
        "nft_offer_index": "9E28E366573187F8E5B85CE301F229E061A619EE5A589EF740088F8843BF10A1",
        "owner": "rLpSRZ1E8JHyNDZeHYsQs1R5cwDCB3uuZt"
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
{
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1000",
        "flags": 1,
        "nft_offer_index": "9E28E366573187F8E5B85CE301F229E061A619EE5A589EF740088F8843BF10A1",
        "owner": "rLpSRZ1E8JHyNDZeHYsQs1R5cwDCB3uuZt"
      }
    ],
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}


The response follows the [standard format][], with a successful result containing the following fields:

| `Field`  | Type       | Description                                          |
|:---------|:-----------|:-----------------------------------------------------|
| `nft_id` | String     | The NFToken these offers are for, as specified in the request. |
| `offers` | Array      | A list of buy offers for the token. Each of these is formatted as a **Sell Offer** (see below). |
| `limit`  | Number     | _(May be omitted)_ The `limit`, as specified in the request. |
| `marker` | [Marker][] | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no pages of information after this one. |

### Sell Offers

Each member of the `offers` array represents one [NFTokenOffer object][] to buy the NFT in question and has the following fields:

| `Field`           | Type             | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `amount`          | String or Object | The amount offered to sell the NFT for, as a String representing an amount in drops of XRP, or an object representing an amount of a fungible token. (See [Specifying Currency Amounts][Currency Amount]) |
| `flags`           | Number           | A set of bit-flags for this offer. See [NFTokenOffer flags](../../../protocol/ledger-data/ledger-entry-types/nftokenoffer.md#nftokenoffer-flags) for possible values. |
| `nft_offer_index` | String           | The [ledger object ID](../../../protocol/ledger-data/common-fields.md) of this offer. |
| `owner`           | String           | The account that placed this offer.   |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `objectNotFound` - The NFT does not have any sell offers (note that _object_ refers to the sell offer rather than the NFT itself).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
