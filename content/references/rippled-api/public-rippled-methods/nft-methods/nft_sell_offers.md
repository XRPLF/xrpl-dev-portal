---
html: nft_sell_offers.html
parent: nft-methods.html
blurb: Get a list of all sell offers for a NFToken.
labels:
  - Non-fungible Tokens, NFTs, NFTokens
---
# account_nfts
[[Source]](https://github.com/ripple/rippled/blob/xls20/src/ripple/rpc/handlers/NFTOffers.cpp "Source")
{% include '_snippets/nfts-disclaimer.md' %}

The `nft_sell_offers` method returns a list of sell offers for a `NFToken` object.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
   "id": 1,
   "command": "nft_sell_offers",
   "params": [{
   		"tokenid": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007"
   }]
}
```

*JSON-RPC*

```json
{
    "method": "nft_sell_offers",
    "tokenid": "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007"
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
  "id": 0,
  "result": {
    "offers": [
      {
        "amount": "100",
        "flags": 1,
        "index": "0468126DEDD7EF3F624137F55F4BABE6BEFB4A2CE8F2D9E5D7756FD06B9B2045",
        "owner": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm"
      }
    ],
    "tokenid": "000900001FD350FC4A6133360827DE142E60E7522E4F4DF529ABA6A80000000D"
  },
  "type": "response"
}
```

*JSON-RPC*

```json
{
	{
	  "id": 0,
	  "result": {
		"offers": [
		  {
			"amount": "100",
			"flags": 1,
			"index": "0468126DEDD7EF3F624137F55F4BABE6BEFB4A2CE8F2D9E5D7756FD06B9B2045",
			"owner": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm"
		  }
		],
		"tokenid": "000900001FD350FC4A6133360827DE142E60E7522E4F4DF529ABA6A80000000D"
	  },
	  "type": "response"
	}
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `tokenid` | String | The NFToken associated with the sell offers |
| `offers` | Array | The list of sell offers for the NFToken |

## Possible Errors

* Any of the [universal error types][].


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
