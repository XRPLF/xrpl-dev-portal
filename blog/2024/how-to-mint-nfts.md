---
category: 2024
date: 2024-03-08
seo:
    title: How to Mint an NFT on XRPL
    description: Learn the basics of minting an NFT on XRP Ledger and how you can get started quickly and easily with this step-by-step guide. Get started today!
labels:
    - Development
theme:
    markdown:
        editPage:
            hide: true
---
# How to Mint an NFT on the XRP Ledger: A Step-by-Step Guide

The first in a broader series dedicated to making your XRP Ledger building journey an altogether smoother experience is here! In this piece we cover how you can begin to shape your very own NFT collection on the XRP Ledger today. 

Navigating the exciting realm of [Non-fungible Tokens (NFTs)](https://xrpl.org/docs/concepts/tokens/nfts/) on the XRP Ledger can seem daunting at first. However, with the right tools and a bit of JavaScript or Python, minting, managing, and burning NFTs becomes a straightforward process. This blog demystifies the process, providing a clear guide on how to create, view, and destroy NFTs on this innovative platform.

<!-- BREAK -->


## How Much Does it Cost to Mint an NFT?

Minting, holding, and offering NFTs for sale requires XRP held in reserve. The reserve charges can add up quickly, so understanding the reserve requirements can help you choose the best approach for your business case.

For each object you own on the XRP Ledger, there is an owner reserve, currently 2 XRP. This is to discourage users from spamming the ledger with unnecessary data, and to encourage them to clean up any data that is no longer necessary. The owner reserve amount is subject to change. See Base Reserve and Owner Reserve. 

For NFTs, the object does not refer to the individual NFTs, but to the NFTokenPage objects owned by the account. NFTokenPage objects can store up to 32 NFTs. 

However, NFTs are not packed into pages to minimize space used. If you have 64 NFTs, it's not necessarily true that you have only 2 NFTokenPage objects. 

The following table provides examples of how much the total owner reserve might be, depending on the number of NFTs owned and the number of pages holding them.

| NFTs Owned | Best Case | Typical Case | Worst Case |
|:-----------|:----------|:-------------|:-----------|
|  32 or fewer| 2 XRP | 2 XRP | 2 XRP |
| 50 | 4 XRP | 6 XRP | 8 XRP |
| 200 | 14 XRP | 18 XRP | 26 XRP |
| 1000 | 64 XRP | 84 XRP | 126 XRP |

## Getting Started

Before diving into NFT minting, ensure you have access to test accounts on the XRP Ledger's Testnet or Devnet. This is crucial for experimenting without risking real assets. You can easily acquire test accounts by downloading the Quickstart Samples archive, available in [JavaScript] (https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/js/) and [Python](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py), and following these steps:

1. Open the `3.mint-nfts.html` file in a browser to initiate.
2. Obtain test accounts:
  - If you already possess Testnet account seeds, input them into the Seeds field and click **Get Accounts from Seeds**.
  - Otherwise, click **Get New Standby Account** and **Get New Operational Account** to generate new accounts.

![Screenshot: Token Test Harness to mint and burn NFTs](/blog/img/devblog-how-to-mint-nfts-token-test-harness.png)

## What does it mean to mint an NFT?

Minting an NFT involves creating a new, unique digital token on the blockchain. To [mint an NFT](https://xrpl.org/docs/concepts/tokens/nfts/) on the XRP Ledger:

1. Set the Flags: For testing, set the Flags field to 8. This makes your NFT transferable to others outside the issuing account. For a non-transferable NFT, you can omit this or set a different value.
2. Input the Token URL: This URL points to your NFT's data or metadata. You can use a sample URI or provide your own.
3. Specify the Transfer Fee: Define a fee between 0-50000, allowing for a royalty of 0.000% to 50.000% on future sales. If the NFT is non-transferable, set this to 0.
4. Click **Mint NFT** to create your token.

## Viewing Your NFTs

To view a list of NFTs associated with your account, simply click **Get NFTs**. This action fetches and displays all NFTs owned by the account in use.

## Burning Your NFT

[Burning an NFT](https://xrpl.org/docs/tutorials/python/modular-tutorials/nfts/mint-and-burn-nfts#mint-and-burn-nfts-using-python) is the process of permanently destroying the token. To burn an NFT:

1. Enter the Token ID of the NFT you wish to destroy.
2. Click **Burn NFT** to remove it permanently from the ledger.


## Behind the Scenes: Code Walkthrough

The code for these operations is part of the Quickstart Samples, which includes [JavaScript files](https://xrpl.org/docs/tutorials/javascript/get-started) for various actions, including minting, viewing, and burning NFTs. These scripts facilitate connecting to the ledger, preparing transactions, and handling the minting or burning processes. A detailed code walkthrough reveals the intricacies of transaction preparation, from setting the transaction type to defining the URI, flags, transfer fee, and token taxon.

## Summary

Minting NFTs on the XRP Ledger is an accessible process, thanks to its robust infrastructure and the availability of straightforward tools and samples. Whether you're an artist looking to tokenize your creations, a collector aiming to diversify your digital assets, or a developer exploring the capabilities of the XRP Ledger, this guide equips you with the knowledge to start minting, managing, and burning NFTs with ease. Remember, while this guide focuses on a test environment, the principles apply to live operations, paving the way for your ventures into the evolving world of NFTs.
