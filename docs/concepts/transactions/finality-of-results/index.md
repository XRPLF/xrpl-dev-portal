---
html: finality-of-results.html
parent: transactions.html
seo:
    description: Learn when the outcome of a transaction is final and immutable.
labels:
  - Transaction Sending
  - Blockchain
---
# Finality of Results

The order in which transactions apply to the consensus [ledger](../../ledgers/index.md) is not final until a ledger is closed and the exact transaction set is approved by the [consensus process](../../consensus-protocol/index.md). A transaction that succeeded initially could still fail, and a transaction that failed initially could still succeed. Additionally, a transaction that was rejected by the consensus process in one round could achieve consensus in a later round.

A validated ledger can include successful transactions (`tes` result codes) as well as failed transactions (`tec` result codes). No transaction with any other result is included in a ledger.

For any other result code, it can be difficult to determine if the result is final. The following table summarizes when a transaction's outcome is final, based on the result code from submitting the transaction:

| Result Code     | Finality                                                   |
|:----------------|:-----------------------------------------------------------|
| `tesSUCCESS`    | Final when included in a validated ledger                  |
| Any `tec` code  | Final when included in a validated ledger                  |
| Any `tem` code  | Final unless the protocol changes to make the transaction valid |
| `tefPAST_SEQ`   | Final when another transaction with the same sequence number is included in a validated ledger |
| `tefMAX_LEDGER` | Final when a validated ledger has a [ledger index][Ledger Index] higher than the transaction's `LastLedgerSequence` field, and no validated ledger includes the transaction |

Any other transaction result is potentially not final. In that case, the transaction could still succeed or fail later, especially if conditions change such that the transaction is no longer prevented from applying. For example, trying to send a non-XRP currency to an account that does not exist yet would fail, but it could succeed if another transaction sends enough XRP to create the destination account. A server might even store a temporarily-failed, signed transaction and then successfully apply it later without asking first.

## How can non-final results change?

When you initially submit a transaction, the `rippled` server tentatively applies that transaction to its current open ledger, then returns the tentative [transaction results](../../../references/protocol/transactions/transaction-results/index.md) from doing so. However, the transaction's final result may be very different than its tentative results, for several reasons:

- The transaction may be delayed until a later ledger version, or may never be included in a validated ledger. For the most part, the XRP Ledger follows a principle that all valid transactions should be processed as soon as possible. However, there are exceptions, including:

    - If a proposed transaction has not been relayed to a majority of validators by the time a [consensus round](../../consensus-protocol/index.md) begins, it may be postponed until the next ledger version, to give the remaining validators time to fetch the transaction and confirm that it is valid.

    - If an address sends two different transactions using the same sequence number, at most one of those transactions can become validated. If those transactions are relayed through the network in different paths, a tentatively-successful transaction that some servers saw first may end up failing because the other, conflicting transaction reached a majority of servers first.

    - To protect the network from spam, all transactions must destroy a [transaction cost](../transaction-cost.md) in XRP to be relayed throughout the XRP Ledger peer-to-peer network. If heavy load on the peer-to-peer network causes the transaction cost to increase, a transaction that tentatively succeeded may not get relayed to enough servers to achieve a consensus, or may be [queued](../transaction-queue.md) for later.

    - Temporary internet outages or delays may prevent a proposed transaction from being successfully relayed before the transaction's intended expiration, as set by the `LastLedgerSequence` field. (If the transaction does not have an expiration, then it remains valid and could succeed any amount of time later, which can be undesirable in its own way. See [Reliable Transaction Submission](../reliable-transaction-submission.md) for details.)

    - Combinations of two or more of these factors can also occur.

- The [order transactions apply in a closed ledger](../../ledgers/open-closed-validated-ledgers.md) is usually different than the order those transactions were tentatively applied to a current open ledger; depending on the transactions involved, this can cause a tentatively-successful transaction to fail or a tentatively-failed transaction to succeed. Some examples include:

    - If two transactions would each fully consume the same Offer in the [decentralized exchange](../../tokens/decentralized-exchange/index.md), whichever one comes first succeeds, and the other fails. Since the order in which those transactions apply may change, the one that succeeded can fail and the one that failed can succeed. Since oOffers can be partially executed, they could also still succeed, but to a greater or lesser extent.

    - If a [cross-currency payment](../../payment-types/cross-currency-payments.md) succeeds by consuming an Offer in the decentralized exchange, but a different transaction consumes or creates offers in the same order book, the cross-currency payment may succeed with a different exchange rate than it had when it executed tentatively. If it was a [partial payment](../../payment-types/partial-payments.md), it could also deliver a different amount.

    - A [Payment transaction][] that tentatively failed because the sender did not have enough funds may later succeed because another transaction delivering the necessary funds came first in the canonical order. The reverse is also possible: a transaction that tentatively succeeded may fail because a transaction delivering the necessary funds did not come first after being put into canonical order.

    **Tip:** For this reason, when running tests against the XRP Ledger, be sure to wait for a ledger close in between transactions if you have several accounts affecting the same data. If you are testing against a server in [stand-alone mode][], you must [manually close the ledger](../../../infrastructure/testing-and-auditing/advance-the-ledger-in-stand-alone-mode.md) in such cases.


## See Also

- [Look up Transaction Results](look-up-transaction-results.md)
- [Transaction Results Reference](../../../references/protocol/transactions/transaction-results/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
