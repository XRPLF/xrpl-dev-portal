# Checks

_(Requires the [Checks amendment][] :not_enabled:.)_

The Checks feature in the XRP Ledger allows users to create deferred payments that can be canceled or cashed by the intended recipients. Like personal paper checks, XRP Ledger Checks start with the sender of the funds creating a Check that specifies an amount and receiver. The receiver cashes the check to pull the funds from the sender's account into the receiver's account. No money moves until the receiver cashes the Check. Because funds are not put on hold when the Check is created, cashing a Check can fail if the sender doesn't have enough funds when the receiver tries to cash it, just like traditional checks. If there's a failure cashing the check, the sender can retry until the check expires.

XRP Ledger Checks have expiration times after which they may no longer be cashed. If the receiver doesn't successfully cash the Check before it expires, the Check object remains in the XRP Ledger until someone cancels it. Anyone may cancel the Check after it expires. Only the sender and receiver can cancel the Check before it expires or is cashed. The Check object is removed from the Ledger when the sender successfully cashes the check or someone cancels it.

Checks are similar to [Escrow](escrow.html) and [Payment Channels](use-payment-channels.html), but there are some important differences between those features and Checks:

* You can send issued currency with Checks. With Payment Channels and Escrow, you can only send XRP.

* Checks do not tie up any funds. The XRP involved in Payment Channels and Escrow cannot be spent until it is redeemed with a claim provided by the sender (Payment Channels), or released by an expiration or crypto-condition (Escrow).

* You can send XRP to yourself through Escrow. You cannot use Checks or Payment Channels to send XRP (or, in the case of Checks, issued currencies) to yourself.


**Note:** The [Checks amendment][]:not_enabled: changes the expiration behavior of the [OfferCreate][] transaction. For more information, see [Offer Expiration](offers.html#offer-expiration).


## Why Checks?

Traditional paper checks allow people to transfer balances without immediately exchanging physical currency. XRP Ledger Checks allow people to exchange funds asynchronously using a process that is familiar to and accepted by the banking industry.

XRP Ledger Checks also solve a problem that is unique to the XRP Ledger: they allow users to reject unwanted payments or accept only a portion of a payment. This is useful for institutions that need to be careful about accepting payments for compliance reasons.

Checks potentially enable many other use cases. Ripple encourages the community to find new and creative applications for Checks.


### Use Case: Payment Authorization

**Problem:** To comply with regulations like [BSA, KYC, AML, and CFT](become-an-xrp-ledger-gateway.html#gateway-compliance), financial institutions must provide documentation about the source of funds they receive. Such regulations seek to prevent the illicit transfer of funds by requiring institutions to disclose the source and destination of all payments processed by the institution. Because of the nature of the XRP Ledger, anyone could potentially send XRP (and, under the right circumstances, issued currencies) to an institution's account on the XRP Ledger. Dealing with such unwanted payments adds significant cost and time delays to these institutions' compliance departments, including potential fines or penalties.

**Solution:** Institutions can enable [Deposit Authorization](depositauth.html) on their XRP Ledger accounts by [setting the `asfDepositAuth` flag in an `AccountSet` transaction](accountset.html). This makes the account unable to receive Payment transactions. Accounts with Deposit Authorization enabled can only receive funds through Escrow, Payment Channels, or Checks. Checks are the most straightforward, familiar, and flexible way to transfer funds if Deposit Authorization is enabled.


## Usage

Checks typically have the lifecycle described below.

<!--{# Diagram source: https://docs.google.com/drawings/d/1Ez8OZVB2TLH-b_kSFOAgfYqXlEQt4KaUBW6F3TJAv_Q/edit #}-->

[![Check flow diagram (successful cashing)](img/checks-happy-path.png)](img/checks-happy-path.png)

**Step 1:** To create a Check, the sender submits a [CheckCreate][] transaction and specifies the receiver (`Destination`), expiration time (`Expiration`), and maximum amount that may be debited from the sender's account (`SendMax`).


**Step 2:** After the CheckCreate transaction is processed, a [Check object](check.html) is created on the XRP Ledger. This object contains the properties of the Check as defined by the transaction that created it. The object can only be modified by the sender (by canceling it with a [CheckCancel][] transaction) or receiver (by canceling it or cashing it) before the expiration time passes. After the expiration time, anyone may cancel the Check.

**Step 3:** To cash the check, the receiver submits a [CheckCash][] transaction. The receiver has two options for cashing the check:

* `Amount` — The receiver can use this option to specify an exact amount to cash. This may be useful for cases where the sender has padded the check to cover possible [transfer fees](transfer-fees.html) and the receiver can only accept the exact amount on an invoice or other contract.

* `DeliverMin` — The receiver can use this option to specify the minimum amount they are willing to receive from the Check. If the receiver uses this option, `rippled` attempts to deliver as much as possible and will deliver at least this amount. The transaction fails if the amount that can be credited to the receiver is not at least this amount.

If the sender has enough funds to cover the Check and the expiration time has not passed, the funds are debited from the sender's account and credited to the receiver's account, and the Check object is is destroyed.



#### Expiration Case

In the case of expirations, Checks have the lifecycle described below.

<!--{# Diagram source: https://docs.google.com/drawings/d/11auqa0kVUPonqlc_RaQUfHcSkUI47xneSKpwlLxzSK0/edit #}-->

[![Check flow diagram (expiration)](img/checks-expiration.png)](img/checks-expiration.png)


All Checks start the same way, so **Steps 1 and 2** are the same.

**Step 3a:** If the Check expires before the receiver can cash it, the Check can no longer be cashed but remains in the ledger.

**Step 4a:** After a Check expires, anyone may cancel it by submitting a [CheckCancel][] transaction. That transaction removes the Check from the ledger.  



## Availability of Checks

Checks require `rippled` v0.90.0 or later. As of 2018-10-11, the Checks amendment has not yet been enabled on the production XRP Ledger. For the latest status of all known amendments, see [Known Amendments](known-amendments.html). For more information about how amendments are enabled and voted on, see [Amendment Process](amendments.html#amendment-process).

To check the status of an amendment on a test net or private XRP Ledger network, use the [feature method][].


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
