# Becoming a Ripple Gateway #

Expanding an existing online financial system to support Ripple is a relatively simple task. Gateways are the businesses that link the Ripple network to the rest of the world. By becoming a Ripple gateway, existing online financial services, such as payment systems and digital currency exchange, can gain several advantages:

* By enabling its users to send and receive value in Ripple, the business increases its value proposition to users.
* By accepting payments from the Ripple network, the business increases the number of ways that users can fund accounts at its business, even internationally.
* The business can use Ripple-related services as a new source of revenue.

This document explains the concepts and steps necessary to become a Ripple gateway. In this document, we use a fictional online currency exchange named "ACME" and its users as examples, to show how ACME can expand its business to include being a Ripple gateway.


## Contact Information ##

You are not on your own. Ripple Labs depends on the success of individual gateways, so we are here to help. Please contact us if you need any assistance building and growing your gateway.

* Contact [partners@ripple.com](mailto:partners@ripple.com) for enterprise-class integrations, infrastructure advice, and other business development needs.
* Contact [developers@ripple.com](mailto:developers@ripple.com) for technical questions, clarifications, bug reports, and feature requests.


## Ripple Gateways Explained ##

A Ripple _*Gateway*_ is an entity that exchanges value in the Ripple Network for value outside Ripple, so it connects Ripple to the outside world. There are three major models that gateways can follow, with different purposes and modes of operation. 

* An **Issuing Gateway** receives money (or other assets of value) outside of Ripple, and creates _*issuances*_ in the Ripple Network. This provides a direct way for users to get money in and out of Ripple. This document focuses primarily on how to become an issuing gateway.
* A **Private Exchange** lets its users purchase and trade XRP among users of the private exchange. This is similar to being an exchange for any other commodity or cryptocurrency. However, unlike other cryptocurrencies, there is also an exchange built into the Ripple protocol itself.
* A **Merchant** accepts payment within Ripple for goods or services outside the network. Unlike an issuing gateway, a merchant business does not create its own currency, but accepts issuances that are created by other gateways. This guide does not describe how to accept Ripple payments as a merchant.

### Ripple Trust Lines and Issuances ###

All assets in Ripple, except for the native cryptocurrency XRP, are represented as *issuances*, which are digital assets that reflect traditional assets held by a gateway. Within Ripple, issuances can be sent and traded without the gateway's intervention and very low barriers to entry. Issuances get their value from gateway's agreement to honor the obligation that the issuances represent; there is no computer system that can force a Ripple gateway to honor that obligation. Therefore, Ripple's *trust lines* ensure that users only hold issuances from gateways they trust to pay out when needed.

A "trust line" is link between two accounts in Ripple that represents an explicit statement of willingness to hold gateway debt obligations. When a user sends money into Ripple, a Gateway takes custody of those assets outside of Ripple, and sends issuances within the Ripple network to the user. When a user sends money out of Ripple, she makes a Ripple payment to the gateway, and the gateway then sends the assets to the user in the outside world.


### XRP ###

XRP is the native [cryptocurrency](https://ripple.com/knowledge_center/math-based-currency/) of the Ripple network. Like issuances, XRP can be freely sent and exchanged by users in the network. Unlike issuances, XRP is not connected to a trust line, and can be sent directly from any Ripple account to any other, without going through a gateway or market maker. This helps make XRP a convenient bridge currency to facilitate currency exchanges.

XRP also serves other purposes in the Ripple network, in particular as [a protective measure against spamming the network](https://ripple.com/knowledge_center/abuse-protection/). All Ripple accounts need a small reserve of XRP in order to pay the network costs of maintaining their accounts and sending transactions. The anti-spam network fees are destroyed, not paid to any party.

Issuing gateways do not need to accumulate or exchange XRP. They must only maintain a small balance of XRP to send transactions on the network. The XRP equivalent of $10 USD should be enough for a busy gateway to operate for a year.

Private exchanges and market makers may choose to hold additional XRP to use as a means of exchange. Ripple Labs **does not** promote XRP as a speculative investment.

### Liquidity and Currency Exchange Within Ripple ###

The Ripple network contains a distributed financial exchange, where any user can place and fulfill bids to exchange currencies (issuances and XRP). Cross-currency payments automatically use the financial exchange to convert currency atomically at the time of sending. In this way, users who choose to become market makers provide the liquidity that makes the Ripple Network useful.

When adding a new gateway to the Ripple network, it is important to establish liquidity to other popular currencies. Because liquidity is provided by third-party market makers, a gateway can provide currency-exchange services through Ripple without having to keep a large reserve of currencies or shoulder the risk of financial exchange.

[Ripple Trade](https://www.rippletrade.com/) is the official client application, and it is used by a large number of market makers to participate in the global exchange. To make it easier on users to trade in ACME issuances, Ripple Labs can add a shortcut to ACME's gateway in Ripple Trade, so long as ACME meets [certain best-practice requirements](https://ripple.com/files/GB-2015-02.pdf).

Contact [partners@ripple.com](mailto:partners@ripple.com) for help establishing a market between your gateway and others, and about getting your gateway listed in Ripple Trade.


## Suggested Business Practices ##

The value of a gateway's issuances in Ripple comes directly from users' trust that users can redeem them with the gateway when needed. Since a gateway cannot pay out if it shuts down, it is also in customers' interest that a gateway does not shut down. There are a number of precaution a gateway can take that reduce the risk of business interruptions:

* Use [Hot and Cold Wallets](#hot-and-cold-wallets) to limit your risk profile on the network.
* Comply with anti-money-laundering regulations for your jurisdiction, such as the [Bank Secrecy Act](http://en.wikipedia.org/wiki/Bank_Secrecy_Act). This usually includes requirements to collect ["Know-Your-Customer" (KYC) information](http://en.wikipedia.org/wiki/Know_your_customer).
* Read and stay up-to-date with [Gateway Bulletins](https://ripple.com/knowledge_center/gateway-bulletins/), which provide news and suggestions for Ripple gateways.
* Clearly publicize all your policies and fees.


### Hot and Cold Wallets ###

It is strongly recommended that Ripple gateways employ a "hot wallet / cold wallet" strategy. This enforces a separation of roles that promotes strong security. ("Wallets" in Ripple are equivalent to Accounts.)

If a malicious person compromises a gateway's issuing account (cold wallet), that person could create an unlimited amount of new issuances, which makes it very difficult to redeem legitimately-held issuances fairly. In this case, the gateway must create a new issuing account, and all users with trust lines to the old gateway must create new trust lines to the new account. Thus, it's best to keep your issuing account as secure as possible.

The cold wallet is like a vault. It serves as the asset issuer, and should remain offline. The secret key that is used for this wallet is kept offline, accessible to only a few trusted operators. Periodically, a human operator creates and signs a transaction (preferably from an entirely offline machine) in order to refill the hot wallet's balance. Because the cold wallet is the account creating the issuances, customer accounts holding those issuances must trust the cold wallet. 

A hot wallet is like a cash register. It makes payments to the gateway's users in Ripple by sending them issuances created by the cold wallet. The secret key for a hot wallet is, by necessity, stored on a server that is connected to the outside internet, usually in a configuration file on a public-facing server. Because it holds issuances created by the cold walet, each hot wallet needs a trust line to the cold wallet. Customers do not, and should not, trust hot wallet accounts.

(Unlike a cash register, the hot wallet does not have to handle incoming payments from users, because the cold wallet can receive and monitor payments without using its secret key. To make things simple for your users, we recommend treating incoming payments to the hot and cold wallets as the same.)

A gateway can use one or more "hot wallet" accounts, but each hot wallet has a limited balance of the gateway's issuances. If a hot wallet is compromised, the gateway only loses as much currency as that account holds. Customers do not need to change any configuration in order to receive funds from a new hot wallet. However, the gateway must monitor the hot wallet's balance so that it doesn't run out of funds during ordinary operation.

### Warm Wallets ###

Another optional step that a gateway can take to balance risk and convenience is to use "warm wallets" as an intermediate step between cold wallet and hot wallet. Frequently, the software that runs a gateway's daily operations uses a single hot wallet. The gateway can operate additional accounts as warm wallets, whose keys are entrusted to different trusted users and whose keys are also not stored for use by the gateway software. 

When the hot wallet is running low on funds, the warm wallets can be used to refill it. When the warm wallets run low on funds, the cold wallet can issue more currency to a warm wallet in a single transaction, and the warm wallets can distribute that currency among themselves if necessary. This improves security of the cold wallet, since it makes as few transactions as possible, without leaving too much money in the control of a single automated hot wallet.

As with hot wallets, warm wallets must trust the cold wallet, and should not be trusted by users. All precautions that apply to hot wallets also apply to warm wallets.

### Funds Lifecycle ###

Funds in Ripple tend to flow in a cycle, from the cold wallet to the warm wallets, then the warm wallets, to customers, and eventually from customers back to the cold wallet. Issuances (any non-XRP balance in Ripple) are always tied to a trust line, so each payment "ripples" through ACME's issuing account on the trust lines connected to it. Ultimately, the lifecycle of issuances in Ripple looks something like this:

![Funds flow diagram](img/e2g-funds_flow.png)

1. Alice [initiates a payment from ACME to Ripple](#sending-from-gateway-to-ripple). Outside of Ripple, ACME debits Alice's account. Then ACME sends a Ripple payment of EUR.ACME from ACME's hot wallet account to Alice's Ripple account.
2. ACME refills its hot wallet using EUR.ACME from its warm wallet.
3. ACME refills its warm wallet by issuing new EUR.ACME from its cold wallet.
4. Alice [initiates a payment from Ripple to ACME](#sending-from-ripple-to-gateway). This is basically the reverse of the initial step. Alice redeems issuances of EUR.ACME by sending them to ACME's cold wallet. Outside of Ripple, ACME credits Alice for the amount it received.


## Fees and Revenue Sources ##

There are several ways in which a gateway can seek to benefit financially from Ripple integration. These can include:

* Withdrawal and Deposit fees. It is typical for a gateway to charge a small fee (such as 1%) for the service of adding or removing money from Ripple. You have the power to determine the rate you credit people when they move money onto and off of Ripple through your gateway.
* Transfer fees. You can set a percentage fee to charge automatically when Ripple users send each other issuances created by your account. This amount is debited from the Ripple ledger, decreasing your obligation each time your issuances change hands. See [TransferRate](#transferrate) for details.
* Indirect revenue from value added. Ripple integration can provide valuable functionality for your customers that distinguishes your business from your competitors.
* Interest on Ripple-backed funds. You can keep some of your Ripple-backing currency in an external account that earns interest. Just make sure you can always access enough funds to service customer withdrawals.
* [Market making](#market-makers). A gateway can also make offers to buy and sell its issuances for other issuances on Ripple, providing liquidity to cross-currency payments and possibly making a profit. (As with any market making opportunity, profits are not guaranteed.)


### Choosing Fee Rates ###

Fees imposed by gateways are optional. Obviously, higher fees mean more revenue when a gateway's services are used. On the other hand, having high fees decreases the desirability of your gateway's issuances and services, which incentivizes customers to use other gateways instead. Consider the fees that are charged by other gateways, especially ones issuing similar currencies, as well as traditional payment systems outside of Ripple, such as wire fees. Choosing the right fee structure is a matter of balancing your pricing with what the market will pay.



# Ripple Integration #

## Before Ripple Integration ##

Our example exchange, ACME, already accepts withdrawals and deposits from users using some existing system, and uses an internal accounting system to track how much balance each user has with the exchange. Such a system can be modeled simply with a balance sheet and tracking how much currency each user has on hand.

In the following diagram, ACME Exchange starts with €5 on hand, including €1 that belongs to Bob, €2 that belongs to Charlie, and an additional €2 of equity that belongs to ACME itself. Alice deposits €5, so ACME adds her to its balance sheet and ends up with €10.

![Alice sends €5 to ACME. ACME adds her balance to its balance sheet.](img/e2g-01.png)

**Assumptions:** To integrate with Ripple, we assume that an exchange such as ACME meets the following assumptions:

* ACME already has a system to accept deposits and withdrawals from some outside payment source. 
* ACME waits for deposits to clear before crediting them internally.
* ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
    * ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.

## Sending from Gateway to Ripple ##

Ripple payments can automatically bridge between currencies, but an issuing gateway normally only sends single-currency payments that go directly to users. This means debiting a user's current balance, and then sending the equivalent amount of issuances in Ripple to the user's Ripple account. 

An example flow for a payment into Ripple:

1. Alice asks to send €3 of her ACME balance into Ripple.
2. Internally, ACME debits Alice's balance €3.
3. ACME submits a Ripple transaction, sending €3 to Alice's Ripple address. The €3 is marked in the Ripple network as being "issued" by ACME (3 EUR.ACME).

**Assumptions:** 

* Alice already has an account in the Ripple network separate from her ACME account, which she manages using an application such as Ripple Trade.

![ACME issues 3 EUR.ACME to Alice on Ripple](img/e2g-02.png)



### Requirements for Sending to Ripple ###

There are several prerequisites that ACME must meet in order for this to happen:

- ACME modifies its core accounting system to track money that is backing funds issued on the Ripple Network. ACME can query Ripple to see who holds its Ripple issuances at any time.
    - Optionally, a gateway can take additional steps to separate the assets backing the gateway's Ripple issuances. For example, the funds allocated to Ripple can be stored in a separate "Ripple Escrow" bank account. A cryptocurrency exchange can create a separate wallet to hold the funds allocated to Ripple, as publicly-verifiable proof to customers that the gateway is solvent.
- ACME must have an account on the Ripple network. Our best practices recommend actually having at least two accounts: a "cold wallet" account to issue currency, and one or more "hot wallet" accounts that perform day-to-day transactions. See [Hot and Cold Wallets](#hot-and-cold-wallets) for more information.
    - ACME must enable the [DefaultRipple Flag](#defaultripple) on its issuing account in order for users to send and receive its issuances.
- Alice must create a trustline from her Ripple account to ACME's issuing (cold wallet) account. She can do this from any Ripple client application as long as she knows the address or Ripple Name of ACME's cold wallet.
    - In order to do this, Alice needs to find the address of ACME's cold wallet. ACME can publicize its cold wallet address on its website, or have its gateway listed in a client such as Ripple Trade. See [Setting Trust Lines in Ripple Trade](#setting-trust-lines-in-ripple-trade).
- ACME must create a user interface for Alice to send funds from ACME into Ripple.
    - In order to do this, ACME needs to know Alice's Ripple address. ACME can have Alice input her Ripple addresss as part of the interface, or ACME can require Alice to input and verify her Ripple address in advance.

See [Sending Payments to Users](#sending-payments-to-users) for an example of how to send payments into Ripple.


## Sending from Ripple to Gateway ##

A payment out of Ripple means the Gateway receives a payment in the Ripple network, and credits a user outside of Ripple.

An example flow of a payment out of Ripple:

1. Bob sends Ripple transaction of €1 to ACME's cold wallet.
2. In its internal accounting, credits Bob's balance €1.

Payments going from Ripple to a gateway can be single-currency or cross-currency payments. Users can choose the exchange rates in a Ripple client application such as Ripple Trade, so that the gateway receives issuances created by its cold wallet account.

### Requirements for Receiving from Ripple ###

In addition to the [requirements for making deposits possible](#deposit-requirements), there are several prerequisites that ACME must meet in order to process payments coming from Ripple:

- ACME must monitor its cold and hot wallet Ripple accounts for incoming payments.
- ACME must know which user to credit internally for the incoming payments.
    - We recommend that ACME should [bounce any unrecognized incoming payments](#bouncing-payments) back to their sender.
    - Typically, the preferred method of recognizing incoming payments is through [destination tags](#destination-tags).


## Precautions ##

Processing payments to and from Ripple naturally comes with some risks, so a gateway should be sure to take care in implementing these processes. We recommend the following precautions:

- Protect yourself against reversible deposits. Ripple payments are irreversible, but many electronic money systems like credit cards or PayPal are not. Scammers can abuse this to take their fiat money back by canceling a deposit after receiving Ripple issuances.
- When sending into Ripple, specify the cold wallet as the issuer of the currency. Otherwise, you might accidentally use paths that deliver the same currency issued by other accounts.
- Before sending a payment into Ripple, double check the cost of the payment. A simple payment from your hot wallet to a customer should not cost more than the destination amount plus any [transfer fee](#transferrate) you have set.
- Before processing a payment out of Ripple, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you, and it is also an important element of most anti-money-laundering regulations. This is especially important because the users sending money from Ripple could be different than the ones that initially received the money in Ripple.
- Follow the guidelines for [reliable transaction submission](#reliable-transaction-submission) when sending Ripple transactions.
- [Robustly monitor for incoming payments](#robustly-monitoring-for-payments), and read the correct amount. Don't mistakenly credit someone the full amount if they only sent a [partial payment](transactions.html#partial-payments).
- Track your obligations and balances within the Ripple network, and compare with your assets off the network. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Proactively avoid ambiguous situations. We recommend the following:
    - Enable the [`DisallowXRP` flag](#disallowxrp) for the cold wallet account and all hot wallet accounts, so users do not accidentally send you XRP. (Private exchanges should *not* set this flag, since they trade XRP normally.)
    - Enable the [`RequireDest` flag](#requiredest) for the cold wallet account and all hot wallet accounts, so users do not accidentally send a payment without the destination tag to indicate who should be credited.
    - Enable the [`RequireAuth` flag](#requireauth) on all hot wallet accounts so they cannot unintentionally create their own issuances.
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly withdraw and deposit funds in Ripple, as a denial of service attack that effectively empties the hot wallet. Suspend users whose accounts are involved in suspicious behavior by not processing their Ripple payments.


## Trading on Ripple ##

After the issuances have been created in Ripple, they can be freely transferred and traded by Ripple users. There are several consequences of this situation:

- Anyone can buy/sell EUR.ACME on Ripple. If ACME issues multiple currencies on Ripple, a separate trust line is necessary for each.
    - This includes users who do not have an account with ACME Exchange. In order to withdraw the funds successfully from ACME, users still have to create ACME accounts.
    - Optionally, use the [Authorized Accounts](#authorized-accounts) feature to limit who can hold EUR.ACME on Ripple.
    - If a gateway determines that a user has acted in bad faith, the gateway can [Freeze](#freezes) that user's trust line to the gateway, so that the user can no longer trade in the gateway's issuances.
- Ripple users trading and sending EUR.ACME to one another requires no intervention by ACME.
- All exchanges and balances on Ripple are publicly viewable in the shared, global ledger. 

The following diagram depicts a simple Ripple payment sending 2EUR.ACME from Alice to Charlie. ACME can query Ripple to see updates to its balances any time after the transaction has occurred:

![Alice's sends 2 EUR.ACME from her trust line to Charlie's](img/e2g-03.png)


## Market Makers ##

Exchanging EUR.ACME for other currencies within Ripple requires market makers who are willing to exchange other Ripple issuances for EUR.ACME. Market makers are just Ripple accounts with trust lines for EUR.ACME as well as other currencies or issuers, who create orders (called "offers" in the Ripple ledger) to exchange currency. The cost of exchanging EUR.ACME for another currency depends on the quantity and quality of orders. 

To facilitate exchanging currency, ACME may decide to become its own market maker. For various reasons, we recommend using a separate Ripple account for trading. Because market making can result in financial losses, gateways that choose to act as market makers should not use customer funds for market making.

For more information about how and why to become a market maker, see the [Maket Makers Whitepaper (PDF)](https://ripple.com/files/ripple_mm.pdf).


## Freezes ##

Ripple provides the ability to freeze assets issued by the gateway in Ripple as a means of complying with regulatory requirements:

* Gateways can freeze individual account issuances, in case a user account shows suspicious activity or violates a gateway's terms of use.
* Gateways can freeze all issuances created by their cold wallet, in case of a compromised gateway account or for migrating cold wallets.
* Furthermore, gateways can permanently opt out of their ability to freeze issuances at all. This allows a gateway to assure its users that it will continue to provide "physical-money-like" services.

For more information, see the [Gateway Bulletin on Freezes](https://ripple.com/files/GB-2014-02.pdf).


## Authorized Accounts ##

Ripple's Authorized Accounts feature enables a gateway to limit who can hold that gateway's issuances, so that unknown Ripple accounts cannot hold the currency your gateway issues. We feel this is *not necessary* in most cases, since gateways have full control over the process of redeeming Ripple balances for value in the outside world. (You can collect customer information and impose limits on withdrawals at that stage without worrying about what happens within the Ripple network.)

To use the Authorized Accounts feature, a gateway enables the `RequireAuth` flag for its cold wallet account, and then individually approves each user account's trust line before sending issuances in Ripple to that account.

You must authorize trust lines using the same cold wallet account that issues the currency, which unfortunately means an increased risk exposure for that account. The process for sending funds into Ripple with RequireAuth enabled looks like the following:

1. ACME publishes the address of its cold wallet to users.
2. Alice extends a trust line from her Ripple account to ACME's cold wallet, indicating that she is willing to hold ACME's issuances.
3. ACME's cold wallet sends a transaction authorizing Alice's trust line.

See [RequireAuth](#requireauth) for technical details on how to use authorized accounts.


## Source and Destination Tags ##

*Destination Tags* are a feature of Ripple payments can be used to identify the beneficiary or destination for a payment. For example, a Ripple payment to a gateway may include a destination tag to indicate which customer should be credited for the payment. A gateway should maintain an internal mapping of destination tags to (non-Ripple) account records. 

Similarly, *Source Tags* indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to bounce the payment. When you bounce an incoming payment, use the Source Tag from the incoming payment as the Destination Tag of the outgoing (bounce) payment.

We recommend providing several kinds of Destination Tags for different purposes:

* Direct mappings to user accounts
* Matching the Source Tags on outgoing payments (in case your payments get bounced)
* Tags for quotes, which expire
* Other disposable destination tags that users can generate.

See [Generating Source and Destination Tags](#generating-source-and-destination-tags) for recommendations on the tehnical details of making and using Source Tags and Destination Tags.


# Technical Details #

## Infrastructure ##

For the gateway's own security as well as the stability of the network, we recommend that each gateway operate its own `rippled` servers, along with any other important infrastructure necessary for the gateway's operation. Ripple Labs provides detailed and individualized recommendations to businesses interested in operating a significant Ripple-based business.

Contact [partners@ripple.com](mailto:partners@ripple.com) to see how Ripple Labs can help.

### APIs and Middleware ###

There are several interfaces you can use to connect to Ripple, depending on your needs and your existing software:

* [`rippled`](rippled-apis.html) provides JSON-RPC and WebSocket APIs that can be used as a low-level interface to all core Ripple functionality.
    * The official client library to rippled, [ripple-lib](https://github.com/ripple/ripple-lib) is available for JavaScript, and provides extended convenience features.
* [Ripple-REST](ripple-rest.html) provides an easy-to-use RESTful API on top of `rippled`. In particular, Ripple-REST is designed to be easier to use from statically-typed languages.


## Tool Security ##

Any time you submit a Ripple transaction, it must be signed using your secret. However, having your secret means having full control over your account. Therefore, you should never transmit your secret to a server operated by someone else. Instead, use your own server or client application to sign the transactions before sending them out.

The examples in this document show Ripple-REST API methods that include an account secret. This is only safe if you control the Ripple-REST server yourself, *and* you connect to it over a connection that is secure from outside listeners. (For example, you could connect over a loopback (localhost) network, a private subnet, or an encrypted VPN.) Alternatively, you could operate your own `rippled` server; or you can use a client application such as `ripple-lib` to perform local signing before submitting your transactions to a third-party server.


## DefaultRipple ##

The DefaultRipple flag controls whether the balances held in an account's trust lines are [allowed to ripple](https://ripple.com/knowledge_center/understanding-the-noripple-flag/) by default. Rippling is what allows users to trade issuances, so a gateway must allow rippling on all the trust lines connected to its issuing (cold wallet) account.

Before asking users to trust its issuing account, a gateway should enable the DefaultRipple flag on that account. Otherwise, the gateway must individually disable the NoRipple flag for each trust line that other accounts extend to it.

*Note:* Ripple-REST (as of version 1.4.0) does not yet support retrieving or setting the DefaultRipple flag.

The following is an example of using a local [`rippled` JSON-RPC API](ripple-rest.html#update-account-settings) to enable the DefaultRipple flag:

Request:

```
POST http://localhost:8088/
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 8,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

_(**Reminder:** Don't send your secret to a server you do not control.)_

Response:

```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200032200000000240000003E202100000008684000000000003A98732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D8F2DEF27DE313E3F0D1E189BF5AC8879F591045950E2A33787C3051169038C80220728A548F188F882EA40A416CCAF2AC52F3ED679563BBE1BAC014BB9E773A333581144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Fee": "15000",
            "Flags": 0,
            "Sequence": 62,
            "SetFlag": 8,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "AccountSet",
            "TxnSignature": "3045022100D8F2DEF27DE313E3F0D1E189BF5AC8879F591045950E2A33787C3051169038C80220728A548F188F882EA40A416CCAF2AC52F3ED679563BBE1BAC014BB9E773A3335",
            "hash": "665B27B64CE658704FFD326A4FE2F5F5B5E67EACA61DE08258A59D35B883E1D5"
        }
    }
}
```

To confirm that an account has DefaultRipple enabled, look up the account using the [account_info command](rippled-apis.html#account-info), specifying a validated ledger version. Use [a bitwise-AND operator](https://en.wikipedia.org/wiki/Bitwise_operation#AND) to compare the `Flags` field with 0x00800000 (the [ledger flag lsfDefaultRipple](https://wiki.ripple.com/Ledger_Format#AccountRoot)). If the result of the bitwise-AND operation is nonzero, then the account has DefaultRipple enabled.


## Generating Source and Destination Tags ##

You need a scheme to create Source and Destination tags for your users and payments. (See [Source and Destination Tags](#source-and-destination-tags) for an explanation of what Source and Destination Tags are.)

For greater privacy and security, we recommend *not* using monotonically-incrementing numbers as destination tags that correlate 1:1 with users. Instead, we recommend using convenient internal IDs, but mapping those to destination tags through the use of a quick hash or cipher function such as [Hasty Pudding](http://en.wikipedia.org/wiki/Hasty_Pudding_cipher). You should set aside ranges of internal numbers for different uses of destination tags.

After passing the internal numbers through your hash function, you can use the result as a destination tag. You should check for collisions just to be safe, and do not reuse destination tags unless they have explicit expiration dates (like quotes and user-generated tags).

We recommend making a user interface to generate a destination tag on-demand when a user intends to send money to the gateway. Then, consider that destination tag valid only for a payment with the expected amount. Later, bounce any other transactions that reuse the same destination tag.

Enable the [RequireDest](#requiredest) flag on your hot and cold wallet accounts so that users must use a destination tag to indicate where funds should go when they send Ripple payments to your gateway.


## DisallowXRP ##

The DisallowXRP flag (`disallow_xrp` in Ripple-REST) is designed to discourage users from sending XRP to an account by accident. This reduces the costs and effort of bouncing undesired payments, if you operate a gateway that does not trade XRP. The DisallowXRP flag is not strictly enforced, because doing so could allow accounts to become permanently unusable if they run out of XRP. Client applications should honor the DisallowXRP flag, but it is intentionally possible to work around. 

An issuing gateway that does not trade XRP should enable the DisallowXRP flag on all gateway hot and cold wallets. A private exchange that trades in XRP should only enable the DisallowXRP flag on accounts that are not expected to receive XRP.

The following is an example of a [Ripple-REST Update Account Settings request](ripple-rest.html#update-account-settings) to enable the DisallowXRP flag:

Request:

```
POST /v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "settings": {
    "disallow_xrp": true
  }
}
```

_(**Reminder:** Don't send your secret to a server you do not control.)_

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

The value `"disallow_xrp": true` indicates that the DisallowXRP flag is enabled. A successful response shows `"state": "validated"` when the change has been accepted into a validated Ripple ledger.


## RequireDest ##

The `RequireDest` flag (`require_destination_tag` in Ripple-REST) is designed to prevent users from sending payments to your account while accidentally forgetting the [destination tag](#source-and-destination-tags) that identifies who should be credited for the payment. When enabled, the Ripple Network rejects any payment to your account that does not specify a destination tag.

We recommend enabling the RequireDest flag on all gateway hot and cold wallets.

The following is an example of a [Ripple-REST Update Account Settings request](ripple-rest.html#update-account-settings) to enable the RequireDest flag.

Request:

```
POST /v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "settings": {
    "require_destination_tag": true
  }
}
```
_(**Reminder:** Don't send your secret to a server you do not control.)_

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

The value `"require_destination_tag": true` indicates that the RequireDest flag has been enabled. A successful response shows `"state": "validated"` when the change has been accepted into a validated Ripple ledger.


## RequireAuth ##

The `RequireAuth` flag (`require_authorization` in Ripple-REST) prevents a Ripple account's issuances from being held by other users unless the issuer approves them. 

We recommend enabling RequireAuth for all hot wallet (and warm wallet) accounts, as a precaution. Separately, the Authorized Accounts feature involves [setting the RequireAuth flag on your cold wallet](#with-cold-wallets).

You can only enable RequireAuth if the account owns no trust lines and no offers in the Ripple ledger, so you must decide whether or not to use it before you start doing business in the Ripple network.

### With Hot Wallets ###

We recommend enabling `RequireAuth` for all hot wallet accounts, and then never approving any accounts, in order to prevent hot wallets from creating issuances even by accident. This is a purely precuationary measure, and does not impede the ability of those accounts to transfer issuances created by the cold wallet, as they are intended to do.

The following is an example of a [Ripple-REST Update Account Settings request](ripple-rest.html#update-account-settings) to enable the RequireDest flag. (This method works the same way regardless of whether the account is used as a hot wallet or cold wallet.)

Request:

```
POST /v1/accounts/rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW/settings?validated=true

{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "settings": {
    "require_authorization": true
  }
}
```
_(**Reminder:** Don't send your secret to a server you do not control.)_

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

You may also enable `RequireAuth` for your cold wallet in order to use the [Authorized Accounts](#authorized-accounts) feature. The procedure to enable the RequireAuth flag for a cold wallet is the same as [with hot wallets](#with-hot-wallets).

If ACME decides to use Authorized Accounts, ACME creates an interface for users to get their Ripple trust lines authorized by ACME's cold account. After Alice has extended a trust line to ACME from her Ripple account, she goes through the interface on ACME's website to require ACME authorize her trust line. ACME confirms that it has validated Alice's identity information, and then sends a TrustSet transaction to authorize Alice's trust line.

The following is an example of using the [Ripple-REST Grant Trustline method](ripple-rest.html#grant-trustline) to authorize the (customer) account rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn to hold issuances of USD from the (cold wallet) account rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW:

Request:

```
POST /v1/accounts/rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW/trustlines?validated=true
{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "trustline": {
    "limit": "0",
    "currency": "USD",
    "counterparty": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "authorized": true
  }
}
```
_(**Reminder:** Don't send your secret to a server you do not control.)_

Response:

```
201 Created
{
  "success": true,
  "trustline": {
    "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "limit": "0",
    "currency": "USD",
    "counterparty": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "account_allows_rippling": true,
    "account_trustline_frozen": false,
    "authorized": true
  },
  "hash": "4509288EE17F01C83FC7D45850EB066A795EE5DBA17BB4DC98DD4023D31EEE5B",
  "ledger": "11158585",
  "state": "validated"
}
```

A successful response shows `"state": "validated"` when the change has been accepted into a validated Ripple ledger.

## Robustly Monitoring for Payments ##

In order to robustly monitor incoming payments, gateways should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* [Look out for Partial Payments](https://ripple.com/files/GB-2014-06.pdf "Partial Payment Flag Gateway Bulletin"). If an incoming transaction has a `destination_balance_changes` field (Ripple-REST) or a `meta.delivered_amount` field (WebSocket/JSON-RPC), then use that to see how much money *actually* got delivered to the destination account. Payments with the partial-payment flag enabled are considered "successful" if any non-zero amount is delivered, even miniscule amounts. (The flag is called `"partial_payment": true` in REST, and `tfPartialPayment` in WebSocket/JSON-RPC) 
* Some transactions modify your balances without being payments directly to or from one of your accounts. For example, if ACME sets a nonzero [TransferRate](#transferrate), then ACME's cold wallet's outstanding obligations decrease each time Bob and Charlie exchange ACME issuances. See [TransferRate](#transferrate) for more information. 

To make things simpler for your users, we recommend monitoring for incoming payments to hot wallets and the cold wallet, and treating the two equivalently.

As an added precaution, we recommend comparing the balances of your Ripple cold wallet account with the Ripple-backing funds in your internal accounting system each time there is a new Ripple ledger. The cold wallet shows all outstanding issuances as negative balances, which should match the positive assets you have allocated to Ripple outside the network. If the two do not match up, then you should suspend processing payments in and out of Ripple until you have resolved the discrepancy. 

* Use the [Get Account Balances method](ripple-rest.html#get-account-balances) (Ripple-REST) or the [`account_lines` command](rippled-apis.html#account-lines) (rippled) to check your balances.
* If you have a [TransferRate](#transferrate) set, then your obligations within the Ripple network decrease slightly whenever other users transfer your issuances among themselves.


## TransferRate ##

The *TransferRate* setting (`transfer_rate` in Ripple-REST) defines a fee to charge for transferring issuances from one Ripple account to another. See [Transfer Fees](https://ripple.com/knowledge_center/transfer-fees/) in the Knowledge Center for more information.

The following is an example of a [Ripple-REST Update Account Settings request](ripple-rest.html#update-account-settings) to set the TransferRate for a fee of 0.5%.

Request:

```
POST /v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings?validated=true

{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "settings": {
    "transfer_rate": 1.005
  }
}

```
_(**Reminder:** Don't send your secret to a server you do not control.)_

Response:

```
200 OK

{
  "success": true,
  "settings": {
    "transfer_rate": 1.005,
    "require_destination_tag": false,
    "require_authorization": false,
    "disallow_xrp": false
  },
  "hash": "4D098C181DE0A21A55ACBD362E5ADBF24EA2493BD4E56F2137DBAF113327AB4E",
  "ledger": "11158720",
  "state": "validated"
}
```

The field `transfer_rate` in the `settings` object should have the value you set. A successful response shows `"state": "validated"` when the change has been accepted into a validated Ripple ledger.

### TransferRate with Hot and Warm Wallets ###

All Ripple Accounts, including the hot wallet, are subject to the TransferRate. If you set a nonzero TransferRate, then you must send extra (to pay the TransferRate) when making payments to users from your hot wallet. You can accomplish this by setting the `source_amount` plus `slippage` (Ripple-REST) or the `SendMax` (rippled) parameters higher than the destination amount.

**Note:** The TransferRate does not apply when sending issuances back to the account that created them. The account that created issuances must always accept them at face value on Ripple. This means that users don't have to pay the TransferRate if they send payments to the cold wallet directly, but they do when sending to the hot wallet. (For example, if ACME sets a TransferRate of 1%, a Ripple payment with `source_amount` and `destination_amount` of 5 EUR.ACME (and `slippage` of 0) would succeed if sent to ACME's cold wallet, but it would fail if sent to ACME's hot wallet. The hot wallet payment would only succeed if the `source_amount` plus `slippage` was at least 5.05 EUR.ACME.) If you accept payments to both accounts, you may want to adjust the amount you credit users in your external system to make up for fees they paid to redeem with the hot wallet.


## Sending Payments to Users ##

When you build an automated system to send payments into Ripple for your users, you must ensure that it constructs payments carefully. Malicious users are constantly trying to find ways to trick a system into paying them more money than it should. If you use Ripple-REST to construct payments, we recommend **not using** the Prepare Payment endpoint for payments from a hot wallet to a user. Sending from a hot wallet to a properly-configured user account requires only a default path, but the Prepare Payment method looks for _all_ possible paths to the destination account, including ones that have a higher `source_amount` than necessary.

The following template can be used with Ripple-REST's [Submit Payment method](ripple-rest.html#submit-payment). You should also follow the [reliable transaction submission](#reliable-transaction-submission) guidelines and persist a copy of the transaction before submitting it.

```
POST /v1/accounts/<HOT WALLET ADDRESS>/payments
{
  "secret": <HOT WALLET SECRET KEY>,
  "client_resource_id": <UNIQUE CLIENT RESOURCE ID>,
  "payment": {
      "source_account": <HOT WALLET ADDRESS>,
      "source_amount": {
        "value": <DESTINATION AMOUNT, for example "100">,
        "currency": <CURRENCY>,
        "issuer": <COLD WALLET ADDRESS>
      },
      "source_slippage": <DESTINATION AMOUNT * TRANSFER FEE, for example "0.5">,
      "source_tag": <OPTIONAL SOURCE TAG>,
      "destination_account": <CUSTOMER ADDRESS>,
      "destination_amount": {
        "value": <DESTINATION AMOUNT>,
        "currency": <CURRENCY>,
        "issuer": <COLD WALLET ADDRESS>
      }
  }
}
```

*Reminder: Don't send your secret to a server you do not control.*

In particular, note the following features of the payment object:

- No `paths` field. The payment will only succeed if it can use a default path, which is preferable. Using less direct paths can become much more expensive.
- The `issuer` of both the `source_amount` and the `destination_amount` is the cold wallet. This ensures that the transaction sends and delivers issuances from the cold wallet account, and not from some other gateway.
- The `source_amount` uses the same `value` as the `destination_amount`. The [transfer fee](#transferrate), if there is one, is covered by the `slippage` field.


## Bouncing Payments ##

When your hot or cold wallet receives a payment whose purpose is unclear, we recommend that you make an attempt to return the money to its sender. While this is more work than simply pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically. 

The first requirement to bouncing payments is [robustly monitoring for incoming payments](#robustly-monitoring-for-payments). You do not want to accidentally refund a user for more than they sent you! (This is particularly important if your bounce process is automated.) The [Partial Payment Flag Gateway Bulletin](https://ripple.com/files/GB-2014-06.pdf) explains how to avoid a common problem.

Second, you should send bounced payments as Partial Payments. Since other Ripple users can manipulate the cost of pathways between your accounts, Partial Payments allow you to divest yourself of the full amount without being concerned about exchange rates within the Ripple network. You should publicize your bounced payments policy as part of your terms of use. Send the bounced payment from an automated hot wallet or a human-operated warm wallet.

To send a Partial Payment in Ripple-REST, set the `partial_payment` field to true in the object returned by the [Prepare Payment method](ripple-rest.html#prepare-payment) before submitting it. Set the `source_amount` to be equal to the `destination_amount`. and the `slippage` to `"0"`. As long as your hot and cold wallets only send the currencies that your cold wallet issues, you should also remove the `paths` field, which is not necessary for simple payments. You should always specify your cold wallet as the issuer of the funds you want to deliver. (You can specify the issuer in the Prepare Payment request, or modify the `issuer` field of the `destination_amount` in the object you get back.)

It is conventional that you take the Source Tag from the incoming payment (`source_tag` in Ripple-REST) and use that value as the Destination Tag (`destination_tag` in Ripple-REST) for the return payment.

To prevent two systems from bouncing payments back and forth indefinitely, you can set a new Source Tag for the outgoing return payment. If you receive an unexpected payment whose Destination Tag matches the Source Tag of a return you sent, then do not bounce it back again. 

The following is an example of a [Ripple-REST Submit Payment request](ripple-rest.html#submit-payment) to send a return payment. Particularly important fields include the [*destination_tag*](#source-and-destination-tags), setting `"slippage": "0"`, `"partial_payment": true`, the lack of a `"paths"` field, and the `issuer` of the `destination_amount` being the cold wallet:

```
POST /v1/accounts/rBEXjfD3MuXKATePRwrk4AqgqzuD9JjQqv/payments?validated=true

{
  "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
  "client_resource_id": "fc521224-bdd8-4463-94a4-b26cb760fc92",
  "last_ledger_sequence": "10968788",
  "max_fee": "1.0",
  "payment": {
    "source_account": "rBEXjfD3MuXKATePRwrk4AqgqzuD9JjQqv",
    "source_tag": "479686",
    "source_amount": {
      "value": "2",
      "currency": "EUR",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    },
    "source_slippage": "0",
    "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "destination_tag": "803489",
    "destination_amount": {
      "value": "2",
      "currency": "EUR",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    },
    "invoice_id": "",
    "partial_payment": true,
    "no_direct_ripple": false
  }
}
```
_(**Reminder:** Don't send your secret to a server you do not control.)_


## Setting Trust Lines in Ripple Trade ##

As part of the [Hot and Cold Wallets](#hot-and-cold-wallets) model, each hot or warm wallet must have a trust line to the cold wallet. You can manually set up those trust lines by following these steps in the Ripple Trade client.

1. Log in and go to the **Fund** tab:
    ![Fund tab](img/connectgateway_01.png)
2. Click **Gateways** in the sidebar:
    ![Gateways](img/connectgateway_02.png)
3. Enter the Ripple Name or Ripple Address of the Gateway's **cold wallet**, and click **Save**.
    ![Enter gateway's name or address, then save](img/connectgateway_03.png)
4. Enter the Ripple Trade password, and click **Submit**. (This allows access to send a transaction to the Ripple Network to create the trust line.)
    ![Enter password and submit](img/connectgateway_04.png)
5. When the page shows a green "Gateway connected" box, the transaction to create the trust line has succeeded and the Ripple Network has validated it.
    ![Gateway connected](img/connectgateway_05.png)
    

## Reliable Transaction Submission ##

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions will be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

In order to achieve this, there are several steps you can take when submitting transactions:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (Ripple-REST and ripple-lib do this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose sequence number is less than or equal to the transaction's `LastLedgerSequence` parameter.

For additional information, consult the [Reliable Transaction Submission](reliable_tx.html) guide.


## ripple.txt and host-meta ##

The [ripple.txt](https://wiki.ripple.com/Ripple.txt) and host-meta standards provide a way to publish information about your gateway so that automated tools and applications can read and understand it.

For example, if you run a validating `rippled` server, you can use ripple.txt to publish the public key of your validating server. You can also publish information about what currencies your gateway issues, and which Ripple account addresses you control, to protect against impostors or confusion.

We recommend implementing one or both of ripple.txt and host-meta. (In the future, we expect ripple.txt to become obsolete, but not yet.)
