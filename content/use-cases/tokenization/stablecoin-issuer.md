---
html: stablecoin-issuer.html
parent: tokenization.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
---
# Stablecoin Issuer

**Stablecoin** are tokens that are backed by assets outside of the XRPL. Stablecoins allow users to transact in familiar currencies, and provide a convenient way to get funds into and out of the XRPL blockchain. In exchange for providing these services, stablecoin issuers can earn revenue in a variety of ways, including charging fees on withdrawals or transfers of the stablecoin.

While anyone can issue a token with any currency code in the XRP Ledger, stablecoins' value comes from the promise that they can be redeemed for the corresponding assets. Issuing a stablecoin may also involve regulatory obligations, which vary by jurisdiction. For these reasons, issuing a stablecoin generally requires an established, reputable business.

This article provides information you should know before issuing a stablecoin and summarizes the choices involved in setting up a stablecoin issuer.


## Background Information

### Trust Lines and Tokens

All assets in the XRP Ledger, except for the native cryptocurrency XRP, are represented as _tokens_, which are tied to a specific issuer who defines their meaning. The XRP Ledger has a system of directional accounting relationships, called _trust lines_, to make sure that users can only hold and receive the tokens they want. See [Trust Lines and Issuing](trust-lines-and-issuing.html).

Stablecoins include tokens backed by fiat currency in a bank account, by cryptocurrencies on another blockchain, or other types of assets and forms of value. The term _stablecoin_ comes from the idea that the exchange rate between the token and the asset it represents should be stable at 1:1 (minus fees).


### XRP

**XRP** is the native cryptocurrency of the XRP Ledger. XRP can be sent directly from any XRP Ledger address to any other. This helps make XRP a convenient bridge currency.

Token issuers do not need to accumulate or exchange XRP. They must only hold a small balance of XRP to meet the reserve requirement and pay the cost of sending transactions through the network. The XRP equivalent of $10 USD should be enough for at least one year of transaction costs for a busy issuer.

For more information, see [What is XRP?](what-is-xrp.html), [Reserves](reserves.html), and [Transaction Cost](transaction-cost.html)


### Liquidity and Trading

The XRP Ledger contains a decentralized exchange, where any user can place and fulfill bids to exchange XRP and tokens in any combination. The decentralized exchange also provides the liquidity that makes atomic [cross-currency payments](cross-currency-payments.html) possible.

Stablecoin issuers aren't required to use the decentralized exchange directly, but all tokens are automatically available for trading. If a token is widely used, users should naturally trade it among themselves, creating liquidity to other popular assets. An issuer might want to provide liquidity to XRP or other popular tokens at a baseline rate, especially when their token is new.

For more information on the decentralized exchange, see [Decentralized Exchange](decentralized-exchange.html).


## Suggested Business Practices

The value of a stablecoin issuer's tokens in the XRP Ledger comes directly from the trust that customers can redeem the tokens when needed. To reduce the risk of business interruptions, you should follow these best practices:

- Use separate [Issuing and Operational Addresses](account-types.html) to limit your risk profile on the network.
- Follow anti-money-laundering regulations for your jurisdiction, such as the [Bank Secrecy Act](http://en.wikipedia.org/wiki/Bank_Secrecy_Act). This usually includes requirements to collect ["Know-Your-Customer" (KYC) information](http://en.wikipedia.org/wiki/Know_your_customer).
- Complete the XRP Ledger Foundation's [token issuer self-assessment](https://foundation.xrpl.org/token-assessment-framework/).
- Publicize all your policies and fees.
- Provide an [`xrp-ledger.toml` file](xrp-ledger-toml.html) with domain verification so client applications can display relevant details about you.


### Hot and Cold Wallets

{% include '_snippets/issuing-and-operational-addresses-intro.md' %}

Main article: [Issuing and Operational Addresses](account-types.html)


## Fees and Revenue Sources

A stablecoin issuer can earn revenue in a variety of ways, including:

- Withdrawal or Deposit fees. The issuer can charge a small fee (such as 1%) for the service of moving money into or out of the XRP Ledger. This fee isn't assessed on the XRP Ledger, but in the issuer's own systems when deciding how much to issue or credit users.
- Transfer fees. The issuer can set a percentage fee to charge when users transfer the stablecoin within the XRP Ledger. This amount is debited from the XRP Ledger whenever users transact, decreasing the total obligation the stablecoin issuer owes to its users in the ledger without decreasing the amount of assets the issuer holds outside of the ledger. Balance your pricing with what the market is willing to pay.
- Indirect revenue from value added. Stablecoins provide convenient functionality that can ease the adoption of other, adjacent services.
- Interest on collateral. The issuer can hold the assets backing the stablecoin in an interest-earning account. Of course, they must make sure that they can always access enough funds to serve customer withdrawals.
- Financial exchange. The business can buy and sell its own stablecoins in the decentralized exchange, providing liquidity to cross-currency payments and possibly making a profit. (As with all financial exchange, profits are not guaranteed.)


## Compliance Guidelines

Token issuers are responsible for complying with local regulations and reporting to the appropriate agencies. Regulations vary by country and state. Before issuing a token, you should seek professional legal advice on the requirements for your jurisdiction and use case.

See [Stablecoin Issuer Compliance Guidelines](stablecoin-issuer-compliance-guidelines.html)


# An Example Cryptocurrency Exchange

The fictional cryptocurrency exchange "ACME Exchange" decides to issue an EUR stablecoin on the XRP Ledger. Here is the overall process and flow of funds.

## Before Integration

ACME, as a cryptocurrency exchange, already accepts withdrawals and deposits from customers using some system (such as an app or website). ACME has a _system of record_ to track how much each user holds with the exchange in each of several types of assets. Such a system can be modeled with a simple balance sheet, although in practice it probably involves databases, application servers, and various other infrastructure to ensure its reliability, information security, and so on.

In the following diagram, ACME Exchange starts with €5 on hand, including €1 that belongs to Bob, €2 that belongs to Charlie, and an additional €2 of equity that belongs to ACME itself. Alice deposits €5, so ACME adds her to its balance sheet and ends up with €10.

![Diagram: Alice sends €5 to ACME. ACME adds her balance to its balance sheet.](img/e2g-01.png)

For an exchange such as ACME to integrate with the XRP Ledger, make the following assumptions:

- ACME already has a system to accept deposits and withdrawals from some outside payment source.
- ACME waits for deposits to clear before crediting them in ACME's system of record.
- ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
- ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.
    
There are additional considerations before issuing a stablecoin. See [Stablecoin Precautions](stablecoin-issuer-precautions.html)

## Sending into the XRP Ledger

Sending money _into_ the XRP Ledger involves issuing new stablecoins for an amount that ACME holds on behalf of one of its users. An example flow might look like this:

1. Alice asks to send €3 of her ACME balance into the XRP Ledger.
2. In its system of record, ACME debits Alice's balance €3.
3. ACME submits an XRP Ledger transaction, sending €3 to Alice's XRP Ledger address. The €3 is marked in the XRP Ledger as being "issued" by ACME (3 EUR.ACME).

This assumes that Alice already has an address in the XRP Ledger, separate from her ACME account. Alice manages her XRP Ledger address using a third-party client application (wallet).

![Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger](img/e2g-02.png)

<!--{# Disabled: UMLet version of this diagram.
{{ include_svg("img/gateway-to-xrpl.svg", "Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger") }}
#}-->

After this, Alice can send or trade her EUR.ACME to other users in the XRP Ledger at her discretion. At any time, ACME can query the XRP Ledger to see who currently holds its tokens. 

### Requirements for Sending to XRP Ledger

There are several prerequisites that ACME must meet for this to happen:

- ACME sets aside the funds that back its stablecoin. There are several ways ACME might do this:
    - ACME can create an XRP Ledger collateral account in ACME's system of record.
    - ACME can store the funds allocated to the XRP Ledger in a separate bank account.
    - If the stablecoin is backed by cryptocurrency, ACME can create a separate wallet to hold the funds allocated to the XRP Ledger, as publicly verifiable proof of its reserves.
- ACME should control two separate XRP Ledger addresses.
    - ACME must enable the Default Ripple flag on its issuing address for customers to send and receive its tokens.
- Alice must create an accounting relationship (trust line) from her XRP Ledger address to ACME's issuing address. She can do this from any XRP Ledger client application as long as she knows ACME's issuing address.
    - ACME should publicize its issuing address on its website where customers can find it. It can also use an [`xrp-ledger.toml` file](xrp-ledger-toml.html) to publish the issuing address to automated systems.
	- Rather than sending a Payment, ACME could write Alice a check in the XRP Ledger. This does not move any money right away, but creates both the trust line and the tokens together when Alice cashes the check.
- ACME must create a user interface for Alice to request her funds from ACME to be sent to the XRP Ledger.
    - ACME needs to know Alice's XRP Ledger address. ACME can have Alice input her XRP Ledger address as part of the interface, or ACME can require Alice to input and verify her XRP Ledger address in advance.


## Sending from XRP Ledger

A payment out of the XRP Ledger means the issuer receives a payment in the XRP Ledger, and credits a user in the issuer's system of record.

An example flow of a payment out of the XRP Ledger:

1. Bob sends an XRP Ledger transaction of €1 to ACME's issuing address.
2. In ACME's system of record, ACME credits Bob's balance €1.
3. Later, Bob can use ACME's own interface to withdraw the money to a separate account, such as requesting a bank deposit over the SEPA system (Europe) or ACH (United States), receiving a payment on another blockchain, or something else.

XRP Ledger Payments going to an issuer can be single-currency or cross-currency payments, but the amount the issuer receives is typically denominated in the stablecoin it issued.


### Requirements for Receiving from XRP Ledger

In addition to the requirements for sending into the XRP Ledger, there are several prerequisites that ACME must meet to process payments coming from the XRP Ledger:

- ACME must monitor its XRP Ledger addresses for incoming payments.
- ACME must know which user to credit in its system of record for the incoming payments.
    - ACME should bounce unrecognized incoming payments back to their sender.
    - Typically, the preferred method of recognizing incoming payments is through [destination tags](source-and-destination-tags.html).



## Trading on the XRP Ledger

After the tokens have been created in the XRP Ledger, they can be freely transferred and traded by XRP Ledger users. There are several consequences of this situation:

- Anyone can buy/sell EUR.ACME on the XRP Ledger. If ACME issues multiple tokens, a separate trust line is necessary for each.
    - This includes XRP Ledger users who do not have an account in ACME Exchange's systems. To withdraw the funds successfully from ACME, users still have to register with ACME.
    - Optionally, ACME uses the [Authorized Trust Lines](#authorized-trust-lines) feature to limit who can hold EUR.ACME in the XRP Ledger.
    - If ACME determines that a customer has acted in bad faith, ACME can [Freeze](#freeze) that user's accounting relationships to ACME in the XRP Ledger, so that the user can no longer trade in the issuer's tokens.
- XRP Ledger users trading and sending EUR.ACME to one another requires no intervention by ACME.
- All exchanges and balances in the XRP Ledger are publicly viewable.

The following diagram depicts an XRP Ledger payment sending 2 EUR.ACME from Alice to Charlie. ACME can query the XRP Ledger to see updates to its balances any time after the transaction has occurred:

![Diagram: Alice's sends 2 EUR.ACME from her trust line to Charlie's](img/e2g-03.png)

## Freeze

An issuer can freeze accounting relationships in the XRP Ledger to meet regulatory requirements:

- Issuers can freeze individual accounting relationships, in case a customer address shows suspicious activity or violates a issuer's terms of use.
- Issuers can freeze all tokens they issue, in case of a major security compromise or for migrating to a new issuing address.
- Furthermore, issuers can permanently opt out of their ability to freeze accounting relationships. This allows an issuer to assure its customers that it will continue to provide "physical-money-like" services. <!-- STYLE_OVERRIDE: will -->

For more information, see the [Freeze article](freezes.html).


## Authorized Trust Lines

The XRP Ledger's Authorized Trust Lines feature (formerly called "Authorized Accounts") enables an issuer to limit who can hold that issuer's tokens, so that unknown XRP Ledger addresses cannot hold the tokens.

For more information, see [Authorized Trust Lines](authorized-trust-lines.html).


## Source and Destination Tags

_Destination Tags_ are a feature of XRP Ledger payments can be used to indicate the beneficiary or destination for a payment. For example, an XRP Ledger payment to an issuer may include a destination tag to indicate which customer should be credited for the payment. An issuer should keep a mapping of destination tags to accounts in the issuer's system of record.

Similarly, _Source Tags_ indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to bounce the payment. When you bounce an incoming payment, use the Source Tag from the incoming payment as the Destination Tag of the outgoing (bounce) payment.

You can generate a destination tag on-demand when a customer intends to send money to you. For greater customer privacy, you should consider that destination tag valid only for that payment with the expected amount, and bounce or ignore any other transactions that reuse the same destination tag.

[Enable the Require Destination Tag setting](require-destination-tags.html) on your issuing and operational addresses so that customers must use a destination tag to indicate where funds should be credited when they send payments to you.

For more information, see [Source and Destination Tags](source-and-destination-tags.html).

Next: [Technical Details for Issuing a Stablecoin](stablecoin-issuer-technical-details.html)
