A sequence number is a 32-bit unsigned integer that is used to make sure transactions from a given sender execute only once each, and in the correct order.

Every [account in the XRP Ledger](accounts.html) has a sequence number in its `Sequence` field, which increases by 1 whenever that account sends a transaction and that transaction gets included in a [validated ledger](ledgers.html). Each [transaction](transaction-basics.html) also has a sequence number in its `Sequence` field, which must match the account's current sequence number when the transaction executes. For each account, each sequence number can only be used once, in numerical order.

With the [DeletableAccounts amendment](known-amendments.html#deletableaccounts) :not_enabled:, the starting `Sequence` number for an account matches the [Ledger Index][] of the ledger version where the account was created. Without DeletableAccounts, every account starts with `Sequence` number 1.

Whenever a transaction is included in a ledger, it uses up a sequence number regardless of whether the transaction executed successfully or failed with a [`tec`-class error code](tec-codes.html). Other transaction failures don't get included in ledgers, so they don't change the sender's sequence number (or have any other effects).

Within the ledger, an [Address][] and a sequence number are sometimes used together to identify an object that was created by the validated transaction with that sender and sequence number. [Escrows](escrow.html) and [Offers](offers.html) are examples of objects identified this way.

It is possible for multiple unconfirmed transactions to have the same sender and sequence number. Such transactions are mutually exclusive, and at most one of them can be included in a validated ledger. (Any others ultimately have no effect.)
