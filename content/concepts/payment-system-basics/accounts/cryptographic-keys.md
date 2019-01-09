# Cryptographic Keys

In the XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. <!-- STYLE_OVERRIDE: is authorized to -->

Every digital signature is based on a cryptographic key pair associated with the transaction's sending account. A key pair may be generated using any of the XRP Ledger's supported [cryptographic signing algorithms](#signing-algorithms). A key pair can be used as [master key pair](#master-key-pair), [regular key pair](#regular-key-pair) or a member of a [signer list](multi-signing.html), regardless of what algorithm was used to generate it.

**Warning:** It is important to maintain proper security over your private keys. Digital signatures are the only way of verifying to the XRP Ledger that you are authorized to send a transaction, and there is no privileged administrator who can undo or reverse any transaction that has been applied to the ledger. If someone else knows the private key of your XRP Ledger account, that person can create digital signatures to authorize any transaction the same as you could.

## Generating Keys

You generate a key pair using the [`wallet_propose`](wallet_propose.html) method. Here's a sample `wallet_propose` response:

```
{
  "result": {
    "account_id": "rDGnaDqJczDAjrKHKdhGRJh2G7zJfZhj5q",
    "key_type": "secp256k1",
    "master_key": "COON WARN AWE LUCK TILE WIRE ELI SNUG TO COVE SHAM NAT",
    "master_seed": "sstV9YX8k7yTRzxkRFAHmX7EVqMfX",
    "master_seed_hex": "559EDD35041D3C11F9BBCED912F4DE6A",
    "public_key": "aBQXEw1vZD3guCX3rHL8qy8ooDomdFuxZcWrbRZKZjdDkUoUjGVS",
    "public_key_hex": "0351BDFB30E7924993C625687AE6127034C4A5EBA78A01E9C58B0C46E04E3A4948"
  },
  "status": "success",
  "type": "response"
}
```

The response contains a key pair (a private key and a public key, in various formats) as well as an `account_id`.

**Private Key**

The `master_key`, `master_seed`, and `master_seed_hex` are the private key in various formats, all of which can be used to sign transactions. Despite being prefixed with `master_`, these keys are not necessarily the master keys for an account. In this context, the `master_` prefix refers more to the keys' role as private keys. The `master_seed` is the master seed from which all other information about this account is derived.

**Public Key**

The `public_key` and `public_key_hex` are the public key in various formats, with the `public_key_hex` being the public key corresponding to the private key that signed the transaction. Both the `public_key` and `public_key_hex` are directly derived from the `master_seed`.

**account_id**

The `account_id` is [derived from the public key](accounts.html#address-encoding) and designates the *potential* for an account to be created in the XRP Ledger. It is important to know that while an `account_id` exists, no actual account exists in the XRP Ledger until the `account_id` receives its first XRP payment. In addition, the `account_id` can't send any transactions until after it's received a transaction that funds and creates the account.

The `account_id` (without a funded account) can, however, be used as a [regular key](#regular-key-pair) or a [member of a signer list](multi-signing.html) to authorize transactions for another account that does exist.

To create a funded account stored in the ledger, the `account_id` must [receive a `Payment` transaction](payment.html#creating-accounts) that provides enough XRP to meet the [reserve requirement](reserves.html).

For more information about the `wallet_propose` response, see [`wallet_propose`](wallet_propose.html).

You can use this generated key pair in one of three ways: as a [master key pair](#master-key-pair), [regular key pair](#regular-key-pair), or [signer list member](multi-signing.html).

**Key Type**

The field `key_type` indicates what [cryptographic signing algorithm](#signing-algorithms) was used to generate this key pair. You can specify the `key_type` when you make the request to generate a key pair using the [wallet_propose method][].


## Master Key Pair

The master key pair is composed of a private key and a public key. In addition to being able to sign all transactions that a regular key pair can, the master key pair's private key is the only key that can be used to perform the following actions:

* [Disable the master public key](accountset.html).

* Permanently give up the ability to [freeze](freezes.html#no-freeze).

* Send a cost-0 [key reset transaction](transaction-cost.html#key-reset-transaction).

The master key pair for an account is generated in the same [`wallet_propose`](wallet_propose.html) response as the `account_id` of the account the master key pair is authorized to sign transactions for. Because the master key pair is generated in the same response, it is [intrinsically related](accounts.html#address-encoding) to the `account_id`, which is derived from the `public_key_hex`.

This is as opposed to a regular key pair, which is also generated using the `wallet_propose` method, but which must be explicitly assigned as a regular key pair to an account. Because a regular key pair is explicitly assigned, it is not intrinsically related to the `account_id` of the account it is authorized to sign transactions for. For more information, see [Regular Key Pair](#regular-key-pair).

**Caution:** A master key pair cannot be changed, but it can be disabled. This means that if your master private key is compromised, rather than change it, you must [disable it](accountset.html).

Because a master key pair cannot be changed and can only disabled in the event of a compromise, this is a compelling reason to keep your master key pair offline and set up a regular key pair to sign transactions from your account instead.

Keeping your master key pair offline means not putting your master private key somewhere malicious actors can get access to it. For example, this can mean keeping it on an air-gapped machine that never connects to the internet, on a piece of paper stored in a safe, or in general, not within reach of a computer program that interacts with the internet at large. Ideally, a master key pair is used only on the most trusted of devices and for emergencies only, such as to change a regular key pair in the event of a possible or actual compromise.


## Regular Key Pair

The XRP Ledger allows an account to authorize a secondary key pair, called a _regular key pair_, to sign future transactions, while keeping your master key pair offline. If the private key of a regular key pair is compromised, you can remove or replace it without changing the rest of your account and re-establishing its relationships to other accounts. You can also rotate a regular key pair proactively. (Neither of those things is possible for the master key pair of an account, which is intrinsically linked to the account's address.)

You generate a key pair to use as a regular key pair using the [`wallet_propose`](wallet_propose.html) method. However, unlike with a [master key pair](#master-key-pair), which is generated alongside and intrinsically related to the `account_id` of an account it supports, you must explicitly create the relationship between a regular key pair and the account you want it to sign transactions for. You use the [`SetRegularKey`](setregularkey.html) method to assign a regular key pair to an account.

For a tutorial on assigning a regular key pair, see [Assign a Regular Key Pair](assign-a-regular-key-pair.html).

After you assign a regular key pair to an account, the account has two key pairs associated with it:

* A master key pair that is intrinsically related to the account's `account_id` and which you keep offline.
* A regular key pair that you've explicitly assigned to the account and which you use to sign transactions for the account.

You can assign one regular key pair to an account and use it to sign all transactions, except for the ones reserved for the [master key pair](#master-key-pair).

You can remove or change a regular key pair at any time. This means that if a regular private key is compromised (but the master private key is not), you can regain control of your account by simply removing or changing the regular key pair.

For a tutorial on changing or removing a regular key pair, see [Assign a Regular Key Pair](assign-a-regular-key-pair.html).


## Signing Algorithms

Cryptographic key pairs are always tied to a specific signing algorithm, which defines the mathematical relationships between the private key and the public key. Cryptographic signing algorithms have the property that, given the current state of cryptographic techniques, it is "easy" to use a private key to calculate a matching public key, but it is effectively impossible to compute a matching private key by starting from a public key.

The XRP Ledger supports the following cryptographic signing algorithms:

| Key Type    | Algorithm | Description |
|-------------|-----------|---|
| `secp256k1` | [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) using the elliptic curve [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) | This is the scheme used in Bitcoin. The XRP Ledger uses these key types by default. |
| `ed25519` | [EdDSA](https://tools.ietf.org/html/rfc8032) using the elliptic curve [Ed25519](https://ed25519.cr.yp.to/) | This is a newer algorithm which has better performance and other convenient properties. Since Ed25519 public keys are one byte shorter than secp256k1 keys, `rippled` prefixes Ed25519 public keys with the byte `0xED` so both types of public key are 33 bytes. |

When you generate a key pair with the [wallet_propose method][], you can specify the `key_type` to choose which cryptographic signing algorithm to use to derive the keys. If you generated a key type other than the default, you must also specify the `key_type` when signing transactions.

The supported types of key pairs can be used interchangeably throughout the XRP Ledger as master key pairs, regular key pairs, and members of signer lists. The process of [deriving an address](accounts.html#address-encoding) is the same for secp256k1 and Ed25519 key pairs.

**Note:** Currently, you cannot sign [payment channel claims](use-payment-channels.html) with Ed25519 keys. This is a bug.

### Future Algorithms

In the future, Ripple expects to add new cryptographic signing algorithms to the XRP Ledger to keep up with developments in cryptography. For example, if it seems that quantum computers using [Shor's algorithm](https://en.wikipedia.org/wiki/Shor's_algorithm) (or something similar) will soon be practical enough to break elliptic curve cryptography, Ripple can add a cryptographic signing algorithm that isn't easily broken. As of early 2018, such "quantum-resistant" signing algorithms are relatively impractical and quantum computers are even more impractical, so Ripple has no immediate plans to add any specific algorithms.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
