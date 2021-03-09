# Get Started Building Apps on the XRP Ledger


When you're working with the XRP Ledger, there are a few things you'll need to manage with your app or integration, whether you're adding XRP into your [wallet](xref: wallets.md), integrating with the [decentralized exchange](xref: decentralized-exchange.md), or [issuing and managing tokens](xref:issued-currencies.md). This tutorial walks you through these common patterns and provides sample code for implementing them. 

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Generate keys.](#generate-keys)
2. [Connect to the XRP Ledger.](#connect)
3. [Query the XRP Ledger.](#query)
4. [Submit a transaction.](#submit-transaction) 
5. [Verify results.](#verify-results) 

**Tip:** These steps roughly correspond to the best practices described in the [reliable transaction submission guide](xref:reliable-transaction-submission.md). 


## Set up your environment

Requirements for setting up your environment vary depending on the programming lanuage and tools you choose to use in your project; see the docs for the tools and libaries for details specific to the framework you want to work with. 

But regardless of the tools you use, there are a few things you'll need to work with the XRP Ledger.

* Network client - You need a network client to query the XRP Ledger. SDKs and other libraries typically use the framework-native network modules for network connections. If you're only testing or exploring, you could use the [Websocket API](https://xrpl.org/websocket-api-tool.html) or [JSON-RPC](https://xrpl.org/xrp-ledger-rpc-tool.html) tools. 
* [Account](xref: accounts.md) -  If you want to interact with the Ledger by sumbitting transactions, you'll need an address, an XRP balance, and secret keys to manage the account. To get started on the Testnet or Devnet, you can use the [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html) to get an address, XRP balances, and keys. 


For library-specific requirements, see the README for each project:

* [ripple-lib](https://github.com/ripple/ripple-lib) (JavaScript)
* [xrpl-py](https://github.com/xpring-eng/xrpl-py) (Python)
* [xrpl-4j](https://github.com/XRPLF/xrpl4j) (Java)

## Generate keys

You need [keys](https://xrpl.org/cryptographic-keys.html) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html).

Otherwise, you should take care to store your keys and set up a [secure signing method](https://xrpl.org/set-up-secure-signing.html). 

To generate keys, you can use any of the following methods:

<!-- MULTICODE_BLOCK_START -->

*JavaScript (ripple-lib)*

```
return api.generateAddress();
```

*Python (xrpl-py)*

```
seed = keypairs.generate_seed()
public, private = keypairs.derive_keypair(seed)
```

*Java (xrpl4j)*

```
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
SeedWalletGenerationResult seedWalletGenerationResult = walletFactory.randomWallet(true);
```

<!-- MULTICODE_BLOCK_END -->


## Connect

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. 

## Query

## Submit transaction

## Verify results




