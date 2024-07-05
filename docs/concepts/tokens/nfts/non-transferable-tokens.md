---
seo:
    description: Create NFTs that can't be traded among users.
labels:
  - Non-fungible Tokens, NFTs
---
# Non-Transferable Tokens

The XRP Ledger supports non-transferable tokens (NTTs), sometimes called soulbound tokens, as a specific class of [non-fungible tokens](./index.md). Non-transferable tokens may be used for certifications and identity tokens, achievements in games, or other cases where the purpose of the token is limited to one person specifically.

Any NFT in the XRP Ledger that has the **Transferable** flag disabled is a non-transferable token. This flag is set when the NFT is minted using the `tfTransferable` flag of the [NFTokenMint transaction][]. After the NFT is created, the transferable status is recorded as the `lsfTransferable` flag of the [NFToken object](/docs/references/protocol/data-types/nftoken/).

Non-transferable tokens can still be transferred _to_ or _from_ the issuer of the token directly, but users cannot transfer the token among themselves.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
