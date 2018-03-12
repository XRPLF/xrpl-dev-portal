# Transactions Overview

_Transactions_ are the only way to modify the XRP Ledger. Transactions are only valid if signed, submitted, and accepted into a validated ledger version following the [consensus process](concept-consensus.html). Some ledger rules also generate _[pseudo-transactions](reference-transaction-format.html#pseudo-transaction-types)_, which aren't signed or submitted, but still must be accepted by consensus. Transactions that fail are also included in ledgers because they destroy XRP to pay for the anti-spam [transaction cost](concept-transaction-cost.html).

This page contains information on:

- [Authorizing Transactions](#authorizing-transactions)
- [Signing and Submitting Transactions](#signing-and-submitting-transactions)
- [Multi-Signing](#multi-signing)
- [Identifying Transactions](#identifying-transactions)

For more information on transactions, see:

- [Transaction Format Reference](reference-transaction-format.html)
- [Transaction Results Reference](reference-transaction-results.html)
    - [Looking Up Transaction Results](reference-transaction-results.html#looking-up-transaction-results)
    - [Full Transaction Response List](reference-transaction-results.html#full-transaction-response-list)
- [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html)

## Authorizing Transactions

In the decentralized XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. A signed transaction is immutable: its contents cannot change, and the signature is not valid for any other transaction. <!-- STYLE_OVERRIDE: is authorized to -->

A transaction can be authorized by any of the following types of signatures:

* A single signature from the master private key that is mathematically associated with the sending address. You can disable or enable the master key pair using an [AccountSet transaction][].
* A single signature that matches the regular private key associated with the address. You can add, remove, or replace a regular key pair using a [SetRegularKey transaction][].
* A [multi-signature](#multi-signing) that matches a list of signers owned by the address. You can add, remove, or replace a list of signers using a [SignerListSet transaction][].

Any signature type can authorize any type of transaction, with the following exceptions:

* Only the master private key can [disable the master public key](reference-transaction-format.html#accountset-flags).
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
6. If enough [trusted validators](concept-rippled.html#reasons-to-run-a-validator) created the exact same ledger, that ledger is declared _validated_ and the [results of the transactions](reference-transaction-results.html) in that ledger are immutable.

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
2. Have a `rippled` server sign the transaction for you. The [sign command](reference-rippled-api-public.html#sign) takes a JSON-format transaction and secret and returns the signed binary transaction format ready for submission. (Transmitting your account secret is dangerous, so you should only do this from within a trusted and encrypted connection, or through a local connection, and only to a server you control.)
    * As a shortcut, you can use the [submit command](reference-rippled-api-public.html#submit) with a `tx_json` object to sign and submit a transaction all at once. This is only recommended for testing and development purposes.

In either case, signing a transaction generates a binary blob that can be submitted to the network. This means using `rippled`'s [submit command](reference-rippled-api-public.html#submit). Here is an example of the same transaction, as a signed blob, being submitted with the WebSocket API:

```
{
  "id": 2,
  "command": "submit",
  "tx_blob" : "120000240000000461D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000F732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74483046022100982064CDD3F052D22788DB30B52EEA8956A32A51375E72274E417328EBA31E480221008F522C9DB4B0F31E695AA013843958A10DE8F6BA7D6759BEE645F71A7EB240BE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

After a transaction has been submitted, you can check its status using the API, for example using the [tx command](reference-rippled-api-public.html#tx).

**Caution:** The success of a transaction is not final unless the transaction appears in a **validated** ledger with the result code `tesSUCCESS`. See also: [Finality of Results](reference-transaction-results.html#finality-of-results).

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


## Multi-Signing

Multi-signing in the XRP Ledger is the act of [authorizing transactions](#authorizing-transactions) for the XRP Ledger by using a combination of multiple secret keys. You can have any combination of authorization methods enabled for your address, including multi-signing, a [master key pair](concept-cryptographic-keys.html#master-key-pair), and a [regular key pair](concept-cryptographic-keys.html#regular-key-pair). (The only requirement is that _at least one_ method must be enabled.)

The [SignerListSet transaction][] defines which addresses can authorize transactions from your address. You can include up to 8 addresses in a SignerList. You can control how many signatures are needed, in which combinations, by using the quorum and weight values of the SignerList.

To successfully submit a multi-signed transaction, you must do all of the following:

* The address sending the transaction (specified in the `Account` field) must own a [`SignerList` in the ledger](reference-ledger-format.html#signerlist).
* The transaction must include the `SigningPubKey` field as an empty string.
* The transaction must include a [`Signers` field](reference-transaction-format.html#signers-field) containing an array of signatures.
* The signatures present in the `Signers` array must match signers defined in the SignerList.
* For the provided signatures, the total `weight` associated with those signers must be equal or greater than the `quorum` for the SignerList.
* The [transaction cost](concept-transaction-cost.html) (specified in the `Fee` field) must be at least (N+1) times the normal transaction cost, where N is the number of signatures provided.
* All fields of the transaction must be defined before collecting signatures. You cannot [auto-fill](reference-transaction-format.html#auto-fillable-fields) any fields.
* If presented in binary form, the `Signers` array must be sorted based on the numeric value of the signer addresses, with the lowest value first. (If submitted as JSON, the [`submit_multisigned` command](reference-rippled-api-public.html#submit-multisigned) handles this automatically.)

For more information, see [How to Multi-Sign](tutorial-multisign.html).


## Identifying Transactions

The `"hash"` is the unique value that identifies a particular transaction. The server provides the hash in the response when you submit the transaction; you can also look up a transaction in an account's transaction history with the [account_tx command](reference-rippled-api-public.html#account-tx).

The transaction hash can be used as a "proof of payment" since anyone can [look up the transaction by its hash](reference-transaction-results.html#looking-up-transaction-results) to verify its final status.

<!--{# Common links #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}
