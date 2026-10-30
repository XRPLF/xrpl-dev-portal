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
Sender: rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5, Balance: 100 XRP
Wallet1: rGgkxoY6bj5Ctj2NWUr2nzRrbJHwPPgDJM, Balance: 100 XRP
Wallet2: rwifZUtXm7axeKTVEt28nZtKqb8HTSLFD9, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
        "Destination": "rGgkxoY6bj5Ctj2NWUr2nzRrbJHwPPgDJM",
        "Amount": "2000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
        "Destination": "rwifZUtXm7axeKTVEt28nZtKqb8HTSLFD9",
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
  "close_time_iso": "2026-10-29T15:24:51Z",
  "ctid": "C063692E00000002",
  "hash": "1FE5A9F59F265A7782EB70F036F7377FD33FFDB33F2E2C9E9B1ED47FABF01C75",
  "ledger_hash": "5CE73C1CD0DDCE61003A8DB43758EF2868FBBFD1C1A0AE80D67D243288177C1F",
  "ledger_index": 6514990,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
            "Balance": "99999996",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6514989
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "C12B69A1881AB92F13336F12D4E10AFE39558612DDD9CB0730F35CDBBE225EA6",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6514988
          },
          "PreviousTxnID": "773A1F47B199C5D50A85D4ADF59316A0D80BE936303B8F4B2FDCB581BB8EFA3D",
          "PreviousTxnLgrSeq": 6514988
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
    "Fee": "4",
    "Flags": 65536,
    "LastLedgerSequence": 6515008,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
          "Amount": "2000000",
          "Destination": "rGgkxoY6bj5Ctj2NWUr2nzRrbJHwPPgDJM",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6514989,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5",
          "Amount": "5000000",
          "Destination": "rwifZUtXm7axeKTVEt28nZtKqb8HTSLFD9",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6514990,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6514988,
    "SigningPubKey": "EDF2492161AA432028145C3AD9BAF71B3D0837482C588D6C7630ED250EAD65ED29",
    "TransactionType": "Batch",
    "TxnSignature": "1F3175F760B880B0B7ADAB354B1CE1C28F4389BE5141586D1EF122DBB390E866C6D61CA3D5244A27CE4F31ABAAF2414465930DBB3F0860411F0BAC4DC63DA909",
    "ctid": "C063692E00000002",
    "date": 846602691,
    "ledger_index": 6514990
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/1FE5A9F59F265A7782EB70F036F7377FD33FFDB33F2E2C9E9B1ED47FABF01C75

=== Verifying inner transactions... ===

Transaction 1 hash: C7DEAD6E33FAA4574AFD8DE2DD81A1E7854743DCF9EE6E12AF43E4B9944771C5
 - Status: tesSUCCESS (Ledger 6514990)
 - Transaction URL: https://devnet.xrpl.org/transactions/C7DEAD6E33FAA4574AFD8DE2DD81A1E7854743DCF9EE6E12AF43E4B9944771C5

Transaction 2 hash: 62B8E9D1B71A0601D09D637F5928548A007C78EFB5FCE1282B71A509D178A8FA
 - Status: tesSUCCESS (Ledger 6514990)
 - Transaction URL: https://devnet.xrpl.org/transactions/62B8E9D1B71A0601D09D637F5928548A007C78EFB5FCE1282B71A509D178A8FA

=== Final balances ===
Sender: rhwe5Uq7iAKbiZtfimKarTq7NW7TH7Ufk5, Balance: 92.999996 XRP
Wallet1: rGgkxoY6bj5Ctj2NWUr2nzRrbJHwPPgDJM, Balance: 102 XRP
Wallet2: rwifZUtXm7axeKTVEt28nZtKqb8HTSLFD9, Balance: 105 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
node multiAccountBatch.js
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU, Balance: 100 XRP
Bob: rMNdshH6ERo1hWFyk4fXLvMZZ9Fah3sPDN, Balance: 100 XRP
Charlie: rNbNydwX9CPYb1NgvwULDBzm6pAefSDBZv, Balance: 100 XRP
Third-party wallet: rU96DwdtQRHVJVA8ppsrDgSzhnKMD9BFq1, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "rU96DwdtQRHVJVA8ppsrDgSzhnKMD9BFq1",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rNbNydwX9CPYb1NgvwULDBzm6pAefSDBZv",
        "Destination": "rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rMNdshH6ERo1hWFyk4fXLvMZZ9Fah3sPDN",
        "Destination": "rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU",
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
  "close_time_iso": "2026-10-29T15:25:10Z",
  "ctid": "C063693400010002",
  "hash": "EF28B924512D99F07AF1C575CC20924FD5076958FC217E81AF61242430218E9E",
  "ledger_hash": "50EE4D0F662F58CB04D30792AAF783B682835FA402EECF4E459CB6808D8620A2",
  "ledger_index": 6514996,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rU96DwdtQRHVJVA8ppsrDgSzhnKMD9BFq1",
            "Balance": "99999994",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6514994
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "0FA19416AF1A73F5B86EBC941B0CA8CA7DF57B98734715795E98347941AD549A",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6514993
          },
          "PreviousTxnID": "D52E2C32919337117573D98B291532B120F8FFFE84A8F07F9F030C6DB53F7420",
          "PreviousTxnLgrSeq": 6514993
        }
      }
    ],
    "TransactionIndex": 1,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rU96DwdtQRHVJVA8ppsrDgSzhnKMD9BFq1",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rNbNydwX9CPYb1NgvwULDBzm6pAefSDBZv",
          "SigningPubKey": "ED0541DEF241FBC85DE9635CB068AAEF4ABF93766E42B65927C326C6318353820F",
          "TxnSignature": "C16968EA53C97969FE2D4AC95782F63D7B18A5D0FC892CC9172CAB002D57A0B3346341CF19365BC9A5DB328AF94ECFEC7D95AE1620FC60205F018F095C375C08"
        }
      },
      {
        "BatchSigner": {
          "Account": "rMNdshH6ERo1hWFyk4fXLvMZZ9Fah3sPDN",
          "SigningPubKey": "ED05B1AC3EC22096EA3F128BB957A6FE555EC037D66F82322451102C1CE13C9327",
          "TxnSignature": "43FC0EFAA95AE816DA59720C23A1B2FE56B50956BF50AB318964235489DE9463FB85DAD4D251812C95B8572251A0C32337BEC7AE15A120B3D94BDE113B630D09"
        }
      }
    ],
    "Fee": "6",
    "Flags": 65536,
    "LastLedgerSequence": 6515014,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rNbNydwX9CPYb1NgvwULDBzm6pAefSDBZv",
          "Amount": "50000000",
          "Destination": "rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6514993,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rMNdshH6ERo1hWFyk4fXLvMZZ9Fah3sPDN",
          "Amount": "50000000",
          "Destination": "rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6514993,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6514993,
    "SigningPubKey": "EDEBEDFE78C657B3EF362C8072D8F6271E96CDC4B52BD10B8AC2463E6B2CDA7AC1",
    "TransactionType": "Batch",
    "TxnSignature": "BDCA6C1576C0AB2378A584A9B0A433343046CEF71632952CB1A5B44391E490916EBF2E4874DE62D6F240E82813C31B4FA3FC793B2D43B5AD4F464C2B90304B0F",
    "ctid": "C063693400010002",
    "date": 846602710,
    "ledger_index": 6514996
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/EF28B924512D99F07AF1C575CC20924FD5076958FC217E81AF61242430218E9E

=== Verifying inner transactions ===

Transaction 1 hash: 7F2BF3C701E8468B34D919FF17EDE107BCC754CA9F84C7DF3F544522F4703684
 - Status: tesSUCCESS (Ledger 6514996)
 - Transaction URL: https://devnet.xrpl.org/transactions/7F2BF3C701E8468B34D919FF17EDE107BCC754CA9F84C7DF3F544522F4703684

Transaction 2 hash: 67902AA4E43BEC6F53F252F08B90CA4AB065AB205541C8B7A2A63F11AFFD2BD6
 - Status: tesSUCCESS (Ledger 6514996)
 - Transaction URL: https://devnet.xrpl.org/transactions/67902AA4E43BEC6F53F252F08B90CA4AB065AB205541C8B7A2A63F11AFFD2BD6

=== Final balances ===
Alice: rBL89UPK3dfWXmEWEf5cdGgZmVPVUzxTcU, Balance: 200 XRP
Bob: rMNdshH6ERo1hWFyk4fXLvMZZ9Fah3sPDN, Balance: 50 XRP
Charlie: rNbNydwX9CPYb1NgvwULDBzm6pAefSDBZv, Balance: 50 XRP
Third-party wallet: rU96DwdtQRHVJVA8ppsrDgSzhnKMD9BFq1, Balance: 99.999994 XRP
```
