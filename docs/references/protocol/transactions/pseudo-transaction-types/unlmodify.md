---
seo:
    description: Change the list of trusted validators currently considered offline.
labels:
    - Blockchain
---
# UNLModify
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Change.cpp "Source")

A `UNLModify` [pseudo-transaction](./index.md) marks a change to the [Negative UNL](../../../../concepts/consensus-protocol/negative-unl.md), indicating that a trusted validator has gone offline or come back online.

{% admonition type="info" name="Note" %}You cannot send a pseudo-transaction, but you may find one when processing ledgers.{% /admonition %}

{% amendment-disclaimer name="NegativeUNL" /%}

## Example {% $frontmatter.seo.title %} JSON

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

{% partial file="/docs/_snippets/pseudo-tx-fields-intro.md" /%}

| Name                 | JSON Type | [Internal Type][] | Description           |
|:---------------------|:----------|:------------------|:----------------------|
| `TransactionType`    | String    | UInt16            | The value `0x0066`, mapped to the string `UNLModify`, indicates that this object is an `UNLModify` pseudo-transaction. |
| `LedgerSequence`     | Number    | UInt32            | The [ledger index][] where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
| `UNLModifyDisabling` | Number    | UInt8             | If `1`, this change represents adding a validator to the Negative UNL. If `0`, this change represents removing a validator from the Negative UNL. (No other values are allowed.) |
| `UNLModifyValidator` | String    | Blob              | The validator to add or remove, as identified by its master public key. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
