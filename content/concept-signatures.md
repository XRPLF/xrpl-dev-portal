# Understanding Signatures

***TODO: Question: Added this concept section based on fantastic source material from Rome -- thought we should publish it. Useful? May be good to associate it with a flow diagram - like the one for address encoding: https://ripple.com/build/accounts/#address-encoding. Address both single and multi-sign flows.***

In the XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. A digital signature is created based on a [key pair](concept-keys.html) associated with the transaction's sending account.

Here's an overview of some of the more common signature-related fields used in the XRP Ledger.

### `SigningPubKey` (top-level)

The public key of the sender in hex format.

To verify whether a transaction is valid, you check that all of the following are true:

1. This key hashes to an address that's authorized by the transaction's sender.

    The default is that only "the address of an account" is authorized to send all transactions for that account. That address is the hash-of-a-hash-with-a-checksum of the public key from the master key pair that was generated during address creation. Regular keys add a different address (derived from a different key pair) that's authorized to send most transactions. And of course, you can also disable the [master key](concept-keys.html) or add a [multi-signing list](reference-transaction-format.html#multi-signing).

2. This key matches the signature on the transaction.

3. The signature matches the transaction instructions. Empty in the case of a multi-signed transaction.


### `Signature`                               

The signature of the transaction instructions, in hex format.

***TODO: Question: How is this different from `TxnSignature`?***

Used with the `SigningPubKey` to verify that the sender did in fact approve the corresponding transaction instructions.


### `Signers` (in a multi-signed transaction)

An array of signature data for a [multi-signed transaction](reference-transaction-format.html#multi-signing).

Used to verify that a quorum of signers approved a transaction.


### `Signers[*].AccountID`

The address of one signer, in base58.

Identifies which signer from the (predefined) [multi-signing list](reference-transaction-format.html#multi-signing) this portion of the multi-signature represents.


### `Signers[*].TxnSignature`

One signature, as hexadecimal.

Verifying a [multi-signed transaction](reference-transaction-format.html#multi-signing) involves making sure each such signature is valid for its `SigningPubKey` and the transaction instructions.


### `Signers[*].SigningPubKey`

The public key of one signer. Verifying a [multi-signed transaction](reference-transaction-format.html#multi-signing) involves making sure each such key is authorized to sign for the `AccountID` of the signer.

Multi-signature `AccountIDs` are a little special. If one is an address that doesn't exist in the ledger, then the `SigningPubKey` must hash to the `AccountID` value. If the address does exist in the ledger, then either:

1. The `SigningPubKey` must hash to the `AccountID` and the address must not have the master key disabled.

    or

2. The `SigningPubKey` must hash to a regular key that the address has set in the ledger.

For more information about signing transactions, see [Signing and Submitting Transactions](reference-transaction-format.html#signing-and-submitting-transactions).
