---
html: checks.html
parent: payments.html
blurb: Checks can be used for deferred payments that can be canceled or cashed by recipients.
labels:
  - Transactions
---
# Checks

XRPL Ledger checks enable users to create deferred payments similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.

Learn about [Check](checks-uc.html) use cases.

---

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

<!-- SPELLING_IGNORE: 3a, 4a -->

## See Also

- **Tutorials:**
    - [Use Checks](use-checks.html)
