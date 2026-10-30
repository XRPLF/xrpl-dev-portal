# Batch Transactions (Go)

This directory contains Go examples demonstrating how to send a single-account [Batch transaction](https://xrpl.org/docs/concepts/transactions/batch-transactions) and a multi-account Batch transaction.

## Setup

All commands should be run from this `go/` directory.

```sh
go mod tidy
```

---

## Send a Single Account Batch Transaction

```sh
go run ./send-single-account-batch
```

The script should output the Batch transaction, the validated transaction result, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Sender: raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG, Balance: 100 XRP
Wallet1: rpf1LWNanWQye37V321veDRM7Es4vsUbbi, Balance: 100 XRP
Wallet2: rfV1MWGWvRswwj6T6Av5iyJe4NN2XTzdvG, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
        "Amount": "2000000",
        "Destination": "rpf1LWNanWQye37V321veDRM7Es4vsUbbi",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    },
    {
      "RawTransaction": {
        "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
        "Amount": "5000000",
        "Destination": "rfV1MWGWvRswwj6T6Av5iyJe4NN2XTzdvG",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    }
  ],
  "TransactionType": "Batch"
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
{
  "date": 0,
  "hash": "E0F42C6746C507AE7FB7C79B8A2733A557906A4C2415EF00519893992B3F2A79",
  "ledger_index": 6516232,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "1582C93EAAFD55DE9A1F27151ACA6FBB11EFC972A988D6BCEB588C64914F32B3",
          "FinalFields": {
            "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
            "Balance": "99999995",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6516227
          },
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6516226
          },
          "PreviousTxnID": "A3E801BF3480F779E64AC030969B559ECAA03BD7E6E64AB0B11B3262F4C65DF3",
          "PreviousTxnLgrSeq": 6516226
        }
      }
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true,
  "tx_json": {
    "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
    "Fee": "5",
    "Flags": 65536,
    "LastLedgerSequence": 6516250,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
          "Amount": "2000000",
          "Destination": "rpf1LWNanWQye37V321veDRM7Es4vsUbbi",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516227,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG",
          "Amount": "5000000",
          "Destination": "rfV1MWGWvRswwj6T6Av5iyJe4NN2XTzdvG",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516228,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6516226,
    "SigningPubKey": "ED64E7AB3ACC0FFD3ABE700973EBFDF2BE17BA404235EA078D5528F24EB397DAC6",
    "TransactionType": "Batch",
    "TxnSignature": "EC451ACB5DA66B91AFC6AF2D8A30E9826942BAF2A8D6E69EAFEB93BB46DF55D9C68361B970C887C6B80C3E818EC37B40C57376F7C6BBBC8F1B2924F09D2F9D07",
    "ctid": "C0636E0800000002",
    "date": 846606522,
    "ledger_index": 6516232
  }
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/E0F42C6746C507AE7FB7C79B8A2733A557906A4C2415EF00519893992B3F2A79

=== Verifying inner transactions... ===

Transaction 1 hash: B08BA5915A83A3B2910D236C7E2EE0C5B6F47B1371E3813C491F7D191D240D82
 - Status: tesSUCCESS (Ledger 6516232)
 - Transaction URL: https://devnet.xrpl.org/transactions/B08BA5915A83A3B2910D236C7E2EE0C5B6F47B1371E3813C491F7D191D240D82

Transaction 2 hash: 8AE2391A7F17A0A4C4FCAED32E5B69D943B4F5FCD273E65A6D783A7030368355
 - Status: tesSUCCESS (Ledger 6516232)
 - Transaction URL: https://devnet.xrpl.org/transactions/8AE2391A7F17A0A4C4FCAED32E5B69D943B4F5FCD273E65A6D783A7030368355

=== Final balances ===
Sender: raavp6sRAgBnLtbNEHuqLvdYQpa6MtaaFG, Balance: 92.999995 XRP
Wallet1: rpf1LWNanWQye37V321veDRM7Es4vsUbbi, Balance: 102 XRP
Wallet2: rfV1MWGWvRswwj6T6Av5iyJe4NN2XTzdvG, Balance: 105 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
go run ./send-multi-account-batch
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU, Balance: 100 XRP
Bob: rUMXWtHYG4qKN4WyFJEj6EnnAssKwV1TNK, Balance: 100 XRP
Charlie: rEfyZvydmG6BSDp3FXCbo3ygnHkVienhug, Balance: 100 XRP
Third-party wallet: rJTtNcVcdN5HpudU24zf9w7PUsdRNfUjEd, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "Account": "rJTtNcVcdN5HpudU24zf9w7PUsdRNfUjEd",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rEfyZvydmG6BSDp3FXCbo3ygnHkVienhug",
        "Amount": "50000000",
        "Destination": "rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    },
    {
      "RawTransaction": {
        "Account": "rUMXWtHYG4qKN4WyFJEj6EnnAssKwV1TNK",
        "Amount": "50000000",
        "Destination": "rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    }
  ],
  "TransactionType": "Batch"
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
{
  "date": 0,
  "hash": "2EBDB97CD6AA35EDA9210F1CA2A2FF58B1AC1790EC57A95F163A996045D7BBDD",
  "ledger_index": 6516243,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "59AC1636A150465FA6A2A5A530DA7008C909648A3C9C7CCDF9FEBD8A621599D7",
          "FinalFields": {
            "Account": "rJTtNcVcdN5HpudU24zf9w7PUsdRNfUjEd",
            "Balance": "99999993",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6516242
          },
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6516241
          },
          "PreviousTxnID": "6BF2746DA9E82DA214B878B67A7C67C3F04281FCA6C4FE9EFA53614AC50CC085",
          "PreviousTxnLgrSeq": 6516241
        }
      }
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true,
  "tx_json": {
    "Account": "rJTtNcVcdN5HpudU24zf9w7PUsdRNfUjEd",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rUMXWtHYG4qKN4WyFJEj6EnnAssKwV1TNK",
          "SigningPubKey": "ED7E48BE4BB2E341E539691799F54C50944C7CA4EF801F6A64142A51CFE9E3BEEE",
          "TxnSignature": "0756B7774E7851A430635577E7CCE0412B5FA0AF41C42E76F95E902BD5C35443D488E6200375019B86FAE7BCB2673A17B148DA905F9BC5341B218EFBADA0D106"
        }
      },
      {
        "BatchSigner": {
          "Account": "rEfyZvydmG6BSDp3FXCbo3ygnHkVienhug",
          "SigningPubKey": "ED7B83BE0CDBA4BDC1126DC576A9E5C847034060113D257433E330A50BE98D73CC",
          "TxnSignature": "7E105D71978321ADE5F04006D12FF929EE92240C6306579EFB28064A79E03DEA8679755BF7C73C8CFD504A737BA0EEE83B7CD068EB63F4E2AED58A52D7A82702"
        }
      }
    ],
    "Fee": "7",
    "Flags": 65536,
    "LastLedgerSequence": 6516261,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rEfyZvydmG6BSDp3FXCbo3ygnHkVienhug",
          "Amount": "50000000",
          "Destination": "rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516239,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rUMXWtHYG4qKN4WyFJEj6EnnAssKwV1TNK",
          "Amount": "50000000",
          "Destination": "rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516237,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6516241,
    "SigningPubKey": "EDC62552F4CDF855CFB5F36BAC2A571E1A592CF1DA863B654B947DB0647C2727C2",
    "TransactionType": "Batch",
    "TxnSignature": "88B7700E79DFECC632888F01635E5603842AC79FAC1AEC7E3AD4A5F708D24E3FC3FC83AF72ADD6F3C98C0267E3E1249124CE37B293A0E86AB8D1FAE08189F203",
    "ctid": "C0636E1300000002",
    "date": 846606553,
    "ledger_index": 6516243
  }
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/2EBDB97CD6AA35EDA9210F1CA2A2FF58B1AC1790EC57A95F163A996045D7BBDD

=== Verifying inner transactions ===

Transaction 1 hash: 2D1A4C61FD1DF6BB599B127BBACB27F3430127199AED8FCB330B8D1CE95BDB7D
 - Status: tesSUCCESS (Ledger 6516243)
 - Transaction URL: https://devnet.xrpl.org/transactions/2D1A4C61FD1DF6BB599B127BBACB27F3430127199AED8FCB330B8D1CE95BDB7D

Transaction 2 hash: 5CA1A37AE8F2A3A49FA8CE1A7FF8FED2D73D3E4B5C9E034F7A54ECEA14B42D30
 - Status: tesSUCCESS (Ledger 6516243)
 - Transaction URL: https://devnet.xrpl.org/transactions/5CA1A37AE8F2A3A49FA8CE1A7FF8FED2D73D3E4B5C9E034F7A54ECEA14B42D30

=== Final balances ===
Alice: rwxgZyr1tHY9C4pjDz23ATjabBnvXTbRUU, Balance: 200 XRP
Bob: rUMXWtHYG4qKN4WyFJEj6EnnAssKwV1TNK, Balance: 50 XRP
Charlie: rEfyZvydmG6BSDp3FXCbo3ygnHkVienhug, Balance: 50 XRP
Third-party wallet: rJTtNcVcdN5HpudU24zf9w7PUsdRNfUjEd, Balance: 99.999993 XRP
```
