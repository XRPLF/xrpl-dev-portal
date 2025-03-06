---
seo:
    description: Modify a dynamic NFT.
labels:
  - Non-fungible Tokens, NFTs
title:
  - NFTokenModify
---
# NFTokenModify
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenMint.cpp "Source")

`NFTokenModify` is used to change the `URI` field of an NFT to point to a different URI in order to update the supporting data for the NFT. The NFT must have been minted with the `tfMutable` flag set. See [Dynamic Non-Fungible Tokens](../../../../concepts/tokens/nfts/dynamic-nfts.md).

## Example {% $frontmatter.seo.title %} JSON


```json
{
  "TransactionType": "NFTokenModify",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Owner": "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
  "Fee": "10",
  "Sequence": 33,
  "NFTokenID": “0008C350C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5A048C0A300000007",
  "URI": "697066733A2F2F62616679626569636D6E73347A736F6C686C6976346C746D6E356B697062776373637134616C70736D6C6179696970666B73746B736D3472746B652F5665742E706E67"
  }
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type           | [Internal Type][] | Description        |
|:------------------|:--------------------|:------------------|:-------------------|
| `TransactionType` | String              | UINT16            | Type is `NFTokenModify`. |
| `Account`         | String              | AccountID        |  The unique address of either the issuer or an authorized minter of the NFT. |
| `Owner`           | String              | AccountID        | _(Optional)_ Address of the owner of the NFT. If the `Account` and `Owner` are the same address, omit this field. |
| `NFTokenID`       | String              | Hash 256         | Composite field that uniquely identifies the token. |
| `URI`             | String | Blob | _(Optional)_ Up to 256 bytes of arbitrary data. In JSON, this should be encoded as a string of hexadecimal. You can use the [`xrpl.convertStringToHex`](https://js.xrpl.org/modules.html#convertStringToHex) utility to convert a URI to its hexadecimal equivalent. This is intended to be a URI that points to the data or metadata associated with the NFT. The contents could decode to an HTTP or HTTPS URL, an IPFS URI, a magnet link, immediate data encoded as an [RFC 2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397), or even an issuer-specific encoding. The URI is not checked for validity.  If you do not specify a URI, the existing URI is deleted. |
## Error Cases
Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                   | Description |
|:-------------------------|:-------------|
| `tecNO_PERMISSION` | The `tfMutable` flag wasn't enabled, so you can't update the `URI` field. You can also receive this error if the `Account` field isn't an issuer or authorized minter of the NFT.  |
{% raw-partial file="/docs/_snippets/common-links.md" /%}
