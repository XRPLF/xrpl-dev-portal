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

{% amendment-disclaimer name="Batch" /%}

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

## XRPL Raw Transactions Object

The `RawTransactions` object is a container for the list of transactions to be applied. You can include up to eight transactions in a single batch. The transactions can come from one account or multiple accounts.

Each inner transaction:

- Must set the `tfInnerBatchTxn` flag.
- Must not have a fee. It must use a fee value of _0_.
- Must not be signed (the global transaction is already signed by all relevant parties). It should instead have an empty string (`""`) in the `SigningPubKey` field and must not include the `TxnSignature` or `Signers` fields.

A transaction is considered a failure if it receives any result that is not `tesSUCCESS`.

### Transaction Common Flag

`Batch` adds a global transaction flag.

| Flag Name         |	Value      |
|-------------------|------------|
| `tfInnerBatchTxn`	| 0x40000000 |

This flag is only used if a transaction is an inner transaction in a Batch transaction. This signifies that the transaction isn't signed. Any normal transaction that includes this flag is rejected.

### BatchSigners

This field is included if the account is signing with multi-sign (as opposed to a single signature). It operates equivalently to the `Signers` field used in standard transaction multi-sign. This field holds the signatures for the `Flags` field and the hashes of the transactions in `RawTransactions`. It is only needed if multiple accounts' transactions are included in the `Batch` transaction; otherwise, the normal transaction signature provides the same security guarantees.

This field must be provided if more than one account has inner transactions included in the Batch. In that case, this field must contain signatures from all accounts whose inner transactions are included, excluding the account signing the outer transaction (if applicable).

#### Fields Used for XRPL Batch Transactions

Each object in this array contains the following fields:

| Field Name	  | Required?	| JSON Type	| Internal Type |
|---------------|-----------|-----------|---------------|
| Account	      | yes       |	string	  | STAccount     |
| SigningPubKey	|	no        | string    | STBlob        |
| TxnSignature  | no        | string    | STBlob        |
| Signers		    | no        | array	    | STArray       |

Either the `SigningPubKey` and `TxnSignature` fields must be included, or the `Signers` field.

#### Account

This is an account that has at least one inner transaction.

#### SigningPubKey and TxnSignature

These fields are included if the account is signing with a single signature (as opposed to multi-sign). They sign the `Flags` field and the hashes of the transactions in `RawTransactions`.

#### Signers

This field is included if the account is signing with multi-sign (as opposed to a single signature). It operates equivalently to the `Signers` field used in standard transaction multi-sign. This field holds the signatures for the `Flags` field and the hashes of the transactions in `RawTransactions`.

## XRPL Batch Transaction Fees

The fee for the outer transaction is twice the base fee (a total of 20 drops when there is no fee escalation), plus the sum of the transaction fees of all the inner transactions (which incorporates factors like higher fees for `multisign` or `AMMCreate`), plus an additional base fee amount for each additional signature in the transaction (for example, from `BatchSigners`). Expressed as an equation:

2 * (Base Fee) + SUM(Inner Transaction Fees) + An additional Base Fee for each additional signature

The fees for the individual inner transactions are paid in the outer transaction rather than the inner transactions themselves, to ensure that fee escalation is calculated on the total cost of the batch transaction and not just the overhead.

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

## Transaction Common Fields

This standard doesn't add any new fields to the [transaction common fields](/docs/references/protocol/transactions/common-fields.md), but it does add another global transaction flag:

| Flag Name	      | Value      |
|-----------------|------------|
| tfInnerBatchTxn	| 0x40000000 |

This flag should be used only if a transaction is an inner transaction in a `Batch` transaction. This signifies that the transaction shouldn't be signed. Any normal transaction that includes this flag should be rejected.

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

## Integration Considerations

`Batch` transactions have some unique integration considerations:

- Since the outer transaction returns `tesSUCCESS` even when inner transactions fail (see [Metadata](#metadata)), you must check each inner transaction's metadata and result codes to determine its actual outcome.
- If inner transactions are validated, they are included in the same ledger as the outer transaction. If an inner transaction appears in a different ledger, it is likely a fraud attempt.
- Systems that don't specifically handle `Batch` transactions should be able to support them without any changes, since each inner transaction is a valid transaction on its own. All inner transactions that have a `tes` (success) or `tec` result code are accessible via standard transaction-fetching mechanisms such as [`tx`](/docs/references/http-websocket-apis/public-api-methods/transaction-methods/tx.md) and [`account_tx`](/docs/references/http-websocket-apis/public-api-methods/account-methods/account_tx.md).
- In a multi-account `Batch` transaction, only the inner transactions and batch mode flags are signed by all parties. This means the submitter of the outer transaction can adjust the sequence number and fee of the outer transaction as needed, without coordinating with the other parties.

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
