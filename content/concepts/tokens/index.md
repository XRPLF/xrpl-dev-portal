---
html: tk-index.html
parent: concepts.html
blurb: Anyone can make tokens representing digital value on the XRP Ledger.
labels:
  - Tokens
---
# Tokens

All assets other than XRP can be represented in the XRP Ledger as _tokens_. 

Tokens are, primarily, fungible.

> Fun·gi·ble /´fənjəbəl/ (adj) <!-- SPELLING_IGNORE: fənjəbəl -->
>
> 1. able to replace or be replaced by another identical item; mutually interchangeable. <!-- STYLE_OVERRIDE: identical -->

A good example of a fungible item might be a postage stamp. If you're standing around in 1919 and need to send a letter by airmail, you would buy a 24-cent stamp and affix it to your envelope. If you lost that stamp, you could use a different 24-cent stamp or use 2 10-cent stamps and 2 2-cent stamps. Very fungible.

![Jenny Stamps](img/nft-concepts1.png "Jenny Stamps")

But since you are standing around in 1919, you might be offered 24-cent airmail stamps where the aeroplane on the stamp is accidentally printed upside down. These are the world famous “Inverted Jenny” stamps. Only 100 were circulated on a single sheet of stamps, making them extremely rare and sought after. The current value of each mint condition stamp is appraised at over 1.5 million US dollars.

![Inverted Jenny Stamps](img/nft-concepts2.png "Inverted Jenny Stamps")

Those stamps cannot be replaced by an ordinary 24-cent stamp. They have become _non-fungible_.

Standard tokens are fungible: meaning, all units of that token are interchangeable and indistinguishable. Non-fungible tokens are also possible: see [Non-Fungible Tokens](non-fungible-tokens.html) for details of the XRP Ledger's native support.

Tokens can be used for [cross-currency payments](cross-currency-payments.html) and can be traded in the [decentralized exchange](decentralized-exchange.html).

**Note:** Tokens on the XRP Ledger have also been called "IOUs" (as in [I-owe-you](https://en.wikipedia.org/wiki/IOU)) and "issued currencies" in the past. However, these terms are not preferred because they do not cover the full range of digital assets that XRP Ledger tokens can represent. <!-- STYLE_OVERRIDE: ious -->

## Trust Lines

Standard tokens are tracked in relationships called _trust lines_. Any account can issue tokens to other accounts that are willing to hold them, but an account cannot unilaterally give tokens away to accounts that don't want them. Tokens can represent any type of value, including "stablecoins" backed by assets that exist outside of the ledger, purely digital tokens created specifically on the XRP Ledger, community credit, and more.

See [Trust Lines and Issuing](trust-lines-and-issuing.html).

## Stablecoins

Stablecoins are a common model for tokens in the XRP Ledger. The issuer holds assets of  value outside of the XRP Ledger, and issues tokens representing the equivalent value on the ledger.

See [Stablecoins](sc-index.html).

## Community Credit

Another way you can use the XRP Ledger is for "community credit", a system where individuals who know each other can use the XRP Ledger to track who owes whom how much money. One feature of the XRP Ledger is that it can automatically and atomically use these debts to settle payments through [rippling](rippling.html).

For more on this type of usage, see [paths](paths.html). <!--{# TODO: It would be nice to be able to link to a page with more illustrative examples of community credit. #}-->

## Other Tokens

There are other use cases for tokens issued in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then "throwing away the key" to the issuer.

**Warning:** ICOs might be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA. <!-- SPELLING_IGNORE: ico, icos -->

Be sure to research the relevant regulations before engaging in any financial service business.

## Token Properties

Tokens in the XRP Ledger are [fundamentally different than XRP](currency-formats.html#comparison). Tokens always exist _in trust lines_, and all transfers of tokens move along trust lines. You cannot cause someone else's account to hold more of a token than the _limit_ configured on their trust line. (You _can_ cause your own trust line to go over the limit, for example by buying more of it in the [decentralized exchange](decentralized-exchange.html) or by decreasing the limit after you already have a positive balance.)

Anyone can issue tokens by sending a [Payment transaction][] if the necessary trust lines are in place. You can "burn" tokens by sending them back to the issuer. In some cases, [cross-currency payments](cross-currency-payments.html) or trades can also create more tokens according to an issuer's settings.

Issuers can charge a [transfer fee](transfer-fees.html) that is automatically deducted when users transfer their tokens. Issuers can also define a [tick size](ticksize.html) for exchanges rates involving their tokens. Both issuers and regular accounts can [freeze](freezes.html) trust lines, which limits how the tokens in those trust lines can be used. (None of these things applies to XRP.)

Tokens use decimal (base-10) math with 15 digits of precision and an exponent that allows them to express very large values (up to 9999999999999999 × 10<sup>80</sup>) and very small values (down to 1.0 × 10<sup>-81</sup>).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
