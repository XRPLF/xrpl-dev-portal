---
html: nftoken-batch-minting.html
parent: non-fungible-tokens.html
seo:
    description: Minting NFTs in batches.
labels:
 - Non-fungible Tokens, NFTs
---

# Batch Minting

There are two common approaches to minting NFTs in batches: mint on demand and scripted minting.

## Mint On Demand (Lazy Minting)

When using a mint on demand model, you and potential customers make buy or sell offers for initial sales of an NFT off the XRP Ledger. When you are ready to start the initial sale, you mint the token, create a sell offer or accept a buy offer, then complete the transaction.

### Benefits

* There is no reserve requirement for holding unsold NFTs.
* You mint NFTs in real time when you know that it will sell. <!-- STYLE_OVERRIDE: will -->

### Downside

Any market activity before the initial sale of the NFT is not recorded on the XRP Ledger. This might not be an issue for some applications.

## Scripted Minting

Use a program or script to mint many tokens at once. You might find that [Tickets](../../accounts/tickets.md) help you submit transactions in parallel, up to a current limit of 200 transactions in one group.

For a practical example, see the [Batch Mint NFTs Using JavaScript](../../../tutorials/javascript/nfts/batch-mint-nfts.md) tutorial.

### Benefits

* NFTs are minted ahead of time.
* Market activity for the initial sale of the NFT is captured on the ledger.

### Downside

You need to meet the [reserve requirement](../../accounts/reserves.md) for all of the NFTs you mint. As a rule of thumb, this is roughly 1/12th XRP per NFT at the current reserve rate. In the event that you do not have enough XRP in reserve, your mint transactions fail until you get more XRP.
