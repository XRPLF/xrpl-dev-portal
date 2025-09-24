---
seo:
    description: Build an entry-level JavaScript application for querying the XRP Ledger.
top_nav_name: JavaScript
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/javascript.svg
---

{% code-walkthrough
  filesets=[
    { 
      "files": ["/_code-samples/get-started/js/get-acct-info.js"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/js/package.json", "/_code-samples/get-started/js/get-acct-info.js", "/_code-samples/get-started/js/README.md"],
      "when": { "environment": "Node" }
    },
    { 
      "files": ["/_code-samples/get-started/js/index.html"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/js/index.html", "/_code-samples/get-started/js/README.md"],
      "when": { "environment": "Web" }
    }
  ]
  filters={
    "environment": {
      "label": "Environment",
      "items": [
        { "value": "Node" },
        { "value": "Web" },
      ]
    }
  }
%}

# Get Started Using JavaScript Library

This tutorial guides you through the basics of building an XRP Ledger-connected application in JavaScript using the [`xrpl.js`](https://github.com/XRPLF/xrpl.js/) client library in either Node.js or web browsers.

## Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl.js`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl.js`.
- How to use the `xrpl.js` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a JavaScript app or web-app.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- Have some familiarity with writing code in JavaScript.
- Have installed Node.js **version 20** or later in your development environment.
- If you want to build a web application, any modern web browser with JavaScript support should work fine.

## Source Code

Click **Download** on the top right of the code preview panel to download the source code.

## Steps

Follow the steps to create a simple application with `xrpl.js`.

### 1. Install Dependencies

<!-- Web steps -->
{% step id="import-web-tag" when={ "environment": "Web" } %}
To load `xrpl.js` into your project, add a `<script>` tag to your HTML.

You can load the library from a CDN as in the example, or download a release and host it on your own website.

This loads the module into the top level as `xrpl`.
{% /step %}

<!-- Node.js steps -->
{% step id="install-node-tag" when={ "environment": "Node" } %}

Start a new project by creating an empty folder, then move into that folder and use [NPM](https://www.npmjs.com/) to install the latest version of xrpl.js:

```sh
npm install xrpl
```

This updates your `package.json` file, or creates a new one if it didn't already exist.

Your `package.json` file should look something like this:

{% code-snippet file="/_code-samples/get-started/js/package.json" language="json" /%}
{% /step %}

### 2. Connect to the XRP Ledger

{% step id="connect-tag" %}
#### Connect to the XRP Ledger Testnet

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl.js`, you create an instance of the `Client` class and use the `connect()` method.

{% admonition type="success" name="Tip" %}Many network functions in `xrpl.js` use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to return values asynchronously. The code samples here use the [`async/await` pattern](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) to wait for the actual result of the Promises.{% /admonition %}

The sample code shows you how to connect to the Testnet, which is one of the available [parallel networks](../../../concepts/networks-and-servers/parallel-networks.md).
{% /step %}

{% step id="connect-mainnet-tag"%}
#### Connect to the XRP Ledger Mainnet

 When you're ready to move to production, you'll need to connect to the XRP Ledger Mainnet. You can do that in two ways:

- By [installing the core server](../../../infrastructure/installation/index.md) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

    ```javascript
    const MY_SERVER = "ws://localhost:6006/"
    const client = new xrpl.Client(MY_SERVER)
    await client.connect()
    ```

    See the example [core server config file](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

- By using one of the available [public servers][]:

    ```javascript
    const PUBLIC_SERVER = "wss://xrplcluster.com/"
    const client = new xrpl.Client(PUBLIC_SERVER)
    await client.connect()
    ```
{% /step %}

### 3. Get Account

{% step id="get-account-create-wallet-tag" %}
#### Create and Fund a Wallet

The `xrpl.js` library has a `Wallet` class for handling the keys and address of an XRP Ledger account. On Testnet, you can fund a new account as shown in the example.
{% /step %}

{% step id="get-account-create-wallet-b-tag" %}
#### (Optional) Generate a Wallet Only

If you want to generate a wallet without funding it, you can create a new `Wallet` instance. Keep in mind that you need to send XRP to the wallet for it to be a valid account on the ledger.
{% /step %}

{% step id="get-account-create-wallet-c-tag" %}
#### (Optional) Use Your Own Wallet Seed

To use an existing wallet seed encoded in [base58][], you can create a `Wallet` instance from it.
{% /step %}

### 4. Query the XRP Ledger

{% step id="query-xrpl-tag" %}
Use the Client's `request()` method to access the XRP Ledger's [WebSocket API](../../../references/http-websocket-apis/api-conventions/request-formatting.md).
{% /step %}

### 5. Listen for Events

{% step id="listen-for-events-tag" %}
You can set up handlers for various types of events in `xrpl.js`, such as whenever the XRP Ledger's [consensus process](../../../concepts/consensus-protocol/index.md) produces a new [ledger version](../../../concepts/ledgers/index.md). To do that, first call the [subscribe method][] to get the type of events you want, then attach an event handler using the `on(eventType, callback)` method of the client.
{% /step %}

### 6. Disconnect

{% step id="disconnect-node-tag" when={ "environment": "Node" } %}
Disconnect when done so Node.js can end the process. The example code waits 10 seconds before disconnecting to allow time for the ledger event listener to receive and display events.
{% /step %}

{% step id="disconnect-web-tag" when={ "environment": "Web" } %}
Disconnect from the ledger when done. The example code waits 10 seconds before disconnecting to allow time for the ledger event listener to receive and display events.
{% /step %}

### 7. Run the Application

{% step id="run-app-node-tag" when={ "environment": "Node" } %}
Finally, in your terminal, run the application like so:

```sh
node get-acct-info.js
```

You should see output similar to the following:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Wallet: rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i
Balance: 10

Account Testnet Explorer URL: 
https://testnet.xrpl.org/accounts/rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i

Getting account info...
{
  "api_version": 2,
  "id": 4,
  "result": {
    "account_data": {
      "Account": "rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i",
      "Balance": "10000000",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 0,
      "PreviousTxnID": "0FF9DB2FE141DD0DF82566A171B6AF70BB2C6EB6A53D496E65D42FC062C91A78",
      "PreviousTxnLgrSeq": 9949268,
      "Sequence": 9949268,
      "index": "4A9C9220AE778DC38C004B2B17A08E218416D90E01456AFCF844C18838B36D01"
    },
    "account_flags": {
      "allowTrustLineClawback": false,
      "defaultRipple": false,
      "depositAuth": false,
      "disableMasterKey": false,
      "disallowIncomingCheck": false,
      "disallowIncomingNFTokenOffer": false,
      "disallowIncomingPayChan": false,
      "disallowIncomingTrustline": false,
      "disallowIncomingXRP": false,
      "globalFreeze": false,
      "noFreeze": false,
      "passwordSpent": false,
      "requireAuthorization": false,
      "requireDestinationTag": false
    },
    "ledger_hash": "304C7CC2A33B712BE43EB398B399E290C191A71FCB71784F584544DFB7C441B0",
    "ledger_index": 9949268,
    "validated": true
  },
  "type": "response"
}

Listening for ledger close events...
Ledger #9949269 validated with 0 transactions!
Ledger #9949270 validated with 0 transactions!
Ledger #9949271 validated with 0 transactions!

Disconnected
```
{% /step %}

{% step id="run-app-web-tag" when={ "environment": "Web" } %}
Open the `index.html` file in a web browser.

You should see output similar to the following:

```text
Connected to Testnet
Creating a new wallet and funding it with Testnet XRP...
Wallet: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S
Balance: 10
View account on XRPL Testnet Explorer: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S

Getting account info...
{
  "api_version": 2,
  "id": 5,
  "result": {
    "account_data": {
      "Account": "rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S",
      "Balance": "10000000",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 0,
      "PreviousTxnID": "96E4B44F93EC0399B7ADD75489630C6A8DCFC922F20F6810D25490CC0D3AA12E",
      "PreviousTxnLgrSeq": 9949610,
      "Sequence": 9949610,
      "index": "B5D2865DD4BF8EEDFEE2FD95DE37FC28D624548E9BBC42F9FBF61B618E98FAC8"
    },
    "account_flags": {
      "allowTrustLineClawback": false,
      "defaultRipple": false,
      "depositAuth": false,
      "disableMasterKey": false,
      "disallowIncomingCheck": false,
      "disallowIncomingNFTokenOffer": false,
      "disallowIncomingPayChan": false,
      "disallowIncomingTrustline": false,
      "disallowIncomingXRP": false,
      "globalFreeze": false,
      "noFreeze": false,
      "passwordSpent": false,
      "requireAuthorization": false,
      "requireDestinationTag": false
    },
    "ledger_hash": "7692673B8091899C3EEE6807F66B65851D3563F483A49A5F03A83608658473D6",
    "ledger_index": 9949610,
    "validated": true
  },
  "type": "response"
}

Listening for ledger close events...
Ledger #9949611 validated with 0 transactions
Ledger #9949612 validated with 1 transactions
Ledger #9949613 validated with 0 transactions

Disconnected
```
{% /step %}

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [Client Libraries](../../../references/client-libraries.md)
- **Tutorials:**
    - [Send XRP](../../how-tos/send-xrp.md)
    - [Issue a Fungible Token](../../how-tos/use-tokens/issue-a-fungible-token.md)
    - [Set up Secure Signing](../../../concepts/transactions/secure-signing.md)
- **References:**
    - [`xrpl.js` Reference](https://js.xrpl.org/)
    - [Public API Methods](../../../references/http-websocket-apis/public-api-methods/index.md)
    - [API Conventions](../../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 Encodings](../../../references/protocol/data-types/base58-encodings.md)
    - [Transaction Formats](../../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

{% /code-walkthrough %}
