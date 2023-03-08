---
html: nft_sell_offers.html
parent: path-and-order-book-methods.html
blurb: Get a list of all sell offers for a NFToken.
labels:
  - Non-fungible Tokens, NFTs, NFTokens
---
# nft_sell_offers
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/NFTOffers.cpp "Source")

The `nft_sell_offers` method returns a list of sell offers for a given [NFToken][] object.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Request Format
An example of the request format:

{% include '_snippets/no-cli-syntax.md' %}

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "nft_sell_offers",
  "nft_id": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
  "ledger_index": "validated"
}
```

*JSON-RPC*

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

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#nft_sell_offers)

The request includes the following parameters:

| Field                 | Type                       | Description             |
|:----------------------|:---------------------------|:------------------------|
| `tokenid`             | String                     | The unique identifier of a NFToken object. |
|
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

*JSON-RPC*

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

<!-- MULTICODE_BLOCK_END -->


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
