---
html: checks.html
parent: payments.html
blurb: Checks can be used for deferred payments that can be canceled or cashed by recipients.
labels:
  - Transactions
---
# Checks

The Checks feature enables users to create deferred payments similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.

XRP Ledger Checks can have expiration times after which they may no longer be cashed. If the recipient doesn't successfully cash the Check before it expires, the Check can no longer be cashed, but the object remains in the XRP Ledger until someone cancels it. Anyone may cancel the Check after it expires. Only the sender and recipient can cancel the Check before it expires. The Check object is removed from the Ledger when the sender successfully cashes the check or someone cancels it.

***TODO: Don't think this needs to be noted here. Is the behavior change documented on the reference page?***
**Note:** The Checks amendment changes the expiration behavior of the `OfferCreate` transaction. 

<!-- For more information, see [Offer Expiration](offers.html#offer-expiration). -->

***TODO: Repurpose this into use cases.***
## Use Cases

- Checks allow people to exchange funds using a process that is familiar to and accepted by the banking industry.

- XRP Ledger Checks solve a problem that is unique to the Ledger: they enable users to reject unwanted payments or accept only part of a payment. This is useful for institutions that need to be careful about accepting payments for compliance reasons.

- If your intended recipient blocks direct payments from stranger using deposit authorization, a check is a good alternative.

- Flexible check cashes. Specify a min amount up to maxamount to cash.

### Payment Authorization

**Problem:** To comply with regulations like BSA, KYC, AML, and CFT, financial institutions must provide documentation about the source of funds they receive. Such regulations seek to prevent the illicit transfer of funds by requiring institutions to know the source and destination of all payments processed by the institution. Because of the nature of the XRP Ledger, anyone could potentially send XRP (and, under the right circumstances, tokens) to an institution's account on the XRP Ledger. Dealing with such unwanted payments adds significant cost and time delays to these institutions' compliance departments, including potential fines or penalties. <!-- SPELLING_IGNORE: cft -->

<!-- [BSA, KYC, AML, and CFT](become-an-xrp-ledger-gateway.html#gateway-compliance) -->

**Solution:** Institutions can enable deposit authorization on their XRP Ledger accounts by setting the `asfDepositAuth` flag in an `AccountSet` transaction. This makes the account unable to receive Payment transactions. Accounts with Deposit Authorization enabled can only receive funds through Escrow, Payment Channels, or Checks. Checks are the most straightforward, familiar, and flexible way to transfer funds if Deposit Authorization is enabled.


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

4. If the check expires before the receiver cashes the check, the `Check` object remainds until anyone cancels it.

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