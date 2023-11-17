---
html: nfts_by_issuer.html
parent: clio-methods.html
blurb: Retrieve information about the NFTs issued by an account using Clio server's `nfts_by_issuer` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nfts_by_issuer
[[Source]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/IssuerNFTs.cpp "Source")

The `nfts_by_issuer` command asks the Clio server for information about the [NFT](non-fungible-tokens.html)s issued by an account.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "nfts_by_issuer",
  "issuer": "rntiqPjjo8jJWqudGiyi9nRs83TwPEnNyx",
  "taxon": 1877,
  "marker": 4318,
  "limit": 5000
}
```
*JSON-RPC*

```json
{
  "method": "nfts_by_issuer",
  "params": [
    {
      "command": "issuer_nfts",
      "issuer": "rntiqPjjo8jJWqudGiyi9nRs83TwPEnNyx",
      "taxon": 1877,
      "marker": 4318,
      "limit": 5000
    }
  ]
}
```

<!-- MULTICODE_BLOCK_END -->

<!-- To DO: Add an example command to the assets/js/apitool-methods-ws.js file. The WebSocket Tool requires access to a publicly available Clio server.
[Try it! >](websocket-api-tool.html#issuer_nfts)-->

The request contains the following parameters:

| `Field`        | Type   | Description                    |
|:---------------|:------ |:-------------------------------|
| `issuer`       | String | A unique identifier for the account, most commonly the account's address. |
| `marker`       | Marker | Value from a previous paginated response. Resume retrieving data where that response left off. This value is NOT stable if there is a change in the server's range of available ledgers. If you are querying the “validated” ledger, it is possible that new NFTs are created during your paging. |
| `nft_taxon`    | UInt32 | _(Optional)_ Use to filter NFTs that are set to the specified taxon.|
| `ledger_hash`  | String | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `ledger_index` | String or Integer | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `limit`        | UInt32 | _(Optional)_ Limit the number of NFTs to retrieve. The server is not required to honor this value. |

You must specify one of `ledger_index` or `ledger_hash` if you want to fetch from a specific ledger. `ledger_hash` is used if both are provided.

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->
<!--
*WebSocket*

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
    "nft_sequence": 0,
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

*JSON-RPC*

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
    "nft_sequence": 0,
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
-->
<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing an `nfts_by_issuer` response object with some arrangement of the following fields:

| `Field`        | Type   | Description                    |
|:---------------|:------ |:-------------------------------|
| `issuer`       | String | Issuer of the NFTs in the request. |
| `nfts`  | Array <Object> | A list of NFTs issued by an account. It either returns an array of `NFTokenID` List or `NFToken` List. The order of the NFTs is not associated with the minted date. |
| `marker` _(Optional)_ | Marker | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `limit` _(Optional)_ | UInt32 | The `limit`, as specified in the request. |
| `nft_taxon`    | UInt32 | The nft_taxon, as specified in the request.|

**NOTE** It is possible to get back a response where the `nfts` field is empty and a marker is defined. Repeatedly request with the new markers until you receive a response that no longer has a marker. This can happen if you specify a specific ledger and there are tokens that were minted by the account after the specified ledger.

### NFTokenID List

Each record in the `issuer_nfts` array represents one `NFToken` object that has been issued by the account in the request, and has the following fields:

| `Field`        | Type   | Description                     |
|:---------------|:------ |:--------------------------------|
| `nft_id`       | String | `NFToken` issued by the account |

The reason for returning an array of JSON objects rather than an array of Strings is to allow the user to easily switch to `NFToken` List if they decide to fetch more information about NFTs.

### NFToken List

Each member of the `issuer_nfts_` array represents one `NFToken` object that has been issued by the account in the request. It has the following fields:

| `Field`        | Type   | Description                    |
|:---------------|:------ |:-------------------------------|
| `nft_id`       | String | NFToken issued by the account. |   
| `ledger_index` | UInt32 | The `ledger_index` of the most recent ledger version where the state of this NFT was modified, as in the NFT was minted (created), changed ownership (traded), or burned (destroyed). The information returned contains whatever happened most recently compared to the requested ledger. |
| `is_burned`    | Boolean | Returns  _true_  if the NFT is burned at this ledger, or  `false`  otherwise.
| `owner`        | String | The account ID of this NFT's owner at this ledger index. |
| `flags`        | UInt32 | The flag set of this NFT. |
| `transfer_fee` | UInt32 | The transfer fee of this NFT. |
| `nft_taxon`    | UInt32 | The optional taxon of this NFT. |
| `nft_serial`   | UInt32 | The NFT's sequence number. |
| `uri` (Omitted if the NFT is burned at this ledger) | String or null | This field is `null`  if the NFT is not burned at this ledger but does not have a URI. If the NFT is not burned at this ledger and it does have a URI, this field is a string containing the decoded URI of the NFT. |
| `issuer`       | Issuer of this NFT (same as the requested issuer). |

## Possible Errors

* Any of the [universal error types][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/rippled_versions.md' %}
