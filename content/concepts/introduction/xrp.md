# XRP

**XRP** is the native cryptocurrency of the XRP Ledger. All [accounts](accounts.html) in the XRP Ledger can send XRP among one another and must hold a minimum amount of XRP as a [reserve](reserves.html). XRP can be sent directly from any XRP Ledger address to any other, without needing a gateway or liquidity provider. This helps make XRP a convenient bridge currency.

Some advanced features of the XRP Ledger, such as [Escrow](escrow.html) and [Payment Channels](tutorial-paychan.html), only work with XRP. Order book [autobridging](https://ripple.com/dev-blog/introducing-offer-autobridging/) uses XRP to deepen liquidity in the decentralized exchange by merging order books of two issued currencies with XRP order books to create synthetic combined order books. (For example, autobridging matches USD:XRP and XRP:EUR orders to augment USD:EUR order books.)

XRP also serves as a protective measure against spamming the network. All XRP Ledger addresses need a small amount of XRP to pay the costs of maintaining the XRP Ledger. The [transaction cost](transaction-cost.html) and [reserve](reserves.html) are neutral fees denominated in XRP and not paid to any party. In the ledger's data format, XRP is stored in [AccountRoot objects](reference-ledger-format.html#accountroot).

For more information on XRP's use cases, benefits, and news, see the [XRP Portal](https://ripple.com/xrp-portal/).

## XRP Properties

The very first ledger contained 100 billion XRP, and no new XRP can be created. XRP can be destroyed by [transaction costs](transaction-cost.html) or lost by sending it to addresses for which no one holds a key, so XRP is slightly [deflationary](https://en.wikipedia.org/wiki/Deflation) by nature. No need to worry about running out, though: at the current rate of destruction, it would take at least 70,000 years to destroy all XRP, and XRP [prices and fees can be adjusted](fee-voting.html) as the total supply of XRP changes.

In technical contexts, XRP is measured precisely to the nearest 0.000001 XRP, called a "drop" of XRP. The [`rippled` APIs](reference-rippled.html) require all XRP amounts to be specified in drops of XRP. For example, 1 XRP is represented as `1000000` drops. For more detailed information, see the [currency format reference](reference-currency.html).
