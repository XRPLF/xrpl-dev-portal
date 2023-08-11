---
html: stablecoin-issuer-technical-details.html
parent: stablecoin-issuer.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
---

# Stablecoin Issuer - Technical Details

## Infrastructure

For your own security as well as the stability of the network, each XRP Ledger business should [run its own XRP Ledger servers](install-rippled.html) including one [validator](rippled-server-modes.html#validators).


### APIs and Middleware

There are several interfaces you can use to connect to the XRP Ledger, depending on your needs and your existing software:

- [HTTP / WebSocket APIs](http-websocket-apis.html) can be used as a low-level interface to all core XRP Ledger functionality.
- [Client Libraries](client-libraries.html) are available in several programming languages to provide convenient utilities for accessing the XRP Ledger.
- Other tools such as [xApps](https://xumm.readme.io/docs/xapps) are also available.
- Third party wallet applications may also be useful, especially for humans in charge of standby addresses.


## Tool Security

Any time you submit an XRP Ledger transaction, it must be signed using your secret key. The secret key gives full control over your XRP Ledger address. **Never** send your secret key to a server run by someone else. Either use your own server, or sign the transactions locally using a client library.

For instructions and examples of secure configurations, see [Set Up Secure Signing](secure-signing.html).

## Issuer Setup

There are some settings you must configure on your XRP Ledger account before you start issuing tokens. For examples of how to configure these settings, see the [Issue a Fungible Token tutorial](issue-a-fungible-token.html).

Settings you may want to configure include:

| Setting | Notes |
|---------|-------|
| Default Ripple | Issuers **must** enable this field. |
| Deposit Authorization | Block all incoming payments from users you haven't explicitly approved. |
| Require Auth | Restrict your tokens to being held by users you've explicitly approved. |
| Tick Size | Round off exchange rates in the decentralized exchange to facilitate faster price discovery. |
| Transfer Fee | Charge a percentage fee when users send your token to each other. |


### Default Ripple

The Default Ripple flag controls whether the balances on a trust line are [allowed to ripple](rippling.html) by default. Rippling is what allows customers to send and trade tokens among themselves, so an issuer MUST allow rippling on all the trust lines to its issuing address.

Before asking customers to create trust lines to its issuing address, an issuer should enable the Default Ripple flag on that address. Otherwise, the issuer must individually disable the No Ripple flag for each trust line that other addresses have created.


### Deposit Authorization

The Deposit Authorization setting blocks all incoming payments to your account, unless either:

- You have previously preauthorized the sender.
- You send a transaction to receive the funds. For example, you could finish an Escrow that was initiated by a stranger.

Deposit Authorization is most useful for blocking unwanted XRP payments, because you already can't receive tokens unless you've created a trust line to their issuer. However, as a stablecoin issuer, you need to be able to receive payments from users in order for them to redeem the stablecoin for its off-ledger value; you can preauthorize your customers but doing so requires storing an object in the ledger for each custom address, increasing your reserve requirement substantially.

Therefore, Deposit Authorization is not recommended for stablecoin issuers unless you need it to meet regulatory requirements about receiving money from unknown or sanctioned entities.

For more information, see [Deposit Authorization](depositauth.html).


### Disallow XRP

The Disallow XRP setting is designed to discourage XRP Ledger users from sending XRP to an address by accident. This reduces the costs and effort of bouncing undesired payments from addresses that aren't intended to receive and hold XRP. The Disallow XRP flag is not enforced at the protocol level, because doing so could allow addresses to become permanently unusable if they run out of XRP. Client applications should honor the Disallow XRP flag by default, but may allow users to ignore it.

The Disallow XRP flag is optional, but if you don't intend to receive XRP from customers you may want to enable it on your issuing address and all your operational addresses.


### Require Auth

The Require Auth setting blocks users from holding the tokens you issue unless you explicitly approve their trust lines first. You can use this setting to meet regulatory requirements if it matters who holds your tokens within the XRP Ledger. However, this can reduce the utility of your tokens since your approval becomes a bottleneck for users to use them.

Also, you must use your issuing address each time you authorize a trust line; if you must authorize a lot of trust lines, this can undermine the security of your issuing address because you have to use it so often. (If you only need to use the issuing address sparingly, you can put greater protections on its secret keys. The more often you use it, the more of a burden those protections become.)

For more information, see [Authorized Trust Lines](authorized-trust-lines.html).


### Tick Size

The Tick Size setting controls how many decimal places are used when calculating exchange rates in the [Decentralized Exchange](decentralized-exchange.html). A higher Tick Size means more precision and less rounding in the amounts of various trades. Too much precision can be inconvenient because trades are ranked primarily based on exchange rate, so a trader can offer a minuscule amount more to the top of the list. A smaller Tick Size works similar to the minimum bid increment at an auction, saving everyone the time and effort of gradually bidding up a price by irrelevantly small amounts. However, a smaller Tick Size results in more rounding, which can increase the costs of trading, and sometimes has surprising results because two Offers that seemed like an exact match before rounding no longer match after rounding.

The Tick Size is an account-level setting and applies to all tokens issued by the same address.

Tick Size only controls the precision of _exchange rates_, not the precision of the token itself. Users can send and hold very large or very small amounts regardless of the Tick Size set by the token's issuer.

For more information, see [Tick Size](ticksize.html).


### Transfer Fees

A transfer fee setting charges users a percentage fee when sending your tokens to each other. The transfer fee does not apply when issuing tokens or redeeming them directly with the issuing address. (It _does_ apply when users send payments to your hot wallet.) If you issue multiple tokens from the same address, the same transfer fee applies to all of them.

When users send a token with a transfer fee, the amount of the transfer fee is debited from the sending side in addition to the destination amount, but only the destination amount is credited to the recipient. The amount of the fee "vanishes" from the XRP Ledger. As a stablecoin issuer, this means that you gain that much equity in your reserves outside of the XRP Ledger—or, in other words, the amount you need to keep as collateral decreases each time users pay a transfer fee.

At a protocol level, the transfer fee is defined by the `TransferRate` account setting, which is an integer from 1 billion to 2 billion.

For more information, see [Transfer Fees](transfer-fees.html).


### Transfer Fees with Operational and Standby Addresses

All XRP Ledger addresses, including operational and standby addresses, are subject to the issuer's transfer fees when sending tokens. If you set a nonzero transfer fee, then you must send extra (to pay the transfer fee) when making payments from your operational address or standby address. In other words, your addresses must pay back a little of the balance your issuing address created, each time you make a payment.

Set the [`SendMax` transaction parameter][Payment] higher than the destination `Amount` parameter by a percentage based on the `TransferRate` setting.

**Note:** Transfer fees do not apply when sending tokens directly from or to the issuing address. The issuing address must always accept its tokens at face value in the XRP Ledger. This means that customers don't have to pay the transfer fee if they send payments to the issuing address directly, but they do when sending to an operational address. If you accept payments at both addresses, you may want to adjust the amount you credit customers in your system of record when customers send payments to the operational address, to compensate for the transfer fee the customer pays.

For example: If ACME sets a transfer fee of 1%, an XRP Ledger payment to deliver 5 EUR.ACME from a customer address to ACME's issuing address would cost exactly 5 EUR.ACME. However, the customer would need to send 5.05 EUR.ACME to deliver 5 EUR.ACME to ACME's operational address. When ACME credits customers for payments to ACME's operational address, ACME credits the customer for the amount delivered to the operational address _and_ the transfer fee, giving the customer €5,05 in ACME's systems.


## Robustly Monitoring for Payments

To robustly check for incoming payments, issuers should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* Look out for [Partial Payments](partial-payments.html). Payments with the partial payment flag enabled can be considered "successful" if any non-zero amount is delivered, even minuscule amounts.
    * Check the transaction for a [`delivered_amount` field](partial-payments.html#the-delivered_amount-field). If present, that field indicates how much money *actually* got delivered to the `Destination` address.
    * In xrpl.js, you can use the [`xrpl.getBalanceChanges()` method](https://js.xrpl.org/modules.html#getBalanceChanges) to see how much each address received. In some cases, this can be divided into multiple parts on different trust lines.
* Some transactions change your balances without being payments directly to or from one of your addresses. For example, if ACME sets a nonzero transfer fee, then ACME's issuing address's outstanding obligations decrease each time Bob and Charlie exchange ACME's tokens.

To make things simpler for your customers, we recommend accepting payments to both your operational address and your issuing addresses.

As an added precaution, we recommend comparing the balances of your issuing address with the collateral funds in your internal accounting system as of each new XRP Ledger ledger version. The issuing address's negative balances should match the assets you have allocated to XRP Ledger outside the network. If the two do not match up, then you should suspend processing payments into and out of the XRP Ledger until you have resolved the discrepancy.

* Use the `gateway_balances` method to check your balances.
* If you have a Transfer Fee set, then your obligations within the XRP Ledger decrease slightly whenever other XRP Ledger addresses transfer your tokens among themselves.

For more details on how to read the details of incoming transactions, see [Look Up Transaction Results](look-up-transaction-results.html).



## Sending Payments to Customers

When you build an automated system to send payments into the XRP Ledger for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find ways to trick a system into paying them more money than it should.

Generally, when sending stablecoins, you use a [Payment transaction][]. Some of the details are different depending on whether you are issuing tokens for the first time or transferring them from a hot wallet to a customer. Things to note include:

- When issuing new tokens from your issuing address, you should omit the `SendMax` field. Otherwise, malicious users can arrange their settings so that you issue the full `SendMax` amount instead of just the intended destination `Amount`.
- When sending tokens _from a hot wallet_, you must specify `SendMax` if you have a nonzero transfer fee. In this case, set the `SendMax` field to the amount specified in the `Amount` field plus the transfer fee. (You may want to round up slightly, in case the precision of your calculations doesn't exactly match the XRP Ledger's.) For example, if you send a transaction whose `Amount` field specifies 99.47 USD, and your transfer fee is 0.25%, you should set the `SendMax` field to 124.3375, or 124.34 USD if you round up.
- Omit the `Paths` field. This field is unnecessary when sending directly from the issuer, or from a hot wallet as long as the tokens being sent and the tokens being received have the same currency code and issuer—that is, they're the same stablecoin. The `Paths` field is intended for [Cross-Currency Payments](cross-currency-payments.html) and longer multi-hop (rippling) payments. If you naively perform pathfinding and attach the paths to your transaction, your payment may take a more expensive indirect route rather than failing if the direct path is not available; malicious users can even set this up to 
- If you get a `tecPATH_DRY` result code, this usually indicates that either the customer doesn't have the necessary trust line set up already, or your issuer's rippling settings aren't configured correctly.

For a detailed tutorial on issuing a token on the XRP Ledger, whether a stablecoin or otherwise, see [Issue a Fungible Token](issue-a-fungible-token.html).


## Bouncing Payments

When one of your addresses receives a payment whose purpose is unclear, we recommend that you try to return the money to its sender. While this is more work than pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically.

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