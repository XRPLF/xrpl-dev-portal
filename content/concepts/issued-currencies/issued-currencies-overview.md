# Issued Currencies Overview

All currencies other than XRP can be represented in the XRP Ledger as **issued currencies**. These digital assets (sometimes called "issuances" or "IOUs") are tracked in accounting relationships, called "trust lines," between addresses. Issued currencies are typically considered as liabilities from one perspective and assets from the other, so the balance of a trust line is negative or positive depending on which side you view it from. Any address may freely issue (non-XRP) currencies, limited only by how much other addresses are willing to hold.

Issued currencies can "ripple" through multiple issuers and holders if they use the same currency code. This is useful in some cases, but can cause unexpected and undesirable behavior in others. You can use the [NoRipple flag](rippling.html) on trust lines to prevent those trust lines from rippling.

Issued currencies can be traded with XRP or each other in the XRP Ledger's decentralized exchange.

In the typical model, an issued currency is tied to holdings of currency or other assets outside the XRP Ledger. The issuer of the currency, called a _gateway_, handles deposits and withdrawals to exchange currency outside the XRP Ledger for equivalent balances of issued currency in the XRP Ledger. For more information on how to run a gateway, see the [Becoming an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html).

There are other use cases for issued currencies in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then "throwing away the key" to the issuer.

**Warning:** ICOs may be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA.

Ripple strongly recommends researching the relevant regulations before engaging in any financial service business.

## Issued Currency Properties

All issued currencies in the XRP Ledger exist in trust lines, represented in the ledger's data as [RippleState objects](ripplestate.html). To create an issued currency, the issuing address sends a [Payment transaction][] to an address which has a trust line to the issuer with a nonzero limit for that currency. (You can also create issued currency by rippling "through" such a trust line.) You can erase issued currency by sending it back to the issuer.

The issuer of a currency can define a percentage [transfer fee](transfer-fees.html) to deduct when two parties transact in its issued currencies.

Addresses can also [freeze](freezes.html) issued currencies, which may be useful for businesses to comply with financial regulations in their jurisdiction. If you do not need this feature and do not want to freeze currencies, you can give up your address's ability to freeze individual trust lines and to undo a global freeze. XRP cannot be frozen.

Issued currencies are designed to be able to represent any kind of currency or asset, including those with very small or very large nominal values. For detailed technical information on the types of currency codes and the numeric limits of issued currency representation, see the [currency format reference](currency-formats.html).

{% include '_snippets/tx-type-links.md' %}
