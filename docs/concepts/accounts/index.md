---
html: accounts.html
parent: concepts.html
seo:
    description: Learn about accounts in the XRP Ledger. Accounts can send transactions and hold XRP.
labels:
  - Accounts
  - Payments
---
# Accounts

An "Account" in the XRP Ledger represents a holder of XRP and a sender of [transactions](../../references/protocol/transactions/index.md).

An account consists of an address, an XRP balance, a sequence number, and a history of its transactions. To be able to send transactions, the owner also needs one or more cryptographic key pairs associated with the account.


## Account Structure

 The core elements of an account are:

- An identifying **address**, such as `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`.
- An **XRP balance**. Some of this XRP is set aside for the [Reserve](reserves.md).
- A **sequence number**, which helps make sure any transactions this account sends are applied in the correct order and only once. To execute a transaction, the transaction's sequence number and its sender's sequence number must match. Then, as part of applying the transaction, the account's sequence number increases by 1. (See also: [Basic Data Types: Account Sequence](../../references/protocol/data-types/basic-data-types.md#account-sequence).)
- A **history of transactions** that affected this account and its balances.
- One or more ways to [authorize transactions](../transactions/index.md#authorizing-transactions), possibly including:
    - A master key pair intrinsic to the account. (This can be disabled but not changed.)
    - A "regular" key pair that can be rotated.
    - A signer list for [multi-signing](multi-signing.md). (Stored separately from the account's core data.)

An account's core data is stored in an [AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) ledger entry. An account can also be the owner (or partial owner) of several other types of ledger entry.

**Tip:** An "Account" in the XRP Ledger is somewhere between the financial usage (like "bank account") and the computing usage (like "UNIX account"). Non-XRP currencies and assets aren't stored in an XRP Ledger Account itself; each such asset is stored in an accounting relationship called a "Trust Line" that connects two parties.


## Creating Accounts

There is not a dedicated "create account" transaction. The [Payment transaction][] automatically creates a new account if the payment sends enough XRP to a mathematically-valid address that does not already have an account. This is called _funding_ an account, and creates an [AccountRoot entry](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) in the ledger. No other transaction can create an account.

**Caution:** Funding an account **does not** give you any special privileges over that account. Whoever has the secret key corresponding to the account's address has full control over the account and all XRP it contains. For some addresses, it's possible that no one has the secret key, in which case the account is a [black hole](addresses.md#special-addresses) and the XRP is lost forever.

The typical way to get an account in the XRP Ledger is as follows:

1. Generate a key pair from a strong source of randomness and calculate the address of that key pair.

2. Have someone who already has an account in the XRP Ledger send XRP to the address you generated.

    - For example, you can buy XRP in a private exchange, then withdraw XRP from the exchange to the address you specified.

        **Caution:** The first time you receive XRP at your own XRP Ledger address, you must pay the [account reserve](reserves.md) (currently 10 XRP), which locks up that amount of XRP indefinitely. In contrast, private exchanges usually hold all their customers' XRP in a few shared XRP Ledger accounts, so customers don't have to pay the reserve for individual accounts at the exchange. Before withdrawing, consider whether having your own account directly on the XRP Ledger is worth the price.



## See Also

- **Concepts:**
    - [Reserves](reserves.md)
    - [Cryptographic Keys](cryptographic-keys.md)
    - [Issuing and Operational Addresses](account-types.md)
- **References:**
    - [account_info method][]
    - [wallet_propose method][]
    - [AccountSet transaction][]
    - [Payment transaction][]
    - [AccountRoot object](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)
- **Tutorials:**
    - [Manage Account Settings (Category)](../../tutorials/how-tos/manage-account-settings/index.md)
    - [Monitor Incoming Payments with WebSocket](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
