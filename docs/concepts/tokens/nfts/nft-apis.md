---
html: nft-apis.html
parent: non-fungible-tokens.html
seo:
    description: Specialized APIs let you access useful NFT metadata.
labels:
 - Non-fungible Tokens, NFTs
---
# NFT APIs

This page lists the transactions and requests associated with NFTs as a handy reference.

## NFT Ledger Entries

- [NFToken][] data type - The NFT object stored on the ledger.
- Ledger Entries
    - [NFTokenOffer entry][] - An offer to buy or sell an NFT.
    - [NFTokenPage entry][] - An NFT page holds a maximum of 32 NFTs. In practice, each NFT page typically holds 16-24 NFTs.

## NFT Transactions

- [NFTokenMint][] - Create an NFT.

- [NFTokenCreateOffer][] - Create an offer to buy or sell an NFT.

- [NFTokenCancelOffer][] - Cancel an offer to buy or sell an NFT.

- [NFTokenAcceptOffer][] - Accept an offer to buy or sell an NFT.

- [NFTokenBurn][] - Permanently destroy an NFT.

## NFT requests

- [account_nfts method][] - Get a list of non-fungible tokens owned by an account.
- [nft_buy_offers method][] - Get a list of buy offers for a specified NFToken object.
- [nft_sell_offers method][] - Get a list of sell offers for a specified NFToken object.
- [subscribe method][] - Listen for updates about a particular subject. For example, a marketplace can publish real-time updates on the status of NFTs listed on their platform.
- [unsubscribe method][] - Stop listening for updates about an NFT.

## Clio

[Clio servers](../../networks-and-servers/the-clio-server.md) also provide the following APIs related to NFTs:

- [nft_info](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_info.md) - Get current status information about the specified NFT.
- [nft_history](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_history.md) - Get past transaction metadata for the specified NFT.

You can access a public Clio server by sending a request to its URL and Clio port (typically 51233). Public Clio API servers come with no SLAs nor any responsibility to be fixed on priority. If your business use case requires continual monitoring and information requests, consider setting up your own Clio server instance. See [install-clio-on-ubuntu](../../../infrastructure/installation/install-clio-on-ubuntu.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
