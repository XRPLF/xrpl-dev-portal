---
html: get-started-using-node-js.html
parent: get-started.html
blurb: Build an entry-level JavaScript application for querying the XRP Ledger in Node.js.
top_nav_name: JavaScript
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/javascript.svg
---
# Get Started Using JavaScript

This tutorial guides you through the basics of building an XRP Ledger-connected application in JavaScript or TypeScript using the [xrpl.js](https://github.com/XRPLF/xrpl.js/) client library in Node.js.

The scripts and config files used in this guide are [available in this website's GitHub Repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/rippleapi_quickstart).


## Learning goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using xrpl.js.
* How to generate a wallet on the [Testnet](xrp-testnet-faucet.html) using xrpl.js.
* How to use the xrpl.js library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a simple JavaScript app or web-app.


## Requirements

The xrpl.js library is intended for use with Node.js version 14. It may work with other versions, but they aren't regularly tested. If you have Node.js installed, you can check the version of the `node` binary from a command line:

```sh
node --version
```

On some platforms, the binary is named `nodejs` instead:

```sh
nodejs --version
```



## Install with npm

Start a new project by creating an empty folder, then change into that folder and use NPM to install the latest version of xrpl.js:

```sh
npm install xrpl
```


## Start building

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP into your [wallet](wallets.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](issued-currencies.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
1. [Generate a wallet.](#2-generate-wallet)
1. [Query the XRP Ledger.](#3-query-the-xrp-ledger)


### 1. Connect to the XRP Ledger

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. To do this with xrpl.js, you create an instance of the `Client` class and use the `connect()` method.

**Tip:** Many network functions in xrpl.js use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to return values asynchronously. The code samples here use the [`async/await` pattern](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) to wait for the actual result of the Promises.

```js
// Import the library
const xrpl = require("xrpl")

// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const SERVER_URL = "https://s.altnet.rippletest.net:51234/"
  const client = new xrpl.Client(SERVER_URL)
  await client.connect()

  // ... custom code goes here

  // Disconnect when done so Node.js can end the process
  client.disconnect()
}

main()
```

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the available [parallel networks](parallel-networks.html). When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](connect-your-rippled-to-the-xrp-test-net.html). [There are good reasons to run your own core server](the-rippled-server.html#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

        const MY_SERVER = "ws://localhost:6006/"
        const client = new xrpl.Client(MY_SERVER)
        await client.connect()

    See the example [core server config file](https://github.com/ripple/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

        const PUBLIC_SERVER = "wss://xrplcluster.com/"
        const client = new xrpl.Client(PUBLIC_SERVER)
        await client.connect()


### 2. Generate Wallet

The xrpl.js library has a Wallet class for handling the keys and address of an XRP Ledger account. On Testnet, you can fund a new wallet like this:

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Create a wallet", end_before="// Get info", language="js") }}

If you just want to generate keys, you can create a new Wallet instance like this:

```js
const test_wallet = new xrpl.Wallet()
```

Or, if you already have a seed encoded in [base58][], you can instantiate a Wallet from it like this:

```js
const test_wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9") // Test secret; don't use for real
```

### 3. Query the XRP Ledger

Use the Client's `request()` method to access the XRP Ledger's [WebSocket API](https://xrpl.org/request-formatting.html). For example:

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Get info", end_before="// Listen to ledger close events", language="js") }}


### 4. Listen for Events

You can set up handlers for various types of events in xrpl.js, such as whenever the XRP Ledger's [consensus process](intro-to-consensus.html) produces a new [ledger version](ledgers.html). To do that, first call the [subscribe method][] to get the type of events you want, then attach an event handler using the `on(eventType, callback)` method of the client.

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Listen to ledger close events", end_before="// Disconnect when done", language="js") }}


## Keep on Building

Now that you know how to use xrpl.js to connect to the XRP Ledger, generate a wallet, and look up information about an account, you can also:

* [Send XRP](send-xrp.html).
* [Issue a Fungible Token](issue-a-fungible-token.html)
* [Set up secure signing](set-up-secure-signing.html) for your account.


## See Also

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Client Libraries](client-libraries.html)
- **Tutorials:**
    - [Send XRP](send-xrp.html)
- **References:**
    - [xrpl.js Reference](TODO: final link for new reference docs)
    - [Public API Methods](public-rippled-methods.html)
    - [API Conventions](api-conventions.html)
        - [base58 Encodings](base58-encodings.html)
    - [Transaction Formats](transaction-formats.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
