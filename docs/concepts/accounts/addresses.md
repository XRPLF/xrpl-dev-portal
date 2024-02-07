---
html: addresses.html
parent: accounts.html
seo:
    description: Addresses uniquely identify XRP Ledger accounts, using base58 format.
labels:
  - Accounts
---
# Addresses

{% partial file="/docs/_snippets/data_types/address.md" /%}

Any valid address can [become an account in the XRP Ledger](index.md#creating-accounts) by being funded. You can also use an address that has not been funded to represent a [regular key](cryptographic-keys.md) or a member of a [signer list](multi-signing.md). Only a funded account can be the sender of a transaction.

Creating a valid address is a strictly mathematical task starting with a key pair. You can generate a key pair and calculate its address entirely offline without communicating to the XRP Ledger or any other party. The conversion from a public key to an address involves a one-way hash function, so it is possible to confirm that a public key matches an address but it is impossible to derive the public key from the address alone. (This is part of the reason why signed transactions include the public key _and_ the address of the sender.)


## Special Addresses

Some addresses have special meaning, or historical uses, in the XRP Ledger. In many cases, these are "black hole" addresses, meaning the address is not derived from a known secret key. Since it is effectively impossible to guess a secret key from only an address, any XRP possessed by black hole addresses is lost forever.


| Address                       | Name | Meaning | Black Hole? |
|-------------------------------|------|---------|-------------|
| `rrrrrrrrrrrrrrrrrrrrrhoLvTp` | ACCOUNT\_ZERO | An address that is the XRP Ledger's [base58][] encoding of the value `0`. In peer-to-peer communications, `rippled` uses this address as the issuer for XRP. | Yes |
| `rrrrrrrrrrrrrrrrrrrrBZbvji`  | ACCOUNT\_ONE | An address that is the XRP Ledger's [base58][] encoding of the value `1`. In the ledger, [RippleState entries](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md) use this address as a placeholder for the issuer of a trust line balance. | Yes |
| `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh` | The genesis account | When `rippled` starts a new genesis ledger from scratch (for example, in stand-alone mode), this account holds all the XRP. This address is generated from the seed value `masterpassphrase` which is [hard-coded](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184). | No |
| `rrrrrrrrrrrrrrrrrNAMEtxvNvQ` | Ripple Name reservation black-hole | In the past, Ripple asked users to send XRP to this account to reserve Ripple Names.| Yes |
| `rrrrrrrrrrrrrrrrrrrn5RM1rHd` | NaN Address | Previous versions of [ripple-lib](https://github.com/XRPLF/xrpl.js) generated this address when encoding the value [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) using the XRP Ledger's [base58][] string encoding format. | Yes |


## Address Encoding

**Tip:** These technical details are only relevant for people building low-level library software for XRP Ledger compatibility!

[[Source]](https://github.com/XRPLF/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Source")

XRP Ledger addresses are encoded using [base58][] with the _dictionary_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`. Since the XRP Ledger encodes several types of keys with base58, it prefixes the encoded data with a one-byte "type prefix" (also called a "version prefix") to distinguish them. The type prefix causes addresses to usually start with different letters in base58 format.

The following diagram shows the relationship between keys and addresses:

[{% inline-svg file="/docs/img/address-encoding.svg" /%}](/docs/img/address-encoding.svg "Master Public Key + Type Prefix → Account ID + Checksum → Address")

The formula for calculating an XRP Ledger address from a public key is as follows. For the complete example code, see [`encode_address.js`](https://github.com/XRPLF/xrpl-dev-portal/blob/master/_code-samples/address_encoding/js/encode_address.js). For the process of deriving a public key from a passphrase or seed value, see [Key Derivation](cryptographic-keys.md#key-derivation).

1. Import required algorithms: SHA-256, RIPEMD160, and base58. Set the dictionary for base58.

    ```
    'use strict';
    const assert = require('assert');
    const crypto = require('crypto');
    const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
    const base58 = require('base-x')(R_B58_DICT);

    assert(crypto.getHashes().includes('sha256'));
    assert(crypto.getHashes().includes('ripemd160'));
    ```

2. Start with a 33-byte ECDSA secp256k1 public key, or a 32-byte Ed25519 public key. For Ed25519 keys, prefix the key with the byte `0xED`.

    ```
    const pubkey_hex =
      'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
    const pubkey = Buffer.from(pubkey_hex, 'hex');
    assert(pubkey.length == 33);
    ```

3. Calculate the [RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD) hash of the SHA-256 hash of the public key. This value is the "Account ID".

    ```
    const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
    const pubkey_outer_hash = crypto.createHash('ripemd160');
    pubkey_outer_hash.update(pubkey_inner_hash.digest());
    const account_id = pubkey_outer_hash.digest();
    ```

4. Calculate the SHA-256 hash of the SHA-256 hash of the Account ID; take the first 4 bytes. This value is the "checksum".

    ```
    const address_type_prefix = Buffer.from([0x00]);
    const payload = Buffer.concat([address_type_prefix, account_id]);
    const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
    const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
    const checksum =  chksum_hash2.slice(0,4);
    ```

5. Concatenate the payload and the checksum. Calculate the base58 value of the concatenated buffer. The result is the address.

    ```
    const dataToEncode = Buffer.concat([payload, checksum]);
    const address = base58.encode(dataToEncode);
    console.log(address);
    // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN
    ```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
