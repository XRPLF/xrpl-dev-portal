# Becoming a Ripple Gateway #

An existing online financial service, such as a payment system or digital currency exchangea, can provide additional value to customers by acting as a Ripple Gateway. This provides users the ability to send cross-currency payments to users linked by other Ripple Gateways, and potentially provides a new revenue source for balances deposited, withdrawn, or transferred in Ripple.

Expanding an existing exchange system to support Ripple is a relatively simple task. This document explains the concepts necessary to set up a system, and covers the details of doing so. In this document, we use a fictional online currency exchange named "ACME" and its users as examples of how ACME can expand its business to include being a Ripple Gateway.

## Ripple Gateways Explained ##

A Ripple _*Gateway*_ is an entity that exchanges balances in the Ripple Network for balances in the Ripple Network -- in other words, performing deposits and withdrawals from Ripple. Typically, a Gateway holds money (or other assets of value) outside of Ripple, and creates _*issuances*_ in the Ripple Network to represent them. Within Ripple, issuances can be sent, traded, and exchanged atomically without the gateway's intervention. 

Ripple's native cryptocurrency, XRP, can also be exchanged for issuances, and sent to any Ripple account, but exists only within the Ripple Network and cannot be created, deposited, or withdrawn the way that issuances can. All Ripple accounts need a small reserve of XRP in order to pay the network costs of maintaining their accounts and sending transactions. Some users may choose to hold additional XRP to use as a means of exchange, but large holdings of XRP are not strictly necessary to operate a gateway.


### Ripple Trust Lines and Issuances ###

A "trust line" is link between two accounts in Ripple that represents an explicit statement of willingness to hold gateway debt obligations. Those debt obligations, which we call *issuances*, are digital assets that can be sent and traded. A *gateway deposit* is when someone sends value (outside the Ripple Network) to a gateway in exchange for issuances on the Ripple network. An issuance represents a promise that whoever holds the issuance can redeem it with the issuer on the Ripple Network for that amount of value (off the Ripple Network). Doing so is a *gateway withdrawal*. 

All assets in Ripple, except for the native cryptocurrency XRP, are represented as issuances. Issuances get their value from the promise that the gateway issuing them will honor the obligation that the issuances represent; there is no computer system that can force a Ripple gateway to honor that obligation. Therefore, trust lines ensure that users only hold issuances from gateways they trust.


### Hot and Cold Wallets ###

It is strongly recommended that Ripple gateways employ a "hot wallet / cold wallet" strategy. This enforces a separation of roles that promotes strong security. ("Wallets" in Ripple are equivalent to Accounts.)

The cold wallet should remain offline, and serves as the asset issuer. This means that the secret key to sign transactions for the cold wallet is not stored on a computer that is connected to the Internet. Periodically, a human operator creates and signs a transaction (preferably from an entirely offline machine) in order to refill the hot wallet's balance. Because the cold wallet is the account creating the issuances, customer accounts holding those issuances must trust the cold wallet. 

A hot wallet makes payments to the gateway's users in Ripple by sending them issuances created by the cold wallet. It also needs a trust line to the cold wallet. A gateway can use one or more "hot wallet" accounts, but each hot wallet has a limited balance of the gateway's issuances. If it is compromised, the gateway can only lose as much currency as the hot wallet holds. However, this means that the gateway must monitor the hot wallet's balance, so that it doesn't run out during ordinary operation.


## Prior to Ripple Integration ##

Our example exchange, ACME, already accepts withdrawals and deposits from users using some existing system, and uses an internal accounting system to track how much balance each user has with the exchange. Such a system can be modeled simply like this:

<!-- diagram: e2g_1

Alice - €4 held
ACME - €5 held
ACME Core Accounting - Bob: €1, Charlie: €2, ACME itself: €2

Alice deposits €4

Alice - €0 held
ACME - €9 held
ACME Core Accounting - Alice: €4, Bob: €1, Charlie: €2, ACME itself: €2

-->

**Assumptions:** To integrate with Ripple, we assume that an exchange such as ACME meets the following assumptions:

* ACME already has a system to accept deposits and withdrawals from some outside payment source. 
* ACME waits for deposits to clear before crediting them internally.
* ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
    * ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.
    

## Ripple Integration ##

## Deposits from Gateway to Ripple ##

A deposit into Ripple means moving funds from a user's balance at a gateway into a separate record tracking Ripple-backed funds, and then sending the equivalent amount of issuances in Ripple to the user's Ripple account.

An example of a deposit flow:

1. Alice asks to deposit €2 of her ACME balance into Ripple.
2. In its internal accounting, ACME debits Alice's balance €2 and credits the Ripple-backed balance by €2.
3. ACME submits a Ripple transaction, sending €2 to Alice's Ripple address. The €2 is marked in Ripple as being "issued" by ACME (2 EUR@ACME).

<!-- diagram:

ACME Core Accounting - Alice: €4, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €0
ACME hot wallet —€0→ cold wallet
Alice Ripple acct —€0→ cold wallet

Alice "deposits" €2 into Ripple (intermediate state)

ACME Core Accounting - Alice: €2, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €2
ACME hot wallet —€2→ cold wallet
Alice Ripple acct —€0→ cold wallet

ACME sends Alice's money to her Ripple account

ACME Core Accounting - Alice: €2, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €2
ACME hot wallet —€0→ cold wallet
Alice Ripple acct —€2→ cold wallet

-->

### Deposit Requirements ###

There are several prerequisites that ACME must meet in order for this to happen:

- ACME modifies its core accounting system to track money that is backing funds issued on the Ripple Network. This could be as simple as adding a record for Ripple. 
    - Optionally, a gateway can take additional steps to separate normal user funds from funds backing the gateway's Ripple issuances. For example, a cryptocurrency exchange can create a separate wallet to hold the funds allocated to Ripple. This provides publicly-verifiable proof to customers that the gateway is solvent.
- ACME must have a Ripple account. Our best practices recommend actually having at least two accounts: a "cold wallet" account to issue currency, and one or more "hot wallet" accounts that perform day-to-day transactions. See [Hot and Cold Wallets](#hot-and-cold-wallets) for more information.
- Alice must create a trustline from her Ripple address to ACME's issuing (cold wallet) account. She can do this from any Ripple client (such as [Ripple Trade](https://www.rippletrade.com/) as long as she knows ACME's account address or Ripple Name.
- ACME must create a user interface for Alice to deposit funds from ACME into Ripple.
    - In order to do this, ACME needs to know Alice's Ripple address. ACME can have Alice input her Ripple addresss as part of the deposit interface, or ACME can require Alice to input and verify her Ripple address in advance.


## Withdrawals from Ripple to Gateway ##

A withdrawal from Ripple means moving funds from the Ripple-backed balance at a gateway into a user account in response to receiving a Ripple payment.

An example of a withdrawal flow:

1. Bob sends Ripple transaction of €1 to ACME's cold wallet
2. In its internal accounting, ACME debits its Ripple-backing balance €1 and credits Bob's balance €1.


### Withdrawal Requirements ###

In addition to the [requirements for making deposits possible](#deposit-requirements), there are several prerequisites that ACME must meet in order to process withdrawals:

- ACME must monitor its Ripple accounts for incoming payments.
- ACME must recognize the identities of users from the incoming payments.
    - We recommend that ACME should bounce any unrecognized incoming payments back to their sender.
    - Typically, the preferred method of recognizing incoming payments is through [destination tags](#destination-tags).


### Precautions ###

Processing withdrawals and bouncing incoming payments are both potentially risky processes, so a gateway should be sure to take care in implementing them. We recommend the following precautions:

- Before processing a withdrawal, make sure you know the customer's identity. This is especially important because the users withdrawing from Ripple could be different than the ones depositing.
- [Robustly monitor for incoming payments](#robustly-monitor-for-payments), and read the correct amount. Don't be deceived by Partial Payments.
- Proactively avoid ambiguous situations. We recommend the following:
    - Enable the [`DisallowXRP` flag](#disallowxrp) for the cold wallet account and all hot wallet accounts, so users do not accidentally send you XRP.
    - Enable the [`RequireDest` flag](#requiredest) for the cold wallet account and all hot wallet accounts, so users do not accidentally forget the destination tag on payments to make withdrawals.
    - Enable the [`RequireAuth` flag](#requireauth) on all hot wallet accounts so they cannot create their own issuances.

# Trading on Ripple #

After the issuances have been created in Ripple, they can be freely transferred and traded by Ripple users. There are several consequences of this situation:

- Anyone can buy/sell EUR@ACME on Ripple, if they create a trust line to ACME's issuing account first. If ACME issues multiple currencies on Ripple, a separate trust line is necessary for each.
    - This includes users who do not have an account with ACME Exchange. In order to withdraw the funds successfully from ACME, users still have to create ACME accounts.
    - If ACME wants to limit who can hold EUR@ACME on Ripple, ACME must enable the [`RequireAuth` flag](#requireauth) for its cold wallet account and then manually approve trust lines.
- Ripple users trading and sending EUR@ACME to one another requires no intervention by ACME.
- All exchanges and balances on Ripple are publicly viewable in the shared, global ledger. 

Exchanging EUR@ACME for other currencies within Ripple requires market makers who are willing to exchange other Ripple issuances for EUR@ACME. Market makers are just Ripple accounts with trust lines for EUR@ACME as well as other currencies or issuers, who create orders (called "offers" in the Ripple ledger) to exchange currency. The cost of exchanging EUR@ACME for another currency depends on the quantity and quality of orders. 

To facilitate exchanging currency, ACME may decide to become its own market maker. For various reasons, we recommend using a separate Ripple account for trading. 


## Fees and Revenue Sources ##

There are several ways in which a gateway can seek to benefit financially from Ripple integration. These can include:

* Indirect revenue from value added. Ripple integration can provide valuable functionality for your customers that distinguishes your business from your competitors.
* Withdrawal and Deposit fees. It is typical for a gateway to charge a small fee (such as 1%) for the service of adding or removing money from Ripple. You have the power to determine the rate you credit people when they move money onto and off of Ripple through your gateway.
* Transfer fees. You can set a percentage fee to charge when Ripple users send each other issuances created by your account. This amount disappears from the Ripple ledger, decreasing your obligation each time your issuances change hands. See [TransferRate](#transferrate) for details.
* Market making. A gateway can also make offers to buy and sell its issuances for other issuances on Ripple, providing liquidity to cross-currency payments and possibly making a profit. (As with any financial exchange, profits are not guaranteed.)


# Technical Details #

## DisallowXRP ##

The DisallowXRP flag (`disallow_xrp` in Ripple-REST) is designed to discourage users from sending XRP to your account by accident. For accounts that are intended to process withdrawals, receiving XRP is undesirable because there is no way to "withdraw" XRP from the network.

However, the DisallowXRP flag is not strictly enforced, because doing so could allow accounts to become permanently unusable. Client applications should honor it, but it is intentionally possible to work around. We recommend enabling the DisallowXRP flag on all gateway hot and cold wallets.

The following is an example of a Ripple-REST request to enable the DisallowXRP flag:

Request:

```
POST https://api.ripple.com/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "ssssssssssssssssssssssssssss",
  "settings": {
    "disallow_xrp": true
  }
}
```

Response:

```
200 OK

{
  "success": true,
  "settings": {
    "hash": "AC0F7D7735CDDC6D859D0EC4E96A571F71F7481750F4C6C975FC8075801A6FB5",
    "ledger": "10560577",
    "state": "validated",
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": true
  }
}
```

## RequireDest ##

The `RequireDest` flag (`require_destination_tag` in Ripple-REST) is designed to prevent users from sending payments to your account while accidentally forgetting the [destination tag](#destination-tags) that identifies who should be credited for the payment. When enabled, the Ripple Network rejects any payment to your account that does not specify a destination tag.

We recommend enabling the RequireDest flag on all gateway hot and cold wallets.

The following is an example of a Ripple-REST request to enable the RequireDest flag.

Request:

```
POST https://api.ripple.com/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "ssssssssssssssssssssssssssss",
  "settings": {
    "require_destination_tag": true
  }
}
```

Response:

```
200 OK

{
  "success": true,
  "settings": {
    "hash": "F3D2EE87D597BA50EA3A94027583110925E8BAAFE41511F937D65423B18BC2A3",
    "ledger": "10560755",
    "state": "validated",
    "require_destination_tag": true,
    "require_authorization": false,
    "disallow_xrp": false
  }
}
```


## RequireAuth ##

The `RequireAuth` flag (`require_authorization` in Ripple-REST) prevents a Ripple account's issuances from being held by other users unless the issuer approves them.

### With Hot Wallets ###

We recommend enabling `RequireAuth` for all hot wallet accounts, and then never approving any accounts, in order to prevent hot wallets from creating issuances even by accident. This is a purely precuationary measure, and does not impede the ability of those accounts to transfer issuances created by the cold wallet, as they are intended to do.

The following is an example of a Ripple-REST request to enable the RequireDest flag. (This method works the same way regardless of whether the account is used as a hot wallet or cold wallet.)

Request:

```
POST https://api.ripple.com/v1/accounts/rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW/settings?validated=true

{
  "secret": "sssssssssssssssssssssssssssss",
  "settings": {
    "require_authorization": true
  }
}
```

Response:

```
{
  "success": true,
  "settings": {
    "hash": "687702E0C3952E2227B2F7A0B34933EAADD72A572B234D31360AD83D3F193A78",
    "ledger": "10596929",
    "state": "validated",
    "require_destination_tag": false,
    "require_authorization": true,
    "disallow_xrp": false
  }
}
```

### With Cold Wallets ###

You may also enable `RequireAuth` for your cold wallet if you do not want unknown Ripple accounts to hold the currency your gateway issues. We feel this is *not necessary* in most cases.

If you use RequireAuth on your cold wallet, then processing customer deposits (and allowing other customers to trade in your issuances) requires an additional step, to authorize customers' trust lines to hold your currency.

You must authorizing trust lines from the same cold wallet account that issues the currency, which unfortunately means an increased risk exposure for that account. Before a deposit can be processed, the cold wallet must authorize a transaction to authorize the trust line where the issuances would be held. The flow for authorizing a user requires another step at the end:

1. ACME publishes its cold wallet address to users.
2. Alice extends a trust line from her Ripple account to ACME's cold wallet, indicating that she is willing to hold ACME's issuances.
3. ACME's cold wallet sends a transaction authorizing Alice's trust line.

The following is an example of a TrustSet transaction to authorize the (customer) account rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn to hold issuances from the (cold wallet) account rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW:

<span class='draft-comment'>(Not possible in REST?)</span>


## Robustly Monitoring for Payments ##

In order to robustly monitor incoming payments, gateways should do the following:

* Keep a record of the most-recently-processed transaction. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances.
* Look out for Partial Payments. If an incoming transaction has a `destination_balance_changes` field (Ripple-REST) or a `meta.AmountDelivered` field (WebSocket/JSON-RPC), then use that to see how much money *actually* got delivered to the destination account. Payments with the partial-payment flag enabled are considered "successful" if any non-zero amount is delivered, even miniscule amounts. (The flag is called `"partial_payment": true` in REST, and `tfPartialPayment` in WebSocket/JSON-RPC) 
* Some transactions modify your balances without being payments directly to or from one of your accounts. For example, if ACME sets a nonzero [TransferRate](#transferrate), then ACME's cold wallet's outstanding obligations decrease each time Bob and Charlie exchange ACME issuances. <span class='draft-comment'>(How does this look in REST?)</span>

To make things simpler for your users, we recommend monitoring for incoming payments to hot wallets and the cold wallet, and treating the two equivalently.

As an added precaution, we recommend regularly comparing the balances of your Ripple cold wallet account with the Ripple-backing funds in your internal accounting system. The cold wallet's balance should be the negative of the assets you hold, backing Ripple. If the two do not match up, then you should check that you have processed all transactions correctly. 


## Destination Tags ##

*Destination Tags* are 32-bit integers which identify the beneficiary or cause for a payment; for example, which customer should be credited when a Ripple withdrawal takes place. A gateway should maintain an internal mapping of destination tags to (non-Ripple) account records. 

For greater privacy and security, we recommend *not* using a single persistent destination tag to refer to a single user. In particular, we do not recommend using monotonically-incrementing numbers for users.

Instead, you can have a user interface to generate a destination tag on-demand when a user intends to make a deposit. This can be deterministic (through iterative uses of a hash function, for example), as long as you check for collisions. Then, consider that destination tag valid only for the expected withdrawal, and bounce any further transactions that reuse the same destination tag. <span class='draft-comment'>(I'd appreciate some better advice for best practices here.)</span>

### Source Tags ###

When sending a payment from a hot wallet, we also recommend creating a source tag and including it in the payment, so that the receiving Ripple account can bounce the payment back, using the original Source Tag as the Destination Tag of the bounce payment.


## TransferRate ##

The *TransferRate* setting (`transfer_rate` in Ripple-REST) defines a fee to charge for transferring issuances from one Ripple account to another. The transfer fee is defined on the issuing (cold wallet) account. For any transaction *except paying back to the issuing account*, the sending account is debited issuances at a ratio of TransferRate:1 compared to the destination amount. TransferRate has a maximum precision of 9 decimal places, and cannot be less than 1 or greater than 2.

The fee represented by the TransferRate disappears from the Ripple ledger, becoming the property of the gateway. 

For example, if ACME sets the trasfer_rate of its cold wallet to 1.005, that indicates a transfer fee of 0.5% for ACME issuances. In order for Bob to receive 2 EUR@ACME, Charlie must send 2.01 EUR@ACME. After the transaction, ACME's outstanding obligations in Ripple have decreased by €0.01, which means that it is no longer obliged to hold that amount in the account backing its Ripple issuances.

The following is an example of a Ripple-REST request to set the TransferRate for a fee of 0.5%.

Request:

```
POST https://api.ripple.com/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "sssssssssssssssssssssssssssss",
  "settings": {
    "transfer_rate": 1.005
  }
}

```

Response:

<span class='draft-comment'>[RLJS-158](https://ripplelabs.atlassian.net/browse/RLJS-158)</span>


## Bouncing Payments ##

When your hot or cold wallet receives a payment whose purpose is unclear, we recommend that you make an attempt to return the money to its sender. While this is more work than simply pocketing the money, it demonstrates good faith towards customers.

The first requirement to bouncing payments is [robustly monitoring for incoming payments](#robustly-monitoring-for-payments). You do not want to accidentally refund a user for more than they sent you!

Second, you should send bounced payments as Partial Payments. Since other Ripple users can manipulate the cost of pathways between your accounts, Partial Payments allow you to divest yourself of the full amount without being concerned about which fees to pay.

<span class='draft-comment'>(TODO: more)</span>


## Setting Trust Lines in Ripple Trade ##

TODO

## Robust Transaction Submission ##

The goal of robustly submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions will be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

In order to achieve this, there are several steps you can take when submitting transactions:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter.
* Resubmit a transaction if it has not appeared in a validated ledger whose sequence number is less than or equal to the transaction's `LastLedgerSequence` parameter.

For additional information, consult <span class='draft-comment'>Gateway Bulletin #@@ (Forthcoming)</span>
