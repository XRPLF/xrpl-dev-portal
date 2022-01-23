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
  	"TokenIDs": "000100001E962F495F07A990F4ED55ACCFEEF365DBAA76B6A048C0A200000007"
}
```

## Permissions

An existing offer, represented by an `NFTokenOffer` object, can be cancelled by:

* The account that originally created the `NFTokenOffer`.
* The account in the `Destination` field of the `NFTokenOffer`, if one is present.
* The issuer of the token identified by the `TokenUID` field in the `NFTokenOffer` object, if the token has the `lsfIssuerCanCancelOffers` flag set.
* Any account, if the `NFTokenOffer` specifies an expiration time and the close time of the parent ledger in which the `NFTokenCancelOffer` is included is greater than the expiration time.

This transaction removes the listed `NFTokenOffer` object from the ledger, if present, and adjusts the reserve requirements accordingly. It is not an error if the `NFTokenOffer` cannot be found: if that is the case, the transaction should complete successfully.

{% include '_snippets/tx-fields-intro.md' %}

| Field           | JSON Type | [Internal Type][] | Description                |
|:----------------|:----------|:------------------|:---------------------------|
| TransactionType | String    | UInt16            | NFTokenCancelOffer transaction type. The integer identifier is 28. |
| TokenOffers     | Array     | VECTOR256         | An array of TokenID objects, each identifying the NFTokenOffer object that should be cancelled by this transaction. It is an error if an entry in this list points to an object that is not an [NFTokenOffer object][]. It is not an error if an entry in this list points to an object that does not exist. |



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
