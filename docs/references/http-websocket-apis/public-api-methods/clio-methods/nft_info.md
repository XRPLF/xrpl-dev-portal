---
html: nft_info.html
parent: clio-methods.html
seo:
    description: Retrieve information about the specified NFT using Clio server's `nft_info` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nft_info
[[Source]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/NFTInfo.cpp "Source")

The `nft_info` command asks the Clio server for information about the [NFT](../../../../concepts/tokens/nfts/index.md) being queried. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}New in: Clio v2.0.0{% /badge %}

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "nft_info",
  "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "nft_info",
    "params": [
      {
          "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000"
      }
    ]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#nft_info)

The request contains the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `nft_id`       | String                     | A unique identifier for the non-fungible token (NFT). |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically.  Do not specify the `ledger_index` as `closed` or `current`; doing so forwards the request to the P2P `rippled` server and the `nft_info` API is not available on `rippled`. (See [Specifying Ledgers][]) |

If you do not specify a ledger version, Clio uses the latest validated ledger.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000",
    "ledger_index": 270,
    "owner": "rG9gdNygQ6npA9JvDFWBoeXbiUcTYJnEnk",
    "is_burned": true,
    "flags": 8,
    "transfer_fee": 0,
    "issuer": "rHVokeuSnjPjz718qdb47bGXBBHNMP3KDQ",
    "nft_taxon": 0,
    "nft_serial": 0,
    "validated": true
  },
  "status": "success",
  "type": "response",
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
    },
    {
      "id": 2002,
      "message": "This server may be out of date"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "nft_id": "00080000B4F4AFC5FBCBD76873F18006173D2193467D3EE70000099B00000000",
    "ledger_index": 269,
    "owner": "rG9gdNygQ6npA9JvDFWBoeXbiUcTYJnEnk",
    "is_burned": false,
    "flags": 8,
    "transfer_fee": 0,
    "issuer": "rHVokeuSnjPjz718qdb47bGXBBHNMP3KDQ",
    "nft_taxon": 0,
    "nft_serial": 0,
    "uri": "https://xrpl.org",
    "validated": true,
    "status": "success"
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    },
    {
      "id": 2002,
      "message": "This server may be out of date"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing an `nft_info` response object with some arrangement of the following fields:

| `Field`                           | Type            | Description          |
|:----------------------------------|:----------------|:---------------------|
| `nft_id`                          | String          | A unique identifier for the non-fungible token (NFT). |
| `ledger_index`                    | Integer         | The [ledger index][] of the most recent ledger version where the state of this NFT was modified, as in the NFT was minted (created), changed ownership (traded), or burned (destroyed). The information returned contains whatever happened most recently compared to the requested ledger. |
| `owner`                           | String          | The account ID of this NFT's owner at this ledger index. |
| `is_burned`                       | Boolean         | Returns `true` if the NFT is burned at this ledger, or `false` otherwise. |
| `flags `                          | Integer         | The flag set of this NFT. |
| `transfer_fee`                    | Integer         | The transfer fee of this NFT. See [NFTokenMint Fields](../../../protocol/transactions/types/nftokenmint.md#nftokenmint-fields) for more information on transfer fees. |
| `issuer`                          | String          | The account ID which denotes the issuer of this NFT. |
| `nft_taxon`                       | Integer         | The NFT’s taxon. |
| `nft_serial`                      | Integer         | The NFT’s sequence number. |
| `uri`                             | String          | The NFT's URI, or an empty string if the NFT does not have a URI. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}Updated in: Clio v2.0.0{% /badge %} |


## Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}

