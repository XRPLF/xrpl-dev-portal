# Transaction Malleability

A transaction is "malleable" if it can be changed in any way after being signed, without the keys to sign it. In the XRP Ledger, the **functionality** of a signed transaction cannot change, but in some circumstances a third party _could_ change the signature and identifying hash of a transaction.

**Use the [tfFullyCanonicalSig flag](transaction-common-fields.html#global-flags)** to guarantee that a transaction is not malleable in any way. Although transactions [signed with Ed25519 keys](cryptographic-keys.html#signing-algorithms) are not vulnerable to this problem, **there is no downside** to using this flag on _all_ transactions.

## Background

In the XRP Ledger, all [fields of a transaction](transaction-common-fields.html) must be signed, except the signature itself. Any change to the signed fields, no matter how small, would invalidate the signature, so no part of the transaction can be malleable except for the signature itself.

For a transaction to be valid, the signature must be canonical, must match the transaction instructions that were signed, and the key pair used to sign it must be one that is [authorized to send transactions on behalf of that account](transaction-basics.html#authorizing-transactions).

Signatures created with the ECDSA algorithm and secp256k1 curve (the default) must also meet the following requirements:

- The signature must be properly [DER-encoded data](https://en.wikipedia.org/wiki/X.690#DER_encoding).
- The signature must not have any padding bytes outside the DER-encoded data.
- The signature's component integers must not be negative, and they must not be larger than the secp256k1 modulus.

Generally speaking, any standard ECDSA implementation handles these requirements automatically. However, with secp256k1, those requirements are insufficient to prevent malleability.

An ECDSA signature consists of two integers, called R and S. The secp256k1 modulus, called N, is a constant value for all secp256k1 signatures. Specifically, N is the value `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`. For any given signature `(R,S)`, the signature `(R, N-S)` (that is, using N minus S in place of S) is also valid. Thus, to have _fully_ canonical signatures, one must choose which of the two possibilities is preferred and declare the other to be invalid. This is what the tfFullyCanonicalSig flag does: without that flag enabled, XRP Ledger transactions are valid with either of the two possible signatures; with it, the signature must use the _smaller_ of the two possible values, `S` or `N-S`.

To calculate a fully-canonical ECDSA signature, one must compare S and N-S 
