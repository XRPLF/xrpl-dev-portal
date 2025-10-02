---
seo:
    description: Fungible tokens are a way of representing currency or assets on the blockchain where each unit can be swapped for each other. Learn about the different fungible token standards on the XRP Ledger and which one to use.
---
# Fungible Tokens
Fungible tokens represent some sort of value, often a representation of assets that exist outside of the blockchain. Unlike [NFTs](../nfts/index.md), all units of a fungible token are interchangable for all other units of that token, just like how any US dollar is worth the same as another US dollar (even if one of them is a crisp, newly-printed dollar bill and the other is a number in a payment app on your phone).

There are two standards for fungible tokens in the XRP Ledger, representing an evolution based on how tokens have been used over time:

- **Trust line tokens** are the "version 1" fungible token standard. They are fully available in production on the XRP Ledger, but they have some edge cases that are important to know about before using them.
- **Multi-Purpose Tokens (MPTs)** are the "version 2" fungible token standard. They are in active development, but do not have full feature parity with trust line tokens. They have been designed for greater efficiency and ease of use based on lessons learned from trust line tokens on the XRP Ledger. {% amendment-disclaimer name="MPTokensV1" /%}

Both types of tokens support a compliance-focused features such as [freezes](freezes.md), [clawback](clawing-back-tokens.md), and [allow-listing](authorized-trust-lines.md). The two standards have different strengths, so both are expected to be supported for the foreseeable future.

## Trust Line Tokens

Trust line tokens are fungible tokens that use a bidirectional trust model where users can issue tokens to one another. These tokens are tracked in on-chain data structures called _trust lines_. A trust line is a bidirectional relationship between two accounts for a single currency code.

Trust line tokens have been part of the XRP Ledger since it launched and have grown with amendments to the protocol since then. Trust line tokens can be used for [cross-currency payments](../../payment-types/cross-currency-payments.md) or traded in the [decentralized exchange](../decentralized-exchange/index.md).

Tokens with the same currency code but different issuers can [ripple](rippling.md), a powerful feature for atomically settling and netting payments involving many different parties. However, when your settings are not configured correctly, rippling can lead to unexpected or undesirable movements between tokens from different issuers that use the same currency code. This feature makes trust line tokens the preferred standard for community credit use cases.

Many properties of trust line tokens are defined at the account level, meaning that every token issued by the same account must share the same properties. Also, trust line tokens use a floating point representation which supports very large and very small quantities but can lead to suprising rounding effects.

See [Trust Lines Tokens](trust-line-tokens.md) for more details about the properties and usage of trust line tokens.

## Multi-Purpose Tokens

Multi-Purpose Tokens (MPTs) are fungible tokens that use a unidirectional model where the issuer first defines an _MPT issuance_ with various properties, then issues units of that token to holders. Key features that distinguish MPTs from trust line tokens are:

- **Simpler conceptual model:** With unidirectional issuing, no rippling, and fixed-point precision, there are fewer edge cases to consider when building an integration that issues or uses MPTs.
- **Separate properties per token:** An on-chain MPT issuance definition contains the properties of the token, which can be different from other tokens from the same issuer.
- **Efficient storage format:** MPTs are designed to require less space in the shared ledger to store and send, so the network can more efficiently process large volumes of transactions.

See [Multi-Purpose Tokens](multi-purpose-tokens.md) for more details about the properties and usage of MPTs.

### Availability of MPT Features

Functionality relating to MPTs is being added by a series of amendments to the XRP Ledger protocol to bring them to near-parity with trust line tokens. However, certain features, like rippling, are intentionally not being implemented for MPTs to keep the conceptual model simpler.

Some notable features and their status:

| MPT Feature | Amendment / Standard |
|-------------|----------------------|
| Issuing and direct payments | {% amendment-disclaimer name="MPTokensV1" compact=true /%} |
| Escrow | {% amendment-disclaimer name="TokenEscrow" compact=true /%} (implements escrow for both trust line tokens and MPTs) |
| Mutable token properties | In development: [XLS-94](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0094-dynamic-MPT) |
| Confidentiality | [Proposed XLS](https://github.com/XRPLF/XRPL-Standards/discussions/372) |
| Decentralized exchange (DEX), trading, cross-currency payments, and AMM compatibility | [Proposed XLS](https://github.com/XRPLF/XRPL-Standards/discussions/231) |

## Which Fungible Token Type to Use

If you are creating a new token on the XRP Ledger, it may be confusing that there are two standards to choose from with different properties and strengths. If you aren't sure which one to use, the following summary should help you decide:

- For most new tokens, MPTs are preferred.
- Specific cases where you might prefer trust line tokens include:
    - If you need **compatibility with the DEX**. <!-- Note: revisit this when MPT DEX compatibility is closer to being available. -->
    - Your use case is **community credit**.
    - You need compatibility with legacy software, such as an integration that already works with trust line tokens.
    - You need to be able to represent very large and very small quantities of the same token (20 orders of magnitude apart).

This is not an exhaustive list of strengths and weaknesses of each format. If you aren't sure, you can read more about the specific properties of [trust line tokens](trust-line-tokens.md) and [MPTs](multi-purpose-tokens.md) before making a decision.
