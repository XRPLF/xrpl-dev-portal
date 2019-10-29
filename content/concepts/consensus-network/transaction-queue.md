# Transaction Queue

The `rippled` server uses a transaction queue to help enforce the [open ledger cost](transaction-cost.html#open-ledger-cost). The open ledger cost sets a target number of transactions in a given ledger, and escalates the required transaction cost very quickly when the open ledger surpasses this size. Rather than discarding transactions that cannot pay the escalated transaction cost, `rippled` tries to put them in a transaction queue, which it uses to build the next ledger.

## Transaction Queue and Consensus

The transaction queue plays an important role in selecting the transactions that are included or excluded from a given ledger version in the consensus process. The following steps describe how the transaction queue relates to the [consensus process](consensus.html).

[![Transaction queue and consensus diagram](img/consensus-with-queue.png)](img/consensus-with-queue.png)

1. **Consensus Round 1** - Each validator proposes a set of transactions to be included in the next ledger version. Each also keeps a queue of candidate transactions not currently proposed.

2. **Consensus Round 2** - If a validator removes a transaction from its proposal in later rounds, it adds that transaction to its queue.

3. **Consensus Round N** - The consensus process continues until enough servers agree on a transaction set.

4. **Validation** - Servers confirm that they built the same resulting ledger and declare it validated.

5. **Building the Next Proposal** - Each validator prepares its proposal for the next ledger version, starting with queued transactions.

6. **Adding to the Queue** - If the next proposed ledger is already full, incoming transactions are queued for a later ledger version. (Transactions that pay the [open ledger cost](transaction-cost.html#open-ledger-cost) can still get into the next proposed ledger even if it's "full", but the open ledger cost grows exponentially with each transaction added this way.)

    After this step, the process repeats from the beginning.

**Note:** Technically, several of the steps described in the above process occur in parallel, because each server is always listening for new transactions, and starts preparing its next ledger proposal while the consensus process for the previous ledger version is ongoing.

## Queuing Restrictions

The `rippled` server uses a variety of heuristics to estimate which transactions are "likely to be included in a ledger." The current implementation uses the following rules to decide which transactions to queue:

- Transactions must be properly-formed and [authorized](transaction-basics.html#authorizing-transactions) with valid signatures.
- Transactions with an `AccountTxnID` field cannot be queued.
- A single sending address can have at most 10 transactions queued at the same time.
- To queue a transaction, the sender must have enough XRP for all of the following: [Updated in: rippled 1.2.0][]
    - Destroying the XRP [transaction cost](transaction-cost.html) as specified in the `Fee` fields of all the sender's queued transactions. The total amount among queued transactions cannot be more than the base account reserve (currently 20 XRP). (Transactions paying significantly more than the minimum transaction cost of 0.00001 XRP typically skip the queue and go straight into the open ledger.)
    - Sending the maximum sum of XRP that all the sender's queued transactions could send.
    - Keeping enough XRP to meet the account's [reserve requirements](reserves.html).
- If a transaction affects how the sending address authorizes transactions, no other transactions from the same address can be queued behind it. [New in: rippled 0.32.0][]
- If a transaction includes a `LastLedgerSequence` field, the value of that field must be at least **the current ledger index + 2**.

### Fee Averaging

[New in: rippled 0.33.0][]

If a sending address has one or more transactions queued, that sender can "push" the existing queued transactions into the open ledger by submitting a new transaction with a high enough transaction cost to pay for all of them. Specifically, the new transaction must pay a high enough transaction cost to cover the [open ledger cost](transaction-cost.html#open-ledger-cost) of itself and each other transaction from the same sender before it in the queue. (Keep in mind that the open ledger cost increases exponentially each time a transaction pays it.) The transactions must still follow the other [queuing restrictions](#queuing-restrictions) and the sending address must have enough XRP to pay the transaction costs of all the queued transactions.

This feature helps you work around a particular situation. If you submitted one or more transactions with a low cost that were queued, you cannot send new transactions from the same address unless you do one of the following:

* Wait for the queued transactions to be included in a validated ledger, _or_
* Wait for the queued transactions to be permanently invalidated if the transactions have the [`LastLedgerSequence` field](reliable-transaction-submission.html#lastledgersequence) set, _or_
* [Cancel the queued transactions](cancel-or-skip-a-transaction.html) by submitting a new transaction with the same sequence number and a higher transaction cost.

If none of the above occur, transactions can stay in the queue for a theoretically unlimited amount of time, while other senders can "cut in line" by submitting transactions with higher transaction costs. Since signed transactions are immutable, you cannot increase the transaction cost of the queued transactions to increase their priority. If you do not want to invalidate the previously submitted transactions, fee averaging provides a workaround. If you increase the transaction cost of your new transaction to compensate, you can ensure the queued transactions are included in an open ledger right away.

## Order Within the Queue

Within the transaction queue, transactions are ranked so that transactions paying a higher transaction cost come first. This ranking is not by the transactions' _absolute_ XRP cost, but by costs _relative to the [minimum cost for that type of transaction](transaction-cost.html#special-transaction-costs)_. Transactions that pay the same transaction cost are ranked in the order the server received them. Other factors may also affect the order of transactions in the queue; for example, transactions from the same sender are sorted by their `Sequence` numbers so that they are submitted in order.

The precise order of transactions in the queue decides which transactions get added to the next in-progress ledger version in cases where there are more transactions in the queue than the expected size of the next ledger version. The order of the transactions **does not affect the order the transactions are executed within a validated ledger**. In each validated ledger version, the transaction set for that version executes in [canonical order](consensus.html#calculate-and-share-validations).

**Note:** When `rippled` queues a transaction, the provisional [transaction response code](transaction-results.html) is `terQUEUED`. This means that the transaction is likely to succeed in a future ledger version. As with all provisional response codes, the outcome of the transaction is not final until the transaction is either included in a validated ledger, or [rendered permanently invalid](finality-of-results.html).


## See Also

- [Transaction Cost](transaction-cost.html) for information on why the transaction cost exists and how the XRP Ledger enforces it.
- [Consensus](consensus.html) for a detailed description of how the consensus process approves transactions.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
