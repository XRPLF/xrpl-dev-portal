# Tokens

All assets other than XRP can be represented in the XRP Ledger as **tokens**. Standard tokens are tracked in relationships called [trust lines](trust-lines-and-issuing.html) between accounts. Tokens can represent any type of value, including "stablecoins" backed by assets that exist outside of the ledger, purely digital tokens created specifically on the XRP Ledger, community credit, and more.

**Note:** Tokens on the XRP Ledger have also been called "IOUs" (as in [I-owe-you](https://en.wikipedia.org/wiki/IOU)) and "issued currencies" in the past. However, these terms are not preferred because they do not cover the full range of digital assets that XRP Ledger tokens can represent.

Any account can issue tokens to other recipients who are willing to hold them, but you cannot unilaterally give tokens away to users who do not want them.

Standard tokens are fungible, meaning all units of that token are interchangeable and indistinguishable. Non-fungible tokens are also possible: see [Non-Fungible Tokens](non-fungible.md) for details of the XRP Ledger's native support.

Tokens can used for [cross-currency payments](../transactions/payments/cross-currency-payments.md) and can be traded in the <!-- * -->decentralized exchange.

<!-- * [decentralized exchange](../server/decentralized-exchange.md) -->

The balance on a trust line is negative or positive depending on which side you view it from. The side with the negative balance is called the "issuer" and can control some properties of how those tokens behave. When you send tokens to another account that isn't the issuer, those tokens "ripple" through the issuer and possibly other accounts using the same currency code. This is useful in some cases, but can cause unexpected and undesirable behavior in others. You can use the [No Ripple flag](rippling.md#the-no-ripple-flag) on trust lines to prevent those trust lines from rippling.

## Token Properties

Tokens in the XRP Ledger are <!--*-->fundamentally different than XRP. Tokens always exist _in trust lines_, and all transfers of tokens move along trust lines. You cannot cause someone else's account to hold more of a token than the _limit_ configured on their trust line. (You _can_ cause your own trust line to go over the limit, for example by buying more of it in the <!--  -->decentralized exchange or by decreasing the limit after you already have a positive balance.)

<!-- * [fundamentally different than XRP](currency-formats.md#comparison) -->
<!--  [decentralized exchange](../servers/decentralized-exchange.md) -->

Tokens use decimal (base-10) math with 15 digits of precision and an exponent that allows them to express very large values (up to 9999999999999999 × 10<sup>80</sup>) and very small values (down to 1.0 × 10<sup>-81</sup>).

Anyone can issue tokens by sending a `Payment` transaction if the necessary trust lines are in place. You can "burn" tokens by sending them back to the issuer. In some cases, [cross-currency payments](../transactions/payments/cross-currency-payments.md) or trades can also create more tokens according to an issuer's settings.

Issuers can charge a [transfer fee](transfer-fees.md) that is automatically deducted when users transfer their tokens. Issuers can also define a <!-- * -->tick size for exchanges rates involving their tokens. Both issuers and regular accounts can [freeze](freezing-tokens.md) trust lines, which limits how the tokens in those trust lines can be used. (None of these things applies to XRP.)

<!-- *  [tick size](ticksize.md) -->

<!-- 
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
-->