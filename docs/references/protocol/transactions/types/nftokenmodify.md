---
seo:
    description: Modify a dynamic NFT.
labels:
    - Non-fungible Tokens, NFTs
---
# NFTokenModify
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenModify.cpp "Source")

Change the `URI` field of a [dynamic NFT](../../../../concepts/tokens/nfts/dynamic-nfts.md) to update the supporting data for the NFT. Only the issuer, or their authorized minter, can modify an NFT, and only if it was minted with the **Mutable** flag enabled.

{% amendment-disclaimer name="DynamicNFT" /%}

## Example {% $frontmatter.seo.title %} JSON


```json
{
  "TransactionType": "NFTokenModify",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Owner": "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
  "Fee": "10",
  "Sequence": 33,
  "NFTokenID": "0008C350C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5A048C0A300000007",
  "URI": "697066733A2F2F62616679626569636D6E73347A736F6C686C6976346C746D6E356B697062776373637134616C70736D6C6179696970666B73746B736D3472746B652F5665742E706E67"
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type            | [Internal Type][] | Required? | Description |
|:------------------|:---------------------|:------------------|:----------|:------------|
| `Owner`           | String - [Address][] | AccountID         | No        | Address of the owner of the NFT. If the `Account` and `Owner` are the same address, omit this field. |
| `NFTokenID`       | String - Hexadecimal | UInt256           | Yes       | The unique identfier of the NFT to modify. |
| `URI`             | String - Hexadecimal | Blob              | No        | Up to 256 bytes of arbitrary data. In JSON, this should be encoded as a string of hexadecimal. You can use the [`xrpl.convertStringToHex`](https://js.xrpl.org/modules.html#convertStringToHex) utility to convert a URI to its hexadecimal equivalent. This is intended to be a URI that points to the data or metadata associated with the NFT. The contents could decode to an HTTP or HTTPS URL, an IPFS URI, a magnet link, immediate data encoded as an [RFC 2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397), or even an issuer-specific encoding. The URI is not checked for validity.  If you do not specify a URI, the existing URI is deleted. |

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code         | Description |
|:-------------------|:------------|
| `tecNO_PERMISSION` | The `tfMutable` flag wasn't enabled, so you can't update the `URI` field. You can also receive this error if the `Account` field isn't an issuer or authorized minter of the NFT.  |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
