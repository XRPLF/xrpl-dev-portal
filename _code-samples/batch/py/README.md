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
Sender: r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5, Balance: 100.000000 XRP
Wallet1: r9twwRbty79Wr8cQeTofTX4q1FWr6zDGJC, Balance: 100.000000 XRP
Wallet2: rPZNoWLgPDgehaYkh1n4oVot6RMnL1oHEv, Balance: 100.000000 XRP

=== Creating Batch transaction... ===
{
  "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
  "TransactionType": "Batch",
  "Flags": 65536,
  "SigningPubKey": "",
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "2000000",
        "Destination": "r9twwRbty79Wr8cQeTofTX4q1FWr6zDGJC"
      }
    },
    {
      "RawTransaction": {
        "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "5000000",
        "Destination": "rPZNoWLgPDgehaYkh1n4oVot6RMnL1oHEv"
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-10-29T16:22:21Z",
  "ctid": "C0636D8B00000002",
  "hash": "949804D59288E7F77FB022010B5A89D84E6B9BF32ACAC9C0833A8C3D1149D13D",
  "ledger_hash": "98EC0CC1C56C922FF08C57DE6FFF4DE9C664AF270D793BFE9A5535290A88A79D",
  "ledger_index": 6516107,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
            "Balance": "99999996",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6516099
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "507B68A2943CAEACE3B8B67040EA974C3F09F7E06177A02A740A0F719BE779C6",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6516098
          },
          "PreviousTxnID": "30F149F4EF2F4AA6D13552A9AB95F89143B2BFB8090F044FC6E718592E288EB7",
          "PreviousTxnLgrSeq": 6516098
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
    "Fee": "4",
    "Flags": 65536,
    "LastLedgerSequence": 6516125,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
          "Amount": "2000000",
          "Destination": "r9twwRbty79Wr8cQeTofTX4q1FWr6zDGJC",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516099,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5",
          "Amount": "5000000",
          "Destination": "rPZNoWLgPDgehaYkh1n4oVot6RMnL1oHEv",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6516100,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6516098,
    "SigningPubKey": "ED8B9F38EF13E616C3837671A8C3FAB6F2F893B4107919BFBC47A5F02627492A2A",
    "TransactionType": "Batch",
    "TxnSignature": "97DCC65E922CA72AE1670AD38085362977A9DF150C9D7B32A060B45A31AC56B3EB72F9E98D195D632E7A7ED1F02D2288E804E71CA3DA457F2E843265E8999D0F",
    "ctid": "C0636D8B00000002",
    "date": 846606141,
    "ledger_index": 6516107
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/949804D59288E7F77FB022010B5A89D84E6B9BF32ACAC9C0833A8C3D1149D13D

=== Verifying inner transactions... ===

Transaction 1 hash: 863D3BAFBDCC881E59C2EDADF51D71DDF3CCF85037154BE9D313752A8E75290C
 - Status: tesSUCCESS (Ledger 6516107)
 - Transaction URL: https://devnet.xrpl.org/transactions/863D3BAFBDCC881E59C2EDADF51D71DDF3CCF85037154BE9D313752A8E75290C

Transaction 2 hash: 36AAB2F2F3F38B28AF4871E173E39CFDFB432D1E759F10701E1F7172E9CBAA84
 - Status: tesSUCCESS (Ledger 6516107)
 - Transaction URL: https://devnet.xrpl.org/transactions/36AAB2F2F3F38B28AF4871E173E39CFDFB432D1E759F10701E1F7172E9CBAA84

=== Final balances ===
Sender: r9cqayZ3LYm2bC3ybPY4tYcB3ZvytPvYR5, Balance: 92.999996 XRP
Wallet1: r9twwRbty79Wr8cQeTofTX4q1FWr6zDGJC, Balance: 102.000000 XRP
Wallet2: rPZNoWLgPDgehaYkh1n4oVot6RMnL1oHEv, Balance: 105.000000 XRP
```

---

## Send a Multi-Account Batch Transaction

```sh
python3 send_multi_account_batch.py
```

The script should output the Batch transaction, the validated transaction result including the `BatchSigners`, the status of each inner transaction, and the final account balances.

```sh
=== Funding new wallets from faucet... ===
Alice: rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht, Balance: 100.000000 XRP
Bob: rpQ8JTAkd2XorYr1kdxTuLvu8F4cvoCwnV, Balance: 100.000000 XRP
Charlie: rnqn7Afm478LVAKjM2CaAkmXQUba4h7K1W, Balance: 100.000000 XRP
Third-party wallet: rUeiswFheFjNfHHbpJbKrkYrhL4mfSuAFs, Balance: 100.000000 XRP

=== Creating Batch transaction... ===
{
  "Account": "rUeiswFheFjNfHHbpJbKrkYrhL4mfSuAFs",
  "TransactionType": "Batch",
  "Flags": 65536,
  "SigningPubKey": "",
  "RawTransactions": [
    {
      "RawTransaction": {
        "Account": "rnqn7Afm478LVAKjM2CaAkmXQUba4h7K1W",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "50000000",
        "Destination": "rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht"
      }
    },
    {
      "RawTransaction": {
        "Account": "rpQ8JTAkd2XorYr1kdxTuLvu8F4cvoCwnV",
        "TransactionType": "Payment",
        "Flags": 1073741824,
        "SigningPubKey": "",
        "Amount": "50000000",
        "Destination": "rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht"
      }
    }
  ]
}

=== Submitting Batch transaction... ===

Batch transaction submitted successfully!
Result:
 {
  "close_time_iso": "2026-10-29T15:30:20Z",
  "ctid": "C063699800000002",
  "hash": "409E5F7EE2E3887102E68F0263061F9F4FE9CF811D9C4A4DF193A143C3CD01D7",
  "ledger_hash": "9B9D9C66E77857D78E4A3FF6AA44799825D55FA1DD376BAB2AAFE695C8FB466F",
  "ledger_index": 6515096,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rUeiswFheFjNfHHbpJbKrkYrhL4mfSuAFs",
            "Balance": "99999994",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 6515091
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "711A144230F8298FC7D4013AC2FC4E7356ABC4D87176D7633023B140B4D981B3",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 6515090
          },
          "PreviousTxnID": "E827CC7B8AB4BC6684E8D0D8C88AF5A0AAE798B2A7459CFBE923C2DA245AE01B",
          "PreviousTxnLgrSeq": 6515090
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rUeiswFheFjNfHHbpJbKrkYrhL4mfSuAFs",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rpQ8JTAkd2XorYr1kdxTuLvu8F4cvoCwnV",
          "SigningPubKey": "EDEF19592E5F77617026F0F7522CFCAA465346F20804DAAEFDACDEE74DA29F1ED2",
          "TxnSignature": "84E330A7ACAF4BB15409B8907A614190D04DF15B844D4A599852F4FA313D2E3BF66C766671CDF7AB8BDD07941E19F413E9335D55EB84E4AEA2E845EAF3DABB0B"
        }
      },
      {
        "BatchSigner": {
          "Account": "rnqn7Afm478LVAKjM2CaAkmXQUba4h7K1W",
          "SigningPubKey": "EDD788A587B6E68046FF348D9B2D562840142F914D161700ACF9DF493BB502DA37",
          "TxnSignature": "C2494B52C0F13CBADF010A4CFF53C451B83ABD24CC9C32081C398D6676B9AA15E4CA8CE8DF1F5D00C56A2D374A9EB9F2492D87457D0B01B3129BF6A4571B9306"
        }
      }
    ],
    "Fee": "6",
    "Flags": 65536,
    "LastLedgerSequence": 6515113,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rnqn7Afm478LVAKjM2CaAkmXQUba4h7K1W",
          "Amount": "50000000",
          "Destination": "rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6515088,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rpQ8JTAkd2XorYr1kdxTuLvu8F4cvoCwnV",
          "Amount": "50000000",
          "Destination": "rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 6515085,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 6515090,
    "SigningPubKey": "ED29D3D23EBEBD4B13912E40B094CEE1D15B04179EDAA368C104BCC97E3AB24D49",
    "TransactionType": "Batch",
    "TxnSignature": "18902EB7E475044FD6585BC6270B6A72BF5FECB276D53FB1235BB2840C860C1CD3D0DF36204EC44E5D442391505D8D0A5AC59117416D0A47DF2CF10EB9971809",
    "ctid": "C063699800000002",
    "date": 846603020,
    "ledger_index": 6515096
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/409E5F7EE2E3887102E68F0263061F9F4FE9CF811D9C4A4DF193A143C3CD01D7

=== Verifying inner transactions ===

Transaction 1 hash: D5DE2DF7FC9B90CCDB6E54F20183DF88F1199462CB77651464E50217EBCAA387
 - Status: tesSUCCESS (Ledger 6515096)
 - Transaction URL: https://devnet.xrpl.org/transactions/D5DE2DF7FC9B90CCDB6E54F20183DF88F1199462CB77651464E50217EBCAA387

Transaction 2 hash: A51E2DAE7EC54B02BEBA7ED716A5C511AA53B0C0B24267FBA85FD0AA35519ABC
 - Status: tesSUCCESS (Ledger 6515096)
 - Transaction URL: https://devnet.xrpl.org/transactions/A51E2DAE7EC54B02BEBA7ED716A5C511AA53B0C0B24267FBA85FD0AA35519ABC

=== Final balances ===
Alice: rPHpiWvpiHu3W5Lj4NXskztk3GmVLBaQht, Balance: 200.000000 XRP
Bob: rpQ8JTAkd2XorYr1kdxTuLvu8F4cvoCwnV, Balance: 50.000000 XRP
Charlie: rnqn7Afm478LVAKjM2CaAkmXQUba4h7K1W, Balance: 50.000000 XRP
Third-party wallet: rUeiswFheFjNfHHbpJbKrkYrhL4mfSuAFs, Balance: 99.999994 XRP
```
