---
html: freezes.html
parent: trust-lines-and-issuing.html
seo:
    description: Issuers can freeze their issued tokens for compliance purposes.
labels:
  - Tokens
---
# Freezing Tokens

Issuers can freeze the tokens they issue in the XRP Ledger. **This does not apply to XRP,** which is the native asset of the XRP Ledger, not an issued token.

In certain cases, to meet regulatory requirements, or while investigating suspicious activity, an exchange or gateway may want to freeze token balances.

**Tip:** No one can freeze XRP in the XRP Ledger. However, custodial exchanges can always freeze the funds they custody at their own discretion. For more details, see [Common Misunderstandings about Freezes](common-misconceptions-about-freezes.md).

There are three settings related to freezes:

* [**Individual Freeze**](#individual-freeze) - Freeze one counterparty.
* [**Global Freeze**](#global-freeze) - Freeze all counterparties.
* [**No Freeze**](#no-freeze) - Permanently give up the ability to freeze individual counterparties, as well as the ability to end a global freeze.

All freeze settings can be enacted regardless of whether the balance(s) to be frozen are positive or negative. Either the token issuer or the currency holder can freeze a trust line; however, the effect is minimal when a currency holder enacts a freeze.


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

The No Freeze setting has two effects:

* The issuer can no longer enable Individual Freeze on trust lines to any counterparty.
* The issuer can still enact a Global Freeze, but cannot _disable_ the Global Freeze.

The XRP Ledger cannot force an issuer to honor the obligations that its issued funds represent, so No Freeze does stop a stablecoin issuer from defaulting on its obligations. However, No Freeze ensures that an issuer does not use the Global Freeze feature unfairly against specific users.

The No Freeze setting applies to all tokens issued to and from an address. If you want to be able to freeze some tokens but not others, you should use different addresses for each.

You can only enable the No Freeze setting with a transaction signed by your address's master key secret. You cannot use a [Regular Key](../../../references/protocol/transactions/types/setregularkey.md) or a [multi-signed transaction](../../accounts/multi-signing.md) to enable No Freeze.



# See Also

- [Freeze Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/freeze)
- **Concepts:**
    - [Trust Lines and Issuing](index.md)
- **Tutorials:**
    - [Enable No Freeze](../../../tutorials/how-tos/use-tokens/enable-no-freeze.md)
    - [Enact Global Freeze](../../../tutorials/how-tos/use-tokens/enact-global-freeze.md)
    - [Freeze a Trust Line](../../../tutorials/how-tos/use-tokens/freeze-a-trust-line.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
