# Batch Transactions (JavaScript)

This directory contains JavaScript examples demonstrating how to send a single-account [Batch transaction](https://xrpl.org/docs/concepts/transactions/batch-transactions) and a multi-account Batch transaction.

## Setup

```sh
npm i
```

---

## Send a Single Account Batch Transaction

```sh
node singleAccountBatch.js
```

The script should output the Batch transaction, the validated transaction result, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Sender: rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG, Balance: 100 XRP
Wallet1: r9dExvYSEc6dNVKzVydEFuhDSAB5mRmXEt, Balance: 100 XRP
Wallet2: ra2L7gjmK6B6EbRwJzftvDrqUpTrHp72UK, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
        "Destination": "r9dExvYSEc6dNVKzVydEFuhDSAB5mRmXEt",
        "Amount": "2000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
        "Destination": "ra2L7gjmK6B6EbRwJzftvDrqUpTrHp72UK",
        "Amount": "5000000",
        "Flags": 1073741824
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-11-02T17:14:50Z",
  "ctid": "C14FF2D000030001",
  "hash": "378A9E7DD563B6CA15F531F4679A12D41523FD5B18CA8E0BEA4CCC7EB1473662",
  "ledger_hash": "B529B61A456CE8953E909AE74EAD9ADBE47613036A0A864AD30BCDFF96239A56",
  "ledger_index": 22016720,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
            "Balance": "99999952",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016719
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "643720B65952296EF5EAF9C3F1855FA3D07B99DC098C6D338B840C1408A78559",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016718
          },
          "PreviousTxnID": "0FD3BB15FA44D19E9F677A2821C3899A830237DC27CBB482605075F59B9A50AE",
          "PreviousTxnLgrSeq": 22016718
        }
      }
    ],
    "TransactionIndex": 3,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
    "Fee": "48",
    "Flags": 65536,
    "LastLedgerSequence": 22016738,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
          "Amount": "2000000",
          "Destination": "r9dExvYSEc6dNVKzVydEFuhDSAB5mRmXEt",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016719,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG",
          "Amount": "5000000",
          "Destination": "ra2L7gjmK6B6EbRwJzftvDrqUpTrHp72UK",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016720,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016718,
    "SigningPubKey": "ED3DFA1207DD35DB6191305BCC731C82AF935556154C96BE8BC72C57AE96DD4142",
    "TransactionType": "Batch",
    "TxnSignature": "0CA8963EF3CD94695EEDB2952E3F575EAC3562197BF582FAAF0051B03DCED62CAD46459BEB20655424BC227FD18E6EA5CE64E674126E759B7285DBEABBB69E07",
    "ctid": "C14FF2D000030001",
    "date": 846954890,
    "ledger_index": 22016720
  },
  "validated": true
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/378A9E7DD563B6CA15F531F4679A12D41523FD5B18CA8E0BEA4CCC7EB1473662

=== Verifying inner transactions... ===

Transaction 1 hash: 73946FBBF84CCC44312606AF33EB7E006B9C2C04C0B03865628125BECC3E2440
 - Status: tesSUCCESS (Ledger 22016720)
 - Transaction URL: https://testnet.xrpl.org/transactions/73946FBBF84CCC44312606AF33EB7E006B9C2C04C0B03865628125BECC3E2440

Transaction 2 hash: F872BABD0F417A2EDF3CFF64AE258B05869888998F66E4EBD3756D86118E7D30
 - Status: tesSUCCESS (Ledger 22016720)
 - Transaction URL: https://testnet.xrpl.org/transactions/F872BABD0F417A2EDF3CFF64AE258B05869888998F66E4EBD3756D86118E7D30

=== Final balances ===
Sender: rGjNPGD5nsRtWERm4Htiu9DMja7Hq8R6kG, Balance: 92.999952 XRP
Wallet1: r9dExvYSEc6dNVKzVydEFuhDSAB5mRmXEt, Balance: 102 XRP
Wallet2: ra2L7gjmK6B6EbRwJzftvDrqUpTrHp72UK, Balance: 105 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
node multiAccountBatch.js
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM, Balance: 100 XRP
Bob: rwHbVSqS9SF87PzxQ7F7vdJzSGfEr1D2T3, Balance: 100 XRP
Charlie: rBa5SHDFyCAvD28p65TgVBHN1UEK8nWU4Y, Balance: 100 XRP
Third-party wallet: raFuxHLtWt9Dr6z1hHNToXv8PrvxHqmpkF, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "raFuxHLtWt9Dr6z1hHNToXv8PrvxHqmpkF",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rBa5SHDFyCAvD28p65TgVBHN1UEK8nWU4Y",
        "Destination": "rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rwHbVSqS9SF87PzxQ7F7vdJzSGfEr1D2T3",
        "Destination": "rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-11-02T17:15:11Z",
  "ctid": "C14FF2D600070001",
  "hash": "AF02E9C537E9AD1DACF837D0CE40C77C0AD0FC44C05ACD3FF9E1F153A007B1B8",
  "ledger_hash": "F08D64F1229489276A91E045FFE1296B84A133DC1AED690F94D81A60B1922819",
  "ledger_index": 22016726,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "raFuxHLtWt9Dr6z1hHNToXv8PrvxHqmpkF",
            "Balance": "99999928",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016725
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "5411898940730348E2DEE8F39C7344741B64EC3FA0CB80001FF3E8F9E6FC47A2",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016724
          },
          "PreviousTxnID": "935D591DC1F6CA8D7DF8C6B4739521CBC00764DE06845B0B562E3A2D6D60029E",
          "PreviousTxnLgrSeq": 22016724
        }
      }
    ],
    "TransactionIndex": 7,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "raFuxHLtWt9Dr6z1hHNToXv8PrvxHqmpkF",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rwHbVSqS9SF87PzxQ7F7vdJzSGfEr1D2T3",
          "SigningPubKey": "EDCF74C9CBB4193A4CC0E8E5C5D1C2D347292EE0FC16C91919DEC5CC9DC85D21A9",
          "TxnSignature": "B008954324A7F6ABCB84B8BD18748DB3B14F95867FF8B83514CE88498684F1D0B01F0A10E55B306E62278CCE521BC65F542CEB201FEB3B45CE6176B9FD66C80D"
        }
      },
      {
        "BatchSigner": {
          "Account": "rBa5SHDFyCAvD28p65TgVBHN1UEK8nWU4Y",
          "SigningPubKey": "EDD3768EA86157FFDE4A6F2550718FFD38D885D9132A56CE25F08C095328A03AA3",
          "TxnSignature": "1B7E25A0EA7336ACD4D2AE9BB805066791BF6285D4D788B80EA8B104F480EF44415E04310A8C1D315BEB92ED0FBD5ECF771EFEF089C2BE7A0CC89AD48650640F"
        }
      }
    ],
    "Fee": "72",
    "Flags": 65536,
    "LastLedgerSequence": 22016744,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rBa5SHDFyCAvD28p65TgVBHN1UEK8nWU4Y",
          "Amount": "50000000",
          "Destination": "rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016724,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rwHbVSqS9SF87PzxQ7F7vdJzSGfEr1D2T3",
          "Amount": "50000000",
          "Destination": "rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016724,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016724,
    "SigningPubKey": "ED4B3BD0C194B681C884F01D8FC28D45B407AC042A84D68BECCAA618868A3259FC",
    "TransactionType": "Batch",
    "TxnSignature": "139F670372C38BA1EA355EF4A89A99E6431CEAD6A7F9B0612B8A20CB938DF53B110E3DD1C88A8125BC3234F539D26E55BCF362127801AD592085555EB3E2DF05",
    "ctid": "C14FF2D600070001",
    "date": 846954911,
    "ledger_index": 22016726
  },
  "validated": true
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/AF02E9C537E9AD1DACF837D0CE40C77C0AD0FC44C05ACD3FF9E1F153A007B1B8

=== Verifying inner transactions ===

Transaction 1 hash: 4E04108395F86E08167EA9780CC7248AE51927BE5F4975505FF62DC2A6FA8FBF
 - Status: tesSUCCESS (Ledger 22016726)
 - Transaction URL: https://testnet.xrpl.org/transactions/4E04108395F86E08167EA9780CC7248AE51927BE5F4975505FF62DC2A6FA8FBF

Transaction 2 hash: FB8063791A03AB29FE6D3AD7E06DB04FE43C648CCE851E172600DC74B02041F6
 - Status: tesSUCCESS (Ledger 22016726)
 - Transaction URL: https://testnet.xrpl.org/transactions/FB8063791A03AB29FE6D3AD7E06DB04FE43C648CCE851E172600DC74B02041F6

=== Final balances ===
Alice: rsmmNTjdKYcNmrQdBaEfk9tboofwSHLhKM, Balance: 200 XRP
Bob: rwHbVSqS9SF87PzxQ7F7vdJzSGfEr1D2T3, Balance: 50 XRP
Charlie: rBa5SHDFyCAvD28p65TgVBHN1UEK8nWU4Y, Balance: 50 XRP
Third-party wallet: raFuxHLtWt9Dr6z1hHNToXv8PrvxHqmpkF, Balance: 99.999928 XRP
```
