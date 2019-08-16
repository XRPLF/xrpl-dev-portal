# Rippling

In the XRP Ledger, "rippling" describes a process of atomic net settlement between multiple connected parties who have [trust lines](trust-lines-and-issuing.html) for the same currency. Rippling is an essential part of issued currencies, because it allows users who trust the same issuer to send issued balances to each other with the issuer as a passive intermediary. In a sense, rippling is like a passive, two-way [currency exchange order](offers.html) with no limit and a 1:1 exchange rate for two currencies with the same currency code but different issuers.

Rippling only occurs along the [paths](paths.html) of a payment. [Direct XRP-to-XRP payments](direct-xrp-payments.html) do not involve rippling.

For non-issuing accounts, rippling can be undesirable because it lets other users shift obligations between issuers of the same currency. Thus, the [NoRipple Flag](#the-noripple-flag) disables rippling on incoming trust lines by default, unless the account enables rippling by default by enabling the [DefaultRipple flag](#the-defaultripple-flag).

**Caution:** If you create a trust line to another address, you must explicitly enable the tfSetNoRipple flag to block rippling on your side of that trust line.

## Example of Rippling

"Rippling" occurs when more than one trust line is adjusted to make a payment. For example, if Alice owes Charlie money, and Alice also owes Bob money, then you could represent that in the XRP Ledger with trust lines like so:

![Charlie --($10)-- Alice -- ($20) -- Bob](img/noripple-01.png)

If Bob wants to pay $3 to Charlie, then he could say, "Alice, take $3 of the money you owe me, and pay it to Charlie." Alice transfers some of the debt from Bob to Charlie. In the end, the trust lines work out like so:

![Charlie --($13)-- Alice --($17)-- Bob](img/noripple-02.png)

We call this process, where two addresses pay each other by adjusting the balances of trust lines in between them, "rippling". This is a useful and important feature of the XRP Ledger. Rippling occurs when addresses are linked by trust lines that use the same [currency code][]. The issuer does not need to be the same: in fact, larger chains always involve changing issuers.

## The NoRipple Flag

Non-issuing accounts, especially liquidity providers who may hold balances from different issuers with different fees and policies, usually do not want their balances to ripple.

The "NoRipple" flag is a setting on a trust line. When two trust lines both have NoRipple enabled by the same address, payments from third parties cannot "ripple" through that address on those trust lines. This protects liquidity providers from having balances shift unexpectedly between different issuers of the same currency.

An account can disable NoRipple on a single trust line, which can allow rippling through any pair that includes that trust line. The account can also enable rippling by default by enabling the [DefaultRipple flag](#the-defaultripple-flag).

For example, imagine Emily has money issued by two different financial institutions, like so

![Charlie --($10)-- Institution A --($1)-- Emily --($100)-- Institution B --($2)-- Daniel](img/noripple-03.png)

Now Charlie can pay Daniel by rippling through Emily's address. For example, if Charlie pays Daniel $10:

![Charlie --($0)-- Institution A --($11)-- Emily --($90)-- Institution B --($12)-- Daniel](img/noripple-04.png)

This may surprise Emily, who does not know Charlie or Daniel. Even worse, if Institution A charges her higher fees to withdraw her money than Institution B, this could cost Emily money. The NoRipple flag exists to avoid this scenario. If Emily sets it on both trust lines, then payments cannot ripple through her address using those two trust lines.

For example:

![Charlie --($10)-- Institution A --($1, NoRipple)-- Emily --($100,NoRipple)-- Institution B --($2)-- Daniel](img/noripple-05.png)

Now the above scenario, where Charlie pays Daniel while rippling through Emily's address, is no longer possible.

### Specifics

The NoRipple flag makes certain paths invalid, so that they cannot be used to make payments. A path is considered invalid if and only if it enters **and** exits an address node through trust lines where NoRipple has been enabled for that address.

![Diagram demonstrating that NoRipple has to be set on both trust lines by the same address to do anything](img/noripple-06.png)


## The DefaultRipple Flag

The DefaultRipple flag is an account setting that enables rippling on all incoming trust lines by default. Gateways and other currency issuers MUST enable this flag for their customers to be able to send those currencies to each other.

The DefaultRipple setting of your account does not affect trust lines that you create; only trust lines that others open to you. If you change the DefaultRipple setting of your account, trust lines that were created before the change keep their existing NoRipple settings. You can use a [TrustSet transaction][] to change the NoRipple setting of a trust line to match your address's new default.

For more information, see [DefaultRipple in 'Becoming an XRP Ledger Gateway'](become-an-xrp-ledger-gateway.html#defaultripple).


## Using NoRipple
<!--{# TODO: move these things into their own tutorials #}-->

### Enabling / Disabling NoRipple

The NoRipple flag can only be enabled on a trust line if the address has a positive or zero balance on that trust line. This is so that the feature cannot be abused to default on the obligation the trust line balance represents. (Of course, you can still default by abandoning the address.)

In the [`rippled` APIs](rippled-api.html), you can enable the NoRipple flag by sending a [TrustSet transaction][] with the `tfSetNoRipple` flag. You can disable NoRipple (enable rippling) with the `tfClearNoRipple` flag.

In [RippleAPI](rippleapi-reference.html), you can enable the NoRipple flag by sending a [Trustline transaction](rippleapi-reference.html#preparetrustline) transaction with the `ripplingDisabled` field of the trust line set to `true`.


### Looking Up NoRipple Status

In the case of two accounts that mutually trust each other, the NoRipple flag is tracked separately for each account.

In the [`rippled` APIs](rippled-api.html), you can use the [account_lines method][] to look up the trust lines associated with an address. For each trust line, the `no_ripple` field shows whether the current address has enabled the NoRipple flag on that trust line, and the `no_ripple_peer` field shows whether the counterparty has enabled the NoRipple flag.

In [RippleAPI](rippleapi-reference.html), you can use the [getTrustlines](rippleapi-reference.html#gettrustlines) method to look up the trust lines associated with an address. For each trust line, the `ripplingDisabled` field shows whether the current address has enabled the NoRipple flag on that trust line, and the `counterparty.ripplingDisabled` field shows whether the counterparty has enabled the NoRipple flag.


## See Also

- **Concepts:**
    - [Paths](paths.html)
- **Tutorials:**
    - [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)
    - [RippleState (trust line) Flags](ripplestate.html#ripplestate-flags)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
