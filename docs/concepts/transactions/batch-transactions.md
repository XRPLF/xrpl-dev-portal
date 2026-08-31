---
seo:
    description: Discover how XRPL Batch Transactions streamline multiple blockchain operations into a single secure transaction. Learn about batch modes, execution details, and security considerations. 
labels:
  - Batch
  - Transactions
status: not_enabled
---
# Batch Transactions

XRPL Batch Transactions let you package multiple [transactions](/docs/concepts/transactions) together and execute them as a single unit. It eliminates the risk of partial completion and unexpected outcomes, giving you a more reliable and predictable experience for complex operations. Up to eight transactions can be submitted in a single batch.

{% amendment-disclaimer name="BatchV1_1" /%}

## XRPL Batch Use Cases

Some potential uses for `Batch` include the following.
- All or nothing: You can mint an NFT and create an offer for it in one transaction. If the offer creation fails, the NFT mint is reverted as well.
- Trying out a few offers: Submit multiple offers with different amounts of slippage, but only one will succeed.
- Platform fees: Package platform fees within the transaction itself, simplifying the process.
- Swaps (multi-account): Trustless token/NFT swaps between multiple accounts.
- Withdrawing accounts (multi-account): Attempt a withdrawal from your checking account, and if that fails, withdraw from your savings account instead.

`Batch` transactions are comprised of the _outer transaction_, the wrapper `Batch` transaction itself, and the _inner transactions_, each of which is executed atomically. The precise way that the inner transactions are processed is determined by the batch _mode_.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/LsMMXm7jm1k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## XRPL Batch Transaction Modes

There are four possible batch modes: `ALLORNOTHING`, `ONLYONE`, `UNTILFAILURE`, and `INDEPENDENT`.

### All or Nothing

In `ALLORNOTHING` mode, all inner transactions must succeed for any one of them to succeed.

### Only One

`ONLYONE` mode means that the first transaction to succeed is the only one to succeed. All other transactions either failed or were never tried.

### Until Failure

`UNTILFAILURE` applies all transactions until the first failure. All transactions after the first failure are not applied.

### Independent

All transactions are applied, even if one or more of the inner transactions fail.


## Metadata

Inner transactions are committed separately to the ledger and therefore have separate metadata. This ensures better backward compatibility for legacy systems, so that they can support `Batch` transactions without needing changes to their systems.

For example, a ledger that only has one `Batch` transaction containing 2 inner transactions would look like this:

```
[
  OuterTransaction,
  InnerTransaction1,
  InnerTransaction2
]
```

### Outer Transaction

Each outer transaction contains the metadata for its sequence and fee processing, not for the inner transaction processing. Any error code is only based on the outer transaction processing (for example, sequence and fee), and it returns a tesSUCCESS error even if inner transaction processing fails.

### Inner Transaction

Each inner transaction contains the metadata for its own processing. Only the inner transactions that are actually committed to the ledger are included. This makes it easier for legacy systems to process `Batch` transactions as if they were normal.

There is also a pointer back to the outer transaction (`ParentBatchID`).


## Security for XRPL Batch Transactions

Batch transactions come with additional security considerations.

### Trust Assumptions

Regardless of how many accounts' transactions are included in a `Batch` transaction, all accounts need to sign the collection of transactions.

#### Single Account

In the single account case, the single account must approve all of the transactions it is submitting. No other accounts are involved.

#### Multi Account

The multi-account case is a bit more complicated and is best illustrated with an example. 

Alice and Bob are conducting a trustless swap via a multi-account `Batch`, with Alice providing 1000 XRP and Bob providing 1000 USD. Bob submits the `Batch` transaction, so Alice must provide her part of the swap to him.

If Alice provides a fully autofilled and signed transaction to Bob, Bob can submit Alice's transaction on the ledger without submitting his and receive the 1000 XRP without losing his 1000 USD. Therefore, the inner transactions must be unsigned.

If Alice just signs her part of the Batch transaction, Bob can modify his transaction to only provide 1 USD instead, thereby getting his 1000 XRP at a much cheaper rate. Therefore, the entire Batch transaction (and all its inner transactions) must be signed by all parties.

### Inner Transaction Safety

An inner batch transaction is a special case. It doesn't include a signature or a fee (since those are both included in the outer transaction). Therefore, they must be handled carefully to ensure that someone can't somehow directly submit an inner `Batch` transaction without it being included in an outer transaction.

Inner transactions cannot be broadcast (and won't be accepted if they happen to be broadcast, for example, from a malicious node). They must be generated from the `Batch` outer transaction instead. Inner transactions cannot be directly submitted via the submit RPC.

## Limitations

`Batch` transactions are incompatible with the [simulate method][]. Since `simulate` operates as a dry run for a single transaction only, it cannot simulate the effect of adding inner transactions to the consensus set.

## Integration Considerations

`Batch` transactions have some unique integration considerations:

- Since the outer transaction returns `tesSUCCESS` even when inner transactions fail (see [Metadata](#metadata)), you must check each inner transaction's metadata and result codes to determine its actual outcome.
- If inner transactions are validated, they are included in the same ledger as the outer transaction. If an inner transaction appears in a different ledger, it is likely a fraud attempt.
- Systems that don't specifically handle `Batch` transactions should be able to support them without any changes, since each inner transaction is a valid transaction on its own. All inner transactions that have a `tes` (success) or `tec` result code are accessible via standard transaction-fetching mechanisms such as [`tx`](/docs/references/http-websocket-apis/public-api-methods/transaction-methods/tx.md) and [`account_tx`](/docs/references/http-websocket-apis/public-api-methods/account-methods/account_tx.md).
- In a multi-account `Batch` transaction, the batch signers sign the outer transaction's account, sequence, and batch mode flags, as well as each inner transaction hash; changing any of these afterward invalidates the signatures. The fee is the only part of the outer transaction that is _not_ signed, so the submitter can set it without coordinating with the other parties.

The following sections cover additional recommendations for specific types of integrations.

### Client Libraries

Client libraries that implement `Batch` transaction support should:

- Provide a helper method to calculate the fee for a `Batch` transaction, since the fee includes the sum of all inner transaction fees. See [XRPL Batch Transaction Fees](#xrpl-batch-transaction-fees).
- Provide a helper method to construct and sign multi-account `Batch` transactions, where one party signs the outer transaction and the other parties sign the inner transactions.
- Provide an auto-fill method that sets each inner transaction's `Fee` to `"0"` and the `SigningPubKey` to an empty string (`""`), while omitting the `TxnSignature` field.

### Wallets

Wallets that display or sign `Batch` transactions should:

- Clearly display all inner transactions to users before requesting a signature, so users understand the full scope of what they are approving.
- For multi-account `Batch` transactions, provide a workflow for users to review and sign their portion of the batch, then export it for other parties to sign.
- Warn users if they are signing a `Batch` transaction that includes inner transactions from other accounts, since they are approving the entire batch.
- Display the [batch mode](#xrpl-batch-transaction-modes) and explain its implications.
- Avoid auto-incrementing sequence numbers after successes or failures, since the number of validated transactions depends on the batch mode and which inner transactions succeed. Instead, wait for the outer `Batch` transaction to be validated and check the result of each inner transaction to determine which sequences were consumed.

### Explorers and Indexers

Explorers and indexers that display `Batch` transactions should:

- Display the relationship between outer `Batch` transactions and their inner transactions using the `ParentBatchID` field in the inner transaction metadata.
- Show inner transactions in context with their outer `Batch` transaction, rather than as standalone transactions.
- Consider grouping inner transactions with their outer transaction in transaction lists for clarity.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
