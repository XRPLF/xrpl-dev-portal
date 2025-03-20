---
seo:
    description: Overview of Multi-purpose Token use cases.
labels:
  - Tokenization
  - MPT
  - Multi-purpose Token
---

# Multi-purpose Tokens Overview

Multi-purpose Tokens (MPTs) let you take advantage of ready-to-use tokenization features with a few lines of code. You can create many token experiences from one token program itself. Notable features include:

- MPTs store their metadata directly on the XRPL blockchain.
- A 1024-byte URI field provides a metadata pointer that allows you to use an off-chain source for metadata in addition to the on-chain source. This lets your application access necessary information directly from the chain, prompting higher interoperability for tokens, without losing the ability to attach additional information. 
- MPTs can have a fixed token supply where you set a cap on the maximum number of tokens that can be minted. 
- You can define MPTs as non-transferable, tokens that can only be transferred back to the issuer, but not among tokenholders. Useful for cases such as issuing airline credits or loyalty rewards.
- Issuers can set transfer fees to collect on-chain revenue each time the token is traded among tokenholders. 
- MPTs also have advanced compliance features: 
    - The ability to lock tokens held by a tokenholder to support compliance requirements.
    - The ability to set a global lock for all MPT balances across all tokenholders.
    - The issuer can configure MPTs that can be clawed back from tokenholder wallets, either to revoke them, or to reassign them in the case of lost wallet keys. 
    - An opt-in feature can allow only wallets authorized by the issuer to hold issued tokens.

- [Creating an Asset-based Multi-purpose Token](./creating-an-asset-backed-multi-purpose-token.md)
- [Sending an MPT](./send-an-mpt.md)