---
category: 2024
date: 2024-08-05
seo:
    title: XLS-30 - XRP Ledger Automated Market Maker
    description: The XLS-30 AMM amendment unlocks new liquidity and trading options on the XRP Ledger network. Explore how developers can integrate with AMM.
labels:
    - Development
theme:
    markdown:
        editPage:
            hide: true
---
# XLS-30 Overview: XRP Ledger Automated Market Maker

XLS-30 is live on Mainnet, bringing with it new avenues for liquidity and trading on the network. Designed as a native protocol, XLS-30 enables developers to integrate with the AMM and establish their own front-end trading and liquidity provision interfaces. 

<!-- BREAK -->

The XRPL decentralized exchange (DEX) currently provides liquidity exclusively by manual market making and order books. The XLS-30 adds non-custodial automated market maker (AMM) as a native feature to the XRPL DEX, which offers an opportunity to earn returns to those who provide liquidity to the AMM and decreases slippage when trading the long tail of tokens.

## XLS-30 Timeline

The XRP Ledger’s decentralized amendment process plays a crucial role in the adoption of new features like the AMM. This has meant that the journey toward integration has been a long one, as [validators](https://xrpl.org/validators.html) have thoroughly considered all outcomes before making a decisive turn with their relevant vote. 

| Phase                      | Date             |
|:---------------------------|:-----------------|
| [AMM Proposal](https://dev.to/ripplexdev/a-proposal-for-the-future-of-the-xrp-ledger-dex-4l7e) | Jul. 2022 |
| [AMM Performance Testing](https://dev.to/ripplexdev/amm-performance-testing-report-3hon) | Oct. 2023 |
| [XLS-30 Proposal Voting](https://xrpscan.com/amendments) | Jan. - Mar. 2024 |
| [XLS-30 Amendment Enabled](https://xrpl.org/resources/known-amendments#amm) | Mar. 2024 |
| [AMM Bug Fix Integration](https://dev.to/ripplexdev/xrp-ledger-amm-bug-fix-now-integrated-a-detailed-analysis-4915) | Apr. 2024 |

This [consensus](https://xrpl.org/consensus.html) process ensures that changes to the ledger continue to be appropriately scrutinized and vetted before rejection or approval by the community, reflecting a collective agreement on the network’s direction. For any amendment to pass, it must secure at least 80% approval from validators over a two-week continuous voting period, a testament to the XRP Ledger’s commitment to decentralized governance.

To lower the barrier to entry for developers and encourage innovation, several key client libraries ([xrpl.js](https://js.xrpl.org/), [xrpl-py](https://xrpl-py.readthedocs.io/en/stable/), and [xrpl4j](https://xrpl.org/blog/2021/introducing-xrpl4j/)) have been updated and maintained. These libraries have been equipped with functionalities specific to AMM operations, such as creating liquidity pools, managing LP tokens, and executing AMM-specific transactions. Moreover, the [XRPL Explorer](https://amm-devnet.xrpl.org/) has been enhanced to support visibility into AMM pools, offering insights into liquidity depth, transaction history, and a great deal more. 

## What is an Automated Market Maker?

The AMM model on the XRPL is designed to facilitate automatic trading and liquidity provision without the need for traditional order books. This is achieved through the creation of liquidity pools for pairs of assets, where the price of assets is determined algorithmically based on the ratio of the assets in the pool. This model is crucial for ensuring constant liquidity and more stable prices, particularly for pairs that might not have a large volume of direct market trades.

## Core Features of the AMM Integration on XRPL

**Protocol Native:**

* As a core primitive of the XRPL, developers can use AMM functionality without the need to create their own smart contracts and face associated risks.

**Aggregated Liquidity:**

* Liquidity for all trading pairs is aggregated at the protocol layer, rather than fragmented or siloed across individual smart contracts. 

**Continuous Auction Mechanism:**

* The implementation of a continuous auction mechanism allows arbitrageurs to bid to capture price discrepancies at a discount.
* The AMM continuously auctions trading advantages for 24-hour periods at near zero trading fees. This results in immediate arbitrage trading and maintains stable volatility.
* Proceeds from each auction are partially refunded to the prior arbitrage slot holder and partially burnt, effectively reducing impermanent loss for liquidity providers.

**Single-sided Liquidity Provision:**

* Only a single asset is required to contribute to a pool, decreasing the required number of steps for users to contribute liquidity.

**No Miner Extractable Value (MEV):**

* The XRPL uses federated consensus, meaning that each ledger (equivalent to a “block”) is determined by a consensus of participants whereby no single party can dictate which transactions or ledgers are valid. There are no miners to prioritize only certain transactions (namely higher gas fee orders) to the XRP Ledger.
* The AMM’s (and existing DEX) orders inherit the core ledger’s deterministic-random transaction ordering secured by the distributed network of validators. While it does not eliminate the ability to front run transactions, it does become more difficult compared to an open mem pool.

**CLOB DEX Integration:**

* The AMM is integrated with the central limit order book (CLOB)-based DEX and enables price optimization to determine whether swapping within a liquidity pool, through the order book, or both, provides the best rate and executes accordingly. This ensures that transactions can automatically use the most efficient path for trades, whether through offers on the DEX or through AMM pools, optimizing for the best possible exchange rates, thereby enhancing DEX liquidity.

## Core Transactions of XRPL AMM Protocol

* **AMMCreate:** Enables the creation of a new AMM instance, initializing it with funding and defining the asset pair.
* **AMMDeposit:** Allows users to add liquidity to an existing AMM, receiving Liquidity Provider (LP) tokens in proportion to their contribution.
* **AMMWithdraw:** Crypto LPs can withdraw their funds from the AMM, surrendering their LP tokens and receiving their share of the assets back.
* **AMMBid:** Users bid on the AMM’s auction slot, aiming for discounted trading fees.
* **AMMVote:** Enables LPs to vote on the trading fee percentage, influencing the economics of the AMM pool.

### LP Tokens and Governance

LP tokens play a central role in the AMM ecosystem, representing the liquidity provider's share in the pool. These tokens not only pool ownership shares but also grant holders a say on key parameters of the AMM, such as trading fees. This feature introduces a layer of decentralized governance, allowing for a dynamic and community-driven approach to managing the pools.

## Building with AMM on XRPL: A Step by Step Guide

**Step 1: Setting Up Your Development Environment** 

To start building with AMM functionality, developers should first set up their development environment by integrating with the [xrpl.js](https://js.xrpl.org/), [xrpl-py](https://xrpl-py.readthedocs.io/en/stable/), or [xrpl4j](https://xrpl.org/blog/2021/introducing-xrpl4j/) libraries. These libraries have been updated to support AMM transactions and provide a solid foundation for interacting with the XRPL's AMM features.

**Step 2: Creating and Managing AMM Pools**

Developers can create AMM pools for any pair of assets on the XRPL by executing the [AMMCreate](https://xrpl.org/docs/references/protocol/transactions/types/ammcreate) transaction. This involves specifying the asset pair and providing initial liquidity. Once a pool is established, it can be managed through additional transactions like [AMMDeposit](https://xrpl.org/docs/references/protocol/transactions/types/ammdeposit) and [AMMWithdraw](https://xrpl.org/docs/references/protocol/transactions/types/ammwithdraw), allowing for a dynamic and responsive liquidity environment.

**Step 3: Engaging with the Community for Feedback and Improvement**

As the AMM functionality is novel and complex, engaging with the XRPL community for feedback, bug reports, and suggestions is crucial. The [XRPL Developers Discord channel](https://discord.gg/sfX3ERAMjH) and forums are excellent platforms for collaboration, offering a space for developers to share insights, ask questions, and contribute to the ongoing refinement of the AMM feature.

## Use Cases and Applications

The integration of the AMM on XRPL opens up exciting possibilities for financial and non-financial applications. 

**Financial Applications**

Developers can create DeFi services like trading platforms, yield farming applications, and more, that leverage the efficiency and liquidity of AMM pools. The ability to easily swap assets and provide liquidity directly on the ledger enhances user experiences and can drive adoption of a variety of services.

**Non-Financial Integrations**

AMM functionality can enhance non-financial XRPL applications by simplifying transactions that involve asset exchanges. For example, platforms offering NFTs or other digital goods can integrate AMM to facilitate seamless asset swaps, improving the user journey and expanding the use cases for their offerings.


## Getting Started and Resources

Access the most up-to-date [technical documentation](https://opensource.ripple.com/docs/xls-30d-amm/amm-uc/) to get started, including comprehensive guides, API references, and tutorials on AMM and other XRP Ledger features. Additionally, the [Livenet XRPL Explorer](https://amm-devnet.xrpl.org/) allows developers to view real-time data on AMM pools, transactions, and more, offering valuable insights for development and analysis. 

The AMM integration marks a significant moment in the evolution of the XRP Ledger, introducing a robust mechanism for liquidity and trading that aligns with the principles of decentralized finance. As developers explore and innovate within this new framework, the potential for creating impactful and user-friendly DeFi applications on the ledger is immense. The journey ahead is an exciting one, with the AMM feature laying the groundwork for a vibrant ecosystem of financial innovation on XRP Ledger.
