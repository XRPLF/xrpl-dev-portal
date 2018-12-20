# XRP

**XRP** is the native cryptocurrency of the XRP Ledger. All [accounts](accounts.html) in the XRP Ledger can send XRP among one another and must hold a minimum amount of XRP as a [reserve](reserves.html). XRP can be sent directly from any XRP Ledger address to any other, without needing a gateway or liquidity provider. This helps make XRP a convenient bridge currency.

Some advanced features of the XRP Ledger, such as [Escrow](escrow.html) and [Payment Channels](use-payment-channels.html), only work with XRP. Order book [autobridging](https://xrpl.org/blog/2014/introducing-offer-autobridging.html) uses XRP to deepen liquidity in the decentralized exchange by merging order books of two issued currencies with XRP order books to create synthetic combined order books. (For example, autobridging matches USD:XRP and XRP:EUR orders to augment USD:EUR order books.)

XRP also serves as a protective measure against spamming the network. All XRP Ledger addresses need a small amount of XRP to pay the costs of maintaining the XRP Ledger. The [transaction cost](transaction-cost.html) and [reserve](reserves.html) are neutral fees denominated in XRP and not paid to any party. In the ledger's data format, XRP is stored in [AccountRoot objects](accountroot.html).

For more information on XRP's use cases, benefits, and news, see the [XRP Portal](https://ripple.com/xrp/).

## XRP Properties

The very first ledger contained 100 billion XRP, and no new XRP can be created. XRP can be destroyed by [transaction costs](transaction-cost.html) or lost by sending it to addresses for which no one holds a key, so XRP is slightly [deflationary](https://en.wikipedia.org/wiki/Deflation) by nature. No need to worry about running out, though: at the current rate of destruction, it would take at least 70,000 years to destroy all XRP, and XRP [prices and fees can be adjusted](fee-voting.html) as the total supply of XRP changes.

In technical contexts, XRP is measured precisely to the nearest 0.000001 XRP, called a "drop" of XRP. The [`rippled` APIs](rippled-api.html) require all XRP amounts to be specified in drops of XRP. For example, 1 XRP is represented as `1000000` drops. For more detailed information, see the [currency format reference](currency-formats.html).

## History

### XRP Sales

In 2012, the founders of the XRP Ledger (Chris Larsen, Jed McCaleb, and Arthur Britto) gave 80 billion XRP to Ripple (the company, called OpenCoin Inc. at the time). The company regularly sells XRP, uses it to strengthen XRP markets and improve network liquidity, and incentivizes development of the greater ecosystem. In 2017, the company [placed 55 billion XRP in escrow](https://ripple.com/insights/ripple-escrows-55-billion-xrp-for-supply-predictability/) to ensure that the amount entering the general supply [grows predictably](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/) for the foreseeable future. Ripple's [XRP Market Performance site](https://ripple.com/xrp/market-performance/) reports how much XRP the company has available and locked in escrow at present.

### Naming

Originally, the XRP Ledger was called "Ripple" and the native asset built into the ledger was "ripple credits" or "ripples", inspired by the way the technology's decentralized exchange allowed payments [to ripple through multiple hops](rippling.html) and issued currencies, and the company spurring development of the technology registered itself as "Ripple Labs". To comply with the ISO 4217 currency code standard, the creators popularized a ticker symbol of "XRP" using the X prefix reserved non-national currencies. Community members frequently referred to the asset as "XRP" in all contexts to avoid ambiguity with the similar names for the technology and company. Eventually this usage came to dominate, and the company shortened its own name to "Ripple". In May 2018, the community selected a new "X" symbol to represent XRP to differentiate it from the triskellion logo that had previously been used for both the company and the digital asset.

The smallest, indivisible unit of XRP was named a "drop" [at the suggestion of Ripple forum member ThePiachu](https://forum.ripple.com/viewtopic.php?f=1&t=40&p=228).
