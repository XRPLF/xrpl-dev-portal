---
html: peer-to-peer-payments-uc.html
parent: payments-uc.html
blurb: Use the XRP Ledger to handle your day-to-day payments without a third party.
labels:
  - Transactions
---
# Peer-to-Peer Payments

The XRP Ledger provides an efficient and borderless solution to handling payments. Unlike traditional payment methods, you don't need a financial institution to hold your assets and transfer value. If you have access to the internet, you can make direct payments on the XRP Ledger as easily as handing someone cash. Whether between friends, or a buyer and merchant, the XRP Ledger enables you to handle direct (peer-to-peer) payments quickly and with extremely low network fees.


## Wallets

Wallets provide a way to manage your account and funds on the XRP Ledger. There are many wallets to choose from and choosing the right one ultimately comes down to your needs and comfort working with XRP.

A major factor when choosing a wallet is if you want a custodial or non-custodial wallet. A custodial wallet means a third party holds your funds, typically on an account they manage on the XRP Ledger. A custodial wallet can be thought of like a bank, where you're trusting another entity to keep your money secure. Many centralized exchanges offer custodial wallets, so when you create an account with them and use their app, you don't technically have an account on the ledger. For day-to-day payments, this may be preferable, since these types of wallets are user-friendly: if you forget your password, you can typically have it reset. Also, if you don't have an individual XRP Ledger account, the ledger's reserve requirement doesn't apply to you. The custodian acts a buffer to any issues you run into on the XRP Ledger, and may offer support or assistance if you're not sure how to do something.

A non-custodial wallet, such as [XUMM](https://xumm.app/), is one where you have the secret keys to your account. This means you're ultimately responsible for managing the security of your account. If you lose your keys, you are locked out of your XRP Ledger account and there are no recovery options. However this also gives you far more freedoms. Since you're interacting directly with the XRP Ledger yourself, you can handle any type of transaction you want without anyone restricting your options. If the ledger allows it, you can do it. Non-custodial wallets also don't require you to trust an institution with your money, which can insulate you from market factors outside your control.

Users of both custodial and non-custodial wallets have to protect themselves from malicious users who might try to steal their funds. With a custodial wallet, you have to manage your login and password to the app or site; with a non-custodial wallet, you have to manage your secret keys to your on-ledger account. In both cases, the wallet provider's own security practices are also important to protect you from vulnerabilities like supply-chain attacks, where an attacker loads malicious code into the wallet through software updates or dependencies. However, custodial wallets can be a bigger target for attackers since they have immediate access to multiple customers' funds.


### Creating Your Own Wallet

The XRP Ledger is an opensource project with publicly available client libraries and API methods. While you can technically interact with the ledger using HTTP/WebSocket tools, it isn't practical for your day-to-day activities. You can create your own wallet to interact with the ledger, but you'll need to understand exactly how accounts, transactions, and the ledger work together before committing to this option.

See:
- [Accounts](accounts.md#addresses)
- [Cryptographic Keys](cryptographic-keys.md)
- [Client Libraries](client-libraries)
- [Ledgers](ledgers.md)
- [XRPL Quickstart](xrpl-quickstart)
- [Build a Desktop Wallet in Python](build-a-desktop-wallet-in-python)


### Hardware vs Software Wallets

Another deciding factor when choosing a wallet is picking between a hardware or software wallet. Hardware wallets are physical devices that store your private/secret keys. The main benefit of using hardware wallets is that you can secure your information by disconnecting it from the internet when it's not in use; hardware wallets totally isolate your keys from easier-to-hack computers or smartphones. Software wallets on the other hand, are entirely digitial. While this makes them easier to use it also makes them the less secure method of the two, but they usually come with additional features to enhance your experience. Ultimately, the decision between the two will come down to your comfort level and how much ease-of-use you need.


## Account Creation

Before creating an account, you must decide which XRP Ledger network to use. There are multiple networks for different use cases, but native XRP transactions only happen on `Mainnet`. See: [Parallel Networks](parallel-networks.md)

Most publicly available wallets offer the ability to create an account for you and can generate a public and private key. If they don't, you can create an account yourself, so long as it's [mathematically valid](accounts.md#creating-accounts). The client libraries also have methods for generating accounts.

An account isn't active on the XRP Ledger until it's been funded and meets the minimum [reserve requirements](reserves.md). If the wallet you're using doesn't offer the option to purchase XRP, you'll need to find a third party exchange to do so and send it to your account. Alternatively, someone you know can also send XRP to your account, using the [`payment` transaction](payment.md).

After funding your account, you should verify on the XRP Ledger itself that your account exists and is funded. The [XRPL Explorer](https://livenet.xrpl.org/) is a useful tool to look up your address and verify. You can also use the [`account_info`](account-info.md) command.


## Handling Payments


### Direct XRP Payments

Direct XRP payments is the simplest payment method. Unlike other payment methods that require multiple transactions to complete, direct XRP payments require only one, making this option great for day-to-day activity. If you're a merchant handling large volumes of transactions, this may be the right choice for you due to it being quick, simple, and having the lowest fees. See: [Direct XRP Payments](direct-xrp-payments).

A sender only needs to know the address of the receiver to make a direct XRP payment work.


### Cross-Currency Payments

The XRP Ledger enables you to make cross-currency payments of XRP and tokens. Cross-currency payments within the XRP Ledger are fully atomic, meaning the payment fully executes or no part of the payment executes at all.

Cross-currency payments deliver a fixed amount to their destination, but the sender can have a variable fee cost, depending on the paths taken to make the transaction work on the network. See: [Cross-currency Payments](cross-currency-payments.html).

This is a great payment option if you or the receiver prefer a specific token besides XRP.


<!-- Need a better understanding of Payment Channels use cases.

### Payment Channels

Payment Channels are an advanced feature for sending asynchronous XRP payments that can be divided into very small increments and settled later.

The XRP for a payment channel is set aside temporarily. The sender creates _Claims_ against the channel, which the recipient verifies without sending an XRP Ledger transaction or waiting for a new ledger version to be approved by consensus. (This is an _asynchronous_ process because it happens separate from the usual pattern of getting transactions approved by consensus.) At any time, the recipient can _redeem_ a Claim to receive an amount of XRP authorized by that Claim. Settling a Claim like this uses a standard XRP Ledger transaction, as part of the usual consensus process. This single transaction can encompass any number of transactions guaranteed by smaller Claims.

Because Claims can be verified individually but settled in bulk later, payment channels make it possible to conduct transactions at a rate only limited by the participants' ability to create and verify the digital signatures of those Claims. This limit is primarily based on the speed of the participants' hardware and the complexity of the signature algorithms. For maximum speed, use Ed25519 signatures, which are faster than the XRP Ledger's default secp256k1 ECDSA signatures. Research has demonstrated the ability to create over Ed25519 100,000 signatures per second and to verify over [70,000 per second](https://ed25519.cr.yp.to/ed25519-20110926.pdf) on commodity hardware in 2011.

Learn about [Payment Channels](payment-channels.html) on the XRP Ledger.

you may have circumstances where you want to go into contract with a contractor, but don't know the exact amount. This is common in situations such as home improvement projects where an estimate can be provided, but unforeseen circumstances can increase the final amount due. In these situations you can create a payment channel, which allocates (currently only XRP) to a payment channel. This amount would be the estimate the contractor gives you and can serve as their budget for the project. Each item they require payment for, you would submit a claim to the payment channel.

Repeating this process, you would eventually settle on the final amount due, where the contractor (payee) claims the final amount from the payment channel. This method of payment serves as a great way to track invdividual items payed for in large projects.

-->
