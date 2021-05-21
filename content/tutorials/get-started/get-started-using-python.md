---
html: get-started-using-python.html
parent: get-started.html
blurb: Build a simple Python app that interacts with the XRP Ledger.
cta_text: Build an XRP Ledger-connected app
filters:
    - include_code
---

# Get Started Using Python

This tutorial walks you through the basics of building a very simple XRP Ledger-connected application using [`xrpl-py`](https://github.com/XRPLF/xrpl-py), a pure [Python](https://www.python.org) library that makes it easy to interact with the XRP Ledger using native Python models and methods.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning goals

In this tutorial, you'll learn:

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger using `xrpl-py`.
* How to generate a wallet on the [Testnet](xrp-testnet-faucet.html) using `xrpl-py`.
* How to use the `xrpl-py` library to look up information about an account on the XRP Ledger.
* How to put these steps together to create a simple Python app.

## Requirements

The `xrpl-py` library supports [Python 3.7](https://www.python.org/downloads/) and later.


## Installation

The [`xrpl-py` library](https://github.com/XRPLF/xrpl-py) is available on [PyPI](https://pypi.org/project/xrpl-py/). Install with `pip`:


```py
pip3 install xrpl-py
```

## Start building
{% set n = cycler(* range(1,99)) %}

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP into your [wallet](wallets.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](issued-currencies.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
1. [Generate a wallet.](#2-generate-wallet)
1. [Query the XRP Ledger.](#3-query-the-xrp-ledger)


### {{n.next()}}. Connect to the XRP Ledger

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. To do this with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.html):


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Define the network client", end_before="# Create a wallet using the testnet faucet:", language="py") }}

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is one of the available [parallel networks](parallel-networks.html). When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

* By [installing the core server](install-rippled.html) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](connect-your-rippled-to-the-xrp-test-net.html). [There are good reasons to run your own core server](the-rippled-server.html#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "http://localhost:5005/"
        client = JsonRpcClient(JSON_RPC_URL)

    See the example [core server config file](https://github.com/ripple/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

* By using one of the available [public servers][]:

        from xrpl.clients import JsonRpcClient
        JSON_RPC_URL = "https://s2.ripple.com:51234/"
        client = JsonRpcClient(JSON_RPC_URL)


### {{n.next()}}. Generate wallet

To store value and execute transactions on the XRP Ledger, you need to create a wallet: a [set of keys](cryptographic-keys.html#key-components) and an [address](accounts.html#addresses) that's been [funded with enough XRP](accounts.html#creating-accounts) to meet the [account reserve](reserves.html). The address is the identifier of your account and you use the [private key](cryptographic-keys.html#private-key) to sign transactions that you submit to the XRP Ledger.


For testing and development purposes, you can use the [XRP Faucets](xrp-testnet-faucet.html) to generate keys and fund the account on the Testnet or Devnet. For production purposes, you should take care to store your keys and set up a [secure signing method](set-up-secure-signing.html).


To make it easy to create a wallet on the Testnet, `xrpl-py` provides the [`generate_faucet_wallet`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method:



{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Create a wallet using the testnet faucet:", end_before="# Create an account str from the wallet", language="py") }}


This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.Wallet):


```py
print(test_wallet)

# print output
public_key:: 022FA613294CD13FFEA759D0185007DBE763331910509EF8F1635B4F84FA08AEE3
private_key:: -HIDDEN-
classic_address: raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q
```

#### Using the wallet

In this tutorial we only query details about the generated account from the XRP Ledger, but you can use the values in the `Wallet` instance to prepare, sign, and submit transactions with `xrpl-py`.   

##### Prepare

To prepare the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Prepare payment", end_before="# print prepared payment", language="py") }}



##### Sign

To sign the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Sign the transaction", end_before="# Print signed tx", language="py") }}



##### Send

To send the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Submit and send the transaction", end_before="# Print tx response", language="py") }}


##### Derive an X-address

You can use `xrpl-py`'s [`xrpl.core.addresscodec`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.core.addresscodec.html) module to derive an [X-address](https://xrpaddress.info/) from the `Wallet.classic_address` field:

{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Derive an x-address from the classic address:", end_before="# Look up info about your account", language="py") }}

The X-address format [packs the address and destination tag](https://github.com/xrp-community/standards-drafts/issues/6) into a more user-friendly value.


### {{n.next()}}. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](account-methods.html), [a specific transaction](tx.html), the state of a [current or a historical ledger](ledger-methods.html), and [the XRP Ledger's decentralized exhange](path-and-order-book-methods.html). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](reliable-transaction-submission.html).  

Here, we'll use `xrpl-py`'s [`xrpl.account`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.html) module to look up information about the [wallet we generated](#2-generate-wallet) in the previous step.


{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Look up info about your account", language="py")  }}



### {{n.next()}}. Putting it all together

Using these building blocks, we can create a simple Python app that:

1. Generates a wallet on the Testnet.
2. Connects to the XRP Ledger.
3. Looks up and prints information about the account you created.


```python
{% include '_code-samples/xrpl-py/get-acct-info.py' %}
```

To run the app, you can copy and paste the code into an editor or IDE and run it from there. Or you could download the file from the [XRP Ledger Dev Portal repo](https://github.com/ripple/ripple-dev-portal/tree/master/content/_code-samples/xrpl-py) and run it locally:


```sh
git clone git@github.com:ripple/xrpl-dev-portal.git
cd xrpl-dev-portal/content/_code-samples/xrpl-py/get-acct-info.py
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

* `account_data.Balance` — This is the account's balance of [XRP, in drops][]. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](transaction-cost.html#current-transaction-cost) for a given transaction.

* `validated` — Indicates whether the returned data is from a [validated ledger](ledgers.html#open-closed-and-validated-ledgers). When inspecting transactions, it's important to confirm that [the results are final](finality-of-results.html) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](reliable-transaction-submission.html).

For a detailed description of every response field, see [account_info](account_info.html#response-format).


## Keep on building

Now that you know how to use `xrpl-py` to connect to the XRP Ledger, generate a wallet, and look up information about an account, you can also use `xrpl-py` to:

* [Send XRP](send-xrp.html).
* [Set up secure signing](set-up-secure-signing.html) for your account.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
