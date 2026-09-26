---
seo:
    description: Issuers can freeze their issued tokens for compliance purposes.
labels:
  - Tokens
---
# Freezing Tokens

Issuers can freeze the tokens they issue in the XRP Ledger. **This does not apply to XRP,** which is the native asset of the XRP Ledger, not an issued token.

In certain cases, to meet regulatory requirements, or while investigating suspicious activity, an issuer may want to freeze a balance they issue. This page describes the freeze functionality of [trust line tokens](./trust-line-tokens.md).

{% admonition type="success" name="Tip" %}No one can freeze XRP in the XRP Ledger. However, custodial exchanges can always freeze the funds they custody at their own discretion. For more details, see [Common Misunderstandings about Freezes](common-misconceptions-about-freezes.md).{% /admonition %}

Trust line tokens have these settings related to freezes:

* [**Individual Freeze**](#individual-freeze) - Freeze one counterparty, so they cannot spend tokens.
* [**Deep Freeze**](#deep-freeze) - Further freeze one counterparty, so that they cannot receive those tokens, either.
* [**Global Freeze**](#global-freeze) - Freeze all counterparties.
* [**No Freeze**](#no-freeze) - Permanently give up the ability to freeze individual counterparties, as well as the ability to end a global freeze.

All freeze settings can be enacted regardless of whether the balance(s) to be frozen are positive or negative. Either the token issuer or the currency holder can freeze a trust line; however, the effect is minimal when a currency holder enacts a freeze.

[MPTs](./multi-purpose-tokens.md) have similar functionality, but it is called "locking" and individual freezes always function like deep freeze.


## Individual Freeze

The **Individual Freeze** feature is a setting on a [trust line](index.md). When an issuer enables the Individual Freeze setting, the following rules apply to the tokens in that trust line:

* Payments can still occur directly between the two parties of the frozen trust line.
* The counterparty of that trust line can no longer decrease its balance on the frozen trust line, except in direct payments to the issuer. The counterparty can only send the frozen currencies directly to the issuer.
* The counterparty can still receive payments from others on the frozen trust line.
* The counterparty's offers to sell the tokens in the frozen trust line are [considered unfunded](../decentralized-exchange/offers.md#lifecycle-of-an-offer).

Reminder: Trust lines do not hold XRP. XRP cannot be frozen.

A financial institution can freeze the trust line linking it to a counterparty if that counterparty shows suspicious activity or violates the financial institution's terms of use. The financial institution should also freeze the counterparty in any other systems the financial institution uses that are connected to the XRP Ledger. (Otherwise, an address might still be able to engage in undesired activity by sending payments through the financial institution.)

An individual address can freeze its trust line to a financial institution. This has no effect on transactions between the institution and other users. It does, however, prevent other addresses, including [operational addresses](../../accounts/account-types.md), from sending that financial institution's tokens to the individual address. This type of individual freeze has no effect on offers.

The Individual Freeze applies to a single trust line. To freeze multiple tokens with a particular counterparty, the address must enable Individual Freeze on the trust lines for each separate currency code.

An address cannot enable the Individual Freeze setting if it has enabled the [No Freeze](#no-freeze) setting.


## Deep Freeze

The **Deep Freeze** feature is a setting on a trust line that provides a more restrictive version of an individual freeze. When an issuer enables a deep freeze, the following rules apply to the tokens on that trust line:

- Payments can still occur directly between the two parties of the deep-frozen trust line.
- The counterparty can no longer increase or decrease their balance on the deep-frozen trust line, except in direct payments to the issuer.
- The counterparty can no longer send nor receive from others on the deep-frozen trust line.
- The counterparty's [offers](../decentralized-exchange/offers.md) to buy or sell tokens of the deep-frozen type are considered unfunded. The counterparty cannot place new offers to buy or sell the specified tokens.
- Payments that would [ripple through](./rippling) the deep frozen trust line are disallowed. Payments must take another path, if possible, or fail.

An individual address can deep freeze their trust line to an issuer. This has no effect on transactions between the issuer and other holders. However, it does the following:

- It prevents others from sending tokens of the deep-frozen type to the individual.
- It also prevents the individual address from sending those tokens to other addresses, except the issuer.
- It stops the individual address from placing offers to buy or sell the deep-frozen tokens.
- It stops payments from rippling through the deep-frozen trust line.

A deep freeze is a _further level_ of freeze from an individual freeze: it can only be put in place on a trust line if an individual freeze is already in place or is enacted at the same time. The regular individual freeze cannot be cleared unless the deep freeze is also cleared at the same time; however, the deep freeze _can_ be cleared while leaving the individual freeze in place.

An address cannot enable the Deep Freeze setting if it has enabled the [No Freeze](#no-freeze) setting.

{% amendment-disclaimer name="DeepFreeze" /%}


## Global Freeze

The **Global Freeze** feature is a setting on an account. An account can enable a global freeze only on itself. When an issuer enables the Global Freeze feature, the following rules apply to all tokens they issue:

* All counterparties of the frozen issuer can no longer decrease the balances in their trust lines to the frozen account, except in direct payments to the issuer. (This also affects the issuer's own [operational addresses](../../accounts/account-types.md).)
* Counterparties of the frozen issuer can still send and receive payments directly to and from the issuing address.
* All offers to sell tokens issued by the frozen address are [considered unfunded](../decentralized-exchange/offers.md#lifecycle-of-an-offer).

Reminder: addresses cannot issue XRP. Global freezes do not apply to XRP.

It can be useful to enable Global Freeze on a financial institution's [issuing account](../../accounts/account-types.md) if the issuer's [secret key](../../accounts/cryptographic-keys.md) is compromised, even after regaining control of a such an address. This stops the flow of funds, preventing attackers from getting away with any more money or at least making it easier to track what happened. Besides enacting a Global Freeze in the XRP Ledger, the issuer should also suspend activities in its outside systems.

It can also be useful to enable Global Freeze if a financial institution intends to migrate to a new [issuing address](../../accounts/account-types.md), or if the financial institution intends to cease doing business. This locks the funds at a specific point in time, so users cannot trade them away for other currencies.

Global Freeze applies to _all_ tokens issued and held by the address. You cannot enable Global Freeze for only one currency code. If you want to have the ability to freeze some tokens and not others, you should use different addresses for each token.

An address can always enable the Global Freeze setting. However, if the address has enabled the [No Freeze](#no-freeze) setting, it can never _disable_ Global Freeze.


## No Freeze

The **No Freeze** feature is a setting on an address that permanently gives up the ability to freeze tokens arbitrarily. An issuer can use this feature to make its tokens as "more like physical money" in the sense that the issuer cannot interfere with counterparties trading the tokens among themselves.

Reminder: XRP already cannot be frozen. The No Freeze feature only applies to other tokens issued in the XRP Ledger.

The No Freeze setting has the following effects:

* The issuer can no longer enable Individual Freeze or Deep Freeze on trust lines to any counterparty.
* The issuer can still enact a Global Freeze, but cannot _disable_ the Global Freeze.
* The issuer can not enable [Clawback](./clawing-back-tokens.md) for their trust line tokens. (Clawback for MPTs is unaffected.)

The XRP Ledger cannot force an issuer to honor the obligations that its issued funds represent, so No Freeze does stop a stablecoin issuer from defaulting on its obligations. However, No Freeze ensures that an issuer does not use the Global Freeze feature unfairly against specific users.

The No Freeze setting applies to all trust line tokens issued to and from an address. If you want to be able to freeze some tokens but not others, you should use different addresses for each, or use [MPTs](./multi-purpose-tokens.md).

You can only enable the No Freeze setting with a transaction signed by your address's master key secret. You cannot use a [Regular Key](../../../references/protocol/transactions/types/setregularkey.md) or a [multi-signed transaction](../../accounts/multi-signing.md) to enable No Freeze.

## Relation to Clawback

[Clawback](./clawing-back-tokens.md) is another feature intended to let token issuers comply with financial regulations. Clawback can be used to reclaim issued tokens that are held by the counterparty, but only if the clawback functionality was enabled in advance.

The Clawback and No Freeze settings are mutually exclusive: Clawback for trust line tokens cannot be enabled if the address has enabled the No Freeze setting, and the No Freeze setting cannot be enabled if Clawback is enabled for the address's trust line tokens.

[Clawback transactions][] can claw back funds even when those funds are frozen, because they operate directly between the issuer and holder.

[AMMClawback transactions][] can also override freeze settings to claw back tokens that have been deposited in an [AMM](../decentralized-exchange/automated-market-makers.md). Without the `fixCleanup3_4_0` amendment, AMMClawback cannot claw back funds if the issuer has frozen the AMM's trust line. {% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%}

## How does MPT locking compare with freezing trust line tokens?

The ability to "lock" an [MPT](./multi-purpose-tokens.md) is mostly equivalent to the ability to "deep freeze" a trust line token. See the following table for details:

| Function | Trust line token | Multi-purpose Token (MPT) |
|----------|------------------|---------------------------|
| Individual freeze/lock | Two flags: regular **Individual Freeze** (blocks spending) and **Deep Freeze** (blocks spending and receiving) | One **Lock** flag (blocks spending _and_ receiving) |
| Global freeze/lock | Per issuing account (**Global Freeze** setting) | Per token issuance (**MPT Lock** setting) |
| Ability to give up freeze/lock power | Per issuing account (**No Freeze** setting) | Per token issuance (**Can Lock** setting) |
| Relation between clawback and freeze | Cannot enable both **Clawback** and **No Freeze** | Can enable any combination of **Can Lock** and **Can Clawback** |



# See Also

- [Freeze Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/freeze)
- **Concepts:**
    - [Trust Lines and Issuing](index.md)
- **Tutorials:**
    - [Enable No Freeze](../../../tutorials/tokens/fungible-tokens/enable-no-freeze.md)
    - [Enact Global Freeze](../../../tutorials/tokens/fungible-tokens/enact-global-freeze.md)
    - [Freeze a Trust Line](../../../tutorials/tokens/fungible-tokens/freeze-a-trust-line.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
