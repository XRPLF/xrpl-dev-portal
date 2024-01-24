---
html: invariant-checking.html
parent: consensus.html
seo:
    description: Understand what invariant checking is, why it exists, how it works, and what invariant checks are active.
labels:
  - Blockchain
  - Security
---
# Invariant Checking

Invariant checking is a safety feature of the XRP Ledger. It consists of a set of checks, separate from normal transaction processing, that guarantee that certain _invariants_ hold true across all transactions.

Like many safety features, we all hope that invariant checking never actually needs to do anything. However, it can be useful to understand the XRP Ledger's invariants because they define hard limits on the XRP Ledger's transaction processing, and to recognize the problem in the unlikely event that a transaction fails because it violated an invariant check.

Invariants should not trigger, but they ensure the XRP Ledger's integrity from bugs yet to be discovered or even created.


## Why it Exists

- The source code for the XRP Ledger is complicated and vast; there is a high potential for code to execute incorrectly.
- The cost of incorrectly executing a transaction is high and not acceptable by any standards.

Specifically, incorrect transaction executions could create invalid or corrupt data that later consistently crashes servers in the network by sending them into an "impossible" state which could halt the entire network.

The processing of incorrect transaction would undermine the value of trust in the XRP Ledger. Invariant checking provides value to the entire XRP Ledger because it adds the feature of reliability.



## How it Works

The invariant checker is a second layer of code that runs automatically in real-time after each transaction. Before the transaction's results are committed to the ledger, the invariant checker examines those changes for correctness. If the transaction's results would break one of the XRP Ledger's strict rules, the invariant checker rejects the transaction. Transactions that are rejected this way have the result code `tecINVARIANT_FAILED` and are included in the ledger with no effects.

To include the transaction in the ledger with a `tec`-class code, some minimal processing is necessary. If this minimal processing still breaks an invariant, the transaction fails with the code `tefINVARIANT_FAILED` instead, and is not included in the ledger at all.


## Active Invariants

The XRP Ledger checks all the following invariants on each transaction:

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L92 "Source")

- [Transaction Fee Check](#transaction-fee-check)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L118 "Source")

- [XRP Not Created](#xrp-not-created)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L146 "Source")

- [Account Roots Not Deleted](#account-roots-not-deleted)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L173 "Source")

- [XRP Balance Checks](#xrp-balance-checks)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L197 "Source")

- [Ledger Entry Types Match](#ledger-entry-types-match)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L224 "Source")

- [No XRP Trust Lines](#no-xrp-trust-lines)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L251 "Source")

- [No Bad Offers](#no-bad-offers)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L275 "Source")

- [No Zero Escrow](#no-zero-escrow)

[[Source]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L300 "Source")

- [Valid New Account Root](#valid-new-account-root)


### Transaction Fee Check

- **Invariant Condition(s):**
    - The [transaction cost](../transactions/transaction-cost.md) amount must never be negative, nor larger than the cost specified in the transaction.


### XRP Not Created

- **Invariant Condition(s):**
    - A transaction must not create XRP and should only destroy the XRP [transaction cost](../transactions/transaction-cost.md).


### Account Roots Not Deleted

- **Invariant Condition(s):**
    - An [account](../accounts/accounts.md) cannot be deleted from the ledger except by an [AccountDelete transaction][].
    - A successful AccountDelete transaction always deletes exactly 1 account.


### XRP Balance Checks

- **Invariant Condition(s):**
    - An account's XRP balance must be of type XRP, and it cannot be less than 0 or more than 100 billion XRP exactly.


### Ledger Entry Types Match

- **Invariant Condition(s):**
    - Corresponding modified ledger entries should match in type and added entries should be a [valid type](../../references/protocol/ledger-data/ledger-entry-types/index.md).


### No XRP Trust Lines

- **Invariant Condition(s):**
    - [Trust lines](../tokens/fungible-tokens/index.md) using XRP are not allowed.


### No Bad Offers

- **Invariant Condition(s):**
    - [Offers](../../references/protocol/ledger-data/ledger-entry-types/offer.md) should be for non-negative amounts and must not be XRP to XRP.


### No Zero Escrow

- **Invariant Condition(s):**
    - An [escrow](../../references/protocol/ledger-data/ledger-entry-types/escrow.md) entry must hold more than 0 XRP and less than 100 billion XRP.


### Valid New Account Root

- **Invariant Condition(s):**
    - A new [account root](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) must be the consequence of a payment.
    - A new account root must have the right starting [sequence](../../references/protocol/data-types/basic-data-types.md#account-sequence).
    - A transaction must not create more than one new [account](../accounts/accounts.md).

### ValidNFTokenPage

- **Invariant Condition(s):**
    - The number of minted or burned NFTs can only be changed by `NFTokenMint` or `NFTokenBurn` transactions.
    - A successful NFTokenMint transaction must increase the number of NFTs.
    - A failed NFTokenMint transaction must not change the number of minted NFTs.
    - A NFTokenMint transaction cannot change the number of burned NFTs.
    - A successful NFTokenBurn transaction must increase the number of burned NFTs.
    - A failed NFTokenBurn transaction must not change the number of burned NFTs.
    - A NFTokenBurn transaction cannot change the number of minted NFTs.

### NFTokenCountTracking

- **Invariant Condition(s):**
    - The page is correctly associated with the owner.
    - The page is correctly ordered between the next and previous links.
    - The page contains a valid number of NFTs.
    - The NFTs on this page do not belong on a lower or higher page.
    - The NFTs are correctly sorted on the page.
    - Each URI, if present, is not empty.

## See Also

- **Blog:**
    - [Protecting the Ledger: Invariant Checking](https://xrpl.org/blog/2017/invariant-checking.html)

- **Repository:**
    - [Invariant Check.h](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h)
    - [Invariant Check.cpp](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.cpp)
    - [System Parameters](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/SystemParameters.h#L43)
    - [XRP Amount](https://github.com/XRPLF/rippled/blob/develop/src/ripple/basics/XRPAmount.h#L244)
    - [Ledger Formats](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/protocol/LedgerFormats.h#L36-L94)


- **Other:**
    - [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md)
    - [Calculating Balance Changes for a Transaction](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)

{% raw-partial file="/_snippets/common-links.md" /%}
