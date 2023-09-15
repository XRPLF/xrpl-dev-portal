---
html: stablecoin-issuer.html
parent: tokenization.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
---
# Stablecoin Issuer

_As a financial professional, I want to issue a stablecoin so that I can earn revenue by charging fees for withdrawals or transfers of the stablecoin._

Stablecoins are tokens that are backed by assets outside of the XRPL. Stablecoins allow users to transact in familiar currencies, and provide a convenient way to get funds into and out of the XRPL blockchain.

The mechanics of issuing a stablecoin are not complicated.

1. Decide on the 3-character name for your stablecoin.
2. Create a trust line between the issuing account and a consuming account establishing a maximum number of stablecoins to transfer.
3. Send a payment of stablecoins to the consumer up to the maximum amount in the trust line.

While anyone can issue a token with any currency code in the XRP Ledger, stablecoin value comes from the promise that it can be redeemed for a corresponding asset. Issuing a stablecoin might involve regulatory obligations, which vary by jurisdiction. For these reasons, an established, reputable business is most likely to succeed in issuing a stablecoin.

[![Stablecoin Workflow](img/uc-stablecoin-flow.png)](img/uc-stablecoin-flow.png)

There are many decisions to make and artifacts to generate as you prepare to release a new stablecoin. You can use the XRPL Foundation's [Self-assessment Questionnaire](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf) as a starting point to gather and produce the necessary information for a successful launch.

## Choose the Type of Stablecoin

The first step is to decide the type of stablecoin you want to create. Your choice of stablecoin type might require additional steps, such as signing on financial or audit partners.

There are five common types of stablecoin you can create on the XRPL. 

### Fiat Backed

Fiat-backed stablecoins are based on an existing currency such as EUR, USD, YEN, and so on. They are backed at an exchange rate of 1:1. It is a simple, stable option, but it is more centralized and susceptible to hacking.

### Crypto Backed

Crypto-backed stablecoins are similar to fiat-backed stablecoins, but set aside a certain amount of cryptocurrency as collateral. It's decentralized, doesn't require a custodian or audits and regulation. It's also more volatile, and reliant on the stability of the underlying cryptocurrency.

### Commodity Backed

Commodity-backed stablecoins are based on a fungible asset such as gold, real estate, oil,  or electricity. Commodities are relatively stable and liquid, but are centralized and require regular audits to verify their value.

### Financial Instrument Backed

A stablecoin can be backed by financial instruments such as bonds or equity shares.

### Non-collateralized

A non-collateralized stablecoin relies on algorithm-generated smart contracts to supply or sell tokens, similar to a central bank's approach to printing and destroying currency. No collateral is required to mint currency. Value is controlled by supply and demand through algorithms that stabilize the price. Non-collateralized stablecoins are a less popular option due to their volatility.

## Set Up Your Node Services

For lighter use cases and individual servers, you can often rely on free public servers. However, the more serious your use of the XRP Ledger becomes, the more important it becomes to have your own infrastructure.

There are many reasons you might want to run your own servers, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. See [Reasons to Run Your Own Server](networks-and-servers.html#reasons-to-run-your-own-server).

Alternatively, you can use an external node service provider like OpenNode. See [OpenNode](https://www.opennodecloud.com/).

## Sandbox Access

For testing purposes, you can implement, deploy, and trade your stablecoin on the XRPL Testnet or Devnet servers. Visit the XRP Faucets page to generate your test network credentials. Use the listed server URIs on that page to connect to and interact with your chosen test network. See [XRP Faucets](xrp-testnet-faucet.html).


## Token Settings

Before you mint your new stablecoin, you need to configure settings, some of which are immutable once you issue the first coin.


### Create Your Issuing and Distribution Accounts

Create a new account that you designate as the _issuer_, sometimes called the "cold" wallet. There is nothing different or special about the account itself, only the way you use it. Use the account to mint your stablecoins.

Many implementations use a _standby_ account as a "warm" wallet. Trusted human operators use the standby account to distribute stablecoins to _operational_ accounts.

<div align="center">
<img src="img/uc-stablecoin-distribution-flow.png" height="50%" width="50%"></image>
</div>

Operational accounts, or "hot" wallets, trade with other accounts on the XRPL. Automated, internet-connected systems use the secret keys to these addresses to conduct day-to-day business like transfers to customers and partners.

Using standby and operational accounts helps to insulate the issuing account against hacking attacks, and also makes it easier to monitor the creation and destruction of your stablecoins.


### Set Your Transfer Fee

A transfer fee setting charges users a percentage fee when transferring tokens between accounts.

When users send a token with a transfer fee, the amount of the transfer fee is debited from the sending side in addition to the destination amount, but only the destination amount is credited to the recipient. The amount of the fee "vanishes" from the XRP Ledger. As a stablecoin issuer, this means that you gain that much equity in your reserves outside of the XRP Ledger—or, in other words, the amount you need to keep as collateral decreases each time users pay a transfer fee.

For more information, see [Transfer Fees](transfer-fees.html).


### Set Your Tick Size

The Tick Size setting controls how many decimal places are used when calculating exchange rates in the [Decentralized Exchange](decentralized-exchange.html). A higher Tick Size (more decimal places) means more precision and less rounding in the amounts of various trades. A smaller Tick Size works similar to the minimum bid increment at an auction, saving everyone the time and effort of gradually bidding up a price by unreasonably small amounts.

The Tick Size is an account-level setting and applies to all tokens issued by the same address.

See [Tick Size](ticksize.html).


### Set the Default Ripple Flag

The Default Ripple flag controls whether the balances on a trust line are allowed to _ripple_ by default. Rippling is what allows customers to send and trade tokens among themselves. An issuer MUST allow rippling on all the trust lines to its issuing address. 

Before asking customers to create trust lines to your issuing address, enable the Default Ripple flag on that address. Otherwise, you must individually disable the No Ripple flag for each trust line that other addresses have created.

See [Rippling](rippling.html).


### Enable Destination Tags

If your stablecoin application handles transactions on behalf of several customers, it might not be immediately obvious to which account you should credit. Destination tags help to avoid this situation by requiring the sender to specify the beneficiary or destination for a payment. To enable the `RequireDest` flag, set the `asfRequireDest` value (1) in the `SetFlag` field of an `AccountSet` transaction. See [Source and Destination Tags](source-and-destination-tags.html).


## Asset Control Features

You have several options for controlling the creation and distribution of your stablecoins.

### Fixed Supply

Restricting your stablecoins to a fixed number guarantees that stablecoin value will not be diluted in the future if you decide to issue more tokens.

To create a fixed supply:

1. Create a distribution wallet with settings similar to your issuing wallet.
2. Set up a trust line between the issuing wallet and the distribution wallet.
3. Send all tokens from the issuing wallet to the distribution wallet.
4. Black hole the issuing account.


### Authorized Trust Lines

When you need to follow compliance rules such as Know Your Customer (KYC) and Anti-Money Laundering (AML), you can use trust lines to create permissioned pools for the distribution of your stablecoin. This allows you to be certain to whom the funds are transferred.

See [Authorized Trust Lines](authorized-trust-lines.html).


### Freeze Flags

You have the ability to freeze your stablecoins in your holder accounts. You might do this when you suspect fraudulent activity, or to enforce holds. You can freeze individual trust lines, or enact a global freeze of all activity.

Conversely, you can set the No Freeze feature, which permanently gives up the ability to freeze tokens. This makes your stablecoin more like fiat currency, in the sense that you cannot interfere with counterparties trading the tokens among themselves.

See [Freezing Tokens](freezes.html).


### Clawback Flags

Clawback allows you to retrieve, or _clawback_, stablecoins from a trust line under specific circumstances. This gives you added ability to respond to challenges such as lost account access or malicious activity.

See [Clawback](clawback.html).

For more detail on configuration capbilities, see [Stablecoin Issuer Configuration](stablecoin-issuer-configuration.html).

## Asset Information

Publish standard information about your stablecoin to enable potential traders to verify the coin's stability.  


### Asset Nomenclature

Choose a 3-character string for your currency code. Per ISO 4217, supranational currency codes begin with the letter _X_ for a currency that is not associated with a country. See [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#X_currencies_(funds,_precious_metals,_supranationals,_other)).


### xrp-ledger.toml 

You can use the _Currencies_ table in an XRPL TOML file to provide additional information about your stablecoin. This makes the information about your cryptocurrency accessible in an expected place and format, and enhances transparency. See [xrp-ledger.toml File](xrp-ledger-toml.html#currencies).


## Account and Key Management

### Multisignature Schemes

By using multiple keys and signing weights, issuers and asset holders can distribute trust and responsibility for approving transactions for an account between different users and systems. This gives you the flexibility to gate those signatures using internal processes and controls.

For example, you might have 4 officers with authority to approve distribution of your stablecoin from the issuer account to the standby account. You set a quorum of _2_. The president has a signing weight of _2_, while 3 vice-presidents each have a signing weight of _1_. This allows the president to approve any distribution. It takes 2 of the 3 vice-presidents to approve a distribution. By adding a signing weight to the officer permissions, you ensure that they have the proper authority and accountability for making distribution decisions.

See [Multi-signing](multi-signing.html).

<!--
### Omnibus Wallets

For customers who prefer not to take custody of their own wallets, you can create an omnibus account with subaccounts, then assign these accounts to customers. 

## Treasury Management

### Reconciliation

Periodically audit to verify that distributed stablecoins and stablecoins in escrow equal the total number of stablecoins.

### Checking Reserves

How to check reserves.

### Proof of Reserves

How to transparently report the current number of stablecoins held in reserve.
-->

## Token Operations

### Issue a Stablecoin

Actually issuing a new stablecoin is straightforward. You can create a trust line between your issuing account and your standby account, then transfer stablecoins up to that maximum amount. The standby account can establish trust lines to your operational accounts to distribute the stablecoins, and the operational accounts can establish trust lines to transfer the stablecoins to users.

In practice, there are many considerations when issuing a stablecoin that users will trade with confidence.

Before you issue your stablecoin, download and read the questions in the [Self-assessment Questionnaire](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf). When you are ready to distribute your stablecoin, complete the public [Token Issuer Self-Assessment Questionnaire](https://foundation.xrpl.org/token-assessment-framework/). This allows full transparency to the XRPL community about your new stablecoin.

See:

- [Stablecoin Issuer - Precautions](stablecoin-issuer-precautions.html)
- [Stablecoin Issuer - Compliance Guidelines](stablecoin-issuer-compliance-guidelines.html)
- [Issue a Fungible Token](issue-a-fungible-token.html)

### Freeze a Trust Line

If an account shows suspicious activity or violates your institution's terms of use, you have the option of freezing the trust line while you resolve the issue (provided you have not set the `enableNoFreeze` tag on your issuing account).

See [Freeze a Trust Line](freeze-a-trust-line.html).


### Global Freeze

If you see signs of suspicious activity, you can enact a global freeze on your account to prevent users from sending your tokens to each other and trading your token in the decentralized exchange. 

See [Enact Global Freeze](enact-global-freeze.html)


### Clawback

For regulatory purposes, some issuers must have the ability to recover issued tokens after they are distributed to accounts. For example, if an issuer were to discover that tokens were sent to an account sanctioned for illegal activity, the issuer could recover, or _claw back_, the funds.

See [Clawback](clawback.html).

### Burn

One way to manage the value of a stablecoin is to destroy, or _burn_ stablecoins. When you burn stablecoins, you reduce the number of tokens in circulation. That will typically increase the value of the remaining tokens as supply falls.

To destroy stablecoins, you can transfer them to a "black hole" account (an account address where no one knows the secret key).

See [Disable Master Key Pair](disable-master-key-pair.html).

### Reliable Transaction Submission

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To submit transactions reliably, follow these guidelines:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (Many [client libraries](client-libraries.html) do this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose [ledger index][] is less than or equal to the transaction's `LastLedgerSequence` parameter.

For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).

<!--
### List on XRPL Native DEX


### List on AMM (link to future tutorials)


### List on XRPL Token Marketplaces
Sologenic, onXRP, XPMarket

-->

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}