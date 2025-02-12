---
category: 2025
date: 2025-02-12
seo:
    title: How to Fetch Up-to-Date Asset Price Information Using DIA Oracles
    description: Explore ecosystem price oracles such as DIA and discover how to use DIA Oracles on the XRP Ledger to fetch up-to-date asset price information. 
labels:
    - Development
markdown:
    editPage:
        hide: true
---
# How to Fetch Asset Price Information Using DIA Oracles

Explore ecosystem price oracles such as DIA and discover how to use DIA Oracles on the XRP Ledger to fetch up-to-date asset price information. 

<!-- BREAK -->

## Introduction to DIA

[DIA](https://www.diadata.org/) is a trustless oracle network that delivers data feeds for any token, LST, RWA, random numbers and more to any blockchain. The network is permissionless, enabling nodes and stakers to participate in distributed data sourcing, secured by crypto-economic and cryptographic mechanisms. DIA’s native Ethereum L2 rollup, ‘Lasernet’, executes all critical oracle operations, ensuring trustless computation and full verifiability.

## Usage of DIA Oracles on XRP Ledger

dApps building on XRP Ledger can utilize DIA oracles to obtain up-to-date asset price information. These deployed oracles are suitable for use in production environments. They come with a list of supported assets and settings. However, if dApps require a custom oracle with a different set of assets and configurations, they should [contact DIA on Telegram](https://t.me/diabdteam).

## Deployed Contracts

Access the oracles in the registry from our feeders below:
- **XRPL Testnet Oracle**: diadata
- **XRPL Mainnet Oracle**: diadata


Here is an example of how to access a price value on DIA oracles:

1. Access the oracle registry on XRPL.

2. Call the retrieve function with the argument being the full pair name such as BTC/USD.

3. The response of the call contains two values:
    - The current asset price in USD with a fix-comma notation of 8 decimals.
    - The UNIX timestamp of the last oracle update.

## Included Price Feeds and Data Sources

The XRPL oracle includes the following price feeds:

| Asset Ticker | Asset Blockchain | Asset Address | Asset Markets Overview |
|:-----------|:----------|:-------------|:-----------|
| ETH | Ethereum | 0x0000000000000000000000000000000000000000 | [ETH Asset Information](https://www.diadata.org/app/price/asset/Ethereum/0x0000000000000000000000000000000000000000/) |
| BTC | Bitcoin | 0x0000000000000000000000000000000000000000 | [BTC Asset Information](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000/) |
| XRP | XRP Ledger | 0x0000000000000000000000000000000000000000 | [XRP Asset Information](https://www.diadata.org/app/price/asset/XRPL/0x0000000000000000000000000000000000000000/) |


Learn more about DIA’s [data sourcing](https://docs.diadata.org/introduction/dia-technical-structure/data-sourcing) and [data computation](https://docs.diadata.org/introduction/dia-technical-structure/data-computation) architecture.


## Oracle Configuration Settings

### Methodology: VWAPIR

The final price point for each asset is calculated by computing the assets' trade information across multiple DEXs and CEXs. This is done using a Volume Weighted Average Price with Interquartile Range (VWAPIR) methodology. Learn more about [VWAPIR](https://docs.diadata.org/products/token-price-feeds/exchangeprices/vwapir-volume-weighted-average-price-with-interquartile-range-filter).

### Update Frequency: 2-minute Heartbeat and 0.2% Deviation Threshold

A consistent heartbeat refreshes all asset prices every 2 minutes. Moreover, if the oracle detects a price fluctuation exceeding 0.2% from the last published rate, it promptly sends an update on-chain.

## Support

For assistance, connect with the DIA team directly on [Discord](https://discord.gg/ZvGjVY5uvs) or [Telegram](https://t.me/diadata_org). Developers seeking other specialized, production-grade oracle with tailored price feeds and configurations can initiate the request here: [Request a Custom Oracle | DIA Documentation](https://docs.diadata.org/introduction/intro-to-dia-oracles/request-an-oracle)


