---
html: checks.html
parent: payments.html
blurb: Checks can be used for deferred payments that can be canceled or cashed by recipients.
labels:
  - Transactions
---
# Checks

XRPL Ledger checks enable users to create deferred payments similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.


## Check Lifecycle

1. The sender creates a check using the `CheckCreate` transaction to define:
    - The recipient.
    - An expiration date.
    - The maximum amount that can be debited from their account.

2. After the transaction is processed, the XRP Ledger creates a `Check` object. The check can only be cancelled by the sender or receiver with a `CheckCancel` transaction.

3. The recipient submits a `CheckCash` transaction that transfers the funds and destroys the `Check` object.
    **Note:** Recipients have two options for cashing checks.
        - Exact Amount: They specify an exact amount to cash that doesn't exceed the check maximum.
        - Flexible Amount: They specify a minimum amount to cash and the XRP Ledger delivers as much as possible up to the check maximum. If the sender doesn't have the funds to meet the minimum, the transaction fails.

4. If the check expires before the receiver cashes the check, the `Check` object remains until someone cancels it.


## Use Cases

### Deposit Authorization

**Problem:** To comply with regulations like BSA, KYC, AML, and CFT, financial institutions must provide documentation about the sources of funds they receive. These regulations seek to prevent illicit activity by requiring institutions to track the source and destination of all payments they process. Because of the nature of the XRP Ledger, anyone can send XRP to an institution's account on the ledger; to prevent this behavior, they'll enable deposit authorization to only receive funds they explicitly approve. <!-- SPELLING_IGNORE: cft -->

<!-- [BSA, KYC, AML, and CFT](become-an-xrp-ledger-gateway.html#gateway-compliance) -->

**Solution:** Accounts with deposit authorization enabled can only receive funds through:
    - Preauthorized Accounts
    - Escrow
    - Payment Channels
    - Checks
Checks are the most straightforward, familiar, and flexible way to transfer funds when deposite authorization is enabled.

<!-- SPELLING_IGNORE: 3a, 4a -->

## See Also

- [Transaction Reference](transaction-types.html)
    - [CheckCreate][]
    - [CheckCash][]
    - [CheckCancel][]
- [Checks Tutorials](use-checks.html)
    - [Send a Check](send-a-check.html)
    - [Look up Checks by sender address](look-up-checks-by-sender.html)
    - [Look up Checks by recipient address](look-up-checks-by-recipient.html)
    - [Cash a Check for an exact amount](cash-a-check-for-an-exact-amount.html)
    - [Cash a Check for a flexible amount](cash-a-check-for-a-flexible-amount.html)
    - [Cancel a Check](cancel-a-check.html)