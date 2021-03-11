---
html: build-apps.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Learn the common patterns for building apps on the XRP Ledger.
cta_text: Build Apps
---

# Build Apps on the XRP Ledger


When you're working with the XRP Ledger, there are a few things you'll need to manage with your app or integration, whether you're adding XRP into your [wallet](xref: wallets.md), integrating with the [decentralized exchange](xref: decentralized-exchange.md), or [issuing and managing tokens](xref:issued-currencies.md). This tutorial walks you through the patterns common to all of these use cases and provides sample code for implementing them. 

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Generate keys.](#generate-keys)
2. [Connect to the XRP Ledger.](#connect)
3. [Query the XRP Ledger.](#query)
4. [Submit a transaction.](#submit-transaction) 
5. [Verify results.](#verify-results) 

**Tip:** These steps roughly correspond to the best practices described in the [reliable transaction submission guide](xref:reliable-transaction-submission.md). Refer to that before you start building for production. 

## Learning Goals

In this tutorial, you'll learn: 

* The basic building blocks of XRP Ledger-based applications.
* How to generate keys.
* How to connect to the XRP Ledger.
* How to submit a transaction, including preparing and signing it. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 

## Set up your environment

Requirements for setting up your environment vary depending on the programming lanuage and tools you choose to use in your project; see the docs for the tools and libaries for details specific to the framework you want to work with. 

Regardless of the tools you use, there are a few things you'll need to work with the XRP Ledger. Most available libraries provide built-in network clients and creating accounts. 


* **Network client** - You need a network client to query the XRP Ledger. SDKs and other libraries typically use the framework-native network modules. If you're only testing or exploring, you could use the [Websocket API](https://xrpl.org/websocket-api-tool.html) or [JSON-RPC](https://xrpl.org/xrp-ledger-rpc-tool.html) tools. 
* **[Account](xref: accounts.md)** -  If you want to interact with the Ledger by sumbitting transactions, you'll need an address, an XRP balance, and secret keys to manage the account. To get started on the Testnet or Devnet, you can use the [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html) to get an address, XRP balances, and keys. 


For library-specific requirements, see the README for each project:

* **JavaScript:** [ripple-lib](https://github.com/ripple/ripple-lib)
* **Python:** [xrpl-py](https://github.com/xpring-eng/xrpl-py)
* **Java:** [xrpl-4j](https://github.com/XRPLF/xrpl4j)

## Generate keys

You need [keys](https://xrpl.org/cryptographic-keys.html) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html).

Otherwise, you should take care to store your keys and set up a [secure signing method](https://xrpl.org/set-up-secure-signing.html). 

To generate keys, you can use any of the following methods:

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
seed = keypairs.generate_seed()
public, private = keypairs.derive_keypair(seed)
```

*JavaScript (ripple-lib)*

```javascript
return api.generateAddress();
```

*Java (xrpl4j)*

```java
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
SeedWalletGenerationResult seedWalletGenerationResult = walletFactory.randomWallet(true);
```

<!-- MULTICODE_BLOCK_END -->


## Connect

To make queries that you can use in your app and submit transactions, you need to establish a connection to the XRP Ledger. There are a few ways to do this. The following sections describe each option in more detail. 

**Warning:**  Never use publicly available servers to sign transactions. For more information about security and signing, see [](xref: set-up-secure-signing.md).

If you only want to explore the XRP Ledger, you can  use the [Ledger Explorer](https://livenet.xrpl.org/) to see the Ledger progress in real-time and dig into specific accounts or transactions. 


<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
client = JsonRpcClient(http://s1.ripple.com:51234/)
```

*JavaScript (ripple-lib)*

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

*Java (xrpl4j)*

```java
private final XrplClient xrplClient = new XrplClient(HttpUrl.parse("https://s1.ripple.com:51234"));
```

<!-- MULTICODE_BLOCK_END -->


### Other connection options


#### Connect via Core Server

The XRP Ledger's core server software, [`rippled`](the-rippled-server.html), natively exposes several interfaces that you can access by connecting to [publicly available servers](xref: get-started-with-the-rippled-api.md#public-servers) or running your own server. These interfaces include:

* [JSON-RPC](xref: get-started-with-the-rippled-api.md#json-rpc) - If you're familiar with RESTful APIs, this interface will be the most familiar to you. You can use standard HTTP clients (like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or [RESTED for Firefox](https://addons.mozilla.org/en-US/firefox/addon/rested/)) to make calls via this interface. 
* [WebSocket API](xref:get-started-with-the-rippled-api.md#websocket-api) - 

For a complete list of these interfaces and their associated methods, see [](xref: get-started-with-the-rippled-api.md). 


## Query

Before you submit a transaction to the XRP Ledger, you should query it to check your account status and balances to make sure that the transaction will succeed. 

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
account_info = RequestMethod.ACCOUNT_INFO(rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe)
```

*JavaScript (ripple-lib)*

```js
const myAddress = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe';

console.log('getting account info for', myAddress);
return api.getAccountInfo(myAddress);
```

*Java (xrpl4j)*

```java
 AccountInfoResult accountInfo = this.scanForResult(() -> this.getValidatedAccountInfo(wallet.classicAddress()));
    assertThat(accountInfo.status()).isNotEmpty().get().isEqualTo("success");
```

<!-- MULTICODE_BLOCK_END -->


## Submit transaction

When you're ready 

### Prepare transaction

### Sign transaction

## Verify results




