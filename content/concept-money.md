# Money in the XRP Ledger

The XRP Ledger is an advanced blockchain-like system that was designed to let people transact in multiple currencies, seamlessly tracking, trading, and settling multiple currencies in an exchange that's as decentralized as the network itself. Users have the power to create their own currency-like digital assets in the XRP Ledger, which may or may not be tied to traditional currencies and assets. Tying it all together is XRP, the XRP Ledger's native cryptocurrency, which serves anti-spam purposes and acting as a medium of exchange.

## XRP

**XRP** is the native cryptocurrency of the XRP Ledger. All [accounts](concept-accounts.html) in the XRP Ledger can send XRP among one another and . Unlike other currencies in the XRP Ledger, XRP is not tied to a "trust line" (accounting relationship) between addresses. XRP can be sent directly from any XRP Ledger address to any other, without needing a gateway or liquidity provider. This helps make XRP a convenient bridge currency.

Some advanced features of the XRP Ledger, such as [Escrow](concept-escrow.html) and [Payment Channels](tutorial-paychan.html), only work with XRP. Order book [autobridging](https://ripple.com/dev-blog/introducing-offer-autobridging/) uses XRP to deepen liquidity in the decentralized exchange by merging order books of two issued currencies (such as USD:EUR) with XRP order books (USD:XRP + XRP:EUR results in more trades for the USD:EUR book).

XRP also serves as a protective measure against spamming the network. All XRP Ledger addresses need a small amount of XRP to pay the costs of maintaining the XRP Ledger. The [transaction cost](concept-transaction-cost.html) and [reserve](concept-reserves.html) are neutral fees denoted in XRP and not paid to any party.

For more information on XRP's use cases, benefits, and news, see the [XRP Portal](https://ripple.com/xrp-portal/).

### XRP Properties

XRP is the only native currency in the XRP Ledger. The very first ledger contained 100 billion XRP, and no new XRP can be created. XRP can be destroyed by [transaction costs](concept-transaction-cost.html) or lost by sending it to addresses for which no one holds a key, so XRP is slightly [deflationary](https://en.wikipedia.org/wiki/Deflation) by nature. No need to worry about running out, though: at the current rate of destruction, it would take at least 70,000 years to destroy all XRP, and XRP prices and fees can be adjusted as the total supply of XRP changes.

Technically, XRP Ledger software uses unsigned 64-bit integers to store and calculate XRP amounts down to 6 decimal places. The smallest indivisible amount of XRP is 0.000001, called a "drop" of XRP. Thus, 1 XRP is represented as `1000000` in the internal representation, and 1 drop of XRP is `1` in the internal representation.

## Issued Currencies

All currencies other than XRP are represented as "issued currencies". These digital assets, sometimes called "issuances" or "IOUs", are tracked in accounting relationships, called "trust lines," between addresses. Issued currencies are typically considered as liabilities from one perspective and assets from the other, so the balance of a trust line is negative or positive depending on which side you view it from. An address freely issue (non-XRP) currency, limited only by how much other addresses are willing to hold.

Issued currencies can "ripple" through multiple issuers and holders if they use the same currency code. This is useful in some cases, but can cause unexpected and undesirable behavior in others. You can use the [NoRipple flag](concept-noripple.html) on trust lines to prevent those trust lines from rippling.

In the typical model, an issued currency is tied to holdings of currency or other assets outside the XRP Ledger. The issuer of the currency, called a _gateway_, handles deposits and withdrawals to exchange currency outside the XRP Ledger for equivalent balances of issued currency in the XRP Ledger. For more information on how to run a gateway, see the [Gateway Guide](tutorial-gateway-guide.html).

There are other use cases for issued currencies in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then throwing away the key to the issuer. (Be aware: ICOs may be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA.) Ripple recommends researching the relevant regulations before engaging in any financial service business.

Addresses can also [freeze](concept-freeze.html) issued currencies, which may be useful for businesses to comply with financial regulations in their jurisdiction. If you do not need this feature and do not want to freeze currencies, you can give up your address's ability to freeze individual trust lines and to undo a global freeze. XRP can never be frozen.

### Issued Currency Properties

Issued currencies in the XRP Ledger are represented with a custom number format that aims to provide high precision for a wide variety of assets, including those typically measured in very small or very large denominations, while keeping the numeric representation compact.

The precision for amounts of **non-XRP currency** in the XRP Ledger is as follows:

* Minimum nonzero absolute value: `1000000000000000e-96`
* Maximum value: `9999999999999999e80`
* Minimum value: `-9999999999999999e80`
* 15 decimal digits of precision

### Issued Currency Math

Numbers for issued currencies are represented as a 56-bit mantissa and an 8-bit exponent, which are joined into a 64-bit format when transmitting across the network.

The mantissa contains the significant digits of the currency. It is normalized such that `1000000000000000e-15` is the canonical representation of 1 unit of currency.

These are normalized to use the lowest (in some cases, most negative) exponent possible without losing precision. For example, the display value "1" can be represented as
