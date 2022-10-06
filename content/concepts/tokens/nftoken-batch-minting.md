---
html: nftoken-batch-minting.html
parent: non-fungible-tokens.html
blurb: Minting NFToken objects in batches.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---

# Batch minting

There are two common approaches to minting NFToken objects in batches: mint on demand and scripted minting.

## Mint On Demand (Lazy Minting)

When using a mint on demand model, you and potential customers make buy or sell offers for initial sales of a NFToken object off the XRP Ledger. When you are ready to commence the initial sale, you mint the token, create a sell offer or accept a buy offer, then complete the transaction.

### Benefits

* There is no reserve requirement for holding unsold NFToken objects.
* You mint NFToken objects in real time when you know that it will sell.

### Downside

Any market activity prior to the initial sale of the NFToken object is not recorded on the XRP Ledger. This might not be an issue for some applications.

## Scripted Minting

Use a program or script to mint many tokens at once. You might find the XRP Ledger ticket functionality helps you submit transactions in parallel, up to a current limit of 200 transactions in one group.

For a practical example, see the [Batch Mint NFTokens](batch-minting.html) tutorial.

### Benefits

* NFToken objects are minted ahead of time
* Market activity for the initial sale of the NFToken object is captured on the ledger

Downside

You need to retain the appropriate XRP reserve for all of the NFToken objects you mint. As a rule of thumb, this is roughly 1/12th XRP per NFToken object at the current reserve rate. In the event that you do not have sufficient XRP in reserve, your mint transactions fail until you add sufficient XRP to your account.