---
html: robustly-monitoring-for-payments.html
parent: payment-types.html
seo:
    description: Recommendations for monitoring incoming payments for a variety of possible irregularities.
labels:
  - Tokens
---
# Robustly Monitoring for Payments

To robustly check for incoming payments, issuers should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* Look out for [Partial Payments](partial-payments.md). Payments with the partial payment flag enabled can be considered "successful" if any non-zero amount is delivered, even minuscule amounts.
    * Check the transaction for a [`delivered_amount` field](partial-payments.md#the-delivered_amount-field). If present, that field indicates how much money _actually_ got delivered to the `Destination` address.
    * In xrpl.js, you can use the [`xrpl.getBalanceChanges()` method](https://js.xrpl.org/modules.html#getBalanceChanges) to see how much each address received. In some cases, this can be divided into multiple parts on different trust lines.
* Some transactions change your balances without being payments directly to or from one of your addresses.

To make things simpler for your customers, we recommend accepting payments to both your operational address and your issuing addresses.

As an added precaution, we recommend comparing the balances of your issuing address with the collateral funds in your internal accounting system as of each new XRP Ledger ledger version. The issuing address's negative balances should match the assets you have allocated to XRP Ledger outside the network. If the two do not match up, then you should suspend processing payments into and out of the XRP Ledger until you have resolved the discrepancy.

* Use the `gateway_balances` method to check your balances.
* If you have a Transfer Fee set, then your obligations within the XRP Ledger decrease slightly whenever other XRP Ledger addresses transfer your tokens among themselves.

For more details on how to read the details of incoming transactions, see [Look Up Transaction Results](../transactions/finality-of-results/look-up-transaction-results.md).
