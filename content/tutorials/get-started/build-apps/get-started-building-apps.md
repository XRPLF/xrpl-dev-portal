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

# Get Started Building Apps

| | | 
|-------------------|----------|
| **Learner Level** | Beginner |
| **Time to Complete** | Two hours |
| **Languages** | Python, JavaScript, Java | 

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP into your [wallet](wallets.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](issued-currencies.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

This guide walks you through the patterns common to all of these use cases and provides sample code for implementing each of them. 

Here are the basic steps you’ll need to cover for almost any XRP Ledger project:


1. [Set up your environment](#1-set-up-your-environment)
1. [Connect to the XRP Ledger.](#2-connect-to-the-xrp-ledger)
1. [Generate a wallet.](#3-generate-wallet)
1. [Query the XRP Ledger.](#4-query-the-xrp-ledger)
1. [Submit a transaction.](#5-submit-transaction~) 
1. [Verify results.](#6-verify-results)
1. [Process transactions.](#7-process-transactions)
1. [Configure accounts.](#8-configure-accounts)
1. [Use the DEX.](#9-use-the-dex)
1. [Get ready for production](#10-get-ready-for-production)


## Learning Goals

In this tutorial, you’ll learn: 

* The basic building blocks of XRP Ledger-based applications.
* How to generate keys.
* How to connect to the XRP Ledger.
* How to submit a transaction, including preparing and signing it. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 


## Set up your environment
{% set n = cycler(* range(1,99)) %}


Requirements for setting up your environment vary depending on the programming lanuage and tools you choose to use in your project; see the docs for the tools and libaries for details specific to the framework you want to work with. 

Regardless of the tools you use, there are a few things you’ll need to work with the XRP Ledger. Most available libraries provide built-in network clients and creating accounts. 


For library-specific requirements, see the README for each project:

* **JavaScript:** [ripple-lib](~https://github.com/ripple/ripple-lib~)
* **Python:** [xrpl-py](~https://github.com/xpring-eng/xrpl-py~)
* **Java:** [xrpl-4j](~https://github.com/XRPLF/xrpl4j~)


## {{n.next()}}. Connect to the XRP Ledger

||
|----------|
|**Learn more:**  [Connect to the ledger](connect-to-ledger.html)|


To make queries and submit transactions, you need to establish a connection to the XRP Ledger.


<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Define the network client", 
end_before="# Create a wallet using the testnet faucet:", language="py") }}


*JavaScript (ripple-lib)*

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

*Java (xrpl-4j)*

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

<!-- MULTICODE_BLOCK_END -->


### {{n.next()}}. Generate wallet


||
|----------|
|**Learn more:**  [Generate a wallet](generate-a-wallet.html)|

To store value and execute transactions on the XRP Ledger, you need to create a wallet.

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Create a wallet using the testnet faucet:", end_before="# Create an account str from the wallet", language="py") }}

*JavaScript (ripple-lib)*

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

*Java (xrpl-4j)*

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

<!-- MULTICODE_BLOCK_END -->



## {{n.next()}}. Query the ledger

||
|----------|
|**Learn more:**  [Query the ledger](query-the-ledger.html)|

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


## {{n.next()}}. Submit transaction

You submit transactions to the XRP Ledger to create new records on it. 


## {{n.next()}}. Verify results

## {{n.next()}}. Process transactions

## {{n.next()}}. Configure accounts

## {{n.next()}}. Use the DEX

## {{n.next()}}. Get ready for production


