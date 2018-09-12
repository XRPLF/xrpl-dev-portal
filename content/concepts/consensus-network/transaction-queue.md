# Transaction Queue

The `rippled` server uses a transaction queue to help enforce the [open ledger cost](transaction-cost.html#open-ledger-cost). The open ledger cost sets a target number of transactions in a given ledger, and escalates the required transaction cost very quickly when the open ledger surpasses this size. Rather than discarding transactions that cannot pay the escalated transaction cost, `rippled` tries to put them in a transaction queue, which it uses to build the next ledger.

## Order Within the Queue

Within the transaction queue, transactions are ranked so that transactions paying a higher transaction cost come first. This ranking is not by the transactions' _absolute_ XRP cost, but by their _[fee levels](transaction-cost.html#fee-levels)_ which are relative to the [minimum cost for that type of transaction](transaction-cost.html#special-transaction-costs). Other factors may also affect the order of transactions in the queue; for example, transactions from the same sender are sorted by their `Sequence` numbers so that they are submitted in order.

## Transaction Queue and Consensus

The transaction queue plays an important role in selecting the transactions that are included or excluded from a given ledger version in the consensus process. The following steps describe how the transaction queue relates to the [consensus process](consensus.html).

{% include '_snippets/consensus-q-diagram.html' %}
<!--_ -->

**Note:** Technically, several of the steps described in the above process occur in parallel, because each server is always listening for new transactions, and starts preparing its next ledger proposal while the consensus process for the previous ledger version is ongoing.

## See Also

- [Transaction Cost](transaction-cost.html)
    - [Queued Transactions](transaction-cost.html#queued-transactions)
- [Consensus](consensus.html) for a detailed description of how the consensus process approves transactions.
