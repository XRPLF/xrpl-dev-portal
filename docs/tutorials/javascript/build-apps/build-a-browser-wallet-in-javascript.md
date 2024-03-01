---
html: build-a-browser-wallet-in-javascript.html
parent: javascript.html
targets:
  - en
  - ja # TODO: translate this page
seo:
    description: Build a graphical browser wallet for the XRPL using Javascript.
---
# Build a Browser Wallet in JavaScript
<!-- STYLE_OVERRIDE: wallet -->

This tutorial demonstrates how to build a browser wallet for the XRP Ledger using the Javascript programming language and various libraries. This application can be used as a starting point for building a more complete and powerful application, as a reference point for building comparable apps, or as a learning experience to better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

1. You have [Node.js](https://nodejs.org/en/download/) v14 or higher installed.
2. You have [Yarn](https://yarnpkg.com/en/docs/install) (v1.17.3 or higher) installed.
3. You are somewhat familiar with coding with JavaScript and have completed the [Get Started Using JavaScript](./get-started.md) tutorial.

## Source Code

You can find the complete source code for all of this tutorial's examples in the {% repo-link path="_code-samples/build-a-browser-wallet/js/" %}code samples section of this website's repository{% /repo-link %}.

## Goals

At the end of this tutorial, you should be able to build a simple XRP wallet displayed below.

![Home Page Screenshot](/docs/img/js-wallet-home.png)

This application can:

- Show updates to the XRP Ledger in real-time.
- View any XRP Ledger account's activity, including showing how much XRP was delivered by each transaction.
- Show how much XRP is set aside for the account's [reserve requirement](../../../concepts/accounts/reserves.md).
- Send [direct XRP payments](../../../concepts/payment-types/direct-xrp-payments.md), and provide feedback about the intended destination address, including:
    - Displaying your account's available balance
    - Verifying that the destination address is valid
    - Validating the account has enough XRP to send
    - Allowing you to specify a destination tag

## Steps

Before you begin, make sure you have the prerequisites installed. Check your node version by running `node -v`. If necessary, [download Node.js](https://nodejs.org/en/download/).

**Tip:** If you get stuck while doing this tutorial, or working on another project, feel free to ask for help in the XRPL's [Developer Discord](https://discord.com/invite/KTNmhJDXqa).

### 1. Set up the project

1. Navigate to the directory that you want to create the project in.
2. Create a new Vite project:

```bash
yarn create vite simple-xrpl-wallet --template vanilla
```

3. Create or modify the file `package.json` to have the following contents:

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/package.json" language="js" /%}

   - Alternatively you can also do `yarn add <package-name>` for each individual package to add them to your `package.json` file.

4. Install dependencies:

```bash
yarn
```

5. Create a new file `.env` in the root directory of the project and add the following variables:

```bash
CLIENT="wss://s.altnet.rippletest.net:51233/"
EXPLORER_NETWORK="testnet"
SEED="s████████████████████████████"
```

6. Change the seed to your own seed. You can get credentials from [the Testnet faucet](/resources/dev-tools/xrp-faucets).

7. Set up a Vite bundler. Create a file named `vite.config.js` in the root directory of the project and fill it with the following code:

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/vite.config.js" language="js" /%}

This example includes the necessary configuration to make [xrpl.js work with Vite](https://github.com/XRPLF/xrpl.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-vite-react).

8. Add script to `package.json`

In your `package.json` file, add the following section if it's not there already:

```json
"scripts": {
    "dev": "vite"
}
```

### 2. Create the Home Page (Displaying Account & Ledger Details)

In this step, we create a home page that displays account and ledger details.

![Home Page Screenshot](/docs/img/js-wallet-home.png)

1. If not already present, create new files in the root folder named `index.html`, `index.js` and `index.css`.

2. Make a new folder named `src` in the root directory of the project.

3. Copy the contents of {% repo-link path="_code-samples/build-a-browser-wallet/js/index.html" %}index.html{% /repo-link %} in your code.

4. Add styling to your {% repo-link path="_code-samples/build-a-browser-wallet/js/index.css" %}index.css{% /repo-link %} file by following the link.

This basic setup creates a homepage and applies some visual styles. The goal is for the homepage to:

- Display our account info
- Show what's happening on the ledger
- And add a little logo for fun

To make that happen, we need to connect to the XRP Ledger and look up the account and the latest validated ledger.

5. In the `src/` directory, make a new folder named `helpers`. Create a new file there named `get-wallet-details.js` and define a function named `getWalletDetails` there. This function uses the [account_info method](../../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md) to fetch account details and the [server_info method](../../../references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md) to calculate the current [reserves](../../../concepts/accounts/reserves.md). The code to do all this is as follows:

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/src/helpers/get-wallet-details.js" language="js" /%}

6. Now, let's add the code to `index.js` file to fetch the account and ledger details and display them on the home page. Copy the code written below to the `index.js` file. Here we render the wallet details using the function we defined in `get-wallet-details.js`. In order to make sure we have up to date ledger data, we are using the [ledger stream](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#ledger-stream) to listen for ledger close events.

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/index.js" language="js" /%}

7. In the `helpers` folder, add {% repo-link path="_code-samples/build-a-browser-wallet/js/src/helpers/render-xrpl-logo.js" %}render-xrpl-logo.js{% /repo-link %} to handle displaying a logo.

8. Finally create a new folder named `assets` in the `src/` directory and add the file {% repo-link path="_code-samples/build-a-browser-wallet/js/src/assets/xrpl.svg" %}`xrpl.svg`{% /repo-link %} there.

These files are used to render the XRPL logo for aesthetic purposes.

The one other thing we do here is add events to two buttons - one to send XRP and one to view transaction history. They won't work just yet — we'll implement them in the next steps.

Now the application is ready to run. You can start it in dev mode using the following command:

```bash
yarn dev
```

Your terminal should output a URL which you can use to open your app in a browser. This dev site automatically updates to reflect any changes you make to the code.

### 3. Create the Send XRP Page

Now that we've created the home page, we can move on to the "Send XRP" page. This is what allows this wallet to manage your account's funds.

![Send XRP Page Screenshot](/docs/img/js-wallet-send-xrp.png)

1. Create a folder named `send-xrp` in the `src` directory.

2. Inside the `send-xrp` folder, create two files named `send-xrp.js` and `send-xrp.html`.

3. Copy the contents of the {% repo-link path="_code-samples/build-a-browser-wallet/js/src/send-xrp/send-xrp.html" %}send-xrp.html{% /repo-link %} file to your `send-xrp.html` file. The provided HTML code includes three input fields for the destination address, amount, and destination tag, each with their corresponding labels.

4. Now that we have the HTML code, let's add the JavaScript code. In the `helpers` folder, create a new file named `submit-transaction.js` and copy the code written below to the file. In this file, we are using the [submit](../../../references/http-websocket-apis/public-api-methods/transaction-methods/submit.md) method to submit the transaction to the XRPL. Before submitting every transaction needs to be signed by a wallet, learn more about [signing](../../../references/http-websocket-apis/admin-api-methods/signing-methods/sign.md) a transaction.

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/src/helpers/submit-transaction.js" language="js" /%}

5. Now back to the `send-xrp.js` file, copy the code written below to the file. In this piece of code we are first getting all the DOM elements from HTML and adding event listners to update & validate the fields based on the user input. Using `renderAvailableBalance` method we display the current available balance of the wallet. `validateAddress` function validates the user address, and the amount is validated using a regular expression. When all the fields are filled with correct inputs, we call the `submitTransaction` function to submit the transaction to the ledger.

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/src/send-xrp/send-xrp.js" language="js" /%}

You can now click 'Send XRP' to try creating your own transaction! You can use this example to send XRP to the testnet faucet to try it out.

Testnet faucet account: `rHbZCHJSGLWVMt8D6AsidnbuULHffBFvEN`

Amount: 9

Destination Tag: (Not usually necessary unless you're paying an account tied to an exchange)

![Send XRP Transaction Screenshot](/docs/img/js-wallet-send-xrp-transaction-details.png)

### 4. Create the Transactions Page

Now that we have created the home page and the send XRP page, let's create the transactions page that will display the transaction history of the account. In order to see what's happening on the ledger, we're going to display the following fields:

  - Account: The account that sent the transaction.
  - Destination: The account that received the transaction.
  - Transaction Type: The type of transaction.
  - Result: The result of the transaction.
  - Delivered amount: The amount of XRP or tokens delivered by the transaction, if applicable.
  - Link: A link to the transaction on the XRP Ledger Explorer.

**Caution:** When displaying how much money a transaction delivered, always use the `delivered_amount` field from the metadata, not the `Amount` field from the transaction instructions. [Partial Payments](../../../concepts/payment-types/partial-payments.md) can deliver much less than the stated `Amount` and still be successful.

![Transactions Page Screenshot](/docs/img/js-wallet-transaction.png)

1. Create a folder named `transaction-history` in the src directory.
2. Create a file named `transaction-history.js` and copy the code written below.

{% code-snippet file="/_code-samples/build-a-browser-wallet/js/src/transaction-history/transaction-history.js" language="js" /%}

This code uses [account_tx](../../../references/http-websocket-apis/public-api-methods/account-methods/account_tx.md) to fetch transactions we've sent to and from this account. In order to get all the results, we're using the `marker` parameter to paginate through the incomplete list of transactions until we reach the end.

3. Create a file named `transaction-history.html` and copy the code from {% repo-link path="_code-samples/build-a-browser-wallet/js/src/transaction-history/transaction-history.html" %}transaction-history.html{% /repo-link %} into it.

`transaction-history.html` defines a table which displays the fields mentioned above.

You can use this code as a starting point for displaying your account's transaction history. If you want an additional challenge, try expanding it to support different transaction types (e.g. [TrustSet](../../../references/protocol/transactions/types/trustset.md)). If you want inspiration for how to handle this, you can check out the [XRP Ledger Explorer](https://livenet.xrpl.org/) to see how the transaction details are displayed.

## Next Steps

Now that you have a functional wallet, you can take it in several new directions. The following are a few ideas:

- You could support more of the XRP Ledger's [transaction types](../../../references/protocol/transactions/types/index.md) including [tokens](../../../concepts/tokens/index.md) and [cross-currency payments](../../../concepts/payment-types/cross-currency-payments.md)
- You could add support for displaying multiple tokens, beyond just XRP
- You could support creating [offers](../../../concepts/tokens/decentralized-exchange/offers.md) in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md)
- You could add new ways to request payments, such as with QR codes or URIs that open in your wallet.
- You could support better account security including allowing users to set [regular key pairs](../../../concepts/accounts/cryptographic-keys.md#regular-key-pair) or handle [multi-signing](../../../concepts/accounts/multi-signing.md).
- Or you could take your code to production by following the [Building for Production with Vite](https://vitejs.dev/guide/build.html#public-base-path) guide.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
