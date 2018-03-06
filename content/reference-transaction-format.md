# Transaction Format

This page describes the format of XRP Ledger transactions. For information on how transactions work, see the [Transactions Overview](concept-transactions.html).

All transactions have certain fields in common:

- [Common Fields](#common-fields)

Each transaction type has additional fields relevant to the type of action it causes:

- [AccountSet - Set options on an account](#accountset)
- [CheckCancel - Cancel a check](#checkcancel)
- [CheckCash - Redeem a check](#checkcash)
- [CheckCreate - Create a check](#checkcreate)
- [EscrowCancel - Reclaim escrowed XRP](#escrowcancel)
- [EscrowCreate - Create an escrowed XRP payment](#escrowcreate)
- [EscrowFinish - Deliver escrowed XRP to recipient](#escrowfinish)
- [OfferCancel - Withdraw a currency-exchange order](#offercancel)
- [OfferCreate - Submit an order to exchange currency](#offercreate)
- [Payment - Send funds from one account to another](#payment)
- [PaymentChannelClaim - Claim money from a payment channel](#paymentchannelclaim)
- [PaymentChannelCreate - Open a new payment channel](#paymentchannelcreate)
- [PaymentChannelFund - Add more XRP to a payment channel](#paymentchannelfund)
- [SetRegularKey - Set an account's regular key](#setregularkey)
- [SignerListSet - Set multi-signing settings](#signerlistset)
- [TrustSet - Add or modify a trust line](#trustset)


_Pseudo-Transactions_ that are not created and submitted in the usual way, but may be added to open ledgers according to ledger rules. They still must be approved by consensus to be included in a validated ledger. Pseudo-transactions have their own unique transaction types:

- [SetFee - Adjust the minimum transaction cost or account reserve](#setfee)
- [EnableAmendment - Apply a change to transaction processing](#enableamendment)


## Common Fields

[Internal Type]: https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp

Every transaction type has the same set of fundamental fields. Field names are case-sensitive. The common fields for all transactions are:

| Field                  | JSON Type        | [Internal Type][] | Description  |
|:-----------------------|:-----------------|:------------------|:-------------|
| Account                | String           | Account           | The unique address of the account that initiated the transaction. |
| [AccountTxnID][]       | String           | Hash256           | _(Optional)_ Hash value identifying another transaction. This transaction is only valid if the sending account's previously-sent transaction matches the provided hash. |
| [Fee][]                | String           | Amount            | (Required, but [auto-fillable](#auto-fillable-fields)) Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network. |
| [Flags][]              | Unsigned Integer | UInt32            | _(Optional)_ Set of bit-flags for this transaction. |
| [LastLedgerSequence][] | Number           | UInt32            | (Optional, but strongly recommended) Highest ledger sequence number that a transaction can appear in. |
| [Memos][]              | Array of Objects | Array             | _(Optional)_ Additional arbitrary information used to identify this transaction. |
| PreviousTxnID | String | Hash256 | [Removed in: rippled 0.28.0][] Use `AccountTxnID` instead. |
| [Sequence][]           | Unsigned Integer | UInt32            | (Required, but [auto-fillable](#auto-fillable-fields)) The sequence number, relative to the initiating account, of this transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the last-valided transaction from the same account. |
| SigningPubKey          | String           | PubKey            | (Automatically added when signing) Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty string, indicates a multi-signature is present in the `Signers` field instead. |
| [Signers][]            | Array            | Array             | _(Optional)_ Array of objects that represent a [multi-signature](concept-transactions.html#multi-signing) which authorizes this transaction. |
| SourceTag              | Unsigned Integer | UInt32            | _(Optional)_ Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| TransactionType        | String           | UInt16            | The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, `AccountSet`, `SetRegularKey`, `SignerListSet`, `EscrowCreate`, `EscrowFinish`, `EscrowCancel`, `PaymentChannelCreate`, `PaymentChannelFund`, and `PaymentChannelClaim`. |
| TxnSignature           | String           | VariableLength    | (Automatically added when signing) The signature that verifies this transaction as originating from the account it says it is from. |

[AccountTxnID]: #accounttxnid
[Fee]: #transaction-cost
[Flags]: #flags
[LastLedgerSequence]: #lastledgersequence
[Memos]: #memos
[Sequence]: #canceling-or-skipping-a-transaction
[Signers]: #signers-field

### Auto-fillable Fields

Some fields can be automatically filled in before the transaction is signed, either by a `rippled` server or by the library used for offline signing. Both [ripple-lib](https://github.com/ripple/ripple-lib) and `rippled` can automatically provide the following values:

* `Fee` - Automatically fill in the [transaction cost](concept-transaction-cost.html) based on the network. (*Note:* `rippled`'s [sign command](reference-rippled-api-public.html#sign) supports limits on how high the filled-in-value is, using the `fee_mult_max` parameter.)
* `Sequence` - Automatically use the next sequence number for the account sending the transaction.

For a production system, we recommend *not* leaving these fields to be filled by the server. For example, if transaction costs become high due to a temporary spike in network load, you may want to wait for the cost to decrease before sending some transactions, instead of paying the temporarily-high cost.

The [`Paths` field](#paths) of the [Payment](#payment) transaction type can also be automatically filled in.


### Transaction Cost

To protect the XRP Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of XRP. This _[transaction cost](concept-transaction-cost.html)_ is designed to increase along with the load on the network, making it very expensive to deliberately or inadvertently overload the network.

The `Fee` field specifies an amount, in [drops of XRP][Currency Amount], to destroy as the cost for relaying this transaction. If the transaction is included in a validated ledger (whether or not it achieves its intended purpose), then the amount of XRP specified in the `Fee` parameter is destroyed forever. You can [look up the transaction cost](concept-transaction-cost.html#querying-the-transaction-cost) in advance, or [let `rippled` set it automatically](concept-transaction-cost.html#automatically-specifying-the-transaction-cost) when you sign a transaction.

**Note:** [Multi-signed transactions](concept-transactions.html#multi-signing) require additional fees to relay to the network.


### Canceling or Skipping a Transaction

An important and intentional feature of the XRP Ledger is that a transaction is final as soon as it has been incorporated in a validated ledger.

However, if a transaction has not yet been included in a validated ledger, you can effectively cancel it by rendering it invalid. Typically, this means sending another transaction with the same `Sequence` value from the same account. If you do not want the replacement transaction to do anything, send an [AccountSet](#accountset) transaction with no options.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](#transaction-cost) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.

### LastLedgerSequence

We strongly recommend that you specify the `LastLedgerSequence` parameter on every transaction. Provide a value of about 3 higher than [the most recent ledger index](reference-rippled-api-public.html#ledger) to ensure that your transaction is either validated or rejected within a matter of seconds.

Without the `LastLedgerSequence` parameter, a transaction can become stuck in an undesirable state where it is neither validated nor rejected for a long time. Specifically, if the load-based [transaction cost](#transaction-cost) of the network increases after you send a transaction, your transaction may not get propagated enough to be included in a validated ledger, but you would have to pay the (increased) transaction cost to [send another transaction canceling it](#canceling-or-skipping-a-transaction). Later, if the transaction cost decreases again, the transaction can become included in a future ledger. The `LastLedgerSequence` places a hard upper limit on how long the transaction can wait to be validated or rejected.

### AccountTxnID

The `AccountTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous one (by Sequence Number) is also valid and matches the transaction you expected.

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially have serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `AccountTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.

To use AccountTxnID, you must first set the [asfAccountTxnID](#accountset-flags) flag, so that the ledger keeps track of the ID for the account's previous transaction.

### Memos

The `Memos` field includes arbitrary messaging data with the transaction. It is presented as an array of objects. Each object has only one field, `Memo`, which in turn contains another object with *one or more* of the following fields:

| Field      | Type   | [Internal Type][] | Description                        |
|:-----------|:-------|:------------------|:-----------------------------------|
| MemoData   | String | VariableLength    | Arbitrary hex value, conventionally containing the content of the memo. |
| MemoFormat | String | VariableLength    | Hex value representing characters allowed in URLs. Conventionally containing information on how the memo is encoded, for example as a [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml). |
| MemoType   | String | VariableLength    | Hex value representing characters allowed in URLs. Conventionally, a unique relation (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. |

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

### Signers Field

The `Signers` field contains a [multi-signature](concept-transactions.html#multi-signing), which has signatures from up to 8 key pairs, that together should authorize the transaction. The `Signers` list is an array of objects, each with one field, `Signer`. The `Signer` field has the following nested fields:

| Field         | Type   | [Internal Type][] | Description                     |
|:--------------|:-------|:------------------|:--------------------------------|
| Account       | String | AccountID         | The address associated with this signature, as it appears in the SignerList. |
| TxnSignature  | String | Blob              | A signature for this transaction, verifiable using the `SigningPubKey`. |
| SigningPubKey | String | PubKey            | The public key used to create this signature. |

The `SigningPubKey` must be a key that is associated with the `Account` address. If the referenced `Account` is a funded account in the ledger, then the SigningPubKey can be that account's current Regular Key if one is set. It could also be that account's Master Key, unless the [lsfDisableMaster](reference-ledger-format.html#accountroot-flags) flag is enabled. If the referenced `Account` address is not a funded account in the ledger, then the `SigningPubKey` must be the master key associated with that address.

Because signature verification is a compute-intensive task, multi-signed transactions cost additional XRP to relay to the network. Each signature included in the multi-signature increases the [transaction cost](concept-transaction-cost.html) required for the transaction. For example, if the current minimum transaction cost to relay a transaction to the network is `10000` drops, then a multi-signed transaction with 3 entries in the `Signers` array would need a `Fee` value of at least `40000` drops to relay.



### Flags

The `Flags` field can contain various options that affect how a transaction should behave. The options are represented as binary values that can be combined with bitwise-or operations to set multiple flags at once.

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

The only flag that applies globally to all transactions is as follows:

| Flag Name           | Hex Value  | Decimal Value | Description               |
|:--------------------|:-----------|:--------------|:--------------------------|
| tfFullyCanonicalSig | 0x80000000 | 2147483648    | Require a fully-canonical signature, to protect a transaction from [transaction malleability](https://wiki.ripple.com/Transaction_Malleability) exploits. |

# Transaction Types

{% include 'transactions/accountset.md' %}

{% include 'transactions/checkcancel.md' %}

{% include 'transactions/checkcash.md' %}

{% include 'transactions/checkcreate.md' %}

{% include 'transactions/escrowcancel.md' %}

{% include 'transactions/escrowcreate.md' %}

{% include 'transactions/escrowfinish.md' %}

{% include 'transactions/offercancel.md' %}

{% include 'transactions/offercreate.md' %}

{% include 'transactions/payment.md' %}

{% include 'transactions/paymentchannelclaim.md' %}

{% include 'transactions/paymentchannelcreate.md' %}

{% include 'transactions/paymentchannelfund.md' %}

{% include 'transactions/setregularkey.md' %}

{% include 'transactions/signerlistset.md' %}

{% include 'transactions/trustset.md' %}


# Pseudo-Transaction Types

Pseudo-Transactions are never submitted by users, nor propagated through the network. Instead, a server may choose to inject them in a proposed ledger directly. If enough servers inject an equivalent pseudo-transaction for it to pass consensus, then it becomes included in the ledger, and appears in ledger data thereafter.

Some of the fields that are mandatory for normal transactions do not make sense for pseudo-transactions. In those cases, the pseudo-transaction has the following default values:

| Field         | Default Value                                            |
|:--------------|:---------------------------------------------------------|
| Account       | [ACCOUNT_ZERO](concept-accounts.html#special-addresses) |
| Sequence      | 0                                                        |
| Fee           | 0                                                        |
| SigningPubKey | ""                                                       |
| Signature     | ""                                                       |


{% include 'transactions/enableamendment.md' %}

{% include 'transactions/setfee.md' %}



<!--{# Common Links #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}
