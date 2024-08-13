---
category: 2022
date: 2022-12-13
labels:
    - xrpl-py Release Notes
theme:
    markdown:
        editPage:
            hide: true
author: Team RippleX
---
# Introducing xrpl-py version 2.0.0-beta.0

Today, [RippleX](https://ripple.com/ripplex/) and the [XRP Ledger Foundation (XRPLF)](https://foundation.xrpl.org/) are proud to present **xrpl-py version 2.0.0-beta.0**. This beta version introduces three new ways to generate wallets, regular key support, and some breaking changes to the `Wallet` class.

<!-- BREAK -->

## High Level Changes

The three main breaking changes made in this update are:

 - The sequence field has been removed from the `Wallet` class
 - Seed generation now uses hex strings instead of UTF-8 strings
 - `Wallet` class methods now use the Ed25519 algorithm by default.

The `Wallet` class previously included a sequence field to make sending transactions easier. In practice, it made things harder. You usually don't know the sequence number when you create a `Wallet` instance, and you needed to manually increment the number after each transaction. It is safer to get the sequence number from the ledger, the real source of truth, when you auto-fill transactions.

Generating seeds from an entropy string now takes in hex strings instead of UTF-8 strings. This was especially necessary to implement wallet generation from [XLS-12 Secret Numbers](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-12), commonly used by the Xaman app. xrpl-py used to treat entropy as a UTF-8 value, but that's problematic because not all byte strings are valid UTF-8 strings, preventing us from the full range of random entropies for seed generation.

Lastly, when you initialize a `Wallet` from a seed without specifying an algorithm, the library now uses Ed25519 by default since it has better performance and other convenient properties compared to the secp256k1 algorithm. Previously xrpl-py would try to interpret the algorithm from the seed. To use the old encoding, you can specify `algorithm=secp256k1` when initializing a `Wallet` object.


## Breaking Changes

`Wallet` Class

* Removed `sequence` field
* Changed constructor to take in public and private key as required parameters
* Changed class methods to use the Ed25519 cryptographic algorithm by default
* Changed `address` and `classic_address` fields to read only

Core Keypairs

* Changed the `generate_seed` method to take a hex string instead of a UTF-8 string
* Ed25519 key string is formatted with padded zeros if length is less than 32 bytes

## New Features

`Wallet` Class

* Added methods to generate wallet from seed/secret, entropy, and XLS-12 secret numbers
* Added support for regular key pairs
* Added the field `address` which is an alias for `classic_address`

## How to Migrate

### Wallet Sequence

**Before:**

```python
OfferCancel(
    account=WALLET.classic_address,
    sequence=WALLET.sequence,
    offer_sequence=OFFER.result["tx_json"]["Sequence"],
),
```

**After:**

```python
OfferCancel(
    account=WALLET.classic_address,
    sequence=get_next_valid_seq_number(WALLET.address, client),
    offer_sequence=OFFER.result["tx_json"]["Sequence"],
),
```

**Tip:** You can also omit the `sequence` field and use `autofill` before signing your transaction.

### Core Keypairs Seed Generation

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

**Note:** If your string is longer than 16 bytes, you must truncate it before passing it into `generate_seed()`

### Wallet Constructor

**Before:**

```python
wallet = Wallet("snoPBrXtMeMyMHUVTgbuqAfg1SUTb", sequence=1)
// wallet.classic_address: rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
```

**After:**

```python
wallet = Wallet.from_seed("snoPBrXtMeMyMHUVTgbuqAfg1SUTb", algorithm="secp256k1")
// wallet.address: rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
```

**Note:** If your seed previously used the secp256k1 algorithm to decode, and you don't specify it explicitly, `Wallet.from_seed()` returns a different classic address and public / private keys.

## Start Building

You can install this beta version using pip:

```sh
pip install xrpl-py==2.0.0b0
```

**Note:** This beta does not include Automated Market-Maker (AMM) or Sidechains functionality. This is only for testing Wallet changes.

If you're just getting started using xrpl-py, see [Get Started Using Python](https://xrpl.org/get-started-using-python.html), the [xrpl-py source code repository](https://github.com/XRPLF/xrpl-py/tree/xrpl-py-2.0), or [reference documentation](https://xrpl-py.readthedocs.io/en/stable/).

We hope you enjoy building the Internet of Value, and feel welcome to reach out to the XRP Ledger developer community if you have any questions or suggestions!
