---
html: nftokenmint.html
parent: transaction-types.html
blurb: Use TokenMint to issue new NFTs.
labels:
  - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFTokenMint
[[Source]](https://github.com/ripple/rippled/blob/xls20/src/ripple/app/tx/impl/NFTokenMint.cpp)
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenMint` transaction creates a non-fungible token and adds it to the relevant [NFTokenPage object][] of the `NFTokenMinter` as an [NFToken][] object. A required parameter to this transaction is the `Token` field specifying the actual token. This transaction is the only opportunity the `NFTokenMinter` has to specify any token fields that are defined as immutable (for example, the `TokenFlags`).


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "NFTokenMint",
  "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "TransferFee": 314,
  "NFTokenTaxon": 0,
  "Flags": 8,
  "Fee": "10",
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ]
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `NFTokenTaxon` | Number | UInt32 | The taxon associated with the token. The taxon is generally a value chosen by the minter of the token. A given taxon can be used for multiple tokens. Taxon identifiers greater than `0xFFFF'FFFF` are disallowed. |
| `Issuer` | String | AccountID | _(Optional)_ The issuer of the token, if the sender of the account is issuing it on behalf of another account. This field must be omitted if the account sending the transaction is the issuer of the `NFToken`. If provided, the issuer's [AccountRoot object][] must have the `NFTokenMinter` field set to the sender of this transaction (this transaction's `Account` field). |
| `TransferFee` | Number | UInt16 | _(Optional)_ The value specifies the fee charged by the issuer for secondary sales of the `NFToken`, if such sales are allowed. Valid values for this field are between 0 and 50000 inclusive, allowing transfer rates of between 0.00% and 50.00% in increments of 0.001. If this field is provided, the transaction MUST have the [`tfTransferable` flag](#nftokenmint-flags) enabled. |
| `URI` | String | Blob | _(Optional)_ Up to 256 bytes of arbitrary data. In JSON, this should be encoded as a string of hexadecimal. You can use the [`xrpl.convertStringToHex`](https://js.xrpl.org/modules.html#convertStringToHex) utility to convert a URI to its hexadecimal equivalent. This is intended to be a URI that points to the data or metadata associated with the NFT. The contents could decode to an HTTP or HTTPS URL, an IPFS URI, a magnet link, immediate data encoded as an [RFC2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397), or even an issuer-specific encoding. The URI is NOT checked for validity. |



## NFTokenMint Flags

Transactions of the NFTokenMint type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name     | Hex Value    | Decimal Value | Description                   |
|:--------------|:-------------|:--------------|:------------------------------|
| `tfBurnable` | `0x00000001` | 1 | Allow the issuer (or an entity authorized by the issuer) to destroy the minted `NFToken`. (The `NFToken`'s owner can _always_ do so.) |
| `tfOnlyXRP` | `0x00000002` | 2 | The minted `NFToken` can only be bought or sold for XRP. This can be desirable if the token has a transfer fee and the issuer does not want to receive fees in non-XRP currencies. |
| `tfTrustLine` | `0x00000004` | 4 | **DEPRECATED** Automatically create [trust lines](trust-lines-and-issuing.html) from the issuer to hold transfer fees received from transferring the minted `NFToken`. The [fixRemoveNFTokenAutoTrustLine amendment][] makes it invalid to set this flag. |
| `tfTransferable` | `0x00000008` | 8 | The minted `NFToken` can be transferred to others. If this flag is _not_ enabled, the token can still be transferred _from_ or _to_ the issuer. |


## Embedding additional information

If you need to specify additional information during minting (for example, details identifying a property by referencing a particular [plat](https://en.wikipedia.org/wiki/Plat), a vehicle by specifying a [VIN](https://en.wikipedia.org/wiki/Vehicle_identification_number), or other object-specific descriptions) you can use a [transaction memo](transaction-common-fields.html#memos-field). Memos are a part of the signed transaction and are available from historical archives, but are not stored in the ledger's state data.

## Issuing on behalf of another account

If you want to issue an NFT for another account there are two things you must do. Given that *Account A* is your account and *Account B* is the account for which you want to mint a NFToken:

1. Set the `NFTokenMinter` account setting on *Account B* to be *Account A*. (This says that *Account B* trusts *Account A* to create NFTs on their behalf.)
2. When you mint the NFToken, set the `Issuer` field to Account B.

### Example of NFTokenMint with an issuer

```json
{
  "TransactionType": "NFTokenMint",
  "Account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Issuer": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "TransferFee": 25000,
  "NFTokenTaxon": 0,
  "Flags": 8,
  "Fee": "10",
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ]
}
```


This transaction assumes that the issuer, `rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2`, has set the `NFTokenMinter` field in its `AccountRoot` to `rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B`, thereby authorizing that account to mint tokens on its behalf.

## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `temBAD_NFTOKEN_TRANSFER_FEE` | The `TransferFee` is not within the acceptable range. |
| `temINVALID_FLAG`             | The `Flags` value has bits enabled that are not allowed or valid flags. If the [fixRemoveNFTokenAutoTrustLine amendment][] is enabled, the `tfTrustLine` flag causes this error. |
| `temMALFORMED`                | The transaction was not validly specified. For example, the `URI` field is longer than 256 bytes. |
| `tecNO_ISSUER`                | The `Issuer` refers to an account that does not exist in the ledger. |
| `tecNO_PERMISSION`            | The account referenced by the `Issuer` field has not authorized this transaction's sender (using the `NFTokenMinter` setting) to mint on their behalf. |
| `tecINSUFFICIENT_RESERVE`     | The owner would not meet the updated [reserve requirement](reserves.html) after minting the token. Note that new `NFToken`s only increase the owner's reserve if it requires a new [NFTokenPage object][], which can each hold up to 32 NFTs. |
| `tecMAX_SEQUENCE_REACHED`     | The `Issuer`'s `MintedNFTokens` field is already at its maximum. This is only possible if 2<sup>32</sup>-1 `NFToken`s have been minted in total by the issuer or on their behalf. |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
