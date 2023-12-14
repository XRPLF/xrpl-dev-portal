---
html: nft-apis.html
parent: non-fungible-tokens.html
blurb: Specialized APIs let you access useful NFT metadata.
labels:
 - Non-fungible Tokens, NFTs
---
# NFT APIs

This page lists the transactions and requests associated with NFTs as a handy reference.

## NFT Ledger Entries

- [NFToken](../../../references/protocol/data-types/nftoken.md) data type - The NFT object stored on the ledger.
- Ledger Entries
    - [NFTokenOffer entry](../../../references/protocol/ledger-data/ledger-entry-types/nftokenoffer.md) - An offer to buy or sell an NFT.
    - [NFTokenPage entry](../../../references/protocol/ledger-data/ledger-entry-types/nftokenpage.md) - An NFT page holds a maximum of 32 NFTs. In practice, each NFT page typically holds 16-24 NFTs.

## NFT Transactions

- [NFTokenMint](../../../references/protocol/transactions/types/nftokenmint.md) - Create an NFT.

- [NFTokenCreateOffer](../../../references/protocol/transactions/types/nftokencreateoffer.md) - Create an offer to buy or sell an NFT.

- [NFTokenCancelOffer](../../../references/protocol/transactions/types/nftokencanceloffer.md) - Cancel an offer to buy or sell an NFT.

- [NFTokenAcceptOffer](../../../references/protocol/transactions/types/nftokenacceptoffer.md) - Accept an offer to buy or sell an NFT.

- [NFTokenBurn](../../../references/protocol/transactions/types/nftokenburn.md) - Permanently destroy an NFT.

## NFT requests

- [account_nfts method](../../../references/http-websocket-apis/public-api-methods/account-methods/account_nfts.md) - Get a list of non-fungible tokens owned by an account.
- [nft_buy_offers method](../../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/nft_buy_offers.md) - Get a list of buy offers for a specified NFToken object.
- [nft_sell_offers method](../../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/nft_sell_offers.md) - Get a list of sell offers for a specified NFToken object.
- [subscribe method](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md) - Listen for updates about a particular subject. For example, a marketplace can publish real-time updates on the status of NFTs listed on their platform.
- [unsubscribe method](../../../references/http-websocket-apis/public-api-methods/subscription-methods/unsubscribe.md) - Stop listening for updates about an NFT.

## Clio

[Clio servers](../../networks-and-servers/the-clio-server.md) also provide the following APIs related to NFTs:

- [nft_info](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_info.md) - Get current status information about the specified NFT.
- [nft_history](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_history.md) - Get past transaction metadata for the specified NFT.

You can access a public Clio server by sending a request to its URL and Clio port (typically 51233). Public Clio API servers come with no SLAs nor any responsibility to be fixed on priority. If your business use case requires continual monitoring and information requests, consider setting up your own Clio server instance. See [install-clio-on-ubuntu](../../../infrastructure/installation/install-clio-on-ubuntu.md).
