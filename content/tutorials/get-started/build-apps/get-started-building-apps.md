---
html: get-started-building-apps.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Build Apps
blurb: Learn the common patterns for building apps on the XRP Ledger.
cta_text: Build Apps
filters:
    - interactive_steps
    - include_code
---

# Build Apps on the XRP Ledger


When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP into your [wallet](wallets.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](issued-currencies.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

This guide walks you through the patterns common to all of these use cases and provides sample code for implementing each of them. 

Here are the basic steps you’ll need to cover for almost any XRP Ledger project:

Here are the basic steps you'll need to cover for almos

1. [Set up your environment](#1-set-up-your-environment)
1. [Connect to the XRP Ledger.](#2-connect-to-the-xrp-ledger)
1. [Generate a wallet.](#3-generate-wallet)
1. [Query the XRP Ledger.](#4-query-the-xrp-ledger)
1. [Submit a transaction.](#5-submit-transaction~) 
1. [Verify results.](#6-verify-results)
1. [Process transactions.](#7-process-transactions)
1. [Use the DEX.](#8-use-the-dex)
1. [Get ready for production](#9-get-ready-for-production)


## Learner Level

Beginner

## Time to Complete

Two hours. 

## Learning Goals

In this tutorial, you’ll learn: 

* The basic building blocks of XRP Ledger-based applications.
* How to generate keys.
* How to connect to the XRP Ledger.
* How to submit a transaction, including preparing and signing it. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 

## Set up your environment

Requirements for setting up your environment vary depending on the programming lanuage and tools you choose to use in your project; see the docs for the tools and libaries for details specific to the framework you want to work with. 

Regardless of the tools you use, there are a few things you’ll need to work with the XRP Ledger. Most available libraries provide built-in network clients and creating accounts. 


* **Network client** - You need a network client to query the XRP Ledger. SDKs and other libraries typically use the framework-native network modules. If you’re only testing or exploring, you could use the [Websocket API](~https://xrpl.org/websocket-api-tool.html~) or [JSON-RPC](~https://xrpl.org/xrp-ledger-rpc-tool.html~) tools. 
*  [Account](xref: accounts.md)  -  If you want to interact with the Ledger by sumbitting transactions, you’ll need an address, an XRP balance, and secret keys to manage the account. To get started on the Testnet or Devnet, you can use the [XRP Faucets](~https://xrpl.org/xrp-testnet-faucet.html~) to get an address, XRP balances, and keys. 


For library-specific requirements, see the README for each project:

* **JavaScript:** [ripple-lib](~https://github.com/ripple/ripple-lib~)
* **Python:** [xrpl-py](~https://github.com/xpring-eng/xrpl-py~)
* **Java:** [xrpl-4j](~https://github.com/XRPLF/xrpl4j~)


### {{n.next()}}. Connect to the XRP Ledger

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. To do this 
with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.
html):

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Define the network client", 
end_before="# Create a wallet using the testnet faucet:", language="py") }}


*JavaScript (ripple-lib)*

*Java (xrpl-4j)*


<!-- MULTICODE_BLOCK_END -->


#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the 
available [parallel networks](parallel-networks.html). When you're ready to integrate with the production 
XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself (the core 
server connects to the Mainnet by default and you can [change the configuration to use an altnet]
(connect-your-rippled-to-the-xrp-test-net.html) ). [There are good reasons to run your own core server]
(the-rippled-server.html#reasons-to-run-your-own-server). If you run your own server, you can coconnect to 
it like so:

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "http://localhost:5005/"
        client = JsonRpcClient(JSON_RPC_URL)

    See the example [core server config file](https://github.com/ripple/rippled/blob/
c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about 
default values.

* By using one of the [available public servers](get-started-with-the-rippled-api.html#public-servers):

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "https://s2.ripple.com:51234/"
        client = JsonRpcClient(JSON_RPC_URL)


### {{n.next()}}. Generate wallet

To store value and execute transactions on the XRP Ledger, you need to create a wallet: a [set of keys]
(cryptographic-keys.html#key-components) and an [address](accounts.html#addresses) that's been [funded with 
enough XRP](accounts.html#creating-accounts) to meet the [account reserve](reserves.html). The address is 
the identifier of your account and you use the [private key](cryptographic-keys.html#private-key) to sign 
transactions that you submit to the XRP Ledger.


For testing and development purposes, you can use the [XRP Faucets](xrp-testnet-faucet.html) to generate 
keys and fund the account on the Testnet or Devnet. For production purposes, you should take care to store 
your keys and set up a [secure signing method](set-up-secure-signing.html).


To make it easy to create a wallet on the Testnet, `xrpl-py` provides the [`generate_faucet_wallet`](https://
xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method:



{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Create a wallet using the testnet 
faucet:", end_before="# Create an account str from the wallet", language="py") }}


This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.
html#xrpl.wallet.Wallet):


```py
print(test_wallet)

# print output
public_key:: 022FA613294CD13FFEA759D0185007DBE763331910509EF8F1635B4F84FA08AEE3
private_key:: -HIDDEN-
classic_address: raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q
```

## Generate keys

You need [keys](~https://xrpl.org/cryptographic-keys.html~) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](~https://xrpl.org/xrp-testnet-faucet.html~).

Otherwise, you should take care to store your keys and set up a [secure signing method](~https://xrpl.org/set-up-secure-signing.html~). 

To generate keys, you can use any of the following methods:

<!— MULTICODE_BLOCK_START —>

**Python (xrpl-py)**

```py
seed = keypairs.generate_seed()
public, private = keypairs.derive_keypair(seed)
```

**JavaScript (ripple-lib)**

```javascript
return api.generateAddress();
```

**Java (xrpl4j)**

```java
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
SeedWalletGenerationResult seedWalletGenerationResult = walletFactory.randomWallet(true);
```

<!— MULTICODE_BLOCK_END —>


**## Connect**

To make queries that you can use in your app and submit transactions, you need to establish a connection to the XRP Ledger. There are a few ways to do this. The following sections describe each option in more detail. 

****Warning:****  Never use publicly available servers to sign transactions. For more information about security and signing, see [](xref: set-up-secure-signing.md).

If you only want to explore the XRP Ledger, you can  use the [Ledger Explorer](~https://livenet.xrpl.org/~) to see the Ledger progress in real-time and dig into specific accounts or transactions. 


<!— MULTICODE_BLOCK_START —>

**Python (xrpl-py)**

```py
client = JsonRpcClient(http://s1.ripple.com:51234/)
```

**JavaScript (ripple-lib)**

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

**Java (xrpl4j)**

```java
private final XrplClient xrplClient = new XrplClient(HttpUrl.parse("https://s1.ripple.com:51234"));
```

<!— MULTICODE_BLOCK_END —>


**### Other connection options**


**#### Connect via Core Server**

The XRP Ledger’s core server software, [`rippled`](~the-rippled-server.html~), natively exposes several interfaces that you can access by connecting to [publicly available servers](xref: get-started-with-the-rippled-api.md#public-servers) or running your own server. These interfaces include:

* [JSON-RPC](xref: get-started-with-the-rippled-api.md#json-rpc) - If you’re familiar with RESTful APIs, this interface will be the most familiar to you. You can use standard HTTP clients (like [Postman](~https://www.postman.com/~), [Insomnia](~https://insomnia.rest/~), or [RESTED for Firefox](~https://addons.mozilla.org/en-US/firefox/addon/rested/~)) to make calls via this interface. 
* [WebSocket API](~xref:get-started-with-the-rippled-api.md#websocket-api~) - 

For a complete list of these interfaces and their associated methods, see [](xref: get-started-with-the-rippled-api.md). 


**## Query**

Before you submit a transaction to the XRP Ledger, you should query it to check your account status and balances to make sure that the transaction will succeed. 

<!— MULTICODE_BLOCK_START —>

**Python (xrpl-py)**

```py
account_info = RequestMethod.ACCOUNT_INFO(rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe)
```

**JavaScript (ripple-lib)**

```js
const myAddress = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe';

console.log('getting account info for', myAddress);
return api.getAccountInfo(myAddress);
```

**Java (xrpl4j)**

```java
 AccountInfoResult accountInfo = this.scanForResult(() -> this.getValidatedAccountInfo(wallet.classicAddress()));
    assertThat(accountInfo.status()).isNotEmpty().get().isEqualTo("success");
```

<!— MULTICODE_BLOCK_END —>


## Submit transaction

When you’re ready 

### Prepare transaction

### Sign transaction

## Verify results







#work/xrpl