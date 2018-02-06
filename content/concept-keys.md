# Understanding Master and Regular Keys

In the XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. A digital signature is created based on a key pair associated with the transaction's sending account.

You generate a key pair using the `wallet_propose` method. Here's a sample `wallet_propose` response:

```
{
  "result": {
    "account_id": "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
    "key_type": "secp256k1",
    "master_key": "PRIV ATE KEY RFC 1751 XXX XXXX XXX XXXX XXX XXX XXXX",
    "master_seed": "PrivateKeyXXXXXXXXXXXXXXXXXXX",
    "master_seed_hex": "PrivateKeyHexXXXXXXXXXXXXXXXXXXX",
    "public_key": "aBQEK3r6hb8isnCWmortkNdv3MSMKP74o7gj3kHZQF9vDkbXo4Qs",
    "public_key_hex": "032D911AE9887278110A8FE25169546D4E95A82AF5EFA25525FC3FDFFDC5A8B604"
  },
  "status": "success",
  "type": "response"
}
```

As you can see, in the context of the XRP Ledger, a key pair is composed of a bit more than a private key and a public key.


#### Private Key

The `master_key`, `master_seed`, and `master_seed_hex` are the private key in various formats, all of which can be used to sign transactions. Despite being prefixed with `master_`, these keys are not necessarily the master keys for an account. In this context, the `master_` prefix refers more to the keys' role as private keys.


#### Public Key

The `public_key` and `public_key_hex` are the public key in various formats, with the `public_key_hex` being the public key used to sign transactions.

***TODO: Question: Okay, this is a nit of a clarification -- but I need to mention it to ensure that I understand how this works. When we talk about signing transactions - specifically authorizing transactions - from what I've seen of the `SetRegularKey` and `Payment` transactions, the sender must sign these transactions with a private key. This makes sense to me. In the paragraph above, we say that the `public_key_hex` is the "public key used to sign transactions." A sender cannot use a public key to sign a transaction, correct? Is what we are really trying to say that the `public_key_hex` value is the value that the XRP Ledger exposes publicly as the `SigningPubKey` to indicate the signer that authorized the transaction (the public-facing version of the private key?)***


#### `account_id`

The `account_id` is a [hash of the public key](concept-accounts.html#address-encoding) and designates the *potential* for an account to be created in the XRP Ledger. It is important to know that while an `account_id` exists, no actual account exists in the XRP Ledger until the `account_id` receives its first XRP payment. To create a funded account stored in the ledger, the `account_id` must [receive a `Payment` transaction](reference-transaction-format.html#creating-accounts) that provides enough XRP to meet the [reserve requirement](concept-reserves.html).

For more information about the `wallet_propose` response, see [`wallet_propose`](reference-rippled.html#wallet-propose).

You use this generated key pair in one of two ways: as master keys or as regular keys.


## Master Keys

Master keys have more powerful signing authority than regular keys. In addition to being able to sign all transactions that regular keys can, master keys are the only keys that can be used to perform the following actions:

* Use the master private key to [disable the master public key](reference-transaction-format.html#accountset-flags).
* Permanently give up the ability to [freeze counterparties](concept-freeze.html#no-freeze).

Master keys for an account are the keys that are generated in the same [`wallet_propose`](reference-rippled.html#wallet-propose) response as the `account_id` of the account the keys are authorized to sign transactions for. Because they are generated in the same response, the keys are [intrinsically related](concept-accounts.html#address-encoding) to the `account_id`, which is a hash-of-a-hash of the `public_key_hex`.

This is as opposed to regular keys, which are also generated using the `wallet_propose` method, but which must be manually assigned as regular keys to an account. Because regular keys are manually assigned, they are not intrinsically related to the `account_id` of the account they are authorized to sign transactions for. For more information, see [Regular Keys](#regular-keys).

**Caution:** Master keys cannot be changed, but they can be disabled. This means that if your master private key is compromised, rather than change it, you must [disable it](reference-transaction-format.html#accountset-flags).

***TODO: Toned down the alarmist language. LOL. I think I read https://ripple.com/build/issuing-operational-addresses/ and https://ripple.com/build/listing-xrp-exchange/#accounts and took it too far? So, just so I understand, in this use case we're talking about, the scenario in which the malicious actor disables the master keys before you do to take control of your account forever -- is that not applicable here? I think it would be good to be able to link to another doc location that fully describes what a compromise means in this context and how to recover from one -- does that exist?***

This is a compelling reason to keep your master keys offline and set up regular keys to sign transactions from your account instead.

Keeping your master keys offline means not putting your master private key somewhere malicious actors can get access to it. For example, this can mean keeping it on an air-gapped machine that never connects to the internet, on a piece of paper stored in a safe, or in general, not within reach of a computer program that interacts with the internet at large. Ideally, master keys are used only on the most trusted of devices and for emergencies only, such as to change regular keys in the event of a possible or actual compromise.


## Regular Keys

You assign regular keys to an account to be able to sign most transactions with them, while keeping your master keys offline.

You generate keys to use as regular keys using the [`wallet_propose`](reference-rippled.html#wallet-propose) method. However, unlike with [master keys](#master-keys), which are generated alongside and intrinsically related to the `account_id` of an account they support, you must manually create the relationship between regular keys and the account you want them to sign transactions for. You use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to assign regular keys to an account.

For a tutorial on assigning regular keys, see [Working with Regular Keys](tutorial-regular-keys.html).

Once you assign regular keys to an account, the account has two key pairs associated with it:

* "Master" keys that are intrinsically related to the account's `account_id` and which you keep offline.
* "Regular" keys that you've manually assigned to the account and which you use to sign transactions for the account.

You can assign one regular key pair to an account and use it to sign all transactions, except for the ones reserved for [master keys](#master-keys).

You can remove or change the regular keys at any time. This means that if a regular private key is compromised (but the master private key is not), you can regain control of your account by simply removing or changing the regular key pair.

For a tutorial on changing or removing regular keys, see [Working with Regular Keys](tutorial-regular-keys.html).
