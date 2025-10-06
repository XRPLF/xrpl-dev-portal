---
seo:
    description: Change global reserve and transaction cost settings.
labels:
    - Fees
---
# SetFee
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Change.cpp "Source")

A `SetFee` [pseudo-transaction](./index.md) marks a change in [transaction cost](../../../../concepts/transactions/transaction-cost.md) or [reserve requirements](../../../../concepts/accounts/reserves.md) as a result of [fee voting](../../../../concepts/consensus-protocol/fee-voting.md).

{% admonition type="info" name="Note" %}You cannot send a pseudo-transaction, but you may find one when processing ledgers.{% /admonition %}

## Example {% $frontmatter.seo.title %} JSON

This transaction has two formats, depending on whether the [XRPFees amendment][] was enabled at the time:

{% tabs %}
{% tab label="Current Format" %}
```json
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFeeDrops": "10",
    "Fee": "0",
    "LedgerSequence": 92508417,
    "ReserveBaseDrops": "1000000",
    "ReserveIncrementDrops": "200000",
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 786494751,
    "ledger_index": 92508417
}
```
{% /tab %}

{% tab label="Legacy Format" %}
```json
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFee": "000000000000000A",
    "Fee": "0",
    "ReferenceFeeUnits": 10,
    "ReserveBase": 20000000,
    "ReserveIncrement": 5000000,
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 439578860,
    "hash": "1C15FEA3E1D50F96B6598607FC773FF1F6E0125F30160144BE0C5CBC52F5151B",
    "ledger_index": 3721729,
}
```
{% /tab %}
{% /tabs %}

{% partial file="/docs/_snippets/pseudo-tx-fields-intro.md" /%}

## {% $frontmatter.seo.title %} Fields

The fields of a SetFee pseudo-transaction depend on whether the [XRPFees amendment][] was enabled at the time. In addition to the [common fields](./index.md), they can use the following:

{% tabs %}
{% tab label="Current Format" %}
| Field                   | JSON Type | [Internal Type][] | Description     |
|:------------------------|:----------|:------------------|:----------------|
| `BaseFeeDrops`          | String    | Amount            | The charge, in drops of XRP, for the reference transaction. (This is the [transaction cost](../../../../concepts/transactions/transaction-cost.md) before scaling for load.) |
| `ReserveBaseDrops`      | String    | Amount            | The base reserve, in drops. |
| `ReserveIncrementDrops` | String    | Amount            | The incremental reserve, in drops. |
| `LedgerSequence`        | Number    | UInt32            | _(Omitted for some historical `SetFee` pseudo-transactions)_ The index of the ledger version where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
{% /tab %}

{% tab label="Legacy Format" %}
| Field               | JSON Type | [Internal Type][] | Description     |
|:--------------------|:----------|:------------------|:----------------|
| `BaseFee`           | String    | UInt64            | The charge, in drops of XRP, for the reference transaction, as hex. (This is the [transaction cost](../../../../concepts/transactions/transaction-cost.md) before scaling for load.) |
| `ReferenceFeeUnits` | Number    | UInt32            | The cost, in fee units, of the reference transaction. |
| `ReserveBase`       | Number    | UInt32            | The base reserve, in drops. |
| `ReserveIncrement`  | Number    | UInt32            | The incremental reserve, in drops |
| `LedgerSequence`    | Number    | UInt32            | _(Omitted for some historical `SetFee` pseudo-transactions)_ The index of the ledger version where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |
{% /tab %}
{% /tabs %}

{% raw-partial file="/docs/_snippets/setfee_uniqueness_note.md" /%}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
