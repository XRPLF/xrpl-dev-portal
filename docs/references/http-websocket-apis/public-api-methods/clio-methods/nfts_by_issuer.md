---
html: nfts_by_issuer.html
parent: clio-methods.html
seo:
    description: Retrieve the history of ownership and transfers for the specified NFT using Clio server's `nft_history` API.
labels:
  - Non-fungible Tokens, NFTs
---
# nfts_by_issuer

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/NFTsByIssuer.cpp "Source")

`nfts_by_issuer` returns a list of NFTokens that are issued by the specified account. It can optionally filter by taxon. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" %}New in: Clio v2.1.0{% /badge %}

## Request Format
An example of the request format:

```json
{
  "method": "nfts_by_issuer",
  "issuer": "rLaBCoaMQqXzHDmiGs2Qv2JA2bg3Yvzxyt"
}
```

[Try it! >](/resources/dev-tools/websocket-api-tool#nfts_by_issuer)

The request contains the following parameters:

| `Field`        | Type    | Description                    |
|:---------------|:--------|:-------------------------------|
| `issuer`       | String  | A unique identifier for the account, most commonly the account's address.  |
| `marker`       | Marker  | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. This value is NOT stable if there is a change in the server's range of available ledgers; meaning if you are querying the “validated” ledger it is possible that new NFTs are created during your paging. |
| `nft_taxon`    | Integer | _(Optional)_ Use to filter NFTs issued by this issuer that have this taxon. |
| `ledger_hash`  | String  | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `ledger_index` | String or Integer | _(Optional)_ Use to look for NFTs issued up to the provided ledger. If not provided, the server uses the current ledger. |
| `limit`        | Integer | _(Optional)_ Limit the number of NFTs to retrieve. The server is not required to honor this value.|


**Note** If you do not specify a ledger version, Clio uses the latest validated ledger.

## Response Format

An example of a successful response:

```json
{
   "result": {
      "issuer": "rfXeQv31yWMrhhPxMHZRzQqhw5mQrcuici",
      "limit": 50,
      "ledger_index": 1534,
      "nfts": [
         {
            "nft_id": "00080000479C76BC5174816A938ABF667E67D851140BFE03F068FA97000005FB",
            "ledger_index": 1533,
            "owner": "rfXeQv31yWMrhhPxMHZRzQqhw5mQrcuici",
            "is_burned": false,
            "uri": "",
            "flags": 8,
            "transfer_fee": 0,
            "issuer": "rfXeQv31yWMrhhPxMHZRzQqhw5mQrcuici",
            "nft_taxon": 1,
            "nft_serial": 1531
         }
      ],
      "validated": true,
      "status": "success"
   },
   "warnings": [
      {
         "id": 2001,
         "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
      }
   ]
}
```

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`            | Type                       | Description                |
|:-------------------|:---------------------------|:---------------------------|
| `issuer`           | String                     | Issuer's account ID.       |
| `nfts`             | Array&lt;Object&gt;              | A list of NFTs issued by the account. The order of the NFTs is not associated with the date the NFTs were minted. |
| `marker`           | Marker                     | _(Optional)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. If this field is not returned, you know that you no longer need to make calls to this API. |
| `limit`            | Integer                    | The `limit`, as specified in the request. |
| `nft_taxon`        | Integer                    | _(Optional)_ The `nft_taxon` as specified in the request. |

The format of each NFT in the `nfts` array is the same as the response to an [`nft_info`](nft_info.md) request.

For definitions of the fields returned in the `tx` object, see [Transaction Metadata](../../../protocol/transactions/metadata.md).

Note:You might get back a response where the `nfts` field is empty but a marker is defined. You need to repeatedly request with the new markers until you receive a response that no longer has a marker. This can happen if you specify a specific ledger and there are tokens that were minted by the account after the specified ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

