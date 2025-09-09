---
seo:
    description: Learn how a payments provider business can enable regulation-compliant 24/7 cross-currency payments using a permissioned on-chain decentralized exchange (DEX).
---
# Enable Regulation Compliant Cross-Currency Payments Using a Permissioned DEX

Payments provider businesses today can leverage cryptocurrency to enable low-cost global settlement in a variety of assets. But currency conversion (FX) is still a challenge: it may use off-chain, centralized exchanges (CEX); or it may use an on-chain, open decentralized exchange (DEX). Both of these models come with significant friction, which can be alleviated by instead using an on-chain, permissioned decentralized exchange (pDEX).

This page explains how a payments provider can use the features of the XRP Ledger to enable fast, efficient cross-currency payments by creating and managing a permissioned DEX.


## Background: The challenges with other modes of currency exchange

Cross-border payments often involve two to three currencies, which need to be exchanged as part of the payment process: 

- The sending currency provided by the sender.
- The receiving currency paid out to the beneficiary.
- Possibly a bridge currency, such as a cryptocurrency that is used to connect two off-chain, centralized exchanges located in different countries. 

Whether or not you use a bridge currency, at least one currency exchange must happen to facilitate the payment, and there are different challenges depending on where that exchange takes place.

### Open DEX: Compliance challenges

Open DEX models are a non-starter for many businesses mindful about complying with global financial regulations, because the open and pseudonymous nature of the exchange makes it almost impossible to comply with Know-Your-Customer (KYC), Anti Money Laundering (AML), and global sanctions regulations. Because an open DEX is available for anyone to use, there are no guarantees that a trade won't be matched with trades placed by strangers or sanctioned entities.

### Centralized Exchanges: Operational challenges

Off-chain, centralized exchanges (CEX) are more commonly used by payments providers, but this business practice comes with significant downsides, including:

- **Compliance Redundancy:** Users may need to go through KYC processes multiple times: once with the payment provider and once with the CEX.
- **Poor Reliability:** Centralized exchanges tend to have significantly more outages than on-chain decentralized exchanges. These incidents are disruptive, and payments that failed during an outage can take a long time to correct. Additionally, if the payment involves multiple centralized exchanges, that multiplies the chances that at least one of them will have an ongoing incident at any given time.
- **High Costs:** Centralized exchanges typically charge a trading fee, plus there may be costs for onboarding and KYC processes, in addition to the spread in the currency exchange rates.
- **Loss of Control:** Relying on a centralized exchange, an external entity from the perspective of the payment provider, limits how much oversight and control the provider can exert over the overall payment lifecycle.


## Solution: Permissioned DEX on the XRP Ledger

By setting up a permissioned DEX (pDEX) on the XRP Ledger, a payments provider can run its own regulated marketplace for currency conversion, getting the benefits of a decentralized exchange without the compliance risk:

- **Single KYC Touchpoint:** All parties can be verified and vetted using the same credential issuer, without having to repeatedly go through KYC steps with each business.
- **Automatic Compliance:** The payments provider only has to select an appropriate set of credentials, and the XRPL's Permissioned Domains feature automatically restricts access to the pDEX so that only those who hold the credentials can participate.
- **End-to-End Control:** The payments provider has full control over the payments lifecycle and isn't dependent on CEX processing times, opaque matching algorithms, or similar limitations.
- **Operational Resilience:** The XRP Ledger's battle-tested, highly stable blockchain and decentralized exchange technology powers the software side, so the payment provider can count on the DEX being operational, with no exposure to risk of outages at any CEX, and extremely high reliability.
- **Lower Cost Base:** Using a pDEX eliminates trading fees and reduces the onboarding overhead.


## How to Set Up a Permissioned DEX
