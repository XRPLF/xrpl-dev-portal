---
html: nft_buy_offers.html
parent: path-and-order-book-methods.html
blurb: Get a list of all buy offers for a NFToken.
labels:
  - Non-fungible Tokens, NFTs, NFTokens
---
# nft_buy_offers
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/NFTOffers.cpp "Source")

The `nft_buy_offers` method returns a list of buy offers for a given [NFToken][] object.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Request Format
An example of the request format:

{% include '_snippets/no-cli-syntax.md' %}

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "nft_buy_offers",
  "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "nft_buy_offers",
  "params": [{
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "ledger_index": "validated"
  }]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#nft_buy_offers)

The request includes the following parameters:

| Field          | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `nft_id`       | String           | The unique identifier of a [NFToken][] object. |
| `ledger_hash`  | String           | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Number | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Integer          | _(Optional)_ Limit the number of NFT buy offers to retrieve. This value cannot be lower than 50 or more than 500. The default is 250. |
| `marker`       | [Marker][]       | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. |


## Response Format
An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1500",
        "flags": 0,
        "nft_offer_index": "3212D26DB00031889D4EF7D9129BB0FA673B5B40B1759564486C0F0946BA203F",
        "owner": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx"
      }
    ]
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
  "result": {
    "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
    "offers": [
      {
        "amount": "1500",
        "flags": 0,
        "nft_offer_index": "3212D26DB00031889D4EF7D9129BB0FA673B5B40B1759564486C0F0946BA203F",
        "owner": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx"
      }
    ],
    "status": "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`  | Type       | Description                                          |
|:---------|:-----------|:-----------------------------------------------------|
| `nft_id` | String     | The NFToken these offers are for, as specified in the request. |
| `offers` | Array      | A list of buy offers for the token. Each of these is formatted as a **Buy Offer** (see below). |
| `limit`  | Number     | _(May be omitted)_ The `limit`, as specified in the request. |
| `marker` | [Marker][] | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no pages of information after this one. |

### Buy Offers

Each member of the `offers` array represents one [NFTokenOffer object][] to buy the NFT in question and has the following fields:

| `Field`           | Type             | Description                           |
|:------------------|:-----------------|:--------------------------------------|
| `amount`          | String or Object | The amount offered to buy the NFT for, as a String representing an amount in drops of XRP, or an object representing an amount of a fungible token. (See [Specifying Currency Amounts][Currency Amount]) |
| `flags`           | Number           | A set of bit-flags for this offer. See [NFTokenOffer flags](nftokenoffer.html#nftokenoffer-flags) for possible values. |
| `nft_offer_index` | String           | The [ledger object ID](ledger-object-ids.html) of this offer. |
| `owner`           | String           | The account that placed this offer.   |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
