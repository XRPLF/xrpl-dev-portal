---
html: get-started-python.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Get Started Using Python
blurb: Build a simple Python app that interacts with the XRP Ledger.
cta_text: Build Apps
---

# Get Started Using Python

This tutorial walks you through the basics of building an XRP Ledger-connected application using [xrpl-py](https://github.com/xpring-eng/xrpl-py), a [Python](https://www.python.org) library that makes it easy to integrate XRP Ledger functionality into your apps.  


## Learning goals

In this tutorial, you'll learn: 

* How to set up your environment for Python development. See [](python-env-setup.html).
* The basic building blocks of XRP Ledger-based applications.
* How to generate keys.
* How to connect to the XRP Ledger.
* How to submit a transaction, including preparing and signing it. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 

## Requirements

For information about setting up your environment for Python development, see [](xref:python-env-setup.md). 

## Start building
{% set n = cycler(* range(1,99)) %}

When you're working with the XRP Ledger, there are a few things you'll need to manage with your app or integration, whether you're adding XRP into your [wallet](xref: wallets.md), integrating with the [decentralized exchange](xref: decentralized-exchange.md), or [issuing and managing tokens](xref:issued-currencies.md). This tutorial walks you through the patterns common to all of these use cases and provides sample code for implementing them. 

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Generate keys.](#generate-keys)
2. [Connect to the XRP Ledger.](#connect)
3. [Query the XRP Ledger.](#query)
4. [Submit a transaction.](#submit-transaction) 
5. [Verify results.](#verify-results) 

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

To make queries that you can use in your app and submit transactions, you need to establish a connection to the XRP Ledger. There are a few ways to do this. The following sections describe each option in more detail. 

**Warning:**  Never use publicly available servers to sign transactions. For more information about security and signing, see [](xref: set-up-secure-signing.md).

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, Ripple recommends **not** using the same addresses on Testnet/Devnet and Mainnet.


If you only want to explore the XRP Ledger, you can  use the [Ledger Explorer](https://livenet.xrpl.org/) to see the Ledger progress in real-time and dig into specific accounts or transactions. 


```py
# Define the URL of the server you want to use
JSON_RPC_URL = "http://s1.ripple.com:51234/"
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
