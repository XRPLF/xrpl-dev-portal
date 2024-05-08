---
html: rippling.html
parent: trust-lines-and-issuing.html
seo:
    description: Rippling is automatic multi-party net settlement of token balances.
labels:
  - Tokens
  - Cross-Currency
---
# Rippling

In the XRP Ledger, "rippling" describes a process of atomic net settlement between multiple connected parties who have [trust lines](index.md) for the same token. Rippling is essential, because it enables token holders to transfer funds directly to each other, without any issuer involvement in the debiting and crediting process. In a sense, rippling is like a passive, two-way [exchange order](../decentralized-exchange/offers.md) with no limit and a 1:1 exchange rate for two tokens with the same currency code but different issuers.

Rippling only occurs along the [paths](paths.md) of a payment. [Direct XRP-to-XRP payments](../../payment-types/direct-xrp-payments.md) do not involve rippling.

For non-issuing accounts, rippling can be undesirable because it lets other users shift obligations between tokens with the same currency code but different issuers. The [No Ripple Flag](#the-no-ripple-flag) disables rippling by default when others open trust lines to your account, unless you enable rippling by default using the [Default Ripple flag](#the-default-ripple-flag).

**Caution:** When you create a trust line, you must explicitly enable the `tfSetNoRipple` flag to block rippling on your side of that trust line.

## Example of Rippling

"Rippling" occurs when more than one trust line is adjusted to make a payment. For example, if Alice owes Charlie money, and Alice also owes Bob money, then you could represent that in the XRP Ledger with trust lines like so:

[{% inline-svg file="/docs/img/noripple-01.svg" /%}](/docs/img/noripple-01.svg "Charlie --($10)-- Alice -- ($20) -- Bob")

If Bob wants to pay $3 to Charlie, then he could say, "Alice, take $3 of the money you owe me, and pay it to Charlie." Alice transfers some of the debt from Bob to Charlie. In the end, the trust lines work out like so:

[{% inline-svg file="/docs/img/noripple-02.svg" /%}](/docs/img/noripple-02.svg "Charlie --($13)-- Alice --($17)-- Bob")

We call this process, where two addresses pay each other by adjusting the balances of trust lines in between them, "rippling". This is a useful and important feature of the XRP Ledger. Rippling occurs when addresses are linked by trust lines that use the same currency code. The issuer does not need to be the same: in fact, larger chains always involve changing issuers.

## The No Ripple Flag

Non-issuing accounts, especially liquidity providers who may hold balances from different issuers with different fees and policies, usually do not want their balances to ripple.

The **No Ripple** flag is a setting on a trust line. When two trust lines both have No Ripple enabled by the same address, payments from third parties cannot ripple through that address on those trust lines. This protects liquidity providers from having balances shift unexpectedly between different issuers using the same currency code.

An account can disable No Ripple on a single trust line, which can allow rippling through any pair that includes that trust line. The account can also enable rippling by default by enabling the [Default Ripple flag](#the-default-ripple-flag).

For example, imagine Emily has money issued by two different financial institutions, like so

[{% inline-svg file="/docs/img/noripple-03.svg" /%}](/docs/img/noripple-03.svg "Charlie --($10)-- Institution A --($1)-- Emily --($100)-- Institution B --($2)-- Daniel")

Now Charlie can pay Daniel by rippling through Emily's address. For example, if Charlie pays Daniel $10:

[{% inline-svg file="/docs/img/noripple-04.svg" /%}](/docs/img/noripple-04.svg "Charlie --($0)-- Institution A --($11)-- Emily --($90)-- Institution B --($12)-- Daniel")

This may surprise Emily, who does not know Charlie or Daniel. Even worse, if Institution A charges her higher fees to withdraw her money than Institution B, this could cost Emily money. The No Ripple flag exists to avoid this scenario. If Emily sets it on both trust lines, then payments cannot ripple through her address using those two trust lines.

For example:

[{% inline-svg file="/docs/img/noripple-05.svg" /%}](/docs/img/noripple-05.svg "Charlie --($10)-- Institution A --($1, No Ripple)-- Emily --($100, No Ripple)-- Institution B --($2)-- Daniel")

Now the above scenario, where Charlie pays Daniel while rippling through Emily's address, is no longer possible.

### Specifics

The No Ripple flag makes certain paths invalid, so that they cannot be used to make payments. A path is considered invalid if and only if it enters **and** exits an address node through trust lines where No Ripple has been enabled for that address.

[{% inline-svg file="/docs/img/noripple-06.svg" /%}](/docs/img/noripple-06.svg "Diagram demonstrating that No Ripple has to be set on both trust lines by the same address to do anything")


## The Default Ripple Flag

The **Default Ripple** flag is an account setting that enables rippling on all _incoming_ trust lines by default. Issuers MUST enable this flag for their customers to be able to send tokens to each other.

The Default Ripple setting of your account does not affect trust lines that you create; only trust lines that others open to you. If you change the Default Ripple setting of your account, trust lines that were created before the change keep their existing No Ripple settings. You can use a [TrustSet transaction][] to change the No Ripple setting of a trust line to match your address's new default.


## Using No Ripple
<!--{# TODO: move these things into their own tutorials #}-->

### Enabling / Disabling No Ripple

The No Ripple flag can only be enabled on a trust line if the address has a positive or zero balance on that trust line. This is so that the feature cannot be abused to default on the obligation the trust line balance represents. (Of course, you can still default by abandoning the address.)

To enable the No Ripple flag, send a [TrustSet transaction][] with the `tfSetNoRipple` flag. You can disable the No Ripple flag (that is, allow rippling) with the `tfClearNoRipple` flag instead.


### Looking Up No Ripple Status

In the case of two accounts that mutually trust each other, the No Ripple flag is tracked separately for each account.

Using the [HTTP / WebSocket APIs](../../../references/http-websocket-apis/index.md) or your preferred [client library](../../../references/client-libraries.md), look up trust lines with the [account_lines method][]. For each trust line, the `no_ripple` field shows whether the current address has enabled the No Ripple flag on that trust line, and the `no_ripple_peer` field shows whether the counterparty has enabled the No Ripple flag.

## See Also

- **Concepts:**
    - [Paths](paths.md)
- **Tutorials:**
    - [Stablecoin Issuer](../../../use-cases/tokenization/stablecoin-issuer.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
