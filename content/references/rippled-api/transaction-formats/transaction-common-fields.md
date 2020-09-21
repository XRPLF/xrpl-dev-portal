# Transaction Common Fields

Every transaction has the same set of common fields, plus additional fields based on the [transaction type](transaction-types.html). Field names are case-sensitive. The common fields for all transactions are:

| Field                | JSON Type        | [Internal Type][] | Description      |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | String           | AccountID         | _(Required)_ The unique address of the [account](accounts.html) that initiated the transaction. |
| `TransactionType`    | String           | UInt16            | _(Required)_ The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, `AccountSet`, `AccountDelete`, `SetRegularKey`, `SignerListSet`, `EscrowCreate`, `EscrowFinish`, `EscrowCancel`, `PaymentChannelCreate`, `PaymentChannelFund`, `PaymentChannelClaim`, and `DepositPreauth`. |
| `Fee`                | String           | Amount            | _(Required; [auto-fillable][])_ Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network. Some transaction types have different minimum requirements. See [Transaction Cost][] for details. |
| `Sequence`           | Number           | UInt32            | _(Required; [auto-fillable][])_ The [sequence number](basic-data-types.html#account-sequence) of the account sending the transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the previous transaction from the same account. |
| [`AccountTxnID`](#accounttxnid) | String | Hash256          | _(Optional)_ Hash value identifying another transaction. If provided, this transaction is only valid if the sending account's previously-sent transaction matches the provided hash. |
| [`Flags`](#flags-field) | Number        | UInt32            | _(Optional)_ Set of bit-flags for this transaction. |
| `LastLedgerSequence` | Number           | UInt32            | _(Optional; strongly recommended)_ Highest ledger index this transaction can appear in. Specifying this field places a strict upper limit on how long the transaction can wait to be validated or rejected. See [Reliable Transaction Submission](reliable-transaction-submission.html) for more details. |
| [`Memos`](#memos-field) | Array of Objects | Array          | _(Optional)_ Additional arbitrary information used to identify this transaction. |
| [`Signers`](#signers-field) | Array     | Array             | _(Optional)_ Array of objects that represent a [multi-signature](multi-signing.html) which authorizes this transaction. |
| `SourceTag`        | Number             | UInt32            | _(Optional)_ Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| `SigningPubKey`    | String           | Blob              | _(Automatically added when signing)_ Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty string, indicates a multi-signature is present in the `Signers` field instead. |
| `TxnSignature`     | String           | Blob              | _(Automatically added when signing)_ The signature that verifies this transaction as originating from the account it says it is from. |

[auto-fillable]: #auto-fillable-fields

[Removed in: rippled 0.28.0][]: The `PreviousTxnID` field of transactions was replaced by the [`AccountTxnID`](#accounttxnid) field. This String / Hash256 field is present in some historical transactions. This is unrelated to the field also named `PreviousTxnID` in some [ledger objects](ledger-data-formats.html).


## AccountTxnID

<!-- SPELLING_IGNORE: AccountTxnID -->

The `AccountTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous one (by Sequence Number) is also valid and matches the transaction you expected.

Unlike the `PreviousTxnID` field, which tracks the last transaction to _modify_ an account (regardless of sender), the `AccountTxnID` tracks the last transaction _sent by_ an account. To use `AccountTxnID`, you must first set the [`asfAccountTxnID`](accountset.html#accountset-flags) flag, so that the ledger keeps track of the ID for the account's previous transaction. (`PreviousTxnID`, by comparison, is always tracked.)

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially have serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `AccountTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.




## Auto-fillable Fields

Some fields can be automatically filled in before a transaction is signed, either by a `rippled` server or by a library used for signing such as [ripple-lib][]. Auto-filling values requires an active connection to the XRP Ledger to get the latest state, so it cannot be done offline. Both [ripple-lib][] and `rippled` can automatically provide the following values:

* `Fee` - Automatically fill in the [Transaction Cost][] based on the network.

    **Note:** When using `rippled`'s [sign command][], you can limit the maximum possible auto-filled value, using the `fee_mult_max` and `fee_mult_div` parameters.)

* `Sequence` - Automatically use the next sequence number for the account sending the transaction.

For a production system, we recommend _not_ leaving these fields to be filled by the server. For example, if transaction costs become high due to a temporary spike in network load, you may want to wait for the cost to decrease before sending some transactions, instead of paying the temporarily-high cost.

The [`Paths` field](payment.html#paths) of the [Payment transaction][] type can also be automatically filled in.


## Flags Field

The `Flags` field can contain various options that affect how a transaction should behave. The options are represented as binary values that can be combined with bitwise-or operations to set multiple flags at once.

To check whether a transaction has a given flag enabled, use the bitwise-and operator on the flag's value and the `Flags` field. A result of zero indicates the flag is disabled, and a result equal to the flag value indicates the flag is enabled. (Any other result indicates you performed the wrong operation.)

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

Bits that are not defined as flags MUST be 0. (The [fix1543 amendment][] enforces this rule on some transaction types. Most transaction types enforce this rule by default.)

### Global Flags

The only flag that applies globally to all transactions is as follows:

| Flag Name             | Hex Value  | Decimal Value | Description               |
|:----------------------|:-----------|:--------------|:--------------------------|
| `tfFullyCanonicalSig` | `0x80000000` | 2147483648    | _(Strongly recommended)_ Require a fully-canonical signature. |

When using the [sign method][] (or [submit method][] in "sign-and-submit" mode), `rippled` adds a `Flags` field with `tfFullyCanonicalSig` enabled unless the `Flags` field is already present. The `tfFullyCanonicalSig` flag ***is not*** automatically enabled if `Flags` is explicitly specified. The flag ***is not*** automatically enabled when using the [sign_for method][] to add a signature to a multi-signed transaction.

**Warning:** If you do not enable `tfFullyCanonicalSig`, it is theoretically possible for a malicious actor to modify your transaction signature so that the transaction may succeed with a different hash than expected. In the worst case, this could [trick your integration into submitting the same payment multiple times](transaction-malleability.html#exploit-with-malleable-transactions). To avoid this problem, enable the `tfFullyCanonicalSig` flag on all transactions you sign. If the [RequireFullyCanonicalSig amendment][] :not_enabled: is enabled, all single-signed transactions are protected regardless of the `tfFullyCanonicalSig` flag.

### Flag Ranges

A transaction's `Flags` field can contain flags that apply at different levels or contexts. Flags for each context are limited to the following ranges:

| Range Name       | Bit Mask     | Description                                |
|:-----------------|:-------------|:-------------------------------------------|
| Universal Flags  | `0xff000000` | Flags that apply equally to all transaction types. |
| Type-based Flags | `0x00ff0000` | Flags with different meanings depending on the [transaction type](transaction-types.html) that uses them. |
| Reserved Flags   | `0x0000ffff` | Flags that are not currently defined. A transaction is only valid if these flags are disabled. |

**Note:** The [AccountSet transaction][] type has [its own non-bitwise flags](accountset.html#accountset-flags), which serve a similar purpose to type-based flags. [Ledger objects](ledger-object-types.html) also have a `Flags` field with different bitwise flag definitions.


## Memos Field

The `Memos` field includes arbitrary messaging data with the transaction. It is presented as an array of objects. Each object has only one field, `Memo`, which in turn contains another object with *one or more* of the following fields:

| Field        | Type   | [Internal Type][] | Description                      |
|:-------------|:-------|:------------------|:---------------------------------|
| `MemoData`   | String | Blob              | Arbitrary hex value, conventionally containing the content of the memo. |
| `MemoFormat` | String | Blob              | Hex value representing characters allowed in URLs. Conventionally containing information on how the memo is encoded, for example as a [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml). |
| `MemoType`   | String | Blob              | Hex value representing characters allowed in URLs. Conventionally, a unique relation (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. |

The `MemoType` and `MemoFormat` fields should only consist of the following characters: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%`

The `Memos` field is limited to no more than 1 KB in size (when serialized in binary format).

Example of a transaction with a Memos field:

```json
{
    "TransactionType": "Payment",
    "Account": "rMmTCjGFRWPz8S2zAUUoNVSQHxtRQD4eCx",
    "Destination": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
    "Memos": [
        {
            "Memo": {
                "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
                "MemoData": "72656e74"
            }
        }
    ],
    "Amount": "1"
}
```


## Signers Field

The `Signers` field contains a [multi-signature](multi-signing.html), which has signatures from up to 8 key pairs, that together should authorize the transaction. The `Signers` list is an array of objects, each with one field, `Signer`. The `Signer` field has the following nested fields:

| Field           | Type   | [Internal Type][] | Description                     |
|:----------------|:-------|:------------------|:--------------------------------|
| `Account`       | String | AccountID         | The address associated with this signature, as it appears in the signer list. |
| `TxnSignature`  | String | Blob              | A signature for this transaction, verifiable using the `SigningPubKey`. |
| `SigningPubKey` | String | Blob              | The public key used to create this signature. |

The `SigningPubKey` must be a key that is associated with the `Account` address. If the referenced `Account` is a funded account in the ledger, then the `SigningPubKey` can be that account's current Regular Key if one is set. It could also be that account's Master Key, unless the [`lsfDisableMaster`](accountroot.html#accountroot-flags) flag is enabled. If the referenced `Account` address is not a funded account in the ledger, then the `SigningPubKey` must be the master key associated with that address.

Because signature verification is a compute-intensive task, multi-signed transactions cost additional XRP to relay to the network. Each signature included in the multi-signature increases the [transaction cost][] required for the transaction. For example, if the current minimum transaction cost to relay a transaction to the network is `10000` drops, then a multi-signed transaction with 3 entries in the `Signers` array would need a `Fee` value of at least `40000` drops to relay.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
