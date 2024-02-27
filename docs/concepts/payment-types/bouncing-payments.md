---
html: bouncing-payments.html
parent: payment-types.html
seo:
    description: When the purpose of a payment is unclear, return it to the sender.
labels:
  - Tokens
---
# Bouncing Payments

When one of your addresses receives a payment whose purpose is unclear, we recommend that you try to return the money to its sender. While this is more work than pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically.

The first requirement to bouncing payments is [robustly monitoring for incoming payments](robustly-monitoring-for-payments.md). You do not want to accidentally refund a customer for more than they sent you! (This is particularly important if your bounce process is automated.) Malicious users can take advantage of a naive integration by sending [partial payments](partial-payments.md#partial-payments-exploit).

Second, you should send bounced payments as Partial Payments. Since third parties can manipulate the cost of pathways between addresses, Partial Payments allow you to divest yourself of the full amount without being concerned about exchange rates within the XRP Ledger. You should publicize your bounced payments policy as part of your terms of use. Send the bounced payment from either an operational address or a standby address.

To send a Partial Payment, enable the [`tfPartialPayment` flag](../../references/protocol/transactions/types/payment.md#payment-flags) on the transaction. Set the `Amount` field to the amount you received and omit the `SendMax` field. You should use the `SourceTag` value from the incoming payment as the `DestinationTag` value for the return payment.

To prevent two systems from bouncing payments back and forth indefinitely, you can set a new Source Tag for the outgoing return payment. If you receive an unexpected payment whose Destination Tag matches the Source Tag of a return you sent, then do not bounce it back again.
