---
html: checks-uc.html
parent: payments-uc.html
blurb: Checks enable users to create deferred payments similar to personal paper checks.
labels:
  - Transactions
---
# Checks

XRPL Ledger checks enable users to create deferred payments similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.

Learn about [Checks](checks.html) on the XRP Ledger.

---

## Use Cases

### Deposit Authorization

**Problem:** To comply with banking regulations, financial institutions must provide documentation about the sources of funds they receive. These regulations seek to prevent illicit activity by requiring institutions to track the source and destination of all payments they process. Because of the nature of the XRP Ledger, anyone can send XRP to an institution's account on the ledger; to prevent this behavior, they'll enable deposit authorization to only receive funds they explicitly approve. <!-- SPELLING_IGNORE: cft -->

<!-- [BSA, KYC, AML, and CFT](become-an-xrp-ledger-gateway.html#gateway-compliance) -->

**Solution:** Accounts with deposit authorization enabled can only receive funds through:
    - Preauthorized Accounts
    - Escrow
    - Payment Channels
    - Checks
Checks are the most straightforward, familiar, and flexible way to transfer funds when deposite authorization is enabled.

To get started with checks, see: [Create Checks]().