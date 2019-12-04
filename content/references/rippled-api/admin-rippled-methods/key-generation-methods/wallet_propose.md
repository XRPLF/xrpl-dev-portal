# wallet_propose
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/WalletPropose.cpp "Source")

Use the `wallet_propose` method to generate a key pair and XRP Ledger address. This command only generates key and address values, and does not affect the XRP Ledger itself in any way. To become a funded address stored in the ledger, the address must [receive a Payment transaction](accounts.html#creating-accounts) that provides enough XRP to meet the [reserve requirement](reserves.html).

*The `wallet_propose` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!* (This command is restricted to protect against people sniffing network traffic for account secrets, since admin commands are not usually transmitted over the outside network.)

[Updated in: rippled 0.31.0][]

### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket (with key type)*

```
{
    "command": "wallet_propose",
    "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "key_type": "secp256k1"
}
```

*WebSocket (no key type)*

```
{
    "command": "wallet_propose",
    "passphrase": "masterpassphrase"
}
```

*JSON-RPC (with key type)*

```
{
    "method": "wallet_propose",
    "params": [
        {
            "seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
            "key_type": "secp256k1"
        }
    ]
}
```

*JSON-RPC (no key type)*

```
{
    "method": "wallet_propose",
    "params": [
        {
            "passphrase": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
        }
    ]
}
```

*Commandline*

```
#Syntax: wallet_propose [passphrase]
rippled wallet_propose masterpassphrase
```

<!-- MULTICODE_BLOCK_END -->

The request can contain the following parameters:

| `Field`      | Type   | Description                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `key_type`   | String |Which [signing algorithm](cryptographic-keys.html#signing-algorithms) to use to derive this key pair. Valid values are `ed25519` and `secp256k1` (all lower case). The default is `secp256k1`. |
| `passphrase` | String | _(Optional)_ Generate a key pair and address from this seed value. This value can be formatted in [hexadecimal][], the XRP Ledger's [base58][] format, [RFC-1751][], or as an arbitrary string. Cannot be used with `seed` or `seed_hex`. |
| `seed`       | String | _(Optional)_ Generate the key pair and address from this seed value in the XRP Ledger's [base58][]-encoded format. Cannot be used with `passphrase` or `seed_hex`. |
| `seed_hex`   | String | _(Optional)_ Generate the key pair and address from this seed value in [hexadecimal][] format. Cannot be used with `passphrase` or `seed`. |

You must provide **at most one** of the following fields: `passphrase`, `seed`, or `seed_hex`. If you omit all three, `rippled` uses a random seed.

**Note:** The commandline version of this command cannot generate [Ed25519](https://ed25519.cr.yp.to/) keys.

#### Specifying a Seed

For most cases, you should use a seed value generated from a strong source of randomness. Anyone who knows the seed value for an address has full power to [send transactions signed by that address](transaction-basics.html#authorizing-transactions). Generally, running this command with no parameters is a good way to generate a random seed.

Cases where you would specify a known seed include:

* Re-calculating your address when you only know the seed associated with that address
* Testing `rippled` functionality

If you do specify a seed, you can specify it in any of the following formats:

* As a secret key string in the XRP Ledger's [base58][] format. Example: `snoPBrXtMeMyMHUVTgbuqAfg1SUTb`.
* As an [RFC-1751][] format string (secp256k1 key pairs only). Example: `I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE`.
* As a 128-bit [hexadecimal][] string. Example: `DEDCE9CE67B451D852FD4E846FCDE31C`.
* An arbitrary string to use as a seed value. For example: `masterpassphrase`.

[RFC-1751]: https://tools.ietf.org/html/rfc1751
[hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "key_type": "secp256k1",
    "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
    "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
    "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
    "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
  }
}
```

*JSON-RPC*

```
{
    "result": {
        "account_id": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "key_type": "secp256k1",
        "master_key": "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
        "master_seed": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
        "master_seed_hex": "DEDCE9CE67B451D852FD4E846FCDE31C",
        "public_key": "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
        "public_key_hex": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "status": "success"
    }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "account_id" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      "key_type" : "secp256k1",
      "master_key" : "I IRE BOND BOW TRIO LAID SEAT GOAL HEN IBIS IBIS DARE",
      "master_seed" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
      "master_seed_hex" : "DEDCE9CE67B451D852FD4E846FCDE31C",
      "public_key" : "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw",
      "public_key_hex" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing various important information about the new (potential) account, including the following fields:

| `Field`           | Type   | Description                                     |
|:------------------|:-------|:------------------------------------------------|
| `key_type`        | String | Which [signing algorithm](cryptographic-keys.html#signing-algorithms) was used to derive this key pair. Valid values are `ed25519` and `secp256k1` (all lower case). |
| `master_seed`     | String | This is the private key of the key pair. The master seed from which all other information about this account is derived, in the XRP Ledger's [base58][] encoded string format. Typically, you use the key in this format to sign transactions. |
| `master_seed_hex` | String | The master seed, in hex format. A simple, widely-supported way to represent the private key. Can be used to sign transactions. |
| `master_key`      | String | **DEPRECATED** The master seed, in [RFC-1751][] format. An easier to remember, easier-to-write-down version of the private key. Can be used to sign transactions. **Note:** The `rippled` implementation reverses the byte order of the key after decoding from RFC-1751 and before encoding it to RFC-1751; if you read or write keys for use with the XRP Ledger using a different RFC-1751 implementation, you must do the same to be compatible with `rippled`'s RFC-1751 encoding. |
| `account_id`      | String | The [Address][] of the account in the XRP Ledger's [base58][] format. This is not the public key, but a hash-of-a-hash of it. It also has a checksum so a typo almost certainly results in an invalid address rather than a valid, but different address. This is the primary identifier of an account in the XRP Ledger. You tell people this to get paid, and use it in transactions to indicate who you are and who you're paying, trusting, and so forth. [Multi-signing lists](multi-signing.html) also use these to identify other signers. |
| `public_key`      | String | The public key of the key pair, in the XRP Ledger's [base58][] encoded string format. Derived from the `master_seed`. |
| `public_key_hex`  | String | This is the public key of the key pair, in hexadecimal. Derived from the `master_seed`. To validate the signature on a transaction, `rippled` needs this public key. That's why the format for a signed transaction includes the public key in the `SigningPubKey` field. |
| `warning`         | String | (May be omitted) If the request specified a seed value, this field provides a warning that it may be insecure. [New in: rippled 0.32.0][] |

You can also use this method to generate a key pair to use as a regular key pair for an account. You assign a regular key pair to an account to be able to sign most transactions with it, while keeping your master key pair offline whenever possible.

In addition to using it as a regular key pair, you can also use it as a member of a multi-signing list (SignerList).

For more information about master and regular key pairs, see [Cryptographic Keys](cryptographic-keys.html)

For more information about multi-signing and signer lists, see [Multi-Signing](multi-signing.html).


### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly.
* `badSeed` - The request specified a disallowed seed value (in the `passphrase`, `seed`, or `seed_hex` fields), such as an empty string, or a string resembling a XRP Ledger address.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
