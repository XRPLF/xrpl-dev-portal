---
html: connect-metamask-to-xrpl-evm-sidechain.html
parent: get-started-evm-sidechain.html
blurb: Learn how to connect MetaMask wallet to the EVM Sidechain for the XRP Ledger.
labels:
  - Development, Interoperability
status: not_enabled
---
# Connect MetaMask to XRP Ledger Sidechain

MetaMask is an extension for accessing Harmony-enabled distributed applications (_dapps_) from your browser. The extension injects the XRP Ledger EVM sidechain Web3 API into every website's Javascript context, so that Web3 applications can read from the blockchain.
This tutorial walks through the process of installing MetaMask, configuring it on the XRP Ledger EVM sidechain network, and importing an existing account using a previously generated private key.

## 1. Installing MetaMask

Install the MetaMask extension on your browser from **[https://metamask.io/download/](https://metamask.io/download/)**. The extension supports most desktop browsers. 

## 2. Create an account on MetaMask

To create a new account on MetaMask, click the icon on top as shown in the image below and then click **Create Account**.

![Create an account on MetaMask](img/evm-sidechain-create-metamask-account.png "Create an account on MetaMas"k")

Enter a name for the account and then click **Create** to create an account.

### 3. Adding XRP Ledger EVM Sidechain to Metamask

Open the MetaMask extension, click the list of networks at the top, then click **Add network**.

![Add the EVM Sidechain network to MetaMask](img/evm-sidechain-add-metamask-network.png "Add the EVM Sidechain network to MetaMask")

### 4. Enter Endpoint Information

To add a network manually, enter the network informaton. The fields displayed on screen may vary depending on the network.  

To connect to the XRP Ledger Devnet, enter the following information: 

* **Network Name**: XRP Ledger EVM Sidechain
* **New RPC URL**: https://rpc.evm-sidechain.xrpl.org
* **Chain ID**: 1440001
* **Currency Symbol**: XRP
* **Block Explorer**: https://evm-sidechain.xrpl.org