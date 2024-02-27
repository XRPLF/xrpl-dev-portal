---
html: nftoken-auctions.html
parent: non-fungible-tokens.html
seo:
    description: You can assign another account to mint NFTs in your stead.
labels:
 - Non-fungible Tokens, NFTs
---
# Running an NFT Auction

There are several ways to run an auction, each with advantages and disadvantages.

## Run the Auction Off the XRPL, Complete the Purchase on XRPL

This flow is the most straightforward. Note that the `NFTokenOffer` objects can always be canceled by their creator, so it's not possible to implement a binding offer.

1. Store your bids in a private database.
2. You take a cut of the winning bid.
3. Send the buyer/seller the XRPL transaction to complete the purchase.

## Run the Auction in Brokered Mode, with a Reserve

Run the auction in brokered mode, as an auction with a reserve.

![Auction in Brokered Mode with a Reserve](/docs/img/nft-auction1.png "Auction in Brokered Mode with a Reserve")

1. The seller creates the NFT, then sets the auction reserve price using `NFTokenCreateOffer`, specifying the broker account as the destination.
1. The bidders make offers using `NFTokenCreateOffer`, setting the broker account as the destination.
1. The broker selects the winning bid, completes the sale using `NFTokenAcceptOffer`, collecting the broker fee. Then the broker cancels any losing bids using `NFTokenCancelOffer`.

**Pros:**

- The entire auction happens on the XRPL, including your broker fee.
- The seller represents their reserve price on-chain.
- This is _close_ to a binding offer, from the buyside.

**Cons:**

- There must be implicit trust between the seller and the broker that the broker will not take more than some previously agreed-upon rate. If the reserve was 1 XRP and the winning bid was 1000 XRP, there is no on-chain mechanism to prevent the broker from taking 999 XRP as profit, leaving only the reserve profits for the seller.

A major mitigating factor of this downside is that if this behavior were to happen, brokers would lose their entire market share, which sellers should understand.

## Run the Auction in Brokered Mode, without a Reserve.

This is the most complex workflow of the three.

![Auction in Brokered Mode without a Reserve](/docs/img/nft-auction2.png "Auction in Brokered Mode without a Reserve")

1. The seller creates an NFT using `NFTokenMint`.
1. The bidders make offers using `NFTokenCreateOffer`, setting the broker as the destination.
1. The broker selects the winning bid, subtracts the amount to be collected as a fee, then requests the seller sign a sell offer for this amount via `NFTokenCreateOffer`.
1. The seller signs the requested offer, setting the broker as the destination.
1. The broker completes the sale using `NFTokenAcceptOffer`, and receives the broker fee.
1. The broker cancels any remaining bids using `NFTokenCancelOffer`.

**Pros:**

- This flow requires absolutely no trust among participants, making it the option most people expect on the blockchain.
- Sellers know exactly how much the broker takes from them in fees and must agree to it on the chain.

**Cons:**

- After the auction is complete, the sale is contingent on the seller agreeing to the final bid amount and broker fee amount. This means that sellers can back out of an otherwise complete auction or that sellers can delay settlement due to being distracted or not seeing some notification.
- After the auction is complete, a seller can refuse the winning bid, instead selling to someone else.
