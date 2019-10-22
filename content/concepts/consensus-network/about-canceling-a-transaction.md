# About Canceling a Transaction

An important and intentional feature of the XRP Ledger is that a [transaction](transaction-basics.html)'s outcome is [final](finality-of-results.html) as soon as it has been incorporated in a [ledger version](ledgers.html) that is validated by the [consensus process](consensus.html).

If a transaction has _not_ yet been included in a validated ledger, it may be possible to effectively cancel it by sending another transaction from the same sending address with the same `Sequence` value. If you do not want the replacement transaction to do anything, send an [AccountSet transaction][] with no options.

**Caution:** There is no guaranteed way to cancel a valid transaction after it has been distributed to the network. The process described here may or may not work depending on a number of factors including how busy the network is, the network topology, and the [transaction cost](transaction-cost.html) of the proposed transaction.

If the transaction has already been distributed to the network and proposed as a [candidate transaction](consensus.html#consensus-1) in servers' consensus proposals, it may be too late to cancel. It is more likely that you can successfully cancel a transaction that is [queued](transaction-queue.html) or is stuck "in limbo" because its [transaction cost](transaction-cost.html) is not high enough to meet the network's current requirements. In this case, the replacement transaction can either do nothing, or do the same thing as the transaction to be canceled. The replacement transaction is more likely to succeed if its transaction cost is higher.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](transaction-cost.html) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
