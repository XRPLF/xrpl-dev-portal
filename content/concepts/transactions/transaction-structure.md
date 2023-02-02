---
html: transaction-structure.html
parent: transactions.html
blurb: Transactions allow accounts to modify the XRP Ledger.
labels:
  - Ledgers
---
# Transaction Structure

All transactions follow a similar structure. If you understand how to send one type of transaction, other transactions make sense as well.

The type of a transaction (`TransactionType` field) is the most fundamental information about a transaction. This indicates what type of operation the transaction is supposed to do.

Each transaction type has a set of common fields, coupled with additional fields relevant to the type of action it causes.

## Transaction Common Fields

Every transaction has the same set of common fields, plus additional fields based on the transaction type. Field names are case-sensitive. The common fields for all transactions are:

| Field                | JSON Type        | Internal Type | Description      |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | String           | AccountID         | _(Required)_ The unique address of the account that initiated the transaction. |
| `TransactionType`    | String           | UInt16            | _(Required)_ The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, `AccountSet`, `AccountDelete`, `SetRegularKey`, `SignerListSet`, `EscrowCreate`, `EscrowFinish`, `EscrowCancel`, `PaymentChannelCreate`, `PaymentChannelFund`, `PaymentChannelClaim`, and `DepositPreauth`. |
| `Fee`                | String           | Amount            | _(Required; auto-fillable])_ Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network. Some transaction types have different minimum requirements.<!-- See [Transaction Cost][] for details. -->|
| `Sequence`           | Number           | UInt32            | _(Required; auto-fillable)_ The [sequence number](basic-data-types.html#account-sequence) of the account sending the transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the previous transaction from the same account. The special case `0` means the transaction is using a [Ticket](tickets.html) instead _(Added by the TicketBatch amendment.)_. |
| [`AccountTxnID`](#accounttxnid) | String | Hash256          | _(Optional)_ Hash value identifying another transaction. If provided, this transaction is only valid if the sending account's previously-sent transaction matches the provided hash. |
| [`Flags`](#flags-field) | Number        | UInt32            | _(Optional)_ Set of bit-flags for this transaction. |
| `LastLedgerSequence` | Number           | UInt32            | _(Optional; strongly recommended)_ Highest ledger index this transaction can appear in. Specifying this field places a strict upper limit on how long the transaction can wait to be validated or rejected. <!-- See [Reliable Transaction Submission](reliable-transaction-submission.html) for more details. -->|
| [`Memos`](#memos-field) | Array of Objects | Array          | _(Optional)_ Additional arbitrary information used to identify this transaction. |
| [`Signers`](#signers-field) | Array     | Array             | _(Optional)_ Array of objects that represent a [multi-signature](multi-signing.html) which authorizes this transaction. |
| `SourceTag`        | Number             | UInt32            | _(Optional)_ Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| `SigningPubKey`    | String           | Blob              | _(Automatically added when signing)_ Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty string, indicates a multi-signature is present in the `Signers` field instead. |
| `TicketSequence`   | Number           | UInt32            | _(Optional)_ The sequence number of the [ticket](tickets.html) to use in place of a `Sequence` number. If this is provided, `Sequence` must be `0`. Cannot be used with `AccountTxnID`. |
| `TxnSignature`     | String           | Blob              | _(Automatically added when signing)_ The signature that verifies this transaction as originating from the account it says it is from. |

[auto-fillable]: #auto-fillable-fields

Removed in: rippled 0.28.0: The `PreviousTxnID` field of transactions was replaced by the [`AccountTxnID`](#accounttxnid) field. This String / Hash256 field is present in some historical transactions. This is unrelated to the field also named `PreviousTxnID` in some [ledger objects](ledger-data-formats.html).

### Example Unsigned Transaction

Here is an example of an unsigned `Payment` transaction in JSON:

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

| Field Name      | Description |
|-----------------|-------------|
| TransactionType | Send a Payment. |
| Account         | The account sending the funds. |
| Destination     | The account receiving the funds. |
| Amount          | The amount and type of currency. |
| currency        | Currency type to transfer.  |
| value           | Quantity of currency to transfer. |
| issuer          | Account that originally issued the currency. |
| Fee             | Transaction fee, in drops (millionths of one XRP). |
| Flags           | Additional standard settings for the transaction. |
| Sequence        | Unique sequence number for the transaction. |

Example response from the `tx` command:

```json
{
  "id": 6,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": {
      "currency": "USD",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "value": "1"
    },
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "10",
    "Flags": 2147483648,
    "Sequence": 2,
    "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
    "TransactionType": "Payment",
    "TxnSignature": "3045022100D64A32A506B86E880480CCB846EFA3F9665C9B11FDCA35D7124F53C486CC1D0402206EC8663308D91C928D1FDA498C3A2F8DD105211B9D90F4ECFD75172BAE733340",
    "date": 455224610,
    "hash": "33EA42FC7A06F062A7B843AF4DC7C0AB00D6644DFDF4C5D354A87C035813D321",
    "inLedger": 7013674,
    "ledger_index": 7013674,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "Balance": "99999980",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 3
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "Balance": "99999990",
              "Sequence": 2
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "2"
              },
              "Flags": 65536,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "0"
              },
              "HighNode": "0000000000000000",
              "LowLimit": {
                "currency": "USD",
                "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "value": "100"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "96D2F43BA7AE7193EC59E5E7DDB26A9D786AB1F7C580E030E7D2FF5233DA01E9",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1"
              }
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```
## AccountTxnID

The `AccountTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous transaction sent from the same account has a specific transaction hash. <!-- ][identifying hash]. -->

Unlike the `PreviousTxnID` field, which tracks the last transaction to _modify_ an account (regardless of sender), the `AccountTxnID` tracks the last transaction _sent by_ an account. To use `AccountTxnID`, you must first enable the [`asfAccountTxnID`](accountset.html#accountset-flags) flag, so that the ledger keeps track of the ID for the account's previous transaction. (`PreviousTxnID`, by comparison, is always tracked.)

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially have serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `AccountTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.

The `AccountTxnID` field cannot be used on transactions that use [Tickets](tickets.html). Transactions that use `AccountTxnID` cannot be placed in the [transaction queue](transaction-queue.html).

## Auto-fillable Fields

Some fields can be automatically filled in before a transaction is signed, either by a `rippled` server or by a [client library](client-libraries.html). Auto-filling values requires an active connection to the XRP Ledger to get the latest state, so it cannot be done offline. The details can vary by library, but auto-filling always provides suitable values for at least the following fields:

* `Fee` - Automatically fill in the `Transaction Cost` based on the network.

    **Note:** When using `rippled`'s `sign` command, you can limit the maximum possible auto-filled value, using the `fee_mult_max` and `fee_mult_div` parameters.)

* `Sequence` - Automatically use the next sequence number for the account sending the transaction.

For a production system, we recommend _not_ leaving these fields to be filled by the server. For example, if transaction costs become high due to a temporary spike in network load, you may want to wait for the cost to decrease before sending some transactions, instead of paying the temporarily-high cost.

The [`Paths` field](payment.html#paths) of the `Payment` transaction type can also be automatically filled in.

## Flags Field

The `Flags` field can contain various options that affect how a transaction should behave. The options are represented as binary values that can be combined with bitwise-or operations to set multiple flags at once.

To check whether a transaction has a given flag enabled, use the bitwise-and operator on the flag's value and the `Flags` field. A result of zero indicates the flag is disabled, and a result equal to the flag value indicates the flag is enabled. (Any other result indicates you performed the wrong operation.)

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

Bits that are not defined as flags MUST be 0. (The fix1543 amendment enforces this rule on some transaction types. Most transaction types enforce this rule by default.)

### Global Flags

The only flag that applies globally to all transactions is as follows:

| Flag Name             | Hex Value  | Decimal Value | Description               |
|:----------------------|:-----------|:--------------|:--------------------------|
| `tfFullyCanonicalSig` | `0x80000000` | 2147483648  | **DEPRECATED** No effect. (If the RequireFullyCanonicalSig amendment is not enabled, this flag enforces a [fully-canonical signature](transaction-malleability.html#alternate-secp256k1-signatures).) |

When using the `sign` method (or `submit` method in "sign-and-submit" mode), `rippled` adds a `Flags` field with `tfFullyCanonicalSig` enabled unless the `Flags` field is already present. The `tfFullyCanonicalSig` flag is not automatically enabled if `Flags` is explicitly specified. The flag is not automatically enabled when using the `sign_for` method to add a signature to a multi-signed transaction.

**Note:** The `tfFullyCanonicalSig` flag was used from 2014 until 2020 to protect against transaction malleability while maintaining compatibility with legacy signing software. The RequireFullyCanonicalSig amendment ended compatibility with such legacy software and made the protections the default for all transactions. If you are using a [parallel network](parallel-networks.html) that does not have RequireFullyCanonicalSig enabled, you should always enable the `tfFullyCanonicalSig` flag to protect against transaction malleability.

### Flag Ranges

A transaction's `Flags` field can contain flags that apply at different levels or contexts. Flags for each context are limited to the following ranges:

| Range Name       | Bit Mask     | Description                                |
|:-----------------|:-------------|:-------------------------------------------|
| Universal Flags  | `0xff000000` | Flags that apply equally to all transaction types. |
| Type-based Flags | `0x00ff0000` | Flags with different meanings depending on the [transaction type](transaction-types.html) that uses them. |
| Reserved Flags   | `0x0000ffff` | Flags that are not currently defined. A transaction is only valid if these flags are disabled. |

**Note:** The `AccountSet` transaction type has [its own non-bitwise flags](accountset.html#accountset-flags), which serve a similar purpose to type-based flags. [Ledger objects](ledger-object-types.html) also have a `Flags` field with different bitwise flag definitions.


## Memos Field

The `Memos` field includes arbitrary messaging data with the transaction. It is presented as an array of objects. Each object has only one field, `Memo`, which in turn contains another object with *one or more* of the following fields:

| Field        | Type   | Internal Type | Description                      |
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

| Field           | Type   | Internal Type | Description                     |
|:----------------|:-------|:------------------|:--------------------------------|
| `Account`       | String | AccountID         | The address associated with this signature, as it appears in the signer list. |
| `TxnSignature`  | String | Blob              | A signature for this transaction, verifiable using the `SigningPubKey`. |
| `SigningPubKey` | String | Blob              | The public key used to create this signature. |

The `SigningPubKey` must be a key that is associated with the `Account` address. If the referenced `Account` is a funded account in the ledger, then the `SigningPubKey` can be that account's current Regular Key if one is set. It could also be that account's Master Key, unless the [`lsfDisableMaster`](accountroot.html#accountroot-flags) flag is enabled. If the referenced `Account` address is not a funded account in the ledger, then the `SigningPubKey` must be the master key associated with that address.

Because signature verification is a compute-intensive task, multi-signed transactions cost additional XRP to relay to the network. Each signature included in the multi-signature increases the [transaction cost](transaction-cost.html) required for the transaction. For example, if the current minimum transaction cost to relay a transaction to the network is `10000` drops, then a multi-signed transaction with 3 entries in the `Signers` array would need a `Fee` value of at least `40000` drops to relay.
