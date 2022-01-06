---
html: nftokencreateoffer.html
parent: transaction-types.html
blurb: Create an offer to buy or sell NFTs.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# `NFTokenCreateOffer` transaction
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenCreateOffer` transaction creates either a new _Sell_ offer for an `NFToken` owned by the account executing the transaction, or a new _Buy_ offer for an `NFToken` owned by another account.

Each offer costs one incremental reserve.

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

## `NFTokenCreateOffer` Fields

<table>
  <tr>
   <td><strong>Field Name</strong>
   </td>
   <td><strong>Required?</strong>
   </td>
   <td><strong>JSON Type</strong>
   </td>
   <td><strong>Internal Type</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT16
   </td>
   <td>Indicates the new transaction type <code>NFTokenCreateOffer</code>. The integer identifier is <code>27</code>.
   </td>
  </tr>
  <tr>
   <td><code>Account</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>AccountID
   </td>
   <td>Indicates the <code>AccountID</code> of the account that initiated the transaction.
   </td>
  </tr>
  <tr>
   <td><code>Owner</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>Account ID
   </td>
   <td>Indicates the <code>AccountID</code> of the account that owns the corresponding <code>NFToken</code>.
<ul>

<li>
If the offer is to buy a token, this field must be present and it must be different than <code>Account</code> (since an offer to buy a token one already holds is meaningless).

<li>If the offer is to sell a token, this field must not be present, as the owner is, implicitly, the same as <code>Account</code> (since an offer to sell a token one doesn't already hold is meaningless).
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><code>TokenID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>Hash256
   </td>
   <td>Identifies the <code>TokenID</code> of the <code>NFToken</code> object that the offer references.
   </td>
  </tr>
  <tr>
   <td><code>Amount</code>
   </td>
   <td>Yes
   </td>
   <td>Currency Amount
   </td>
   <td>AMOUNT
   </td>
   <td>Indicates the amount expected or offered for the <code>Token</code>.
<p>
The amount must be non-zero, except where this is an offer to sell and the asset is XRP; then, it is legal to specify an amount of zero, which means that the current owner of the token is giving it away, gratis, either to anyone at all, or to the account identified by the <code>Destination</code> field.
   </td>
  </tr>
  <tr>
   <td><code>Expiration</code>
   </td>
   <td>No
   </td>
   <td>number
   </td>
   <td>UINT32
   </td>
   <td>Indicates the time after which the offer will no longer be valid. The value is the number of seconds since the <a href="https://xrpl.org/basic-data-types.html#specifying-time">Ripple Epoch</a>.
   </td>
  </tr>
  <tr>
   <td><code>Destination</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>AccountID
   </td>
   <td>If present, indicates that this offer may only be accepted by the specified account. Attempts by other accounts to accept this offer MUST fail.
<p>
If succesful, <code>NFTokenCreateOffer</code> transaction results in the creation of <code>NFTokenOffer</code> object.
   </td>
  </tr>
  <tr>
   <td><code>Flags</code>
   </td>
   <td>Yes
   </td>
   <td>number
   </td>
   <td>UINT32
   </td>
   <td>A set of flags that specifies options or controls the behavior of the transaction. The flag is defined in the table below.
   </td>
  </tr>
</table>



## `NFTokenCreateOffer` Flags


<table>
  <tr>
   <td><strong>Flag Name</strong>
   </td>
   <td><strong>Flag Value</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>tfSellToken</code>
   </td>
   <td><code>0x00000001</code>
   </td>
   <td>If set, indicates that the offer is a sell offer. Otherwise, it is a buy offer.
   </td>
  </tr>
</table>


Note that the `Flags` field includes both transaction-specific and generic flags; all currently valid generics flags (for example, `tfFullyCanonicalSig`) are applicable, but not listed here.

The transactor does not allow unknown flags to be set.







<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
