---
html: stablecoin-issuer.html
parent: tokenization.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
---
# Stablecoin Issuer

**Stablecoin** are [tokens](tokens.html) that are backed by assets in the outside world. Stablecoins allow users to transact in familiar currencies, and provide a convenient way to get funds into and out of the blockchain. In exchange for providing these services, stablecoin issuers can earn revenue in various ways, such as fees on withdrawals or transfers of the stablecoin.

While anyone can issue a token with any currency code in the XRP Ledger, stablecoins' value comes from the promise that they can be redeemed for the corresponding assets. Issuing a stablecoin may also involve regulatory obligations, which vary by jurisdiction. For these reasons, issuing a stablecoin generally requires a reputable business.

**Note:** Stablecoin issuers on the XRP Ledger were formerly called "gateways".

This article provides information you should know before issuing a stablecoin, summarizes the choices involved in setting up a stablecoin issuer, and provides resources for implementing the technical integration with the XRP Ledger.


## Background Information

### Trust Lines and Tokens

All assets in the XRP Ledger, except for the native cryptocurrency XRP, are represented as _tokens_, which are tied to a specific issuer who defines their meaning. The XRP Ledger has a system of directional accounting relationships, called _trust lines_, to make sure that users can only hold and receive the tokens they want.

Tokens that are backed by funds in some outside system are sometimes called _stablecoins_. This includes tokens backed by fiat currency in a bank account, by cryptocurrencies on another blockchain, or other types of assets and forms of value. The term "stablecoin" comes from the idea that the exchange rate between the token and the asset it represents should be "stable" at 1:1 (minus fees).

For more information, see [Trust Lines and Issuing](trust-lines-and-issuing.html).


### XRP

**XRP** is the native cryptocurrency of the XRP Ledger. XRP can be sent directly from any XRP Ledger address to any other. This helps make XRP a convenient bridge currency.

Token issuers do not need to accumulate or exchange XRP. They must only hold a small balance of XRP to meet the reserve requirement and pay the cost of sending transactions through the network. The XRP equivalent of $10 USD should be enough for at least one year of transaction costs for a busy issuer.

For more information, see [What is XRP?](what-is-xrp.html), [Reserves](reserves.html), and [Transaction Cost](transaction-cost.html)


### Liquidity and Trading

The XRP Ledger contains a decentralized exchange, where any user can place and fulfill bids to exchange XRP and tokens in any combination. The decentralized exchange also provides the liquidity that makes atomic [cross-currency payments](cross-currency-payments.html) possible.

Stablecoin issuers aren't required to use the decentralized exchange directly, but all tokens are automatically available for trading. If a token is widely used, users should naturally trade it among themselves, creating liquidity to other popular assets. An issuer _may_ want to provide liquidity to XRP or other popular tokens at a baseline rate, especially when their token is new. If a stablecoin issuer does provide liquidity, a best practice is to **use different addresses for trading and for issuing.**

For more information on the decentralized exchange, see [Decentralized Exchange](decentralized-exchange.html).


## Suggested Business Practices

The value of a stablecoin issuer's tokens in the XRP Ledger comes directly from the trust that customers can redeem the tokens when needed. To reduce the risk of business interruptions, you should follow these best practices:

* Use separate [Issuing and Operational Addresses](account-types.html) to limit your risk profile on the network.
* Follow anti-money-laundering regulations for your jurisdiction, such as the [Bank Secrecy Act](http://en.wikipedia.org/wiki/Bank_Secrecy_Act). This usually includes requirements to collect ["Know-Your-Customer" (KYC) information](http://en.wikipedia.org/wiki/Know_your_customer).
* Complete the XRP Ledger Foundation's [token issuer self-assessment](https://foundation.xrpl.org/token-assessment-framework/).
* Publicize all your policies and fees.
* Provide an [`xrp-ledger.toml` file](xrp-ledger-toml.html) with domain verification so client applications can display relevant details about you.


### Hot and Cold Wallets

{% include '_snippets/issuing-and-operational-addresses-intro.md' %}

Main article: [Issuing and Operational Addresses](account-types.html)


## Fees and Revenue Sources

A stablecoin issuer can earn revenue in a variety of ways, including:

- Withdrawal or Deposit fees. The issuer can charge a small fee (such as 1%) for the service of moving money into or out of the XRP Ledger. This fee isn't assessed on the XRP Ledger, but in the issuer's own systems when deciding how much to issue or credit users.
- Transfer fees. The issuer can set a percentage fee to charge when users transfer the stablecoin within the XRP Ledger. This amount is debited from the XRP Ledger whenever users transact, decreasing the total obligation the stablecoin issuer owes to its users in the ledger without decreasing the amount of assets the issuer holds outside of the ledger.
- Indirect revenue from value added. Stablecoins provide convenient functionality that can ease the adoption of other, adjacent services.
- Interest on collateral. The issuer can hold the assets backing the stablecoin in an interest-earning account. Of course, they must make sure that they can always access enough funds to serve customer withdrawals.
- Financial exchange. The business can buy and sell its own stablecoins in the decentralized exchange, providing liquidity to cross-currency payments and possibly making a profit. (As with all financial exchange, profits are not guaranteed.)


### Choosing Fee Rates

Fees on tokens are optional. Higher fees earn more revenue when those tokens are used. On the other hand, high fees discourage customers from using your services. Consider the fees that are charged by other issuers, especially others with tokens backed by the same type of assets, as well as traditional payment systems outside of the XRP Ledger, such as wire fees. Choosing the right fee structure is a matter of balancing your pricing with what the market is willing to pay.


## Compliance Guidelines

Token issuers are responsible for complying with local regulations and reporting to the appropriate agencies. Regulations vary by country and state, but may include the reporting and compliance requirements described in the following sections. Before issuing a token, you should seek professional legal advice on the requirements for your jurisdiction and use case. The following resources may be useful background reading.

### Know Your Customer (KYC)

Know Your Customer (KYC) refers to due diligence activities conducted by a financial institution to determine and verify the identity of its customers to prevent use of the institution for criminal activity. Criminal activity in financial terms may include money laundering, terrorist financing, financial fraud, and identity theft. Customers may be individuals, intermediaries, or businesses.

The KYC process generally aims to:

- Identify the customer (and, in the case of organizations and businesses, any beneficial owners)

- Understand the purpose and intended nature of the business relationship

- Understand the expected transaction activity.

KYC is critical for financial institutions and related businesses to mitigate risk, especially legal and reputational risk. Having an inadequate or nonexistent KYC program may result in civil and criminal penalties for the institution or individual employees.

See also:

- [(USA) Bank Secrecy Act / Anti-Money Laundering Examination Manual](https://bsaaml.ffiec.gov/manual/Introduction/01)

- [The Non-US Standard on KYC set by the Financial Action Task Force (FATF)](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

<!-- SPELLING_IGNORE: ffiec -->

### Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT)

Money laundering is the process of moving illegal funds by disguising the source, nature or ownership so that funds can be legally accessed or distributed via legitimate financial channels and credible institutions. In short, it is converting “dirty money” into “clean money.” Anti-Money Laundering (AML) refers to the laws and procedures designed to stop money laundering from occurring.

Terrorist financing is the solicitation, collection, or provision of funds to organizations engaged in terrorist activity or organizations that support terrorism and its proliferation. Combating the Financing of Terrorism (CFT) refers to the process of identifying, reporting, and blocking flows of funds used to finance terrorism.

See also:

- [“International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation.” FATF, 2012](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

- [“Virtual Currencies: Key Definitions and Potential AML/CFT Risks.” FATF, 2014](http://www.fatf-gafi.org/publications/methodsandtrends/documents/virtual-currency-definitions-aml-cft-risk.html)

<!-- SPELLING_IGNORE: fatf, cft -->

### Source of Funds

To prevent illicit funds from passing through their systems, financial institutions must be able to determine within reason if the source of a customer’s funds is linked to criminal activity.

Determining the exact source of funds for every customer may not be administratively feasible. As a result, some regulatory authorities may not provide specific regulation or guidance for all accounts. In specific cases, however, authorities may require financial institutions to identify and report the source of funds. Guidance by the FATF recommends that where the risks of money laundering or terrorist financing are higher (commonly referred to as a “risk-based approach”), financial institutions conduct enhanced due diligence, including but not limited to determining the customer’s source of funds.

<!-- STYLE_OVERRIDE: feasible -->

### Suspicious Activity Reporting

If a financial institution suspects that funds may be related to criminal activity, the institution must file a Suspicious Activity Report (SAR) with the appropriate regulatory authority. Failure to report suspicious activity may result in in penalties for the institution.

See also:

- [Suspicious Activity Reporting Overview (USA FFIEC)](https://bsaaml.ffiec.gov/manual/RegulatoryRequirements/04_ep)

- [FATF Recommendation 16: Reporting of suspicious transactions and compliance](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

### Travel Rule

The Travel Rule is a Bank Secrecy Act (BSA) rule requiring funds-transmitting financial institutions to forward certain information to the next financial institution if the funds transmittal equals or exceeds the USD equivalent of $3,000. The following information must be included in the transmittal order:

- The name of the transmittor,
- The account number of the transmittor, if used,
- The address of the transmittor,
- The identity of the transmittor's financial institution,
- The amount of the transmittal order,
- The execution date of the transmittal order, and
- The identity of the recipient's financial institution.

<!-- SPELLING_IGNORE: transmittor -->

See also:

- [Funds “Travel” Regulations: Questions & Answers ](https://www.fincen.gov/resources/statutes-regulations/guidance/funds-travel-regulations-questions-answers)

### Fee Disclosure and Tracing Funds

- In the United States, Dodd Frank 1073 Electronic Fund Transfer Act (Regulation E) requires banks to provide information on cost and delivery terms for international payments originating in the US including exchange rate, fees, and the amount to be received by the designated recipient in the foreign country. "Pre-payment disclosure" is provided to a consumer when requesting an international electronic payment and “receipt disclosure” is provided to a consumer at the time consumer authorizes the transfer.

    See also:

    - [The Consumer Financial Protection Bureau description of the regulation and extensions for banks](https://www.consumerfinance.gov/rules-policy/final-rules/electronic-fund-transfers-regulation-e/#rule)

- In the European Union, EU Funds Transfer Regulation requires that the originator’s bank, the beneficiary’s bank, and any intermediary banks include certain details of the payer and payee in transaction details to detect, investigate, and prevent money laundering and terrorist financing.

    See also:

    - [EU Regulation (EC) No 1781/2006 description](http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:345:0001:0009:EN:PDF)

    - [Effective June 26, 2017: Regulation 2015/847 on information accompanying transfers of funds](http://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32015R0847)

### Office of Foreign Assets Control (OFAC)

The Office of Foreign Assets Control (OFAC) is an agency of the US Department of Treasury that administers and enforces economic and trade sanctions in support of U.S. foreign policy and national security objectives. All U.S. persons and U.S. incorporated entities and their foreign branches must follow OFAC regulations. Under OFAC regulations, U.S. financial institutions are prohibited—unless authorized by OFAC or expressly exempted by statute—from conducting transactions and other dealings with individuals, entities, or countries under sanctions or embargo programs administered and enforced by OFAC.

See also:

- [A list of OFAC resources](https://www.treasury.gov/resource-center/faqs/Sanctions/Pages/ques_index.aspx)

<!-- SPELLING_IGNORE: ofac -->

### Guidance on Virtual Currency and Money Service Business

- United States:

    - [FinCEN Guidance and Definitions around Virtual Currency, March 18, 2013](https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering)

    - [FinCEN Publishes Two Rulings on Virtual Currency Miners and Investors, January 30, 2014](https://www.fincen.gov/news/news-releases/fincen-publishes-two-rulings-virtual-currency-miners-and-investors)

- Europe:

    - [European Banking Authority Opinion on Virtual Currencies, July 4, 2014](http://www.eba.europa.eu/documents/10180/657547/EBA-Op-2014-08+Opinion+on+Virtual+Currencies.pdf)

- FATF Guidance for Money Service Businesses:

    - [Financial Action Task Force, July 2009](http://www.fatf-gafi.org/media/fatf/documents/reports/Guidance-RBA-money-value-transfer-services.pdf)




# XRP Ledger Integration

This document uses the example of a fictional cryptocurrency exchange called ACME Exchange which decides to issue an EUR stablecoin on the XRP Ledger, to illustrate the overall process and flow of funds for a stablecoin.

## Before Integration

ACME, as a cryptocurrency exchange, already accepts withdrawals and deposits from customers using some system (such as an app or website). ACME has a _system of record_ to track how much each user holds with the exchange in each of several types of assets. Such a system can be modeled with a simple balance sheet, although in practice it probably involves databases, application servers, and various other infrastructure to ensure its reliability, information security, and so on.

In the following diagram, ACME Exchange starts with €5 on hand, including €1 that belongs to Bob, €2 that belongs to Charlie, and an additional €2 of equity that belongs to ACME itself. Alice deposits €5, so ACME adds her to its balance sheet and ends up with €10.

![Diagram: Alice sends €5 to ACME. ACME adds her balance to its balance sheet.](img/e2g-01.png)

**Assumptions:** To integrate with the XRP Ledger, we assume that an exchange such as ACME meets the following assumptions:

* ACME already has a system to accept deposits and withdrawals from some outside payment source.
* ACME waits for deposits to clear before crediting them in ACME's system of record.
* ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
    * ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.

## Sending into the XRP Ledger

Sending money _into_ the XRP Ledger involves issuing new stablecoins for an amount that ACME holds on behalf of one of its users. An example flow might look like this:

1. Alice asks to send €3 of her ACME balance into the XRP Ledger.
2. In its system of record, ACME debits Alice's balance €3.
3. ACME submits an XRP Ledger transaction, sending €3 to Alice's XRP Ledger address. The €3 is marked in the XRP Ledger as being "issued" by ACME (3 EUR.ACME).

**Assumptions:**

* Alice already has an address in the XRP Ledger separate from her ACME account. Alice manages her XRP Ledger address using a third-party client application (wallet).

![Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger](img/e2g-02.png)

<!--{# Disabled: UMLet version of this diagram.
{{ include_svg("img/gateway-to-xrpl.svg", "Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger") }}
#}-->

After this, Alice can send or trade her EUR.ACME to other users in the XRP Ledger at her discretion. At any time, ACME can query the XRP Ledger to see who currently holds its tokens. 

### Requirements for Sending to XRP Ledger

There are several prerequisites that ACME must meet for this to happen:

- ACME sets aside the funds that back its stablecoin. There are several ways ACME may do this:
    - ACME may create a XRP Ledger collateral account in ACME's system of record.
    - ACME can store the funds allocated to the XRP Ledger in a separate bank account.
    - If the stablecoin is backed by cryptocurrency, ACME can create a separate wallet to hold the funds allocated to the XRP Ledger, as publicly-verifiable proof of its reserves.
- ACME should control two separate XRP Ledger addresses. See [Issuing and Operational Addresses](account-types.html) for details.
    - ACME must enable the Default Ripple flag on its issuing address for customers to send and receive its tokens.
- Alice must create an accounting relationship (trust line) from her XRP Ledger address to ACME's issuing address. She can do this from any XRP Ledger client application as long as she knows ACME's issuing address.
    - ACME should publicize its issuing address on its website where customers can find it. It can also use an [`xrp-ledger.toml` file](xrp-ledger-toml.html) to publish the issuing address to automated systems.
	- Alternatively, instead of sending a Payment, ACME can write Alice as a Check in the XRP Ledger. This does not move any money right away, but creates both the trust line and the tokens together when Alice cashes the Check.
- ACME must create a user interface for Alice to request for her funds from ACME to be sent into the XRP Ledger.
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


## Precautions

Processing payments to and from the XRP Ledger naturally comes with some risks, so an issuer should be sure to take care in implementing these processes. As a stablecoin issuer, you should take the following precautions:

- Protect yourself against reversible deposits. XRP Ledger payments are irreversible, but many digital payments are not. Scammers can abuse this to take their fiat money back by canceling a deposit after receiving tokens in the XRP Ledger.
- When sending into the XRP Ledger, always specify your issuing address as the issuer of the token. Otherwise, you might accidentally use paths that deliver the same currency issued by other addresses.
- Before sending a payment into the XRP Ledger, double check the cost of the payment. A payment from your operational address to a customer should not cost more than the destination amount plus any transfer fee you have set.
- Before processing a payment out of the XRP Ledger, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you. Most anti-money-laundering regulations require this anyway. This is especially important because the users sending money from the XRP Ledger could be different than the ones that initially received the money in the XRP Ledger.
- Follow the guidelines for [reliable transaction submission](#reliable-transaction-submission) when sending XRP Ledger transactions.
- [Robustly monitor for incoming payments](#robustly-monitoring-for-payments), and read the correct amount. Don't mistakenly credit someone the full amount if they only sent a [partial payment](partial-payments.html).
- Track your obligations and balances within the XRP Ledger, and compare with the assets in your collateral account. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Avoid ambiguous situations. We recommend the following:
    - Enable the `Disallow XRP` flag for the issuing address and all operational addresses, so customers do not accidentally send you XRP. (Private exchanges should *not* set this flag, since they trade XRP normally.)
    - Enable the [`RequireDest` flag](require-destination-tags.html) for the issuing address and all operational addresses, so customers do not accidentally send a payment without the destination tag to indicate who should be credited.
    - Enable the `RequireAuth` flag on all operational addresses so they cannot issue tokens by accident.
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly send funds into and out of the XRP Ledger, as a denial of service attack that effectively empties an operational address's balance. Suspend customers whose addresses are involved in suspicious behavior by not processing their XRP Ledger payments.

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

* Issuers can freeze individual accounting relationships, in case a customer address shows suspicious activity or violates a issuer's terms of use.
* Issuers can freeze all tokens they issue, in case of a major security compromise or for migrating to a new issuing address.
* Furthermore, issuers can permanently opt out of their ability to freeze accounting relationships. This allows an issuer to assure its customers that it will continue to provide "physical-money-like" services. <!-- STYLE_OVERRIDE: will -->

For more information, see the [Freeze article](freezes.html).


## Authorized Trust Lines

The XRP Ledger's Authorized Trust Lines feature (formerly called "Authorized Accounts") enables an issuer to limit who can hold that issuer's tokens, so that unknown XRP Ledger addresses cannot hold the tokens.

For more information, see [Authorized Trust Lines](authorized-trust-lines.html).


## Source and Destination Tags

*Destination Tags* are a feature of XRP Ledger payments can be used to indicate the beneficiary or destination for a payment. For example, an XRP Ledger payment to an issuer may include a destination tag to indicate which customer should be credited for the payment. An issuer should keep a mapping of destination tags to accounts in the issuer's system of record.

Similarly, *Source Tags* indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to bounce the payment. When you bounce an incoming payment, use the Source Tag from the incoming payment as the Destination Tag of the outgoing (bounce) payment.

You can generate a destination tag on-demand when a customer intends to send money to you. For greater customer privacy, you should consider that destination tag valid only for that payment with the expected amount, and bounce or ignore any other transactions that reuse the same destination tag.

[Enable the Require Destination Tag setting](require-destination-tags.html) on your issuing and operational addresses so that customers must use a destination tag to indicate where funds should be credited when they send payments to you.

For more information, see [Source and Destination Tags](source-and-destination-tags.html).


# Technical Details

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


<!-- STYLE_OVERRIDE: gateway, gateways -->

## See Also

- **Concepts:**
    - [Tokens](tokens.html)
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
- **Tutorials:**
    - [Install `rippled`](install-rippled.html)
    - [Set Up Secure Signing](secure-signing.html)
    - [Issue a Fungible Token](issue-a-fungible-token.html)
    - [Enable No Freeze](enable-no-freeze.html)
    - [Freeze a Trust Line](freeze-a-trust-line.html)
    - [Enact Global Freeze](enact-global-freeze.html)
- **References:**
    - [Payment transaction][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [RippleState object](ripplestate.html)
    - [account_lines method][]
    - [gateway_balances method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
