# Trust Lines and Issuing

Frequently, [issued currencies](issued-currencies.html) in the XRP Ledger, represent value held by _gateways_ in the world outside the XRP Ledger. The address that issues those funds in the XRP Ledger is expected to pay the balance back, outside of the XRP Ledger, when users redeem their XRP Ledger balances by returning them to the issuer.

Since a computer program cannot force a someone to keep a promise in the outside world, trust lines represent a way of configuring how much you trust an issuer to hold on your behalf. Since a large, reputable financial institution is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuer "owe" you in the XRP Ledger. If the issuer defaults or goes out of business, you can lose up to that much money because the balances you hold in the XRP Ledger can no longer be exchanged for equivalent balances elsewhere. (You can still keep or trade the issued currency in the XRP Ledger, but there is probably no longer any reason to consider that issued currency to be worth anything.)

There are two cases where you can hold a balance on a trust line that is _greater_ than your limit: when you acquire more of that currency through [trading](decentralized-exchange.html), or when you decrease the limit on your trust line.

Since a trust line occupies space in the ledger, [a trust line increases the XRP your account must hold in reserve](reserves.html). This applies to the account extending trust, not to the account receiving it.

Each trust line is specific to a given [currency code][]. Two accounts can have any number of trust lines between them for different currency codes, but only one trust line in either direction for any given currency code.

## Trust Line Settings

Trust lines are represented in the ledger's state data as [RippleState objects](ripplestate.html). A single RippleState object represents the potential for a trust line in either direction or both: it has a limit and other settings for each side, but a single shared net balance between the two sides.

A trust line with settings in the default state is equivalent to no trust line.

The default state of all trust line flags is off, except for the [NoRipple flag](rippling.html), whose default state depends on the DefaultRipple flag.

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
