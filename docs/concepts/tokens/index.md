---
seo:
    description: Anyone can make tokens representing digital value on the XRP Ledger. Learn about types of tokens and how they are used.
labels:
  - Tokens
---
# Tokens

All assets other than XRP can be represented in the XRP Ledger as _tokens_. Tokens can be fungible, meaning all units of that token are interchangeable and indistinguishable; or non-fungible, meaning each token is unique and indivisible. The XRP has three token standards to choose from, depending on the type of asset you need:

- **Trust line tokens** are the "version 1" fungible token standard. They are fully available in production on the XRP Ledger, and can be used for [cross-currency payments](../payment-types/cross-currency-payments.md) or traded in the [decentralized exchange](decentralized-exchange/index.md). However, they have some edge cases that are important to know about before using them.
    {% admonition type="info" name="Note" %}Trust line tokens on the XRP Ledger have also been called "IOUs" (as in [I-owe-you](https://en.wikipedia.org/wiki/IOU)) and "issued currencies" in the past. However, these terms are not preferred because they do not cover the full range of digital assets that these tokens can represent. <!-- STYLE_OVERRIDE: ious -->{% /admonition %}
- **Multi-Purpose Tokens (MPTs)** are the "version 2" fungible token standard. They are in active development, but do not have full feature parity with trust line tokens. They have been designed for greater efficiency and ease of use based on lessons learned from trust line tokens on the XRP Ledger. {% amendment-disclaimer name="MPTokensV1" /%}
- **[Non-fungible tokens (NFTs)](nfts/index.md)** encode ownership of unique and indivisible tokens, which could represent physical, non-physical, or purely digital goods, such as works of art or in-game items.

Anyone can issue any of these types of tokens on the XRP Ledger, for any use case ranging from informal "IOUs" to institutional-grade, fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more.

## Stablecoins

Stablecoins are a common model for tokens in the XRP Ledger. The issuer holds assets of  value outside of the XRP Ledger, and issues tokens representing the equivalent value on the ledger.

See [Stablecoins](fungible-tokens/stablecoins/index.md).

## Community Credit

Another way you can use the XRP Ledger is for "community credit", a system where individuals who know each other can use the XRP Ledger to track who owes whom how much money. One feature of the XRP Ledger is that it can automatically and atomically use these debts to settle payments through [rippling](fungible-tokens/rippling.md).

For more on this type of usage, see [paths](fungible-tokens/paths.md). <!--{# TODO: It would be nice to be able to link to a page with more illustrative examples of community credit. #}-->

## Other Tokens

There are other use cases for tokens issued in the XRP Ledger, including digital-only tokens that are intended for use in various online systems. It is also common for users to create and trade "meme coins" for novelty and speculative purposes, without any more serious use case in mind. Digital first tokens are sometimes distributed with an "Initial Coin Offering" (ICO) where a fixed amount of tokens are initially created and distributed, with the issuer then "throwing away the key" to their account so that no more tokens can be issued later.

{% admonition type="danger" name="Warning" %}ICOs might be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA. <!-- SPELLING_IGNORE: ico, icos -->{% /admonition %}

Be sure to research the relevant regulations before engaging in any financial service business.

## Differences from XRP

XRP, the native digital asset of the XRP Ledger, has different technical properties than all other tokens in the XRPL, so it is not typically called a "token" in the context of XRPL. Some notable differences:

- All accounts _must_ hold at least a small amount of XRP in reserve, and must burn small amounts of XRP as "gas" to pay for sending transactions.
- XRP is tracked together with accounts on the ledger, and can be sent directly from one account to another with no fees beyond the cost of sending the transaction.
- All accounts can receive XRP from anyone by default, in contrast to tokens which you can only receive after you have sent a transaction indicating your willingness to hold them.
- XRP has fixed precision to 6 decimal points, and is represented as integer _drops_ such that 1 million drops equals 1 XRP.
- All XRP was created along with the ledger itself, and no new XRP can be minted.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
