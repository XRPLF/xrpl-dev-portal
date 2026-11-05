---
seo:
    description: Vote on the trading fee for an Automated Market Maker.
labels:
    - AMM
    - DEX
requiredAmendment: AMM
txIcon: modify
---
# AMMVote
{% source-link path="src/libxrpl/tx/transactors/dex/AMMVote.cpp" /%}

Vote on the trading fee for an [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) instance. Up to 8 accounts can vote in proportion to the amount of the AMM's LP Tokens they hold. Each new vote re-calculates the AMM's trading fee based on a weighted average of the votes.

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
    "Flags" : 2147483648,
    "Sequence" : 8,
    "TradingFee" : 600,
    "TransactionType" : "AMMVote"
}
```

{% tx-example txid="BE72A46233F91C71030DC88D8D86077D37FD98223E9114A46180C09FC5C11E5B" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field        | JSON Type | [Internal Type][] | Required? | Description |
|:-------------|:----------|:------------------|:----------|:------------|
| `Asset`      | Object    | Issue             | Yes       | The definition for one of the assets in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
| `Asset2`     | Object    | Issue             | Yes       | The definition for the other asset in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
| `TradingFee` | Number    | UInt16            | Yes       | The proposed fee to vote for, in units of 1/100,000; a value of 1 is equivalent to 0.001%. The maximum value is 1000, indicating a 1% fee. |

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | The AMM has no assets in its pool. In this state, you can only delete the AMM or fund it with a new deposit. |
| `tecAMM_INVALID_TOKENS` | The sender cannot vote because they do not hold any of this AMM's LP Tokens. |
| `temBAD_FEE`            | The `TradingFee` from this transaction is not valid. |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |

If all eight vote slots are full and the sender holds fewer LP Tokens than the existing voter with the fewest LP Tokens, the transaction succeeds with [`tesSUCCESS`](../transaction-results/tes-success.md), but doesn't record the sender's vote. The same happens if the sender holds the same amount of LP Tokens as that voter and votes for a trading fee that is lower than or equal to that voter's. In either case, the transaction still recalculates the existing votes and the AMM's trading fee based on the voters' current LP Token balances. To confirm that your vote was recorded, check the `VoteSlots` field of the [AMM entry][] after the transaction is validated.

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
