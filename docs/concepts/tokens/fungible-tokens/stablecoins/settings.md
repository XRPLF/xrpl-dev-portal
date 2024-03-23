---
html: stablecoin-settings.html
parent: stablecoins.html
seo:
    description: Settings to configure before issuing your stablecoin.
labels:
  - XRP
  - Stablecoin
---
# Stablecoin Settings

Before you mint your new stablecoin, you need to configure settings, some of which are immutable once you issue the first coin.

## Create Your Issuing and Distribution Accounts

Create a new account that you designate as the _issuer_, sometimes called the "cold" wallet. There is nothing different or special about the account itself, only the way you use it. Use the account to mint your stablecoins.

Many implementations use a _standby_ account as a "warm" wallet. Trusted human operators use the standby account to distribute stablecoins to _operational_ accounts.

![Stablecoin distribution flow](/docs/img/uc-stablecoin-distribution-flow.png "Stablecoin Distribution Flow")

Operational accounts, or "hot" wallets, trade with other accounts on the XRPL. Automated, internet-connected systems use the secret keys to these addresses to conduct day-to-day business like transfers to customers and partners.

Using standby and operational accounts helps to insulate the issuing account against hacking attacks, and also makes it easier to monitor the creation and destruction of your stablecoins.


## Set Your Transfer Fee

A transfer fee setting charges users a percentage fee when transferring tokens between accounts.

When users send a token with a transfer fee, the amount of the transfer fee is debited from the sending side in addition to the destination amount, but only the destination amount is credited to the recipient. The amount of the fee "vanishes" from the XRP Ledger. As a stablecoin issuer, this means that you gain that much equity in your reserves outside of the XRP Ledger—or, in other words, the amount you need to keep as collateral decreases each time users pay a transfer fee.

For more information, see [Transfer Fees](../../transfer-fees.md).


## Set Your Tick Size

The Tick Size setting controls how many decimal places are used when calculating exchange rates in the [Decentralized Exchange](../../decentralized-exchange/index.md). A higher Tick Size (more decimal places) means more precision and less rounding in the amounts of various trades. A smaller Tick Size works similar to the minimum bid increment at an auction, saving everyone the time and effort of gradually bidding up a price by unreasonably small amounts.

The Tick Size is an account-level setting and applies to all tokens issued by the same address.

See [Tick Size](../../decentralized-exchange/ticksize.md).


## Set the Default Ripple Flag

The Default Ripple flag controls whether the balances on a trust line are allowed to _ripple_ by default. Rippling is what allows customers to send and trade tokens among themselves. An issuer MUST allow rippling on all the trust lines to its issuing address.

Before asking customers to create trust lines to your issuing address, enable the Default Ripple flag on that address. Otherwise, you must individually disable the No Ripple flag for each trust line that other addresses have created.

See [Rippling](../rippling.md).


## Enable Destination Tags

If your stablecoin application handles transactions on behalf of several customers, it might not be immediately obvious to which account you should credit. Destination tags help to avoid this situation by requiring the sender to specify the beneficiary or destination for a payment. To enable the `RequireDest` flag, set the `asfRequireDest` value (1) in the `SetFlag` field of an `AccountSet` transaction.

See [Source and Destination Tags](../../../transactions/source-and-destination-tags.md).

## Asset Control Features

You have several options for controlling the creation and distribution of your stablecoins.


### Authorized Trust Lines

When you need to follow compliance rules such as Know Your Customer (KYC) and Anti-Money Laundering (AML), you can use trust lines to create permissioned pools for the distribution of your stablecoin. This allows you to be certain to whom the funds are transferred.

See [Authorized Trust Lines](../authorized-trust-lines.md).


### Freeze Flags

You have the ability to freeze your stablecoins in your holder accounts. You might do this when you suspect fraudulent activity, or to enforce holds. You can freeze individual trust lines, or enact a global freeze of all activity.

Conversely, you can set the No Freeze feature, which permanently gives up the ability to freeze tokens. This makes your stablecoin more like fiat currency, in the sense that you cannot interfere with counterparties trading the tokens among themselves.

See [Freezing Tokens](../freezes.md).


### Clawback Flags

_(Requires the [Clawback amendment](/resources/known-amendments.md#clawback))_

Clawback allows you to retrieve, or _clawback_, stablecoins from a trust line under specific circumstances. This gives you added ability to respond to challenges such as lost account access or malicious activity.

See [Clawback](../../../../references/protocol/transactions/types/clawback.md).


### Fixed Supply

Restricting your stablecoins to a fixed number guarantees that stablecoin value will not be diluted in the future if you decide to issue more tokens.

To create a fixed supply:

1. Create a distribution wallet with settings similar to your issuing wallet.
2. Set up a trust line between the issuing wallet and the distribution wallet.
3. Send all tokens from the issuing wallet to the distribution wallet.
4. Black hole the issuing account.
