---
category: 2024
date: 2024-03-21
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Get Ready for AMM

The [AMM Amendment](/resources/known-amendments#amm) to the XRP Ledger protocol, which adds Automated Market Maker functionality, is on track to become enabled on Mainnet on 2024-03-22. If it maintains support from a supermajority of validators and becomes enabled as expected, this represents the culmination of a 2-year project to bring AMM to the XRPL, starting from the XLS-30 draft specification proposed by Aanchal Malhotra and David Schwartz of Ripple and incorporating the work and feedback of numerous contributors in the XRPL community during that time.

Any server that is currently working on Mainnet should continue to work after AMM gets enabled, since the Clawback amendment from the same release went live on 2024-02-08. However, it's still a good idea to update to the latest version, [`rippled` 2.1.0](./rippled-2.1.0.md), to take advantage of performance improvements, bug fixes, and to be ready for other amendments that are currently open for voting.

<!-- BREAK -->

## Background

The XRP Ledger has included a central limit order book decentralized exchange (CLOB DEX) since its inception, but other blockchains largely moved in the direction of facilitating currency exchanges through Automated Market Makers (AMMs), often using a "constant product" algorithm. In both systems, users offer some of their assets for exchange on-ledger, and the blockchain matches those with users trying to acquire specific assets; the users providing the assets take on _currency risk_, the possibility that exchange rates will move not in their favor. In the CLOB DEX, users explicitly set the price they're willing to exchange, whereas in an AMM a mathematical formula sets the price based on the supply and demand of currencies involved. In both cases, the market works most efficiently when there is a high volume being supplied and exchanged.

Advantages of a CLOB DEX include fine-grained control over amounts and prices, and unlike with an AMM, the offered funds aren't locked up while waiting for a match. (For example, using the CLOB DEX, one trader can offer up the same $100 for EUR, CAD, JPY, and so on, giving some or all of it to whoever comes first.) Advantages of an AMM include the simplicity of not needing to manually update exchange rates or add new offers as volume flows back and forth. (For example, if the flows between two assets are mostly one-sided, the price to exchange via the AMM will get steadily more expensive to reflect the imbalance of supply and demand, whereas in the CLOB DEX the traders would have to explicitly cancel their old offers and place new ones at higher prices.)

The AMM amendment adds Automated Market Makers that are designed to synergize with the CLOB DEX to bring traders the flexibility to provide liquidity in whatever method suits them best. Currency trades can automatically use a combination of the AMM and CLOB DEX to achieve the best rate. Also, unlike the AMMs on other blockchains, the XRP Ledger's AMM comes with a fee auction mechanism where liquidity providers can bid on the opportunity to trade against the AMM with reduced fees.

## Action Needed

If you run a tool that parses full ledgers or transaction metadata, you need to be ready for AMM-related data types to start appearing on Mainnet after the amendment becomes enabled. New data to look out for include 6 new AMM-related [transaction types](../../docs/references/protocol/transactions/types/index.md), a new [AMM ledger entry type](../../docs/references/protocol/ledger-data/ledger-entry-types/amm.md), a new `AMMID` field in some `AccountRoot` ledger entries, and several new [transaction result codes](../../docs/references/protocol/transactions/transaction-results/index.md) that the new transaction types can produce.

## Using AMM

If you want to use AMM after the amendment goes live, the first step is to [Create an Automated Maker](../../docs/tutorials/how-tos/use-tokens/create-an-automated-market-maker.md) for the currency pair you want to trade. Only the first user for any given currency pair needs to do this, though; other users can deposit to the existing AMM to get in on the action.

There are no special steps to use an AMM when trading currencies on the XRP Ledger. If you follow the standard steps to [Trade in the DEX](../../docs/tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange.md), and there's an AMM for the currency pair you're trading, your transaction automatically uses the AMM when doing so produces a better rate than consuming orders from the order book.

## Further Reading

For an overview of how the XRP Ledger's AMM works in greater detail, see [What Is An Automated Market Maker?](../../docs/concepts/tokens/decentralized-exchange/automated-market-makers.md).
