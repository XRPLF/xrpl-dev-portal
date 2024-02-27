---
html: tokens.html
parent: concepts.html
seo:
    description: Anyone can make tokens representing digital value on the XRP Ledger.
labels:
  - Tokens
---
# Tokens

All assets other than XRP can be represented in the XRP Ledger as _tokens_.

Standard tokens are fungible: meaning, all units of that token are interchangeable and indistinguishable. Tokens can be used for [cross-currency payments](../payment-types/cross-currency-payments.md) and can be traded in the [decentralized exchange](decentralized-exchange/index.md).

**Note:** Tokens on the XRP Ledger have also been called "IOUs" (as in [I-owe-you](https://en.wikipedia.org/wiki/IOU)) and "issued currencies" in the past. However, these terms are not preferred because they do not cover the full range of digital assets that XRP Ledger tokens can represent. <!-- STYLE_OVERRIDE: ious -->

Tokens can also be non-fungible. Non-fungible tokens (NFTs) serve to encode ownership of unique physical, non-physical, or purely digital goods, such as works of art or in-game items.

See [Fungible Tokens](fungible-tokens/index.md) and [Non-fungible Tokens](nfts/index.md).

## Stablecoins

Stablecoins are a common model for tokens in the XRP Ledger. The issuer holds assets of  value outside of the XRP Ledger, and issues tokens representing the equivalent value on the ledger.

See [Stablecoins](fungible-tokens/stablecoins/index.md).

## Community Credit

Another way you can use the XRP Ledger is for "community credit", a system where individuals who know each other can use the XRP Ledger to track who owes whom how much money. One feature of the XRP Ledger is that it can automatically and atomically use these debts to settle payments through [rippling](fungible-tokens/rippling.md).

For more on this type of usage, see [paths](fungible-tokens/paths.md). <!--{# TODO: It would be nice to be able to link to a page with more illustrative examples of community credit. #}-->

## Other Tokens

There are other use cases for tokens issued in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then "throwing away the key" to the issuer.

**Warning:** ICOs might be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA. <!-- SPELLING_IGNORE: ico, icos -->

Be sure to research the relevant regulations before engaging in any financial service business.

## Token Properties

Tokens in the XRP Ledger are fundamentally different than XRP. Tokens always exist in _trust lines_, and all transfers of tokens move along trust lines. You cannot cause someone else's account to hold more of a token than the _limit_ configured on their trust line. (You _can_ cause your own trust line to go over the limit, for example by buying more of it in the decentralized exchange or by decreasing the limit after you already have a positive balance.)

Anyone can issue tokens by sending a [Payment transaction][] if the necessary trust lines are in place. You can "burn" tokens by sending them back to the issuer. In some cases, cross-currency payments or trades can also create more tokens according to an issuer's settings.

Issuers have options with tokens that are not available with XRP. Issuers can charge a [transfer fee](transfer-fees.md) that is automatically deducted when users transfer their tokens. Issuers can also define a [tick size](decentralized-exchange/ticksize.md) for exchanges rates involving their tokens. Both issuers and regular accounts can [freeze](fungible-tokens/freezes.md) trust lines, which limits how the tokens in those trust lines can be used.

Tokens use decimal (base-10) math with 15 digits of precision and an exponent that allows them to express very large values (up to 9999999999999999 × 10<sup>80</sup>) and very small values (down to 1.0 × 10<sup>-81</sup>).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
