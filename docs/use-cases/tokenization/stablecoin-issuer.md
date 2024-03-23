---
html: stablecoin-issuer.html
parent: tokenization.html
seo:
    description: Issue your own stablecoin, based on assets of equal value outside of the XRP Ledger.
labels:
  - Tokens
  - Stablecoin
---
# Stablecoin Issuer

_As a financial professional, I want to issue a stablecoin so that I can earn revenue by charging fees for withdrawals or transfers of the stablecoin._

Stablecoins are tokens that are backed by assets outside of the XRPL. Stablecoins allow users to transact in familiar currencies, and provide a convenient way to get funds into and out of the XRPL blockchain.

The mechanics of issuing a stablecoin are not complicated.

1. Decide on the name for your stablecoin (either following the 3-character ISO standard or using a 160-bit hex string. See [Currency Codes](../../references/protocol/data-types/currency-formats.md#currency-codes)).
2. Create a trust line between the issuing account and a consuming account establishing a maximum number of stablecoins to transfer.
3. Send a payment of stablecoins to the consumer up to the maximum amount in the trust line.

While anyone can issue a token with any currency code in the XRP Ledger, stablecoin value comes from the promise that it can be redeemed for a corresponding asset. Issuing a stablecoin might involve regulatory obligations, which vary by jurisdiction. For these reasons, an established, reputable business is most likely to succeed in issuing a stablecoin.

[![Stablecoin Workflow](/docs/img/uc-stablecoin-flow.png)](/docs/img/uc-stablecoin-flow.png)

There are many decisions to make and artifacts to generate as you prepare to release a new stablecoin. You can use the XRPL Foundation's [Self-assessment Questionnaire](https://foundation.xrpl.org/wp-content/uploads/2022/03/self_assessment_questionnaire_140322.pdf) as a starting point to gather and produce the necessary information for a successful launch.

## Choose the Type of Stablecoin

The first step is to decide the type of stablecoin you want to create. Your choice of stablecoin type might require additional steps, such as signing on financial or audit partners.

![Stablecoin](/docs/img/uc-stablecoin-stable-coin.png)

There are five common types of currency tokens you can create on the XRPL: fiat-backed, crypto-backed, commodity-backed, financial instrument-backed, and non-collateralized. See [Stablecoins](../../concepts/tokens/fungible-tokens/stablecoins/index.md).

## Set Up Your Node Services

For lighter use cases and individual servers, you can often rely on free public servers. However, the more serious your use of the XRP Ledger becomes, the more important it becomes to have your own infrastructure.

There are many reasons you might want to run your own servers, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. See [Reasons to Run Your Own Server](../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server).

Alternatively, you can use an external node service provider like OpenNode. See [OpenNode](https://www.opennodecloud.com/).

## Sandbox Access

![Sandbox](/docs/img/uc-stablecoin-sandbox.png)

For testing purposes, you can implement, deploy, and trade your stablecoin on the XRPL Testnet or Devnet servers. Visit the XRP Faucets page to generate your test network credentials. Use the listed server URIs on that page to connect to and interact with your chosen test network. See [XRP Faucets](/resources/dev-tools/xrp-faucets).


## Stablecoin Settings

Before you mint your new stablecoin, you need to configure settings, some of which are immutable once you issue the first coin.

See [Stablecoin Settings](../../concepts/tokens/fungible-tokens/stablecoins/settings.md).

For more detail on configuration capbilities, see [Stablecoin Issuer Configuration](../../concepts/tokens/fungible-tokens/stablecoins/configuration.md).

## Asset Information

Publish standard information about your stablecoin to enable potential traders to verify the coin's stability.


### Asset Nomenclature

Choose a 3-character string for your currency code. Per ISO 4217, supranational currency codes begin with the letter _X_ for a currency that is not associated with a country. See [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#X_currencies_(funds,_precious_metals,_supranationals,_other)).

Currency codes do not have to be unique. For instance, if you're issuing a stablecoin backed by a national fiat currency, it's better to use the official code for that currency, such as _EUR_.

### xrp-ledger.toml

You can publish information about what currencies you issue, and which XRP Ledger addresses you control, to protect against impostors or confusion, using an `xrp-ledger.toml` file on your website. This machine-readable format is convenient for client applications to process. If you run an XRP Ledger validator, you can also publish the key in the same file.

You can use the _Currencies_ table to provide additional information about your stablecoin. This makes the information about your cryptocurrency accessible in an expected place and format, and enhances transparency. See [xrp-ledger.toml File](../../references/xrp-ledger-toml.md#currencies).


## Account and Key Management

### Multisignature Schemes

By using multiple keys and signing weights, issuers and asset holders can distribute trust and responsibility for approving transactions for an account between different users and systems. This gives you the flexibility to gate those signatures using internal processes and controls.

See [Multi-signing](../../concepts/accounts/multi-signing.md).

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

- [Stablecoin Issuer - Precautions](../../concepts/tokens/fungible-tokens/stablecoins/precautions.md)
- [Stablecoin Issuer - Compliance Guidelines](../../concepts/tokens/fungible-tokens/stablecoins/compliance-guidelines.md)
- [Issue a Fungible Token](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md)

### Create a Trust Line

Trust lines are structures in the XRP Ledger for holding tokens. Trust lines enforce the XRP Ledger's rule that you cannot cause someone else to hold a token they don't want. This precaution is necessary to enable the XRP Ledger's use case for community credit, among other benefits.

Each "trust line" is a bidirectional relationship consisting of:

- The identifiers for the two accounts that the trust line connects.
- A single, shared balance, which is positive from the perspective of one account and negative from the other perspective.
- Various settings and metadata. Each of the two accounts can control its own settings on the trust line. Each side sets a limit on the trust line.

Each trust line is specific to a given currency code. Two accounts can have any number of trust lines between them for different currency codes, but only one shared trust line for any particular currency code.

See [Trust Lines](../../concepts/tokens/fungible-tokens/index.md#trust-lines).

### Authorized Trust Lines

The Authorized Trust Lines feature enables issuers to create tokens that can only be held by accounts that the issuer specifically authorizes. This feature only applies to tokens, not XRP.

To use the Authorized Trust Lines feature, enable the `Require Auth` flag on your issuing account. While the setting is enabled, other accounts can only hold tokens you issue if you have authorized those accounts' trust lines to your issuing account.

See [Authorized Trust Lines](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md).


### Freeze a Trust Line

If you issue tokens in the XRP Ledger, you can enable the _No Freeze_ setting to permanently limit your own ability to use the token freezing features of the XRP Ledger. (As a reminder, this only applies to issued tokens, not XRP.)

If you do not enable the _No Freeze_ setting, when an account shows suspicious activity or violates your institution's terms of use, you have the option of freezing the trust line while you resolve the issue.

See [Freezing Tokens](../../concepts/tokens/fungible-tokens/freezes.md).


### Global Freeze

If you see signs of suspicious activity, you can enact a global freeze on your account to prevent users from sending your tokens to each other and trading your token in the decentralized exchange.

![Global Freeze](/docs/img/uc-stablecoin-global-freeze.png)

See [Enact Global Freeze](../../tutorials/how-tos/use-tokens/enact-global-freeze.md).


### Clawback

_(Requires the [Clawback amendment][] )_

Clawback is an optional setting that you can choose before you begin to distribute your stablecoin. For regulatory purposes, some issuers _must_ have the ability to recover issued tokens after they are distributed to accounts. For example, if an issuer were to discover that tokens were sent to an account sanctioned for illegal activity, the issuer could recover, or _claw back_, the funds.

See [Clawback](../../references/protocol/transactions/types/clawback.md).

![Clawback](/docs/img/uc-stablecoin-clawback.png)

### Partial Payments

Look out for partial payments. Payments with the partial payment flag enabled can be considered "successful" if any non-zero amount is delivered, even minuscule amounts.
* Check the transaction for a `delivered_amount` field. If present, that field indicates how much money _actually_ got delivered to the `Destination` address.
* In xrpl.js, you can use the [`xrpl.getBalanceChanges()` method](https://js.xrpl.org/modules.html#getBalanceChanges) to see how much each address received. In some cases, this can be divided into multiple parts on different trust lines.

See [Partial Payments](../../concepts/payment-types/partial-payments.md).

### Burn

One way to manage the value of a token is to destroy, or _burn_ tokens, which reduces the number of tokens in circulation. On the XRP Ledger, fungible tokens are automatically "burned" when they are sent to the issuing address. However, the issuer can freely create more tokens.

To ensure a limited supply, you can "black hole" the issuer after issuing tokens, by setting its regular key to an address like `rrrrrrrrrrrrrrrrrrrrrhoLvTp` for which no one knows the private key, and disabling the master key pair.

**Warning:** A black hole account has no way to send transactions of any kind, so you cannot update any settings or do any maintenance on the account afterwards!

See [Disable Master Key Pair](../../tutorials/how-tos/manage-account-settings/disable-master-key-pair.md).

### Reliable Transaction Submission

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To submit transactions reliably, follow these guidelines:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (Many [client libraries](../../references/client-libraries.md) do this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose [ledger index][] is bigger than or equal to the transaction's `LastLedgerSequence` parameter.

For more information, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

### List on the XRPL Native DEX

Decentralized exchanges (DEXes) are integral to the decentralized finance ecosystem. Listing your token on the XRP Ledger's built-in DEX enhances its visibility and accessibility, thereby attracting more liquidity. Begin by placing sell offers using a suitable interface, such as [Sologenic](https://sologenic.org/trade). As a precaution, use a separate account, not your issuing address, to trade.


### List on an AMM
_(Requires the [AMM amendment][])_

Automated Market Makers (AMMs) are smart contracts that provide liquidity in the XRP Ledger's decentralized exchange. Each AMM holds a pool of two assets and enables users to swap between them at an exchange rate set by a formula.

For any given pair of assets, there can be up to one AMM in the ledger. You can create the AMM for an asset pair with your new token if it doesn't exist yet, or deposit to an existing AMM. Those who deposit assets into an AMM are called _liquidity providers_ (LPs) and receive _LP Tokens_ from the AMM.

See [Automated Market Makers](../../concepts/tokens/decentralized-exchange/automated-market-makers.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
