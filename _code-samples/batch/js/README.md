# Send a Batch Transaction

Code samples showing how to create and submit a [Batch transaction](https://xrpl.org/docs/concepts/transactions/batch-transactions) with Javascript.

Both for single and multi account batch transactions.

## Single Account Batch Transaction

Quick setup and usage:

```sh
npm install xrpl
node singleAccountBatch.js
```

The script should output the following:

```sh
Funding new wallets from faucet...
Sender: raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e, Balance: 100 XRP
Wallet1: r4JMmKToZRMVT3mGWPnKHFEHsSMQEWigLC, Balance: 100 XRP
Wallet2: rKfPgHASYuttoF1HfU56V31WbJvZn3w8xn, Balance: 100 XRP

Creating batch transaction:
{
  "TransactionType": "Batch",
  "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
        "Destination": "r4JMmKToZRMVT3mGWPnKHFEHsSMQEWigLC",
        "Amount": "2000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
        "Destination": "rKfPgHASYuttoF1HfU56V31WbJvZn3w8xn",
        "Amount": "5000000",
        "Flags": 1073741824
      }
    }
  ]
}

Submitting batch transaction...

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2025-11-03T14:16:21Z",
  "ctid": "C00D458B00020002",
  "hash": "A93D3C2BDB5D600E592B64B84E66D789237D029267129EBC659EE483E532DD95",
  "ledger_hash": "BE6B7C12E551305F09E942D6FA3FC8546F024AE5C53FC495DA6ABF78461E7019",
  "ledger_index": 869771,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
            "Balance": "99999996",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 869767
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "6238B6901FEBD1492C03546C7965A01F184C4E37B696304B86F78F4ADB7831B1",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 869766
          },
          "PreviousTxnID": "559F102041D84FF9DA17483355C3C96A0F8923D9C9C7971BBB15C972DD1F37D6",
          "PreviousTxnLgrSeq": 869766
        }
      }
    ],
    "TransactionIndex": 2,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
    "Fee": "4",
    "Flags": 65536,
    "LastLedgerSequence": 869789,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
          "Amount": "2000000",
          "Destination": "r4JMmKToZRMVT3mGWPnKHFEHsSMQEWigLC",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 869767,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e",
          "Amount": "5000000",
          "Destination": "rKfPgHASYuttoF1HfU56V31WbJvZn3w8xn",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 869768,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 869766,
    "SigningPubKey": "EDFECFB87A29F93E52BBA0BA5A14A59B520BB0E39F33943A2FDC1101D34349270D",
    "TransactionType": "Batch",
    "TxnSignature": "E08E300BDE1700C7CC27F3DA9B784907F637518E1C7E0978E57BFE5D1511A3B6A4269235FC2D9EAA550182A5F2B59415A442CE59555B9B9A0A79AB4030C9F701",
    "ctid": "C00D458B00020002",
    "date": 815494581,
    "ledger_index": 869771
  },
  "validated": true
}

Final balances after batch transaction:
Sender: raNwujquxJ7QTLhfbkKN6sZa7RBPHV671e, Balance: 92.999996 XRP
Wallet1: r4JMmKToZRMVT3mGWPnKHFEHsSMQEWigLC, Balance: 102 XRP
Wallet2: rKfPgHASYuttoF1HfU56V31WbJvZn3w8xn, Balance: 105 XRP

Transaction URL:
https://devnet.xrpl.org/transactions/A93D3C2BDB5D600E592B64B84E66D789237D029267129EBC659EE483E532DD95
```

## Multi-Account Batch Transaction

```sh
npm install xrpl
node multiAccountBatch.js
```

The script should output the following:

```sh
Funding new wallets from faucet...
Alice: rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa, Balance: 100 XRP
Bob: rKPUDuS2jQNpAMhkNncqC9rKJDpL2gXDN7, Balance: 100 XRP
Charlie: rnz3Da7phfR6tgTZoPYF5psYTiHTshTB8K, Balance: 100 XRP
Third-party wallet: rU8LsCmVjSdf7hSmiGBtBDtt2WhHxp7Zpc, Balance: 100 XRP

Creating batch transaction:
{
  "TransactionType": "Batch",
  "Account": "rU8LsCmVjSdf7hSmiGBtBDtt2WhHxp7Zpc",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rnz3Da7phfR6tgTZoPYF5psYTiHTshTB8K",
        "Destination": "rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rKPUDuS2jQNpAMhkNncqC9rKJDpL2gXDN7",
        "Destination": "rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    }
  ]
}

Submitting batch transaction...

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2025-11-03T14:15:00Z",
  "ctid": "C00D457000000002",
  "hash": "8CBCCD88B8ABC248797B84ABB92066961C1CB5FE75ACE2115ADCA6B74C85993A",
  "ledger_hash": "2217A0DBB38B870187B412533B939724095359A050B21E071A2A114BF57CFB60",
  "ledger_index": 869744,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rU8LsCmVjSdf7hSmiGBtBDtt2WhHxp7Zpc",
            "Balance": "99999994",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 869743
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "1E9BA043B9C6518582D0FF73A08DCD8B6958195735086CF7295E5EB6433FB453",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 869742
          },
          "PreviousTxnID": "F7019BC55D80438FDDB01C2549CCC3F7DAF9791F8645E0269D63979EAEC5BBA6",
          "PreviousTxnLgrSeq": 869742
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rU8LsCmVjSdf7hSmiGBtBDtt2WhHxp7Zpc",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rnz3Da7phfR6tgTZoPYF5psYTiHTshTB8K",
          "SigningPubKey": "EDC566D7DA8186BBD30DDAE1FB770FCE7F248949194E1A2E70B18CFA060B140B59",
          "TxnSignature": "31639BFA1359DD24345776EAEEACCF61C1CDC792988679263D113E80A22D837E20ACD2B25E482FCA769990C004D747836370C6BAD14524559639BBEBA5813002"
        }
      },
      {
        "BatchSigner": {
          "Account": "rKPUDuS2jQNpAMhkNncqC9rKJDpL2gXDN7",
          "SigningPubKey": "EDEF1966B325000407940E4C0792E3CCC3E27F51D132BDC53DCC2B1998E7C32A34",
          "TxnSignature": "6BF9860B0E2E134FB302329D711BAA7B6314395D39523982DBBC037E84FB17AB5E8E736DB3DB0019B4477686AF2D91E5D2B49409698A95219376B2E318D3E501"
        }
      }
    ],
    "Fee": "6",
    "Flags": 65536,
    "LastLedgerSequence": 869762,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rnz3Da7phfR6tgTZoPYF5psYTiHTshTB8K",
          "Amount": "50000000",
          "Destination": "rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 869740,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rKPUDuS2jQNpAMhkNncqC9rKJDpL2gXDN7",
          "Amount": "50000000",
          "Destination": "rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 869738,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 869742,
    "SigningPubKey": "ED2B56D6FB4E8C236A6B07E8D8AD9A4938606144E31779918F99525CA6B3C56664",
    "TransactionType": "Batch",
    "TxnSignature": "9C51C1F2CB0E8BCEA1FADD3992249DE72AC46FC86AB2FB023A597FBD5C4CCB3337967E9AAFFB5F1C0CBC91128F3FD194F78F207E461BE1FF906C496B94EC410E",
    "ctid": "C00D457000000002",
    "date": 815494500,
    "ledger_index": 869744
  },
  "validated": true
}

Final balances after batch transaction:
Alice: rfCBfRGpcGJLwdbfz1M6HYoAL8nZyHRHHa, Balance: 200 XRP
Bob: rKPUDuS2jQNpAMhkNncqC9rKJDpL2gXDN7, Balance: 50 XRP
Charlie: rnz3Da7phfR6tgTZoPYF5psYTiHTshTB8K, Balance: 50 XRP
Third-party wallet: rU8LsCmVjSdf7hSmiGBtBDtt2WhHxp7Zpc, Balance: 99.999994 XRP

Transaction URL:
https://devnet.xrpl.org/transactions/8CBCCD88B8ABC248797B84ABB92066961C1CB5FE75ACE2115ADCA6B74C85993A
```
