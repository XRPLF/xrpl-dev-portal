---
parent: freezes.html
html: common-misconceptions-about-freezes.html
seo:
    description: Clarify common misunderstandings about the XRP Ledger's freeze feature.
labels:
  - Tokens
---
# Common Misunderstandings about Freezes

It is a common misconception that Ripple or others can freeze XRP, similar to how centralized services like PayPal can suspend your account and prevent you from accessing your funds. In reality, while the XRP Ledger does have a [freeze feature](freezes.md), it can only be used on issued tokens, not on XRP. **No one can freeze XRP.**

Tokens in the XRP Ledger are [fundamentally different than XRP](../../../references/protocol/data-types/currency-formats.md#comparison). Tokens always exist _in trust lines_, which _can_ be frozen. XRP exists in accounts, which _cannot_ be frozen.

## Isn't XRP Just Ripple's Token? <!-- STYLE_OVERRIDE: just -->

No, XRP is different from tokens. XRP is the only native asset on the XRP Ledger and is required to conduct transactions on the XRP Ledger. XRP has no counterparty, meaning that when someone holds XRP, they are not holding a liability, they are holding the actual currency, XRP. Due to this fact, _**<u>XRP CANNOT be frozen by any entity or individual</u>**_.

## Can Ripple Freeze My Tokens? Or the XRP Ledger Foundation?

The XRP Ledger is decentralized so that no one party has control over it—not Ripple, not the XRP Ledger Foundation, and not anyone else.

The _issuer_ of a token can freeze your trust line for _that token specifically_. They can't freeze the rest of your account, or any tokens from different issuers, and they can't stop you from using the XRP Ledger.

Furthermore, token issuers can voluntarily and permanently _give up_ their ability to freeze tokens. This ["No Freeze"](freezes.md#no-freeze) setting is intended to allow tokens to behave more like physical cash, in that third parties can't stop you from using it.


## But I Heard Ripple Froze Jed McCaleb's XRP?

This is a misrepresentation of events that actually happened in 2015–2016. Jed McCaleb, a Ripple founder who left the company in 2013, attempted to sell over $1 million US worth of XRP on Bitstamp, a custodial exchange. Ripple representatives argued that this sale would breach an agreement that Jed and Ripple made in 2014. At Ripple's request, [Bitstamp froze Jed's Bitstamp account](https://www.coindesk.com/markets/2015/04/02/1-million-legal-fight-ensnares-ripple-bitstamp-and-jed-mccaleb/) and took the dispute to court. The case was [eventually settled](https://www.coindesk.com/markets/2016/02/12/ripple-settles-1-million-lawsuit-with-former-executive-and-founder/) with both sides declaring they were happy with the outcome.

Notably, the "freeze" did not happen on the XRP Ledger and did not involve the XRP Ledger's freeze feature. Like any custodial exchange, Bitstamp has the ability to freeze its users' accounts and stop them from trading or withdrawing funds, especially if those funds are involved in a legal dispute.

In contrast, when trading in the XRP Ledger's [decentralized exchange](../decentralized-exchange/index.md), you custody your own assets so no one can stop you from dealing in XRP.
