---
html: checks.html
parent: payment-types.html
blurb: Checks let users create deferred payments that can be canceled or cashed by the intended recipients.
labels:
  - Checks
  - Payments
  - Tokens
---
# Checks

The Checks feature enables users to create deferred payments, similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.

XRP Ledger Checks may have expiration times after which they may no longer be cashed. If the recipient doesn't successfully cash the Check before it expires, the Check can no longer be cashed, but the object remains in the XRP Ledger until someone cancels it. Anyone may cancel the Check after it expires. Only the sender and recipient can cancel the Check before it expires. The Check object is removed from the Ledger when the sender successfully cashes the check or someone cancels it.


## Why Checks?

- Checks allow people to exchange funds using a process that is familiar to and accepted by the banking industry.

- If your intended recipient uses [Deposit Authorization](depositauth.html) to block direct payments from strangers, a check is a good alternative.

- Flexible check cashes. The recipient can redeem the Check for between a minimum and maximum amount.

### Use Case: Payment Authorization

**Problem:** To comply with regulations like BSA, KYC, AML, and CFT, financial institutions must provide documentation about the source of funds they receive. Such regulations seek to prevent the illicit transfer of funds by requiring institutions to know the source and destination of all payments processed by the institution. Because of the nature of the XRP Ledger, anyone could potentially send XRP (and, under the right circumstances, tokens) to an institution's account on the XRP Ledger. Dealing with such unwanted payments adds significant cost and time delays to these institutions' compliance departments, including potential fines or penalties.

**Solution:** Institutions can enable [Deposit Authorization](depositauth.html) on their XRP Ledger accounts by [setting the `asfDepositAuth` flag in an `AccountSet` transaction](accountset.html). This makes the account unable to receive Payment transactions. Accounts with Deposit Authorization enabled can only receive funds through Escrow, Payment Channels, or Checks. Checks are the most straightforward, familiar, and flexible way to transfer funds if Deposit Authorization is enabled.


## Check Lifecycle

1. The sender sends a [CheckCreate transaction][], which defines:
    - The recipient.
    - An expiration date.
    - The maximum amount that can be debited from their account.

2. When the transaction is processed, the XRP Ledger creates a `Check` object. The check can be canceled by the sender or receiver with a [CheckCancel transaction][].

3. The recipient submits a [CheckCash transaction][] that transfers the funds and destroys the `Check` object. Recipients have two options for cashing checks:
    - Exact Amount: They specify an exact amount to cash that doesn't exceed the check maximum.
    - Flexible Amount: They specify a minimum amount to cash and the XRP Ledger delivers as much as possible up to the check maximum. If the sender doesn't have the funds to at least meet the specified minimum, the transaction fails.


### Expiration Case

In the case of expirations, Checks have the lifecycle described below.

<!--{# Diagram source: https://docs.google.com/drawings/d/11auqa0kVUPonqlc_RaQUfHcSkUI47xneSKpwlLxzSK0/edit #}-->

[![Check flow diagram (expiration)](img/checks-expiration.png)](img/checks-expiration.png)


All Checks start the same way, so **Steps 1 and 2** are the same.

**Step 3a:** If the Check expires before the recipient can cash it, the Check can no longer be cashed but the object remains in the ledger.

**Step 4a:** After a Check expires, anyone may cancel it by submitting a [CheckCancel][] transaction. That transaction removes the Check from the ledger.  

<!-- SPELLING_IGNORE: 3a, 4a -->


## See Also

For more information about Checks in the XRP Ledger, see:

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
- [Checks amendment][]

For more information about related features, see:

* [Deposit Authorization](depositauth.html)
* [Escrow](escrow.html)
* [Payment Channels Tutorial](use-payment-channels.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
