---
html: integrate-with-xrpl-dex.html
parent: defi-uc.html
blurb: Integrate with the XRPL DEX.
labels:
  - Decentralized Exchange
---
# Integrate with the XRPL Decentralized Exchange

Integrating with the XRP Ledger gives you access to one of the world's oldest decentralized exchanges (DEX), operating continuously since 2012. Users can trade [tokens](tokens.html) and XRP with minimal [fees](fees.html) to the network itself.

To learn more about the XRPL DEX structure and limitations, see: [Decentralized Exchange](decentralized-exchange.html).


## Set Up Node Services

For lighter use cases, you can often rely on free public servers. However, more serious use of the XRP Ledger requires your own infrastructure.

There are many reasons you might want to run your own servers, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. See [Reasons to Run Your Own Server](networks-and-servers.html#reasons-to-run-your-own-server).

There are two types of server software for the XRP Ledger:

- [`rippled`](https://github.com/XRPLF/rippled): The core server that runs the peer-to-peer network, processing transactions and reaching consensus on their outcomes.
- [`Clio`](https://github.com/XRPLF/clio): An API server optimized for RPC calls on the validated historical ledger.


## Set Up an Account

XRP is held in _accounts_ (also referred to as _wallets_ or _addresses_  ) on the XRP Ledger. Accounts on the XRP Ledger are different than accounts on other blockchain ledgers, such as Bitcoin, where accounts incur little to no overhead. In the XRP Ledger, account state is stored per ledger and accounts are [not easy to delete](deleting-accounts.html). To offset the costs associated with storing accounts, each account must hold a separate [reserve of XRP](reserves.html) that can't be sent to others. For these reasons, Ripple recommends that institutions not create excessive or needless accounts. <!-- STYLE_OVERRIDE: hot wallet, warm wallet, cold wallet, wallet, easy -->

To follow Ripple's recommended best practices, you should create at least two new accounts on the XRP Ledger. To minimize the risks associated with a compromised secret key, Ripple recommends creating [_cold_, _hot_, and _warm_ accounts](account-types.html) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The hot/warm/cold model is intended to balance security and convenience. Exchanges listing XRP should create the following accounts:

* A [_cold wallet_](account-types.html#issuing-address) to securely hold the majority of XRP and customers' funds. For exchanges, this is also the address to which its users send [deposits](#deposit-xrp-into-exchange).   To provide optimal security, this account's secret key should be offline.

* One or more [_hot wallets_](account-types.html#operational-addresses) to conduct the day-to-day business of managing customers' XRP withdrawals and deposits. For example, with a hot wallet, exchanges can securely support these types of automated XRP transfers. Hot wallets need to be online to service instant withdrawal requests.

* Optionally, one or more warm wallets to provide an additional layer of security between the cold and hot wallets. Unlike a hot wallet, the secret key of a warm wallet doesn't need to be online. Additionally, you can distribute the secret keys for the warm wallet to several different people and implement [multi-signing](multi-signing.html) to increase security.

There isn't a dedicated "create account" transaction. The [Payment](payment.html) transaction automatically creates a new account if the payment sends enough XRP to a mathematically-valid address that doesn't already have an account. This is called funding an account, and creates an `AccountRoot` entry in the ledger. No other transaction can create an account. To learn how to set up accounts, see: [Creating Accounts](accounts.html#creating-accounts).


## Managing Off-Ledger Assets (Optional)

If you are setting up an exchange to hold custody of user funds, you must manage your own balance sheet to track customers' holdings. In this situation, the exchange's accounts are represented _on-chain_ and can be queried. All users of that exchange are handled _off-chain_ by the exchange's accounting system.

XRP are represented on the XRP Ledger as an unsigned integer count of _drops_, where one XRP is 1,000,000 drops. Ripple recommends that your accounting software handles XRP balances in _drops_, but displays to users their balance in units of XRP.

One drop (.000001 XRP) can't be further subdivided. Keep this in mind when calculating and displaying rates between XRP and other assets.

To learn more about XRP and token specifics, see: [Currency Formats](currency-formats.html).


## Trading in the DEX

A trade in the XRP Ledger DEX is called an [Offer](offers.html). An Offer is effectively a [_limit order_](https://en.wikipedia.org/wiki/Order_(exchange)#Limit_order) to buy or sell a specific amount of one currency (XRP or a token) for a specific amount of another.

To see how an example trade is made on the DEX, using the **JavaScript** or **Python** libraries, see: [Trade in the Decentralized Exchange](trade-in-the-decentralized-exchange.html).


### Create Order Books

Use the `book_offers` method to retrieve a list of offers (an order book) between two currencies on the XRP Ledger. The response omits unfunded `Offers` and reports how much of each remaining Offer's total is currently funded. This step isn't technically a requirement, but it's good practice to confirm the exchange rates of currencies, using the `quality` field.

When searching for tokens, ensure you have the right `issuer` selected.

See: [`book_offers`](book_offers.html).


### Submitting Offers

To creat ean offer, send an `OfferCreate` transaction.

An `OfferCreate` transaction is an instruction to conduct a trade, either between two tokens, or a token and XRP. Each transaction contains a buy amount (`TakerPays`) and a sell amount (`TakerGets`). When the transaction is processed, it automatically consumes matching or crossing Offers to the extent possible. If that doesn't completely fill the new Offer, then the rest becomes an Offer object in the ledger.

The Offer object waits in the ledger until other Offers or cross-currency payments fully consume it. The account that placed the Offer is called the Offer's _owner_. You can cancel your own Offers at any time, using the dedicated `OfferCancel` transaction, or as an option of the `OfferCreate` transaction.

**Note:** Any Offer in the DEX that would exchange two tokens can use XRP as an intermediary currency in a synthetic order book. The XRPL DEX automatically uses this bridging technique to improve exchange rates and liquidity when doing so is cheaper than trading token-to-token. To learn more, see: [auto-bridging](autobridging.html).

While you have an Offer in the ledger, it sets aside some of your XRP toward the owner [reserve](reserves.html). When the Offer gets removed, for any reason, that XRP is freed up again.

See:

- [`OfferCreate` Transaction](offercreate.html)
- [`OfferCancel` Transaction](offercancel.html)
- [`Offer` Object](offer.html)


## Technical Considerations

### Tick Size

When an Offer is placed into an order book, its exchange rate is truncated based on the `TickSize` values set by the issuers of the currencies involved in the Offer. When trading XRP and a token, the `TickSize` from the token's issuer applies. When trading two tokens, the Offer uses the smaller `TickSize` value (that is, the one with fewer significant digits). If neither token has a `TickSize` set, the default behavior applies.

See: [Tick Size](ticksize.html)


### Transfer Fees

While the native XRP token doesn't charge a transfer fee, issued tokens can.

Token issuers can charge a transfer fee that applies when users transfer those tokens among themselves. The sender of the transfer is debited an extra percentage based on the transfer fee, while the recipient of the transfer is credited the intended amount. The difference is the transfer fee.

The transfer fee doesn't apply when sending or receiving directly to and from the issuing account, but it does apply when transferring from an operational address to another user.

To learn more about how these fees affect payment paths, see: [Transfer Fees in Payment Paths](transfer-fees.html#transfer-fees-in-payment-paths).