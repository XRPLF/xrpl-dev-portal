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


## Example {% $frontmatter.seo.title %} JSON

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

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field          | JSON Type           | [Internal Type][] | Required? | Description |
|:---------------|:--------------------|:------------------|:----------|:------------|
| `Asset`        | Object              | Issue             | Yes       | The definition for one of the assets in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
| `Asset2`       | Object              | Issue             | Yes       | The definition for the other asset in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |


## Error Cases

Besides errors that can occur for all transactions, AMMCreate transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecAMM_NOT_EMPTY`  | The AMM holds assets in its pools, so it cannot be deleted. If you are one of the AMM's liquidity providers, use [AMMWithdraw][] first. |
| `tecINCOMPLETE`     | There were too many associated ledger entries to fully delete, so the transaction removed as many as it could, but the AMM has not been fully deleted. You can send another AMMDelete transaction to continue and possibly finish the job. |
| `terNO_AMM`         | The specified AMM does not exist. (It may have been deleted already, or you may have specified a wrong asset for the AMM you intended.) |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
