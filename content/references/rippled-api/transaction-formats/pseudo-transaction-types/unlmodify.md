---
html: unlmodify.html
parent: pseudo-transaction-types.html
status: not_enabled
blurb: Change the list of trusted validators currently considered offline.
---
# UNLModify

_(Requires the [NegativeUNL amendment][] :not_enabled:)_

A `UNLModify` [pseudo-transaction](pseudo-transaction-types.html) marks a change to the [Negative UNL](negative-unl.html), indicating that a trusted validator has gone offline or come back online.

**Note:** You cannot send a pseudo-transaction, but you may find one when processing ledgers.

## Example {{currentpage.name}} JSON

```json
{
  "Account": "",
  "Fee": "0",
  "LedgerSequence": 1600000,
  "Sequence": 0,
  "SigningPubKey": "",
  "TransactionType": "UNLModify",
  "UNLModifyDisabling": 1,
  "UNLModifyValidator": "ED6629D456285AE3613B285F65BBFF168D695BA3921F309949AFCD2CA7AFEC16FE",
}
```

## {{currentpage.name}} Fields

{% include '_snippets/pseudo-tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Name                 | JSON Type | [Internal Type][] | Description           |
|:---------------------|:----------|:------------------|:----------------------|
| `TransactionType`    | String    | UInt16            | The value `0x0066`, mapped to the string `UNLModify`, indicates that this object is an `UNLModify` pseudo-transaction. |
| `LedgerSequence`     | Number    | UInt32            | The [ledger index][] where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
| `UNLModifyDisabling` | Number    | UInt8             | If `1`, this change represents adding a validator to the Negative UNL. If `0`, this change represents removing a validator from the Negative UNL. (No other values are allowed.) |
| `UNLModifyValidator` | String    | Blob              | The validator to add or remove, as identified by its master public key. |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
