---
html: peer-to-peer-payments-uc.html
parent: payments-uc.html
seo:
    description: Use the XRP Ledger to handle your day-to-day payments without a third party.
labels:
  - Transactions
---
# Peer-to-Peer Payments

The XRP Ledger provides an efficient and borderless solution to handling payments. Unlike traditional payment methods, you don't need a financial institution to hold your assets and transfer value. If you have access to the internet, you can make direct payments on the XRP Ledger as easily as handing someone cash. Whether between friends, or a buyer and merchant, the XRP Ledger enables you to handle direct (peer-to-peer) payments quickly and with low network fees.


## Wallets

Before jumping into using the XRP Ledger to handle direct payments, you should settle on a crypto wallet to use. Crypto wallets make it easier to interact with the ledger and manage your funds; there are many to choose from, depending on your needs, and you can even create your own. See: [Crypto Wallets](../../introduction/crypto-wallets.md).


## Account Creation

Before creating an account, you must decide which XRP Ledger network to use. There are multiple networks for different use cases, but native XRP transactions only happen on `Mainnet`. See: [Parallel Networks](../../concepts/networks-and-servers/parallel-networks.md)

Most publicly available wallets offer the ability to create an account for you and can generate a public and private key. If they don't, you can create an account yourself, so long as it's mathematically valid. See: [Creating Accounts](../../concepts/accounts/index.md#creating-accounts).


## Fund Your Account

An account isn't active on the XRP Ledger until it's been funded and meets the minimum reserve requiremen. See: [Reserves](../../concepts/accounts/reserves.md).

If the wallet you're using doesn't offer the option to purchase XRP, you'll need to find a third party exchange to do so and send it to your account. Alternatively, someone you know can also send XRP to your account. See: [Payment](../../references/protocol/transactions/types/payment.md).

After funding your account, you should verify on the XRP Ledger itself that your account exists and is funded. You can do this with the:

  - [XRPL Explorer](https://livenet.xrpl.org/).
  - [`account_info` command](../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md).


## Handling Payments


### Direct XRP Payments

XRP payments are the simplest way to pay someone on the XRP Ledger. You can use checks or escrows, but these require multiple transactions to complete. A direct XRP payment require only one transaction, making this option great for day-to-day activity. If you're a merchant handling large volumes of transactions, this may be the right choice for you due to it being quick, simple, and having the lowest fees. See: [Direct XRP Payments](../../concepts/payment-types/direct-xrp-payments.md).

To make a direct XRP payment work, you only need to know the address of the receiver.


### Cross-Currency Payments

The XRP Ledger enables you to make cross-currency payments of XRP and tokens. Cross-currency payments within the XRP Ledger are fully atomic, meaning the payment fully executes or no part of the payment executes at all.

Cross-currency payments deliver a fixed amount to their destination, but the sender can have a variable fee cost, depending on the paths taken to make the transaction work on the network. See: [Cross-currency Payments](../../concepts/payment-types/cross-currency-payments.md).

This is a great payment option if you or the receiver prefer a specific token instead of the native XRP currency.
