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
=== Funding new wallets from faucet... ===
Sender: r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya, Balance: 100 XRP
Wallet1: rw744uE8PveVqU2KGyFkUNW4qGYxeK2QZM, Balance: 100 XRP
Wallet2: rhcxDdw7VFEPEFkWrZ3G6NSEKhWUXoaQNJ, Balance: 100 XRP

=== Creating batch transaction ===
{
  "TransactionType": "Batch",
  "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
        "Destination": "rw744uE8PveVqU2KGyFkUNW4qGYxeK2QZM",
        "Amount": "2000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
        "Destination": "rhcxDdw7VFEPEFkWrZ3G6NSEKhWUXoaQNJ",
        "Amount": "5000000",
        "Flags": 1073741824
      }
    }
  ]
}

=== Submitting batch transaction ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2025-11-14T17:46:50Z",
  "ctid": "C01205F300000002",
  "hash": "723254589441AA19ACE9B07FFEA161EDCD6DD58DFDF230FAECE1477CF71117C5",
  "ledger_hash": "24B4EDFC1A0B3F951A536950BA397A8EF49212C882A9268B878885EA8A285EE5",
  "ledger_index": 1181171,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
            "Balance": "99999996",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1181168
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "C9C50B88095FBD2D78D0D2693F1C38738AD108D3EE6AB5491547A5FCFE62A236",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 1181167
          },
          "PreviousTxnID": "C5FFDF7016A8102250F4F8CB12F964573A95FA7CC1706C072A4F244F1A81C3B3",
          "PreviousTxnLgrSeq": 1181167
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
    "Fee": "4",
    "Flags": 65536,
    "LastLedgerSequence": 1181189,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
          "Amount": "2000000",
          "Destination": "rw744uE8PveVqU2KGyFkUNW4qGYxeK2QZM",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1181168,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya",
          "Amount": "5000000",
          "Destination": "rhcxDdw7VFEPEFkWrZ3G6NSEKhWUXoaQNJ",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1181169,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 1181167,
    "SigningPubKey": "EDB16F0756C88AA0E541EFBB602B7992E6BA13CFB3E1BD3D699D4DB91BAD9043D0",
    "TransactionType": "Batch",
    "TxnSignature": "C141A9C5253C940D9B85847FF1F8BF1AB9D0B63707DD8BD06204BD58AC64F8019BC52F9D8D2B1B7D889CBF081211D0A4DCAFFC87D716D795B4FCE38F23F91008",
    "ctid": "C01205F300000002",
    "date": 816457610,
    "ledger_index": 1181171
  },
  "validated": true
}

=== Verifying Inner Transactions ===

Transaction 1 Hash: 4CFD3BB085E09C70D22F6199CAEB4281C3D1DF0824E2AACA2E4463A2799F7FE7
 - Status: tesSUCCESS (Ledger 1181171)
 - Transaction URL: https://devnet.xrpl.org/transactions/4CFD3BB085E09C70D22F6199CAEB4281C3D1DF0824E2AACA2E4463A2799F7FE7

Transaction 2 Hash: 9B794797A80013977FCFCF44389807E08F1B2B2957E2F8EBE9D5F0F4209F7285
 - Status: tesSUCCESS (Ledger 1181171)
 - Transaction URL: https://devnet.xrpl.org/transactions/9B794797A80013977FCFCF44389807E08F1B2B2957E2F8EBE9D5F0F4209F7285

=== Final Balances ===
Sender: r3y1GdzaPVcaLUaTKvq1iqNzT9EjKLvnya, Balance: 92.999996 XRP
Wallet1: rw744uE8PveVqU2KGyFkUNW4qGYxeK2QZM, Balance: 102 XRP
Wallet2: rhcxDdw7VFEPEFkWrZ3G6NSEKhWUXoaQNJ, Balance: 105 XRP

Batch Transaction URL:
https://devnet.xrpl.org/transactions/723254589441AA19ACE9B07FFEA161EDCD6DD58DFDF230FAECE1477CF71117C5
```

## Multi-Account Batch Transaction

```sh
npm install xrpl
node multiAccountBatch.js
```

The script should output the following:

```sh
=== Funding new wallets from faucet... ===
Alice: r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU, Balance: 100 XRP
Bob: rLegReLGMVh3b8acEu6NJ16GFYVSrq7DFt, Balance: 100 XRP
Charlie: rEMtU7B5e7Q347HSWwaMiqTk2mJytBTMRT, Balance: 100 XRP
Third-party wallet: rKeZvnQ6pusBV6u1TREqJESgQR2mfpb4G2, Balance: 100 XRP

=== Creating batch transaction ===
{
  "TransactionType": "Batch",
  "Account": "rKeZvnQ6pusBV6u1TREqJESgQR2mfpb4G2",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rEMtU7B5e7Q347HSWwaMiqTk2mJytBTMRT",
        "Destination": "r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rLegReLGMVh3b8acEu6NJ16GFYVSrq7DFt",
        "Destination": "r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    }
  ]
}

=== Submitting batch transaction ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2025-11-14T17:47:52Z",
  "ctid": "C012060900000002",
  "hash": "C6EF3F55749ED51BCF33D657BCB37B8221B317E9ED9D55CA1CF9454BD54D697E",
  "ledger_hash": "19F9DB9DF2F3978C11B5853BAAF463E370C319E3F8DEFA19A0A7EED832CC5ACE",
  "ledger_index": 1181193,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rKeZvnQ6pusBV6u1TREqJESgQR2mfpb4G2",
            "Balance": "99999994",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1181193
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "94CD9B687558DF03CC9110EC1A7CACADAEFC76AEA6C31FA784D00F979864D5AE",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 1181192
          },
          "PreviousTxnID": "5331D0494C42726FDF52F8F0C34A9BBE0BCAF6ABD45AF2A76CB00CF8B2B3A761",
          "PreviousTxnLgrSeq": 1181192
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rKeZvnQ6pusBV6u1TREqJESgQR2mfpb4G2",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rEMtU7B5e7Q347HSWwaMiqTk2mJytBTMRT",
          "SigningPubKey": "EDA4DB81B1ABAF32E608731E3D0A867D8DA47C6500E6F1C7AB0E51FE93F619FFE3",
          "TxnSignature": "D84E96B16D51EB2E5959F55F046167013F625C33CEC99D19FEF934D02F0F8FC1906FAAE7413652A25B5724935E94B30B9F5C114E0AC77B8D8E61DAEDA96F6405"
        }
      },
      {
        "BatchSigner": {
          "Account": "rLegReLGMVh3b8acEu6NJ16GFYVSrq7DFt",
          "SigningPubKey": "ED9D4F21B59366032AE70C8FBA9BB58852A3455326E52F2A5CAFA4F045FA9AE3AB",
          "TxnSignature": "EBA9C89F9A7F2DC7B4E0F41351C50AEA500D203075F6D7662DA1605229F30A99080409A482F96DC1851A5A3E82895395509E640B6959798DB97445FEFB959009"
        }
      }
    ],
    "Fee": "6",
    "Flags": 65536,
    "LastLedgerSequence": 1181212,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rEMtU7B5e7Q347HSWwaMiqTk2mJytBTMRT",
          "Amount": "50000000",
          "Destination": "r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1181191,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rLegReLGMVh3b8acEu6NJ16GFYVSrq7DFt",
          "Amount": "50000000",
          "Destination": "r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1181190,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 1181192,
    "SigningPubKey": "ED447F3C2BFE7653F74FC02E4B6BF5CD42FFBA139B372A59D555957C8C2DB93DCD",
    "TransactionType": "Batch",
    "TxnSignature": "5FA929144AF5092CA033ED9938F7D01D177DE7D0DB3D1440138125610ED43533E72A00FF0D826899D2DE39CE901B6C9EF7D5322DF4D5C2415D5728E60AE97D0E",
    "ctid": "C012060900000002",
    "date": 816457672,
    "ledger_index": 1181193
  },
  "validated": true
}

=== Verifying Inner Transactions ===

Transaction 1 Hash: 3E375463F8CCA03E9C4533DC91ED9F17D30E2968DB7D46053011DBB7F79E26DD
 - Status: tesSUCCESS (Ledger 1181193)
 - Transaction URL: https://devnet.xrpl.org/transactions/3E375463F8CCA03E9C4533DC91ED9F17D30E2968DB7D46053011DBB7F79E26DD

Transaction 2 Hash: BCBBC9B3A5912B496AB2BFF25DD45C634946832307BA284A53D6EBA81E68B8B4
 - Status: tesSUCCESS (Ledger 1181193)
 - Transaction URL: https://devnet.xrpl.org/transactions/BCBBC9B3A5912B496AB2BFF25DD45C634946832307BA284A53D6EBA81E68B8B4

=== Final Balances ===
Alice: r9quQTwuBWQC1SDjPA3CzXi3V6vcKdUUkU, Balance: 200 XRP
Bob: rLegReLGMVh3b8acEu6NJ16GFYVSrq7DFt, Balance: 50 XRP
Charlie: rEMtU7B5e7Q347HSWwaMiqTk2mJytBTMRT, Balance: 50 XRP
Third-party wallet: rKeZvnQ6pusBV6u1TREqJESgQR2mfpb4G2, Balance: 99.999994 XRP

Batch Transaction URL:
https://devnet.xrpl.org/transactions/C6EF3F55749ED51BCF33D657BCB37B8221B317E9ED9D55CA1CF9454BD54D697E
```
