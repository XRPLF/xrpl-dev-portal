---
seo:
    description: Build a Python app that interacts with the XRP Ledger.
labels:
  - Development
---
# Get Started Using Python Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl-py`](https://github.com/XRPLF/xrpl-py), a pure [Python](https://www.python.org) library built to interact with the XRP Ledger using native Python models and methods.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning Goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using `xrpl-py`.
* How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl-py`.
* How to use the `xrpl-py` library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a Python app.

## Requirements

The `xrpl-py` library supports [Python 3.7](https://www.python.org/downloads/) and later.


## Installation

The [`xrpl-py` library](https://github.com/XRPLF/xrpl-py) is available on [PyPI](https://pypi.org/project/xrpl-py/). Install with `pip`: <!-- SPELLING_IGNORE: pypi -->


```py
pip3 install xrpl-py
```

## Start Building

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](../../../concepts/accounts/index.md), integrating with the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md), or [issuing tokens](../../../concepts/tokens/index.md). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
1. [Get an account.](#2-get-account)
1. [Query the XRP Ledger.](#3-query-the-xrp-ledger)


### 1. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.html):

{% code-snippet file="/_code-samples/get-started/py/get-acct-info.py" from="# Define the network client" before="# Create a wallet using the testnet faucet:" language="py" /%}

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](../../../infrastructure/installation/index.md) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

    ```
    from xrpl.clients import JsonRpcClient
    JSON_RPC_URL = "http://localhost:5005/"
    client = JsonRpcClient(JSON_RPC_URL)
    ```

    See the example [core server config file](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

    ```
    from xrpl.clients import JsonRpcClient
    JSON_RPC_URL = "https://s2.ripple.com:51234/"
    client = JsonRpcClient(JSON_RPC_URL)
    ```


### 2. Get account

To store value and execute transactions on the XRP Ledger, you need an account: a [set of keys](../../../concepts/accounts/cryptographic-keys.md#key-components) and an [address](../../../concepts/accounts/addresses.md) that's been [funded with enough XRP](../../../concepts/accounts/index.md#creating-accounts) to meet the [account reserve](../../../concepts/accounts/reserves.md). The address is the identifier of your account and you use the [private key](../../../concepts/accounts/cryptographic-keys.md#private-key) to sign transactions that you submit to the XRP Ledger.

For testing and development purposes, you can use the [XRP Faucets](/resources/dev-tools/xrp-faucets) to generate keys and fund the account on the Testnet or Devnet. For production purposes, you should take care to store your keys and set up a [secure signing method](../../../concepts/transactions/secure-signing.md). Another difference in production is that XRP has real worth, so you can't get it for free from a faucet.

To create and fund an account on the Testnet, `xrpl-py` provides the [`generate_faucet_wallet`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method:

{% code-snippet file="/_code-samples/get-started/py/get-acct-info.py" from="# Create a wallet using the testnet faucet:" before="# Create an account str from the wallet" language="py" /%}


This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.Wallet):


```py
print(test_wallet)

# print output

public_key:: 022FA613294CD13FFEA759D0185007DBE763331910509EF8F1635B4F84FA08AEE3
private_key:: -HIDDEN-
classic_address: raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q
```

#### Using the account

In this tutorial we only query details about the generated account from the XRP Ledger, but you can use the values in the `Wallet` instance to prepare, sign, and submit transactions with `xrpl-py`.

##### Prepare

To prepare the transaction:

{% code-snippet file="/_code-samples/get-started/py/prepare-payment.py" from="# Prepare payment" before="# print prepared payment" language="py" /%}



##### Sign and submit

To sign and submit the transaction:

{% code-snippet file="/_code-samples/get-started/py/prepare-payment.py" from="# Sign and submit the transaction" before="# Print tx response" language="py" /%}


##### Derive an X-address

You can use `xrpl-py`'s [`xrpl.core.addresscodec`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.core.addresscodec.html) module to derive an [X-address](https://xrpaddress.info/) from the `Wallet.address` field:

{% code-snippet file="/_code-samples/get-started/py/get-acct-info.py" from="# Derive an x-address from the classic address:" before="# Look up info about your account" language="py" /%}

The X-address format [packs the address and destination tag](https://github.com/XRPLF/XRPL-Standards/issues/6) into a more user-friendly value.


### 3. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../../concepts/transactions/reliable-transaction-submission.md).

Here, we use `xrpl-py`'s [`xrpl.account`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.html) module to look up information about the [account we got](#2-get-account) in the previous step.


{% code-snippet file="/_code-samples/get-started/py/get-acct-info.py" from="# Look up info about your account" language="py" /%}



### 4. Putting it all together

Using these building blocks, we can create a Python app that:

1. Gets an account on the Testnet.
2. Connects to the XRP Ledger.
3. Looks up and prints information about the account you created.


{% code-snippet file="/_code-samples/get-started/py/get-acct-info.py" language="python" /%}

To run the app, you can copy and paste the code into an editor or IDE and run it from there. Or you could download the file from the [XRP Ledger Dev Portal repo](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/get-started/py) and run it locally:


```sh
git clone git@github.com:XRPLF/xrpl-dev-portal.git
cd xrpl-dev-portal/_code-samples/get-started/py/get-acct-info.py
python3 get-acct-info.py
```

You should see output similar to this example:

```sh
Classic address:

 rnQLnSEA1YFMABnCMrkMWFKxnqW6sQ8EWk
X-address:

 T7dRN2ktZGYSTyEPWa9SyDevrwS5yDca4m7xfXTGM3bqff8
response.status:  ResponseStatus.SUCCESS
{
    "account_data": {
        "Account": "rnQLnSEA1YFMABnCMrkMWFKxnqW6sQ8EWk",
        "Balance": "1000000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "5A5203AFF41503539D11ADC41BE4185761C5B78B7ED382E6D001ADE83A59B8DC",
        "PreviousTxnLgrSeq": 16126889,
        "Sequence": 16126889,
        "index": "CAD0F7EF3AB91DA7A952E09D4AF62C943FC1EEE41BE926D632DDB34CAA2E0E8F"
    },
    "ledger_current_index": 16126890,
    "queue_data": {
        "txn_count": 0
    },
    "validated": false
}
```

#### Interpreting the response

The response fields that you want to inspect in most cases are:

* `account_data.Sequence` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions. With `xrpl-py`, you can use the [`get_next_valid_seq_number`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.html#xrpl.account.get_next_valid_seq_number) to get this automatically from the XRP Ledger. See an example of this usage in the project [README](https://github.com/XRPLF/xrpl-py#serialize-and-sign-transactions).

* `account_data.Balance` — This is the account's balance of [XRP, in drops][]. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](../../../concepts/transactions/transaction-cost.md#current-transaction-cost) for a given transaction.

* `validated` — Indicates whether the returned data is from a [validated ledger](../../../concepts/ledgers/open-closed-validated-ledgers.md). When inspecting transactions, it's important to confirm that [the results are final](../../../concepts/transactions/finality-of-results/index.md) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).

For a detailed description of every response field, see [account_info](../../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md#response-format).


## Keep on building

Now that you know how to use `xrpl-py` to connect to the XRP Ledger, get an account, and look up information about it, you can also use `xrpl-py` to:

* [Send XRP](../../how-tos/send-xrp.md).
* [Set up secure signing](../../../concepts/transactions/secure-signing.md) for your account.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
