---
html: cryptographic-keys.html
parent: accounts.html
blurb: Use cryptographic keys to approve transactions so the XRP Ledger can execute them.
---
# Cryptographic Keys

In the XRP Ledger, a digital signature _authorizes_ a [transaction](transaction-basics.html) to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger.

To make a digital signature, you use a cryptographic key pair associated with the transaction's sending account. A key pair may be generated using any of the XRP Ledger's supported [cryptographic signing algorithms](#signing-algorithms). A key pair can be used as a [master key pair](#master-key-pair), [regular key pair](#regular-key-pair) or a member of a [signer list](multi-signing.html), regardless of what algorithm was used to generate it.

**Warning:** It is important to maintain proper security over your cryptographic keys. Digital signatures are the only way of authorizing transactions in the XRP Ledger, and there is no privileged administrator who can undo or reverse any transactions after they have applied. If someone else knows the seed or private key of your XRP Ledger account, that person can create digital signatures to authorize any transaction the same as you could.

## Generating Keys

There are several ways to create a key pair:

- The [wallet_propose method][] in [the `rippled` server](the-rippled-server.html).
- The [`generateAddress()` method of ripple-lib](rippleapi-reference.html#generateaddress).
- Other [tools or wallet applications](software-ecosystem.html). <!-- TODO: link a "wallets" page when that gets added -->


## Key Components

A cryptographic key pair is a **private key** and a **public key** that are connected mathematically through a key derivation process. Each key is a number; the private key should be chosen using a strong source of randomness. The [cryptographic signing algorithm](#signing-algorithms) defines the key derivation process and sets constraints on the numbers that can be cryptographic keys.

When dealing with the XRP Ledger, you may also use some related values such as a passphrase, seed, account ID, or address.

{{ include_svg("img/cryptographic-keys.svg", "Diagram: Passphrase → Seed → Private Key → Public Key → Account ID ←→ Address") }}
_Figure: A simplified view of the relationship between cryptographic key values._

The passphrase, seed, and private key are **secrets**: if you know any of these values for an account, you can make valid signatures and you have full control over that account. If you own an account, be **very careful** with your account's secret information. If you don't have it, you can't use your account. If someone else can access it, they can take control of your account.

The public key, account ID, and address are public information. There are some situations where you might temporarily keep a public key to yourself, but eventually you need to publish it as part of a transaction so that the XRP Ledger can verify the signature and process the transaction.

For more technical details of how key derivation works, see [Key Derivation](#key-derivation).

### Passphrase

You can, optionally, use a passphrase or some other input as a way of choosing a seed or private key. This is less secure than choosing the seed or private key completely at random, but there are some rare cases where you want to do this. (For example, in 2018 "XRPuzzler" gave away XRP to the first person [to solve a puzzle](https://bitcoinexchangeguide.com/cryptographic-puzzle-creator-xrpuzzler-offers-137-xrp-reward-to-anyone-who-can-solve-it/); he used the puzzle's solution as the passphrase to an account holding the prize XRP.)

The passphrase is secret information, so you must protect it very carefully. Anyone who knows an address's passphrase has effectively full control over the address.

### Seed

A _seed_ value is a compact value that is used to [derive](#key-derivation) the actual private and public keys for an account. In a [wallet_propose method][] response, the `master_key`, `master_seed`, and `master_seed_hex` all represent the same seed value, in various formats. Any of these formats can be used to [sign transactions](transaction-basics.html#signing-and-submitting-transactions) in the [`rippled` APIs](rippled-api.html) and some [other XRP Ledger software](software-ecosystem.html). Despite being prefixed with `master_`, the keys this seed represents are not necessarily the master keys for an account; you can use a key pair as a regular key or a member of a multi-signing list as well.

The seed value is secret information, so you must protect it very carefully. Anyone who has knows an address's seed value has effectively full control over that address.

### Private Key

The _private key_ is the value that is used to create a digital signature. Most XRP Ledger software does not explicitly show the private key, and [derives the private key](#key-derivation) from the seed value when necessary. It is technically possible to save the private key instead of the seed and use that to sign transactions directly, but this usage is rare.

Just like the seed, the private key is secret information, so you must protect it very carefully. Anyone who has knows an address's private key has effectively full control over that address.

### Public Key

The _public key_ is the value used to verify the authenticity of a digital signature. The public key is derived from the private key as part of key derivation. In a [wallet_propose method][] response, the `public_key` and `public_key_hex` both represent the same public key value.

Transactions in the XRP Ledger must include the public keys so that the network can verify the transactions' signatures. The public key cannot be used to create valid signatures, so it is safe to share publicly.


### Account ID and Address

The **Account ID** is the core identifier for an [account](accounts.html) or a key pair. It is derived from the public key. In the XRP Ledger protocol, the Account ID is 20 bytes of binary data. Most XRP Ledger APIs represent the Account ID as an address, in one of two formats:

- A "classic address" writes an Account ID in [base58][] with a checksum. In a [wallet_propose method][] response, this is the `account_id` value.
- An "X-Address" combines an Account ID _and_ a [Destination Tag](source-and-destination-tags.html) and writes the combined value in [base58][] with a checksum.

The checksum in both formats is there so that small changes result in an invalid address, instead of changing it to refer to a different, but still potentially valid, account. This way, if you make a typo or a transmission error occurs, you don't send money to the wrong place.

It is important to know that not all Account IDs (or addresses) refer to accounts in the ledger. Deriving keys and addresses is purely a mathematical operation. For an account to have a record in the XRP Ledger, it must [receive a payment of XRP](accounts.html#creating-accounts) that funds its [reserve requirement](reserves.html). An account cannot send any transactions until after it has been funded.

Even if an Account ID or address does not refer to a funded account, you _can_ use that Account ID or address to represent a [regular key pair](#regular-key-pair) or a [member of a signer list](multi-signing.html).

### Key Type

The XRP Ledger supports more than one [cryptographic signing algorithm](#signing-algorithms). Any given key pair is only valid for a specific cryptographic signing algorithm. Some private keys may technically qualify as valid keys for more than one algorithm, but those private keys would have different public keys for each algorithm, and you should not reuse private keys anyway.

The `key_type` field in the [wallet_propose method][] refers to the cryptographic signing algorithm to use.


## Master Key Pair

The master key pair consists of a private key and a public key. The address of an account is derived from the account's master key pair, so they are [intrinsically related](accounts.html#address-encoding). You cannot change or remove the master key pair, but you can disable it.

The [wallet_propose method][] is one way of generating a master key pair. The response from this method shows the account's seed, address, and master public key together. For some other ways of setting up master key pairs, see [Set Up Secure Signing](set-up-secure-signing.html).

**Warning:** If a malicious actor learns your master private key (or seed), they have full control over your account, unless your master key pair is disabled. They can take all the money your account holds and do other irreparable harm. Treat your secret values with care!

Because changing a master key pair is impossible, you should treat it with care proportionate to the value it holds. A good practice is to [keep your master key pair offline](offline-account-setup.html) and set up a regular key pair to sign transactions from your account instead. By keeping the master key pair enabled but offline, you can be reasonably certain that no one can get access to it using the internet, but you can still go find it to use in an emergency.

Keeping your master key pair offline means not putting the secret information (passphrase, seed, or private key) anywhere that malicious actors can get access to it. In general, this means it is not within reach of a computer program that interacts with the internet at large. For example, you could keep it on an air-gapped machine that never connects to the internet, on a piece of paper stored in a safe, or have it completely memorized. (Memorization has some drawbacks, though, including making it impossible to pass they key on after you are dead.)



### Special Permissions

**Only** the master key pair can authorize transactions to do certain things:

- Send an account's very first transaction, because accounts cannot be initialized with

- Disable the master key pair. (You must set up at least one other method of [authorizing transactions](transaction-basics.html#authorizing-transactions) first.)

- Permanently give up the ability to [freeze](freezes.html#no-freeze).

- Send a special [key reset transaction](transaction-cost.html#key-reset-transaction) with a transaction cost of 0 XRP.

A regular key or [multi-signature](multi-signing.html) can do anything else the same as the master key pair. Notably, after you have disabled the master key pair, you can re-enable it using a regular key pair or multi-signature. You can also [delete an account](accounts.html#deletion-of-accounts) if it meets the requirements for deletion.


## Regular Key Pair

An XRP Ledger account can authorize a secondary key pair, called a _regular key pair_. After doing so, you can use either the [master key pair](#master-key-pair) or the regular key to authorize transactions. You can remove or replace your regular key pair at any time without changing the rest of your account.

A regular key pair can authorize most of the same types of transactions as the master key pair, with [certain exceptions](#special-permissions). For example, a regular key pair _can_ authorize a transaction to change the regular key pair.

A good security practice is to save your master private key somewhere offline, and use a regular key pair most of the time. As a precaution, you can change the regular key pair regularly. If a malicious user learns your regular private key, you can get the master key pair out of offline storage and use it to change or remove the regular key pair. This way, you can regain control of your account. Even if you are not fast enough to stop the malicious user from stealing your money, at least you don't need to move to a new account and re-create all your settings and relationships from scratch.

Regular key pairs have the same format as master key pairs. You generate them the same way (for example, using the [wallet_propose method][]). The only difference is that a regular key pair is not intrinsically tied to the account it signs transactions for. It is possible (but not a good idea) to use the master key pair from one account as the regular key pair for another account.

The [SetRegularKey transaction][] assigns or changes the regular key pair for an account. For a tutorial on assigning or changing a regular key pair, see [Assign a Regular Key Pair](assign-a-regular-key-pair.html).


## Signing Algorithms

Cryptographic key pairs are always tied to a specific signing algorithm, which defines the mathematical relationships between the secret key and the public key. Cryptographic signing algorithms have the property that, given the current state of cryptographic techniques, it is "easy" to use a secret key to calculate a matching public key, but it is effectively impossible to compute a matching secret key by starting from a public key. <!-- STYLE_OVERRIDE: easy -->

The XRP Ledger supports the following cryptographic signing algorithms:

| Key Type    | Algorithm | Description |
|-------------|-----------|---|
| `secp256k1` | [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) using the elliptic curve [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) | This is the same scheme Bitcoin uses. The XRP Ledger uses these key types by default. |
| `ed25519`   | [EdDSA](https://tools.ietf.org/html/rfc8032) using the elliptic curve [Ed25519](https://ed25519.cr.yp.to/) | This is a newer algorithm which has better performance and other convenient properties. Since Ed25519 public keys are one byte shorter than secp256k1 keys, `rippled` prefixes Ed25519 public keys with the byte `0xED` so both types of public key are 33 bytes. |

When you generate a key pair with the [wallet_propose method][], you can specify the `key_type` to choose which cryptographic signing algorithm to use to derive the keys. If you generated a key type other than the default, you must also specify the `key_type` when signing transactions.

The supported types of key pairs can be used interchangeably throughout the XRP Ledger as master key pairs, regular key pairs, and members of signer lists. The process of [deriving an address](accounts.html#address-encoding) is the same for secp256k1 and Ed25519 key pairs.


### Future Algorithms

In the future, it is likely that the XRP Ledger will need new cryptographic signing algorithms to keep up with developments in cryptography. For example, if quantum computers using [Shor's algorithm](https://en.wikipedia.org/wiki/Shor's_algorithm) (or something similar) will soon be practical enough to break elliptic curve cryptography, XRP Ledger developers can add a cryptographic signing algorithm that isn't easily broken. As of mid 2020, there's no clear first choice "quantum-resistant" signing algorithm and quantum computers are not yet practical enough to be a threat, so there are no immediate plans to add any specific algorithms. <!-- STYLE_OVERRIDE: will, easily -->


## Key Derivation

The process of deriving a key pair depends on the signing algorithm. In all cases, keys are generated from a _seed_ value that is 16 bytes (128 bits) in length. The seed value can be completely random (recommended) or it can be derived from a specific passphrase by taking the [SHA-512 hash][Hash] and keeping the first 16 bytes (similar to [SHA-512Half][], but keeping only 128 bits instead of 256 bits of the output).

### Sample Code

The key derivation processes described here are implemented in multiple places and programming languages:

- In C++ in the `rippled` code base:
    - [Seed definition](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/Seed.h)
    - [General & Ed25519 key derivation](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
    - [secp256k1 key derivation](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp)
- In Python 3 in [this repository's code samples section]({{target.github_forkurl}}/blob/{{target.github_branch}}/content/_code-samples/key-derivation/key_derivation.py).
- In JavaScript in the [`ripple-keypairs`](https://github.com/ripple/ripple-keypairs/) package.

### Ed25519 Key Derivation
[[Source]](https://github.com/ripple/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/protocol/impl/SecretKey.cpp#L203 "Source")

{{ include_svg("img/key-derivation-ed25519.svg", "Passphrase → Seed → Secret Key → Prefix + Public Key") }}

1. Calculate the [SHA-512Half][] of the seed value. The result is the 32-byte secret key.

    **Tip:** All 32-byte numbers are valid Ed25519 secret keys. However, only numbers that are chosen randomly enough are secure enough to be used as secret keys.

2. To calculate an Ed25519 public key, use the standard public key derivation for [Ed25519](https://ed25519.cr.yp.to/software.html) to derive the 32-byte public key.

    **Caution:** As always with cryptographic algorithms, use a standard, well-known, publicly-audited implementation whenever possible. For example, [OpenSSL](https://www.openssl.org/) has implementations of core Ed25519 and secp256k1 functions.

3. Prefix the 32-byte public key with the single byte `0xED` to indicate an Ed25519 public key, resulting in 33 bytes.

    If you are implementing code to sign transactions, remove the `0xED` prefix and use the 32-byte key for the actual signing process.

4. When serializing an account public key to [base58][], use the account public key prefix `0x23`.

    Validator ephemeral keys cannot be Ed25519.

### secp256k1 Key Derivation
[[Source]](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/SecretKey.cpp "Source")

{{ include_svg("img/key-derivation-secp256k1.svg", "Passphrase → Seed → Root Key Pair → Intermediate Key Pair → Master Key Pair") }}

Key derivation for secp256k1 XRP Ledger account keys involves more steps than Ed25519 key derivation for a couple reasons:

- Not all 32-byte numbers are valid secp256k1 secret keys.
- The XRP Ledger's reference implementation has an unused, incomplete framework for deriving a family of key pairs from a single seed value.

The steps to derive the XRP Ledger's secp256k1 account key pair from a seed value are as follows:

1. Calculate a "root key pair" from the seed value, as follows:

    1. Concatenate the following in order, for a total of 20 bytes:
        - The seed value (16 bytes)
        - A "root sequence" value (4 bytes), as a big-endian unsigned integer. Use 0 as a starting value for the root sequence.

    2. Calculate the [SHA-512Half][] of the concatenated (seed+root sequence) value.

    3. If the result is not a valid secp256k1 secret key, increment the root sequence by 1 and start over. [[Source]](https://github.com/ripple/rippled/blob/fc7ecd672a3b9748bfea52ce65996e324553c05f/src/ripple/crypto/impl/GenerateDeterministicKey.cpp#L103 "Source")

        A valid secp256k1 key must not be zero, and it must be numerically less than the _secp256k1 group order_. The secp256k1 group order is the constant value `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`.

    4. With a valid secp256k1 secret key, use the standard ECDSA public key derivation with the secp256k1 curve to derive the root public key. (As always with cryptographic algorithms, use a standard, well-known, publicly-audited implementation whenever possible. For example, [OpenSSL](https://www.openssl.org/) has implementations of core Ed25519 and secp256k1 functions.)

    **Tip:** Validators use this root key pair. If you are calculating a validator's key pair, you can stop here. To distinguish between these two different types of public keys, the [base58][] serialization for validator public keys uses the prefix `0x1c`.

2. Convert the root public key to its 33-byte compressed form.

    The uncompressed form of any ECDSA public key consists of a pair of 32-byte integers: an X coordinate, and a Y coordinate. The compressed form is the X coordinate and a one-byte prefix: `0x02` if the Y coordinate is even, or `0x03` if the Y coordinate is odd.

    You can convert an uncompressed public key to the compressed form with the `openssl` commandline tool. For example, if the uncompressed public key is in the file `ec-pub.pem`, you can output the compressed form like this:

        $ openssl ec -in ec-pub.pem -pubin -text -noout -conv_form compressed

3. Derive an "intermediate key pair" from the compressed root public key you, as follows:

    1. Concatenate the following in order, for a total of 41 bytes:
        - The compressed root public key (33 bytes)
        - `0x00000000000000000000000000000000` (4 bytes of zeroes). (This value was intended to be used to derive different members of the same family, but in practice only the value 0 is used.)
        - A "key sequence" value (4 bytes), as a big-endian unsigned integer. Use 0 as a starting value for the key sequence.

    2. Calculate the [SHA-512Half][] of the concatenated value.

    3. If the result is not a valid secp256k1 secret key, increment the key sequence by 1 and restart deriving the account's intermediate key pair.

    4. With a valid secp256k1 secret key, use the standard ECDSA public key derivation with the secp256k1 curve to derive the intermediate public key. (As always with cryptographic algorithms, use a standard, well-known, publicly-audited implementation whenever possible. For example, [OpenSSL](https://www.openssl.org/) has implementations of core Ed25519 and secp256k1 functions.)

4. Derive the master public key pair by adding the intermediate public key to the root public key. Similarly, derive the secret key by adding the intermediate secret key to the root secret key.

    - An ECDSA secret key is a very large integer, so you can calculate the sum of two secret keys by summing them modulo the secp256k1 group order.

    - An ECDSA public key is a point on the elliptic curve, so you should use elliptic curve math to sum the points.

5. Convert the master public key to its 33-byte compressed form, as before.

6. When serializing an account's public key to its [base58][] format, use the account public key prefix, `0x23`.

    See [Address Encoding](accounts.html#address-encoding) for information and sample code to convert from an account's public key to its address.


## See Also

- **Concepts:**
    - [Issuing and Operational Addresses](issuing-and-operational-addresses.html)
- **Tutorials:**
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.html)
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.html)
- **References:**
    - [SetRegularKey transaction][]
    - [AccountRoot ledger object](accountroot.html)
    - [wallet_propose method][]
    - [account_info method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
