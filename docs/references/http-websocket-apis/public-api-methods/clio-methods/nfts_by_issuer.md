---
html: nfts_by_issuer.html
parent: clio-methods.html
seo:
    description: Retrieve the history of ownership and transfers for the specified NFT using Clio server's `nft_history` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nfts_by_issuer

[[Source]](https://github.com/XRPLF/clio/blob/4a5cb962b6971872d150777881801ce27ae9ed1a/src/rpc/handlers/NFTHistory.cpp "Source")

`nfts_by_issuer` returns a list of NFTokens that are issued by the specified account. It can optionally filter by taxon. {% badge href="https://github.com/XRPLF/clio/releases/tag/1.1.0" %}New in: Clio v2.1.0{% /badge %}

## Request Format
An example of the request format:

```json
{
  "method": "nfts_by_issuer",
  "issuer": "rLaBCoaMQqXzHDmiGs2Qv2JA2bg3Yvzxyt"
}
```

<!-- To DO: Add an example command to the assets/js/apitool-methods-ws.js file. The WebSocket Tool requires access to a publicly available Clio server.
[Try it! >](websocket-api-tool.html#nft_history)-->

The request contains the following parameters:

| `Field`        | Type    | Description                    |
|:---------------|:--------|:-------------------------------|
| `issuer`       | String  | A unique identifier for the account, most commonly the account's address.  |
| `marker`       | Marker  | Value from a previous paginated response. Resume retrieving data where that response left off. This value is NOT stable if there is a change in the server's range of available ledgers; meaning if you are querying the “validated” ledger it is possible that new NFTs are created during your paging. |
| `nft_taxon`    | Integer | _(Optional)_ Use to filter NFTs issued by this issuer that have this taxon. |
| `ledger_hash`  | String  | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `ledger_index` | String or Integer | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `limit`        | Integer | _(Optional)_ Limit the number of NFTs to retrieve. The server is not required to honor this value.|


**Note** If you do not specify a ledger version, Clio uses the latest validated ledger.

## Response Format

An example of a successful response:

```json
{"result":{
  "nft_id":"00082710D16560292CA49840AE2DDD7A2CAA50C386BC1B6704F1BB1A004D027F","ledger_index":5046924,"owner":"rLaBCoaMQqXzHDmiGs2Qv2JA2bg3Yvzxyt",
  "is_burned":false,
  "flags":8,
  "transfer_fee":10000,
  "issuer":"rLaBCoaMQqXzHDmiGs2Qv2JA2bg3Yvzxyt",
  "nft_taxon":0,"nft_serial":5046911,"validated":true,"uri":"697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"},"id":1,"status":"success","type":"response","warnings":[{"id":2001,"message":"This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"}]
}
```

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `issuer`           | String                     | Issuer's account ID.       |
| `nfts`             | Array&lt;Object&gt;              | A list of NFTs issued by the account. The order of the NFTs is not associated with the date the NFTs were minted. |
| `marker`           | Marker                     | _(Optional)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. If this field is not returned, you know that you no longer need to make calls to this API. |
| `limit`            | Integer                    | The `limit`, as specified in the request. |
| `nft_taxon`        | Integer                    | The `nft_taxon` as specified in the request. |


For definitions of the fields returned in the `tx` object, see [Transaction Metadata](../../../protocol/transactions/metadata.md).

Note:You might get back a response where the `nfts` field is empty but a marker is defined. You need to repeatedly request with the new markers until you receive a response that no longer has a marker. This can happen if you specify a specific ledger and there are tokens that were minted by the account after the specified ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

