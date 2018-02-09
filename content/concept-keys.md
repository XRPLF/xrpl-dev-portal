# Understanding Master and Regular Keys

In the XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. A digital signature is created based on a key pair associated with the transaction's sending account.

You generate a key pair using the `wallet_propose` method. Here's a sample `wallet_propose` response:

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

As you can see, in the context of the XRP Ledger, a key pair is composed of a bit more than a private key and a public key.

**Private Key**

The `master_key`, `master_seed`, and `master_seed_hex` are the private key in various formats, all of which can be used to sign transactions. Despite being prefixed with `master_`, these keys are not necessarily the master keys for an account. In this context, the `master_` prefix refers more to the keys' role as private keys.

**Public Key**

The `public_key` and `public_key_hex` are the public key in various formats, with the `public_key_hex` being the public key corresponding to the private key that signed the transaction.

**account_id**

The `account_id` is [derived from the public key](concept-accounts.html#address-encoding) and designates the *potential* for an account to be created in the XRP Ledger. It is important to know that while an `account_id` exists, no actual account exists in the XRP Ledger until the `account_id` receives its first XRP payment. In addition, the `account_id` can't send any transactions until after it's received a transaction that funds and creates the account.

The `account_id` (without a funded account) can, however, be used as a regular key or a member of a signer list to authorize transactions for another account that does exist.

To create a funded account stored in the ledger, the `account_id` must [receive a `Payment` transaction](reference-transaction-format.html#creating-accounts) that provides enough XRP to meet the [reserve requirement](concept-reserves.html).

For more information about the `wallet_propose` response, see [`wallet_propose`](reference-rippled.html#wallet-propose).

You use this generated key pair in one of three ways: as master keys, regular keys, or [signer list members](tutorial-multisign.html).


## Master Keys

The master key pair, called a "master key," is composed of a private key and a public key. In addition to being able to sign all transactions that a regular key can, the master key's private key is the only key that can be used to perform the following actions:

* [Disable the master public key](reference-transaction-format.html#accountset-flags).

* Permanently give up the ability to [freeze](concept-freeze.html#no-freeze).

* Send a cost-0 [key reset transaction](concept-transaction-cost.html#key-reset-transaction).

The master key for an account is generated in the same [`wallet_propose`](reference-rippled.html#wallet-propose) response as the `account_id` of the account the master key is authorized to sign transactions for. Because the master key is generated in the same response, it is [intrinsically related](concept-accounts.html#address-encoding) to the `account_id`, which is derived from the `public_key_hex`.

This is as opposed to a regular key, which is also generated using the `wallet_propose` method, but which must be explicitly assigned as a regular key to an account. Because a regular key is explicitly assigned, it are not intrinsically related to the `account_id` of the account is are authorized to sign transactions for. For more information, see [Regular Keys](#regular-keys).

**Caution:** A master key cannot be changed, but it can be disabled. This means that if your master private key is compromised, rather than change it, you must [disable it](reference-transaction-format.html#accountset-flags).

This is a compelling reason to keep your master key offline and set up a regular key to sign transactions from your account instead.

Keeping your master key offline means not putting your master private key somewhere malicious actors can get access to it. For example, this can mean keeping it on an air-gapped machine that never connects to the internet, on a piece of paper stored in a safe, or in general, not within reach of a computer program that interacts with the internet at large. Ideally, a master key is used only on the most trusted of devices and for emergencies only, such as to change a regular key in the event of a possible or actual compromise.


## Regular Keys

The XRP Ledger allows an account to authorize a secondary key pair, called a "regular key," to sign future transactions, while keeping your master keys offline. If the private key of a regular key is compromised, you can remove or replace it without changing the rest of your account and re-establishing its relationships to other accounts. You can also rotate a regular key proactively. (Neither of those things is possible for the master key pair of an account, which is intrinsically linked to the account's address.)

You generate a key to use as a regular key using the [`wallet_propose`](reference-rippled.html#wallet-propose) method. However, unlike with [master keys](#master-keys), which are generated alongside and intrinsically related to the `account_id` of an account they support, you must explicitly create the relationship between a regular key and the account you want them to sign transactions for. You use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to assign a regular key to an account.

For a tutorial on assigning a regular key, see [Working with Regular Keys](tutorial-regular-keys.html).

Once you assign a regular key to an account, the account has two keys associated with it:

* A "master" key that is intrinsically related to the account's `account_id` and which you keep offline.
* A "regular" key that you've explicitly assigned to the account and which you use to sign transactions for the account.

You can assign one regular key to an account and use it to sign all transactions, except for the ones reserved for [master keys](#master-keys).

You can remove or change a regular key at any time. This means that if a regular private key is compromised (but the master private key is not), you can regain control of your account by simply removing or changing the regular key.

For a tutorial on changing or removing a regular key, see [Working with Regular Keys](tutorial-regular-keys.html).
