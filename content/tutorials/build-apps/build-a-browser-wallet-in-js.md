---
parent: build-apps.html
targets:
  - en
  - ja # TODO: translate this page
blurb: Build a graphical browser wallet for the XRPL using Javascript.
---
# Build A Browser Wallet Using JS
<!-- STYLE_OVERRIDE: wallet -->

This tutorial demonstrates how to build a browser wallet for the XRP Ledger using the Javascript programming language and various libraries. This application can be used as a starting point for building a more complete and powerful application, as a reference point for building comparable apps, or as a learning experience to better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

1. You have [Node.js](https://nodejs.org/en/download/) v10.15.3 or higher installed.
2. You have [Yarn](https://yarnpkg.com/en/docs/install) (v1.17.3 or higher) or [NPM](https://www.npmjs.com/get-npm) (v6.4.1 or higher) installed.
3. You are somewhat familiar with coding with JavaScript and have completed the [Get Started Using JavaScript](get-started-using-javascript.html) tutorial.

## Source Code

You can find the complete source code for all of this tutorial's examples in the [code samples section of this website's repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/build-a-wallet/js/).

## Goals

At the end of this tutorial, you should be able to build a simple XRP wallet displayed below.

![Home Page Screenshot](img/js-wallet-home.png)

This application can:

- Show updates to the XRP Ledger in real-time.
- View any XRP Ledger account's activity, including showing how much XRP was delivered by each transaction.
- Show how much XRP is set aside for the account's [reserve requirement](reserves.html). 
- Send [direct XRP payments](direct-xrp-payments.html), and provide feedback about the intended destination address, including:
    - Displaying your account's available balance
    - Verifying that the destination address is valid
    - Validating the account has enough XRP to send
    - Allowing you to specify a destination tag

## Steps

Before you begin, make sure you have the prerequisites installed. Check your node version by running `node -v`. If necessary, [download Node.js](https://nodejs.org/en/download/).

### Step 1: Setting up the project

1. Navigate to the directory that you want to create the project in.
2. Run 
   ```sh
    yarn create vite-app <project-name>
    ```
    or
    ```sh
    npm init vite-app <project-name>
    ```
    to create a new project.

3. Create or modify the file `package.json` to have the following contents:

{{ include_code("_code-samples/build-a-wallet/js/package.json", language="js") }}
        - Alternatively you can also do `yarn add <package-name>` or `npm install <package-name>` for each individual package to add them to your `package.json` file.
  
4. Run `yarn` or `npm i` to install the packages.

5. Create a new file `.env` in the root directory of the project and add the following variables:

```bash
CLIENT="wss://s.altnet.rippletest.net/" // or any other server
EXPLORER_NETWORK="testnet" // or "mainnet"
SEED="sEd7B2Jm7RBhhh5i88SH38aZB8ot8Kq" // Replace with your seed
```
6. Change the seed to your own seed. You can get a testnet account from [here](https://xrpl.org/xrp-test-net-faucet.html).

7. Create a new file named `vite.config.js` if not present already in the root directory of the project.

8. Set up vite bundler, copy the code written below to the `vite.config.js` file. 

{{ include_code("_code-samples/build-a-wallet/js/vite.config.js", language="js") }}

xrpl.js requires some configuration to run with the vite bundler. You can find the configuration in [xrpl.js documentation](https://github.com/XRPLF/xrpl.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-vite-react).

1. Add script to `package.json`

In your `package.json` file, add:

```json
"scripts": {
    "dev": "vite"
}
```

If you get stuck while doing this tutorial, or working on another project, feel free to ask for help in the XRPL's [Developer Discord](https://discord.com/invite/KTNmhJDXqa).

### Step 2: Creating the Home Page (Displaying Account & Ledger Details)

In this step, we will create the home page that will display the account details and the ledger details.

![Home Page Screenshot](img/js-wallet-home.png)

1. Make a new folder named `src` in the root directory of the project.

2. Create new files named `index.html`, `index.js` and `index.css`. 

3. Copy the contents of the [index.html](_code-samples/build-a-wallet/js/index.html), [index.js](_code-samples/build-a-wallet/js/index.js) and [index.css](_code-samples/build-a-wallet/js/index.css) files to your files.

Now that you've got the basic setup, let's discuss what we're going to do. For the home page, we want to:

- Display our account info
- Show what's happening on the ledger
- And add a little logo for fun

In order to make that happen, we need to look up our account state on the ledger. The next couple steps will walk you through that process.

4. Make a new folder named helpers in the src directory, create a new file named `get-wallet-details.js` and copy the code written below to the file. In the function `getWalletDetails`, we are using the [account_info](https://xrpl.org/account_info.html) method to fetch the account details. We are also using the [server_info](https://xrpl.org/server_info.html) method to calculate the reserve base and increment. You can read more about the reserve requirement [here](https://xrpl.org/reserves.html).

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/get-wallet-details.js", language="js") }}

5. In the `helpers/` folder, create another file named `get-ledger-details.js`. Define a function, `getLedgerDetails()`, which fetches the latest validated ledger using the [ledger method](ledger.html). The code is as follows:

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/get-ledger-details.js", language="js") }}

6. Now, let's add the code to `index.js` file to fetch the account and ledger details and display them on the home page. Copy the code written below to the `index.js` file. Here we render the wallet and ledger details using the functions we implemented earlier in `get-wallet-details.js` and `get-ledger-details.js`. In order to make sure we have up to date data, we call the `getLedgerDetails` function every 4 seconds, as that's about how long it takes for a ledger to close on mainnet. 

{{ include_code("_code-samples/build-a-wallet/js/index.js", language="js") }}

The one other thing we do here is add two buttons - one to send XRP and one to view the transaction history of our account. They won't work just yet - we'll have to add those implementations next.

Now the basic setup of your application is ready, you can run one of these commands

```bash
yarn dev
```
or 
```bash
npm run dev
```
in your terminal which will start your app in development mode. Your terminal will display an URL using which you can verify the changes in real-time.

### Step 3: Creating the Send XRP Page

Now that we've created the home page, we can move on to the "Send XRP" page. This is what allows this wallet to manage your account's funds.

![Send XRP Page Screenshot](img/js-wallet-send-xrp.png)

1. Create a folder named `send-xrp` in the `src` directory.

2. Inside the `send-xrp` folder, create two files named `send-xrp.js` and `send-xrp.html`.

3. Copy the contents of the [send-xrp.html](_code-samples/build-a-wallet/js/src/send-xrp/send-xrp.html) file to your `send-xrp.html` file. The provided HTML code includes three input fields for the destination address, amount, and destination tag, each with their corresponding labels.

4. Now that we have the HTML code, let's add the JavaScript code. In the `helpers` folder, create a new file named `submit-transaction.js` and copy the code written below to the file. In this file, we are using the [submit](https://xrpl.org/submit.html) method to submit the transaction to the XRPL. Before submitting every transaction needs to be signed by a wallet, click [here](https://xrpl.org/sign.html) to learn more about signing a transaction.

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/submit-transaction.js", language="js") }}


1. Now back to the `send-xrp.js` file, copy the code written below to the file. In this piece of code we are first getting all the DOM elements from HTML and adding event listners to update & validate the fields based on the user input. Using `renderAvailableBalance` method we display the current available balance of the wallet. `validateAddress` function validates the user address, and the amount is validated using a regular expression. When all the fields are filled with correct inputs, we call the `submitTransaction` function to submit the transaction to the ledger.

{{ include_code("_code-samples/build-a-wallet/js/src/send-xrp/send-xrp.js", language="js") }}

### Step 4: Creating the Transactions Page

Now that we have created the home page and the send XRP page, let's create the transactions page that will display the transaction history of the account. In order to see what's happening on the ledger, we're going to display the following fields: 

  - Account: The account that sent the transaction.
  - Destination: The account that received the transaction.
  - Amount: The amount of XRP sent in the transaction.
  - Transaction Type: The type of transaction.
  - Result: The result of the transaction.
  - Link: A link to the transaction on the XRP Ledger Explorer.

![Transactions Page Screenshot](img/js-wallet-transaction.png)

1. Create a folder named `transaction-history` in the src directory.
2. Create a file named `transaction-history.js` and copy the code written below. 

{{ include_code("_code-samples/build-a-wallet/js/src/transaction-history/transaction-history.js", language="js") }}

This code uses [account_tx](https://xrpl.org/account_tx.html) to fetch transactions we've sent to and from this account. In order to get all the results, we're using the `marker` parameter to paginate through the incomplete list of transactions until we reach the end.

3. Create a file named `transaction-history.html` and copy the code from [transaction-history.html](_code-samples/build-a-wallet/js/src/transaction-history/transaction-history.html) into it. 

`transaction-history.html` defines a table which displays the fields mentioned above.

You can use this code as a starting point for displaying your account's transaction history. If you want an additional challenge, try expanding it to support different transaction types (e.g. [TrustSet](https://xrpl.org/trustset.html)). If you want inspiration for how to handle this, you can check out the [XRP Ledger Explorer](https://livenet.xrpl.org/) to see how the transaction details are displayed.

## Next Steps

Now that you have a functional wallet, you can take it in several new directions. The following are a few ideas:

- You could support more of the XRP Ledger's [transaction types](transaction-types.html) including [tokens](issued-currencies.html) and [cross-currency payments](cross-currency-payments.html)
- You could add support for displaying multiple tokens, beyond just XRP
- You could support creating [offers](https://xrpl.org/offers.html) in the [decentralized exchange](decentralized-exchange.html)
- You could add new ways to request payments, such as with QR codes or URIs that open in your wallet.
- Or you could support better account security including allowing users to set [regular key pairs](cryptographic-keys.html#regular-key-pair) or handle [multi-signing](multi-signing.html).

<!--{## common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
