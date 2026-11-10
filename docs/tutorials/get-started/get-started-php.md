---
seo:
    description: Build a PHP app that interacts with the XRP Ledger.
labels:
  - Development
---

{% code-walkthrough
  filesets=[
    {
      "files": ["/_code-samples/get-started/php/get-acct-info.php"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/php/composer.json", "/_code-samples/get-started/php/get-acct-info.php", "/_code-samples/get-started/php/README.md"]
    }
  ]
%}

# Get Started Using PHP Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`XRPL_PHP`](https://github.com/AlexanderBuzz/xrpl-php), a PHP library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `XRPL_PHP`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `XRPL_PHP`.
- How to use the `XRPL_PHP` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a simple application.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- Have a basic understanding of PHP.
- Have installed [PHP 8.2](https://www.php.net/downloads) or later with the [GMP](http://php.net/manual/en/book.gmp.php) and [BCMATH](https://www.php.net/manual/en/book.bc.php) extensions.
- Have installed [Composer](https://getcomposer.org/doc/00-intro.md).

## Source Code

Click **Download** on the top right of the code preview panel to download the source code.

## Steps

Follow the steps to create a simple application with `XRPL_PHP`.

{% step id="import-tag" %}
### 1. Install Dependencies

Start a new project by creating an empty folder, then move into that folder and install the `XRPL_PHP` library via Composer:

```sh
composer require hardcastle/xrpl_php
```

Alternatively, if you're using the downloaded source code, you can install all dependencies from the `composer.json` file:

```sh
composer install
```

The sample code loads the library through the Composer autoloader and imports the classes it uses.
{% /step %}

### 2. Connect to the XRP Ledger

{% step id="connect-tag" %}
#### Connect to the XRP Ledger Testnet

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `XRPL_PHP`, you can use the [`JsonRpcClient`](https://alexanderbuzz.github.io/xrpl-php-docs/client.html). Note that PHP has no native support for WebSockets, so the Client does not establish a permanent connection.

The sample code shows you how to connect to the Testnet, which is one of the available [parallel networks](../../concepts/networks-and-servers/parallel-networks.md).
{% /step %}

{% step id="connect-mainnet-tag" %}
#### Connect to the XRP Ledger Mainnet

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

- By [installing the core server](../../infrastructure/installation/index.md) (`xrpld`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../infrastructure/configuration/connect-your-xrpld-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

    ```php
    use Hardcastle\XRPL_PHP\Client\JsonRpcClient;

    const LOCAL_JSON_RPC_URL = "http://localhost:5005/";
    $client = new JsonRpcClient(LOCAL_JSON_RPC_URL);
    ```

    See the example {% source-link name="core server config file" path="cfg/xrpld-example.cfg#L1469" /%} for more information about default values.

- By using one of the available [public servers][]:

    ```php
    use Hardcastle\XRPL_PHP\Client\JsonRpcClient;

    const MAINNET_JSON_RPC_URL = "https://s2.ripple.com:51234/";
    $client = new JsonRpcClient(MAINNET_JSON_RPC_URL);
    ```
{% /step %}

### 3. Get Account

{% step id="get-account-create-wallet-tag" %}
#### Create and Fund a Wallet

To store value and execute transactions on the XRP Ledger, you need to get an account: a [set of keys](../../concepts/accounts/cryptographic-keys.md#key-components) and an [address](../../concepts/accounts/addresses.md) that's been [funded with enough XRP](../../concepts/accounts/index.md#creating-accounts) to meet the [account reserve](../../concepts/accounts/reserves.md). The address is the identifier of your account and you use the [private key](../../concepts/accounts/cryptographic-keys.md#private-key) to sign transactions that you submit to the XRP Ledger. For production purposes, you should take care to store your keys and set up a [secure signing method](../../concepts/transactions/secure-signing.md).

To generate a new account, `XRPL_PHP` provides the static `generate()` method in the `Wallet` class.

For testing and development purposes, you can use the `Faucet` class on the XRP Ledger [Testnet](../../concepts/networks-and-servers/parallel-networks.md) to fund the wallet. Its `fundWallet()` method waits until the faucet payment shows up in the account's balance before returning.
{% /step %}

{% step id="get-account-create-wallet-c-tag" %}
#### (Optional) Use Your Own Wallet Seed

To use an existing wallet seed encoded in [base58][], you can create a `Wallet` instance from it with the static `fromSeed()` method.
{% /step %}

{% step id="query-xrpl-tag" %}
### 4. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../concepts/transactions/reliable-transaction-submission.md).

Here, we'll use the `JsonRpcClient` we constructed to look up information about the account we got in the previous step. Use a request model like `AccountInfoRequest` to validate the request format and catch errors sooner, then read the response with `getResult()`.
{% /step %}

{% step id="run-app-tag" %}
### 5. Run the Application

Finally, in your terminal, run the application like so:

```sh
php get-acct-info.php
```

You should see output similar to this example:

```sh
Creating a new wallet and funding it with Testnet XRP...
Wallet: rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH

Getting account info...
{
    "account_data": {
        "Account": "rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH",
        "Balance": "100000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "62A194278A2645DDC2A42F5FED8E56645A7B789CEFF4AB75F451AD8827095290",
        "PreviousTxnLgrSeq": 22224694,
        "Sequence": 22224694,
        "index": "F5C5332360D33A27D7915F021196710927F1BA53B4993C9D04854F635E02EB9A"
    },
    "account_flags": {
        "allowTrustLineClawback": false,
        "allowTrustLineLocking": false,
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
    "ledger_hash": "8A30A2F2E14DC9B7D0726D48B61671521525918900EC9368D20FAE81A2FCC9A8",
    "ledger_index": 22224694,
    "status": "success",
    "validated": true
}
```

The response fields that you want to inspect in most cases are:

- `account_data.Sequence` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions.

- `account_data.Balance` — This is the account's balance of [XRP, in drops][]. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](../../concepts/transactions/transaction-cost.md#current-transaction-cost) for a given transaction.

- `validated` — Indicates whether the returned data is from a [validated ledger](../../concepts/ledgers/open-closed-validated-ledgers.md). When inspecting transactions, it's important to confirm that [the results are final](../../concepts/transactions/finality-of-results/index.md) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

For a detailed description of every response field, see [account_info](../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md#response-format).
{% /step %}

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [Client Libraries](../../references/client-libraries.md)
- **Tutorials:**
    - [Send XRP](../payments/send-xrp)
    - [Issue a Fungible Token](../tokens/fungible-tokens/issue-a-fungible-token.md)
    - [Set up Secure Signing](../../concepts/transactions/secure-signing.md)
- **References:**
    - [`XRPL_PHP` Reference](https://alexanderbuzz.github.io/xrpl-php-docs/)
    - [Public API Methods](../../references/http-websocket-apis/public-api-methods/index.md)
    - [API Conventions](../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 Encodings](../../references/protocol/data-types/base58-encodings.md)
    - [Transaction Formats](../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

{% /code-walkthrough %}
