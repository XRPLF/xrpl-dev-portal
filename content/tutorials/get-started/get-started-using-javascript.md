---
html: get-started-using-javascript.html
parent: get-started.html
blurb: Build an entry-level JavaScript application for querying the XRP Ledger.
top_nav_name: JavaScript
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/javascript.svg
---
# Get Started Using JavaScript

This tutorial guides you through the basics of building an XRP Ledger-connected application in JavaScript or TypeScript using the [`xrpl.js`](https://github.com/XRPLF/xrpl.js/) client library in either Node.js or web browsers.

The scripts and config files used in this guide are [available in this website's GitHub Repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/get-started/js/).


## Learning Goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using `xrpl.js`.
* How to get an account on the [Testnet](xrp-testnet-faucet.html) using `xrpl.js`.
* How to use the `xrpl.js` library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a JavaScript app or web-app.


## Requirements

To follow this tutorial, you should have some familiarity with writing code in JavaScript and managing small JavaScript projects. In browsers, any modern web browser with JavaScript support should work fine. In Node.js, **version 14** is recommended. Node.js versions 12 and 16 are also regularly tested.


## Install with npm

Start a new project by creating an empty folder, then move into that folder and use [NPM](https://www.npmjs.com/) to install the latest version of xrpl.js:

```sh
npm install xrpl
```


## Start Building

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](accounts.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](tokens.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are some steps you use in many XRP Ledger projects:

1. [Import the library.](#1-import-the-library)
1. [Connect to the XRP Ledger.](#2-connect-to-the-xrp-ledger)
1. [Get an account.](#3-get-account)
1. [Query the XRP Ledger.](#4-query-the-xrp-ledger)
1. [Listen for Events.](#5-listen-for-events)

### 1. Import the Library

How you load `xrpl.js` into your project depends on your development environment:

#### Web Browsers

Add a `<script>` tag such as the following to your HTML:

```html
<script src="https://unpkg.com/xrpl@2.0.0/build/xrpl-latest-min.js"></script>
```

You can load the library from a CDN as in the above example, or download a release and host it on your own website.

This loads the module into the top level as `xrpl`.

#### Node.js

Add the library using [npm](https://www.npmjs.com/). This updates your `package.json` file, or creates a new one if it didn't already exist:

```sh
npm install xrpl
```

Then import the library:

```js
const xrpl = require("xrpl")
```


### 2. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl.js`, you create an instance of the `Client` class and use the `connect()` method.

**Tip:** Many network functions in `xrpl.js` use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to return values asynchronously. The code samples here use the [`async/await` pattern](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) to wait for the actual result of the Promises.

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

#### Connect to the XRP Ledger Mainnet

The sample code in the previous section shows you how to connect to the Testnet, which is one of the available [parallel networks](parallel-networks.html). When you're ready to move to production, you'll need to connect to the XRP Ledger Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](connect-your-rippled-to-the-xrp-test-net.html). [There are good reasons to run your own core server](xrpl-servers.html#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

        const MY_SERVER = "ws://localhost:6006/"
        const client = new xrpl.Client(MY_SERVER)
        await client.connect()

    See the example [core server config file](https://github.com/ripple/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

        const PUBLIC_SERVER = "wss://xrplcluster.com/"
        const client = new xrpl.Client(PUBLIC_SERVER)
        await client.connect()


### 3. Get Account

The `xrpl.js` library has a `Wallet` class for handling the keys and address of an XRP Ledger account. On Testnet, you can fund a new account like this:

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Create a wallet", end_before="// Get info", language="js") }}

If you only want to generate keys, you can create a new `Wallet` instance like this:

```js
const test_wallet = xrpl.Wallet.generate()
```

Or, if you already have a seed encoded in [base58][], you can make a `Wallet` instance from it like this:

```js
const test_wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9") // Test secret; don't use for real
```

### 4. Query the XRP Ledger

Use the Client's `request()` method to access the XRP Ledger's [WebSocket API](https://xrpl.org/request-formatting.html). For example:

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Get info", end_before="// Listen to ledger close events", language="js") }}


### 5. Listen for Events

You can set up handlers for various types of events in `xrpl.js`, such as whenever the XRP Ledger's [consensus process](intro-to-consensus.html) produces a new [ledger version](ledgers.html). To do that, first call the [subscribe method][] to get the type of events you want, then attach an event handler using the `on(eventType, callback)` method of the client.

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Listen to ledger close events", end_before="// Disconnect when done", language="js") }}


## Keep on Building

Now that you know how to use `xrpl.js` to connect to the XRP Ledger, get an account, and look up information about it, you can also:

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
    - [`xrpl.js` Reference](https://js.xrpl.org/)
    - [Public API Methods](public-api-methods.html)
    - [API Conventions](api-conventions.html)
        - [base58 Encodings](base58-encodings.html)
    - [Transaction Formats](transaction-formats.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
