# Transaction Malleability

A transaction is "malleable" if it can be changed in any way after being signed, without the keys to sign it. In the XRP Ledger, the **functionality** of a signed transaction cannot change, but in some circumstances a third party _could_ change the signature and identifying hash of a transaction.

If vulnerable software submits malleable transactions and assumes they can only execute under the original hash, it may lose track of transactions. In the worst case, malicious actors could take advantage of this to steal money from the vulnerable system.

There are two circumstances that could lead to transaction malleability:

1. The transaction does not specify the tfFullyCanonicalSig flag on a transaction signed using the default signing algorithm (ECDSA with the secp256k1 curve).

    **Use the [tfFullyCanonicalSig flag](transaction-common-fields.html#global-flags)** to guarantee that a transaction is not malleable in this way. Although transactions [signed with Ed25519 keys](cryptographic-keys.html#signing-algorithms) are not vulnerable to this problem, **there is no downside** to using this flag on _all_ transactions.

2. The transaction is [multi-signed](multi-signing.html) and has more signatures than necessary. Even if the transaction originally did not have more signatures than necessary, it could be malleable if an authorized signer provides an additional signature.

    Good operational security can protect against these problems. See [Mitigations for Multi-Signature Malleability](#mitigations-for-multi-signature-malleability) for guidelines.


## Background

In the XRP Ledger, a transaction cannot execute unless:

- All [fields of a transaction](transaction-common-fields.html) are signed, except the signature itself.
- The key pair(s) used to sign the transaction are [authorized to send transactions on behalf of that account](transaction-basics.html#authorizing-transactions).
- The signature is _canonical_ and matches the transaction instructions.

Any change to the signed fields, no matter how small, would invalidate the signature, so no part of the transaction can be malleable except for the signature itself. In most cases, any change to a signature itself also invalidates the signature, but there are some specific exceptions, described below.

Since the signature is among the data used to compute a transaction's identifying hash, any changes to a malleable transaction result in a different hash.

### Alternate secp256k1 Signatures

To be "canonical", signatures created with the ECDSA algorithm and secp256k1 curve (the default) must meet the following requirements:

- The signature must be properly [DER-encoded data](https://en.wikipedia.org/wiki/X.690#DER_encoding).
- The signature must not have any padding bytes outside the DER-encoded data.
- The signature's component integers must not be negative, and they must not be larger than the secp256k1 group order.

Generally speaking, any standard ECDSA implementation handles these requirements automatically. However, with secp256k1, those requirements are insufficient to prevent malleability. Thus, the XRP Ledger has a concept of "fully canonical" signatures which do not have the same problem.

An ECDSA signature consists of two integers, called R and S. The secp256k1 _group order_, called N, is a constant value for all secp256k1 signatures. Specifically, N is the value `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`. For any given signature `(R,S)`, the signature `(R, N-S)` (that is, using N minus S in place of S) is also valid.

Thus, to have _fully_ canonical signatures, one must choose which of the two possibilities is preferred and declare the other to be invalid. The creators of the XRP Ledger decided arbitrarily to prefer the _smaller_ of the two possible values, `S` or `N-S`. A transaction is considered _fully canonical_ if it uses the preferred (smaller) value of `S`, and follows all the normal rules for being canonical.

To maintain compatibility with older software that did not always generate fully canonical signatures, the XRP Ledger accepts transactions that are not fully canonical. To protect new users from exploits, the XRP Ledger has a flag on transactions called [**tfFullyCanonicalSig**](transaction-common-fields.html#global-flags), which requires that the transaction use a _fully-canonical_ signature to be valid.

To calculate a fully-canonical ECDSA signature, one must compare S and N-S to determine which is smaller, then use that value in the `Signature` field of the transaction.

All XRP Ledger software that Ripple publishes (including `rippled`, and ripple-lib/RippleAPI) generates only fully-canonical signatures. To further protect users, Ripple has configured its code to enable the **tfFullyCanonicalSig** flag by default where possible. Ripple strongly encourages third-party implementations of XRP Ledger software to generate only fully-canonical signatures, and enable tfFullyCanonicalSig on transactions by default.

There are two cases where Ripple's signing implementations for the XRP Ledger do not automatically enable the tfFullyCanonicalSig flag. Users should take care to set the flag in these situations:

- When the user explicitly specifies the `Flags` field of the transaction. Use bitwise OR to apply tfFullyCanonicalSig _and_ any other desired flags.
- When the user provides a multi-signature for a transaction. Since different participants in a multi-signature must sign _exactly_ the same data, the signing code does not pre-process the transaction instructions to add the tfFullyCanonicalSig flag. For multi-signed transactions, always enable the tfFullyCanonicalSig flag explicitly.


### Malleability with Multi-Signatures

An important, explicit feature of multi-signing is that multiple different possible configurations can render a transaction valid. For example, an account can be configured so that signatures from any three of five signers could authorize a transaction. However, this inherently means that there can be several different variations of a valid transaction, each with a different identifying hash.

All of the following cases can lead to transaction malleability:

- If a transaction still has enough signatures to meet its quorum after removing one or more. Any third party could remove a signature and re-submit the transaction without it.
- If one can add a valid signature to a transaction that already has a quorum. Only an authorized signer of the sending account could create such a signature.
- If one can replace one signature from a transaction with another valid signature while maintaining a quorum. Only an authorized signer of the sending account could create such a signature.

Even if your authorized signers are not intentionally malicious, confusion or poor coordination could cause several signers to submit different valid versions of the same transaction.

#### Mitigations for Multi-Signature Malleability

**Good operational security can protect against these problems.** Generally, you can avoid transaction malleability problems when multi-signing if you follow good operational security practices, including the following:

- Do not collect more signatures than necessary.
- Either designate one party to assemble a transaction after collecting the necessary number of signatures, or designate a "chain" where signers pass the transaction instructions forward to be signed in a predefined order.
- Do not add unnecessary or untrusted signers to your multi-signing lists, even if the `weight` values associated with their keys are insufficient to authorize a transaction.
- Be prepared for the possibility that a transaction executes with a different hash and set of signatures than you expected. Carefully monitor your account's sent transactions (for example, using the [account_tx method][]).
- Monitor the `Sequence` number of your account (for example, using the [account_info method][]). This number always increases by exactly one when your account sends a transaction successfully, and never any other way. If the number does not match what you expect, you should check your recent transactions to confirm why. (Aside from malleable transactions, there are other ways this could happen, too. Perhaps you configured another application to send transactions for you. Maybe a malicious user gained access to your secret key. Or perhaps your application lost data and forgot about a transaction you sent already.)
- If you re-create transactions to be multi-signed, _do not_ change the `Sequence` number unless you have manually confirmed that the intended actions have not already executed.
- Confirm that the tfFullyCanonicalSig flag is enabled before signing.

For greater security, these guidelines provide multiple layers of protection.


## Exploit With Malleable Transactions

If the software you use to interface with the XRP Ledger sends malleable transactions, a malicious actor may be able to trick your software into losing track of a transaction's final outcome and potentially (in the worst case) sending equivalent payments multiple times.

If you use single-signatures and always enable the tfFullyCanonicalSig flag, you are not vulnerable to this exploit. If you use multi-signatures, you may be vulnerable if you or your signers provide more signatures than necessary.

### Exploit Scenario Steps

The process to exploit a vulnerable system follows a series of steps similar to the following:

1. The vulnerable system constructs and signs a transaction without enabling tfFullyCanonicalSig.

    Three ways that a transaction may not enable the tfFullyCanonicalSig flag are:

    - The system explicitly specifies a `Flags` field that does not have the tfFullyCanonicalSig bit enabled.
    - The transaction is multi-signed and does not explicitly enable the tfFullyCanonicalSig flag.
    - The system omits the `Flags` field from the transaction fields, but uses a non-standard implementation that does not automatically enable tfFullyCanonicalSig when signing.

    To be vulnerable, the transaction must be signed with an ECDSA key pair. If multi-signed, the transaction must be signed by at least one ECDSA key pair.

    Most likely, the vulnerable transaction uses a fully-canonical signature, but the flags indicate that the transaction would also be valid with a non-fully-canonical one. The transaction may also use `LastLedgerSequence` so that its final outcome is clear in a finite amount of time.

2. The system notes the identifying hash of the vulnerable transaction, submits it to the XRP Ledger network, then begins monitoring for that hash to be included in a validated ledger version.

3. A malicious actor sees the transaction propagating through the network before it becomes confirmed.

4. The malicious actor calculates the alternate signature for the vulnerable transaction.

    Unlike creating a signature for different transaction instructions, this does not require a large amount of computational work. It can be done in much less time than it takes to generate a signature in the first place.

    The modified signature results in a different identifying hash. (You do not have to calculate the hash before you submit to the network, but knowing the hash makes it easier to check the transaction's status later.)

5. The malicious actor submits the modified (likely non-fully-canonical) transaction to the network.

    This creates a "race" between the transaction as originally submitted and the modified version submitted by the malicious actor. The two transactions are mutually exclusive. Both are valid, but they have the same exact transaction data, including the `Sequence` number, so at most one of them can ever be included in a validated ledger.

    Servers in the peer-to-peer network have no way of knowing which one "came first" or was intended by its original sender. Delays or other coincidences in network connectivity could result in validators seeing only one or the other by the time they finalize their consensus proposals, so either one could "win the race".

    A malicious actor could increase the chances of getting non-canonical transactions confirmed if they controlled some number of well-connected servers in the peer-to-peer network, even if those servers are not trusted as validators.

    If the malicious actor controls the only server to which the vulnerable system submitted the transaction, the malicious actor can easily control which version is distributed to the rest of the network.

6. The malicious actor's version of the transaction achieves consensus and becomes included in a validated ledger.

    At this point, the transaction has executed and cannot be reversed. Its effects (such as sending XRP) are final. The original version of the transaction is no longer valid because its `Sequence` number has been used.

    The effects of the transaction in the XRP Ledger are exactly the same as if the original version had executed.

7. The vulnerable system does not see the transaction hash it is expecting, and erroneously concludes that the transaction did not execute.

    If the transaction included the `LastLedgerSequence` field, this would occur after the specified ledger index has passed.

    If the transaction omitted the `LastLedgerSequence` field, this could be wrong in another way: if no other transaction from the same sender uses the same `Sequence` number, then the transaction could theoretically succeed later regardless of how much time has passed. (See [Reliable Transaction Submission](reliable-transaction-submission.html) for details.)

8. The vulnerable system takes action assuming that the transaction has failed.

    For example, it may refund (or simply not debit) a customer's balance in its own system, to account for the funds that it thinks have not been sent in the XRP Ledger.

    Worse, the vulnerable system might construct a new transaction to replace the transaction, picking new `Sequence`, `LastLedgerSequence`, and `Fee` parameters based on the current state of the network, but keeping the rest of the transaction the same as the original. If this new transaction is also malleable, the system could be exploited in the same way an indefinite number of times.


## See Also

- **Concepts:**
    - [Transaction Basics](transaction-basics.html)
    - [Finality of Results](finality-of-results.html)
- **Tutorials:**
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [Basic Data Types - Hashes](basic-data-types.html#hashes)
    - [Transaction Common Fields - Global Flags](transaction-common-fields.html#global-flags)
    - [Transaction Results](transaction-results.html)
    - [Serialization Format](serialization.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
