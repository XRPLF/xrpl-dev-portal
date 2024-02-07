A sequence number is a 32-bit unsigned integer that is used to make sure transactions from a given sender execute only once each, and in the correct order.

Every [account in the XRP Ledger](../../concepts/accounts/index.md) has a sequence number in its `Sequence` field, which increases by 1 whenever that account sends a transaction and that transaction gets included in a [validated ledger](../../concepts/ledgers/index.md). Each [transaction](../../concepts/transactions/index.md) also has a sequence number in its `Sequence` field, which must match the account's current sequence number when the transaction executes. For each account, each sequence number can only be used once, in numerical order.

[Tickets](../../concepts/accounts/tickets.md) make some exceptions from these rules so that it is possible to send transactions out of the normal order. Tickets represent sequence numbers reserved for later use; a transaction can use a Ticket instead of a normal sequence number.

With the [DeletableAccounts amendment](/resources/known-amendments.md#deletableaccounts), the starting `Sequence` number for an account matches the [Ledger Index][] of the ledger version where the account was created. Before DeletableAccounts, every account started with `Sequence` number 1.

Whenever a transaction is included in a ledger, it uses up a sequence number (or Ticket) regardless of whether the transaction executed successfully or failed with a [`tec`-class error code](../../references/protocol/transactions/transaction-results/tec-codes.md). Other transaction failures don't get included in ledgers, so they don't change the sender's sequence number (or have any other effects).

Within the ledger, an [Address][] and a sequence number are sometimes used together to identify an object that was created by the validated transaction with that sender and sequence number. [Escrows](../../concepts/payment-types/escrow.md) and [Offers](../../concepts/tokens/decentralized-exchange/offers.md) are examples of objects identified this way.

It is possible for multiple unconfirmed transactions to have the same sender and sequence number. Such transactions are mutually exclusive, and at most one of them can be included in a validated ledger. (Any others ultimately have no effect.)
