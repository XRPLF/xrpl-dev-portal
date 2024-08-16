---
html: crypto-wallets.html
parent: intro-to-xrpl.html
seo:
    description: Wallets provide a convenient way of managing your XRP on the XRP Ledger.
labels:
  - Blockchain
---
# Crypto Wallets

Crypto wallets provide a way to manage your account and funds on the XRP Ledger. There are many wallets to choose from. Choosing the right wallet ultimately comes down to your needs and comfort working with XRP.


## Custodial vs Non-custodial Wallets

A major factor when choosing a wallet is if you want a custodial or non-custodial wallet.

A custodial wallet means a third party holds your funds, typically on an account they manage on the XRP Ledger. A custodial wallet can be thought of like a bank, where you're trusting another entity to keep your money secure. Many centralized exchanges offer custodial wallets, so when you create an account with them and use their app, you don't technically have an account on the ledger.

For day-to-day payments, this may be preferable, since these types of wallets are user-friendly: if you forget your password, you can typically have it reset. Also, if you don't have an individual XRP Ledger account, the ledger's reserve requirement doesn't apply to you. The custodian acts a buffer to any issues you run into on the XRP Ledger, and may offer support or assistance if you're not sure how to do something.

![Custodial vs. Non-custodial Wallets](/docs/img/introduction15-custodial-non-custodial.png)

A non-custodial wallet, such as [Xaman](https://Xaman.app/), is one where you have the secret keys to your account. This means you're ultimately responsible for managing the security of your account.

**Caution:** If you lose your keys, you are locked out of your XRP Ledger account and there are no recovery options.

Non-custodial wallets allow more freedom. Since you're interacting directly with the XRP Ledger yourself, you can handle any type of transaction you want without anyone restricting your options. If the ledger allows it, you can do it. Non-custodial wallets also don't require you to trust an institution with your money, which can insulate you from market factors outside your control.

Users of both custodial and non-custodial wallets have to protect themselves from malicious users who might try to steal their funds. With a custodial wallet, you have to manage your login and password to the app or site; with a non-custodial wallet, you have to manage your secret keys to your on-ledger account. In both cases, the wallet provider's own security practices are also important to protect you from vulnerabilities like supply-chain attacks, where an attacker loads malicious code into the wallet through software updates or dependencies. However, custodial wallets can be a bigger target for attackers since they have immediate access to multiple customers' funds.


## Hardware vs Software Wallets

Another deciding factor when choosing a wallet is picking between a hardware or software wallet.

Hardware wallets are physical devices that store your private/secret keys. The main benefit of using hardware wallets is that you can secure your information by disconnecting it from the internet when it's not in use; hardware wallets totally isolate your keys from easier-to-hack computers or smartphones.

![Hardware vs. Software Wallets](/docs/img/introduction16-hardware-software.png)

Software wallets on the other hand, are entirely digital. While this makes them easier to use, it also makes them the less secure method of the two, but they usually come with additional features to enhance your experience. Ultimately, the decision between the two will come down to your comfort level and how important ease-of-use is to you.


## Creating Your Own Wallet

The XRP Ledger is an opensource project with publicly available client libraries and API methods. While you can technically interact with the ledger using HTTP/WebSocket tools, it isn't practical for day-to-day use. You can create your own wallet to interact with the ledger, but you'll need to understand exactly how accounts, transactions, and the ledger work together before committing to this option.


Next: [Transactions and Requests](transactions-and-requests.md)
