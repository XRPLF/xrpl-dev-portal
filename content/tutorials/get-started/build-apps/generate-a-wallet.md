---
html: generate-a-wallet.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Build Apps
blurb: Learn how to generate a wallet.
cta_text: Build Apps
filters:
    - interactive_steps
    - include_code
---

# Generate a Wallet

To store value and execute transactions on the XRP Ledger, you need to create a wallet: a [set of keys]
(cryptographic-keys.html#key-components) and an [address](accounts.html#addresses) that's been [funded with 
enough XRP](accounts.html#creating-accounts) to meet the [account reserve](reserves.html). The address is 
the identifier of your account and you use the [private key](cryptographic-keys.html#private-key) to sign 
transactions that you submit to the XRP Ledger.


For testing and development purposes, you can use the [XRP Faucets](xrp-testnet-faucet.html) to generate 
keys and fund the account on the Testnet or Devnet. For production purposes, you should take care to store 
your keys and set up a [secure signing method](set-up-secure-signing.html).


To make it easy to create a wallet on the Testnet, `xrpl-py` provides the [`generate_faucet_wallet`](https://
xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.html#xrpl.wallet.generate_faucet_wallet) method:



{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Create a wallet using the testnet faucet:", end_before="# Create an account str from the wallet", language="py") }}


This method returns a [`Wallet` instance](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.wallet.
html#xrpl.wallet.Wallet):


```py
print(test_wallet)

# print output
public_key:: 022FA613294CD13FFEA759D0185007DBE763331910509EF8F1635B4F84FA08AEE3
private_key:: -HIDDEN-
classic_address: raaFKKmgf6CRZttTVABeTcsqzRQ51bNR6Q
```

#### Using the wallet

In this tutorial we only query details about the generated account from the XRP Ledger, but you can use the 
values in the `Wallet` instance to prepare, sign, and submit transactions with `xrpl-py`.   

##### Prepare

To prepare the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Prepare payment", end_before="# print prepared payment", language="py") }}



##### Sign

To sign the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Sign the transaction", end_before="# Print signed tx", language="py") }}



##### Send

To send the transaction:

{{ include_code("_code-samples/xrpl-py/prepare-payment.py", start_with="# Submit and send the transaction", 
end_before="# Print tx response", language="py") }}


##### Derive an X-address

You can use `xrpl-py`'s [`xrpl.core.addresscodec`](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.core.
addresscodec.html) module to derive an [X-address](https://xrpaddress.info/) from the `Wallet.
classic_address` field:

{{ include_code("_code-samples/xrpl-py/get-acct-info.py", start_with="# Derive an x-address from the classic address:", end_before="# Look up info about your account", language="py") }}

The X-address format [packs the address and destination tag](https://github.com/xrp-community/
standards-drafts/issues/6) into a more user-friendly value.

