# Transactions Overview


## Authorizing Transactions

In the decentralized XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. A signed transaction is immutable: its contents cannot change, and the signature is not valid for any other transaction. <!-- STYLE_OVERRIDE: is authorized to -->

A transaction can be authorized by any of the following types of signatures:

* A single signature from the master private key that is mathematically associated with the sending address. You can disable or enable the master key pair using an [AccountSet transaction][].
* A single signature that matches the regular private key associated with the address. You can add, remove, or replace a regular key pair using a [SetRegularKey transaction][].
* A [multi-signature](#multi-signing) that matches a list of signers owned by the address. You can add, remove, or replace a list of signers using a [SignerListSet transaction][].

Any signature type can authorize any type of transaction, with the following exceptions:

* Only the master private key can [disable the master public key](#accountset-flags).
* Only the master private key can [permanently give up the ability to freeze](concept-freeze.html#no-freeze).
* You can never remove the last method of signing transactions from an address.

For more information about master and regular key pairs, see [Cryptographic Keys](concept-cryptographic-keys.html).

<!--{# Add this reference after signatures concept doc is published. For more information about signatures, see [Understanding Signatures](concept-signatures.html). #}-->


## Signing and Submitting Transactions

Sending a transaction to the XRP Ledger involves several steps:

1. Create an [unsigned transaction in JSON format](#unsigned-transaction-format).
2. Use one or more signatures to [authorize the transaction](#authorizing-transactions).
3. Submit a transaction to a `rippled` server. If the transaction is properly formed, the server provisionally applies the transaction to its current version of the ledger and relays the transaction to other members of the peer-to-peer network.
4. The [consensus process](https://ripple.com/build/ripple-ledger-consensus-process/) determines which provisional transactions get included in the next validated ledger.
5. The `rippled` servers apply those transactions to the previous ledger in a canonical order and share their results.
6. If enough [trusted validators](tutorial-rippled-setup.html#reasons-to-run-a-validator) created the exact same ledger, that ledger is declared _validated_ and the [results of the transactions](#transaction-results) in that ledger are immutable.

### Unsigned Transaction Format

Here is an example of an unsigned [Payment transaction][] in JSON:

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
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

The XRP Ledger only relays and executes a transaction if the transaction object has been authorized by the sending address (in the `Account`) field. For transactions authorized by only a single signature, you have two options:

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


### Multi-Signing

Multi-signing in the XRP Ledger is the act of [authorizing transactions](#authorizing-transactions) for the XRP Ledger by using a combination of multiple secret keys. You can have any combination of authorization methods enabled for your address, including multi-signing, a [master key pair](concept-cryptographic-keys.html#master-key-pair), and a [regular key pair](concept-cryptographic-keys.html#regular-key-pair). (The only requirement is that _at least one_ method must be enabled.)

The [SignerListSet transaction][] defines which addresses can authorize transactions from your address. You can include up to 8 addresses in a SignerList. You can control how many signatures are needed, in which combinations, by using the quorum and weight values of the SignerList.

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must own a [`SignerList` in the ledger](reference-ledger-format.html#signerlist).
* The transaction must include the `SigningPubKey` field as an empty string.
* The transaction must include a [`Signers` field](#signers-field) containing an array of signatures.
* The signatures present in the `Signers` array must match signers defined in the SignerList.
* For the provided signatures, the total `weight` associated with those signers must be equal or greater than the `quorum` for the SignerList.
* The [transaction cost](concept-transaction-cost.html) (specified in the `Fee` field) must be at least (N+1) times the normal transaction cost, where N is the number of signatures provided.
* All fields of the transaction must be defined before collecting signatures. You cannot [auto-fill](#auto-fillable-fields) any fields.
* If presented in binary form, the `Signers` array must be sorted based on the numeric value of the signer addresses, with the lowest value first. (If submitted as JSON, the [submit_multisigned method][] handles this automatically.)

For more information, see [How to Multi-Sign](tutorial-multisign.html).


### Reliable Transaction Submission

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

### Identifying Transactions

The `"hash"` is the unique value that identifies a particular transaction. The server provides the hash in the response when you submit the transaction; you can also look up a transaction in an account's transaction history with the [account_tx command](reference-rippled.html#account-tx).

The transaction hash can be used as a "proof of payment" since anyone can [look up the transaction by its hash](#looking-up-transaction-results) to verify its final status.







### Canceling or Skipping a Transaction

An important and intentional feature of the XRP Ledger is that a transaction is final as soon as it has been incorporated in a validated ledger.

However, if a transaction has not yet been included in a validated ledger, you can effectively cancel it by rendering it invalid. Typically, this means sending another transaction with the same `Sequence` value from the same account. If you do not want the replacement transaction to do anything, send an [AccountSet](#accountset) transaction with no options.

For example, if you try to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction cost](#transaction-cost) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction cost for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "[no-op](http://en.wikipedia.org/wiki/NOP)" transaction.



# Transaction Types

The type of a transaction (`TransactionType` field) is the most fundamental information about a transaction. This indicates what type of operation the transaction is supposed to do.

All transactions have certain fields in common:

* [Common Fields](#common-fields)

Each transaction type has additional fields relevant to the type of action it causes:

* [AccountSet - Set options on an account](#accountset)
* [CheckCancel - Cancel a check](#checkcancel)
* [CheckCash - Redeem a check](#checkcash)
* [CheckCreate - Create a check](#checkcreate)
* [EscrowCancel - Reclaim escrowed XRP](#escrowcancel)
* [EscrowCreate - Create an escrowed XRP payment](#escrowcreate)
* [EscrowFinish - Deliver escrowed XRP to recipient](#escrowfinish)
* [OfferCancel - Withdraw a currency-exchange order](#offercancel)
* [OfferCreate - Submit an order to exchange currency](#offercreate)
* [Payment - Send funds from one account to another](#payment)
* [PaymentChannelClaim - Claim money from a payment channel](#paymentchannelclaim)
* [PaymentChannelCreate - Open a new payment channel](#paymentchannelcreate)
* [PaymentChannelFund - Add more XRP to a payment channel](#paymentchannelfund)
* [SetRegularKey - Set an account's regular key](#setregularkey)
* [SignerListSet - Set multi-signing settings](#signerlistset)
* [TrustSet - Add or modify a trust line](#trustset)


_Pseudo-Transactions_ that are not created and submitted in the usual way, but may be added to open ledgers according to ledger rules. They still must be approved by consensus to be included in a validated ledger. Pseudo-transactions have their own unique transaction types:

* [SetFee - Adjust the minimum transaction cost or account reserve](#setfee)
* [EnableAmendment - Apply a change to transaction processing](#enableamendment)


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







# Transaction Results

## Looking up Transaction Results

To see the final result of a transaction, use the [tx method][], [account_tx method][], or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

| Field                  | Value   | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| meta.TransactionResult | String  | A code that categorizes the result, such as `tecPATH_DRY` |
| validated              | Boolean | Whether or not this result comes from a validated ledger. If `false`, then the result is provisional. If `true`, then the result is final. |

```js
    "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "meta": {
      ...
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
```


## Claimed Cost Justification

Although it may seem unfair to charge a [transaction cost](concept-transaction-cost.html) for a failed transaction, the `tec` class of errors exists for good reasons:

* Transactions submitted after the failed one do not have to have their Sequence values renumbered. Incorporating the failed transaction into a ledger uses up the transaction's sequence number, preserving the expected sequence.
* Distributing the transaction throughout the network increases network load. Enforcing a cost makes it harder for attackers to abuse the network with failed transactions.
* The transaction cost is generally very small in real-world value, so it should not harm users unless they are sending large quantities of transactions.

## Finality of Results

The order in which transactions apply to the consensus ledger is not final until a ledger is closed and the exact transaction set is approved by the consensus process. A transaction that succeeded initially could still fail, and a transaction that failed initially could still succeed. Additionally, a transaction that was rejected by the consensus process in one round could achieve consensus in a later round.

A validated ledger can include successful transactions (`tes` result codes) as well as failed transactions (`tec` result codes). No transaction with any other result is included in a ledger.

For any other result code, it can be difficult to determine if the result is final. The following table summarizes when a transaction's outcome is final, based on the result code from submitting the transaction:

| Error Code      | Finality                                                   |
|:----------------|:-----------------------------------------------------------|
| `tesSUCCESS`    | Final when included in a validated ledger                  |
| Any `tec` code  | Final when included in a validated ledger                  |
| Any `tem` code  | Final unless the protocol changes to make the transaction valid |
| `tefPAST_SEQ`   | Final when another transaction with the same sequence number is included in a validated ledger |
| `tefMAX_LEDGER` | Final when a validated ledger has a sequence number higher than the transaction's `LastLedgerSequence` field, and no validated ledger includes the transaction |

Any other transaction result is potentially not final. In that case, the transaction could still succeed or fail later, especially if conditions change such that the transaction is no longer prevented from applying. For example, trying to send a non-XRP currency to an account that does not exist yet would fail, but it could succeed if another transaction sends enough XRP to create the destination account. A server might even store a temporarily-failed, signed transaction and then successfully apply it later without asking first.
