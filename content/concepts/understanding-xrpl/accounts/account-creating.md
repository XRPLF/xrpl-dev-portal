# Creating Accounts

There is not a dedicated "create account" transaction. The `Payment` transaction automatically creates a new account if a payment sends XRP equal to or greater than the account reserve to a mathematically valid address that does not already have an account. This is called _funding_ an account, and creates an AccountRoot object in the ledger. No other transaction can create an account.

**Caution:** Funding an account _does not_ give you any special privileges over that account. Whoever has the secret key corresponding to the account's address has full control over the account and all XRP it contains. For some addresses, it is possible that no one has the secret key, in which case the account is a black hole and the XRP is lost forever.

The typical way to get an account in the XRP Ledger is as follows:

1. Generate a key pair from a strong source of randomness and calculate the address of that key pair. (For example, you can use the `wallet_propose` method to do this.)

2. Have someone who already has an account in the XRP Ledger send XRP to the address you generated.

    - For example, you can buy XRP in a private exchange, then withdraw XRP from the exchange to the address you specified.

        **Caution:** The first time you receive XRP at your own XRP Ledger address, you must pay the account reserve (currently 10 XRP), which locks up that amount of XRP indefinitely. In contrast, private exchanges usually hold all their customers' XRP in a few shared XRP Ledger accounts, so customers don't have to pay the reserve for individual accounts at the exchange. Before withdrawing, consider whether having your own account directly on the XRP Ledger is worth the price.



## Transaction History

In the XRP Ledger, transaction history is tracked by a "thread" of transactions linked by a transaction's identifying hash and the ledger index. The `AccountRoot` ledger object has the identifying hash and ledger of the transaction that most recently modified it; the metadata of that transaction includes the previous state of the `AccountRoot` node, so it is possible to iterate through the history of a single account this way. This transaction history includes any transactions that modify the `AccountRoot` node directly, including:

- Transactions sent by the account, because they modify the account's `Sequence` number. These transactions also modify the account's XRP balance because of the [transaction cost](../transactions/transaction-cost.md).
- Transactions that modified the account's XRP balance, including incoming `Payment` transactions and other types of transactions such as `PaymentChannelClaim` and `EscrowFinish`.

The _conceptual_ transaction history of an account also includes transactions that modified the account's owned objects and non-XRP balances. These objects are separate ledger objects, each with their own thread of transactions that affected them. If you have an account's full ledger history, you can follow it forward to find the ledger objects created or modified by it. A "complete" transaction history includes the history of objects owned by a transaction, such as:

- `RippleState` objects (Trust Lines) connected to the account.
- `DirectoryNode` objects, especially the owner directory tracking the account's owned objects.
- `Offer` objects, representing the account's outstanding currency-exchange orders in the decentralized exchange
- `PayChannel` objects, representing asynchronous payment channels to and from the account
- `Escrow` objects, representing held payments to or from the account that are locked by time or a crypto-condition.
- `SignerList` objects, representing lists of addresses that can authorize transactions for the account by multi-signing.


## Address Encoding

**Tip:** These technical details are only relevant for people building low-level library software for XRP Ledger compatibility!

[[Source]](https://github.com/ripple/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Source")

XRP Ledger addresses are encoded using base58 with the _dictionary_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`. Since the XRP Ledger encodes several types of keys with base58, it prefixes the encoded data with a one-byte "type prefix" (also called a "version prefix") to distinguish them. The type prefix causes addresses to usually start with different letters in base58 format.

