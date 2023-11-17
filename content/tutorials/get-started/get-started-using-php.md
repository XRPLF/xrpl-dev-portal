---
html: get-started-using-php.html
parent: php.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Build a PHP app that interacts with the XRP Ledger.
cta_text: Build an XRP Ledger-connected app
top_nav_name: PHP
top_nav_grouping: Get Started
labels:
  - Development
showcase_icon: assets/img/logos/java.svg
---
# Get Started Using PHP

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`XRPL_PHP`](https://github.com/AlexanderBuzz/xrpl-php), a PHP library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning Goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using `XRPL_PHP`.
* How to get an account on the [Testnet](xrp-testnet-faucet.html) using `XRPL_PHP`.
* How to use the `XRPL_PHP` library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a simple application.

## Requirements

* `XRPL_PHP` requires PHP 8.1.
* Recommended for increased performance are the PHP extensions [GMP](http://php.net/manual/en/book.gmp.php) and / or [BCMATH](https://www.php.net/manual/de/book.bc.php)


## Installation

`XRPL_PHP` can be installed via [Composer](http://getcomposer.org/doc/00-intro.html):

```console
composer require hardcastle/xrpl_php
```


## Start Building
{% set n = cycler(* range(1,99)) %}

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](accounts.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](tokens.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
1. [Get an account.](#2-get-account)
1. [Query the XRP Ledger.](#3-query-the-xrp-ledger)


### {{n.next()}}. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `XRPL_PHP`, you can use the [`JsonRpcClient`](hhttps://alexanderbuzz.github.io/xrpl-php-docs/client.html):

```php
<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports 
use XRPL_PHP\Client\JsonRpcClient;

// Create a Client using the Testnet
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");
```

Note that PHP has no native support for WebSockets, so the Client does not establish a permanent connection.

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the available [parallel networks](parallel-networks.html). When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](connect-your-rippled-to-the-xrp-test-net.html). [There are good reasons to run your own core server](networks-and-servers.html#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

        use XRPL_PHP\Client\JsonRpcClient;

        const LOCAL_JSON_RPC_URL = "http://localhost:5005/";
        $client = new JsonRpcClient("LOCAL_JSON_RPC_URL");

    See the example [core server config file](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

        use XRPL_PHP\Client\JsonRpcClient;

        const MAINNET_JSON_RPC_URL = "https://s2.ripple.com:51234/";
        $client = new JsonRpcClient("MAINNET_JSON_RPC_URL");

### {{n.next()}}. Get account

To store value and execute transactions on the XRP Ledger, you need to get an account: a [set of keys](cryptographic-keys.html#key-components) and an [address](addresses.html) that's been [funded with enough XRP](accounts.html#creating-accounts) to meet the [account reserve](reserves.html). The address is the identifier of your account and you use the [private key](cryptographic-keys.html#private-key) to sign transactions that you submit to the XRP Ledger. For production purposes, you should take care to store your keys and set up a [secure signing method](secure-signing.html).

To generate a new account, `PHP_XRPL` provides the static `generate()`method in the `Wallet` class:

```php
<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports 
use XRPL_PHP\Wallet\Wallet;

// Create a new wallet
$wallet = Wallet::generate();
```

The result returns a `Wallet` instance:

```php
// print wallet properties
print_r([
  'publicKey' => $wallet->getPublicKey(),
  'privateKey' => $wallet->getPrivateKey(),
  'classicAddress' => $wallet->getAddress(),
  'seed' => $wallet->getSeed()
]);

// output
// Array
// (
//    [publicKey] => ED2C4CE69F663254840905AEF5FB8596FC243EDEBE0295A6ECEE86CE8EB8F76210
//    [privateKey] => -HIDDEN-
//    [classicAddress] => rBi9u1P3ofRKTFPFTgrguANz2wRqsdKHvm
//    [seed] => -HIDDEN-
//)

```

For testing and development purposes, you can use the `fundWallet()` helper function on the XRP Ledger [Testnet](parallel-networks.html):

```php
<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports
use XRPL_PHP\Client\JsonRpcClient;
use XRPL_PHP\Wallet\Wallet;
use function XRPL_PHP\Sugar\fundWallet;

// Create a client using the Testnet
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");

// Create a new wallet
$wallet = Wallet::generate();

// Fund (and activate) the wallet
$fundWalletResponse = fundWallet($client, $wallet);
```

### {{n.next()}}. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](account-methods.html), [a specific transaction](tx.html), the state of a [current or a historical ledger](ledger-methods.html), and [the XRP Ledger's decentralized exchange](path-and-order-book-methods.html). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](reliable-transaction-submission.html).

Here, we'll use the [`JsonRpcClient` we constructed](#1-connect-to-the-xrp-ledger) to look up information about the [account we got](#2-get-account) in the previous step.

```php
<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports
use XRPL_PHP\Client\JsonRpcClient;
use XRPL_PHP\Wallet\Wallet;
use function XRPL_PHP\Sugar\fundWallet;

// Create a client using the Testnet
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");

// Create a new wallet
$wallet = Wallet::generate();

// Fund (and activate) the wallet
$fundWalletResponse = fundWallet($client, $wallet);

// Create an AccountInfo request "method"
$accountInfoRequest = new AccountInfoRequest(
    account: $wallet->getAddress(),
    ledgerIndex: 'validated'
 );

// Send AccountInfo request
$accountInfoResponse = $client->syncRequest(($accountInfoRequest));

print_r($accountInfoResponse);
```

### {{n.next()}}. Starting the script

Now, we have a simple application that:

1. Creates an account on the Testnet.
2. Connects to the XRP Ledger.
3. Looks up and prints information about the account you created.

To run the app, you can copy the code from [this website's GitHub Repository]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/get-started/php/) and run it from the command line:

```console
composer require hardcastle/xrpl_php
php get-acct-info.php
```

You should see output similar to this example:

```console
XRPL_PHP\Models\Account\AccountInfoResponse Object
(
    [id:protected] => 
    [result:protected] => Array
        (
            [account_data] => Array
                (
                    [Account] => rDTRjR6sWrRmGe18KMVwBuL212gLpArVLy
                    [Balance] => 10000000000
                    [Flags] => 0
                    [LedgerEntryType] => AccountRoot
                    [OwnerCount] => 0
                    [PreviousTxnID] => AE18C0B30DE740490E66E92D9F45162C8860A6D9FCF279CF7A51FAFE05F573FB
                    [PreviousTxnLgrSeq] => 42719256
                    [Sequence] => 42719256
                    [index] => 4DD9F7FAE7365B7A917932D6453DBA9B223AA4FF7193691EF6E5EE230519F4CA
                )

            [account_flags] => Array
                (
                    [defaultRipple] => 
                    [depositAuth] => 
                    [disableMasterKey] => 
                    [disallowIncomingCheck] => 
                    [disallowIncomingNFTokenOffer] => 
                    [disallowIncomingPayChan] => 
                    [disallowIncomingTrustline] => 
                    [disallowIncomingXRP] => 
                    [globalFreeze] => 
                    [noFreeze] => 
                    [passwordSpent] => 
                    [requireAuthorization] => 
                    [requireDestinationTag] => 
                )

            [ledger_hash] => 57F0CB8311CDEAE9AC60854CC482990CE971D1FD36DB1CC215B7A6634E27E739
            [ledger_index] => 42719256
            [status] => success
            [validated] => 1
        )

    [warnings:protected] => 
    [status:protected] => success
    [type:protected] => response
)
```

#### Interpreting the response

The response fields contained in `AccountInfoResponse` that you want to inspect in most cases are:

* `['account_data']['Sequence']` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions.

* `['account_data']['Balance']` — This is the account's balance of XRP, in drops. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](transaction-cost.html#current-transaction-cost) for a given transaction.

* `['validated']` — Indicates whether the returned data is from a [validated ledger](open-closed-validated-ledgers.html). When inspecting transactions, it's important to confirm that [the results are final](finality-of-results.html) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](reliable-transaction-submission.html).

For a detailed description of every response field, see [account_info](account_info.html#response-format).


## Keep on building

Now that you know how to use `xrpl4j` to connect to the XRP Ledger, get an account, and look up information about it, you can also use `xrpl4j` to:

* [Send XRP](send-xrp.html).
* [Set up secure signing](secure-signing.html) for your account.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
