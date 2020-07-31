# Invariant Checking

This article provides a high-level overview of Invariant Checking, why it exist, how it works, and lists active invariant checks.

When building applications on the XRP Ledger, it is crucial to understand the idea of Invariant Checks so as not to be surprised by specific error codes.

## Introduction

Invariant checking is a protection enhancement to the XRP Ledger and reinforces the critical properties of the XRP Ledger.

Invariant checks should not trigger, but they ensure the XRP Ledger's integrity from bugs yet to be discovered or even created.


## Why it Exists

Nevertheless, why do we need invariant checks?

- The overarching code for the XRP Ledger is complicated and vast; therefore, there is a high potential for code to execute incorrectly.
- The cost of incorrectly executing a transaction is high and not acceptable by any standards.


## How it Works

A second layer of code runs automatically and in real-time after each transaction completes. It then examines the changes it made for correctness before the results are committed to the ledger. After every transaction runs, the invariant checker runs. Problematic transactions are marked with a **tecINVARIANT_FAILED** result code and are included in the ledger as having done nothing.

The invariant checker is then invariantly checked to ensure the invariant checker's failure is not due to a bug. If this second level check fails, transactions are marked with a **tefINVARIANT_FAILED** result code. The transaction is in its final state and is not included in the ledger.


## Active Invariant Checks

Following is a list of active checks that the invariant checker runs against each transaction on the XRP Ledger.

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

- **Condition(s) Checked:**

    - [Trnsaction fees](https://xrpl.org/rippleapi-reference.html#transaction-fees) should never be negative nor larger than the transaction itself.

```
class TransactionFeeCheck
{
public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### XRP Not Created

- **Condition(s) Checked:**
    
    - A transaction must not create XRP and should only destroy the XRP [fee](https://xrpl.org/rippleapi-reference.html#transaction-fees)).

```
class XRPNotCreated
{
    std::int64_t drops_ = 0;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### Account Roots Not Deleted

- **Condition(s) Checked:**
    
    - An account ledger entry cannot be removed.

```
class AccountRootsNotDeleted
{
    std::uint32_t accountsDeleted_ = 0;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### XRP Balance Checks

- **Condition(s) Checked:**
    
    - An account's XRP balance must be of type XRP and take a value between 0 and INITIAL_XRP drops, inclusive.

```
/** Number of drops per 1 XRP */
constexpr XRPAmount DROPS_PER_XRP{1'000'000};

/** Number of drops in the genesis account. */
constexpr XRPAmount INITIAL_XRP{100'000'000'000 * DROPS_PER_XRP};
```

```
class XRPBalanceChecks
{
    bool bad_ = false;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### Ledger Entry Types Match

- **Condition(s) Chceked:**
    
    - Corresponding modified ledger entries should match in type and added entries should be a [valid type](https://xrpl.org/transaction-types.html#transaction-types).

<!-- MULTICODE_BLOCK_START -->

*LedgerEntryTypesMatch*

```
class LedgerEntryTypesMatch
{
    bool typeMismatch_ = false;
    bool invalidTypeAdded_ = false;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

*LedgerEntryType*

```
// Used as the type of a transaction or the type of a ledger entry.
enum LedgerEntryType {
    /** Special type, anything
        This is used when the type in the Keylet is unknown,
        such as when building metadata.
    */
    ltANY = -3,

    /** Special type, anything not a directory
        This is used when the type in the Keylet is unknown,
        such as when iterating
    */
    ltCHILD = -2,

    ltINVALID = -1,

    //---------------------------------------------------------------------------

    ltACCOUNT_ROOT = 'a',

    /** Directory node.
        A directory is a vector 256-bit values. Usually they represent
        hashes of other objects in the ledger.
        Used in an append-only fashion.
        (There's a little more information than this, see the template)
    */
    ltDIR_NODE = 'd',

    ltRIPPLE_STATE = 'r',

    ltTICKET = 'T',

    ltSIGNER_LIST = 'S',

    ltOFFER = 'o',

    ltLEDGER_HASHES = 'h',

    ltAMENDMENTS = 'f',

    ltFEE_SETTINGS = 's',

    ltESCROW = 'u',

    // Simple unidirection xrp channel
    ltPAYCHAN = 'x',

    ltCHECK = 'C',

    ltDEPOSIT_PREAUTH = 'p',

    // No longer used or supported. Left here to prevent accidental
    // reassignment of the ledger type.
    ltNICKNAME = 'n',

    ltNotUsed01 = 'c',
};
```
<!-- MULTICODE_BLOCK_END -->

### No XRP Trust Lines

- **Condition(s) Checked:**
    
    - [Trust lines](https://xrpl.org/trust-lines-and-issuing.html#trust-lines-and-issuing) using XRP are not allowed.

```
class NoXRPTrustLines
{
    bool xrpTrustLine_ = false;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### No Bad Offers

- **Condition(s) Checked:**
    
    - [Offers](https://xrpl.org/offer.html#offer) should be for non-negative amounts and must not be XRP to XRP.

```
class NoBadOffers
{
    bool bad_ = false;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### No Zero Escrow

- **Condition(s) Checked:**
    
    - An [escrow](https://xrpl.org/escrow-object.html) entry must take a value between 0 and INITIAL_XRP drops exclusive.

```
/** Number of drops per 1 XRP */
constexpr XRPAmount DROPS_PER_XRP{1'000'000};

/** Number of drops in the genesis account. */
constexpr XRPAmount INITIAL_XRP{100'000'000'000 * DROPS_PER_XRP};
```

```
class NoZeroEscrow
{
    bool bad_ = false;

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```

### Valid New Account Root

- **Condition(s) Checked:**
    
    - A new [account root](https://xrpl.org/accountroot.html?_ga=2.259492554.1588022287.1596050513-879263697.1594345179) must be the consequence of a payment.
    - A new account root must have the right starting [sequence](https://xrpl.org/basic-data-types.html#account-sequence).
    - A new [account](https://xrpl.org/accounts.html) may not create more than one new account root.

```
class ValidNewAccountRoot
{
    std::uint32_t accountsCreated_ = 0;
    std::uint32_t accountSeq_ = 0;  // Only meaningful if accountsCreated_ > 0

public:
    void
    visitEntry(
        bool,
        std::shared_ptr<SLE const> const&,
        std::shared_ptr<SLE const> const&);

    bool
    finalize(
        STTx const&,
        TER const,
        XRPAmount const,
        ReadView const&,
        beast::Journal const&);
};
```


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
    - [Authorized Trust Lines](https://xrpl.org/authorized-trust-lines.html#authorized-trust-lines)
    - [XRP Properties](https://xrpl.org/xrp.html#xrp-properties)
    - [Calculating Balance Changes for a Transaction](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}