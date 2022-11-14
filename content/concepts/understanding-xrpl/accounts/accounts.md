# Accounts

An "Account" in the XRP Ledger represents a holder of XRP and a sender of transactions.

## Account Structure

The core elements of an account are:

- An identifying **address**, such as `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`.
- An **XRP balance**. Some of this XRP is set aside for the account reserve.
- A **sequence number**, which helps make sure any transactions this account sends are applied in the correct order and only once. To execute a transaction, the transaction's sequence number and its sender's sequence number must match. Then, as part of applying the transaction, the account's sequence number increases by 1.
- A **history of transactions** that affected this account and its balances.
- One or more ways to authorize transactions, possibly including:
    - A master key pair intrinsic to the account. (This can be disabled, but not changed.)
    - A "regular" key pair that can be rotated.
    - A signer list for multi-signing. (Stored separately from the account's core data.)

In the ledger's data tree, an account's core data is stored in the AccountRoot ledger object type. An account can also be the owner (or partial owner) of several other types of data.

**Tip:** An "Account" in the XRP Ledger is somewhere between the financial usage (like "bank account") and the computing usage (like "UNIX account"). Non-XRP currencies and assets are not stored in an XRP Ledger Account itself; each such asset is stored in an accounting relationship called a "Trust Line" that connects two parties.

