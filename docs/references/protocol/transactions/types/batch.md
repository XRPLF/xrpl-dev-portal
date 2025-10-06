---
seo:
    description: Create and submit a batch of up to 8 transactions that succeed or fail atomically.
labels:
    - Transaction Sending
status: not_enabled
---
# Batch
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Batch.cpp "Source")

Submit up to eight transactions as a single [batch](../../../../concepts/transactions/batch-transactions.md). The transactions in the batch are executed atomically in one of four modes: All or Nothing, Only One, Until Failure, or Independent.

{% amendment-disclaimer name="Batch" /%}


## Example {% $frontmatter.seo.title %} JSON

### Single Account

In this example, the user is creating an offer while trading on a DEX UI, and the second transaction pays a platform fee. The inner transactions are not signed, and the `BatchSigners` field is not needed on the outer transaction since there is only one account involved.

```json
{
  "TransactionType": "Batch",
  "Account": "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
  "Flags": 65536,
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

### Multiple Accounts

In this example, two users are atomically swapping their tokens: XRP for GKO.

```json
{
  "TransactionType": "Batch",
  "Account": "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
  "Flags": 65536,
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

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type | [Internal Type][] | Required? | Description |
|:------------------|:----------|:------------------|:----------|:------------|
| `Flags`           | Number    | UInt32            | Yes       | A bit-flag for this transaction. Exactly one must be specified to represent the batch mode of the transaction. See: [Batch Flags](#batch-flags). |
| `RawTransactions` | Array     | Array             | Yes       | The list of transactions to apply. |
| `BatchSigners`    | Array     | Array             | No        | The signatures authorizing a multi-account `Batch` transaction. |

### RawTransactions

`RawTransactions` contains the list of inner transactions to be applied. There can be up to 8 transactions included. These transactions can come from one account or multiple accounts.

Each inner transaction:

- Must contain a `tfInnerBatchTxn` (Decimal Value: `1073741824`, or Hex Value: `0x40000000`) flag.
- Must have a `Fee` value of `"0"`.
- Must not be signed (the global transaction is already signed by all relevant parties). They must instead have an empty string (`""`) in the `SigningPubKey`, and the `TxnSignature` field must be omitted.
- Must include a `TicketSequence` or `Sequence` value greather than zero.

### BatchSigners

This field operates similarly to multi-signing on the XRPL. It is only needed if multiple accounts' transactions are included in the `Batch` transaction; otherwise, the normal transaction signature provides the same security guarantees.

| Field           | JSON Type | [Internal Type][] | Required? | Description |
|:----------------|:----------|:------------------|:----------|:------------|
| `Account`       | String    | AccountID         | Yes       | An account with at least one inner transaction. |
| `SigningPubKey` | String    | Blob              | No        | Hex representation of the public key that corresponds to the private key used to sign this transaction. |
| `TxnSignature`  | String    | Blob              | No        | The signature that verifies this transaction as originating from the account it says it is from. |
| `Signers`       | Array     | Array             | No        | Array of objects that represent a multi-signature which authorizes this transaction. |

{% admonition type="info" name="Note" %}
If the account submitting the `Batch` transaction is signing with a single signature, they sign the `Flags` field and the hashes of the inner transactions. In this case, only `SigningPubKey` and `TxnSignature` are included. Otherwise, the `Signers` field is used instead for multi-signing; this field holds the signatures for the `Flags` field and the hashes of the inner transactions.
{% /admonition %}


## Batch Flags

Transactions of the `Batch` type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfAllOrNothing`   | `0x00010000` | 65536         | All transactions must succeed or else the whole batch fails. |
| `tfOnlyOne`        | `0x00020000` | 131072        | Only the first successful transaction is applied. All transactions afterward fail or are skipped. |
| `tfUntilFailure`   | `0x00040000` | 262144        | All transactions are applied until the first failure; subsequent transactions are skipped. |
| `tfIndependent`    | `0x00080000` | 524288        | All transactions will be applied, regardless of failure. |

A transaction is considered successful if it receives a `tesSUCCESS` result.


## Error Cases

| Error Code                | Description                                       |
|:--------------------------|:--------------------------------------------------|
| `temINVALID_INNER_BATCH`  | An inner transaction is malformed.               |
| `temSEQ_AND_TICKET`       | The transaction contains both a `TicketSequence` field and a non-zero `Sequence` value. A transaction can't include both fields, but must have at least one. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
