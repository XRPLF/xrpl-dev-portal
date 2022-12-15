---
parent: concepts.html
blurb: Anyone can make tokens representing digital value on the XRP Ledger.
labels:
  - Tokens
---
# Tokens

All assets other than XRP can be represented in the XRP Ledger as **tokens**. Standard tokens are tracked in relationships called [trust lines](trust-lines-and-issuing.html) between accounts. Any account can issue tokens to other recipients who are willing to hold them, but you cannot unilaterally give tokens away to users who don't want them. Tokens can represent any type of value, including "stablecoins" backed by assets that exist outside of the ledger, purely digital tokens created specifically on the XRP Ledger, community credit, and more.

**Note:** Tokens on the XRP Ledger have also been called "IOUs" (as in [I-owe-you](https://en.wikipedia.org/wiki/IOU)) and "issued currencies" in the past. However, these terms are not preferred because they do not cover the full range of digital assets that XRP Ledger tokens can represent. <!-- STYLE_OVERRIDE: ious -->

Standard tokens are fungible: meaning, all units of that token are interchangeable and indistinguishable. Non-fungible tokens are also possible: see [Non-Fungible Tokens](non-fungible-tokens.html) for details of the XRP Ledger's native support.

Tokens can used for [cross-currency payments](cross-currency-payments.html) and can be traded in the [decentralized exchange](decentralized-exchange.html).

The balance on a trust line is negative or positive depending on which side you view it from. The side with the negative balance is called the "issuer" and can control some properties of how those tokens behave. When you send tokens to another account that isn't the issuer, those tokens "ripple" through the issuer and possibly other accounts using the same currency code. This is useful in some cases, but can cause unexpected and undesirable behavior in others. You can use the [No Ripple flag](rippling.html) on trust lines to prevent those trust lines from rippling.


## Stablecoins

A common model for tokens in the XRP Ledger is that an issuer holds assets of equivalent value outside of the XRP Ledger, and issues tokens representing that value on the ledger. This type of issuer is sometimes called a _gateway_ because currency can move into and out of the XRP Ledger through their service. If the assets that back a token use the same amounts and denomination as the tokens in the ledger, that token can be considered a "stablecoin" because—in theory—the exchange rate between that token and its off-ledger representation should be stable at 1:1.

A stablecoin issuer should offer _deposits_ and _withdrawals_ to exchange the tokens for the actual currency or asset in the world outside the XRP Ledger.

In practice, the XRP Ledger is a computer system that cannot enforce any rules outside of itself, so stablecoins on the XRP Ledger depend on their issuer's integrity. If you can't count on the stablecoin's issuer to redeem your tokens for the real thing on demand, then you shouldn't expect the stablecoin to hold its value. As a user, you should be mindful of who's issuing the tokens: are they reliable, lawful, and solvent? If not, it's probably best not to hold those tokens.

For more information on how to run a gateway, see the [Becoming an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html).


## Community Credit

Another way you can use the XRP Ledger is for "community credit", a system where individuals who know each other can use the XRP Ledger to track who owes who else how much money. A powerful feature of the XRP Ledger is that it can automatically and atomically use these debts to settle payments through [rippling](rippling.html).

For example, if Asheesh owes Marcus $20, and Marcus owes Bharath $50, Bharath can "pay" Asheesh $20 by canceling that much of Marcus's debt to him in exchange for canceling Asheesh's debt to Marcus. The reverse is also possible: Asheesh can pay Bharath through Marcus by increasing their respective debts. The XRP Ledger can settle complex chains of exchanges like this in a single transaction without the accounts in the middle needing to do anything manually.

For more on this type of usage, see [paths](paths.html). <!--{# TODO: It would be nice to be able to link to a page with more illustrative examples of community credit. #}-->


## Other Tokens

There are other use cases for tokens issued in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then "throwing away the key" to the issuer.

**Warning:** ICOs may be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA. <!-- SPELLING_IGNORE: ico, icos -->

Be sure to research the relevant regulations before engaging in any financial service business.


## Token Properties

Tokens in the XRP Ledger are [fundamentally different than XRP](currency-formats.html#comparison). Tokens always exist _in trust lines_, and all transfers of tokens move along trust lines. You cannot cause someone else's account to hold more of a token than the _limit_ configured on their trust line. (You _can_ cause your own trust line to go over the limit, for example by buying more of it in the [decentralized exchange](decentralized-exchange.html) or by decreasing the limit after you already have a positive balance.)

Tokens use decimal (base-10) math with 15 digits of precision and an exponent that allows them to express very large values (up to 9999999999999999 × 10<sup>80</sup>) and very small values (down to 1.0 × 10<sup>-81</sup>).

Anyone can issue tokens by sending a [Payment transaction][] if the necessary trust lines are in place. You can "burn" tokens by sending them back to the issuer. In some cases, [cross-currency payments](cross-currency-payments.html) or trades can also create more tokens according to an issuer's settings.

Issuers can charge a [transfer fee](transfer-fees.html) that is automatically deducted when users transfer their tokens. Issuers can also define a [tick size](ticksize.html) for exchanges rates involving their tokens. Both issuers and regular accounts can [freeze](freezes.html) trust lines, which limits how the tokens in those trust lines can be used. (None of these things applies to XRP.)

For a tutorial of the technical steps involved in issuing a token, see [Issue a Fungible Token](issue-a-fungible-token.html).


## See Also

- **Concepts:**
    - [XRP](xrp.html)
    - [Cross-Currency Payments](cross-currency-payments.html)
    - [Decentralized Exchange](decentralized-exchange.html)
- **Tutorials:**
    - [Issue a Fungible Token](issue-a-fungible-token.html)
    - [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Use Specialized Payment Types](use-specialized-payment-types.html)
- **References:**
    - [Payment transaction][]
    - [TrustSet transaction][]
    - [RippleState object](ripplestate.html)
    - [account_lines method][]
    - [account_currencies method][]
    - [gateway_balances method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
