# Checks

In the XRP Ledger, a check is similar to a traditional, personal paper check. The sender creates the check and specifies an amount that the receiver may pull from the sender's account. The receiver cashes the check before the check expires and the funds are deducted from the sender's balance and credited to the receiver's balance. If the receiver doesn't cash the check before the expiration, the check object remains in the XRP Ledger until someone cancels it. (Anyone may cancel the check after it expires. Only the sender and receiver can cancel the check before it expires or is cashed.)


In the XRP Ledger, a check is an entry in the ledger that is a promise from the source of the check that the destination of the check may cash the check and receive up to the `SendMax` specified on the check. The Check can have an expiration date, after which the check can no longer be cashed. After the expiration date passes, the

Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and destination. Later, the destination can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so it may be successfully cashed later.

The sender or the receiver can cancel a Check at any time before it is cashed. A Check can also have an expiration time, after which it cannot be cashed, and anyone can cancel it.

***TODO: Some questions that have come up:


How would you "Get Checks"?

Is the ltCheck object owned by the destination?

Does the Check object contribute to the owner reserve (of the destination)?


In current implementation, checks are only for XRP?
***

***Note:*** This amendment changes the OfferCreate transaction to return tecEXPIRED when trying to create an Offer whose expiration time is in the past. Without this amendment, an OfferCreate whose expiration time is in the past returns tesSUCCESS but does not create or execute an Offer.

## Why Checks?


Checks solve the following problems:

* Payment Authorization

  Checks help prevent institutions from receiving unwanted payments. Institutions may not want to receive payments for compliance reasons.

* Helps to solve partial payments problem (maybe)

### Use Case: ???



## Usage



### Expiration Case


## Availability of Checks

Available in [0.90.0 "Checks" amendment](https://ripple.com/build/known-amendments/#checks).


## Further Reading
