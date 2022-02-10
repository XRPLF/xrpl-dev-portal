---
html: nftokencreateoffer.html
parent: transaction-types.html
blurb: Create an offer to buy or sell NFTs.
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFTokenCreateOffer
{% include '_snippets/nfts-disclaimer.md' %}

Creates either a new _Sell_ offer for an `NFToken` owned by the account executing the transaction, or a new _Buy_ offer for an `NFToken` owned by another account.

If successful, the transaction creates a [NFTokenOffer object][]. Each offer counts as one object towards the [owner reserve](reserves.html) of the account that placed the offer.

## Example {{currentpage.name}} JSON

```json
{
  	"TransactionType": "NFTokenCreateOffer",
  	"Account": "rs8jBmmfpwgmrSPgwMsh7CvKRmRt1JTVSX",
  	"TokenID": "000100001E962F495F07A990F4ED55ACCFEEF365DBAA76B6A048C0A200000007",
  	"Amount": "1000000",
  	"Flags": 1
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Owner`       | String              | AccountID         | _(Optional)_ Who owns the corresponding `NFToken`. If the offer is to buy a token, this field must be present and it must be different than the `Account` field (since an offer to buy a token one already holds is meaningless). If the offer is to sell a token, this field must not be present, as the owner is, implicitly, the same as the `Account` (since an offer to sell a token one doesn't already hold is meaningless). |
| `TokenID`     | String              | Hash256           | Identifies the `NFToken` object that the offer references. |
| `Amount`      | [Currency Amount][] | Amount            | Indicates the amount expected or offered for the corresponding `NFToken`. The amount must be non-zero, except where this is an offer to sell and the asset is XRP; then, it is legal to specify an amount of zero, which means that the current owner of the token is giving it away, gratis, either to anyone at all, or to the account identified by the `Destination` field. |
| `Expiration`  | Number              | UInt32            | _(Optional)_ Indicates the time after which the offer will no longer be valid. The value is the number of [seconds since the Ripple Epoch][]. |
| `Destination` | String              | AccountID         | _(Optional)_ If present, indicates that this offer may only be accepted by the specified account. Attempts by other accounts to accept this offer MUST fail. |


## NFTokenCreateOffer Flags

Transactions of the NFTokenCreateOffer type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name     | Hex Value    | Decimal Value | Description                   |
|:--------------|:-------------|:--------------|:------------------------------|
| `tfSellToken` | `0x00000001` | `1`           | If enabled, indicates that the offer is a sell offer. Otherwise, it is a buy offer. |





<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
