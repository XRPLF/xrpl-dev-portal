# Deleting Accounts

The DeletableAccounts amendment (enabled 2020-05-08) made it possible to delete accounts.

To be deleted, an account must meet the following requirements:

- The account's `Sequence` number plus 256 must be less than the current `Ledger Index`.
- The account must not be linked to any of the following types of ledger objects (as a sender or receiver):
    - `Escrow`
    - `PayChannel`
    - `RippleState`
    - `Check`
- The account must own fewer than 1000 objects in the ledger.
- The `AccountDelete` transaction must pay a special transaction cost equal to at least the owner reserve for one item (currently 2 XRP).

After an account is deleted, you can recreate the account in the ledger through the normal method of creating accounts. An account that has been deleted and recreated is no different than an account created for the first time.

**Warning:** The `AccountDelete` transaction's transaction cost always applies when the transaction is included in a validated ledger, even if the transaction failed because the account does not meet the requirements to be deleted. To greatly reduce the chances of paying the high transaction cost if the account cannot be deleted, submit the transaction with `fail_hard` enabled.

Unlike Bitcoin and many other cryptocurrencies, each new version of the XRP Ledger's public ledger chain contains the full state of the ledger, which increases in size with each new account. For that reason, you should not create new XRP Ledger accounts unless necessary. You can recover some of an account's 10 XRP reserve by deleting the account, but you must still destroy at least 2 XRP to do so.

Institutions who send and receive value on behalf of many users can use **Source Tags** and **Destination Tags** to distinguish payments from and to their customers while only using one (or a handful) of accounts in the XRP Ledger.

