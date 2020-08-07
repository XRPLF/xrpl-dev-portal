# Invariant Checking

This article provides a high-level overview of invariant checking, why it exist, how it works, and lists active invariants.

Like many safety features, we all hope that invariant checking never actually needs to do anything. However, it can be useful to understand the XRP Ledger's invariants because they define hard limits on the XRP Ledger's transaction processing, and to recognize the problem in the unlikely event that a transaction fails because it violated an invariant check.

## Introduction

Invariant checking is a safety feature of the XRP Ledger. It consists of a set of checks, separate from normal transaction processing, that guarantee that certain _invariants_ hold true across all transactions.

Invariants should not trigger, but they ensure the XRP Ledger's integrity from bugs yet to be discovered or even created.

| Term | Description |
|-----------|-------------|
| Invariant | A rule that should always, without exception, be true. For example, "New XRP cannot be created". |
| Invariant Checking | In the XRP Ledger, a system where code automatically confirms that transaction processing does not break the invariants. If a transaction's execution would break an invariant, the invariant checking system fails the transaction. |


## Why it Exists

- The overarching code for the XRP Ledger is complicated and vast; therefore, there is a high potential for code to execute incorrectly.
- The cost of incorrectly executing a transaction is high and not acceptable by any standards.


## How it Works

The invariant checker is a second layer of code that runs automatically in real-time after each transaction. Before the transaction's results are committed to the ledger, the invariant checker examines those changes for correctness. If the transaction's results would break one of the XRP Ledger's strict rules, the invariant checker rejects the transaction. Transactions that are rejected this way have the result code `tecINVARIANT_FAILED` and are included in the ledger with no effects.

To include the transaction in the ledger with a `tec`-class code, some minimal processing is necessary. If this minimal processing still breaks an invariant, the transaction fails with the code `tefINVARIANT_FAILED` instead, and is not included in the ledger at all.


## Active Invariants

The XRP Ledger checks all the following invariants on each transaction:

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L92 "Source")

- [Transaction Fee Check](#transaction-fee-check)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L118 "Source")

- [XRP Not Created](#xrp-not-created)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L146 "Source")

- [Account Roots Not Deleted](#account-roots-not-deleted)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L173 "Source")

- [XRP Balance Checks](#xrp-balance-checks)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L197 "Source")

- [Ledger Entry Types Match](#ledger-entry-types-match)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L224 "Source")

- [No XRP Trust Lines](#no-xrp-trust-lines)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L251 "Source")

- [No Bad Offers](#no-bad-offers)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L275 "Source")

- [No Zero Escrow](#no-zero-escrow)

[[Source]](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L300 "Source")

- [Valid New Account Root](#valid-new-account-root)


### [Transaction Fee Check](#active-invariants)

- **Invariant Condition(s):**
    - [Transaction fees](rippleapi-reference.html#transaction-fees) should never be negative nor larger than the transaction itself.


### [XRP Not Created](#active-invariants)

- **Invariant Condition(s):**
    - A transaction must not create XRP and should only destroy the XRP [transaction cost](transaction-cost.html).


### [Account Roots Not Deleted](#active-invariants)

- **Invariant Condition(s):**
    - An account ledger entry can be removed by an AccountDelete transaction, but this invariant checks that exactly 1 is deleted by a successful AccountDelete.


### [XRP Balance Checks](#active-invariants)

- **Invariant Condition(s):**
    - An account's XRP balance must be of type XRP, and it cannot be less than 0 or more than 100 billion XRP exactly.


### [Ledger Entry Types Match](#active-invariants)

- **Invariant Condition(s):**
    - Corresponding modified ledger entries should match in type and added entries should be a [valid type](ledger-object-types.html).


### [No XRP Trust Lines](#active-invariants)

- **Invariant Condition(s):**
    - [Trust lines](trust-lines-and-issuing.html#trust-lines-and-issuing) using XRP are not allowed.


### [No Bad Offers](#active-invariants)

- **Invariant Condition(s):**
    - [Offers](offer.html#offer) should be for non-negative amounts and must not be XRP to XRP.


### [No Zero Escrow](#active-invariants)

- **Invariant Condition(s):**
    - An [escrow](escrow-object.html) entry must hold a quantity of XRP between 0 and 99.99 billion.


### [Valid New Account Root](#active-invariants)

- **Invariant Condition(s):**
    - A new [account root](accountroot.html) must be the consequence of a payment.
    - A new account root must have the right starting [sequence](basic-data-types.html#account-sequence).
    - A new [account](accounts.html) may not create more than one new account root.


## See Also

- **Blog:**
    - [Protecting the Ledger: Invariant Checking](https://xrpl.org/blog/2017/invariant-checking.html)

- **Repository:**
    - [Invariant Check.h](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h)
    - [Invariant Check.cpp](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.cpp)
    - [System Parameters](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/SystemParameters.h#L43)
    - [XRP Amount](https://github.com/ripple/rippled/blob/develop/src/ripple/basics/XRPAmount.h#L244)
    - [Ledger Formats](https://github.com/ripple/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/protocol/LedgerFormats.h#L36-L94)


- **Other:**
    - [Authorized Trust Lines](authorized-trust-lines.html)
    - [XRP Properties](xrp.html#xrp-properties)
    - [Calculating Balance Changes for a Transaction](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}