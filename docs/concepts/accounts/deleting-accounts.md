---
html: deleting-accounts.html
parent: accounts.html
seo:
    description: About deleting an XRP Ledger account.
labels:
  - Accounts
---
# Deleting Accounts

The owner of an account can send an [AccountDelete transaction][] to deletes the account and related entries from the ledger, sending most of the account's remaining XRP balance to another account. To discourage wasteful creation and deletion of accounts, deleting an account requires burning a higher than usual amount of XRP as the [transaction cost](../transactions/transaction-cost.md).

Some types of associated ledger entries block an account from being deleted. For example, the issuer of a fungible token can't be deleted while anyone holds a nonzero balance of that token.

After an account has been deleted, it can be re-created in the ledger through the normal method of [creating accounts](index.md#creating-accounts). An account that has been deleted and re-created is no different than an account that has been created for the first time.

## Requirements

To be deleted, an account must meet the following requirements:

- The account's `Sequence` number plus 256 must be less than the current [Ledger Index][].
- The account must not be linked to any of the following types of [ledger entries](../../references/protocol/ledger-data/ledger-entry-types/index.md) (as a sender or receiver):
    - `Escrow`
    - `PayChannel`
    - `RippleState`
    - `Check`
- The account must own fewer than 1000 objects in the ledger.
- The transaction must pay a special [transaction cost][] equal to at least the [owner reserve](reserves.md) for one item (currently 2 XRP).

## Cost of Deleting

**Warning:** The [AccountDelete transaction][]'s transaction cost always applies when the transaction is included in a validated ledger, even if the transaction failed because the account does not meet the requirements to be deleted. To greatly reduce the chances of paying the high transaction cost if the account cannot be deleted, use the `fail_hard` option when submitting an AccountDelete transaction.

Unlike Bitcoin and many other cryptocurrencies, each new version of the XRP Ledger's public ledger chain contains the full state of the ledger, which increases in size with each new account. For that reason, you should not create new XRP Ledger accounts unless necessary. You can recover some of an account's 10 XRP [reserve](reserves.md) by deleting the account, but you must still destroy at least 2 XRP to do so.

Institutions who send and receive value on behalf of many users can use [**Source Tags** and **Destination Tags**](../transactions/source-and-destination-tags.md) to distinguish payments from and to their customers while only using one (or a handful) of accounts in the XRP Ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
