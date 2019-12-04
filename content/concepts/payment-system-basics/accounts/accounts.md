# Accounts

An "Account" in the XRP Ledger represents a holder of XRP and a sender of [transactions](transaction-formats.html). The core elements of an account are:

- An identifying **address**, such as `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`

    **Note:** The XRP community has [proposed](https://github.com/xrp-community/standards-drafts/issues/6) (and developed a [codec](https://github.com/xrp-community/xrpl-tagged-address-codec) to support) a new **X**-address format that exchanges and wallets could use instead of [destination tags](https://xrpl.org/source-and-destination-tags.html). These "packed" addresses start with an `X` instead of an `r`. For more information, see the [XRPL 𝗫-address format](https://xrpaddress.info/) site.

- An **XRP balance**. Some of this XRP is set aside for the [Reserve](reserves.html).
- A **sequence number**, which helps make sure any transactions this account sends are applied in the correct order and only once each. To execute a transaction, the transaction's sequence number and its sender's sequence number must match. Then, as part of applying the transaction, the account's sequence number increases by 1. (See also: [Basic Data Types: Account Sequence](basic-data-types.html#account-sequence).)
- A **history of transactions** that affected this account and its balances.
- One or more ways to [authorize transactions](transaction-basics.html#authorizing-transactions), possibly including:
    - A master key pair intrinsic to the account. (This can be [disabled](accountset.html) but not changed.)
    - A "regular" key pair that [can be rotated](setregularkey.html).
    - A signer list for [multi-signing](multi-signing.html). (Stored separately from the account's core data.)

In the ledger's data tree, an account's core data is stored in the [AccountRoot](accountroot.html) ledger object type. An account can also be the owner (or partial owner) of several other types of data.

**Tip:** An "Account" in the XRP Ledger is somewhere between the financial usage (like "bank account") and the computing usage (like "UNIX account"). Non-XRP currencies and assets aren't stored in an XRP Ledger Account itself; each such asset is stored in an accounting relationship called a "Trust Line" that connects two parties.

### Creating Accounts

There is not a dedicated "create account" transaction. The [Payment transaction][] automatically creates a new account if the payment sends XRP equal to or greater than the [account reserve](reserves.html) to a mathematically-valid address that does not already have an account. This is called _funding_ an account, and creates an [AccountRoot object](accountroot.html) in the ledger. No other transaction can create an account.

**Caution:** Funding an account **does not** give you any special privileges over that account. Whoever has the secret key corresponding to the account's address has full control over the account and all XRP it contains. For some addresses, it's possible that no one has the secret key, in which case the account is a [black hole](#special-addresses) and the XRP is lost forever.

The typical way to get an account in the XRP Ledger is as follows:

1. Generate a key pair from a strong source of randomness and calculate the address of that key pair. (For example, you can use the [wallet_propose method][] to do this.)

2. Have someone who already has an account in the XRP Ledger send XRP to the address you generated.

    - For example, you can purchase XRP in a private exchange, then withdraw XRP from the exchange to the address you specified.

        **Caution:** The first time you receive XRP at your own XRP Ledger address, you must pay the [account reserve](reserves.html) (currently 20 XRP), which locks up that amount of XRP indefinitely. In contrast, private exchanges usually hold all their customers' XRP in a few shared XRP Ledger accounts, so customers don't have to pay the reserve for individual accounts at the exchange. Before withdrawing, consider whether having your own account directly on the XRP Ledger is worth the price.

## Addresses

{% include '_snippets/data_types/address.md' %}

Any valid address can [become an account in the XRP Ledger](#creating-accounts) by being funded. You can also use an address that has not been funded to represent a [regular key](setregularkey.html) or a member of a [signer list](multi-signing.html). Only a funded account can be the sender of a transaction.

Creating a valid address is a strictly mathematical task starting with a key pair. You can generate a key pair and calculate its address entirely offline without communicating to the XRP Ledger or any other party. The conversion from a public key to an address involves a one-way hash function, so it is possible to confirm that a public key matches an address but it is impossible to derive the public key from the address alone. (This is part of the reason why signed transactions include the public key _and_ the address of the sender.)

For more technical details of how to calculate an XRP Ledger address, see [Address Encoding](#address-encoding).


### Special Addresses

Some addresses have special meaning, or historical uses, in the XRP Ledger. In many cases, these are "black hole" addresses, meaning the address is not derived from a known secret key. Since it is effectively impossible to guess a secret key from only an address, any XRP possessed by black hole addresses is lost forever.

| Address                     | Name | Meaning | Black Hole? |
|-----------------------------|------|---------|-------------|
| rrrrrrrrrrrrrrrrrrrrrhoLvTp | ACCOUNT\_ZERO | An address that is the XRP Ledger's [base58][] encoding of the value `0`. In peer-to-peer communications, `rippled` uses this address as the issuer for XRP. | Yes |
| rrrrrrrrrrrrrrrrrrrrBZbvji  | ACCOUNT\_ONE | An address that is the XRP Ledger's [base58][] encoding of the value `1`. In the ledger, [RippleState entries](ripplestate.html) use this address as a placeholder for the issuer of a trust line balance. | Yes |
| rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh | The genesis account | When `rippled` starts a new genesis ledger from scratch (for example, in stand-alone mode), this account holds all the XRP. This address is generated from the seed value "masterpassphrase" which is [hard-coded](https://github.com/ripple/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184). | No |
| rrrrrrrrrrrrrrrrrNAMEtxvNvQ | Ripple Name reservation black-hole | In the past, Ripple asked users to send XRP to this account to reserve Ripple Names.| Yes |
| rrrrrrrrrrrrrrrrrrrn5RM1rHd | NaN Address | Previous versions of [ripple-lib](https://github.com/ripple/ripple-lib) generated this address when encoding the value [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) using the XRP Ledger's [base58][] string encoding format. | Yes |


## Deletion of Accounts

The [DeletableAccounts amendment](known-amendments.html#deletableaccounts) :not_enabled: makes it possible to delete accounts. If the DeletableAccounts amendment is not enabled, every funded account must remain in the XRP Ledger's data tree forever.

To be deleted, an account must meet the following requirements:

- The account's `Sequence` number plus 256 must be less than the current [Ledger Index][].
- The account must not be linked to any of the following types of [ledger objects](ledger-object-types.html) (as a sender or receiver):
    - `Escrow`
    - `PayChannel`
    - `RippleState`
    - `Check` :not_enabled:
- The account must own fewer than 1000 objects in the ledger.
- The [AccountDelete transaction][] must pay a special [transaction cost][] equal to at least the [owner reserve](reserves.html) for one item (currently 5 XRP).

After an account has been deleted, it can be re-created in the ledger through the normal method of [creating accounts](#creating-accounts). An account that has been deleted and re-created is no different than an account that has been created for the first time.

Unlike Bitcoin and many other cryptocurrencies, each new version of the XRP Ledger's public ledger chain contains the full state of the ledger, which increases in size with each new account. For that reason, you should not create new XRP Ledger accounts unless necessary. You can recover some of an account's 20 XRP [reserve](reserves.html) by deleting the account, but you must still destroy at least 5 XRP to do so.

Institutions who send and receive value on behalf of many users can use [**Source Tags** and **Destination Tags**](become-an-xrp-ledger-gateway.html#source-and-destination-tags) to distinguish payments from and to their customers while only using one (or a handful) of accounts in the XRP Ledger.




## Transaction History

In the XRP Ledger, transaction history is tracked by a "thread" of transactions linked by a transaction's identifying hash and the ledger index. The `AccountRoot` ledger object has the identifying hash and ledger of the transaction that most recently modified it; the metadata of that transaction includes the previous state of the `AccountRoot` node, so it is possible to iterate through the history of a single account this way. This transaction history includes any transactions that modify the `AccountRoot` node directly, including:

- Transactions sent by the account, because they modify the account's `Sequence` number. These transactions also modify the account's XRP balance because of the [transaction cost](transaction-cost.html).
- Transactions that modified the account's XRP balance, including incoming [Payment transactions][] and other types of transactions such as [PaymentChannelClaim][] and [EscrowFinish][].

The _conceptual_ transaction history of an account also includes transactions that modified the account's owned objects and non-XRP balances. These objects are separate ledger objects, each with their own thread of transactions that affected them. If you have an account's full ledger history, you can follow it forward to find the ledger objects created or modified by it. A "complete" transaction history includes the history of objects owned by a transaction, such as:

- `RippleState` objects (Trust Lines) connected to the account.
- `DirectoryNode` objects, especially the owner directory tracking the account's owned objects.
- `Offer` objects, representing the account's outstanding currency-exchange orders in the decentralized exchange
- `PayChannel` objects, representing asynchronous payment channels to and from the account
- `Escrow` objects, representing held payments to or from the account that are locked by time or a crypto-condition.
- `SignerList` objects, representing lists of addresses that can authorize transactions for the account by [multi-signing](multi-signing.html).

For more information on each of these objects, see the [Ledger Format Reference](ledger-data-formats.html).


## Address Encoding

**Tip:** These technical details are only relevant for people building low-level library software for XRP Ledger compatibility!

[[Source]](https://github.com/ripple/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/AccountID.cpp#L109-L140 "Source")

XRP Ledger addresses are encoded using [base58](https://en.wikipedia.org/wiki/Base58) with the _dictionary_ `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`. Since the XRP Ledger encodes several types of keys with base58, it prefixes the encoded data with a one-byte "type prefix" (also called a "version prefix") to distinguish them. The type prefix causes addresses to usually start with different letters in base58 format.

The following diagram shows the relationship between keys and addresses:

[![Master Public Key + Type Prefix → Account ID + Checksum → Address](img/address-encoding.png)](img/address-encoding.png)

The formula for calculating an XRP Ledger address from a public key is as follows. For the complete example code, see [`encode_address.js`](https://github.com/ripple/ripple-dev-portal/blob/master/content/_code-samples/address_encoding/encode_address.js). For the process of deriving a public key from a passphrase or seed value, see [Key Derivation](cryptographic-keys.html#key-derivation).

1. Import required algorithms: SHA-256, RIPEMD160, and base58. Set the dictionary for base58.

        'use strict';
        const assert = require('assert');
        const crypto = require('crypto');
        const R_B58_DICT = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz';
        const base58 = require('base-x')(R_B58_DICT);

        assert(crypto.getHashes().includes('sha256'));
        assert(crypto.getHashes().includes('ripemd160'));

2. Start with a 33-byte ECDSA secp256k1 public key, or a 32-byte Ed25519 public key. For Ed25519 keys, prefix the key with the byte `0xED`.

        const pubkey_hex =
          'ED9434799226374926EDA3B54B1B461B4ABF7237962EAE18528FEA67595397FA32';
        const pubkey = Buffer.from(pubkey_hex, 'hex');
        assert(pubkey.length == 33);

3. Calculate the [RIPEMD160](https://en.wikipedia.org/wiki/RIPEMD) hash of the SHA-256 hash of the public key. This value is the "Account ID".

        const pubkey_inner_hash = crypto.createHash('sha256').update(pubkey);
        const pubkey_outer_hash = crypto.createHash('ripemd160');
        pubkey_outer_hash.update(pubkey_inner_hash.digest());
        const account_id = pubkey_outer_hash.digest();

4. Calculate the SHA-256 hash of the SHA-256 hash of the Account ID; take the first 4 bytes. This value is the "checksum".

        const address_type_prefix = Buffer.from([0x00]);
        const payload = Buffer.concat([address_type_prefix, account_id]);
        const chksum_hash1 = crypto.createHash('sha256').update(payload).digest();
        const chksum_hash2 = crypto.createHash('sha256').update(chksum_hash1).digest();
        const checksum =  chksum_hash2.slice(0,4);

5. Concatenate the payload and the checksum. Calculate the base58 value of the concatenated buffer. The result is the address.

        const dataToEncode = Buffer.concat([payload, checksum]);
        const address = base58.encode(dataToEncode);
        console.log(address);
        // rDTXLQ7ZKZVKz33zJbHjgVShjsBnqMBhmN


## See Also

- **Concepts:**
    - [Reserves](reserves.html)
    - [Cryptographic Keys](cryptographic-keys.html)
    - [Issuing and Operational Addresses](issuing-and-operational-addresses.html)
- **References:**
    - [account_info method][]
    - [wallet_propose method][]
    - [AccountSet transaction][]
    - [Payment transaction][]
    - [AccountRoot object](accountroot.html)
- **Tutorials:**
    - [Manage Account Settings (Category)](manage-account-settings.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
