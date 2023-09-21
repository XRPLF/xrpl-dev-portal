---
html: stablecoin-issuer.html
parent: tokenization.html
blurb: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
  - Stablecoin
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

There are five common types of stablecoin you can create on the XRPL: fiat-backed, crypto-backed, commodity-backed, financial instrument-backed, and non-collateralized. See [Stablecoin Types](stablecoin-types.html).

## Set Up Your Node Services

For lighter use cases and individual servers, you can often rely on free public servers. However, the more serious your use of the XRP Ledger becomes, the more important it becomes to have your own infrastructure.

There are many reasons you might want to run your own servers, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. See [Reasons to Run Your Own Server](networks-and-servers.html#reasons-to-run-your-own-server).

Alternatively, you can use an external node service provider like OpenNode. See [OpenNode](https://www.opennodecloud.com/).

## Sandbox Access

For testing purposes, you can implement, deploy, and trade your stablecoin on the XRPL Testnet or Devnet servers. Visit the XRP Faucets page to generate your test network credentials. Use the listed server URIs on that page to connect to and interact with your chosen test network. See [XRP Faucets](xrp-testnet-faucet.html).


## Stablecoin Settings

Before you mint your new stablecoin, you need to configure settings, some of which are immutable once you issue the first coin.

See [Stablecoin Settings](stablecoin-settings.html).

For more detail on configuration capbilities, see [Stablecoin Issuer Configuration](stablecoin-configuration.html).

## Asset Information

Publish standard information about your stablecoin to enable potential traders to verify the coin's stability.  


### Asset Nomenclature

Choose a 3-character string for your currency code. Per ISO 4217, supranational currency codes begin with the letter _X_ for a currency that is not associated with a country. See [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#X_currencies_(funds,_precious_metals,_supranationals,_other)).


### xrp-ledger.toml 

You can use the _Currencies_ table in an XRPL TOML file to provide additional information about your stablecoin. This makes the information about your cryptocurrency accessible in an expected place and format, and enhances transparency. See [xrp-ledger.toml File](xrp-ledger-toml.html#currencies).


## Account and Key Management

### Multisignature Schemes

By using multiple keys and signing weights, issuers and asset holders can distribute trust and responsibility for approving transactions for an account between different users and systems. This gives you the flexibility to gate those signatures using internal processes and controls.

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

Actually issuing a new stablecoin is straightforward. In practice, there are many considerations when issuing a stablecoin that users will trade with confidence.

Before you issue your stablecoin, download and read the questions in the [Self-assessment Questionnaire](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf). When you are ready to distribute your stablecoin, complete the public [Token Issuer Self-Assessment Questionnaire](https://foundation.xrpl.org/token-assessment-framework/). This allows full transparency to the XRPL community about your new stablecoin.

For additional considerations, see:

- [Stablecoin Issuer - Precautions](stablecoin-precautions.html)
- [Stablecoin Issuer - Compliance Guidelines](stablecoin-compliance-guidelines.html)
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