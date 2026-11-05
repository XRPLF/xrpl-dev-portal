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
Sender: rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW, Balance: 100 XRP
Wallet1: rBg9Kz5A2bHrnen961pAv5PTBVcK6gN2vm, Balance: 100 XRP
Wallet2: rP6XxthKRSkz1h5j2PxDsbkzBzcgz8TF7z, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
        "Amount": "2000000",
        "Destination": "rBg9Kz5A2bHrnen961pAv5PTBVcK6gN2vm",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    },
    {
      "RawTransaction": {
        "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
        "Amount": "5000000",
        "Destination": "rP6XxthKRSkz1h5j2PxDsbkzBzcgz8TF7z",
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
  "hash": "5436BFB4F131B4DA9D90A4C413472F49A7D2795CAF3170F3CF32D0C73DB65271",
  "ledger_index": 22016736,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "4B041CC49089086E6F0CF2659502D22891A4D3C5E4B7733853673B878155CF8C",
          "FinalFields": {
            "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
            "Balance": "99999952",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016731
          },
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016730
          },
          "PreviousTxnID": "D4768C9EF461633426203A1A79771092F60307978C09F02ED7107B4F278C9B8C",
          "PreviousTxnLgrSeq": 22016730
        }
      }
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true,
  "tx_json": {
    "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
    "Fee": "48",
    "Flags": 65536,
    "LastLedgerSequence": 22016754,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
          "Amount": "2000000",
          "Destination": "rBg9Kz5A2bHrnen961pAv5PTBVcK6gN2vm",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016731,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW",
          "Amount": "5000000",
          "Destination": "rP6XxthKRSkz1h5j2PxDsbkzBzcgz8TF7z",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016732,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016730,
    "SigningPubKey": "EDD5C2D794A96F46DB2882D4344CE325EA3CBF59D2B236BBFCC2997300F537B8E6",
    "TransactionType": "Batch",
    "TxnSignature": "C558A3F65A89DAAC49FCC43D908A07935D48AB7712FCFF45C911617ABAD696FA322E9DF1625709C25E666C6D0C41FE8A5A2C1F8EFA7FC6B5D46747BA4C1A3C05",
    "ctid": "C14FF2E000000001",
    "date": 846954942,
    "ledger_index": 22016736
  }
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/5436BFB4F131B4DA9D90A4C413472F49A7D2795CAF3170F3CF32D0C73DB65271

=== Verifying inner transactions... ===

Transaction 1 hash: E0213DA0590B7BE8A56AB72406679486396591E85C854E00E90338B1AC5F2542
 - Status: tesSUCCESS (Ledger 22016736)
 - Transaction URL: https://testnet.xrpl.org/transactions/E0213DA0590B7BE8A56AB72406679486396591E85C854E00E90338B1AC5F2542

Transaction 2 hash: E102FE268B0DE2F478F97BDD1B589CA26EC106B2451A89A4CE762E83BE92CCF6
 - Status: tesSUCCESS (Ledger 22016736)
 - Transaction URL: https://testnet.xrpl.org/transactions/E102FE268B0DE2F478F97BDD1B589CA26EC106B2451A89A4CE762E83BE92CCF6

=== Final balances ===
Sender: rwyZebPQpf2o36fL1ve81xQkaKLBmV1ZLW, Balance: 92.999952 XRP
Wallet1: rBg9Kz5A2bHrnen961pAv5PTBVcK6gN2vm, Balance: 102 XRP
Wallet2: rP6XxthKRSkz1h5j2PxDsbkzBzcgz8TF7z, Balance: 105 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
go run ./send-multi-account-batch
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn, Balance: 100 XRP
Bob: rhiKPq38botQGwaEmTvJ2qXXJJz1AiCYpo, Balance: 100 XRP
Charlie: rDr4jxtjJ3RRjYLrnvVw5XJJAbeMjR9cCT, Balance: 100 XRP
Third-party wallet: rwy3FAerkK32USGQvRfeYZWcamJPr322Ur, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "Account": "rwy3FAerkK32USGQvRfeYZWcamJPr322Ur",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rDr4jxtjJ3RRjYLrnvVw5XJJAbeMjR9cCT",
        "Amount": "50000000",
        "Destination": "rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "TransactionType": "Payment"
      }
    },
    {
      "RawTransaction": {
        "Account": "rhiKPq38botQGwaEmTvJ2qXXJJz1AiCYpo",
        "Amount": "50000000",
        "Destination": "rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn",
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
  "hash": "2C819A664A7850C2C457D475FAFC75D4AF8B155D0FAE0B789E4E91B5C9652CE5",
  "ledger_index": 22016747,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "E0560D3BF768CEDCF6B0EA0B4650DDFF1AA610B63F6E5D3423736420C7E27F44",
          "FinalFields": {
            "Account": "rwy3FAerkK32USGQvRfeYZWcamJPr322Ur",
            "Balance": "99999928",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016746
          },
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016745
          },
          "PreviousTxnID": "21EB34D2227672B036722BC86826217CE6630B91B122FD88AF41E31D16377E52",
          "PreviousTxnLgrSeq": 22016745
        }
      }
    ],
    "TransactionIndex": 15,
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true,
  "tx_json": {
    "Account": "rwy3FAerkK32USGQvRfeYZWcamJPr322Ur",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rhiKPq38botQGwaEmTvJ2qXXJJz1AiCYpo",
          "SigningPubKey": "EDA215D1AFD1EC4F81303762C25CC61A64669FDA3E2C42558F024E50B14BB4D753",
          "TxnSignature": "91135AC1545B5C2B5D3FCBDA68E9C2BF04A1B944DABE5D990154146B70AD9F1CC5E3A2DB36E835E78AEEC4D1E060A9E03FA4B438A8CD8CB19008E5DB5557BE08"
        }
      },
      {
        "BatchSigner": {
          "Account": "rDr4jxtjJ3RRjYLrnvVw5XJJAbeMjR9cCT",
          "SigningPubKey": "ED10A384DE36B6A57BB496AB06431EA3A763F0EEDABDD8901AD7BB1BE5DE1336BE",
          "TxnSignature": "CACED6CA9134B1E31497EBA290FE45C201745D987E23DB529ECFAB059F0E72D2F898AA82AC9F8C1BC400C8759484C10EA1EA59C259507336A097DD5C81BBF30B"
        }
      }
    ],
    "Fee": "72",
    "Flags": 65536,
    "LastLedgerSequence": 22016765,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rDr4jxtjJ3RRjYLrnvVw5XJJAbeMjR9cCT",
          "Amount": "50000000",
          "Destination": "rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016743,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rhiKPq38botQGwaEmTvJ2qXXJJz1AiCYpo",
          "Amount": "50000000",
          "Destination": "rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016741,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016745,
    "SigningPubKey": "ED4A4B421CEB49F88DA6988F4DC5C79B52DC1EDE42002EF7EA8800A56E1F6DFF4C",
    "TransactionType": "Batch",
    "TxnSignature": "C2B25D73BC4D6348248EE8E04463DDEA090BB5F698D049260AA1C4A0102E328E4DA52F69762785ED995DB45124781C254F629BBBA0F237DE561CA5E9C569AE0F",
    "ctid": "C14FF2EB000F0001",
    "date": 846954982,
    "ledger_index": 22016747
  }
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/2C819A664A7850C2C457D475FAFC75D4AF8B155D0FAE0B789E4E91B5C9652CE5

=== Verifying inner transactions ===

Transaction 1 hash: DE7147BAE1E97687B139DB790046ED01473F1F3B5FB00396ED1735F18F972A25
 - Status: tesSUCCESS (Ledger 22016747)
 - Transaction URL: https://testnet.xrpl.org/transactions/DE7147BAE1E97687B139DB790046ED01473F1F3B5FB00396ED1735F18F972A25

Transaction 2 hash: 722C8312198874EC844E6779DB081F4A12DF0F655453CE031B5A0153400CD2E0
 - Status: tesSUCCESS (Ledger 22016747)
 - Transaction URL: https://testnet.xrpl.org/transactions/722C8312198874EC844E6779DB081F4A12DF0F655453CE031B5A0153400CD2E0

=== Final balances ===
Alice: rnJizFPi5gvdpmFNsarwk8rRNMbqrF5Zvn, Balance: 200 XRP
Bob: rhiKPq38botQGwaEmTvJ2qXXJJz1AiCYpo, Balance: 50 XRP
Charlie: rDr4jxtjJ3RRjYLrnvVw5XJJAbeMjR9cCT, Balance: 50 XRP
Third-party wallet: rwy3FAerkK32USGQvRfeYZWcamJPr322Ur, Balance: 99.999928 XRP
```
