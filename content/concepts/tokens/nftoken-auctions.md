---
html: nftoken-auctions.html
parent: non-fungible-tokens.html
blurb: You can assign another account to mint NFTs in your stead.
labels:
 - Non-fungible Tokens, NFTs
---

# Running an NFT Auction

There are several ways to run an auction, each with advantages and disadvantages.

## Run the Auction Off the XRPL, Complete the Purchase on XRPL

This flow is listed first as it is the most straightforward. You store your bids in a private database. You take a cut of the winning bid prior to sending the Buyer/Seller the XRPL transaction that completes the purchase. Note that because NFTokenOffer objects can always be canceled by their creator, it is not currently possible to implement a binding offer.

## Run the Auction in Brokered Mode, with a Reserve

Run the auction in brokered mode, as an auction with a reserve.

![Auction in Brokered Mode with a Reserve](img/nft-auction1.png "Auction in Brokered Mode with a Reserve")

1. The Seller creates the NFT, then sets the auction reserve price using `NFTokenCreateOffer`, specifying the broker account as the destination.
1. Buyers make bids using `NFTokenCreateOffer`, setting the broker account as the destination.
1. The Broker selects the winning bid, completes the sale using `NFTokenAcceptOffer`, collecting the broker fee. Then the Broker cancels any losing bids using `NFTokenCancelOffer`.

**Pros:**

- The entire auction happens on the XRPL, including your broker fee.
- The seller represents their reserve price on-chain.
- This is _close_ to a binding offer, from the buyside.

**Cons:**

- There must be implicit trust between the seller and the marketplace that the marketplace will not take more than some previously-agreed-upon rate. If the reserve was 1 XRP and the winning bid was 1000 XRP, there is no on-chain mechanism to prevent the broker from taking 999 XRP as profit, leaving only the reserve profits for the Seller.

A major mitigating factor of this downside is that if this behavior were to happen, Brokers would lose their entire market share, which sellers should understand.

## Run the Auction in Brokered Mode, without a Reserve. 

This is the most complex workflow of the three.

![Auction in Brokered Mode without a Reserve](img/nft-auction2.png "Auction in Brokered Mode without a Reserve")

1. The seller creates an NFT using NFTokenMint.
1. The bidders make bids using NFTokenCreateOffer, setting the broker as the destination.
1. The broker selects the winning bid, subtracts the amount to be collected as a fee, then requests theseller sign a sell off for this amount via NFTokenCreateOffer.
1. The seller signs the requested offer, setting the broker as the destination.
1. The broker completes the sale using NFTokenAcceptOffer, and receives the broker fee.
1. The broker cancels any remaining bids using NFTokenCancelOffer.

**Pros:**

- This flow requires absolutely no trust among participants, making it option one would most often expect on the blockchain.
- Sellers know exactly how much the marketplace takes from them in fees and must agree to it on the chain.

**Cons:**

- After the auction is complete, the sale is contingent on the seller agreeing to the final bid amount and broker fee amount. This means that sellers can back out of an otherwise complete auction or that sellers can delay settlement due to being distracted or not seeing some notification.
- After the auction is complete, a seller can actively refuse the winning bid, instead selling to someone else.
