---
html: trust-lines-and-issuing.html
parent: tokens.html
blurb: Learn about the properties and rationale of trust lines.
labels:
  - Tokens
---
# Trust Lines and Issuing

[Tokens](tokens.html) in the XRP Ledger are often "stablecoins" backed by value held by the issuer in the world outside the XRP Ledger. The is expected to pay the equivalent amount back, outside of the XRP Ledger, when users redeem their stablecoins by returning them to the issuer in the XRP Ledger. In other cases, XRP Ledger tokens represent community credit that can be swapped between people within relatively small limits.

Since a computer program cannot force a someone to keep a promise in the outside world, trust lines represent a way of configuring how much you trust an issuer to hold on your behalf. Since a large, reputable financial institution is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuer "owe" you in the XRP Ledger. If the issuer defaults or goes out of business, you can lose up to that much money because the tokens you hold in the XRP Ledger can no longer be exchanged for equivalent balances elsewhere. (You can still keep or trade those tokens within the XRP Ledger, but there is probably no longer any reason to consider that token to be worth anything.)

There are three cases where you can hold a balance on a trust line that is _greater_ than your limit:

1. When you acquire more of that token through [trading](decentralized-exchange.html).
2. When you decrease the limit on a trust line that has a positive balance.
3. When you acquire more of that token by [cashing a Check](checks.html). (_Requires the [CheckCashMakesTrustLine amendment][] :not_enabled:_)

Since a trust line occupies space in the ledger, [a trust line increases the XRP your account must hold in reserve](reserves.html). This applies to the account extending trust, not to the account receiving it.

Each trust line is specific to a given [currency code][]. Two accounts can have any number of trust lines between them for different currency codes, but only one trust line in either direction for any given currency code.

## Trust Line Settings

Trust lines are represented in the ledger's state data as [RippleState objects](ripplestate.html). A single RippleState object represents the potential for a trust line in either direction or both: it has a limit and settings for each side, but a single shared net balance between the two sides.

A trust line with settings in the default state is equivalent to no trust line.

The default state of all trust line flags is off, except for the [No Ripple flag](rippling.html), whose default state depends on the Default Ripple flag.

## See Also

- **Concepts:**
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Rippling](rippling.html)
- **Tutorials:**
    - [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html)
- **References:**
    - [account_lines method][]
    - [gateway_balances method][]
    - [RippleState (trust line) object](ripplestate.html)
    - [TrustSet transaction][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
