---
category: 2023
date: 2023-07-05
labels:
    - xrpl-py Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Migration Guide: Upgrading to xrpl-py Version 2.0.0
_by Team RippleX_

We are excited to introduce xrpl-py version 2.0.0, which brings several improvements and new features, especially for the `Wallet` class. However, this update includes some breaking changes that require modifications to your existing code. This migration guide will help you navigate through the necessary changes to ensure a smooth transition.

<!-- BREAK -->

## Summary of Breaking Changes

1. Simplifying signing and submitting functions:
    - Replacing `send_reliable_submission` with `submit_and_wait`
    - Shortening function names for `submit_transaction` and `safe_sign_..._transaction` functions
    - Updating parameter order for `autofill_and_sign` and `sign_and_submit` functions to match `submit_and_wait`

2. Revamping the `Wallet` class:
    - Removing the sequence field from `Wallet`
    - Changing the constructor to use public and private keys instead of seeds
    - Updating class methods to use the faster `Ed25519` cryptographic algorithm by default
    - Adding support for various key representation methods (for example, [XLS-12 Secret Numbers](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-12))

3. Other fixes:
    - Splitting `AccountSetFlags` into two enums: `AccountSetAsfFlags` and `AccountSetFlags`
    - Making the `sign` method synchronous by removing the `check_fee` parameter
    - Updating `XRP.to_amount()` to assume the given amount is in XRP instead of drops (and to convert to drops)

## Detailed Explanation of Changes

Optionally, [jump to the migration steps](#detailed-migration-steps). 

### 1. Simplifying Signing/Submitting Functions

1. Replacing `send_reliable_submission` with `submit_and_wait`
2. Shortening names for `submit_transaction` and `safe_sign_..._transaction` functions
3. `autofill_and_sign` and `sign_and_submit` have updated their parameter order to match `submit_and_wait` (following the order `transaction`, `client`, `wallet`)

Previously, sending a transaction always involved using three separate functions (`autofill`, `sign`, and `send_reliable_submission`) which made for a poor onboarding experience. We now have a single function called `submit_and_wait` that incorporates these steps and follows the syntax used in xrpl.js. `submit_and_wait` does everything `send_reliable_submission` did and more, and so is fully replacing `send_reliable_submission`.

In order to make code more readable, we've also shortened the name of 4 functions which started with `safe_sign...` or ended with `transaction`. Beyond that, we also enforced a consistent parameter order of `transaction`, `client`, `wallet` to avoid having some submit functions have a different interface than others. (`submit_and_wait` requires `wallet` to be after `client` because it's an optional parameter, so we updated all the other functions to match)

### 2. Revamping `Wallet`

1. Removing `sequence` from `Wallet`
2. (non-breaking) We added support for many more ways to represent your keys
3. `Wallet` class methods now use the faster `Ed25519` algorithm by default.
4. Seed generation now uses hex strings instead of `UTF-8` strings

We've revamped `Wallet` to better support its goal of making managing your keys easy. As part of that, we removed the unnecessary `sequence` field, and made it so you can create a `Wallet` with whatever form your keys are in. That includes secrets, public/private key pairs, entropy, or secret numbers. 

The default encoding for keys has been updated from `secp256k1` to `ed25519` since it has better performance. You can still specify that you would like to use the old encoding by including `algorithm=secp256k1` in any of the new `Wallet` generator functions. 

Lastly, as part of this revamp, we fixed a bug where seed generation was only accepting `UTF-8` strings, which limited the range of random input you could provide to a subset of all possible hex string inputs.

### 3. Other Fixes
1. Splitting `AccountSetFlags` into two enums
2. Making `sign` synchronous by removing `check_fee` from it

`AccountSetFlags` has been split into two enums: `AccountSetAsfFlags` contains unique `'ASF...'` flags for AccountSet transactions, while `AccountSetFlags` aligns with our standard transaction flag naming convention. This separation resolves a bug where both types of flags were combined in a single enum.

Previously `sign` had an optional check that used the `Client` to see if the `fee` used in a transaction was way too high. This made the function asynchronous when it didn't have to be. So, we moved that check into higher level functions to make `sign` synchronous and clearly offline. 

## Detailed Migration Steps

These will show line for line how you can update your code in response to these changes to achieve the same behavior you had before.

### Simplified signing/submitting functions

#### `send_reliable_submission` -> `submit_and_wait`

**Before:**
```python
# Sign the transaction locally
signed_tx = safe_sign_and_autofill_transaction(tx, test_wallet, client)
# Submit transaction and verify its validity on the ledger
response = send_reliable_submission(signed_tx, client)
```

**After:**

```python
# Sign and submit the transaction and verify its validity on the ledger
response = submit_and_wait(tx, client, test_wallet)
```

**Tip:** You can also use `submit_and_wait` as a direct replacement for `send_reliable_submission` if you want to handle autofill and signing separately from transaction submission. 

#### `submit_transaction` -> `submit`

**Before:**

```python
response = await submit_transaction(transaction, client)
```

**After:**

```python
response = await submit(transaction, client)
```

#### `safe_sign_and_submit_transaction` -> `sign_and_submit`

**Before:**

```python
signed = safe_sign_and_submit_transaction(transaction, wallet, client)
```

**After:**

```python
signed = sign_and_submit(transaction, client, wallet)
```

**Tip:**
Note that the order of parameters changed! `client` is before `wallet` now to match `submit_and_wait`'s interface.

#### `safe_sign_transaction` -> `sign`

**Before:**

```python
signed = safe_sign_transaction(transaction, wallet)
```

**After:**

```python
signed = sign(transaction, wallet)
```

#### `safe_sign_and_autofill_transaction` -> `autofill_and_sign`

**Before:**

```python
signed = safe_sign_and_autofill_transaction(transaction, wallet, client)

```

**After:**

```python
signed = autofill_and_sign(transaction, client, wallet)
```

**Tip:**
Note that the order of parameters changed! `client` is before `wallet` now to match `submit_and_wait`'s interface.

### `Wallet` Changes

#### Initializing a `Wallet`

**Before:**

```python
wallet = Wallet(seed="s...", sequence=0)
```

**After:**

```python
wallet = Wallet(privateKey, publicKey)
# Or any of the below!
wallet = Wallet.from_seed(seed="s...", algorithm="secp256k1") # The default algorithm is now ED25519, so make sure to set the algorithm to be backwards compatible with existing seeds.
wallet = Wallet.from_entropy(entropy="m19f2...")
wallet = Wallet.from_secret_numbers(["554872", "394230", "209376", "323698", "140250", "387423", "652803", "258676"])
# Alternatively you can use the secret numbers as a single string
wallet = Wallet.from_secret_numbers("554872 394230 209376 323698 140250 387423 652803 258676")

```

**Tip:**
You can now also set a [regular key](https://xrpl.org/cryptographic-keys.html#regular-key-pair) - so if you change the private key for your account on the XRPL, that can be represented in your `Wallet` object!

#### Getting Your Next Sequence

**Before:**

```python
Payment(
    account=wallet.classic_address,
    amount="10"
    sequence=wallet.sequence,
)
wallet.sequence += 1
```

**After:**

```python
Payment(
    account=wallet.address,
    amount="10",
    sequence=get_next_valid_seq_number(wallet.address, client),
)
```

**Tip:** You can also omit the `sequence` field and use `autofill` before signing your transaction. The `submit_and_wait` method does this automatically when you give it an unsigned transaction.


#### `Wallet.classic_address` -> `Wallet.address`

**Before:**

```python
Payment(
    account=wallet.classic_address,
    amount="10"
)
```

**After:**

```python
Payment(
    account=wallet.address,
    amount="10",
)
```
**Tip:** `classic_address` still exists as an alias, and both are now also read-only since they should never change.

### Other changes

#### AccountSetFlags

**Before:**

```python
from xrpl.models.transactions AccountSetFlag
AccountSetFlag.ASF_DISABLE_MASTER
```

**After:**

```pythonfrom 
xrpl.models.transactions AccountSetAsfFlag
AccountSetAsfFlag.ASF_DISABLE_MASTER
```

#### Core Key Pair Seed Generation (UTF-8 -> any string)

**Before:**

```python
DUMMY_BYTES = b"\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10"
seed = generate_seed(DUMMY_BYTES.decode("UTF-8"))
```
**After:**

```python
DUMMY_BYTES = b"\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10"
seed = generate_seed(DUMMY_BYTES.hex())
```

**Note:** If your string is longer than 16 bytes, you must truncate it before passing it into `generate_seed()`. Previously, the method would quietly truncate it for you, but now it is explicit in order to raise errors when the wrong data type is provided.

#### Sign (async -> sync)

**Before:**

```python
signed_tx = await sign(autofilled_tx, wallet, check_fee = True, multisign = True)
```

**After:**

```python
signed_tx = sign(autofilled_tx, wallet, multisign = True)
```

#### XRP.to_amount() from str() wrapper to xrp_to_drops() wrapper
Note: This only applies to the specific `XRP` object used in `IssuedCurrencies` which does not have an associated amount. Other XRP Amounts are specified as drops in a string, and are unaffected.

**Before:**
```python
XRP().to_amount(12000000) # -> "12000000" 
```

**After:**
```python
XRP().to_amount(12) # -> "12000000"
```

### Deprecated functions that were removed

There were four functions which simply wrapped a rippled request, and so were removed as part of this release. The recommended method of getting that information is to directly use `client.request` with the corresponding request type.

#### `get_account_info` -> `AccountInfo` request
 
**Before:**
```python
account_info = await get_account_info(address, client, ledger_index)
```

**After:**
```python
account_info = await client.request(AccountInfo(
            account=address,
            ledger_index=ledger_index,
        ))
```

#### `get_account_transactions` -> `AccountTx` request

**Before:**
```python
transactions = await get_account_transactions(address, client)
```

**After:**
```python
response = await client.request(AccountTx(account=address))
transactions = response.result["transactions"]
```

#### `get_account_payment_transactions` -> `AccountTx` request

**Before:**
```python
transactions = await get_account_payment_transactions(address, client)
```

**After:**
```python
response = await client.request(AccountTx(account=address))
transactions = response.result["transactions"]
payment_transactions = [tx for tx in transactions if tx["tx"]["TransactionType"] == "Payment"]
```

#### `get_transaction_from_hash` -> `Tx` request

**Before:**
```python
response = await get_transaction_from_hash(tx_hash, client, binary, min_ledger, max_ledger)
```

**After:**
```python
response = await client.request(Tx(
            transaction=tx_hash,
            binary=binary,
            max_ledger=max_ledger,
            min_ledger=min_ledger,
        ))
```

## Start Building

You can install this version of xrpl-py using pip:

```sh
pip install xrpl-py
```

**Note:** The xrpl-py 2.0 release does not include Automated Market-Maker (AMM) or Sidechains functionality. Those are on separate beta branches.

If you're just getting started using xrpl-py, see [Get Started Using Python](https://xrpl.org/get-started-using-python.html), the [xrpl-py source code repository](https://github.com/XRPLF/xrpl-py), or [reference documentation](https://xrpl-py.readthedocs.io/en/stable/).

If you run into any problems, please [make an issue](https://github.com/XRPLF/xrpl-py/issues) on the xrpl-py repo so we can improve the experience for everyone using xrpl-py.
