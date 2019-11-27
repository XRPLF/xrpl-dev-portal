# Become an XRP Ledger Gateway

**Gateways** are the businesses that link the XRP Ledger to the rest of the world. An existing online financial institution can expand to act as a gateway in the the XRP Ledger. By becoming an XRP Ledger gateway, a financial services business can gain several advantages:

* By enabling its customers to send and receive value in the XRP Ledger, the business increases its value proposition to customers.
* By accepting payments from the XRP Ledger, the business increases the number of ways that customers can fund accounts at its business, even internationally.
* The business can use XRP Ledger-related services as a new source of revenue.

This document explains the concepts and steps necessary to become an XRP Ledger gateway. In this document, we use a fictional online currency exchange named "ACME" and its customers as examples, to show how ACME can expand its business to include being an XRP Ledger gateway.


## Contact Information

You are not on your own. Ripple wants gateways to succeed, so we are here to help. Please contact us if you need help building and growing your gateway.

* Contact [partners@ripple.com](mailto:partners@ripple.com) for enterprise-class integrations, infrastructure advice, and other business development needs.
* Contact [support@ripple.com](mailto:support@ripple.com) for technical questions, clarifications, bug reports, and feature requests.


## Gateways Explained

{% include '_snippets/gateways-intro.md' %}
<!--_ -->

This guide focuses on running an **issuing gateway**.

### Trust Lines and Issued Currencies

All assets in the XRP Ledger, except for the native cryptocurrency XRP, are represented as _issued currencies_, which are digital balances that represent currency or assets of value held by an issuer. The XRP Ledger has a system of directional accounting relationships, called _trust lines_, to make sure that users only hold issued currencies from counterparties they trust.

Main article: [Trust Lines and Issuing](trust-lines-and-issuing.html).


### XRP

[**XRP**](xrp.html) is the native cryptocurrency of the XRP Ledger. XRP can be sent directly from any XRP Ledger address to any other, without going through a gateway or liquidity provider. This helps make XRP a convenient bridge currency. For more information on XRP, see the [XRP Portal](https://ripple.com/xrp-portal/).

Issuing gateways do not need to accumulate or exchange XRP. They must only hold a small balance of XRP to meet the [reserve requirements](reserves.html) and pay the [cost of sending transactions](transaction-cost.html) through the network. The XRP equivalent of $10 USD should be enough for at least one year of transaction costs for a busy gateway.

Main article: [XRP](xrp.html).


### Liquidity and Currency Exchange

The XRP Ledger contains a [decentralized asset exchange](decentralized-exchange.html), where any user can place and fulfill bids to exchange XRP and issued currencies in any combination. [Cross-currency payments](cross-currency-payments.html) use the decentralized exchange to convert currency atomically when the transaction is executed. In this way, users who choose make offers in the decentralized exchange provide the liquidity that makes it possible to trade issued currencies.

Currency traders who hold a gateway's issued currencies can provide liquidity to other popular currencies, without the gateway needing to float a large reserve in various destination currencies. The gateway also does not need to take on the risk of holding a variety of currencies. However, a gateway _may_ still want to provide liquidity to XRP or other popular currencies at a baseline rate, especially when the gateway is new to the exchange. If you do provide liquidity, **use a different address for trading than your issuing address.**

Third-party liquidity providers can use the [`rippled` APIs](rippled-api.html), [RippleAPI JavaScript Library](rippleapi-reference.html), or a third-party client application to access the distributed exchange. It may also help client applications to surface information about your gateway to clients if you provide an [`xrp-ledger.toml` file](xrp-ledger-toml.html).

Contact [partners@ripple.com](mailto:partners@ripple.com) for help establishing liquidity between your gateway and others.


## Suggested Business Practices

The value of a gateway's issued currency in the XRP Ledger comes directly from the trust that customers can redeem the issued balance from the gateway when needed. We recommend the following precautions to reduce the risk of business interruptions:

* Use separate [Issuing and Operational Addresses](issuing-and-operational-addresses.html) to limit your risk profile on the network.
* Follow anti-money-laundering regulations for your jurisdiction, such as the [Bank Secrecy Act](http://en.wikipedia.org/wiki/Bank_Secrecy_Act). This usually includes requirements to collect ["Know-Your-Customer" (KYC) information](http://en.wikipedia.org/wiki/Know_your_customer).
* Read and stay up-to-date with [Gateway Bulletins](#gateway-bulletins), which provide news and suggestions for XRP Ledger gateways.
* Publicize all your policies and fees.


### Hot and Cold Wallets

{% include '_snippets/issuing-and-operational-addresses-intro.md' %}
<!--{#_ #}-->

Main article: [Issuing and Operational Addresses](issuing-and-operational-addresses.html)


## Fees and Revenue Sources

There are several ways in which a gateway can seek to profit from XRP Ledger integration. These can include:

* Withdrawal and Deposit fees. Gateways typically charge a small fee (such as 1%) for the service of adding or removing money from the XRP Ledger. You have the power to determine the rate you credit people when they move money onto and off of the XRP Ledger through your gateway.
* Transfer fees. You can set a percentage fee to charge automatically when customers send each other issued currencies created by your issuing address. This amount is debited from the XRP Ledger, decreasing your obligation each time your issued currencies change hands. See [TransferRate](#transferrate) for details.
* Indirect revenue from value added. XRP Ledger integration can provide valuable functionality for your customers that distinguishes your business from your competitors.
* Interest on XRP Ledger-backed funds. You can keep the collateral for the funds you issue in XRP Ledger in a bank account that earns interest. Make sure you can always access enough funds to service customer withdrawals.
* [Financial Exchange](#liquidity-and-currency-exchange). A gateway can also make offers to buy and sell its issued currencies for other issued currencies in the XRP Ledger, providing liquidity to cross-currency payments and possibly making a profit. (As with all financial exchange, profits are not guaranteed.)


### Choosing Fee Rates

Fees imposed by gateways are optional. Higher fees earn more revenue when a gateway's services are used. On the other hand, high fees discourage customers from using your services. Consider the fees that are charged by other gateways, especially ones issuing similar currencies, as well as traditional payment systems outside of the XRP Ledger, such as wire fees. Choosing the right fee structure is a matter of balancing your pricing with what the market is willing to pay.


## Gateway Compliance

Gateways are responsible for complying with local regulations and reporting to the appropriate agencies. Regulations vary by country and state, but may include the reporting and compliance requirements described in the following sections.

### Know Your Customer (KYC)

Know Your Customer (KYC) refers to due diligence activities conducted by a financial institution to determine and verify the identity of its customers to prevent use of the institution for criminal activity. Criminal activity in financial terms may include money laundering, terrorist financing, financial fraud, and identity theft. Customers may be individuals, intermediaries, or businesses.

The KYC process generally aims to:

- Identify the customer (and, in the case of organizations and businesses, any beneficial owners)

- Understand the purpose and intended nature of the business relationship

- Understand the expected transaction activity.

KYC is critical for financial institutions and related businesses to mitigate risk, especially legal and reputational risk. Having an inadequate or nonexistent KYC program may result in civil and criminal penalties for the institution or individual employees.

See also:

- [Customer Identification Program (USA FFIEC)](https://bsaaml.ffiec.gov/manual/RegulatoryRequirements/01)

- [The Non-US Standard on KYC set by the Financial Action Task Force (FATF)](http://www.fatf-gafi.org/topics/fatfrecommendations/documents/fatf-recommendations.html)

### Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT)

Money laundering is the process of moving illegal funds by disguising the source, nature or ownership so that funds can be legally accessed or distributed via legitimate financial channels and credible institutions. In short, it is converting “dirty money” into “clean money.” Anti-Money Laundering (AML) refers to the laws and procedures designed to stop money laundering from occurring.

Terrorist financing is the solicitation, collection, or provision of funds to organizations engaged in terrorist activity or organizations that support terrorism and its proliferation. Combating the Financing of Terrorism (CFT) refers to the process of identifying, reporting, and blocking flows of funds used to finance terrorism.

See also:

- [“International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation.” FATF, 2012](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

- [“Virtual Currencies: Key Definitions and Potential AML/CFT Risks.” FATF, 2014](http://www.fatf-gafi.org/topics/methodsandtrends/documents/virtual-currency-definitions-aml-cft-risk.html)

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

See also:

- [Additional information and background on the Travel Rule](http://www.fincen.gov/news_room/rp/advisory/html/advissu7.html)

### Fee Disclosure and Tracing Funds

- In the United States, Dodd Frank 1073 Electronic Fund Transfer Act (Regulation E) requires banks to provide information on cost and delivery terms for international payments originating in the US including exchange rate, fees, and the amount to be received by the designated recipient in the foreign country. "Pre-payment disclosure" is provided to a consumer when requesting an international electronic payment and “receipt disclosure” is provided to a consumer at the time consumer authorizes the transfer.

    See also:

    - [The Consumer Financial Protection Bureau description of the regulation and extensions for banks](http://www.consumerfinance.gov/remittances-transfer-rule-amendment-to-regulation-e/#rule)

- In the European Union, EU Funds Transfer Regulation requires that the originator’s bank, the beneficiary’s bank, and any intermediary banks include certain details of the payer and payee in transaction details to detect, investigate, and prevent money laundering and terrorist financing.

    See also:

    - [EU Regulation (EC) No 1781/2006 description](http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:345:0001:0009:EN:PDF)

    - [Effective June 26, 2017: Regulation 2015/847 on information accompanying transfers of funds](http://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32015R0847)

### Office of Foreign Assets Control (OFAC)

The Office of Foreign Assets Control (OFAC) is an agency of the US Department of Treasury that administers and enforces economic and trade sanctions in support of U.S. foreign policy and national security objectives. All U.S. persons and U.S. incorporated entities and their foreign branches must follow OFAC regulations. Under OFAC regulations, U.S. financial institutions are prohibited—unless authorized by OFAC or expressly exempted by statute—from conducting transactions and other dealings with individuals, entities, or countries under sanctions or embargo programs administered and enforced by OFAC.

See also:

- [A list of OFAC resources](https://www.treasury.gov/resource-center/faqs/Sanctions/Pages/ques_index.aspx)

### Guidance on Virtual Currency and Money Service Business

- United States:

    - [FinCEN Guidance and Definitions around Virtual Currency, March 18, 2013](http://www.fincen.gov/statutes_regs/guidance/html/FIN-2013-G001.html)

    - [FinCEN Publishes Two Rulings on Virtual Currency Miners and Investors, January 30, 2014](http://www.fincen.gov/news_room/nr/html/20140130.html)

- Europe:

    - [European Banking Authority Opinion on Virtual Currencies, July 4, 2014](http://www.eba.europa.eu/documents/10180/657547/EBA-Op-2014-08+Opinion+on+Virtual+Currencies.pdf)

- FATF Guidance for Money Service Businesses:

    - [Financial Action Task Force, July 2009](http://www.fatf-gafi.org/media/fatf/documents/reports/RBA%20Guidance%20for%20Money%20Service%20Businesses.pdf)




# XRP Ledger Integration

## Before Integration

Our example exchange, ACME, already accepts withdrawals and deposits from customers using some existing system, and uses its own system of record to track how much balance each user has with the exchange. Such a system can be modeled with a balance sheet and tracking how much currency each user has with ACME.

In the following diagram, ACME Exchange starts with €5 on hand, including €1 that belongs to Bob, €2 that belongs to Charlie, and an additional €2 of equity that belongs to ACME itself. Alice deposits €5, so ACME adds her to its balance sheet and ends up with €10.

![Diagram: Alice sends €5 to ACME. ACME adds her balance to its balance sheet.](img/e2g-01.png)

**Assumptions:** To integrate with the XRP Ledger, we assume that an exchange such as ACME meets the following assumptions:

* ACME already has a system to accept deposits and withdrawals from some outside payment source.
* ACME waits for deposits to clear before crediting them in ACME's system of record.
* ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
    * ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.

## Sending from Gateway to the XRP Ledger

XRP Ledger payments can automatically bridge between currencies, but an issuing gateway normally only sends single-currency payments that go directly to customers. This means debiting a customer's current balance in your system, and then sending the equivalent amount of issued currencies in the XRP Ledger to the customer's XRP Ledger address.

An example flow for a payment into the XRP Ledger:

1. Alice asks to send €3 of her ACME balance into the XRP Ledger.
2. In its system of record, ACME debits Alice's balance €3.
3. ACME submits an XRP Ledger transaction, sending €3 to Alice's XRP Ledger address. The €3 is marked in the XRP Ledger as being "issued" by ACME (3 EUR.ACME).

**Assumptions:**

* Alice already has an address in the XRP Ledger separate from her ACME account. Alice manages her XRP Ledger address using a third-party client application.

![Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger](img/e2g-02.png)



### Requirements for Sending to XRP Ledger

There are several prerequisites that ACME must meet for this to happen:

- ACME sets aside money that is issued in the XRP Ledger. ACME can query the XRP Ledger to see who holds its issued currencies at any time. There are several ways ACME may do this:
    - ACME may create a XRP Ledger collateral account in ACME's system of record.
    - ACME can store the funds allocated to the XRP Ledger in a separate bank account.
    - If ACME is a cryptocurrency exchange, ACME can create a separate wallet to hold the funds allocated to the XRP Ledger, as publicly-verifiable proof to customers that the gateway is solvent.
- ACME must control an address in the XRP Ledger. Ripple's best practices recommend using a separate issuing address and operational address. See [Issuing and Operational Addresses](issuing-and-operational-addresses.html) for details.
    - ACME must enable the [DefaultRipple Flag](#defaultripple) on its issuing address for customers to send and receive its issued currencies.
- Alice must create an accounting relationship (trust line) from her XRP Ledger address to ACME's issuing address. She can do this from any XRP Ledger client application as long as she knows ACME's issuing address.
    - ACME should publicize its issuing address on its website where customers can find it. It can also use an [`xrp-ledger.toml` file](xrp-ledger-toml.html) to publish the issuing address to automated systems.
- ACME must create a user interface for Alice to send funds from ACME into the XRP Ledger.
    - ACME needs to know Alice's XRP Ledger address. ACME can have Alice input her XRP Ledger addresss as part of the interface, or ACME can require Alice to input and verify her XRP Ledger address in advance.

See [Sending Payments to Customers](#sending-payments-to-customers) for an example of how to send payments into the XRP Ledger.


## Sending from XRP Ledger to Gateway

A payment out of the XRP Ledger means the Gateway receives a payment in the XRP Ledger, and credits a user in the gateway's system of record.

An example flow of a payment out of the XRP Ledger:

1. Bob sends an XRP Ledger transaction of €1 to ACME's issuing address.
2. In ACME's system of record, ACME credits Bob's balance €1.

Payments going from the XRP Ledger to a gateway can be single-currency or cross-currency payments. The gateway's issuing address can only receive issued currencies it created (or XRP).

### Requirements for Receiving from XRP Ledger

In addition to the [requirements for sending into the XRP Ledger](#requirements-for-sending-to-xrp-ledger), there are several prerequisites that ACME must meet to process payments coming from the XRP Ledger:

- ACME must monitor its XRP Ledger addresses for incoming payments.
- ACME must know which user to credit in its system of record for the incoming payments.
    - We recommend that ACME should [bounce any unrecognized incoming payments](#bouncing-payments) back to their sender.
    - Typically, the preferred method of recognizing incoming payments is through [destination tags](#source-and-destination-tags).


## Precautions

Processing payments to and from the XRP Ledger naturally comes with some risks, so a gateway should be sure to take care in implementing these processes. We recommend the following precautions:

- Protect yourself against reversible deposits. XRP Ledger payments are irreversible, but many electronic money systems like credit cards or PayPal are not. Scammers can abuse this to take their fiat money back by canceling a deposit after receiving issued currencies in the XRP Ledger.
- When sending into the XRP Ledger, specify the issuing address as the issuer of the currency. Otherwise, you might accidentally use paths that deliver the same currency issued by other addresses.
- Before sending a payment into the XRP Ledger, double check the cost of the payment. A payment from your operational address to a customer should not cost more than the destination amount plus any [transfer fee](#transferrate) you have set.
- Before processing a payment out of Ripple, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you. Most anti-money-laundering regulations require this anyway. This is especially important because the users sending money from the XRP Ledger could be different than the ones that initially received the money in the XRP Ledger.
- Follow the guidelines for [reliable transaction submission](#reliable-transaction-submission) when sending XRP Ledger transactions.
- [Robustly monitor for incoming payments](#robustly-monitoring-for-payments), and read the correct amount. Don't mistakenly credit someone the full amount if they only sent a [partial payment](partial-payments.html).
- Track your obligations and balances within the XRP Ledger, and compare with the assets in your collateral account. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Avoid ambiguous situations. We recommend the following:
    - Enable the [`DisallowXRP` flag](#disallowxrp) for the issuing address and all operational addresses, so customers do not accidentally send you XRP. (Private exchanges should *not* set this flag, since they trade XRP normally.)
    - Enable the [`RequireDest` flag](require-destination-tags.html) for the issuing address and all operational addresses, so customers do not accidentally send a payment without the destination tag to indicate who should be credited.
    - Enable the [`RequireAuth` flag](#requireauth) on all operational addresses so they cannot issue currency by accident.
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly send funds into and out of the XRP Ledger, as a denial of service attack that effectively empties an operational address's balance. Suspend customers whose addresses are involved in suspicious behavior by not processing their XRP Ledger payments.

## Trading on Ripple

After the issued currencies have been created in the XRP Ledger, they can be freely transferred and traded by XRP Ledger users. There are several consequences of this situation:

- Anyone can buy/sell EUR.ACME on Ripple. If ACME issues multiple currencies on Ripple, a separate trust line is necessary for each.
    - This includes XRP Ledger users who do not have an account in ACME Exchange's systems. To withdraw the funds successfully from ACME, users still have to register with ACME.
    - Optionally, ACME uses the [Authorized Trust Lines](#authorized-trust-lines) feature to limit who can hold EUR.ACME in the XRP Ledger.
    - If ACME determines that a customer has acted in bad faith, ACME can [Freeze](#freeze) that user's accounting relationships to ACME in the XRP Ledger, so that the user can no longer trade in the gateway's issued currencies.
- XRP Ledger users trading and sending EUR.ACME to one another requires no intervention by ACME.
- All exchanges and balances in the XRP Ledger are publicly viewable.

The following diagram depicts an XRP Ledger payment sending 2EUR.ACME from Alice to Charlie. ACME can query the XRP Ledger to see updates to its balances any time after the transaction has occurred:

![Diagram: Alice's sends 2 EUR.ACME from her trust line to Charlie's](img/e2g-03.png)



## Freeze

A gateway can freeze accounting relationships in the XRP Ledger to meet regulatory requirements:

* Gateways can freeze individual accounting relationships, in case a customer address shows suspicious activity or violates a gateway's terms of use.
* Gateways can freeze all accounting relationships to their issuing address, in case of a major security compromise or for migrating to a new issuing address.
* Furthermore, gateways can permanently opt out of their ability to freeze accounting relationships. This allows a gateway to assure its customers that it will continue to provide "physical-money-like" services. <!-- STYLE_OVERRIDE: will -->

For more information, see the [Freeze article](freezes.html).


## Authorized Trust Lines

The XRP Ledger's Authorized Trust Lines feature (formerly called "Authorized Accounts") enables a gateway to limit who can hold that gateway's issued currencies, so that unknown XRP Ledger addresses cannot hold the currency the gateway issues. Ripple feels this is *not necessary* in most cases, since gateways have full control over the process of redeeming XRP Ledger balances for value in the outside world. (You can collect customer information and impose limits on withdrawals at that stage without worrying about what happens within the XRP Ledger.)

For more information, see [Authorized Trust Lines](authorized-trust-lines.html).


## Source and Destination Tags

*Destination Tags* are a feature of XRP Ledger payments can be used to indicate the beneficiary or destination for a payment. For example, an XRP Ledger payment to a gateway may include a destination tag to indicate which customer should be credited for the payment. A gateway should keep a mapping of destination tags to accounts in the gateway's system of record.

Similarly, *Source Tags* indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to bounce the payment. When you bounce an incoming payment, use the Source Tag from the incoming payment as the Destination Tag of the outgoing (bounce) payment.

Ripple recommends making a user interface to generate a destination tag on-demand when a customer intends to send money to the gateway. You should consider that destination tag valid only for a payment with the expected amount. Later, bounce any other transactions that reuse the same destination tag.

Enable the [RequireDest](require-destination-tags.html) flag on your issuing and operational addresses so that customers must use a destination tag to indicate where funds should go when they send XRP Ledger payments to your gateway.

For more information, see [Source and Destination Tags](source-and-destination-tags.html).


## Gateway Bulletins

Historically, Ripple (the company) issued gateway bulletins to introduce new features or discuss topics related to compliance and risk. Gateway Bulletins are listed here in reverse chronological order.

- May 13, 2015 - [GB-2015-06 Gateway Bulletin: Corrections to Autobridging (PDF)](assets/pdf/GB-2015-06.pdf)
- April 17, 2015 - [GB-2015-05 Historical Ledger Query Migration](assets/pdf/GB-2015-05.pdf)
- March 13, 2015 - [GB-2015-04 Action Required: Default Ripple Flag (PDF)](https://ripple.com/files/GB-2015-04.pdf)
- March 3, 2015 - [GB-2015-03 Gateway Advisory: FinCEN Ruling on MoneyGram Compliance Program (PDF)](https://ripple.com/files/GB-2015-03.pdf)
- March 2, 2015 (Updated) - [GB-2015-02 New Standards: How to be Featured on Ripple Trade and Ripple Charts (PDF)](https://ripple.com/files/GB-2015-02.pdf)
- January 5, 2015 - [GB-2015-01 Gateway Advisory: Reliable Transaction Submission (PDF)](https://ripple.com/files/GB-2015-01.pdf)
- December 18, 2014 - [GB-2014-08 Gateway Advisory: Recent FinCEN Rulings (PDF)](https://ripple.com/files/GB-2014-08.pdf)
- November 4, 2014 -[GB-2014-07 Gateway Advisory: FATF Standards (PDF)](https://ripple.com/files/GB-2014-07.pdf)
- October 17, 2014 -[GB-2014-06 Gateway Advisory: Partial Payment Flag (PDF)](https://ripple.com/files/GB-2014-06.pdf)
- September 24, 2014 - [GB-2014-05 Gateway Advisory: EBA Opinion On Virtual Currency (PDF)](https://ripple.com/files/GB-2014-05.pdf)
- September 11, 2014 - [GB-2014-04 Gateway Advisory: CFPB Opinion on Virtual Currency (PDF)](https://ripple.com/files/GB-2014-04.pdf)
- August 19, 2014 - [GB-2014-03 Updated Feature: Trust Lines UI (PDF)](https://ripple.com/files/GB-2014-03.pdf)
- August 1, 2014 - [GB-2014-02 New Feature: Balance Freeze (PDF)](https://ripple.com/files/GB-2014-02.pdf)
- April 23, 2014, Updated August 14, 2014 -[GB-2014-01 New Feature: Ripple Names (PDF)](https://ripple.com/files/GB-2014-01.pdf)


# Technical Details

## Infrastructure

For the gateway's own security as well as the stability of the network, Ripple recommends that each gateway run its own `rippled` servers. Ripple provides detailed and individualized recommendations to businesses interested in running a significant XRP-based business.

Contact [partners@ripple.com](mailto:partners@ripple.com) to see how Ripple can help.

### APIs and Middleware

There are several interfaces you can use to connect to the XRP Ledger, depending on your needs and your existing software:

* [`rippled`](rippled-api.html) provides JSON-RPC and WebSocket APIs that can be used as a low-level interface to all core XRP Ledger functionality.
* [RippleAPI](rippleapi-reference.html) provides a simplified API for JavaScript applications.


## Tool Security

Any time you submit an XRP Ledger transaction, it must be signed using your secret key. The secret key gives full control over your XRP Ledger address. **Never** send your secret key to a server operated by someone else. Either use your own `rippled` server, or sign the transactions locally before sending them to a `rippled` server.

The examples in this document show API methods that include a secret key. This is only safe if you control `rippled` server yourself, *and* you connect to it over a connection that is secure from outside listeners. (For example, you could connect over a loopback (localhost) network, a private subnet, or an encrypted VPN.) Alternatively, you could use [RippleAPI](rippleapi-reference.html) to sign transactions locally before submitting them to a third-party server.


## DefaultRipple

The DefaultRipple flag controls whether the balances in an accounting relationship [allowed to ripple](rippling.html) by default. Rippling is what allows customers to trade issued currencies, so a gateway must allow rippling on all the accounting relationships to its issuing address.

Before asking customers to create accounting relationships to its issuing address, a gateway should enable the DefaultRipple flag on that address. Otherwise, the gateway must individually disable the NoRipple flag for each accounting relationship that other addresses have created.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the DefaultRipple flag:

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

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

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

To confirm that an address has DefaultRipple enabled, look up the address using the [account_info method][], specifying a validated ledger version. Use [a bitwise-AND operator](https://en.wikipedia.org/wiki/Bitwise_operation#AND) to compare the `Flags` field with 0x00800000 (the [ledger flag lsfDefaultRipple](accountroot.html#accountroot-flags)). If the result of the bitwise-AND operation is nonzero, then the address has DefaultRipple enabled.



## DisallowXRP

The DisallowXRP setting (`disallowIncomingXRP` in RippleAPI) is designed to discourage XRP Ledger users from sending XRP to an address by accident. This reduces the costs and effort of bouncing undesired payments, if your gateway does not trade XRP. The DisallowXRP flag is not strictly enforced, because doing so could allow addresses to become permanently unusable if they run out of XRP. Client applications should honor the DisallowXRP flag by default.

An issuing gateway that does not trade XRP should enable the DisallowXRP flag on the gateway's issuing and operational addresses. A private exchange that trades in XRP should only enable the DisallowXRP flag on addresses that are not expected to receive XRP.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the DisallowXRP flag:

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
                "Fee": "10000",
                "Flags": 0,
                "SetFlag": 3,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

Response:

```
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "12000322000000002400000164202100000003684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100C2E38177E92C3998EB2C22978595784BC4CABCF7D57DE71FCF6CF162FB683A1D02205942D42C440D860B4CF7BB0DF77E4F2C529695854835B2F76DC2D09644FCBB2D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
		"tx_json": {
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Fee": "10000",
			"Flags": 0,
			"Sequence": 356,
			"SetFlag": 3,
			"SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
			"TransactionType": "AccountSet",
			"TxnSignature": "3045022100C2E38177E92C3998EB2C22978595784BC4CABCF7D57DE71FCF6CF162FB683A1D02205942D42C440D860B4CF7BB0DF77E4F2C529695854835B2F76DC2D09644FCBB2D",
			"hash": "096A89DA55A6A1C8C9EE1BCD15A8CADCC52E6D2591393F680243ECEB93161B33"
		}
	}
}
```


## RequireAuth

The `RequireAuth` setting prevents all counterparties from holding balances issued by an address unless the address has specifically approved an accounting relationship with that counterparty. For more information, see [Authorized Trust Lines](authorized-trust-lines.html).

### Enabling RequireAuth

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the RequireAuth flag: (This method works the same way regardless of whether the address is an issuing address, operational address, or standby address.)

Request:

```
POST http://localhost:5005/
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 2,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

### Authorizing Trust Lines

If you are using the [Authorized Trust Lines](authorized-trust-lines.html) feature, customers cannot hold balances you issue unless you first authorize their accounting relationships to you in the XRP Ledger.

To authorize an accounting relationship, submit a TrustSet transaction from your issuing address, with the user to trust as the `issuer` of the `LimitAmount`. Leave the `value` (the amount to trust them for) as **0**, and enable the [tfSetfAuth](trustset.html#trustset-flags) flag for the transaction.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send a TrustSet transaction authorizing the customer address rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn to hold issued USD from the issuing address rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW:

Request:

```
POST http://localhost:8088/
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "15000",
                "TransactionType": "TrustSet",
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": 0
                },
                "Flags": 65536
            }
        }
    ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->


## Robustly Monitoring for Payments

To robustly check for incoming payments, gateways should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* [Look out for Partial Payments](https://ripple.com/files/GB-2014-06.pdf "Partial Payment Flag Gateway Bulletin"). Payments with the partial-payment flag enabled can be considered "successful" if any non-zero amount is delivered, even miniscule amounts.
    * In `rippled`, check the transaction for a `meta.delivered_amount` field. If present, that field indicates how much money *actually* got delivered to the `Destination` address.
    * In RippleAPI, you can search the `outcome.BalanceChanges` field to see how much the destination address received. In some cases, this can be divided into multiple parts on different trust lines.
* Some transactions change your balances without being payments directly to or from one of your addresses. For example, if ACME sets a nonzero [TransferRate](#transferrate), then ACME's issuing address's outstanding obligations decrease each time Bob and Charlie exchange ACME's issued currencies. See [TransferRate](#transferrate) for more information.

To make things simpler for your customers, we recommend accepting payments to either operational addresses and issuing addresses.

As an added precaution, we recommend comparing the balances of your issuing address with the collateral funds in your internal accounting system as of each new XRP Ledger ledger version. The issuing address's negative balances should match the assets you have allocated to XRP Ledger outside the network. If the two do not match up, then you should suspend processing payments into and out of the XRP Ledger until you have resolved the discrepancy.

* Use `rippled`'s [gateway_balances method][] or [RippleAPI's `getTrustlines` method](rippleapi-reference.html#gettrustlines) to check your balances.
* If you have a [TransferRate](#transferrate) set, then your obligations within the XRP Ledger decrease slightly whenever other XRP Ledger addresses transfer your issued currencies among themselves.


## TransferRate

The *TransferRate* setting (`transferRate` in RippleAPI) defines a fee to charge for transferring issued currencies from one XRP Ledger address to another. See [Transfer Fees](transfer-fees.html) for more information.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction for the issuing address rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW, setting the TransferRate to charge a fee of 0.5%.

Request:

```

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "10000",
                "Flags": 0,
                "TransferRate": 1005000000,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

Response:

```
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "1200032200000000240000000F2B3BE71540684000000000002710732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF74473045022100AAFC3360BE151299523A93F445D5F6EB58AF5A4F8586C8B7818D6C6069660B40022022F46BCDA8FEE256AEB0BA2E92947EF4571F92354AB703E3E6D77FEF7ECBF64E8114204288D2E47F8EF6C99BCC457966320D12409711",
		"tx_json": {
			"Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
			"Fee": "10000",
			"Flags": 0,
			"Sequence": 15,
			"SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
			"TransactionType": "AccountSet",
			"TransferRate": 1005000000,
			"TxnSignature": "3045022100AAFC3360BE151299523A93F445D5F6EB58AF5A4F8586C8B7818D6C6069660B40022022F46BCDA8FEE256AEB0BA2E92947EF4571F92354AB703E3E6D77FEF7ECBF64E",
			"hash": "24360352FBF5597F313E5985C1766BB4A0D277CE63219AC0C0D81014C1E663BB"
		}
	}
}
```

### TransferRate with Operational and Standby Addresses

All XRP Ledger addresses, including operational and standby addresses, are subject to the transfer fee. If you set a nonzero transfer fee, then you must send extra (to pay the TransferRate) when making payments from your operational address or standby address. In other words, your addresses must pay back a little of the balance your issuing address created, each time you make a payment.

* In `rippled`'s APIs, you should set the [`SendMax` transaction parameter][Payment] higher than the destination `Amount` parameter.
* In RippleAPI, you should set the `source.maxAmount` parameter higher than the `destination.amount` parameter; or, set the `source.amount` parameter higher than the `destination.minAmount` parameter.

**Note:** The TransferRate does not apply when sending issued currencies directly to the issuing address. The issuing address must always accept its issued currencies at face value in the XRP Ledger. This means that customers don't have to pay the TransferRate if they send payments to the issuing address directly, but they do when sending to an operational address. If you accept payments at both addresses, you may want to adjust the amount you credit customers in your system of record when customers send payments to the operational address, to compensate for the TransferRate the customer pays.

For example: If ACME sets a transfer fee of 1%, an XRP Ledger payment to deliver 5 EUR.ACME from a customer address to ACME's issuing address would cost exactly 5 EUR.ACME. However, the customer would need to send 5.05 EUR.ACME to deliver 5 EUR.ACME to ACME's operational address. (The issuing address's total obligations in the XRP Ledger decrease by 0.05 EUR.ACME.) When ACME credits customers for payments to ACME's operational address, ACME credits the customer for the amount delivered to the operational address _and_ the transfer fee, giving the customer €5,05 in ACME's systems.


## Sending Payments to Customers

When you build an automated system to send payments into the XRP Ledger for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find ways to trick a system into paying them more money than it should.

One common pitfall is performing pathfinding before sending sending a payment to customers in the XRP Ledger. If you specify the issuers correctly, the [default paths](paths.html#default-paths) can deliver the currency as intended.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send a payment from the operational address rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn to the customer address raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n, sending and delivering funds issued by the issuing address rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW.

Request:

```
{
	"method": "submit",
	"params": [{
		"secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
		"tx_json": {
			"TransactionType": "Payment",
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Destination": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
			"Amount": {
				"currency": "USD",
				"value": "0.13",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
			},
			"SendMax": {
				"currency": "USD",
				"value": "0.13065",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
			},
			"Fee": "10000"
		}
	}]
}
```

*Reminder: Don't send your secret to a server you do not control.*

Response:

```
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "1200002280000000240000016561D4449E57D63540000000000000000000000000005553440000000000204288D2E47F8EF6C99BCC457966320D1240971168400000000000271069D444A4413C6628000000000000000000000000005553440000000000204288D2E47F8EF6C99BCC457966320D12409711732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402207B75D91DC0EEE613A94E05FD5D031568D8A763E99697FF6328745BD226DA7D4E022005C75D7215FD62CB8E46C55B29FCA8E3FC62FDC55DF300597089DD29863BD3CD81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143A4C02EA95AD6AC3BED92FA036E0BBFB712C030C",
		"tx_json": {
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Amount": {
				"currency": "USD",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
				"value": "0.13"
			},
			"Destination": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
			"Fee": "10000",
			"Flags": 2147483648,
			"SendMax": {
				"currency": "USD",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
				"value": "0.13065"
			},
			"Sequence": 357,
			"SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
			"TransactionType": "Payment",
			"TxnSignature": "304402207B75D91DC0EEE613A94E05FD5D031568D8A763E99697FF6328745BD226DA7D4E022005C75D7215FD62CB8E46C55B29FCA8E3FC62FDC55DF300597089DD29863BD3CD",
			"hash": "37B4AA5C77A8EB889164CA012E6F064A46B6B7B51677003FC3617F614608C60B"
		}
	}
}
```

In particular, note the following features of the [Payment transaction][]:

- No `Paths` field. The payment only succeeds if it can use a [default path](paths.html#default-paths), which is preferable. Using less direct paths can become much more expensive.
- The `issuer` of both the `SendMax` and the `Amount` is the issuing address. This ensures that the transaction sends and delivers issued currencies from the issuing address, and not from some other gateway.
- The `value` of the `SendMax` amount is slightly higher than the destination `Amount`, to compensate for the [transfer fee](#transferrate). In this case, the transfer fee is 0.5%, so the `SendMax` amount is exactly 1.005 times the destination `Amount`.


## Bouncing Payments

When one of your addresses receives a payment whose purpose is unclear, we recommend that you try to return the money to its sender. While this is more work than pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically.

The first requirement to bouncing payments is [robustly monitoring for incoming payments](#robustly-monitoring-for-payments). You do not want to accidentally refund a customer for more than they sent you! (This is particularly important if your bounce process is automated.) The [Partial Payment Flag Gateway Bulletin (PDF)](https://ripple.com/files/GB-2014-06.pdf) explains how to avoid a common problem.

Second, you should send bounced payments as Partial Payments. Since third parties can manipulate the cost of pathways between addresses, Partial Payments allow you to divest yourself of the full amount without being concerned about exchange rates within the XRP Ledger. You should publicize your bounced payments policy as part of your terms of use. Send the bounced payment from either an operational address or a standby address.

* To send a Partial Payment using `rippled`, enable the [tfPartialPayment flag](payment.html#payment-flags) on the transaction. Set the `Amount` field to the amount you received and omit the `SendMax` field.
* To send a Partial Payment using RippleAPI, set the `allowPartialPayment` field of the [Payment object](rippleapi-reference.html#payment) to `true`. Set the `source.maxAmount` and `destination.amount` both equal to the amount you received.

You should use the `SourceTag` value (`source.tag` in RippleAPI) from the incoming payment as the `DestinationTag` value (`destination.tag` in RippleAPI) for the return payment.

To prevent two systems from bouncing payments back and forth indefinitely, you can set a new Source Tag for the outgoing return payment. If you receive an unexpected payment whose Destination Tag matches the Source Tag of a return you sent, then do not bounce it back again.


## Reliable Transaction Submission

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To submit transactions reliably, follow these guidelines:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (RippleAPI does this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose [ledger index][] is less than or equal to the transaction's `LastLedgerSequence` parameter.

For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).


## xrp-ledger.toml File

You can publish information about what currencies your gateway issues, and which XRP Ledger addresses you control, to protect against impostors or confusion, using an [`xrp-ledger.toml` file](xrp-ledger-toml.html). This machine-readable format is convenient for client applications to process. If you run an XRP Ledger validator, you can also publish the key in the same file.


<!-- STYLE_OVERRIDE: gateway, gateways -->

## See Also

- **Concepts:**
    - [Issued Currencies](issued-currencies.html)
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
- **Tutorials:**
    - [Install `rippled`](install-rippled.html)
    - [Set Up Secure Signing](set-up-secure-signing.html)
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
