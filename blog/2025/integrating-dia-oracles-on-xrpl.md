---
category: 2025
date: 2025-05-16
seo:
  title: Integrating DIA Oracles on the XRP Ledger
  description: Learn how to integrate DIA's oracle service with your XRPL-based application to fetch up-to-date asset price information, whether you're working on DeFi, tokenized assets, or next-gen payments.
labels:
  - Development
markdown:
  editPage:
    hide: true
---

# Integrating DIA Oracles on the XRP Ledger

As institutional DeFi continues to grow on the XRP Ledger (XRPL), access to reliable, decentralized price feeds is becoming increasingly essential. To support this, DIA, a leading open-source oracle platform, is now live on the XRPL, offering robust, customizable oracles across thousands of assets. This blog post walks you through integrating DIA’s oracle service with your XRPL-based application, whether you’re working on DeFi, tokenized assets, or next-gen payments.

<!-- BREAK -->

## 1. Your Oracle Details

### 1.1 Oracle Services

The providers to fetch data from:

| Network      | Provider                      | Oracle Document ID |
| :----------- | :---------------------------- | :----------------- |
| XRPL Mainnet | diadata (hex. 64696164617461) | 42                 |
| XRPL Testnet | diadata (hex: 64696164617461) | 1                  |

Each oracle document contains real-time pricing data for key assets—including XRP, RLUSD, and more — making it simple for developers to retrieve trusted market prices directly from the ledger.

### 1.2 Oracle Accounts

DIA uses the following accounts to publish oracle price data to the XRPL:

| Network      | Account                                                                                                    |
| :----------- | :--------------------------------------------------------------------------------------------------------- |
| XRPL Mainnet | [rP24Lp7bcUHvEW7T7c8xkxtQKKd9fZyra7](https://livenet.xrpl.org/accounts/rP24Lp7bcUHvEW7T7c8xkxtQKKd9fZyra7) |
| XRPL Testnet | [r3U1mL5u2SCPr4mApqYyF96nvwvKoGf7aH](https://testnet.xrpl.org/accounts/r3U1mL5u2SCPr4mApqYyF96nvwvKoGf7aH) |

You can monitor these wallets on-chain for transparency and operational assurance.

### 1.3 Oracle Configuration

Settings that dictate how the oracle computes and updates data.

| Setting                           | Details                                                                                                                                                |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pricing Methodology               | [VWAPIR](https://www.diadata.org/docs/guides/methodologies/pricing-methodologies/vwapir-volume-weighted-average-price-with-interquartile-range-filter) |
| Deviation (%) & Refresh Frequency | 1% and 120 seconds                                                                                                                                     |
| Heartbeat                         | 24h                                                                                                                                                    |

This configuration ensures that price updates are both reactive and consistent, maintaining high accuracy without overwhelming the network.

### 1.4 Asset Feeds

These asset feeds serve as foundational infrastructure for a wide range of XRPL-based dApps—from AMMs to lending platforms—ensuring composability across the ecosystem.

| Asset Ticker | Asset Ticker (Hex)                         | Asset Markets Overview                                                                                       |
| :----------- | :----------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| BTC          | 4254430000000000000000000000000000000000   | [BTC markets](https://www.diadata.org/app/price/asset/Bitcoin/0x0000000000000000000000000000000000000000/)   |
| ETH          | 4554480000000000000000000000000000000000   | [ETH markets](https://www.diadata.org/app/price/asset/Ethereum/0x0000000000000000000000000000000000000000/)  |
| XRP          | 5852500000000000000000000000000000000000   | [XRP markets](https://www.diadata.org/app/price/asset/XRPL/0x0000000000000000000000000000000000000000/)      |
| RLUSD        | 524C555344000000000000000000000000000000   | [RLUSD markets](https://www.diadata.org/app/price/asset/XRPL/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De/)            |
| USDC         | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | [USDC markets](https://www.diadata.org/app/price/asset/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/) |
| USDT         | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | [USDT markets](https://www.diadata.org/app/price/asset/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7/) |

### 1.5 Request a Custom Oracle

DIA offers highly customizable oracles that are individually tailored to each dApp's needs. Each oracle can be customized in the following ways:

- Data sources (specific exchanges/DEXs or aggregated feeds)
- Pricing methodologies (VWAPIR, MAIR, TWAP, custom models)
- Update triggers (deviation thresholds or time-based)
- Asset coverage (any of 20,000+ supported assets)

These custom oracle feeds are designed to support everything from DeFi and RWAs to advanced financial applications, and are available for free for dApps to set up and use.

You can reach out to the [DIA team](https://www.diadata.org/docs/guides/how-to-guides/request-a-custom-oracle) to request and deploy oracles that match their specific protocol requirements.

## How the Oracle Works

The `oracleUpdater` in the `DIAOracleV2` contract is the gas wallet responsible for pushing the price updates on-chain.

![Screenshot: How Dia Oracle Works](/blog/img/dev-reflections-how-dia-oracle-works.png)

Check out the full audit report [here](https://content.gitbook.com/content/TURK2sDMSvoX6oxbS6WA/blobs/vJuu8yMWLXokC7m3aqKg/02_Smart%20Contract%20Audit_DIA_Oracle_v2.pdf) for the DIAOracleV2 contract.

## How to Access Data

The DIA oracle object can be retrieved with the [ledger_entry API](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-oracle) call by specifying the `account` and `oracle_document_id`. You can access the mainnet and testnet accounts [here](https://docs.google.com/document/d/1GGLxcKSYlCP-yxrcP5Gzd8nsm-WzcjNvwWMvvJjXwbw/edit?tab=t.0#heading=h.e29ryp9qtwct).

This is the request JSON for mainnet:

```json
{
  "id": "example_get_oracle",
  "command": "ledger_entry",
  "oracle": {
    "account": "rP24Lp7bcUHvEW7T7c8xkxtQKKd9fZyra7",
    "oracle_document_id": 42
  },
  "ledger_index": "validated"
}
```

It will return the current price of all the assets in hexadecimal format, which can then be converted to decimal and scaled to obtain the actual price with 8 decimal places.

This method leverages XRPL’s native ledger-querying capabilities, meaning you don’t need external indexing services to retrieve oracle data—just the standard API.

## Glossary

Understanding the following terms is crucial when configuring DIA oracles for your application logic, especially for price-sensitive dApps like derivatives, stablecoins, or automated market makers (AMMs).

| Term              | Definition                                                                     |
| :---------------- | :----------------------------------------------------------------------------- |
| Deviation         | The percentage threshold that triggers a price update when exceeded            |
| Refresh frequency | A time interval for checking and updating prices if certain conditions are met |
| Trade window      | A time interval used to aggregate trades of an asset for price calculation     |
| Heartbeat         | A forced price update at a fixed interval                                      |

## Support

You can always reach out to the dedicated DIA support channel on Slack, [Discord](https://discord.gg/ZvGjVY5uvs), or [Telegram](https://t.me/diadata_org). You can also follow XRPL-specific updates and best practices via XRPL Dev To or join XRPL developer channels for peer guidance and integration showcases. [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH)
