# Transaction History

In the XRP Ledger, transaction history is tracked by a "thread" of transactions linked by a transaction's identifying hash and the ledger index. The `AccountRoot` ledger object has the identifying hash and ledger of the transaction that most recently modified it; the metadata of that transaction includes the previous state of the `AccountRoot` node, so it is possible to iterate through the history of a single account this way. This transaction history includes any transactions that modify the `AccountRoot` node directly, including:

- Transactions sent by the account, because they modify the account's `Sequence` number. These transactions also modify the account's XRP balance because of the transaction cost.
- Transactions that modified the account's XRP balance, including incoming `Payment` transactions and other types of transactions such as `PaymentChannelClaim` and `EscrowFinish`.

The _conceptual_ transaction history of an account also includes transactions that modified the account's owned objects and non-XRP balances. These objects are separate ledger objects, each with their own thread of transactions that affected them. If you have an account's full ledger history, you can follow it forward to find the ledger objects created or modified by it. A "complete" transaction history includes the history of objects owned by a transaction, such as:

- `RippleState` objects (Trust Lines) connected to the account.
- `DirectoryNode` objects, especially the owner directory tracking the account's owned objects.
- `Offer` objects, representing the account's outstanding currency-exchange orders in the decentralized exchange
- `PayChannel` objects, representing asynchronous payment channels to and from the account
- `Escrow` objects, representing held payments to or from the account that are locked by time or a crypto-condition.
- `SignerList` objects, representing lists of addresses that can authorize transactions for the account by multi-signing. 

For more information on each of these objects, see the Ledger Format Reference.
