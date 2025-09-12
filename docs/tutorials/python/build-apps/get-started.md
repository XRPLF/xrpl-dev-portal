---
seo:
    description: Build a Python app that interacts with the XRP Ledger.
top_nav_name: Python
top_nav_grouping: Get Started
labels:
  - Development
---

{% code-walkthrough
  filesets=[
    { 
      "files": ["/_code-samples/get-started/py/get-acct-info.py"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/py/requirements.txt","/_code-samples/get-started/py/get-acct-info.py", "/_code-samples/get-started/py/README.md"]
    }
  ]
%}

# Get Started Using Python Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using the [`xrpl-py`](https://github.com/XRPLF/xrpl-py) client library, a pure [Python](https://www.python.org) library built to interact with the XRP Ledger using native Python models and methods.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl-py`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl-py`.
- How to use the `xrpl-py` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a Python app.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- Have a basic understanding of Python.
- Have installed [Python 3.7](https://www.python.org/downloads/) or later.

## Source Code

Click **Download** on the top right of the code preview panel to download the source code.

## Steps

Follow the steps to create a simple application with `xrpl-py`.

### 1. Install Dependencies

{% step id="import-tag" %}
Start a new project by creating an empty folder, then move into that folder and set up a Python virtual environment with the necessary dependencies:

```sh
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install the xrpl-py library
pip install xrpl-py
```

Alternatively, if you're using the downloaded source code, you can install all dependencies from the `requirements.txt` file:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /step %}

### 2. Connect to the XRP Ledger

{% step id="connect-tag" %}
#### Connect to the XRP Ledger Testnet

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.html):

The sample code shows you how to connect to the Testnet, which is one of the available [parallel networks](../../../concepts/networks-and-servers/parallel-networks.md).
{% /step %}

{% step id="connect-mainnet-tag"%}
#### Connect to the XRP Ledger Mainnet

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

- By [installing the core server](../../../infrastructure/installation/index.md) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

    ```python
    from xrpl.clients import JsonRpcClient
    JSON_RPC_URL = "http://localhost:5005/"
    client = JsonRpcClient(JSON_RPC_URL)
    ```

    See the example [core server config file](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

- By using one of the available [public servers][]:

    ```python
    from xrpl.clients import JsonRpcClient
    JSON_RPC_URL = "https://s2.ripple.com:51234/"
    client = JsonRpcClient(JSON_RPC_URL)
    ```
{% /step %}

### 3. Get account

{% step id="get-account-create-wallet-tag" %}
#### Create and Fund a Wallet

To store value and execute transactions on the XRP Ledger, you need an account: a [set of keys](../../../concepts/accounts/cryptographic-keys.md#key-components) and an [address](../../../concepts/accounts/addresses.md) that's been [funded with enough XRP](../../../concepts/accounts/index.md#creating-accounts) to meet the [account reserve](../../../concepts/accounts/reserves.md). The address is the identifier of your account and you use the [private key](../../../concepts/accounts/cryptographic-keys.md#private-key) to sign transactions that you submit to the XRP Ledger.

{% admonition type="success" name="Tip" %}
For testing and development purposes, you can use the [XRP Faucets](/resources/dev-tools/xrp-faucets) to generate keys and fund the account on the Testnet or Devnet. For production purposes, you should take care to store your keys and set up a [secure signing method](../../../concepts/transactions/secure-signing.md). Another difference in production is that XRP has real worth, so you can't get it for free from a faucet.
{% /admonition %}

To create and fund an account on the Testnet, `xrpl-py` provides the [`generate_faucet_wallet`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method. This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.Wallet).
{% /step %}

{% step id="get-account-x-address-tag" %}
#### Derive an X-Address

You can use `xrpl-py`'s [`xrpl.core.addresscodec`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.core.addresscodec.html) module to derive an [X-address](https://xrpaddress.info/) from the `Wallet.address` field.

The X-address format [packs the address and destination tag](https://github.com/XRPLF/XRPL-Standards/issues/6) into a more user-friendly value.
{% /step %}

### 4. Query the XRP Ledger

{% step id="query-xrpl-tag" %}
You can query the XRP Ledger to get information about [a specific account](../../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../../concepts/transactions/reliable-transaction-submission.md).

Here, we use `xrpl-py`'s [`xrpl.account`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.html) module to look up information about the account we got in the previous step.
{% /step %}

### 5. Run the Application

{% step id="run-app-tag" %}
Finally, in your terminal, run the application like so:

```sh
python3 get-acct-info.py
```

You should see output similar to this example:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Attempting to fund address ranrY8twgDvEGjk8NnC8QsZY1NNyyDV2TZ
Faucet fund successful.
Wallet: ranrY8twgDvEGjk8NnC8QsZY1NNyyDV2TZ
Account Testnet Explorer URL: 
 https://testnet.xrpl.org/accounts/ranrY8twgDvEGjk8NnC8QsZY1NNyyDV2TZ

Generating an x-address from the classic address...
Classic address: ranrY8twgDvEGjk8NnC8QsZY1NNyyDV2TZ
X-address: T7CbHsaEVahiEif6dANCuF9WjZNPJi9K3QSnGAfeAyXGEeH

Getting account info...
Response Status:  ResponseStatus.SUCCESS
{
    "account_data": {
        "Account": "ranrY8twgDvEGjk8NnC8QsZY1NNyyDV2TZ",
        "Balance": "10000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "E509DE6E6DDE8DB14CE22E289B4AE31570040F0A9A8ACE5346B0B7C78C7F55CF",
        "PreviousTxnLgrSeq": 10564855,
        "Sequence": 10564855,
        "index": "C1AC96672DA422C2A68E51DCC158CDF8083898424051B583AC37788FF916CDE3"
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
    "ledger_hash": "E83D8A31D66ABBFB435BB899B1A21448A2BCE66BB22B47F065EF713A2305820C",
    "ledger_index": 10564855,
    "validated": true
}
```

The response fields that you want to inspect in most cases are:

- `account_data.Sequence` — This is the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions. With `xrpl-py`, you can use the [`get_next_valid_seq_number`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.account.html#xrpl.account.get_next_valid_seq_number) to get this automatically from the XRP Ledger. See an example of this usage in the project [README](https://github.com/XRPLF/xrpl-py#serialize-and-sign-transactions).

- `account_data.Balance` — This is the account's balance of [XRP, in drops][]. You can use this to confirm that you have enough XRP to send (if you're making a payment) and to meet the [current transaction cost](../../../concepts/transactions/transaction-cost.md#current-transaction-cost) for a given transaction.

- `validated` — Indicates whether the returned data is from a [validated ledger](../../../concepts/ledgers/open-closed-validated-ledgers.md). When inspecting transactions, it's important to confirm that [the results are final](../../../concepts/transactions/finality-of-results/index.md) before further processing the transaction. If `validated` is `true` then you know for sure the results won't change. For more information about best practices for transaction processing, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).

For a detailed description of every response field, see [account_info](../../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md#response-format).
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
    - [`xrpl-py` Reference](https://xrpl-py.readthedocs.io/en/latest/)
    - [Public API Methods](../../../references/http-websocket-apis/public-api-methods/index.md)
    - [API Conventions](../../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 Encodings](../../../references/protocol/data-types/base58-encodings.md)
    - [Transaction Formats](../../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

{% /code-walkthrough %}
