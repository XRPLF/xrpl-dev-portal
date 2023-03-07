---
parent: build-apps.html
targets:
  - en
  - ja # TODO: translate this page
blurb: Build a graphical desktop wallet for the XRPL using Javascript.
---
# Build a Desktop Wallet in Javascript
<!-- STYLE_OVERRIDE: wallet -->

This tutorial demonstrates how to build a desktop wallet for the XRP Ledger using the Javascript programming language and various libraries. This application can be used as a starting point for building a more complete and powerful application, as a reference point for building comparable apps, or as a learning experience to better understand how to integrate XRP Ledger functionality into a larger project.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

1. You have [Node.js](https://nodejs.org/en/download/) v10.15.3 or higher installed.
2. You have [Yarn](https://yarnpkg.com/en/docs/install) (v1.17.3 or higher) or [NPM](https://www.npmjs.com/get-npm) (v6.4.1 or higher) installed.
3. You are somewhat familiar with coding with JavaScript and have completed the [Get Started Using JavaScript](get-started-using-python.html) tutorial.

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

Before you begin, make sure you have the pre-requisites installed. Check your node version by running `node -v`. If you don't have node installed, you can download it [here](https://nodejs.org/en/download/).

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

3. Navigate to your project directory and copy this [package.json](_code-samples/build-a-wallet/js/package.json) file to your project.
        - Alternatively you can also do `yarn add <package-name>` or `npm install <package-name>` for each individual package to add them to your `package.json` file.
  
4. Run `yarn` or `npm i` to install the packages.

5. Create a new file `.env` in the root directory of the project and add the following variables:

```bash
CLIENT="wss://s.altnet.rippletest.net/" // or any other server
EXPLORER_NETWORK="testnet" // or "mainnet"
SEED="sEd7B2Jm7RBhhh5i88SH38aZB8ot8Kq" // Replace with your seed
```
6. Change the seed to your own seed. You can get a testnet account from [here](https://xrpl.org/xrp-test-net-faucet.html).

### Step 2: Creating the Home Page (Displaying Account & Ledger Details)

In this step, we will create the home page that will display the account details and the ledger details.

![Home Page Screenshot](img/js-wallet-home.png)

1. Make a new folder named src in the root directory of the project.

2. Create new files named index.html, index.js and index.css. 

3. Copy the contents of the [index.html](_code-samples/build-a-wallet/js/index.html), [index.js](_code-samples/build-a-wallet/js/index.js) and [index.css](_code-samples/build-a-wallet/js/index.css) files to your files.

Now that you've got the basic setup, let's discuss what we're going to do. For the home page, we want to display our account info, what's happening on the ledger, and for fun add a little logo. In order to make that happen, first we need to look up our account state. These next few steps will walk you through that process.

4. Make a new folder named helpers in the src directory, create a new file named get-wallet-details.js and copy the code written below to the file.

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/get-wallet-details.js", language="js") }}

In the function `getWalletDetails`, we are using the [account_info](https://xrpl.org/account_info.html) method to fetch the account details. We are also using the [server_info](https://xrpl.org/server_info.html) method to calculate the reserve base and increment. You can read more about the reserve requirement [here](https://xrpl.org/reserves.html).

5. Create another file in helpers folder named get-ledger-details.js which will be used to fetch the ledger details and copy the code written below to the file.

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/get-ledger-details.js", language="js") }}

In the function `getLedgerDetails`, we are using the [ledger](https://xrpl.org/ledger.html) that will fetch the details of the latest ledger, you can tweak the code to fetch the details of a specific ledger and also to fetch account details and other information.


6. Now, let's add the code to index.js file to fetch the account and ledger details and display them on the home page. Copy the code written below to the index.js file.

{{ include_code("_code-samples/build-a-wallet/js/index.js", language="js") }}

In the code above, we imported the `getWalletDetails` and `getLedgerDetails` functions from the get-wallet-details.js and get-ledger-details.js files respectively. Added event listners to the buttons for redirection. Used the `setInterval` method to call the getLedgerDetails function every 4 seconds. (Note: The ledger's estimate close time is 4 seconds, so we are calling the function every 4 seconds to get the latest ledger details. This can be adjusted according to your needs.)

Up next we need to update the HTML and CSS for the home page to give it the XRPL-look and feel. 

7. Copy the contents of the [index.html](_code-samples/build-a-wallet/js/index.html) file to your index.html file.

For this tutorial, we're using basic HTML and pre-loaded CSS files. If you'd like to change the aesthetic, you can replace it with any CSS framework of your choice!

8. Copy the code from the [index.css](_code-samples/build-a-wallet/js/index.css) file to your project's index.css file to use the pre-made stylings.

### Step 3: Creating the Send XRP Page

Till now, we have created the home page that displays the account and ledger details. In this step, we will create the Send XRP page that will allow users to send XRP to another account.

![Send XRP Page Screenshot](img/js-wallet-send-xrp.png)

1. Create a folder named send-xrp in the src directory.

2. Add two files named send-xrp.js and send-xrp.html. You can also create a separate css file depending on your choice. 

3. Copy the contents of the [send-xrp.html](_code-samples/build-a-wallet/js/src/send-xrp/send-xrp.html) file to your send-xrp.html file. The provided HTML code includes three input fields for the destination address, amount, and destination tag, each with their corresponding labels.

4. Now that we have the HTML code, let's add the JavaScript code. In helpers folder, add a new file named submit-transaction.js and copy the code written below to the file.

{{ include_code("_code-samples/build-a-wallet/js/src/helpers/submit-transaction.js", language="js") }}

In the code above, we are using the [submit](https://xrpl.org/submit.html) method to submit the signed transaction to the XRPL. You can read more about the submit method [here](https://xrpl.org/submit.html).

5. Now back to the send-xrp.js file, copy the code written below to the file.

{{ include_code("_code-samples/build-a-wallet/js/src/send-xrp/send-xrp.js", language="js") }}

In the code above, we retrieve elements from DOM, add event listeners, validate inputs and after validation, we call the `submitTransaction` function from the submit-transaction.js file to submit the transaction to the XRPL.

### Step 4: Creating the Transactions Page

Now that we have created the home page and the send XRP page, let's create the transactions page that will display the transaction history of the account.

  1. Account: The account that sent the transaction.
  2. Destination: The account that received the transaction.
  3. Amount: The amount of XRP sent in the transaction.
  4. Transaction Type: The type of transaction.
  5. Result: The result of the transaction.
  6. Link: A link to the transaction on the XRP Ledger Explorer.

![Transactions Page Screenshot](img/js-wallet-transaction.png)

1. Create a folder named transaction-history in the src directory.

2. Add two files named transaction-history.js and transaction-history.html.

3. In the transaction-history.js file, copy the code written below.

{{ include_code("_code-samples/build-a-wallet/js/src/transaction-history/transaction-history.js", language="js") }}

In the code above we fetch the transactions from the XRP Ledger by using the [account_tx](https://xrpl.org/account_tx.html) method. You can read more about the account_tx method [here](https://xrpl.org/account_tx.html).

4. Copy the contents of the [transaction-history.html](_code-samples/build-a-wallet/js/src/transaction-history/transaction-history.html) file to your transaction-history.html file.

You can use this code as a starting point and customize it to suit your needs. For example, you might want to add more columns to the table. You can also check out the [XRP Ledger Explorer](https://livenet.xrpl.org/) to see how the transaction details are displayed.

### Step 5: Running the App

A wallet app is not complete without a way to run it. In this step, we will set up the vite bundler to run the app.

1. Set up vite bundler, copy the code written below to the vite.config.js file.

{{ include_code("_code-samples/build-a-wallet/js/vite.config.js", language="js") }}

We've used Vite to bundle the app, if you're unfamiliar with Vite, you can check out the [Vite documentation](https://vitejs.dev/guide/) to learn more.

xrpl.js requires some configuration to run with the vite bundler. You can find the configuration in the code below or you can check out the [xrpl.js documentation](https://github.com/XRPLF/xrpl.js/blob/main/UNIQUE_SETUPS.md#using-xrpljs-with-vite-react).


2. Add script to package.json

In your package.json file, add:

```json
"scripts": {
    "dev": "vite"
}
```

Now our app is ready to run. To run the app, open terminal in the project directory and run:

```bash
yarn dev ## or npm run dev
```

This will start the app in development mode. Check your terminal for the URL where the app is running. Click the URL to open the app in your browser. You should see the home page of the app. 

If you ran into trouble while running the app, go over the steps again to ensure you followed them correctly. If still the app doesn't run, feel free to ask on XRPL Community [Discord](https://discord.com/invite/KTNmhJDXqa).

## Next Steps

Now that you have a functional wallet, you can take it in several new directions. The following are a few ideas:

- You could support more of the XRP Ledger's [transaction types](transaction-types.html) including [tokens](issued-currencies.html) and [cross-currency payments](cross-currency-payments.html)
- You could add support for multiple currencies, including IOUs.
- Allow the user to trade in the [decentralized exchange](decentralized-exchange.html)
- Add a way to request payments, such as with QR codes or URIs that open in your wallet.
- Support better account security including [regular key pairs](cryptographic-keys.html#regular-key-pair) or [multi-signing](multi-signing.html).

<!--{## common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
