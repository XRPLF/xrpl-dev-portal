---
html: stablecoin-technical-details.html
parent: trust-lines-and-issuing.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
---

# Stablecoin Technical Details

## Infrastructure

For your own security as well as the stability of the network, each XRP Ledger business should [run its own XRP Ledger servers](install-rippled.html), including one [validator](rippled-server-modes.html#validators).


### APIs and Middleware

There are several interfaces you can use to connect to the XRP Ledger, depending on your needs and your existing software:

- [HTTP / WebSocket APIs](http-websocket-apis.html) can be used as a low-level interface to all core XRP Ledger functionality.
- [Client Libraries](client-libraries.html) are available in several programming languages to provide convenient utilities for accessing the XRP Ledger.
- Other tools such as [xApps](https://xumm.readme.io/docs/xapps) are also available.
- Third party wallet applications might also be useful, especially for humans in charge of standby addresses.


## Tool Security

Any time you submit an XRP Ledger transaction, it must be signed using your secret key. The secret key gives full control over your XRP Ledger address. Never send your secret key to a server run by someone else. Either use your own server, or sign the transactions locally using a client library.

For instructions and examples of secure configurations, see [Set Up Secure Signing](secure-signing.html).


## Robustly Monitoring for Payments

To robustly check for incoming payments, issuers should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* Look out for [Partial Payments](partial-payments.html). Payments with the partial payment flag enabled can be considered "successful" if any non-zero amount is delivered, even minuscule amounts.
    * Check the transaction for a [`delivered_amount` field](partial-payments.html#the-delivered_amount-field). If present, that field indicates how much money *actually* got delivered to the `Destination` address.
    * In xrpl.js, you can use the [`xrpl.getBalanceChanges()` method](https://js.xrpl.org/modules.html#getBalanceChanges) to see how much each address received. In some cases, this can be divided into multiple parts on different trust lines.
* Some transactions change your balances without being payments directly to or from one of your addresses. For example, if ACME sets a nonzero transfer fee, then ACME's issuing address's outstanding obligations decrease each time Bob and Charlie exchange ACME's tokens.

To make things simpler for your customers, we recommend accepting payments to both your operational address and your issuing addresses.

As an added precaution, we recommend comparing the balances of your issuing address with the collateral funds in your internal accounting system as of each new ledger version. The issuing address's negative balances should match the assets you have allocated to XRP Ledger outside the network. If the two do not match up, then you should suspend processing payments into and out of the XRP Ledger until you have resolved the discrepancy.

* Use the `gateway_balances` method to check your balances.
* If you have a Transfer Fee set, then your obligations within the XRP Ledger decrease slightly whenever other XRP Ledger addresses transfer your tokens among themselves.

For more details on how to read the details of incoming transactions, see [Look Up Transaction Results](look-up-transaction-results.html).


## Sending Payments to Customers

When you build an automated system to send payments into the XRP Ledger for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find ways to trick a system into paying them more money than it should.

Generally, when sending stablecoins, you use a Payment transaction. Some of the details are different depending on whether you are issuing tokens for the first time or transferring them from a hot wallet to a customer. Things to note include:

- When issuing new tokens from your issuing address, you should omit the `SendMax` field. Otherwise, malicious users can arrange their settings so that you issue the full `SendMax` amount instead of just the intended destination `Amount`.
- When sending tokens from a hot wallet, you must specify `SendMax` if you have a nonzero transfer fee. In this case, set the `SendMax` field to the amount specified in the `Amount` field plus the transfer fee. (You may want to round up slightly, in case the precision of your calculations doesn't exactly match the XRP Ledger's. For example, if you send a transaction whose `Amount` field specifies 99.47 USD, and your transfer fee is 0.25%, you should set the `SendMax` field to 124.3375, or 124.34 USD, if you round up.)
- Omit the `Paths` field. This field is unnecessary when sending directly from the issuer, or from a hot wallet as long as the tokens being sent and the tokens being received have the same currency code and issuer—that is, they're the same stablecoin. The `Paths` field is intended for cross-currency payments and longer multi-hop (rippling) payments. If you  perform pathfinding and attach the paths to your transaction, your payment might take a more expensive indirect route rather than failing if the direct path is not available; malicious users can even set this up to fail.
- If you get a `tecPATH_DRY` result code, this usually indicates that either the customer doesn't have the necessary trust line set up already, or your issuer's rippling settings aren't configured correctly.

For a detailed tutorial on issuing a token on the XRP Ledger, whether a stablecoin or otherwise, see [Issue a Fungible Token](issue-a-fungible-token.html).


## Bouncing Payments

When one of your addresses receives a payment where the purpose is unclear, we recommend that you try to return the money to its sender. While this is more work than pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically.

The first requirement to bouncing payments is [robustly monitoring for incoming payments](#robustly-monitoring-for-payments). You do not want to accidentally refund a customer for more than they sent you! (This is particularly important if your bounce process is automated.) Malicious users can take advantage of a naive integration by sending [partial payments](partial-payments.html#partial-payments-exploit).

Second, you should send bounced payments as Partial Payments. Since third parties can manipulate the cost of pathways between addresses, Partial Payments allow you to divest yourself of the full amount without being concerned about exchange rates within the XRP Ledger. You should publicize your bounced payments policy as part of your terms of use. Send the bounced payment from either an operational address or a standby address.

To send a Partial Payment, enable the [`tfPartialPayment` flag](payment.html#payment-flags) on the transaction. Set the `Amount` field to the amount you received and omit the `SendMax` field. You should use the `SourceTag` value from the incoming payment as the `DestinationTag` value for the return payment.

To prevent two systems from bouncing payments back and forth indefinitely, you can set a new Source Tag for the outgoing return payment. If you receive an unexpected payment whose Destination Tag matches the Source Tag of a return you sent, then do not bounce it back again.


## Reliable Transaction Submission

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To submit transactions reliably, follow these guidelines:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (Many [client libraries](client-libraries.html) do this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose [ledger index][] is less than or equal to the transaction's `LastLedgerSequence` parameter.

For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).


## xrp-ledger.toml File

You can publish information about what currencies you issue, and which XRP Ledger addresses you control, to protect against impostors or confusion, using an [`xrp-ledger.toml` file](xrp-ledger-toml.html). This machine-readable format is convenient for client applications to process. If you run an XRP Ledger validator, you can also publish the key in the same file.

# Launch Checklist

These are strategic steps to launch a new stablecoin.

1. Disable rippling by enabling the tfSetNoRipple flag in the TrustSet transaction. 

2. Establish Trustlines: Ensuring sufficient liquidity is available for users to buy and sell [Token] after establishing trustlines is essential.

3. List on DEXs: Decentralized exchanges are integral to the decentralized finance ecosystem. Listing your token on well known DEXs operating on XRPL enhances its visibility and accessibility, thereby attracting more liquidity.

4. Leverage a platform such as Sologenic to enhance liquidity. For example, connect a XUMM wallet to Sologenic to enable the sale of your token. This allows anyone with a XUMM wallet and access to Sologenic to purchase your token.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}