---
html: get-started-using-python.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Get Started Using Python
blurb: Build a simple Python app that interacts with the XRP Ledger.
cta_text: Build Apps
---

# Get Started Using Python

This tutorial walks you through the basics of building a very simple XRP Ledger-connected application using [`xrpl-py`](https://github.com/XRPLF/xrpl-py), a pure[Python](https://www.python.org) library that makes it easy to interact with the XRP Ledger using native Python models and methods.


## Learning goals

In this tutorial, you'll learn: 

* The basic building blocks of XRP Ledger-based applications.
* How to connect to the XRP Ledger.
* How to generate a wallet on the [Testnet](xrp-testnet-faucet.html).
* How to use the `xrpl-py` library to look up information about an account on the XRP Ledger. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 

## Requirements

The `xrpl-py` library supports [Python 3.7](https://www.python.org/downloads/) and later.

### Requirements for contributing to the library

If you want to contribute code to the library itself, install these dependencies to set up your development environment:

* [`pyenv`](~https://github.com/pyenv/pyenv)
* [`poetry`](~https://python-poetry.org/docs/)
* [`pre-commit`](~https://pre-commit.com/)


For more detailed information about setting up your environment and contributing, see [CONTRIBUTING](https://github.com/XRPLF/xrpl-py/blob/master/CONTRIBUTING.md) in the project repo. 


## Installation

<!--{# TODO: update link to go directly to package when it's available  #}-->

The [`xrpl-py` library](https://github.com/XRPLF/xrpl-py) is available on [PyPI](https://pypi.org/). Install with `pip`:


```py
pip3 install xrpl-py
```

## Start building
{% set n = cycler(* range(1,99)) %}

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP into your [wallet](wallets.html), integrating with the [decentralized exchange](decentralized-exchange.html), or [issuing tokens](issued-currencies.html). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them. 

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#connect)
1. [Generate a wallet.](#generate-wallet)
1. [Query the XRP Ledger.](#query)


### {{n.next()}}.  Generate keys


You need [keys](https://xrpl.org/cryptographic-keys.html) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html).

Otherwise, you should take care to store your keys and set up a [secure signing method](https://xrpl.org/set-up-secure-signing.html). 

<!-- MULTICODE_BLOCK_START -->

*Generate keypairs (xrpl-py)*

```py
# Generate private and public keys
# to manage your XRP Ledger account
def generateKeys():
    seed = keypairs.generate_seed()
    public, private = keypairs.derive_keypair(seed)
    CLASSIC_ACCOUNT = keypairs.derive_classic_address(public)
    print("Here's the public key: ", public)
    print("Here's the private key: ", private)
```
*Generate wallet (xrpl-py)*

```py
# Create an XRP Ledger wallet
# And create an x-address for the address
def createWallet():
    wallet = Wallet.generate_seed_and_wallet()
    address = wallet.classic_address
    xaddress = addresscodec.classic_address_to_xaddress(
                classic_address, tag, True
            )
    print("Classic address:", address)
    print("X-address:", xaddress)
```


<!-- MULTICODE_BLOCK_END -->

### {{n.next()}}. Connect

To make queries and submit transactions, you need to establish a connection to the XRP Ledger. To do this with `xrpl-py`, use the [`xrp.clients` module](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.clients.html):


```py
from xrpl.clients.json_rpc_client import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)
```


### {{n.next()}}. Generate wallet

You need [keys](https://xrpl.org/cryptographic-keys.html) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html).

Otherwise, you should take care to store your keys and set up a [secure signing method](https://xrpl.org/set-up-secure-signing.html). 

To make it easy to create a wallet on the Testnet , `xrpl-py` provides the [`generate_faucet_wallet`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method:


```py
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client)
```

This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.Wallet) that you can use to sign and submit transactions:


```py
seed: shtrT9cYoQNGDs2uvAnK1g459SEXX
pub_key: 033911717E99D025CB3BBE8A10E92263F7F94216D7AE3078A7FF1264B1C46F94FB
priv_key: 00CC00FB2F861EC00CC2282475AB8BF9687A06635499737F329784658978FF87E8
classic_address: rKm826nMCh25RK5zWmKgMp6EbGbkDoQN39
```

### {{n.next()}}. Query

Before you submit a transaction to the XRP Ledger, you should query it to check your account status and balances to make sure that the transaction will succeed. 


```py
# Look up information about your account
def getAcctInfo():
    client = JsonRpcClient(JSON_RPC_URL)
    acct_info = AccountInfo(
        account=address,
        ledger_index="current",
        queue=True,
        strict=True,
    )
    response = client.request(acct_info)
    print("response.status: ", response.status)
    print("response.result: ", response.result)
    print("response.id: ", response.id)
    print("response.type: ", response.type)
```


### {{n.next()}}. Submit transaction

Submitting a transaction to the XRP inolves three distinct steps:

* Preparing the transaction.
* Signing the transaction.
* Submitting the transaction to an XRP Ledger node. 

With `xrpl-py`, you can combine the these steps by using the `tx.to_dict` function and the `Sign` model. 


```python
 # Prepare the tx by formatting it into
# the shape expected by the XRP Ledger
# and signing it
def prepareSignSubmitTx():
    CLASSIC_ACCOUNT.next_sequence_num = get_next_valid_seq_number(CLASSIC_ACCOUNT, JSON_RPC_CLIENT)
    tx = Transaction(
        account=_ACCOUNT,
        fee=_FEE,
        sequence=CLASSIC_ACCOUNT.next_seuqnece_num + 10,
        transaction_type=TransactionType.
    )
    value = tx.to_dict()["payment_trannsaction"]
    signed_tx = Sign(
        transaction=value,
        seed=_SEED,
        seed_hex=_SEED_HEX,
    )
    print("Signed transaction: ", signed_tx)
    payment_transaction = Payment.from_dict(value)
    response = send_reliable_submission(
        payment_transaction, CLASSIC_ACCOUNT, JSON_RPC_URL
        )
    print("response.result.validated: ", response["validated"])
    print("response.result.meta: ", response.result["meta"]["TransactionResult"], "tesSUCCESS")
```


### {{n.next()}}. Verify results

To ensure that your transaction has succeeded in a validated ledger, which means that the results are final, you can add simple logic to your submit function:


```python
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print("Transaction not yet validated")
else:
    print("Validated!")  
```



### {{n.next()}}. Putting it all together

Using these building blocks, we can create a simple app that:

1. Generates a wallet.
2. Connects to the XRP Ledger. 
3. Looks up information about your account. 
4. Sends XRP from one account to another.
5. Verifies the transaction in a validated ledger. 


```python
{% include '_code-samples/xrpl-py/simple-python-app.py' %}
```


## Next steps

<<TODO: Flesh out these steps>>

Try using `xrpl-py` to:

* Set Account Flags
* Issue a token on the Devnet
* Set up an escrow
