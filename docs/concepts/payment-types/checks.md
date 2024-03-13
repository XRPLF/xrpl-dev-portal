---
html: checks.html
parent: payment-types.html
seo:
    description: Checks let users create deferred payments that can be canceled or cashed by the intended recipients.
labels:
  - Checks
  - Payments
  - Tokens
---
# Checks

The Checks feature enables users to create deferred payments similar to personal paper checks. Unlike an escrow or payment channel, funds aren't set aside when a check is created, so money only moves when the check is cashed. If the sender doesn't have the funds at the time a check is cashed, the transaction fails; recipients can retry failed transactions until the check expires.

XRP Ledger Checks can have expiration times after which they may no longer be cashed. If the recipient doesn't successfully cash the Check before it expires, the Check can no longer be cashed, but the object remains in the XRP Ledger until someone cancels it. Anyone may cancel the Check after it expires. Only the sender and recipient can cancel the Check before it expires. The Check object is removed from the Ledger when the sender successfully cashes the check or someone cancels it.

## Use Cases

- Checks allow people to exchange funds using a process that is familiar to and accepted by the banking industry.

- If your intended recipient uses [Deposit Authorization](../accounts/depositauth.md) to block direct payments from strangers, a check is a good alternative.

- Flexible check cashes. The recipient can redeem the Check for between a minimum and maximum amount.


## Check Lifecycle

1. The sender sends a [CheckCreate transaction][], which defines:
    - The recipient.
    - An expiration date.
    - The maximum amount that can be debited from their account.

2. When the transaction is processed, the XRP Ledger creates a `Check` object. The check can be canceled by the sender or receiver with a [CheckCancel transaction][].

3. The recipient submits a [CheckCash transaction][] that transfers the funds and destroys the `Check` object. Recipients have two options for cashing checks:
    - Exact Amount: They specify an exact amount to cash that doesn't exceed the check maximum.
    - Flexible Amount: They specify a minimum amount to cash and the XRP Ledger delivers as much as possible up to the check maximum. If the sender doesn't have the funds to at least meet the specified minimum, the transaction fails.

4. If the check expires before the receiver cashes the check, the `Check` object remains until anyone cancels it.



## See Also

For more information about Checks in the XRP Ledger, see:

- [Transaction Reference](../../references/protocol/transactions/types/index.md)
    - [CheckCreate][]
    - [CheckCash][]
    - [CheckCancel][]
- [Checks Tutorials](../../tutorials/how-tos/use-specialized-payment-types/use-checks/use-checks.md)
    - [Send a Check](../../tutorials/how-tos/use-specialized-payment-types/use-checks/send-a-check.md)
    - [Look up Checks by sender address](../../tutorials/how-tos/use-specialized-payment-types/use-checks/look-up-checks-by-sender.md)
    - [Look up Checks by recipient address](../../tutorials/how-tos/use-specialized-payment-types/use-checks/look-up-checks-by-recipient.md)
    - [Cash a Check for an exact amount](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cash-a-check-for-an-exact-amount.md)
    - [Cash a Check for a flexible amount](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cash-a-check-for-a-flexible-amount.md)
    - [Cancel a Check](../../tutorials/how-tos/use-specialized-payment-types/use-checks/cancel-a-check.md)
- [Checks amendment][]

For more information about related features, see:

* [Deposit Authorization](../accounts/depositauth.md)
* [Escrow](escrow.md)
* [Payment Channels Tutorial](../../tutorials/how-tos/use-specialized-payment-types/use-payment-channels/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
