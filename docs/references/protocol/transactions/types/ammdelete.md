---
seo:
    description: Delete an Automated Market Maker with an empty asset pool.
labels:
    - AMM
---
# AMMDelete
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMDelete.cpp "Source")

Delete an empty [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) (AMM) instance that could not be fully deleted automatically.

Normally, an [AMMWithdraw transaction][] automatically deletes an AMM and all associated ledger entries when it withdraws all the assets from the AMM's pool. However, if there are too many trust lines to the AMM account to remove in one transaction, it may stop before fully removing the AMM. Similarly, an AMMDelete transaction removes up to a maximum of 512 trust lines; it may take several AMMDelete transactions to delete all the trust lines and the associated AMM. In all cases, only the last such transaction deletes the AMM and AccountRoot ledger entries.

{% amendment-disclaimer name="AMM" /%}

<!-- TODO: Add {% amendment-disclaimer name="MPTokensV2" mode="updated" /%} badge. -->

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="Trust Line Token/XRP" %}
```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Asset" : {
        "currency" : "XRP"
    },
    "Asset2" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "Fee" : "10",
    "Flags" : 0,
    "Sequence" : 9,
    "TransactionType" : "AMMDelete"
}
```
{% /tab %}

{% tab label="MPT/MPT" %}
```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Asset" : {
        "mpt_issuance_id" : "00002403C84A0A28E0190E208E982C352BBD71B2"
    },
    "Asset2" : {
        "mpt_issuance_id" : "00002710D5F38CCE3B43BD597D1B6CCED4AC2D5C"
    },
    "Fee" : "10",
    "Flags" : 0,
    "Sequence" : 10,
    "TransactionType" : "AMMDelete"
}
```
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field          | JSON Type           | [Internal Type][] | Required? | Description |
|:---------------|:--------------------|:------------------|:----------|:------------|
| `Asset`        | Object              | Issue             | Yes       | The definition for one of the assets in the AMM's pool. The asset can be XRP or a fungible token (see: [Specifying Without Amounts][]). |
| `Asset2`       | Object              | Issue             | Yes       | The definition for the other asset in the AMM's pool. The asset can be XRP or a fungible token (see: [Specifying Without Amounts][]). |


## Error Cases

Besides errors that can occur for all transactions, AMMDelete transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecAMM_NOT_EMPTY`  | The AMM holds assets in its pools, so it cannot be deleted. If you are one of the AMM's liquidity providers, use [AMMWithdraw][] first. |
| `tecINCOMPLETE`     | There were too many associated ledger entries to fully delete, so the transaction removed as many as it could, but the AMM has not been fully deleted. You can send another AMMDelete transaction to continue and possibly finish the job. |
| `temDISABLED`       | At least one of the assets is an MPT, but the [MPTokensV2 amendment][] is not enabled. |
| `terNO_AMM`         | The specified AMM does not exist. (It may have been deleted already, or you may have specified a wrong asset for the AMM you intended.) |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
