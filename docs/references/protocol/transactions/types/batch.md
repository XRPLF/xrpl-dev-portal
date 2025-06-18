---
seo:
    description: Create and submit a batch of up to 8 transactions.
labels:
  - Batch
  - Transactions
status: not_enabled
---
# Batch
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Batch.cpp "Source")

The `Batch` transaction submits up to eight transactions in a single batch. Each transaction is executed atomically in one of four modes: All or Nothing, Only One, Until Failure, and Independent.

## Example Batch JSON

In this example, the user is creating an offer while trading on a DEX UI, and the second transaction is a platform fee. The inner transactions are not signed, and the `BatchSigners` field is not needed on the outer transaction, since there is only one account involved.

```json
{
  "TransactionType": "Batch",
  "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
  "Flags": "0x00010000",
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "OfferCreate",
        "Flags": 1073741824,
        "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        "TakerGets": "6000000",
        "TakerPays": {
          "currency": "GKO",
          "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          "value": "2"
        },
        "Sequence": 4,
        "Fee": "0",
        "SigningPubKey": ""
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
        "Amount": "1000",
        "Sequence": 5,
        "Fee": "0",
        "SigningPubKey": ""
      }
    }
  ],
  "Sequence": 3,
  "Fee": "40",
  "SigningPubKey": "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
  "TxnSignature": "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
}
```

### Sample Ledger Confirmation

This example shows what the ledger looks like after the transaction is confirmed.
Note that the inner transactions are committed as normal transactions.

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Flags": "0x00010000",
    "RawTransactions": [
      {
        "RawTransaction": {
          "TransactionType": "OfferCreate",
          "Flags": 1073741824,
          "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
          "TakerGets": "6000000",
          "TakerPays": {
            "currency": "GKO",
            "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
            "value": "2"
          },
          "Sequence": 4,
          "Fee": "0",
          "SigningPubKey": ""
        }
      },
      {
        "RawTransaction": {
          "TransactionType": "Payment",
          "Flags": 1073741824,
          "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
          "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
          "Amount": "1000",
          "Sequence": 5,
          "Fee": "0",
          "SigningPubKey": ""
        }
      }
    ],
    "Sequence": 3,
    "Fee": "40",
    "SigningPubKey": "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
    "TxnSignature": "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
  },
  {
    "TransactionType": "OfferCreate",
    "Flags": 1073741824,
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    },
    "Sequence": 4,
    "Fee": "0",
    "SigningPubKey": ""
  },
  {
    "TransactionType": "Payment",
    "Flags": 1073741824,
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
    "Amount": "1000",
    "Sequence": 5,
    "Fee": "0",
    "SigningPubKey": ""
  }
]
```

### Sample Ledger

This example shows what the ledger will look like after the transaction is confirmed. Note that the inner transactions are committed as normal transactions, and the RawTransactions field is not included in the validated version of the outer transaction.

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Flags": "1",
    "TxnIDs": [
      "7EB435C800D7DC10EAB2ADFDE02EE5667C0A63AA467F26F90FD4CBCD6903E15E",
      "EAE6B33078075A7BA958434691B896CCA4F532D618438DE6DDC7E3FB7A4A0AAB"
    ],
    "Sequence": 3,
    "Fee": "40",
    "SigningPubKey": "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
    "TxnSignature": "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
  },
  {
    "TransactionType": "OfferCreate",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    },
    "BatchTxn": {
      "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
      "OuterSequence": 3,
      "BatchIndex": 0
    },
    "Sequence": 0,
    "Fee": "0",
    "SigningPubKey": "",
    "TxnSignature": ""
  },
  {
    "TransactionType": "Payment",
    "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    "Destination": "rDEXfrontEnd23E44wKL3S6dj9FaXv",
    "Amount": "1000",
    "BatchTxn": {
      "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
      "OuterSequence": 3,
      "BatchIndex": 1
    },
    "Sequence": 0,
    "Fee": "0",
    "SigningPubKey": "",
    "TxnSignature": ""
  }
]
```

### Batch Fields

<!-- {% include '_snippets/tx-fields-intro.md' %} -->

| Field           | JSON Type           | [Internal Type][] | Description        |
|:----------------|:--------------------|:------------------|:-------------------|
| TransactionType | string              | UInt16            |                    |
| Account         | string              | STAccount         |                    |
| Fee             | string              | STAmount          |  The fee is twice the base fee (a total of 20 drops when there is no fee escalation), plus the sum of the transaction fees of all the inner transactions (which incorporates factors like higher fees for multisign or AMMCreate). The fees for the individual inner transactions are paid here instead of in the inner transaction itself, to ensure that fee escalation is calculated on the total cost of the transaction instead of just the overhead. |
| Flags           | number              | UInt32            | The `Flags` field represents the batch mode of the transaction. Exactly one must be specified in a `Batch` transaction. See [Batch Flags](#batch-flags)|
| RawTransactions | array               | STArray           | RawTransactions contains the list of transactions that will be applied. See [Raw Transactions](#rawtransactions). |
| TxnIDs          | array               | Vector256         | `TxnIDs` contains a list of the transaction hashes/IDs for all the transactions contained in `RawTransactions`. This is the only part of the inner transactions that is saved as a part of the ledger within the `Batch` transaction, since the inner transactions themselves are their own transactions on-ledger. The hashes in TxnIDs must be in the same order as the raw transactions in `RawTransactions`. |
| BatchSigners    | array               | STArray           | _Optional_. Only required if the `Batch` contains transactions for multiple accounts. See [BatchSigners](#batchsigners). |


### Batch Flags

Transactions of the Batch type support additional values in the `Flags` field as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------| ------------: |:------------------------------|
| `ALLORNOTHING`     | 0x00000001   | 1             | All or nothing. All transactions must succeed for any of them to succeed. |
| `ONLYONE`          | 0x00000002   | 2             | The first transaction to succeed is the only one to succeed; all other transacitons either fail or are never tried. |
| `UNTILFAILURE`     | 0x00000004   | 4             | All transactions are applied until the first failure; all transactions after the first failure are not applied. |
| `INDEPENDENT`      | 0x00000008   | 8             | All transactions will be applied, regardless of failure. |

### RawTransactions

`RawTransactions` contains the list of transactions to be applied. There can be up to 8 transactions included. These transactions can come from one account or multiple accounts.

Each inner transaction:

- Must contain a BatchTxn field.
- Must not have a sequence number. It must use a sequence number value of 0.
- Must not have a fee. It must use a fee value of "0".
- Must not be signed (the global transaction is already signed by all relevant parties). They must instead have an empty string ("") in the SigningPubKey and TxnSignature fields.

A transaction is considered a failure if it receives any result that is not `tesSUCCESS`.

This field is not included in the validated transaction, nor is it used to compute the outer transaction signature(s), since all transactions are included separately as a part of the ledger.

### BatchSigners

This field operates similarly to multisign on the XRPL. It is only needed if multiple accounts' transactions are included in the Batch transaction; otherwise, the normal transaction signature provides the same security guarantees.

Every account that has at least one inner transaction, excluding the outer account (if applicable), must have a BatchSigners field.

| Field           | JSON Type           | [Internal Type][] | Description        |
|:----------------|:--------------------|:------------------|:-------------------|
| Account         | string              | STAccount         | This is an account that has at least one inner transaction. |
| SigningPubKey   | string              | STBlob            | Included if the account is signing with a single signature. |
| Signature       | string              | STBlob            | Included if the account is signing with a single signature. |
| Signers         | array               | STArray           | This field is included if the account is signing with multi-sign (as opposed to a single signature). It operates equivalently to the Signers field used in standard transaction multi-sign. This field holds the signatures for the Flags and TxnIDs fields. |

## BatchTxn

The `BatchTxn` inner object must be included in any inner transaction of a `Batch` transaction. Its inclusion:

- Prevents hash collisions between identical transactions (since sequence numbers aren't included).
- Ensures that every transaction has a sequence number associated with it, so that created ledger objects that use it in their ID generation can still operate.
- Allows users to more easily organize their transactions in the correct order.

The fields contained in this object are as follows.

| Field                | JSON Type        | [Internal Type][] | Description      |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | string           | AccountID         | Account that is submitting the outer `Batch` transaction. |
| `OuterSequence`      | number           | UInt32            | This is the sequence number of the outer `Batch` transaction. Its inclusion ensures that there are no hash collisions with other `Batch` transactions. |
| `Sequence`           | number           | UInt32            | _(Optional)_ This is the next available sequence number for the inner transaction's account. This only needs to be included in a multi-account Batch transaction.  |
| `BatchIndex`         | number           | UInt8             | This is the (0-indexed) index of the inner transaction within the existing `Batch` transaction. The first inner transaction will have BatchIndex value 0, the second will be 1, and so on. Its inclusion ensures there are no hash collisions with other inner transactions within the same `Batch` transaction, and that the transactions are all placed in the right order. |

## Example Multiple Account Batch JSON

In this example, two users are atomically swapping their tokens, XRP for GKO. The inner transactions still are not signed, but the `BatchSigners` field is needed on the outer transaction, since there are two accounts' inner transactions in this `Batch` transaction.

```json
{
  "TransactionType": "Batch",
  "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
  "Flags": "0x00010000",
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        "Destination": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "Amount": "6000000",
        "Sequence": 5,
        "Fee": "0",
        "SigningPubKey": ""
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "Destination": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        "Amount": {
          "currency": "GKO",
          "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          "value": "2"
        },
        "Sequence": 20,
        "Fee": "0",
        "SigningPubKey": ""
      }
    }
  ],
  "BatchSigners": [
    {
      "BatchSigner": {
        "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
        "SigningPubKey": "03C6AE25CD44323D52D28D7DE95598E6ABF953EECC9ABF767F13C21D421C034FAB",
        "TxnSignature": "304502210083DF12FA60E2E743643889195DC42C10F62F0DE0A362330C32BBEC4D3881EECD022010579A01E052C4E587E70E5601D2F3846984DB9B16B9EBA05BAD7B51F912B899"
      }
    }
  ],
  "Sequence": 4,
  "Fee": "60",
  "SigningPubKey": "03072BBE5F93D4906FC31A690A2C269F2B9A56D60DA9C2C6C0D88FB51B644C6F94",
  "TxnSignature": "30440220702ABC11419AD4940969CC32EB4D1BFDBFCA651F064F30D6E1646D74FBFC493902204E5B451B447B0F69904127F04FE71634BD825A8970B9467871DA89EEC4B021F8"
}
```

#### Sample Ledger Response

```json
[
  {
    "TransactionType": "Batch",
    "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    "Flags": "0x00010000",
    "RawTransactions": [
      {
        "RawTransaction": {
          "TransactionType": "Payment",
          "Flags": 1073741824,
          "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
          "Destination": "rUser2fDds782Bd6eK15RDnGMtxf7m",
          "Amount": "6000000",
          "Sequence": 5,
          "Fee": "0",
          "SigningPubKey": ""
        }
      },
      {
        "RawTransaction": {
          "TransactionType": "Payment",
          "Flags": 1073741824,
          "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
          "Destination": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
          "Amount": {
            "currency": "GKO",
            "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
            "value": "2"
          },
          "Sequence": 20,
          "Fee": "0",
          "SigningPubKey": ""
        }
      }
    ],
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
          "SigningPubKey": "03C6AE25CD44323D52D28D7DE95598E6ABF953EECC9ABF767F13C21D421C034FAB",
          "TxnSignature": "304502210083DF12FA60E2E743643889195DC42C10F62F0DE0A362330C32BBEC4D3881EECD022010579A01E052C4E587E70E5601D2F3846984DB9B16B9EBA05BAD7B51F912B899"
        }
      }
    ],
    "Sequence": 4,
    "Fee": "60",
    "SigningPubKey": "03072BBE5F93D4906FC31A690A2C269F2B9A56D60DA9C2C6C0D88FB51B644C6F94",
    "TxnSignature": "30440220702ABC11419AD4940969CC32EB4D1BFDBFCA651F064F30D6E1646D74FBFC493902204E5B451B447B0F69904127F04FE71634BD825A8970B9467871DA89EEC4B021F8"
  },
  {
    "TransactionType": "Payment",
    "Flags": 1073741824,
    "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    "Destination": "rUser2fDds782Bd6eK15RDnGMtxf7m",
    "Amount": "6000000",
    "Sequence": 5,
    "Fee": "0",
    "SigningPubKey": ""
  },
  {
    "TransactionType": "Payment",
    "Flags": 1073741824,
    "Account": "rUser2fDds782Bd6eK15RDnGMtxf7m",
    "Destination": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    "Amount": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    },
    "Sequence": 20,
    "Fee": "0",
    "SigningPubKey": ""
  }
]
```
