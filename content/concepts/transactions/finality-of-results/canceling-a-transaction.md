---
html: canceling-a-transaction.html
parent: finality-of-results.html
blurb: Understand when and how it's possible to cancel a transaction that has already been sent.
labels:
  - Transaction Sending
---
# Canceling a Transaction

An important and intentional feature of the XRP Ledger is that a [transaction](../index.md)'s outcome is [final](index.md) as soon as it has been incorporated in a [ledger version](../../ledgers/index.md) that is validated by the [consensus process](../../consensus-protocol/index.md).

If a transaction has _not_ yet been included in a validated ledger, it may be possible to effectively cancel it by sending another transaction from the same sending address with the same `Sequence` value. If you do not want the replacement transaction to do anything, send an [AccountSet transaction][] with no options.

**Caution:** There is no guaranteed way to cancel a valid transaction after it has been distributed to the network. The process described here may or may not work depending on factors including how busy the network is, the network topology, and the [transaction cost](../transaction-cost.md) of the proposed transaction.

If the transaction has already been distributed to the network and proposed as a [candidate transaction](../../consensus-protocol/consensus-structure.md#consensus) in servers' consensus proposals, it may be too late to cancel. It is more likely that you can successfully cancel a transaction that is [queued](../transaction-queue.md) or is stuck "in limbo" because its [transaction cost](../transaction-cost.md) is not high enough to meet the network's current requirements. In this case, the replacement transaction can either do nothing, or do the same thing as the transaction to be canceled. The replacement transaction is more likely to succeed if its transaction cost is higher.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](../transaction-cost.md) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.

{% raw-partial file="/_snippets/common-links.md" /%}
