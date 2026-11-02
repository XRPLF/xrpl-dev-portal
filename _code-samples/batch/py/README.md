# Batch Transactions (Python)

This directory contains Python examples demonstrating how to send a single-account [Batch transaction](https://xrpl.org/docs/concepts/transactions/batch-transactions) and a multi-account Batch transaction.

## Setup

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Send a Single Account Batch Transaction

```sh
python3 send_single_account_batch.py
```

The script should output the Batch transaction, the validated transaction result, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Sender: rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz, Balance: 100.000000 XRP
Wallet1: rst7BrcMjAKo5ergeJWmYnvzPWSASGGsnH, Balance: 100.000000 XRP
Wallet2: rnQ9uxy6nACSpSjPZTbgaLSJAxpTqnHCkH, Balance: 100.000000 XRP

=== Creating Batch transaction... ===
{
  "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
  "TransactionType": "Batch",
  "Flags": 65536,
  "SigningPubKey": "",
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "2000000",
        "Destination": "rst7BrcMjAKo5ergeJWmYnvzPWSASGGsnH"
      }
    },
    {
      "RawTransaction": {
        "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "5000000",
        "Destination": "rnQ9uxy6nACSpSjPZTbgaLSJAxpTqnHCkH"
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-11-02T17:21:30Z",
  "ctid": "C14FF34500000001",
  "hash": "D98CCE177FEA9B8DDC9219FC34D1207B0699C889253A943BD8021CEF86BD4493",
  "ledger_hash": "B5479F9EDC237466DC8794B97E3FC0594483B92F890008DB36529C44300E7362",
  "ledger_index": 22016837,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
            "Balance": "99999960",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016827
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "F5F3D24915DBD09011025C563A4565CFDCF9E839FCDC6E6AA7258A46F85C82ED",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016826
          },
          "PreviousTxnID": "FFECB3742B26BFA65ED5EC663DE0863F81FB6571F1E2208B3BAA55CFC9FD02A4",
          "PreviousTxnLgrSeq": 22016826
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
    "Fee": "40",
    "Flags": 65536,
    "LastLedgerSequence": 22016855,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
          "Amount": "2000000",
          "Destination": "rst7BrcMjAKo5ergeJWmYnvzPWSASGGsnH",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016827,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz",
          "Amount": "5000000",
          "Destination": "rnQ9uxy6nACSpSjPZTbgaLSJAxpTqnHCkH",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016828,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016826,
    "SigningPubKey": "ED6609C4702ABD2AE00A9B3891E1775932AA033FD49D9588E689D7D1D86BCAE08A",
    "TransactionType": "Batch",
    "TxnSignature": "0C17CE04DD60D0DA855CE59EF86A60239D7D645AB815B3AFBDEBADEFC6B47AFEBA6E2B41AF7EBB01E3E09F9E6492E3D6875171E1A5863E0A78E30B042D39890E",
    "ctid": "C14FF34500000001",
    "date": 846955290,
    "ledger_index": 22016837
  },
  "validated": true
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/D98CCE177FEA9B8DDC9219FC34D1207B0699C889253A943BD8021CEF86BD4493

=== Verifying inner transactions... ===

Transaction 1 hash: 41DED0FF2E64B59DF985BF1D6AF61D70DD91664BFBD1976E9F497E44E58A0712
 - Status: tesSUCCESS (Ledger 22016837)
 - Transaction URL: https://testnet.xrpl.org/transactions/41DED0FF2E64B59DF985BF1D6AF61D70DD91664BFBD1976E9F497E44E58A0712

Transaction 2 hash: 48DEF46F5BE41F2866CBAC0ADA1E5BA69EDE80E28DD233A19EC8A93B71DE648E
 - Status: tesSUCCESS (Ledger 22016837)
 - Transaction URL: https://testnet.xrpl.org/transactions/48DEF46F5BE41F2866CBAC0ADA1E5BA69EDE80E28DD233A19EC8A93B71DE648E

=== Final balances ===
Sender: rKnrHCn647LEG48MGPAVBmvVCiFzMfJXQz, Balance: 92.999960 XRP
Wallet1: rst7BrcMjAKo5ergeJWmYnvzPWSASGGsnH, Balance: 102.000000 XRP
Wallet2: rnQ9uxy6nACSpSjPZTbgaLSJAxpTqnHCkH, Balance: 105.000000 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
python3 send_multi_account_batch.py
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv, Balance: 100.000000 XRP
Bob: r9U7JZATg2XNSMVDdS2yD2cBqBKrvhB4Hb, Balance: 100.000000 XRP
Charlie: rhfSmRdmdj5d96BCnu7fBYXd5mpjETAAme, Balance: 100.000000 XRP
Third-party wallet: rw5g1ovQuuK6umkWfp8SJkBt7atCNvA54k, Balance: 100.000000 XRP

=== Creating Batch transaction... ===
{
  "Account": "rw5g1ovQuuK6umkWfp8SJkBt7atCNvA54k",
  "TransactionType": "Batch",
  "Flags": 65536,
  "SigningPubKey": "",
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rhfSmRdmdj5d96BCnu7fBYXd5mpjETAAme",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "50000000",
        "Destination": "rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv"
      }
    },
    {
      "RawTransaction": {
        "Account": "r9U7JZATg2XNSMVDdS2yD2cBqBKrvhB4Hb",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "50000000",
        "Destination": "rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv"
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-11-02T17:22:32Z",
  "ctid": "C14FF35800110001",
  "hash": "81E383920091918C2D64D7831FE3F3221231A2DF69FA1C8D145B8B97A3F8DCB0",
  "ledger_hash": "4C0AE628BE03F78B71C1A878666412DB140F27E9BC85984B633125721AD016BE",
  "ledger_index": 22016856,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rw5g1ovQuuK6umkWfp8SJkBt7atCNvA54k",
            "Balance": "99999940",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 22016851
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "DBB32F0764830A4BC040537720639C20BC4EFBAA5B467711A09A1ADEE25F3AD5",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 22016850
          },
          "PreviousTxnID": "1CA9DE4DFAAA0DD2BCEB9B722693B90C2642B8E9E4267B55998F2D418CE5984B",
          "PreviousTxnLgrSeq": 22016850
        }
      }
    ],
    "TransactionIndex": 17,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rw5g1ovQuuK6umkWfp8SJkBt7atCNvA54k",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rhfSmRdmdj5d96BCnu7fBYXd5mpjETAAme",
          "SigningPubKey": "ED2A9A26E0B9DC250EA6D5823DBC64E40E32C5F76F0ED83E3ABCCDE47E3A13E9BF",
          "TxnSignature": "02004D3A8495C63945C50BF7269861C45A069FEE2E41ABDDC2E113AD231417E9AD4315257B3EA60FBD2C973037E0BF1397C3180DCEC1451D136CC52081288500"
        }
      },
      {
        "BatchSigner": {
          "Account": "r9U7JZATg2XNSMVDdS2yD2cBqBKrvhB4Hb",
          "SigningPubKey": "ED0F75C3F6EBB37644E1A6B995854A186042990760D9F1841EE0A1C37A2BA1D312",
          "TxnSignature": "8358551D9A32E1DC14168F0FA924A9EBB49EAADF32CEBC0A8E631219B488A74CD6C85A6586A79C9812CA7F4BC71C85EDAE15BDB5C217986FB4D752BF67BA9301"
        }
      }
    ],
    "Fee": "60",
    "Flags": 65536,
    "LastLedgerSequence": 22016873,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rhfSmRdmdj5d96BCnu7fBYXd5mpjETAAme",
          "Amount": "50000000",
          "Destination": "rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016847,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "r9U7JZATg2XNSMVDdS2yD2cBqBKrvhB4Hb",
          "Amount": "50000000",
          "Destination": "rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 22016844,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 22016850,
    "SigningPubKey": "EDA993F64554A0A7754AFFC749D877337037D6E26EFEC688BAE09EF75DF0A7DC91",
    "TransactionType": "Batch",
    "TxnSignature": "083C6906236D1E4DAA37CF118F0751B68AF888095299FA1A8A81BE0F2830686CBED9EEDB6C046FA9EE7B5E9CD2ED73F4E98A55C089D2A8329891B09FBE3EF008",
    "ctid": "C14FF35800110001",
    "date": 846955352,
    "ledger_index": 22016856
  },
  "validated": true
}

Batch transaction URL:
https://testnet.xrpl.org/transactions/81E383920091918C2D64D7831FE3F3221231A2DF69FA1C8D145B8B97A3F8DCB0

=== Verifying inner transactions ===

Transaction 1 hash: 6D10D27EA51A2BDB94E0D9A3D8AA45219AF5483F4680CE0C534DCEB0C6E326B1
 - Status: tesSUCCESS (Ledger 22016856)
 - Transaction URL: https://testnet.xrpl.org/transactions/6D10D27EA51A2BDB94E0D9A3D8AA45219AF5483F4680CE0C534DCEB0C6E326B1

Transaction 2 hash: E3AAD8CD217DE77E6CC1E4527EF7EFCD7585B781DFFDB5F810E5F0547C212482
 - Status: tesSUCCESS (Ledger 22016856)
 - Transaction URL: https://testnet.xrpl.org/transactions/E3AAD8CD217DE77E6CC1E4527EF7EFCD7585B781DFFDB5F810E5F0547C212482

=== Final balances ===
Alice: rhPJnubH2T3pXQgj2sqP8VzWK2Gc16cRVv, Balance: 200.000000 XRP
Bob: r9U7JZATg2XNSMVDdS2yD2cBqBKrvhB4Hb, Balance: 50.000000 XRP
Charlie: rhfSmRdmdj5d96BCnu7fBYXd5mpjETAAme, Balance: 50.000000 XRP
Third-party wallet: rw5g1ovQuuK6umkWfp8SJkBt7atCNvA54k, Balance: 99.999940 XRP
```
