---
seo:
    description: Returns a list of NFTs issued by a specific account.
labels:
    - Non-fungible Tokens, NFTs
---
# nfts_by_issuer

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/NFTsByIssuer.cpp "Source")

The `nfts_by_issuer` command returns a list of [NFTs](/docs/concepts/tokens/nfts/index.md) that are issued by the specified account. It can optionally filter by taxon. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.1.0" %}New in: Clio v2.1.0{% /badge %}

## Request Format
An example of the request format:

```json
{
    "method": "nfts_by_issuer",
    "issuer": "rLaBCoaMQqXzHDmiGs2Qv2JA2bg3Yvzxyt"
}
```

{% try-it method="nfts_by_issuer" /%}

The request contains the following parameters:

| Field          | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `issuer`       | String - [Address][] | Yes       | Look up NFTs issued by this account. |
| `ledger_hash`  | String - [Hash][]    | No        | The unique hash of a ledger; if provided, only return NFTs issued up to the specified ledger. By default, use the latest validated ledger. |
| `ledger_index` | [Ledger Index][]     | No        | The ledger index of a ledger; if provided, only return NFTs issued up to the specified ledger. By default, use the latest validated ledger. |
| `limit`        | Number               | No        | If provided, limit the number of NFTs to retrieve. The server is not required to honor this value. |
| `marker`       | [Marker][]           | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |
| `nft_taxon`    | Number               | No        | If provided, filter NFTs to ones with this taxon. The default is to return all NFTs from the specified issuer. |


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

| Field       | Type                 | Required? | Description |
|:------------|:---------------------|:----------|-------------|
| `issuer`    | String - [Address][] | Yes       | The address of the specified issuer. |
| `limit`     | Integer              | No        | The `limit`, as specified in the request. |
| `marker`    | Marker               | No        | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `nft_taxon` | Integer              | No        | The `nft_taxon`, as specified in the request. |
| `nfts`      | Array                | Yes       | A list of NFTs issued by the account. The order of the NFTs is not associated with the date the NFTs were minted. Each member of this field is an NFT object with fields in the same format as provided by the [nft_info method][]. |

{% admonition type="warning" name="Caution" %}
If the `nfts` field is an empty array but the `marker` field is provided, there may still be additional NFTs on later pages. To ensure you get all NFTs, continue [paginating][Marker] until the response does not include a `marker` field.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}

