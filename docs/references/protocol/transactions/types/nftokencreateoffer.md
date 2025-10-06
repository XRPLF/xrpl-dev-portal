---
seo:
    description: Create an offer to buy or sell an NFT.
labels:
    - Non-fungible Tokens, NFTs
---
# NFTokenCreateOffer
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenCreateOffer.cpp "Source")

Create a new offer to either buy or sell a [non-fungible token (NFT)](../../../../concepts/tokens/nfts/index.md). You can only offer to sell NFTs you own or buy NFTs you don't own.

If successful, the transaction creates a [NFTokenOffer object][]. To complete the sale and change ownership of the NFT, the offer must be accepted using an [NFTokenAcceptOffer transaction][].

{% amendment-disclaimer name="NonFungibleTokensV1_1" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "NFTokenCreateOffer",
    "Account": "rs8jBmmfpwgmrSPgwMsh7CvKRmRt1JTVSX",
    "NFTokenID": "000100001E962F495F07A990F4ED55ACCFEEF365DBAA76B6A048C0A200000007",
    "Amount": "1000000",
    "Flags": 1
}
```

{% tx-example txid="780C44B2EDFF8FC4152B3F7E98D4C435C13DF9BB5498E4BB2D019FCC7EF45BC6" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Owner`       | String              | AccountID         | _(Optional)_ Who owns the corresponding `NFToken`. If the offer is to buy a token, this field must be present and it must be different than the `Account` field (since an offer to buy a token one already holds is meaningless). If the offer is to sell a token, this field must not be present, as the owner is, implicitly, the same as the `Account` (since an offer to sell a token one doesn't already hold is meaningless). |
| `NFTokenID`   | String              | UInt256           | Identifies the `NFToken` object that the offer references. |
| `Amount`      | [Currency Amount][] | Amount            | Indicates the amount expected or offered for the corresponding `NFToken`. The amount must be non-zero, except where this is an offer to sell and the asset is XRP; then, it is legal to specify an amount of zero, which means that the current owner of the token is giving it away, gratis, either to anyone at all, or to the account identified by the `Destination` field. |
| `Expiration`  | Number              | UInt32            | _(Optional)_ Time after which the offer is no longer active, in [seconds since the Ripple Epoch][]. |
| `Destination` | String              | AccountID         | _(Optional)_ If present, indicates that this offer may only be accepted by the specified account. Attempts by other accounts to accept this offer MUST fail. |


## NFTokenCreateOffer Flags

Transactions of the NFTokenCreateOffer type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name       | Hex Value    | Decimal Value | Description                   |
|:----------------|:-------------|:--------------|:------------------------------|
| `tfSellNFToken` | `0x00000001` | `1`           | If enabled, indicates that the offer is a sell offer. Otherwise, it is a buy offer. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                       | Description                               |
|:---------------------------------|:------------------------------------------|
| `temDISABLED`                    | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `temBAD_AMOUNT`                  | The `Amount` field is not valid. For example, the amount was zero for a buy offer, or the amount is denominated in fungible tokens but the `NFToken` has the [`lsfOnlyXRP` flag](../../data-types/nftoken.md#nftoken-flags) enabled. |
| `temBAD_EXPIRATION`              | The specified `Expiration` time is invalid (for example, `0`). |
| `tecDIR_FULL`                    | The sender already owns too many objects in the ledger, or there are already too many offers to buy or sell this token. |
| `tecEXPIRED`                     | The specified `Expiration` time has already passed. |
| `tecFROZEN`                      | The `Amount` is denominated in fungible tokens, but one of the trust lines that would receive tokens from this offer is [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). This could be the seller's trust line or the `NFToken`'s issuer's trust line (if the `NFToken` has a transfer fee). |
| `tecINSUFFICIENT_RESERVE`        | The sender does not have enough XRP to meet the [reserve requirement](../../../../concepts/accounts/reserves.md) after placing this offer. |
| `tecNO_DST`                      | The account specified in the `Destination` field does not exist in the ledger. |
| `tecNO_ENTRY`                    | The `NFToken` is not owned by the expected account. |
| `tecNO_ISSUER`                   | The issuer specified in the `Amount` field does not exist. |
| `tecNO_LINE`                     | The `Amount` field is denominated in fungible tokens, but the `NFToken`'s issuer does not have a trust line for those tokens and the `NFToken` does not have the [`lsfTrustLine` flag](../../data-types/nftoken.md#nftoken-flags) enabled. |
| `tecNO_PERMISSION`               | The `Destination` account blocks incoming NFTokenOffers. {% amendment-disclaimer name="DisallowIncoming" /%}
| `tecUNFUNDED_OFFER`              | For a buy offer, the sender does have the funds specified in the `Amount` field available. If the `Amount` is XRP, this could be due to the reserve requirement; if the `Amount` is denominated in fungible tokens, this could be because they are [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md). |
| `tefNFTOKEN_IS_NOT_TRANSFERABLE` | The `NFToken` has the [`lsfTransferable` flag](../../data-types/nftoken.md#nftoken-flags) disabled and this transaction would not transfer the `NFToken` to or from the issuer. |

## See Also

- [NFTokenOffer entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
