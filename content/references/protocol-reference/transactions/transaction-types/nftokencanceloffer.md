---
html: nftokencanceloffer.html
parent: transaction-types.html
blurb: Cancel existing token offers to buy or sell an NFToken.
labels:
  - NFTs, Non-fungible Tokens
status: not_enabled
---
# NFTokenCancelOffer
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenCancelOffer` transaction can be used to cancel existing token offers created using `NFTokenCreateOffer`.

## Example {{currentpage.name}} JSON

```json
{
  	"TransactionType": "NFTokenCancelOffer",
  	"Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  	"NFTokenOffers": [
      "9C92E061381C1EF37A8CDE0E8FC35188BFC30B1883825042A64309AC09F4C36D"
    ]
}
```

## Permissions

An existing offer, represented by an `NFTokenOffer` object, can be cancelled by:

* The account that originally created the `NFTokenOffer`.
* The account in the `Destination` field of the `NFTokenOffer`, if one is present.
* Any account, if the `NFTokenOffer` specifies an expiration time and the close time of the parent ledger in which the `NFTokenCancelOffer` is included is greater than the expiration time.

This transaction removes the listed `NFTokenOffer` object from the ledger, if present, and adjusts the reserve requirements accordingly. It is not an error if the `NFTokenOffer` cannot be found: if that is the case, the transaction should complete successfully.

{% include '_snippets/tx-fields-intro.md' %}

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenOffers`     | Array     | VECTOR256         | An array of IDs of the `NFTokenOffer` objects to cancel (not the IDs of `NFToken` objects, but the IDs of the `NFTokenOffer` objects). Each entry must be a different [object ID](ledger-object-ids.html) of an [NFTokenOffer](nftokenoffer.html) object; the transaction is invalid if the array contains duplicate entries. |

The transaction can succeed even if one or more of the IDs in the `NFTokenOffers` field do not refer to objects that currently exist in the ledger. (For example, those token offers might already have been deleted.) The transaction fails with an error if one of the IDs points to an object that does exist, but is not a [NFTokenOffer](nftokenoffer.html) object.

It is important to note that if you inadvertently provide a `nft_id` rather than a `nft_offer_index`, you might receive a `tesSUCCESS` response. The reason is that when passed a properly formatted ID value that is not found, the system assumes that the `NFTokenOffer` has already been deleted.

The transaction fails with an error if one of the IDs points to an object that does exist, but is not a [NFTokenOffer](nftokenoffer.html) object.

## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code         | Description                                             |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `temMALFORMED`     | The transaction was not validly formatted. For example, the `NFTokenOffers` array was empty or contained more than the maximum number of offers that can be canceled at one time. |
| `tecNO_PERMISSION` | At least one of the IDs in the `NFTokenOffers` field refers to an object that cannot be canceled. For example, the sender of this transaction is not the owner or `Destination` of the offer, or the object was not an `NFTokenOffer` type object. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
