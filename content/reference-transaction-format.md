# Transactions #

A *Transaction* is the only way to modify the Ripple Ledger. All transactions have certain fields in common:

* [Common Fields](#common-fields)

There are several different types of transactions that do different actions, each with additional fields relevant to that type of action:

* [Payment - Send funds from one account to another](#payment)
* [AccountSet - Set options on an account](#accountset)
* [SetRegularKey - Set an account's regular key](#setregularkey)
* [OfferCreate - Submit an order to exchange currency](#offercreate)
* [OfferCancel - Withdraw a currency-exchange order](#offercancel)
* [TrustSet - Add or modify a trust line](#trustset)
* [SignerListSet - Set multi-signing settings](#signerlistset)

Additionally, there are *Pseudo-Transactions* that are not created and submitted in the usual way, but may appear in ledgers:

* [SetFee - Adjust the minimum transaction cost or account reserve](#setfee)
* [EnableAmendment - Apply a change to transaction processing](#enableamendment)

Transactions are only valid if signed, submitted, and accepted into a validated ledger version. There are many ways a transaction can fail.

* [Authorized Transactions](#authorizing-transactions)
* [Reliable Transaction Submission](#reliable-transaction-submission)
* [Transaction Results - How to find and interpret transaction results](#transaction-results)
* [Full Transaction Response List - Complete table of all error codes](#full-transaction-response-list)

## Authorizing Transactions ##

In the decentralized Ripple Consensus Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. A signed transaction is immutable: its contents cannot change, and the signature is not valid for any other transaction. <!-- STYLE_OVERRIDE: is authorized to -->

A transaction can be authorized by any of the following types of signatures:

* A single signature from the master secret key that is mathematically associated with the sending address. You can disable or enable the master key using an [AccountSet transaction](#accountset).
* A single signature that matches a regular key associated with the address. You can add, remove, or replace a regular key using a [SetRegularKey transaction](#setregularkey).
* A [multi-signature](#multi-signing) that matches a list of signers owned by the address. You can add, remove, or replace a list of signers using a [SignerListSet transaction](#signerlistset).

Any signature type can authorize any type of transaction, with the following exceptions:

* Only the master key can [disable the master key](#accountset-flags).
* Only the master key can [permanently give up the ability to freeze](concept-freeze.html#no-freeze).
* You can never remove the last method of signing transactions from an address.

## Signing and Submitting Transactions ##

Sending a transaction to the Ripple Consensus Ledger involves several steps:

1. Create an [unsigned transaction in JSON format](#unsigned-transaction-format).
2. Use one or more signatures to [authorize the transaction](#authorizing-transactions).
3. Submit a transaction to a `rippled` server. If the transaction is properly formed, the server provisionally applies the transaction to its current version of the ledger and relays the transaction to other members of the peer-to-peer network.
4. The [consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) determines which provisional transactions get included in the next validated ledger.
5. The `rippled` servers apply those transactions to the previous ledger in a canonical order and share their results.
6. If enough [trusted validators](tutorial-rippled-setup.html#reasons-to-run-a-validator) created the exact same ledger, that ledger is declared _validated_ and the [results of the transactions](#transaction-results) in that ledger are immutable.

### Unsigned Transaction Format ###

Here is an example of an unsigned [Payment-type transaction](#payment) in JSON:

```
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "10",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

The Ripple Consensus Ledger only relays and executes a transaction if the transaction object has been authorized by the sending address (in the `Account`) field. For transactions authorized by only a single signature, you have two options:

1. Convert it to a binary blob and sign it offline. This is preferable, since it means that the account secret used for signing the transaction is never transmitted over any network connection.
    * You can use [RippleAPI](reference-rippleapi.html#sign) for offline signing.
2. Have a `rippled` server sign the transaction for you. The [sign command](reference-rippled.html#sign) takes a JSON-format transaction and secret and returns the signed binary transaction format ready for submission. (Transmitting your account secret is dangerous, so you should only do this from within a trusted and encrypted connection, or through a local connection, and only to a server you control.)
    * As a shortcut, you can use the [submit command](reference-rippled.html#submit) with a `tx_json` object to sign and submit a transaction all at once. This is only recommended for testing and development purposes.

In either case, signing a transaction generates a binary blob that can be submitted to the network. This means using `rippled`'s [submit command](reference-rippled.html#submit). Here is an example of the same transaction, as a signed blob, being submitted with the WebSocket API:

```
{
  "id": 2,
  "command": "submit",
  "tx_blob" : "120000240000000461D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000F732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74483046022100982064CDD3F052D22788DB30B52EEA8956A32A51375E72274E417328EBA31E480221008F522C9DB4B0F31E695AA013843958A10DE8F6BA7D6759BEE645F71A7EB240BE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

After a transaction has been submitted, you can check its status using the API, for example using the [tx command](reference-rippled.html#tx).

**Caution:** The success of a transaction is not final unless the transaction appears in a **validated** ledger with the result code `tesSUCCESS`. See also: [Finality of Results](#finality-of-results).

Example response from the `tx` command:

```
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


### Multi-Signing ###

Multi-signing in Ripple is the act of [authorizing transactions](#authorizing-transactions) for the Ripple Consensus Ledger by using a combination of multiple secret keys. Multi-signing is due to be enabled by an [Amendment](concept-amendments.html) to the Ripple Consensus Protocol. You can have any combination of authorization methods enabled for your address, including multi-signing, a master key, and a [regular key](#setregularkey). (The only requirement is that _at least one_ method must be enabled.)

The [SignerListSet transaction](#signerlistset) defines which addresses can authorize transactions from your address. You can include up to 8 addresses in a SignerList. You can control how many signatures are needed, in which combinations, by using the quorum and weight values of the SignerList.

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must own a [`SignerList` in the ledger](reference-ledger-format.html#signerlist).
* The transaction must include the `SigningPubKey` field as an empty string.
* The transaction must include a [`Signers` field](#signers-field) containing an array of signatures.
* The signatures present in the `Signers` array must match signers defined in the SignerList.
* For the provided signatures, the total `weight` associated with those signers must be equal or greater than the `quorum` for the SignerList.
* The [transaction cost](concept-transaction-cost.html) (specified in the `Fee` field) must be at least (N+1) times the normal transaction cost, where N is the number of signatures provided.
* All fields of the transaction must be defined before collecting signatures. You cannot [auto-fill](#auto-fillable-fields) any fields.
* If presented in binary form, the `Signers` array must be sorted based on the numeric value of the signer addresses, with the lowest value first. (If submitted as JSON, the [`submit_multisigned` command](reference-rippled.html#submit-multisigned) handles this automatically.)

For more information, see [How to Multi-Sign](tutorial-multisign.html).


### Reliable Transaction Submission ###

Reliably submitting transactions is the process of achieving both of the following:

* Idempotency - A transaction should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To have both qualities when submitting a transaction, an application should:

1. Construct and sign the transaction first, including a [`LastLedgerSequence`](#lastledgersequence) parameter that gives the transaction a limited lifespan.
2. Persist details of the transaction before submitting.
3. Submit the transaction.
4. Confirm that the transaction was either included in a validated ledger, or that it has expired due to `LastLedgerSequence`.
5. If a transaction fails or expires, you can modify and resubmit it.

Main article: [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html)

### Identifying Transactions ###

The `"hash"` is the unique value that identifies a particular transaction. The server provides the hash in the response when you submit the transaction; you can also look up a transaction in an account's transaction history with the [account_tx command](reference-rippled.html#account-tx).

The transaction hash can be used as a "proof of payment" since anyone can [look up the transaction by its hash](#looking-up-transaction-results) to verify its final status.

## Common Fields ##

Every transaction type has the same set of fundamental fields. Field names are case-sensitive. The common fields for all transactions are:

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| Account | String | Account | The unique address of the account that initiated the transaction. |
| [AccountTxnID](#accounttxnid) | String | Hash256 | (Optional) Hash value identifying another transaction. This transaction is only valid if the sending account's previously-sent transaction matches the provided hash. |
| [Fee](#transaction-cost) | String | Amount | (Required, but [auto-fillable](#auto-fillable-fields)) Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network. |
| [Flags](#flags) | Unsigned Integer | UInt32 | (Optional) Set of bit-flags for this transaction. |
| [LastLedgerSequence](#lastledgersequence) | Number | UInt32 | (Optional, but strongly recommended) Highest ledger sequence number that a transaction can appear in. |
| [Memos](#memos) | Array of Objects | Array | (Optional) Additional arbitrary information used to identify this transaction. |
| [Sequence](#canceling-or-skipping-a-transaction) | Unsigned Integer | UInt32 | (Required, but [auto-fillable](#auto-fillable-fields)) The sequence number, relative to the initiating account, of this transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the last-valided transaction from the same account. |
| SigningPubKey | String | PubKey | (Automatically added when signing) Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty string, indicates a multi-signature is present in the `Signers` field instead. |
| [Signers](#signers-field) | Array | Array | (Optional) Array of objects that represent a [multi-signature](#multi-signing) which authorizes this transaction. |
| SourceTag | Unsigned Integer | UInt32 | (Optional) Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| TransactionType | String | UInt16 | The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, `AccountSet`, `SetRegularKey`, and `SignerListSet`. |
| TxnSignature | String | VariableLength | (Automatically added when signing) The signature that verifies this transaction as originating from the account it says it is from. |

**Note:** The deprecated `PreviousTxnID` transaction parameter was removed entirely in [rippled 0.28.0][]. Use `AccountTxnID` instead.

[rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0-rc1

### Auto-fillable Fields ###

Some fields can be automatically filled in before the transaction is signed, either by a `rippled` server or by the library used for offline signing. Both [ripple-lib](https://github.com/ripple/ripple-lib) and `rippled` can automatically provide the following values:

* `Fee` - Automatically fill in the [transaction cost](concept-transaction-cost.html) based on the network. (*Note:* `rippled`'s [sign command](reference-rippled.html#sign) supports limits on how high the filled-in-value is, using the `fee_mult_max` parameter.)
* `Sequence` - Automatically use the next sequence number for the account sending the transaction.

For a production system, we recommend *not* leaving these fields to be filled by the server. For example, if transaction costs become high due to a temporary spike in network load, you may want to wait for the cost to decrease before sending some transactions, instead of paying the temporarily-high cost.

The [`Paths` field](#paths) of the [Payment](#payment) transaction type can also be automatically filled in.


### Transaction Cost ###

To protect the Ripple Consensus Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of XRP. This _[transaction cost](concept-transaction-cost.html)_ is designed to increase along with the load on the network, making it very expensive to deliberately or inadvertently overload the network.

The `Fee` field specifies an amount, in [drops of XRP](reference-rippled.html#specifying-currency-amounts), to destroy as the cost for relaying this transaction. If the transaction is included in a validated ledger (whether or not it achieves its intended purpose), then the amount of XRP specified in the `Fee` parameter is destroyed forever. You can [look up the transaction cost](concept-transaction-cost.html#querying-the-transaction-cost) in advance, or [let `rippled` set it automatically](concept-transaction-cost.html#automatically-specifying-the-transaction-cost) when you sign a transaction.

**Note:** [Multi-signed transactions](#multi-signing) require additional fees to relay to the network.


### Canceling or Skipping a Transaction ###

An important and intentional feature of the Ripple Network is that a transaction is final as soon as it has been incorporated in a validated ledger.

However, if a transaction has not yet been included in a validated ledger, you can effectively cancel it by rendering it invalid. Typically, this means sending another transaction with the same `Sequence` value from the same account. If you do not want the replacement transaction to do anything, send an [AccountSet](#accountset) transaction with no options.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](#transaction-cost) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.

### LastLedgerSequence ###

We strongly recommend that you specify the `LastLedgerSequence` parameter on every transaction. Provide a value of about 3 higher than [the most recent ledger index](reference-rippled.html#ledger) to ensure that your transaction is either validated or rejected within a matter of seconds.

Without the `LastLedgerSequence` parameter, a transaction can become stuck in an undesirable state where it is neither validated nor rejected for a long time. Specifically, if the load-based [transaction cost](#transaction-cost) of the network increases after you send a transaction, your transaction may not get propagated enough to be included in a validated ledger, but you would have to pay the (increased) transaction cost to [send another transaction canceling it](#canceling-or-skipping-a-transaction). Later, if the transaction cost decreases again, the transaction can become included in a future ledger. The `LastLedgerSequence` places a hard upper limit on how long the transaction can wait to be validated or rejected.

### AccountTxnID ###

The `AccountTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous one (by Sequence Number) is also valid and matches the transaction you expected.

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially have serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `AccountTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.

To use AccountTxnID, you must first set the [asfAccountTxnID](#accountset-flags) flag, so that the ledger keeps track of the ID for the account's previous transaction.

### Memos ###

The `Memos` field includes arbitrary messaging data with the transaction. It is presented as an array of objects. Each object has only one field, `Memo`, which in turn contains another object with *one or more* of the following fields:

| Field | Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|------|--------------------------------------------------------|-------------|
| MemoData | String | VariableLength | Arbitrary hex value, conventionally containing the content of the memo. |
| MemoFormat | String | VariableLength | Hex value representing characters allowed in URLs. Conventionally containing information on how the memo is encoded, for example as a [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml). |
| MemoType | String | VariableLength | Hex value representing characters allowed in URLs. Conventionally, a unique relation (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. |

The MemoType and MemoFormat fields should only consist of the following characters: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%`

The `Memos` field is limited to no more than 1KB in size (when serialized in binary format).

Example of a transaction with a Memos field:

```
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

### Signers Field ###

The `Signers` field contains a [multi-signature](#multi-signing), which has signatures from up to 8 key pairs, that together should authorize the transaction. The `Signers` list is an array of objects, each with one field, `Signer`. The `Signer` field has the following nested fields:

| Field | Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|------|--------------------------------------------------------|-------------|
| Account | String | AccountID | The address associated with this signature, as it appears in the SignerList. |
| TxnSignature | String | Blob | A signature for this transaction, verifiable using the `SigningPubKey`. |
| SigningPubKey | String | PubKey | The public key used to create this signature. |

The `SigningPubKey` must be a key that is associated with the `Account` address. If the referenced `Account` is a funded account in the ledger, then the SigningPubKey can be that account's current Regular Key if one is set. It could also be that account's Master Key, unless the [lsfDisableMaster](reference-ledger-format.html#accountroot-flags) flag is enabled. If the referenced `Account` address is not a funded account in the ledger, then the `SigningPubKey` must be the master key associated with that address.

Because signature verification is a compute-intensive task, multi-signed transactions cost additional XRP to relay to the network. Each signature included in the multi-signature increases the [transaction cost](concept-transaction-cost.html) required for the transaction. For example, if the current minimum transaction cost to relay a transaction to the network is `10000` drops, then a multi-signed transaction with 3 entries in the `Signers` array would need a `Fee` value of at least `40000` drops to relay.



### Flags ###

The `Flags` field can contain various options that affect how a transaction should behave. The options are represented as binary values that can be combined with bitwise-or operations to set multiple flags at once.

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

The only flag that applies globally to all transactions is as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfFullyCanonicalSig | 0x80000000 | 2147483648 | Require a fully-canonical signature, to protect a transaction from [transaction malleability](https://wiki.ripple.com/Transaction_Malleability) exploits. |



## Payment ##
[[Source]<br>](https://github.com/ripple/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/transactors/Payment.cpp "Source")

A Payment transaction represents a transfer of value from one account to another. (Depending on the path taken, this can involve additional exchanges of value, which occur atomically.)

Payments are also the only way to [create accounts](#creating-accounts).

Example payment:

```
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "10",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| Amount | String (XRP)<br/>Object (Otherwise) | Amount | The amount of currency to deliver. Formatted as per [Specifying Currency Amounts](reference-rippled.html#specifying-currency-amounts). For non-XRP amounts, the nested field names are lower-case. If the [*tfPartialPayment* flag](#payment-flags) is set, deliver _up to_ this amount instead. |
| Destination | String | Account | The unique address of the account receiving the payment. |
| DestinationTag | Unsigned Integer | UInt32 | (Optional) Arbitrary tag that identifies the reason for the payment to the destination, or a hosted recipient to pay. |
| InvoiceID | String | Hash256 | (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this payment. |
| Paths | Array of path arrays | PathSet | (Optional, auto-fillable) Array of [payment paths](https://ripple.com/wiki/Payment_paths) to be used for this transaction. Must be omitted for XRP-to-XRP transactions. |
| SendMax | String/Object | Amount | (Optional) Highest amount of source currency this transaction is allowed to cost, including [transfer fees](concept-transfer-fees.html), exchange rates, and [slippage](http://en.wikipedia.org/wiki/Slippage_%28finance%29). Does not include the [XRP destroyed as a cost for submitting the transaction](#transaction-cost). See also: [Specifying Currency Amounts](reference-rippled.html#specifying-currency-amounts). For non-XRP amounts, the nested field names are lower-case. Must be supplied for cross-currency/cross-issue payments. Must be omitted for XRP-to-XRP payments. |
| DeliverMin | String/Object | Amount | (Optional) Minimum amount of destination currency this transaction should deliver. Only valid if this is a [partial payment](#partial-payments). For non-XRP amounts, the nested field names are lower-case. |

### Special issuer Values for SendMax and Amount ###

Most of the time, the `issuer` field of a non-XRP [currency amount](reference-rippled.html#specifying-currency-amounts) indicates a financial institution's [issuing address](concept-issuing-and-operational-addresses.html). However, when describing payments, there are special rules for the `issuer` field in the `Amount` and `SendMax` fields of a payment.

* There is only ever one balance for the same currency between two addresses. This means that, sometimes, the `issuer` field of an amount actually refers to a counterparty that is redeeming issuances, instead of the address that created the issuances.
* When the `issuer` field of the destination `Amount` field matches the `Destination` address, it is treated as a special case meaning "any issuer that the destination accepts." This includes all addresses to which the destination has extended trust lines, as well as issuances created by the destination which are held on other trust lines.
* When the `issuer` field of the `SendMax` field matches the source account's address, it is treated as a special case meaning "any issuer that the source can use." This includes creating new issuances on trust lines that other accounts have extended to the source account, and sending issuances the source account holds from other issuers.

### Creating Accounts ###

The Payment transaction type is the only way to create new accounts in the Ripple Consensus Ledger. To do so, send an amount of XRP that is equal or greater than the [account reserve](concept-reserves.html) to a mathematically-valid account address that does not exist yet. When the Payment is processed, a new [AccountRoot node](reference-ledger-format.html#accountroot) is added to the ledger.

If you send an insufficient amount of XRP, or any other currency, the Payment fails.

### Paths ###

If present, the `Paths` field must contain a _path set_ - an array of path arrays. Each individual path represents one way value can flow from the sender to receiver through various intermediary accounts and order books. A single transaction can potentially use multiple paths, for example if the transaction exchanges currency using several different order books to achieve the best rate.

You must omit the `Paths` field for direct payments, including:

* An XRP-to-XRP transfer.
* A direct transfer on a trust line that connects the sender and receiver.

If the `Paths` field is provided, the server decides at transaction processing time which paths to use, from the provided set plus a _default path_ (the most direct way possible to connect the specified accounts). This decision is deterministic and attempts to minimize costs, but it is not guaranteed to be perfect.

The `Paths` field must not be an empty array, nor an array whose members are all empty arrays.

For more information, see [Paths](concept-paths.html).



### Payment Flags ###

Transactions of the Payment type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfNoDirectRipple | 0x00010000 | 65536 | Do not use the default path; only use paths included in the `Paths` field. This is intended to force the transaction to take arbitrage opportunities. Most clients do not need this. |
| tfPartialPayment | 0x00020000 | 131072 | If the specified `Amount` cannot be sent without spending more than `SendMax`, reduce the received amount instead of failing outright. See [Partial Payments](#partial-payments) for more details. |
| tfLimitQuality | 0x00040000 | 262144 | Only take paths where all the conversions have an input:output ratio that is equal or better than the ratio of `Amount`:`SendMax`. See [Limit Quality](#limit-quality) for details. |

### Partial Payments ###

A partial payment allows a payment to succeed by reducing the amount received, instead of increasing the `SendMax`. Partial payments are useful for [returning payments](https://wiki.ripple.com/Returning_payments) without incurring additional costs to oneself.

By default, the `Amount` field of a Payment transaction specifies the amount of currency that is *received* by the account that is the destination of the payment. Any additional amount needed for fees or currency exchange is deducted from the sending account's balances, up to the `SendMax` amount. (If `SendMax` is not specified, that is equivalent to setting the `SendMax` to the `Amount` field.) If the amount needed to make the payment exceeds the `SendMax` parameter, or the full amount cannot be delivered for any other reason, the transaction fails.

The [*tfPartialPayment* flag](#payment-flags) allows you to make a "partial payment" instead. When this flag is enabled for a payment, it delivers as much as possible, up to the `Amount` value, without exceeding the `SendMax` value. Fees and currency exchange rates are calculated the same way, but the amount being sent automatically scales down until the total amount deducted from the sending account's balances is within `SendMax`. The transaction is considered successful as long as it delivers equal or more than the `DeliverMin` value; if DeliverMin is omitted, then any positive amount is considered a success. This means that partial payments can succeed at sending *some* of the intended value despite limitations including fees, lack of liquidity, insufficient space in the receiving account's trustlines, or other reasons.

A partial payment cannot provide the XRP to fund an address; this case returns the error code `telNO_DST_PARTIAL`. Direct XRP-to-XRP payments also cannot be partial payments `temBAD_SEND_XRP_PARTIAL`.

The amount of XRP used for the [transaction cost](#transaction-cost) is always deducted from the sender’s account, regardless of the *tfPartialPayment* flag.

#### Partial Payments Warning ####

When the [*tfPartialPayment* flag](#payment-flags) is enabled, the `Amount` field __*is not guaranteed to be the amount received*__. The [`delivered_amount`](#delivered-amount) field of a payment's metadata indicates the amount of currency actually received by the destination account. When receiving a payment, use `delivered_amount` instead of the `Amount` field to determine how much your account received instead.


### Limit Quality ###

Ripple defines the "quality" of a currency exchange as the ratio of the numeric amount in to the numeric amount out. For example, if you spend $2 USD to receive £1 GBP, then the "quality" of that exchange is `0.5`.

The [*tfLimitQuality* flag](#payment-flags) allows you to set a minimum quality of conversions that you are willing to take. This limit quality is defined as the destination `Amount` divided by the `SendMax` amount (the numeric amounts only, regardless of currency). When set, the payment processing engine avoids using any paths whose quality (conversion rate) is worse (numerically lower) than the limit quality.

By itself, the tfLimitQuality flag reduces the number of situations in which a transaction can succeed. Specifically, it rejects payments where some part of the payment uses an unfavorable conversion, even if the overall average *average* quality of conversions in the payment is equal or better than the limit quality. If a payment is rejected in this way, the [transaction result](#transaction-results) is `tecPATH_DRY`.

Consider the following example. If I am trying to send you 100 Chinese Yuan (`Amount` = 100 CNY) for 20 United States dollars (`SendMax` = 20 USD) or less, then the limit quality is `5`. Imagine one trader is offering ¥95 for $15 (a ratio of about `6.3` CNY per USD), but the next best offer in the market is ¥5 for $2 (a ratio of `2.5` CNY per USD). If I were to take both offers to send you 100 CNY, then it would cost me 17 USD, for an average quality of about `5.9`.

Without the tfLimitQuality flag set, this transaction would succeed, because the $17 it costs me is within my specified `SendMax`. However, with the tfLimitQuality flag enabled, the transaction would fail instead, because the path to take the second offer has a quality of `2.5`, which is worse than the limit quality of `5`.

The tfLimitQuality flag is most useful when combined with [partial payments](#partial-payments). When both *tfPartialPayment* and *tfLimitQuality* are set on a transaction, then the transaction delivers as much of the destination `Amount` as it can, without using any conversions that are worse than the limit quality.

In the above example with a ¥95/$15 offer and a ¥5/$2 offer, the situation is different if my transaction has both tfPartialPayment and tfLimitQuality enabled. If we keep my `SendMax` of 20 USD and a destination `Amount` of 100 CNY, then the limit quality is still `5`. However, because I am doing a partial payment, the transaction sends as much as it can instead of failing if the full destination amount cannot be sent. This means that my transaction consumes the ¥95/$15 offer, whose quality is about `6.3`, but it rejects the ¥5/$2 offer because that offer's quality of `2.5` is worse than the quality limit of `5`. In the end, my transaction only delivers ¥95 instead of the full ¥100, but it avoids wasting money on poor exchange rates.



## AccountSet ##

[[Source]<br>](https://github.com/ripple/rippled/blob/f65cea66ef99b1de149c02c15f06de6c61abf360/src/ripple/app/transactors/SetAccount.cpp "Source")

An AccountSet transaction modifies the properties of an [account in the Ripple Consensus Ledger](reference-ledger-format.html#accountroot).

Example AccountSet:

```
{
    "TransactionType": "AccountSet",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10000",
    "Sequence": 5,
    "Domain": "6D64756F31332E636F6D",
    "SetFlag": 5,
    "MessageKey": "rQD4SqHJtDxn5DDL7xNnojNa3vxS1Jx5gv"
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| [ClearFlag](#accountset-flags) | Unsigned Integer | UInt32 | (Optional) Unique identifier of a flag to disable for this account. |
| [Domain](#domain) | String | VariableLength | (Optional) The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase. |
| EmailHash | String | Hash128 | (Optional) Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| MessageKey | String | PubKey | (Optional) Public key for sending encrypted messages to this account. Conventionally, it should be a secp256k1 key, the same encryption that is used by the rest of Ripple. |
| [SetFlag](#accountset-flags) | Unsigned Integer | UInt32 | (Optional) Integer flag to enable for this account. |
| [TransferRate](#transferrate) | Unsigned Integer | UInt32 | (Optional) The fee to charge when users transfer this account's issuances, represented as billionths of a unit. Use `0` to set no fee. |
| WalletLocator | String | Hash256 | (Optional) Not used. |
| WalletSize | Unsigned Integer | UInt32 | (Optional) Not used. |

If none of these options are provided, then the AccountSet transaction has no effect (beyond destroying the transaction cost). See [Canceling or Skipping a Transaction](#canceling-or-skipping-a-transaction) for more details.

### Domain ###

The `Domain` field is represented as the hex string of the lowercase ASCII of the domain. For example, the domain *example.com* would be represented as `"6578616d706c652e636f6d"`.

To remove the `Domain` field from an account, send an AccountSet with the Domain set to an empty string.

Client applications can use the [ripple.txt](https://ripple.com/wiki/Ripple.txt) file hosted by the domain to confirm that the account is actually operated by that domain.

### AccountSet Flags ###

There are several options which can be either enabled or disabled for an account. Account options are represented by different types of flags depending on the situation:

* The `AccountSet` transaction type has several "AccountSet Flags" (prefixed **asf**) that can enable an option when passed as the `SetFlag` parameter, or disable an option when passed as the `ClearFlag` parameter.
* The `AccountSet` transaction type has several transaction flags (prefixed **tf**) that can be used to enable or disable specific account options when passed in the `Flags` parameter. This style is discouraged. New account options do not have corresponding transaction (tf) flags.
* The `AccountRoot` ledger node type has several ledger-specific-flags (prefixed **lsf**) which represent the state of particular account options within a particular ledger. Naturally, the values apply until a later ledger version changes them.

The preferred way to enable and disable Account Flags is using the `SetFlag` and `ClearFlag` parameters of an AccountSet transaction. AccountSet flags have names that begin with **asf**.

All flags are off by default.

The available AccountSet flags are:

| Flag Name | Decimal Value | Description | Corresponding Ledger Flag |
|-----------|---------------|-------------|---------------------------|
| asfRequireDest | 1 | Require a destination tag to send transactions to this account. | lsfRequireDestTag |
| asfRequireAuth | 2 | Require authorization for users to hold balances issued by this address. Can only be enabled if the address has no trust lines connected to it. | lsfRequireAuth |
| asfDisallowXRP | 3 | XRP should not be sent to this account. (Enforced by client applications, not by `rippled`) | lsfDisallowXRP |
| asfDisableMaster | 4 | Disallow use of the master key. Can only be enabled if the account has configured another way to sign transactions, such as a [Regular Key](#setregularkey) or a [Signer List](#signerlistset). | lsfDisableMaster |
| asfAccountTxnID | 5 | Track the ID of this account's most recent transaction. Required for [AccountTxnID](#accounttxnid) | (None) |
| asfNoFreeze | 6 | Permanently give up the ability to [freeze individual trust lines or disable Global Freeze](concept-freeze.html). This flag can never be disabled after being enabled. | lsfNoFreeze |
| asfGlobalFreeze | 7 | [Freeze](concept-freeze.html) all assets issued by this account. | lsfGlobalFreeze |
| asfDefaultRipple | 8 | Enable [rippling](concept-noripple.html) on this account's trust lines by default. _(New in [rippled 0.27.3](https://github.com/ripple/rippled/releases/tag/0.27.3))_ | lsfDefaultRipple |

_New in [rippled 0.28.0][]:_ To enable the `asfDisableMaster` or `asfNoFreeze` flags, you must [authorize the transaction](#authorizing-transactions) by signing it with the master key. You cannot use a regular key or a multi-signature.

The following [Transaction flags](#flags), specific to the AccountSet transaction type, serve the same purpose, but are discouraged:

| Flag Name | Hex Value | Decimal Value | Replaced by AccountSet Flag |
|-----------|-----------|---------------|-----------------------------|
| tfRequireDestTag | 0x00010000 | 65536 | asfRequireDest (SetFlag) |
| tfOptionalDestTag | 0x00020000 | 131072 | asfRequireDest (ClearFlag) |
| tfRequireAuth | 0x00040000 | 262144 | asfRequireAuth (SetFlag) |
| tfOptionalAuth | 0x00080000 | 524288 | asfRequireAuth (ClearFlag) |
| tfDisallowXRP | 0x00100000 | 1048576 | asfDisallowXRP (SetFlag) |
| tfAllowXRP | 0x00200000 | 2097152 | asfDisallowXRP (ClearFlag) |



#### Blocking Incoming Transactions ####

Incoming transactions with unclear purposes may be an inconvenience for financial institutions, who would have to recognize when a customer made a mistake, and then potentially refund accounts or adjust balances depending on the mistake. The `asfRequireDest` and `asfDisallowXRP` flags are intended to protect users from accidentally sending funds in a way that is unclear about the reason the funds were sent.

For example, a destination tag is typically used to identify which hosted balance should be credited when a financial institution receives a payment. If the destination tag is omitted, it may be unclear which account should be credited, creating a need for refunds, among other problems. By using the `asfRequireDest` tag, you can ensure that every incoming payment has a destination tag, which makes it harder for others to send you an ambiguous payment by accident.

You can protect against unwanted incoming payments for non-XRP currencies by not creating trust lines in those currencies. Since XRP does not require trust, the `asfDisallowXRP` flag is used to discourage users from sending XRP to an account. However, this flag is not enforced in `rippled` because it could potentially cause accounts to become unusable. (If an account did not have enough XRP to send a transaction that disabled the flag, the account would be completely unusable.) Instead, client applications should disallow or discourage XRP payments to accounts with the `asfDisallowXRP` flag enabled.

### TransferRate ###

The TransferRate field specifies a fee to charge whenever counterparties transfer the currency you issue. See [Transfer Fees article](https://ripple.com/knowledge_center/transfer-fees/) in the Knowledge Center for more information.

In `rippled`'s WebSocket and JSON-RPC APIs, the TransferRate is represented as an integer, the amount that must be sent for 1 billion units to arrive. For example, a 20% transfer fee is represented as the value `1200000000`.  The value cannot be less than 1000000000. (Less than that would indicate giving away money for sending transactions, which is exploitable.) You can specify 0 as a shortcut for 1000000000, meaning no fee.



## SetRegularKey ##

[[Source]<br>](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

A SetRegularKey transaction changes the regular key associated with an address.

```
{
    "Flags": 0,
    "TransactionType": "SetRegularKey",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| RegularKey | String | AccountID | (Optional) A base-58-encoded [Ripple address](reference-rippled.html#addresses) to use as the regular key. If omitted, removes the existing regular key. |

In addition to the master key, which is mathematically-related to an address, you can associate **at most 1 additional key pair** with an address using this type of transaction. The additional key pair is called a _regular key_. If your address has a regular key pair defined, you can use the secret key of the regular key pair to [authorize transactions](#authorizing-transactions).

A regular key pair is generated in the same way as any other Ripple keys (for example, with [wallet_propose](reference-rippled.html#wallet-propose)), but it can be changed. A master key pair is an intrinsic part of an address's identity (the address is derived from the master public key). You can [disable](#accountset-flags) a master key but you cannot change it.

You can protect your master secret by using a regular key instead of the master key to sign transactions whenever possible. If your regular key is compromised, but the master key is not, you can use a SetRegularKey transaction to regain control of your address. In some cases, you can even send a [key reset transaction](concept-transaction-cost.html#key-reset-transaction) without paying the [transaction cost](#transaction-cost).

For even greater security, you can use [multi-signing](#multi-signing), but multi-signing requires additional XRP for the [transaction cost](concept-transaction-cost.html) and [reserve](concept-reserves.html).



## OfferCreate ##

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "Source")

An OfferCreate transaction is effectively a [limit order](http://en.wikipedia.org/wiki/limit_order). It defines an intent to exchange currencies, and creates an Offer node in the Ripple Consensus Ledger if not completely fulfilled when placed. Offers can be partially fulfilled.

```
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| [Expiration](#expiration) | Unsigned Integer | UInt32 | (Optional) Time after which the offer is no longer active, in [seconds since the Ripple Epoch](reference-rippled.html#specifying-time). |
| OfferSequence | Unsigned Integer | UInt32 | (Optional) An offer to delete first, specified in the same way as [OfferCancel](#offercancel). |
| TakerGets | Object (Non-XRP), or <br/>String (XRP) | Amount | The amount and type of currency being provided by the offer creator. |
| TakerPays | Object (Non-XRP), or <br/>String (XRP) | Amount | The amount and type of currency being requested by the offer creator. |

### Lifecycle of an Offer ###

When an OfferCreate transaction is processed, it automatically consumes matching or crossing offers to the extent possible. (If existing offers provide a better rate than requested, the offer creator could pay less than the full `TakerGets` amount to receive the entire `TakerPays` amount.) If that does not completely fulfill the `TakerPays` amount, then the offer becomes an Offer node in the ledger. (You can use [OfferCreate Flags](#offercreate-flags) to modify this behavior.)

An offer in the ledger can be fulfilled either by additional OfferCreate transactions that match up with the existing offers, or by [Payments](#payment) that use the offer to connect the payment path. Offers can be partially fulfilled and partially funded. A single transaction can consume up to 850 Offers from the ledger. (Any more than that, and the metadata becomes too large, resulting in [`tecOVERSIZE`](#tec-codes).)

You can create an offer so long as you have at least some (any positive, nonzero amount) of the currency specified by the `TakerGets` parameter of the offer. The offer sells as much of the currency as you have, up to the `TakerGets` amount, until the `TakerPays` amount is satisfied. An offer cannot place anyone in debt.

It is possible for an offer to become temporarily or permanently *unfunded*:

* If the creator no longer has any of the `TakerGets` currency.
  * The offer becomes funded again when the creator obtains more of that currency.
* If the currency required to fund the offer is held in a [frozen trust line](concept-freeze.html).
  * The offer becomes funded again when the trust line is no longer frozen.
* If the creator does not have enough XRP for the reserve amount of a new trust line required by the offer. (See [Offers and Trust](#offers-and-trust).)
  * The offer becomes funded again when the creator obtains more XRP, or the reserve requirements decrease.
* If the Expiration time included in the offer is before the close time of the most recently-closed ledger. (See [Expiration](#expiration).)

An unfunded offer can stay on the ledger indefinitely, but it does not have any effect. The only ways an offer can be *permanently* removed from the ledger are:

* It becomes fully claimed by a Payment or a matching OfferCreate transaction.
* An OfferCancel or OfferCreate transaction explicitly cancels the offer.
* An OfferCreate transaction from the same account crosses the earlier offer. (In this case, the older offer is automatically canceled.)
* An offer is found to be unfunded during transaction processing, typically because it was at the tip of the orderbook.
    * This includes cases where one side or the other of an offer is found to be closer to 0 than `rippled`'s precision supports.

#### Tracking Unfunded Offers ####

Tracking the funding status of all offers can be computationally taxing. In particular, addresses that are actively trading may have a large number of offers open. A single balance can affect the funding status of many offers to buy different currencies. Because of this, `rippled` does not proactively find and remove offers.

A client application can locally track the funding status of offers. To do this, first retreive an order book using the [`book_offers` command](reference-rippled.html#book-offers) and check the `taker_gets_funded` field of offers. Then,  [subscribe](reference-rippled.html#subscribe) to the `transactions` stream and watch the transaction metadata to see which offers are modified.


### Offers and Trust ###

The limit values of trust lines (See [TrustSet](#trustset)) do not affect offers. In other words, you can use an offer to acquire more than the maximum amount you trust an issuer to redeem.

However, holding non-XRP balances still requires a trust line to the address issuing those balances. When an offer is taken, it automatically creates any necessary trust lines, setting their limits to 0. Because [trust lines increase the reserve an account must hold](concept-reserves.html), any offers that would require a new trust line also require the address to have enough XRP to meet the reserve for that trust line.

A trust line indicates an issuer you trust enough to accept their issuances as payment, within limits. Offers are explicit instructions to acquire certain issuances, so they are allowed to go beyond those limits.

### Offer Preference ###

Existing offers are grouped by "quality", which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher quality are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same quality are taken on the basis of which offer was placed in the earliest ledger version.

When offers of the same quality are placed in the same ledger version, the order in which they are taken is determined by the [canonical order](https://github.com/ripple/rippled/blob/f65cea66ef99b1de149c02c15f06de6c61abf360/src/ripple/app/misc/CanonicalTXSet.cpp "Source: Transaction ordering") in which the transactions were [applied to the ledger](https://github.com/ripple/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Source: Applying transactions"). This behavior is designed to be deterministic, efficient, and hard to game.

### Expiration ###

Since transactions can take time to propagate and confirm, the timestamp of a ledger is used to determine offer validity. An offer only expires when its Expiration time is before the most-recently validated ledger. In other words, an offer with an `Expiration` field is still considered "active" if its expiration time is later than the timestamp of the most-recently validated ledger, regardless of what your local clock says.

You can determine the final disposition of an offer with an `Expiration` as soon as you see a fully-validated ledger with a close time equal to or greater than the expiration time.

**Note:** Since only new transactions can modify the ledger, an expired offer can stay on the ledger after it becomes inactive. The offer is treated as unfunded and has no effect, but it can continue to appear in results (for example, from the [ledger_entry](reference-rippled.html#ledger-entry) command). Later on, the expired offer can get finally deleted as a result of another transaction (such as another OfferCreate) if the server finds it while processing.

If an OfferCreate transaction has an `Expiration` time that has already passed when the transaction first gets included in a ledger, the transaction does not execute the offer but still results in a `tesSUCCESS` transaction code. (This is because such a transaction could still successfully cancel another offer.)

### Auto-Bridging ###

Any OfferCreate that would exchange two non-XRP currencies could potentially use XRP as an intermediary currency in a synthetic order book. This is because of auto-bridging, which serves to improve liquidity across all currency pairs by using XRP as a vehicle currency. This works because of XRP's nature as a native cryptocurrency to the Ripple Consensus Ledger. Offer execution can use a combination of direct and auto-bridged offers to achieve the best total exchange rate.

Example: _Anita places an offer to sell GBP and buy BRL. She might fund that this uncommon currency market has few offers. There is one offer with a good rate, but it has insufficient quantity to satisfy Anita's trade. However, both GBP and BRL have active, competitive markets to XRP. Auto-bridging software finds a way to complete Anita's offer by purchasing XRP with GBP from one trader, then selling the XRP to another trader to buy BRL. Anita automatically gets the best rate possible by combining the small offer in the direct GBP:BRL market with the better composite rates created by pairing GBP:XRP and XRP:BRL offers._

Auto-bridging happens automatically on any OfferCreate transaction. [Payment transactions](#payment) _do not_ autobridge by default, but path-finding can find paths that have the same effect.


### OfferCreate Flags ###

Transactions of the OfferCreate type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfPassive | 0x00010000 | 65536 | If enabled, the offer does not consume offers that exactly match it, and instead becomes an Offer node in the ledger. It still consumes offers that cross it. |
| tfImmediateOrCancel | 0x00020000 | 131072 | Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). If enabled, the offer never becomes a ledger node: it only tries to match existing offers in the ledger. |
| tfFillOrKill | 0x00040000 | 262144 | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). Only try to match existing offers in the ledger, and only do so if the entire `TakerPays` quantity can be obtained. |
| tfSell | 0x00080000 | 524288 | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |

The following invalid flag combination prompts a temINVALID_FLAG error:

* tfImmediateOrCancel and tfFillOrKill




## OfferCancel ##

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CancelOffer.cpp "Source")

An OfferCancel transaction removes an Offer node from the Ripple Consensus Ledger.

```
{
    "TransactionType": "OfferCancel",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108629,
    "OfferSequence": 6,
    "Sequence": 7
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| OfferSequence | Unsigned Integer | UInt32 | The sequence number of a previous OfferCreate transaction. If specified, cancel any offer node in the ledger that was created by that transaction. It is not considered an error if the offer specified does not exist. |

*Tip:* To remove an old offer and replace it with a new one, you can use an [OfferCreate](#offercreate) transaction with an `OfferSequence` parameter, instead of using OfferCancel and another OfferCreate.

The OfferCancel method returns [tesSUCCESS](#transaction-results) even if it did not find an offer with the matching sequence number.


## TrustSet ##

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/SetTrust.cpp "Source")

Create or modify a trust line linking two accounts.

```
{
    "TransactionType": "TrustSet",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 262144,
    "LastLedgerSequence": 8007750,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
      "value": "100"
    },
    "Sequence": 12
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| [LimitAmount](#trust-limits) | Object | Amount | Object defining the trust line to create or modify, in the same format as [currency amounts](reference-rippled.html#specifying-currency-amounts). |
| LimitAmount.currency | String | (Amount.currency) | The currency to this trust line applies to, as a three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to [currency format](https://wiki.ripple.com/Currency_format). "XRP" is invalid. |
| LimitAmount.value | String | (Amount.value) | Quoted decimal representation of the limit to set on this trust line. |
| LimitAmount.issuer | String | (Amount.issuer) | The address of the account to extend trust to. |
| QualityIn | Unsigned Integer | UInt32 | (Optional) Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |
| QualityOut | Unsigned Integer | UInt32 | (Optional) Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |

### Trust Limits ###

All balances on the Ripple Consensus Ledger (RCL), except for XRP, represent value owed in the world outside the Ripple Ledger. The address that issues those funds in Ripple (identified by the `issuer` field of the `LimitAmount` object) is expected to pay the balance back, outside of the Ripple Consensus Ledger, when users redeem their Ripple balances by returning them to the issuer.

Since a computer program cannot force a someone to keep a promise and not default in real life, trust lines represent a way of configuring how much you trust an issuer to hold on your behalf. Since a large, reputable financial institution is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuer "owe" you in the RCL. If the issuer defaults or goes out of business, you can lose up to that much money because the balances you hold in the Ripple Consensus Ledger can no longer be exchanged for equivalent balances elsewhere. (You can still keep or trade the issuances in the RCL, but they no longer have any reason to be worth anything.)

There are two cases where you can hold a balance on a trust line that is *greater* than your limit: when you acquire more of that currency through [trading](#offercreate), or when you decrease the limit on your trust line.

Since a trust line occupies space in the ledger, [a trust line increases the XRP your account must hold in reserve](concept-reserves.html). This applies to the account extending trust, not to the account receiving it.

A trust line with settings in the default state is equivalent to no trust line.

The default state of all flags is off, except for the [NoRipple flag](concept-noripple.html), whose default state depends on the DefaultRipple flag.

The Auth flag of a trust line does not determine whether the trust line counts towards its owner's XRP reserve requirement. However, an enabled Auth flag prevents the trust line from being in its default state. An authorized trust line can never be deleted. _(New in [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.30.0))_: The [`TrustSetAuth` Amendment](concept-amendments.html#trustsetauth) would allow you to pre-authorize a trust line with the `tfSetfAuth` flag only, even if the limit and balance of the trust line are 0. This Amendment is not currently enabled.

### TrustSet Flags ###

Transactions of the TrustSet type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfSetfAuth | 0x00010000 | 65536 | Authorize the other party to hold issuances from this account. (No effect unless using the [*asfRequireAuth* AccountSet flag](#accountset-flags).) Cannot be unset. |
| tfSetNoRipple | 0x00020000 | 131072 | Blocks rippling between two trustlines of the same currency, if this flag is set on both. (See [No Ripple](concept-noripple.html) for details.) |
| tfClearNoRipple | 0x00040000 | 262144 | Clears the No-Rippling flag. (See [No Ripple](concept-noripple.html) for details.) |
| tfSetFreeze | 0x00100000 | 1048576 | [Freeze](concept-freeze.html) the trustline.
| tfClearFreeze | 0x00200000 | 2097152 | [Unfreeze](concept-freeze.html) the trustline. |



## SignerListSet ##
[[Source]<br>](https://github.com/ripple/rippled/blob/ef511282709a6a0721b504c6b7703f9de3eecf38/src/ripple/app/tx/impl/SetSignerList.cpp "Source")

The SignerListSet transaction creates, replaces, or removes a list of signers that can be used to [multi-sign](#multi-signing) a transaction. This transaction type is introduced by the [MultiSign amendment](concept-amendments.html#multisign). _(New in [version 0.31.0][])_

Example SignerListSet:

```
{
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10000",
    "SignerQuorum": 3,
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "SignerWeight": 1
            }
        },
        {
            "SignerEntry": {
                "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                "SignerWeight": 1
            }
        }
    ]
}
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| SignerQuorum | Number | UInt32 | A target number for the signer weights. A multi-signature from this list is valid only if the sum weights of the signatures provided is greater than or equal to this value. To delete a SignerList, use the value `0`. |
| SignerEntries | Array | Array | (Omitted when deleting) Array of [SignerEntry objects](reference-ledger-format.html#signerentry-object), indicating the addresses and weights of signers in this list. A SignerList must have at least 1 member and no more than 8 members. No address may appear more than once in the list, nor may the `Account` submitting the transaction appear in the list. |

An account may not have more than one SignerList. A successful SignerListSet transaction replaces the existing SignerList, if one exists. To delete a SignerList, you must set `SignerQuorum` to `0` _and_ omit the `SignerEntries` field. Otherwise, the transaction fails with the error [temMALFORMED](#tem-codes). A transaction to delete a SignerList is considered successful even if there was no SignerList to delete.

You cannot create a SignerList such that the SignerQuorum could never be met. The SignerQuorum must be greater than 0 but less than or equal to the sum of the `SignerWeight` values in the list. Otherwise, the transaction fails with the error [temMALFORMED](#tem-codes).

You can create, update, or remove a SignerList using the master key, regular key, or the current SignerList, if those methods of signing transactions are available.

You cannot remove the last method of signing transactions from an account. If an account's master key is disabled (it has the [`lsfDisableMaster` flag](reference-ledger-format.html#accountroot-flags) enabled) and the account does not have a [Regular Key](#setregularkey) configured, then you cannot delete the SignerList from the account. Instead, the transaction fails with the error [tecNO\_ALTERNATIVE\_KEY](#tec-codes).


# Pseudo-Transactions #

Pseudo-Transactions are never submitted by users, nor propagated through the network. Instead, a server may choose to inject them in a proposed ledger directly. If enough servers inject an equivalent pseudo-transaction for it to pass consensus, then it becomes included in the ledger, and appears in ledger data thereafter.

Some of the fields that are mandatory for normal transactions do not make sense for pseudo-transactions. In those cases, the pseudo-transaction has the following default values:

| Field | Default Value |
|-------|---------------|
| Account | [ACCOUNT_ZERO](https://wiki.ripple.com/Accounts#ACCOUNT_ZERO) |
| Sequence | 0 |
| Fee | 0 |
| SigningPubKey | "" |
| Signature | "" |

## SetFee ##

A change in [transaction cost](concept-transaction-cost.html) or [account reserve](concept-reserves.html) requirements as a result of [Fee Voting](concept-fee-voting.html).

**Note:** You cannot send a pseudo-transaction, but you may find one when processing ledgers.

```
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFee": "000000000000000A",
    "Fee": "0",
    "ReferenceFeeUnits": 10,
    "ReserveBase": 20000000,
    "ReserveIncrement": 5000000,
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 439578860,
    "hash": "1C15FEA3E1D50F96B6598607FC773FF1F6E0125F30160144BE0C5CBC52F5151B",
    "ledger_index": 3721729,
  }
```

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| BaseFee | String | UInt64 | The charge, in drops of XRP, for the reference transaction, as hex. (This is the [transaction cost](concept-transaction-cost.html) before scaling for load.) |
| ReferenceFeeUnits | Unsigned Integer | UInt32 | The cost, in fee units, of the reference transaction |
| ReserveBase | Unsigned Integer | UInt32 | The base reserve, in drops |
| ReserveIncrement | Unsigned Integer | UInt32 | The incremental reserve, in drops |
| LedgerSequence | Number | UInt32 | The index of the ledger version where this pseudo-transaction appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |

## EnableAmendment ##

Tracks the progress of the [amendment process](concept-amendments.html#amendment-process) for changes in transaction processing. This can indicate that a proposed amendment gained or lost majority approval, or that an amendment has been enabled.

**Note:** You cannot send a pseudo-transaction, but you may find one when processing ledgers.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|--------------------------------------------------------|-------------|
| Amendment | String | Hash256 | A unique identifier for the amendment. This is not intended to be a human-readable name. See [Amendments](concept-amendments.html) for a list of known amendments. |
| LedgerSequence | Number | UInt32 | The index of the ledger version where this amendment appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |

### EnableAmendment Flags ###

The `Flags` value of the EnableAmendment pseudo-transaction indicates the status of the amendment at the time of the ledger including the pseudo-transaction.

A `Flags` value of `0` (no flags) indicates that the amendment has been enabled, and applies to all ledgers afterward. Other `Flags` values are as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfGotMajority | 0x00010000 | 65536 | Support for this amendment increased to at least 80% of trusted validators starting with this ledger version. |
| tfLostMajority | 0x00020000 | 131072 | Support for this amendment decreased to less than 80% of trusted validators starting with this ledger version. |



# Transaction Results #

## Immediate Response ##

The response from the [`submit` command](reference-rippled.html#submit) contains a provisional result from the `rippled` server indicating what happened during local processing of the transaction.

The response from `submit` contains the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| engine\_result | String | A code that categorizes the result, such as `tecPATH_DRY` |
| engine\_result\_code | Signed Integer | A number that corresponds to the `engine_result`, although exact values are subject to change. |
| engine\_result\_message | String | A human-readable message explaining what happened. This message is intended for developers to diagnose problems, and is subject to change without notice. |

If nothing went wrong when submitting and applying the transaction locally, the response looks like this:

```js
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger."
```

__*Note:*__ A successful result at this stage does not indicate that the transaction has completely succeeded; only that it was successfully applied to the provisional version of the ledger kept by the local server. See [Finality of Results](#finality-of-results) for details.

## Looking up Transaction Results ##

To see the final result of a transaction, use the [`tx` command](reference-rippled.html#tx), [`account_tx` command](reference-rippled.html#account-tx), or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

| Field | Value | Description |
|-------|-------|-------------|
| meta.TransactionResult | String | A code that categorizes the result, such as `tecPATH_DRY` |
| validated | Boolean | Whether or not this result comes from a validated ledger. If `false`, then the result is provisional. If `true`, then the result is final. |

```js
    "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "meta": {
      ...
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
```

## Result Categories ##

Both the `engine_result` and the `meta.TransactionResult` use standard codes to identify the results of transactions, as follows:

| Category              | Prefix            | Description |
|-----------------------|-------------------|-------------|
| Local error           | [tel](#tel-codes) | The rippled server had an error due to local conditions, such as high load. You may get a different response if you resubmit to a different server or at a different time. |
| Malformed transaction | [tem](#tem-codes) | The transaction was not valid, due to improper syntax, conflicting options, a bad signature, or something else. |
| Failure               | [tef](#tef-codes) | The transaction cannot be applied to the server's current (in-progress) ledger or any later one. It may have already been applied, or the condition of the ledger makes it impossible to apply in the future. |
| Retry                 | [ter](#ter-codes) | The transaction could not be applied, but it might be possible to apply later. |
| Success               | [tes](#tes-success) | (Not an error) The transaction succeeded. This result only final in a validated ledger. |
| Claimed cost only     | [tec](#tec-codes) | The transaction did not achieve its intended purpose, but the [transaction cost](concept-transaction-cost.html) was destroyed. This result is only final in a validated ledger. |
| Client library error  | [tej](#tej-codes) | (ripple-lib only) The transaction was not submitted, because the client library blocked it, as part of its additional error checking. |

The distinction between a local error (`tel`) and a malformed transaction (`tem`) is a matter of protocol-level rules. For example, the protocol sets no limit on the maximum number of paths that can be included in a transaction. However, a server may define a finite limit of paths it can process. If two different servers are configured differently, then one of them may return a `tel` error for a transaction with many paths, while the other server could successfully process the transaction. If enough servers are able to process the transaction that it survives consensus, then it can still be included in a validated ledger.

By contrast, a `tem` error implies that no server anywhere can apply the transaction, regardless of settings. Either the transaction breaks the rules of the protocol, it is unacceptably ambiguous, or it is completely nonsensical. The only way a malformed transaction could become valid is through changes in the protocol; for example, if a new feature is adopted, then transactions using that feature could be considered malformed by servers that are running older software which predates that feature.

## Claimed Cost Justification ##

Although it may seem unfair to charge a [transaction cost](concept-transaction-cost.html) for a failed transaction, the `tec` class of errors exists for good reasons:

* Transactions submitted after the failed one do not have to have their Sequence values renumbered. Incorporating the failed transaction into a ledger uses up the transaction's sequence number, preserving the expected sequence.
* Distributing the transaction throughout the network increases network load. Enforcing a cost makes it harder for attackers to abuse the network with failed transactions.
* The transaction cost is generally very small in real-world value, so it should not harm users unless they are sending large quantities of transactions.

## Finality of Results ##

The order in which transactions apply to the consensus ledger is not final until a ledger is closed and the exact transaction set is approved by the consensus process. A transaction that succeeded initially could still fail, and a transaction that failed initially could still succeed. Additionally, a transaction that was rejected by the consensus process in one round could achieve consensus in a later round.

A validated ledger can include successful transactions (`tes` result codes) as well as failed transactions (`tec` result codes). No transaction with any other result is included in a ledger.

For any other result code, it can be difficult to determine if the result is final. The following table summarizes when a transaction's outcome is final, based on the result code from submitting the transaction:

| Error Code | Finality |
|------------|----------|
| `tesSUCCESS` | Final when included in a validated ledger |
| Any `tec` code | Final when included in a validated ledger |
| Any `tem` code | Final unless the protocol changes to make the transaction valid |
| `tefPAST_SEQ` | Final when another transaction with the same sequence number is included in a validated ledger |
| `tefMAX_LEDGER` | Final when a validated ledger has a sequence number higher than the transaction's `LastLedgerSequence` field, and no validated ledger includes the transaction |

Any other transaction result is potentially not final. In that case, the transaction could still succeed or fail later, especially if conditions change such that the transaction is no longer prevented from applying. For example, trying to send a non-XRP currency to an account that does not exist yet would fail, but it could succeed if another transaction sends enough XRP to create the destination account. A server might even store a temporarily-failed, signed transaction and then successfully apply it later without asking first.



## Understanding Transaction Metadata ##

The metadata section of a transaction includes detailed information about all the changes to the shared Ripple Consensus Ledger that the transaction caused. This is true of any transaction that gets included in a ledger, whether or not it is successful. Naturally, the changes are only final if the transaction is validated.

Some fields that may appear in transaction metadata include:

| Field | Value | Description |
|-------|-------|-------------|
| AffectedNodes | Array | List of nodes that were created, deleted, or modified by this transaction, and specific changes to each. |
| DeliveredAmount | String or Object | **DEPRECATED.** Replaced by `delivered_amount`. Omitted if not a partial payment. |
| TransactionIndex | Unsigned Integer | The transaction's position within the ledger that included it. (For example, the value `2` means it was the 2nd transaction in that ledger.) |
| TransactionResult | String | A [result code](#result-categories) indicating whether the transaction succeeded or how it failed. |
| [delivered_amount](#delivered-amount) | Object or String | (New in [rippled 0.27.0](https://github.com/ripple/rippled/releases/tag/0.27.0)) The [amount](reference-rippled.html#specifying-currency-amounts) actually received by the `Destination` account. Use this field to determine how much was delivered, regardless of whether the transaction is a [partial payment](#partial-payments). |

### delivered_amount ###

The `Amount` of a [Payment transaction](#payment) indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much -- **except if the transaction was a [partial payment](#partial-payments)**. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `delivered_amount` field of transaction metadata is included in all successful Payment transactions, and is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment, and
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the AffectedNodes in the transaction's metadata.


## Full Transaction Response List ##

[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/TER.h "Source")


### tel Codes ###

These codes indicate an error in the local server processing the transaction; it is possible that another server with a different configuration or load level could process the transaction successfully. They have numerical values in the range -399 to -300. The exact code for any given error is subject to change, so don't rely on it.

| Code | Explanation |
|------|-------------|
| telBAD\_DOMAIN | The transaction specified a domain value (for example, the `Domain` field of an [AccountSet transaction](#accountset)) that cannot be used, probably because it is too long to store in the ledger. |
| telBAD\_PATH_COUNT | The transaction contains too many paths for the local server to process. |
| telBAD\_PUBLIC\_KEY | The transaction specified a public key value (for example, as the `MessageKey` field of an [AccountSet transaction](#accountset)) that cannot be used, probably because it is too long. |
| telCAN\_NOT\_QUEUE | The transaction did not meet the [open ledger cost](concept-transaction-cost.html), but this server did not queue it because it failed one of the server's heuristics for being "likely to succeed". You can try again later or sign and submit a replacement transaction with a higher transaction cost in the `Fee` field. |
| telFAILED\_PROCESSING | An unspecified error occurred when processing the transaction. |
| telINSUF\_FEE_P | The `Fee` from the transaction is not high enough to meet the server's current [transaction cost](concept-transaction-cost.html) requirement, which is derived from its load level. |
| telLOCAL_ERROR | Unspecified local error. |
| telNO\_DST\_PARTIAL | The transaction is an XRP payment that would fund a new account, but the [tfPartialPayment flag](#partial-payments) was enabled. This is disallowed. |

### tem Codes ###

These codes indicate that the transaction was malformed, and cannot succeed according to the Ripple protocol. They have numerical values in the range -299 to -200. The exact code for any given error is subject to change, so don't rely on it.

| Code | Explanation |
|------|-------------|
| temBAD\_AMOUNT | An amount specified by the transaction (for example the destination `Amount` or `SendMax` values of a [Payment](#payment)) was invalid, possibly because it was a negative number. |
| temBAD\_AUTH\_MASTER | The key used to sign this transaction does not match the master key for the account sending it, and the account does not have a [Regular Key](#setregularkey) set. |
| temBAD\_CURRENCY | The transaction improperly specified a currency field. See [Specifying Currency Amounts](reference-rippled.html#specifying-currency-amounts) for the correct format. |
| temBAD\_EXPIRATION | The transaction improperly specified an expiration value, for example as part of an [OfferCreate transaction](#offercreate). |
| temBAD\_FEE | The transaction improperly specified its `Fee` value, for example by listing a non-XRP currency or some negative amount of XRP. |
| temBAD\_ISSUER | The transaction improperly specified the `issuer` field of some currency included in the request. |
| temBAD\_LIMIT | The [TrustSet](#trustset) transaction improperly specified the `LimitAmount` value of a trustline. |
| temBAD\_OFFER | The [OfferCreate](#offercreate) transaction specifies an invalid offer, such as offering to trade XRP for itself, or offering a negative amount. |
| temBAD\_PATH | The [Payment](#payment) transaction specifies one or more [Paths](#paths) improperly, for example including an issuer for XRP, or specifying an account differently. |
| temBAD\_PATH\_LOOP | One of the [Paths](#paths) in the [Payment](#payment) transaction was flagged as a loop, so it cannot be processed in a bounded amount of time. |
| temBAD\_SEND\_XRP\_LIMIT | The [Payment](#payment) transaction used the [tfLimitQuality](#limit-quality) flag in a direct XRP-to-XRP payment, even though XRP-to-XRP payments do not involve any conversions. |
| temBAD\_SEND\_XRP\_MAX | The [Payment](#payment) transaction included a `SendMax` field in a direct XRP-to-XRP payment, even though sending XRP should never require SendMax. (XRP is only valid in SendMax if the destination `Amount` is not XRP.) |
| temBAD\_SEND\_XRP\_NO_DIRECT | The [Payment](#payment) transaction used the [tfNoDirectRipple](#payment-flags) flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments are always direct. |
| temBAD\_SEND\_XRP\_PARTIAL | The [Payment](#payment) transaction used the [tfPartialPayment](#partial-payments) flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments should always deliver the full amount. |
| temBAD\_SEND\_XRP\_PATHS | The [Payment](#payment) transaction included `Paths` while sending XRP, even though XRP-to-XRP payments should always be direct. |
| temBAD\_SEQUENCE | The transaction is references a sequence number that is higher than its own `Sequence` number, for example trying to cancel an offer that would have to be placed after the transaction that cancels it. |
| temBAD\_SIGNATURE | The signature to authorize this transaction is either missing, or formed in a way that is not a properly-formed signature. (See [tecNO_PERMISSION](#tec-codes) for the case where the signature is properly formed, but not authorized for this account.)  |
| temBAD\_SRC\_ACCOUNT | The `Account` on whose behalf this transaction is being sent (the "source account") is not a properly-formed Ripple account. |
| temBAD\_TRANSFER\_RATE | The [`TransferRate` field of an AccountSet transaction](#transferrate) is not properly formatted. |
| temDST\_IS\_SRC | The [TrustSet](#trustset) transaction improperly specified the destination of the trust line (the `issuer` field of `LimitAmount`) as the `Account` sending the transaction. You cannot extend a trust line to yourself. (In the future, this code could also apply to other cases where the destination of a transaction is not allowed to be the account sending it.) |
| temDST\_NEEDED | The transaction improperly omitted a destination. This could be the `Destination` field of a [Payment](#payment) transaction, or the `issuer` sub-field of the `LimitAmount` field fo a `TrustSet` transaction. |
| temINVALID | The transaction is otherwise invalid. For example, the transaction ID may not be the right format, the signature may not be formed properly, or something else went wrong in understanding the transaction. |
| temINVALID\_FLAG | The transaction includes a [Flag](#flags) that does not exist, or includes a contradictory combination of flags. |
| temMALFORMED | Unspecified problem with the format of the transaction. |
| temREDUNDANT | The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer. |
| temREDUNDANT\_SEND\_MAX | _(Removed in [rippled 0.28.0][])_ |
| temRIPPLE\_EMPTY | The [Payment](#payment) transaction includes an empty `Paths` field, but paths are necessary to complete this payment. |
| temBAD_WEIGHT | The [SignerListSet](#signerlistset) transaction includes a `SignerWeight` that is invalid, for example a zero or negative value. |
| temBAD_SIGNER | The [SignerListSet](#signerlistset) transaction includes a signer who is invalid. For example, there may be duplicate entries, or the owner of the SignerList may also be a member. |
| temBAD_QUORUM | The [SignerListSet](#signerlistset) transaction has an invalid `SignerQuorum` value. Either the value is not greater than zero, or it is more than the sum of all signers in the list. |
| temUNCERTAIN | Used internally only. This code should never be returned. |
| temUNKNOWN | Used internally only. This code should never be returned. |
| temDISABLED | The transaction requires logic that is disabled. Typically this means you are trying to use an [amendment](concept-amendments.html) that is not enabled for the current ledger. |


### tef Codes ###

These codes indicate that the transaction failed and was not included in a ledger, but the transaction could have succeeded in some theoretical ledger. Typically this means that the transaction can no longer succeed in any future ledger. They have numerical values in the range -199 to -100. The exact code for any given error is subject to change, so don't rely on it.

| Code | Explanation |
|------|-------------|
| tefALREADY | The same exact transaction has already been applied. |
| tefBAD\_ADD\_AUTH | **DEPRECATED.** |
| tefBAD\_AUTH | The key used to sign this account is not authorized to modify this account. (It could be authorized if the account had the same key set as the [Regular Key](#setregularkey).) |
| tefBAD\_AUTH\_MASTER | The single signature provided to authorize this transaction does not match the master key, but no regular key is associated with this address. |
| tefBAD\_LEDGER | While processing the transaction, the ledger was discovered in an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| tefBAD\_QUORUM | The transaction was [multi-signed](#multi-signing), but the total weights of all included signatures did not meet the quorum. |
| tefBAD\_SIGNATURE | The transaction was [multi-signed](#multi-signing), but contained a signature for an address not part of a SignerList associated with the sending account. |
| tefCREATED |**DEPRECATED.** |
| tefEXCEPTION | While processing the transaction, the server entered an unexpected state. This may be caused by unexpected inputs, for example if the binary data for the transaction is grossly malformed. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| tefFAILURE | Unspecified failure in applying the transaction. |
| tefINTERNAL | When trying to apply the transaction, the server entered an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| tefMASTER\_DISABLED | The transaction was signed with the account's master key, but the account has the `lsfDisableMaster` field set. |
| tefMAX\_LEDGER | The transaction included a [`LastLedgerSequence`](#lastledgersequence) parameter, but the current ledger's sequence number is already higher than the specified value. |
| tefNO\_AUTH\_REQUIRED | The [TrustSet](#trustset) transaction tried to mark a trustline as authorized, but the `lsfRequireAuth` flag is not enabled for the corresponding account, so authorization is not necessary. |
| tefNOT\_MULTI\_SIGNING | The transaction was [multi-signed](#multi-signing), but the sending account has no SignerList defined. |
| tefPAST\_SEQ | The sequence number of the transaction is lower than the current sequence number of the account sending the transaction. |
| tefWRONG\_PRIOR | The transaction contained an `AccountTxnID` field (or the deprecated `PreviousTxnID` field), but the transaction specified there does not match the account's previous transaction. |

### ter Codes ###

These codes indicate that the transaction failed, but it could apply successfully in the future, usually if some other hypothetical transaction applies first. They have numerical values in the range -99 to -1. The exact code for any given error is subject to change, so don't rely on it.

| Code | Explanation |
|------|-------------|
| terFUNDS\_SPENT | **DEPRECATED.** |
| terINSUF\_FEE\_B | The account sending the transaction does not have enough XRP to pay the `Fee` specified in the transaction. |
| terLAST | Used internally only. This code should never be returned. |
| terNO\_ACCOUNT | The address sending the transaction is not funded in the ledger (yet). |
| terNO\_AUTH | The transaction would involve adding currency issued by an account with `lsfRequireAuth` enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold. |
| terNO\_LINE | Used internally only. This code should never be returned. |
| terNO\_RIPPLE | Used internally only. This code should never be returned. |
| terOWNERS | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](#accountset-flags) flag if it has any trust lines or available offers. |
| terPRE\_SEQ | The `Sequence` number of the current transaction is higher than the current sequence number of the account sending the transaction. |
| terRETRY | Unspecified retriable error. |
| terQUEUED | The transaction met the load-scaled [transaction cost](concept-transaction-cost.html) but did not meet the open ledger requirement, so the transaction has been queued for a future ledger. |

### tes Success ###

The code `tesSUCCESS` is the only code that indicates a transaction succeeded. This does not always mean it did what it was supposed to do. (For example, an [OfferCancel](#offercancel) can "succeed" even if there is no offer for it to cancel.) Success uses the numerical value 0.

| Code | Explanation |
|------|-------------|
| tesSUCCESS | The transaction was applied and forwarded to other servers. If this appears in a validated ledger, then the transaction's success is final. |

### tec Codes ###

These codes indicate that the transaction failed, but it was applied to a ledger to apply the [transaction cost](concept-transaction-cost.html). They have numerical values in the range 100 to 199. The exact codes sometimes appear in ledger data, so they do not change, but we recommend not relying on the numeric value regardless.

| Code | Value | Explanation |
|------|-------|-------------|
| tecCLAIM | 100 | Unspecified failure, with transaction cost destroyed. |
| tecDIR\_FULL | 121 | The address sending the transaction cannot own any more objects in the ledger. |
| tecDST\_TAG\_NEEDED | 143 | The [Payment](#payment) transaction omitted a destination tag, but the destination account has the `lsfRequireDestTag` flag enabled. _(New in [rippled 0.28.0][])_ |
| tecFAILED\_PROCESSING | 105 | An unspecified error occurred when processing the transaction. |
| tecFROZEN | 137 | The [OfferCreate transaction](#offercreate) failed because one or both of the assets involved are subject to a [global freeze](concept-freeze.html). |
| tecINSUF\_RESERVE\_LINE | 122 | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](concept-reserves.html)) This error occurs when the counterparty already has a trust line in a non-default state to the sending account for the same currency. (See tecNO\_LINE\_INSUF\_RESERVE for the other case.) |
| tecINSUF\_RESERVE\_OFFER | 123 | The transaction failed because the sending account does not have enough XRP to create a new Offer. (See: [Reserves](concept-reserves.html)) |
| tecINSUFFICIENT\_RESERVE | 141 | The [SignerListSet](#signerlistset) or other transaction would increase the [reserve requirement](concept-reserves.html) higher than the sending account's balance. See [SignerLists and Reserves](reference-ledger-format.html#signerlists-and-reserves) for more information. |
| tecINTERNAL | 144 | Unspecified internal error, with transaction cost applied. This error code should not normally be returned. |
| tecNEED\_MASTER\_KEY | 142 | This transaction tried to cause changes that require the master key, such as [disabling the master key or giving up the ability to freeze balances](#accountset-flags). _(New in [rippled 0.28.0](https://github.com/ripple/rippled/releases/tag/0.28.0-rc1))_ |
| tecNO\_ALTERNATIVE\_KEY | 130 | The transaction tried to remove the only available method of [authorizing transactions](#authorizing-transactions). This could be a [SetRegularKey transaction](#setregularkey) to remove the regular key, a [SignerListSet transaction](#signerlistset) to delete a SignerList, or an [AccountSet transaction](#accountset) to disable the master key. (Prior to [rippled 0.30.0](https://github.com/ripple/rippled/releases/tag/0.30.0), this was called `tecMASTER_DISABLED`.) |
| tecNO\_AUTH | 134 | The transaction failed because it needs to add a balance on a trust line to an account with the `lsfRequireAuth` flag enabled, and that trust line has not been authorized. If the trust line does not exist at all, tecNO\_LINE occurs instead. |
| tecNO\_DST | 124 | The account on the receiving end of the transaction does not exist. This includes Payment and TrustSet transaction types. (It could be created if it received enough XRP.) |
| tecNO\_DST\_INSUF_XRP | 125 | The account on the receiving end of the transaction does not exist, and the transaction is not sending enough XRP to create it. |
| tecNO\_ENTRY | 140 | Reserved for future use. |
| tecNO\_ISSUER | 133 | The account specified in the `issuer` field of a currency amount does not exist. |
| tecNO\_LINE | 135 | The `TakerPays` field of the [OfferCreate transaction](#offercreate) specifies an asset whose issuer has `lsfRequireAuth` enabled, and the account making the offer does not have a trust line for that asset. (Normally, making an offer implicitly creates a trust line if necessary, but in this case it does not bother because you cannot hold the asset without authorization.) If the trust line exists, but is not authorized, `tecNO_AUTH` occurs instead. |
| tecNO\_LINE\_INSUF\_RESERVE | 126 | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](concept-reserves.html)) This error occurs when the counterparty does not have a trust line to this account for the same currency. (See tecINSUF\_RESERVE\_LINE for the other case.) |
| tecNO\_LINE\_REDUNDANT | 127 | The transaction failed because it tried to set a trust line to its default state, but the trust line did not exist. |
| tecNO\_PERMISSION | 139 | Reserved for future use. |
| tecNO\_REGULAR\_KEY | 131 | The [AccountSet transaction](#accountset) tried to disable the master key, but the account does not have another way to [authorize transactions](#authorizing-transactions). If [multi-signing](#multi-signing) is enabled, this code is deprecated and `tecNO_ALTERNATIVE_KEY` is used instead. |
| tecNO\_TARGET | 138 | Reserved for future use. |
| tecOVERSIZE | 145 | This transaction could not be processed, because the server created an excessively large amount of metadata when it tried to apply the transaction. _(New in [rippled 0.29.0-hf1](https://github.com/ripple/rippled/releases/tag/0.29.0-hf1) )_ |
| tecOWNERS | 132 | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](#accountset-flags) flag if it has any trust lines or available offers. |
| tecPATH\_DRY | 128 | The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines. |
| tecPATH\_PARTIAL | 101 | The transaction failed because the provided paths did not have enough liquidity to send the full amount. |
| tecUNFUNDED | 129 | **DEPRECATED.** Replaced by tecUNFUNDED\_OFFER and tecUNFUNDED\_PAYMENT. |
| tecUNFUNDED\_ADD | 102 | **DEPRECATED.** |
| tecUNFUNDED\_PAYMENT | 104 | The transaction failed because the sending account is trying to send more XRP than it holds, not counting the reserve. (See: [Reserves](concept-reserves.html)) |
| tecUNFUNDED\_OFFER | 103 | The [OfferCreate transaction](#offercreate) failed because the account creating the offer does not have any of the `TakerGets` currency. |

### tej Codes ###

These codes are only ever returned by the `ripple-lib` client library, not by `rippled` itself.

| Code | Explanation |
|------|-------------|
| tejAbort | The transaction was manually canceled by calling `transaction.abort()`. |
| tejAttemptsExceeded | The transaction was submitted multiple times, up to a total equal to the max attempts setting, without being successfully included in a ledger. |
| tejInvalidFlag | One of the flags specified was invalid, or does not apply to this transaction type. |
| tejLocalSigningRequired | The transaction could not be resubmitted because local signing is disabled. |
| tejMaxFeeExceeded | The [transaction cost](concept-transaction-cost.html) that would be necessary to send the transaction is higher than the maximum transaction cost setting, which is either the `_MaxFee` parameter of the Transaction (if provided) or the maximum transaction cost configured for the remote. The default value is 1 XRP (100000 drops). |
| tejMaxLedger | Validated ledgers have surpassed the `LastLedgerSequence` parameter of the transaction without including it, so it can no longer succeed. (Also see [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).) When using ripple-lib, this error effectively replaces all non-final errors, including tel-, tef-, and ter-class response codes. |
| tejSecretInvalid | The secret included for signing this transaction was not a properly-formatted secret. |
| tejSecretUnknown | The secret for a given account was omitted from the transaction, and ripple-lib was unable to automatically fill it in from saved data. |
| tejServerUntrusted | The application attempted to submit an account secret to an untrusted server for transaction signing. |
| tejUnconnected | The application is not connected to a `rippled` server, but it needs to be to process the transaction. |
