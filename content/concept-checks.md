# Checks

In the XRP Ledger (XRPL), a Check is similar to a personal paper check. As with traditional checks, XRPL Checks start with the sender of the funds. The sender signs a transaction to create a Check and specifies an amount that the receiver may pull from the sender's account and sends the Check to the receiver. When the receiver cashes the Check, the funds are deducted from the sender's account and credited to the receiver's account. No money moves until the receiver cashes the Check. Like a traditional check, cashing a XRPL Check could fail if the sender doesn't have enough funds to cover the amount specified in the Check. The sender can retry cashing the Check until the Check expires. If the receiver doesn't successfully cash the Check before it expires, the Check object remains in the XRP Ledger until someone cancels it. Anyone may cancel the Check after it expires. Only the sender and receiver can cancel the Check before it expires or is cashed.

The receiver has two options when cashing the Check by using the [`CheckCash` transaction](https://ripple.com/build/transactions/#checkcash):

* `Amount` — The receiver can use this option to specify an exact amount to cash. This may be useful for cases where the sender has padded the check to cover possible [transfer fees](https://ripple.com/build/transfer-fees/) and the receiver can only accept the exact amount on an invoice or other contract.

* `DeliverMin` — The receiver can use this option to specify the minimum amount they are willing to receive from the check. If the receiver uses this option, `rippled` attempts to deliver as much as possible and will deliver at least this amount. The transaction fails if the sender doesn't have at least this amount in their account.

Checks are similar to [Escrow](https://ripple.com/build/escrow/#escrow) and [Payment Channels](https://ripple.com/build/payment-channels-tutorial/), two other asynchronous transfer methods available on the XRP Ledger. There are two important differences between those methods and Checks:

* You can send issued currency with Checks. You can only use XRP with Payment Channels and Escrow.

* Checks do not tie up any funds. The XRP involved in Payment Channels and Escrow cannot be spent after until it is released by the sender (Payment Channels), an expiration, or crypto-condition (Escrow).







In the XRP Ledger, a check is an entry in the ledger that is a promise from the source of the check that the destination of the check may cash the check and receive up to the `SendMax` specified on the check. The Check can have an expiration date, after which the check can no longer be cashed.

Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and destination. Later, the destination can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later.

The sender or the receiver can cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it.

***TODO: Some questions that have come up:


How would you "Get Checks"?

Is the ltCheck object owned by the destination?

Does the Check object contribute to the owner reserve (of the destination)?


In current implementation, checks are only for XRP?
***

***Note:*** The [Checks](https://ripple.com/build/known-amendments/#checks) amendment changes the [OfferCreate transaction](https://ripple.com/build/transactions/#offercreate) to return `tecEXPIRED` when trying to create an Offer whose expiration time is in the past. Without this amendment, an OfferCreate whose expiration time is in the past returns `tesSUCCESS` but does not create or execute an Offer.

## Why Checks?

Traditional checks allow people to transfer balances without immediately exchanging physical currency. XRPL Checks allow people to exchange funds asynchronously using a process that is familiar to and accepted by the banking industry.

XRPL Checks also solve a problem that is unique to the XRP Ledger: they allow users to reject unwanted payments or accept only a portion of a payment. This is useful for institutions that need to be careful about accepting payments for compliance reasons.

Checks potentially enable many other use cases. Ripple encourages the community to find new and creative applications for Checks.


### Use Case: Payment Authorization

**Problem:** To comply with regulations like [BSA, KYC, AML, and CFT](https://ripple.com/build/gateway-guide/#gateway-compliance), financial institutions must provide documentation about the source of funds they receive. Such regulations seek to prevent the illicit transfer of funds by requiring institutions to disclose the source and destination of all payments processed by the institution. Because of the nature of the XRP Ledger, anyone could potentially send XRP (and, under the right circumstances, issued currencies) to an institution's account on the XRP Ledger. Dealing with such unwanted payments adds significant overhead cost to these institutions' compliance departments, including potential fines or penalties.

**Solution:** Institutions can enable [Deposit Authorization](https://ripple.com/build/deposit-authorization/#deposit-authorization) on their XRP Ledger accounts by [setting the `asfDepositAuth` flag in an `AccountSet` transaction](https://ripple.com/build/transactions/#accountset-flags). This makes the account unable to accept Payment transactions. The only way for accounts with Deposit Authorization set to receive funds is through Escrow, Payment Channels, or Checks. Checks are the most straightforward, familiar, and flexible way to transfer funds.



## Usage



### Expiration Case


## Availability of Checks

Checks were enabled in `rippled` v0.90.0 with the  ["Checks" amendment](https://ripple.com/build/known-amendments/#checks). Before attempting to use Checks, make sure that your `rippled` server is not [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked).


## Further Reading
