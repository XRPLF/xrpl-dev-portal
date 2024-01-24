---
html: nft-storage.html
parent: non-fungible-tokens.html
seo:
    description: Storage options for the payload of your NFT.
labels:
  - Non-fungible Tokens, NFTs
---
# NFT Payload Storage

NFTs are created on the blockchain. But the payload of the NFT, including media, metadata, and attributes can be stored in a variety of ways, including on the XRP Ledger; decentralized, off the XRP Ledger; and centralized, off the XRP Ledger.

## On the XRP Ledger

If your data is smaller than 256 bytes, you can consider using a `data://` URI and embedding it directly in the URI field. This has the advantage of storing the data in a reliable, persistent, and responsive database.

## Decentralized, off the XRP Ledger

You can use any of the existing decentralized storage solutions for your NFT metadata.

IPFS and Arweave offer solutions for decentralization. However, fetching the metadata efficiently can be a problem. Querying IPFS or Arweave directly to fetch metadata is not fast enough for modern websites that require immediate responses from users that are scrolling through multiple pages of NFTs that include high-quality media.

See the blog post [NFT Payload Storage Options](https://dev.to/ripplexdev/nft-payload-storage-options-569i) for some examples of cloud storage solutions.

## Centralized, off the XRP Ledger

You can use the URI field to point to a webserver you maintain from which the payload is served.

As an alternative, and to save space on the ledger, you can set the `Domain` field of the issuer using `AccountSet` and treat the NFT ID of the token as a path on that domain. For example, if the NFT has an ID of `123ABC` and the domain on the issuer is `example.com`, you could serve the payload from `example.com/tokens/123ABC`.
