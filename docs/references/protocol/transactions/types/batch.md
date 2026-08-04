---
seo:
    description: Create and submit a batch of up to 8 transactions that succeed or fail atomically.
labels:
    - Transaction Sending
    - Other Transactions
requiredAmendment: BatchV1_1
status: not_enabled
txIcon: other
---
# Batch
{% source-link path="src/libxrpl/tx/transactors/system/Batch.cpp" /%}

Submit up to eight transactions as a single [batch](../../../../concepts/transactions/batch-transactions.md). The transactions in the batch are executed atomically in one of four modes: All or Nothing, Only One, Until Failure, or Independent.

{% amendment-disclaimer name="BatchV1_1" /%}


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
| `RawTransactions` | Array     | Array             | Yes       | The list of transactions to apply. See [RawTransactions](#rawtransactions). |
| `BatchSigners`    | Array     | Array             | No        | The signatures authorizing a multi-account `Batch` transaction. |

### RawTransactions

`RawTransactions` contains the list of inner transactions to be applied. There must be a minimum of **2** transactions and a maximum of **8** transactions. These transactions can come from one account or multiple accounts.

Each inner transaction:

- Must contain a `tfInnerBatchTxn` (Decimal Value: `1073741824`, or Hex Value: `0x40000000`) flag.
- Must have a `Fee` value of `"0"`.
- Must not be signed (the global transaction is already signed by all relevant parties). They must instead have an empty string (`""`) in the `SigningPubKey`, and the `TxnSignature` field must be omitted.
- Must include either a `TicketSequence` or `Sequence` value greater than zero.

### BatchSigners

This field operates similarly to multi-signing on the XRPL. It is only needed if multiple accounts' transactions are included in the `Batch` transaction; otherwise, the normal transaction signature provides the same security guarantees. When required, it must contain signatures from all accounts whose inner transactions are included, excluding the account signing the outer transaction. The entries must be sorted in ascending order by `Account`, and must be unique.

| Field           | JSON Type | [Internal Type][] | Required? | Description |
|:----------------|:----------|:------------------|:----------|:------------|
| `Account`       | String    | AccountID         | Yes       | An account with at least one inner transaction. |
| `SigningPubKey` | String    | Blob              | No        | Hex representation of the public key that corresponds to the private key used to sign this transaction. |
| `TxnSignature`  | String    | Blob              | No        | The signature that verifies this transaction as originating from the account it says it is from. |
| `Signers`       | Array     | Array             | No        | Array of objects that represent a multi-signature which authorizes this transaction. |

{% admonition type="info" name="Note" %}
If the account in a `BatchSigners` entry authorizes with a single signature, only include `SigningPubKey` and `TxnSignature`. Multi-signed accounts use the `Signers` field instead.
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


## Special Transaction Cost

A `Batch` [transaction cost][] is higher than a standard transaction. The fee is calculated as the sum of:

- {% $env.PUBLIC_BASE_FEE %} * 2.
- An additional {% $env.PUBLIC_BASE_FEE %} for each signature in the outer transaction.
- The sum of all inner transaction fees.


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temARRAY_EMPTY` | There are fewer than two transactions in the `RawTransactions` field. A batch must contain at least two inner transactions. |
| `temARRAY_TOO_LARGE` | There are more than 8 entries in `RawTransactions`, or more than 24 signatures in `BatchSigners`. |
| `tefBAD_AUTH` | A `BatchSigners` entry references a pseudo-account, which can't sign any transactions. |
| `temBAD_FEE` | One of the inner transactions has a `Fee` greater than `0`. |
| `temBAD_REGKEY` | One of the inner transactions has a non-empty `SigningPubKey`. |
| `temBAD_SIGNATURE` | One of the inner transactions includes a `TxnSignature` field. |
| `temBAD_SIGNER` | <li>One of the inner transactions includes a `Signers` field.</li><li>The `BatchSigners` field contains a signature from the account signing the outer transaction.</li><li>The `BatchSigners` field contains a duplicate signer.</li><li>The `BatchSigners` field isn't sorted in strictly ascending order by `Account`.</li><li>The `BatchSigners` field contains a signature from an account that has no inner transactions.</li><li>The `BatchSigners` field is missing a signature from an account that has inner transactions.</li> |
| `temINVALID_FLAG` | <li>The `Flags` field isn't set to exactly one of the supported [batch modes](#batch-flags).</li><li>One of the inner transactions doesn't have the `tfInnerBatchTxn` flag set.</li> |
| `temINVALID_INNER_BATCH` | The `RawTransactions` field contains a disabled or invalid `TransactionType`, such as `Batch`. Currently-disabled transactions include: `LoanBrokerCoverClawback`, `LoanBrokerCoverDeposit`, `LoanBrokerCoverWithdraw`, `LoanBrokerDelete`, `LoanBrokerSet`, `LoanDelete`, `LoanManage`, `LoanPay`, `LoanSet`, `VaultCreate`, `VaultSet`, `VaultDelete`, `VaultDeposit`, `VaultWithdraw`, and `VaultClawback`. |
| `temREDUNDANT` | There is a duplicate transaction in the `RawTransactions` field. |
| `temSEQ_AND_TICKET` | One of the inner transactions sets both `TicketSequence` and a non-zero `Sequence`, or sets neither. Only one is required. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
