---
html: freezes.html
parent: issued-currencies.html
blurb: Freezes can suspend trading of issued currencies for compliance purposes.
labels:
  - Tokens
---
# Freezing Issued Currencies

Issuers can freeze the tokens they issue in the XRP Ledger.

XRP is not an issued currency. XRP is the only native asset on the XRP Ledger and is required to conduct transactions on the XRP Ledger. XRP has no counterparty, meaning that when someone holds XRP, they are not holding a liability, they are holding the actual currency, XRP. Due to this fact, _**<u>XRP CANNOT be frozen by any entity or individual</u>**_.

All non-XRP currencies can be represented in the XRP Ledger as issued currencies. These issued currencies (sometimes called "IOUs") are tracked in accounting relationships, called "trust lines," between addresses. Issued currencies are typically considered as liabilities from one perspective and assets from the other, so the balance of a trust line is negative or positive depending on which side you view it from. Any address may freely issue (non-XRP) currencies, limited only by how much other addresses are willing to hold. <!-- STYLE_OVERRIDE: IOUs -->

In certain cases, to meet regulatory requirements, or while investigating suspicious activity, an exchange or gateway may want to quickly freeze non-XRP issued currency balances.

**Tip:** No one can freeze XRP in the XRP Ledger. However, custodial exchanges can always freeze the funds they custody at their own discretion.

There are three settings related to freezes:

* [**Individual Freeze**](#individual-freeze) - Freeze one counterparty.
* [**Global Freeze**](#global-freeze) - Freeze all counterparties.
* [**No Freeze**](#no-freeze) - Permanently give up the ability to freeze individual counterparties, as well as the ability to end a global freeze.

The freeze feature only applies to issued currencies. Because no party has a privileged place in the XRP Ledger, the freeze feature cannot prevent a counterparty from conducting transactions in XRP or funds issued by other counterparties. No one can freeze XRP.

All freeze settings can be enacted regardless of whether the balance(s) to be frozen are positive or negative. Either the currency issuer or the currency holder can freeze a trust line; however, the effect of a currency holder freezing an issuer is minimal.


## Individual Freeze

The **Individual Freeze** feature is a setting on a [trust line](trust-lines-and-issuing.html). When an issuing address enables the Individual Freeze setting, the following rules apply to the currency of that trust line:

* Payments can still occur directly between the two parties of the frozen trust line.
* The counterparty of that trust line can no longer decrease its balance on the frozen trust line, except in direct payments to the issuer. The counterparty can only send the frozen currencies directly to the issuer.
* The counterparty can still receive payments from others on the frozen trust line.
* The counterparty's offers to sell the currency issued on the frozen trust line are [considered unfunded](offers.html#lifecycle-of-an-offer).

Reminder: Trust lines do not hold XRP. XRP cannot be frozen.

A financial institution can freeze the trust line linking it to a counterparty if that counterparty shows suspicious activity or violates the financial institution's terms of use. The financial institution should also freeze the counterparty in any other systems the financial institution uses that are connected to the XRP Ledger. (Otherwise, an address might still be able to engage in undesired activity by sending payments through the financial institution.)

An individual address can freeze its trust line to a financial institution. This has no effect on transactions between the institution and other users. It does, however, prevent other addresses, including [operational addresses](issuing-and-operational-addresses.html), from sending that financial institution's issued currencies to the individual address. This type of individual freeze has no effect on offers.

The Individual Freeze applies to a single currency only. To freeze multiple currencies with a particular counterparty, the address must enable Individual Freeze on the trust lines for each currency individually.

An address cannot enable the Individual Freeze setting if it has enabled the [No Freeze](#no-freeze) setting.


## Global Freeze

The **Global Freeze** feature is a setting on an address. When an issuing address enables the Global Freeze feature, the following rules apply to all currencies they issue:

* All counterparties of the frozen issuing address can no longer decrease the balances in their trust lines to the frozen address, except in direct payments to the issuer. (This also affects any [operational addresses](issuing-and-operational-addresses.html).)
* Counterparties of the frozen issuing address can still send and receive payments directly to and from the issuing address.
* All offers to sell currencies issued by the frozen address are [considered unfunded](offers.html#lifecycle-of-an-offer).

Reminder: addresses cannot issue XRP. Global freezes do not apply to XRP.

It can be useful to enable Global Freeze on a financial institution's [issuing address](issuing-and-operational-addresses.html) if the secret key to an operational address is compromised, even after regaining control of a such an address. This stops the flow of funds, preventing attackers from getting away with any more money or at least making it easier to track what happened. Besides enacting a Global Freeze in the XRP Ledger, a financial institution should also suspend activities in its connectors to outside systems.

It can also be useful to enable Global Freeze if a financial institution intends to migrate to a new [issuing address](issuing-and-operational-addresses.html), or if the financial institution intends to cease doing business. This locks the funds at a specific point in time, so users cannot trade them away for other currencies.

Global Freeze applies to _all_ currencies issued and held by the address. You cannot enable Global Freeze for only one currency. If you want to have the ability to freeze some currencies and not others, you should use different addresses for each currency.

An address can always enable the Global Freeze setting. However, if the address has enabled the [No Freeze](#no-freeze) setting, it can never _disable_ Global Freeze.


## No Freeze

The **No Freeze** feature is a setting on an address that permanently gives up the ability to freeze issued currencies arbitrarily. An issuer can use this feature to treat its issued funds as "more like physical money" in the sense that the issuer cannot interfere with counterparties trading the currency among themselves.

Reminder: XRP already cannot be frozen. The No Freeze feature only applies to other currencies issued in the XRP Ledger.

The No Freeze setting has two effects:

* The issuing address can no longer enable Individual Freeze on trust lines to any counterparty.
* The issuing address can still enable Global Freeze to enact a global freeze, but the address cannot _disable_ Global Freeze.

The XRP Ledger cannot force an issuer to honor the obligations that its issued funds represent, so No Freeze does stop an issuer from defaulting on its obligations. However, No Freeze ensures that an issuer does not use the Global Freeze feature unfairly against specific users.

The No Freeze setting applies to all currencies issued to and from an address. If you want to be able to freeze some currencies but not others, you should use different addresses for each currency.

You can only enable the No Freeze setting with a transaction signed by your address's master key secret. You cannot use a [Regular Key](setregularkey.html) or a [multi-signed transaction](multi-signing.html) to enable No Freeze.



# See Also

- [GB-2014-02 New Feature: Balance Freeze](https://ripple.com/files/GB-2014-02.pdf)
- [Freeze Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/freeze)
- **Concepts:**
    - [Trust Lines and Issuing](trust-lines-and-issuing.html)
- **Tutorials:**
    - [Enable No Freeze](enable-no-freeze.html)
    - [Enact Global Freeze](enact-global-freeze.html)
    - [Freeze a Trust Line](freeze-a-trust-line.html)
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
