---
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

The invariant checker is a second layer of code that runs automatically in real-time after each transaction. Before the transaction's results are committed to the ledger, the invariant checker examines those changes for correctness. If the transaction's results would break one of the XRP Ledger's strict rules, the invariant checker rejects the transaction. Transactions that are rejected this way have the [result code](../../references/protocol/transactions/transaction-results/index.md) `tecINVARIANT_FAILED` and are included in the ledger with no effects.

To include the transaction in the ledger with a `tec`-class code, some minimal processing is necessary. If this minimal processing still breaks an invariant, the transaction fails with the code `tefINVARIANT_FAILED` instead, and is not included in the ledger at all.


## Active Invariants

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/InvariantCheck.h "Source")

The XRP Ledger checks all the following invariants on each transaction:

- [Transaction Fee Check](#transaction-fee-check)
- [XRP Not Created](#xrp-not-created)
- [Account Roots Not Deleted](#account-roots-not-deleted)
- [XRP Balance Checks](#xrp-balance-checks)
- [Ledger Entry Types Match](#ledger-entry-types-match)
- [No XRP Trust Lines](#no-xrp-trust-lines)
- [No Bad Offers](#no-bad-offers)
- [No Zero Escrow](#no-zero-escrow)
- [Valid New Account Root](#valid-new-account-root)


### Transaction Fee Check

- **Invariant Condition(s):**
    - The [transaction cost](../transactions/transaction-cost.md) amount must never be negative, nor larger than the cost specified in the transaction.


### XRP Not Created

- **Invariant Condition(s):**
    - A transaction must not create XRP and should only destroy the XRP [transaction cost](../transactions/transaction-cost.md).


### Account Roots Not Deleted

- **Invariant Condition(s):**
    - An [account](../accounts/index.md) cannot be deleted from the ledger except by an [AccountDelete transaction][].
    - A successful AccountDelete transaction always deletes exactly 1 account.


### XRP Balance Checks

- **Invariant Condition(s):**
    - An account's XRP balance must be of type XRP, and it cannot be less than 0 or more than [100 billion XRP exactly](https://github.com/XRPLF/rippled/blob/a7792ebcae63db64e9ae3d7704576252837c2512/include/xrpl/protocol/SystemParameters.h#L44-L51).


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
    - A transaction must not create more than one new [account](../accounts/index.md).

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
    - [Protecting the Ledger: Invariant Checking](/blog/2017/invariant-checking.md)

- **Repository:**
    - [`InvariantCheck.h`](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/InvariantCheck.h)
    - [`InvariantCheck.cpp`](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/InvariantCheck.cpp)
    - [`XRPAmount.h`](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/XRPAmount.h)


{% raw-partial file="/docs/_snippets/common-links.md" /%}
