---
html: algorithmic-trading.html
parent: defi-uc.html
blurb: The XRP Ledger's decentralized exchange consists of an unlimited number of currency pairs, tracked on-demand when users make trades. 
labels:
  - Transactions
---
# Algorithmic Trading

The XRP Ledger's decentralized exchange presents an opportunity to earn money through _algorithmic trading_, which means running a computer program to find and take profitable trading opportunities automatically. In algorithmic trading, you typically make many trades based on quantitative factors to earn steady, small profits; this is unlike traditional manual trading where you make a few long-term investments based on market fundamentals and wait to earn a large return over time. Blockchains are often more suitable for algorithmic trading than manual trading, because the high volatility of cryptocurrencies in general makes them less suitable for traditional "buy and hold" investing; the XRP Ledger is particularly suited for algorithmic trading, for several reasons:

- Decentralized exchange data is public and freely available. You don't need a subscription or special access to see what trades are available.
- Trades settle in seconds, which is fast enough that you can do a lot of trading, but not so fast that you need a specialized network connection or extremely powerful computer. You can trade using a laptop and decent home internet connection.
- Transaction fees on the XRP Ledger are very low, so you don't need much capital to start trading.

## Trading Strategies

Algorithmic trading can make profits through many different strategies; part of the challenge (or the fun) of algorithmic trading is designing and implementing your own unique approach. Other traders may be reluctant to share their strategies in detail, because that would lead to more people competing to take the same opportunities. From a high level, algorithmic trading approaches often fall into the following categories:

- **Arbitrage:** Buying and immediately selling an asset to take advantages of price differences. This could involve finding sets of 3 or more assets where the prices aren't aligned, or using the XRP Ledger to move assets between private exchanges where the prices are different.
- **Quantitative Trading:** Predicting and taking advantage of future price movements based on past price movements, outside data, or both. Examples include [candlestick patterns](https://blog.quantinsti.com/candlestick-patterns-meaning/), correlating an asset's price movements with other assets, and using sentiment analysis of social media.
- **Front-running:** Taking advantage of pending trades, especially large ones, by buying and immediately reselling the assets those trades are buying. While the XRP Ledger's canonical ordering of transactions makes front-running difficult, it is not impossible.

## Background Reading

You can familiarize yourself with algorithmic trading, in general, by reading the following resources:

- [Investopedia: Basics of Algorithmic Trading: Concepts and Examples](https://www.investopedia.com/articles/active-trading/101014/basics-algorithmic-trading-concepts-and-examples.asp)
- [_Flash Boys: A Wall Street Revolt_ by Michael Lewis](https://wwnorton.com/books/Flash-Boys/)
- [Investopedia: How Arbitraging Works in Investing, With Examples](https://www.investopedia.com/terms/a/arbitrage.asp)

The following pages describe key elements of how the XRP Ledger's decentralized exchange works:

- [Tokens](tokens.html)
- [Decentralized Exchange](decentralized-exchange.html)
- [Offers](offers.html)

The following articles provide some more specific examples and interesting information about how these strategies work on other blockchains. This information isn't necessary to get started, but may help to provide perspective.

- [Ethereum is a Dark Forest](https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest)
- [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (PDF)](https://arxiv.org/pdf/1904.05234.pdf)
- [Slippage in AMM Markets](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4133897)
- [Frontrunner Jones and the Raiders of the Dark Forest: An Empirical Study of Frontrunning on the Ethereum Blockchain](https://www.usenix.org/conference/usenixsecurity21/presentation/torres)
- [SoK: Transparent Dishonesty: front-running attacks on Blockchain (PDF)](https://arxiv.org/pdf/1902.05164)

## Testing and Common Mistakes

Like any type of trading, algorithmic trading is not a surefire way to make money; there are many ways you might take a loss. Compared with manual trading, algorithmic trading has much less room for error. If you make a small mistake, but multiply it by a large number of trades, your losses can add up very quickly before you have a chance to fix the problem. Therefore, it's wise to do various tests to make sure that your trading strategy will actually make a profit. You might do any or all of the following to test your strategy or the actual implementation of it (often called a _bot_):

- Manually calculate the potential returns based on the current ledger state or past trades.
- Record historical data and feed it to your bot, then record what actions the bot would have taken and compare the results against the actual historical price movements.
- Model or predict the results of your approach in various plausible future scenarios.

Common mistakes you might make in these calculations or in building your bot include:

- Rounding errors. If your math is not sound, or does not match the precision that the blockchain uses, you could inaccurately predict the results of a trade and take a loss, or have your trade not execute at all. The XRP Ledger uses different precision for token and XRP amounts, which can lead to rounding in unexpected places when trading one for the other. For more details on the precision used in the protocol, see [Currency Formats](currency-formats.html).
    - Be aware that token issuers can further limit the precision of exchange rates involving their tokens. See [Tick Size](ticksize.html) for details.
    - Typically, you need to adjust your amounts by some small percentage to account for potential differences in rounding or price movements between when you looked things up and when your trade executes. This amount is called _slippage_, and it's important to get the right amount. If it's too low, your transaction may not execute at all; but if it's too high, you're vulnerable to front-running, and the higher it is the more that price movements can cut into your profits in general.
- Forgetting extra costs and delays. For example, if two stablecoins are both fully backed by US dollars, but one issuer charges a 0.5% transfer fee and a different issuer charges a 0.25% [transfer fee](transfer-fees.html), you should expect about a 0.25% difference in the effective price those stablecoins trade at. Don't forget the costs of sending a transaction, even though they're usually small, nor the consequences of other potential delays. For example, even if an off-ledger private exchange shows a favorable price now, if that exchange takes hours or even days to process a deposit, the price is likely to shift and you likely can't take advantage of it unless you already have liquidity at that exchange. If the XRP Ledger
- Not accounting for rare events. Even setting aside unprecented ("black swan") events, your calculations can be very skewed by individual outliers which don't occur regularly. As one example (which is a true story), a trader reported that, when calculating the potential profits of a given strategy in a specific time range, over 80% of the profits came from a single "fat-fingered" transaction where another user had accidentally added an extra zero to their price. The same strategy was far less profitable when calculated against time ranges that didn't include the outlier transaction.
- Not reading transaction flags. The flags of an XRP Ledger transaction can have significant impacts on the way that transaction is processed and when the protocol marks it as "successful". For example, the flags of "Offer" transactions can make it a "fill or kill" order that only trades if the full amount can be obtained immediately; the flags of "Payment" transactions can make them [partial payments](partial-payments.html) that succeed even if they can't deliver the full amount to the intended destination. You need to do bitwise math to parse the `Flags` field of a transaction, but your expectations can be totally wrong if you skip doing so.

## Taxes and Licensing

The legal requirements for trading on a blockchain vary by jurisdiction. In many cases, there are no licensing or other legal barriers to getting started, but you may be required to report your profits for tax purposes, especially if your gains or losses are over some thresholds. In the United States, you typically report profits (or losses) from trading as capital gains, which means you need to calculate the cost basis for the assets you buy at the time you acquire them. There are various tools out there that may be able to help track your trading activity or even generate the appropriate tax forms, depending on your individual situation. Depending on which assets you are trading and your trading strategies, the details may vary. Be sure to do your research or consult with a tax professional before you get started with algorithmic trading.


## Technical Details

### Placing Trades

Buying and selling _fungible_ tokens and XRP within the XRP Ledger's decentralized exchange typically involves sending [OfferCreate transactions](offercreate.html). For a detailed walkthrough of the code and technical steps to place a trade this way, see [Trade in the Decentralized Exchange](trade-in-the-decentralized-exchange.html). It is also possible to exchange currencies using the [Payment transaction type](payment.html). You could send a [cross-currency payment](cross-currency-payments.html) to another user or even send it back to yourself, using a long [path](paths.html) to link arbitrage opportunities together into a single operation.

Non-fungible tokens work differently; for the code and technical steps to trade NFTs, see [Transfer NFTokens Using JavaScript](transfer-nftokens-using-javascript.html).

### Reading Trade Data

There are many sources of information about the trading activity in the XRP Ledger. Depending on your trading strategy and use case, you may be able to connect to the XRP Ledger through [Public Servers](public-servers.html), but you can often benefit from running your own server, and some use cases may not be practical without doing so. See [Install `rippled`](install-rippled.html) for instructions on how to set up a core server in P2P mode.

If your approach involves following other transaction activity, you may need to read the transactions' detailed metadata to know exactly how much they traded. Offers can partially execute and may consume multiple matching offers. For a detailed explanation of how to interpret transaction metadata, see [Look Up Transaction Results](look-up-transaction-results.html).

To give yourself as much time as possible to react to profit-taking opportunities, you may also want to look at pending data from the [Open Ledger](open-closed-validated-ledgers.html), or even monitor for proposed transactions. If you're connected to WebSocket, you can use the [subscribe method](subscribe.html) with the `transactions_proposed` stream to see transactions before they're validated by consensus; you can also limit this to a subset of transactions that affect a particular account (for example, the issuer of a token you're interested in trading) by subscribing using the `accounts_proposed` parameter.

### Future Developments

Ripple has proposed extending the XRP Ledger protocol with a native Automated Market Maker (AMM) design that would work alongside the existing central limit order based (CLOB) decentralized exchange. If this proposal is accepted and becomes enabled as an [amendment](amendments.html), AMMs will become an important factor in trading on the XRP Ledger. You can read more at the following links:

- [XLS-30d: Automated Market Maker standards proposal](https://github.com/XRPLF/XRPL-Standards/discussions/78)
- [AMM documentation (Ripple Open Source site)](https://opensource.ripple.com/docs/xls-30d-amm/automated-market-makers/)
