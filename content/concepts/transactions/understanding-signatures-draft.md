# Understanding Signatures

***TODO: DRAFT***

***TODO: Question: Added this concept section based on fantastic source material from Rome -- thought we should publish it. Useful? May be good to associate it with a flow diagram - like the one for address encoding: https://ripple.com/build/accounts/#address-encoding. Address both single and multi-sign flows.***

In the XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. A digital signature is created based on a [key pair](cryptographic-keys.html) associated with the transaction's sending account.

Here's an overview of some of the more common signature-related fields used in the XRP Ledger.

***TODO: address from Ryan: Where would you see these fields? Either address in text -- or ensure that this is answered via the flow diagram discussed below.***

***TODO: JHA fix the IA here. Also need to more clearly express the single-signer flow vs multi-signer flow. Provide a flow diagram. Also need to move some conceptual content out of "Authorizing Transactions" and "Signing and Submitting Transactions" and put it in this doc.***

## `SigningPubKey` (top-level)

The public key of the sender in hex format. Empty in the case of a multi-signed transaction.

To verify whether a single-signed transaction is valid, a `rippled` server checks that all of the following are true:

1. This key hashes to an address that's authorized by the transaction's sender.

    The default is that only the address of an account is authorized to send all transactions for that account. That address is [derived from](accounts.html#address-encoding) the public key from the master key pair that was generated during address creation. Regular keys add a different address (derived from a different key pair) that's authorized to send most transactions. And of course, you can also disable the [master key](cryptographic-keys.html) or add a [multi-signing list](reference-transaction-format.html#multi-signing). ***TODO: address from Ryan: "And of course" - Nit: this seems a little informal. Maybe just drop it and go into the next sentence? JHA take a closer look at what this sentence is trying to say.***

2. This key matches the signature on the transaction.

3. The signature matches the transaction instructions.

The validation process for multi-signed transactions is slightly different. For more information, see [`Signers[*].SigningPubKey`](#signerssigningpubkey).


## `TxnSignature` (top-level)

The signature of the transaction instructions, in hex format.

Used with the `SigningPubKey` to verify that the sender did in fact approve the corresponding transaction instructions.

***TODO: Ensure that this doc reflects this: In transactions, we have two TxnSignature fields—one at the top level for single-signed transactions, and one in each member of the Signers array for multi-signed transactions. (Any given transaction has either the top level TxnSignature or the members in the Signers array but not both.)***

## `Signers` (in a multi-signed transaction)

An array of signature data for a [multi-signed transaction](reference-transaction-format.html#multi-signing).

Used to verify that a quorum of signers approved a transaction.


### `Signers[*].AccountID`

The address of one signer, in base58.
***TODO: JHA: Slightly nitpicky note (relevant to all the fields, but it especially attracted my notice here): the base58 is how it's generally represented in JSON. In the canonical binary format, I believe this is the AccountID as a 160-bit number, so it's not base58-encoded and doesn't have the checksum in the binary format. Similarly, hexadecimal is just a way of representing a 160-bit number in formats like JSON. In the native binary format, the various fields are just numbers/data in various low-level computer formats. That's only relevant for people who are trying to implement offline signing, though. Everyone else will probably see the JSON representation, where they'll want to know what the conventional way to represent the fields is.***

Identifies which signer from the (predefined) [multi-signing list](reference-transaction-format.html#multi-signing) this portion of the multi-signature represents.


### `Signers[*].TxnSignature`

One signature, as hexadecimal.

Verifying a [multi-signed transaction](reference-transaction-format.html#multi-signing) involves making sure each such signature is valid for its `SigningPubKey` and the transaction instructions.


### `Signers[*].SigningPubKey`

The public key of one signer. Verifying a [multi-signed transaction](reference-transaction-format.html#multi-signing) involves making sure each such key is authorized to sign for the `AccountID` of the signer.

Multi-signature `AccountIDs` are a little special. If one is an address that doesn't exist in the ledger, then the `SigningPubKey` must hash to the `AccountID` value using the standard rules for [deriving an AccountID](accounts.html#address-encoding) from a public key. If the address does exist in the ledger, then either:

1. The `SigningPubKey` must hash to the `AccountID` and the address must not have the master key disabled.

    or

2. The `SigningPubKey` must hash to a regular key that the address has set in the ledger.

For more information about signing transactions, see [Signing and Submitting Transactions](reference-transaction-format.html#signing-and-submitting-transactions).
