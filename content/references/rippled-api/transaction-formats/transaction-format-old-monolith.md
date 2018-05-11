# Transactions Overview


### Reliable Transaction Submission

Reliably submitting transactions is the process of achieving both of the following:

* Idempotency - A transaction should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To have both qualities when submitting a transaction, an application should:

1. Construct and sign the transaction first, including a [`LastLedgerSequence`](#lastledgersequence) parameter that gives the transaction a limited lifespan.
2. Persist details of the transaction before submitting.
3. Submit the transaction.
4. Confirm that the transaction was either included in a validated ledger, or that it has expired due to `LastLedgerSequence`.
5. If a transaction fails or expires, you can modify and resubmit it.

Main article: [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html)



### Canceling or Skipping a Transaction

An important and intentional feature of the XRP Ledger is that a transaction is final as soon as it has been incorporated in a validated ledger.

However, if a transaction has not yet been included in a validated ledger, you can effectively cancel it by rendering it invalid. Typically, this means sending another transaction with the same `Sequence` value from the same account. If you do not want the replacement transaction to do anything, send an [AccountSet](#accountset) transaction with no options.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](#transaction-cost) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.






# Transaction Results

## Looking up Transaction Results

To see the final result of a transaction, use the [tx method][], [account_tx method][], or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

| Field                  | Value   | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| meta.TransactionResult | String  | A code that categorizes the result, such as `tecPATH_DRY` |
| validated              | Boolean | Whether or not this result comes from a validated ledger. If `false`, then the result is provisional. If `true`, then the result is final. |

```js
    "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "meta": {
      ...
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
```
