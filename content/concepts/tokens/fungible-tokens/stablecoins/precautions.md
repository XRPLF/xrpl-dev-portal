---
html: stablecoin-precautions.html
parent: stablecoins.html
blurb: Precautions to consider when transferring stablecoin funds in and out of the XRPL.
labels:
  - Tokens
---
# Stablecoin Precautions

Processing payments to and from the XRP Ledger naturally comes with some risks, so an issuer should be sure to take care in implementing these processes. As a stablecoin issuer, you should consider the following precautions.


## Infrastructure

For your own security as well as the stability of the network, each XRP Ledger business should [run its own XRP Ledger servers](install-rippled.html), including one [validator](rippled-server-modes.html#validators).


## Tool Security

Any time you submit an XRP Ledger transaction, it must be signed using your secret key. The secret key gives full control over your XRP Ledger address. Never send your secret key to a server run by someone else. Either use your own server, or sign the transactions locally using a client library. For instructions and examples of secure configurations, see [Set Up Secure Signing](secure-signing.html).

There are several interfaces you can use to connect to the XRP Ledger, depending on your needs and your existing software:

- [HTTP / WebSocket APIs](http-websocket-apis.html) can be used as a low-level interface to all core XRP Ledger functionality.
- [Client Libraries](client-libraries.html) are available in several programming languages to provide convenient utilities for accessing the XRP Ledger.
- Other tools such as [xApps](https://xumm.readme.io/docs/xapps) are also available.
- Third party wallet applications might also be useful, especially for humans in charge of standby addresses.

However, take care to only use reputable tools from their official distribution channels. Malicious servers, libraries, or apps could be configured to leak secret keys to an attacker.


## Payments from the XRP Ledger

When receiving payments from the XRP Ledger, it's important to recognize when a payment is final or not, and to credit the customer for the correct amount, so that your processes and integration software can't be exploited. For details and common pitfalls, see [Robustly Monitoring for Payments](robustly-monitoring-for-payments.html).

If you receive an unexpected or unwanted payment, the standard practice is to return it to the sender. For details of how to do this without incurring additional costs, see [Bouncing Payments](bouncing-payments.html).

Before processing a payment out of the XRP Ledger, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you. Most anti-money-laundering regulations require this anyway. This is especially important because the users sending money from the XRP Ledger could be different than the ones that initially received the money in the XRP Ledger. For more context, see [Stablecoin Compliance Guidelines](stablecoin-compliance-guidelines.html).


## Payments into the XRP Ledger

When sending payments into the XRP Ledger, follow best practices to avoid overpaying on fees and roundabout paths. For details, see [Sending Payments to Customers](sending-payments-to-customers.html).

If you accept payments from in external systems, such as bank deposits or credit/debit payments, be sure to protect yourself against reversible deposits. XRP Ledger payments are irreversible, but many other digital payments are not. Scammers can abuse this to take their fiat money back by canceling a non-XRPL transaction after you've already sent an XRP Ledger payment.

Additionally, follow the [Reliable Transaction Submission guidelines](reliable-transaction-submission.html) to ensure that you know the final outcome of your XRP Ledger transactions even in rare circumstances like power failures or network outages.


## Other Precautions

- Track your obligations and balances within the XRP Ledger, and compare with the assets in your collateral account. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Avoid ambiguous situations. Setting up the appropriate settings on all your addresses helps to avoid cases like accidentally issuing tokens from the wrong address or users sending money to the wrong place. For recommendations, see [Stablecoin Configuration](stablecoin-configuration.html).
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly send funds into and out of the XRP Ledger, as a denial of service attack that effectively empties an operational address's balance. Suspend customers whose addresses are involved in suspicious behavior by not processing their XRP Ledger payments.
