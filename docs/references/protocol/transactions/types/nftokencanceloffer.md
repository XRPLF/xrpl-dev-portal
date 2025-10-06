---
seo:
    description: Cancel offers to buy or sell an NFT.
labels:
    - NFTs, Non-fungible Tokens
---
# NFTokenCancelOffer
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenCancelOffer.cpp "Source")

Cancel an offer to buy or sell a [non-fungible token (NFT)](../../../../concepts/tokens/nfts/index.md).

{% amendment-disclaimer name="NonFungibleTokensV1_1" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
      "TransactionType": "NFTokenCancelOffer",
      "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "NFTokenOffers": [
      "9C92E061381C1EF37A8CDE0E8FC35188BFC30B1883825042A64309AC09F4C36D"
    ]
}
```

{% tx-example txid="9FF6366C19F762AE3479DC01390CDE17F1055EFF0C52A28B8ACF0CC11AEF0CC5" /%}

## Permissions

An existing offer, represented by an `NFTokenOffer` object, can be cancelled by:

* The account that originally created the `NFTokenOffer`.
* The account in the `Destination` field of the `NFTokenOffer`, if one is present.
* Any account, if the `NFTokenOffer` specifies an expiration time and the close time of the parent ledger in which the `NFTokenCancelOffer` is included is greater than the expiration time.

This transaction removes the listed `NFTokenOffer` object from the ledger, if present, and adjusts the reserve requirements accordingly. It is not an error if the `NFTokenOffer` cannot be found: if that is the case, the transaction should complete successfully.

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenOffers`   | Array     | Vector256         | An array of IDs of the `NFTokenOffer` objects to cancel (not the IDs of `NFToken` objects, but the IDs of the `NFTokenOffer` objects). Each entry must be a different [object ID](../../ledger-data/common-fields.md) of an [NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md) object; the transaction is invalid if the array contains duplicate entries. |

The transaction can succeed even if one or more of the IDs in the `NFTokenOffers` field do not refer to objects that currently exist in the ledger. (For example, those token offers might already have been deleted.) The transaction fails with an error if one of the IDs points to an object that does exist, but is not a [NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md) object.

It is important to note that if you inadvertently provide a `nft_id` rather than a `nft_offer_index`, you might receive a `tesSUCCESS` response. The reason is that when passed a properly formatted ID value that is not found, the system assumes that the `NFTokenOffer` has already been deleted.

The transaction fails with an error if one of the IDs points to an object that does exist, but is not a [NFTokenOffer](../../ledger-data/ledger-entry-types/nftokenoffer.md) object.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code         | Description                                             |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `temMALFORMED`     | The transaction was not validly formatted. For example, the `NFTokenOffers` array was empty or contained more than the maximum number of offers that can be canceled at one time. |
| `tecNO_PERMISSION` | At least one of the IDs in the `NFTokenOffers` field refers to an object that cannot be canceled. For example, the sender of this transaction is not the owner or `Destination` of the offer, or the object was not an `NFTokenOffer` type object. |

## See Also

- [NFTokenOffer entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
