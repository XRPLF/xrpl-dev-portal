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
Sender: rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim, Balance: 100 XRP
Wallet1: rGx6SACvYEvX8SRrvTPD91UhBmJ16pxL94, Balance: 100 XRP
Wallet2: r3qetgSfAtyCpGc4rvKNz4LX3F3urMSJJy, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
        "Destination": "rGx6SACvYEvX8SRrvTPD91UhBmJ16pxL94",
        "Amount": "2000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
        "Destination": "r3qetgSfAtyCpGc4rvKNz4LX3F3urMSJJy",
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
  "close_time_iso": "2025-11-17T12:04:50Z",
  "ctid": "C013313800030002",
  "hash": "AE118213B0A183528418ABC5F14E3BFD6524020C5DB1C060157A0D3FDE15B900",
  "ledger_hash": "621183809B68A794371C5EC6522105FF04E502C48EBDC8171B80224991E33394",
  "ledger_index": 1257784,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
            "Balance": "99999996",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1257779
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "42CC98AF0A28EDDDC7E359B5622CC5748BDE2A93E124AF5C32647ECA8F68D480",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 1257778
          },
          "PreviousTxnID": "081C42DAE12001735AC4E9A7F027636DF612DB17B4BFA2333F4DB8EA0C9D1E9F",
          "PreviousTxnLgrSeq": 1257778
        }
      }
    ],
    "TransactionIndex": 3,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
    "Fee": "4",
    "Flags": 65536,
    "LastLedgerSequence": 1257802,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
          "Amount": "2000000",
          "Destination": "rGx6SACvYEvX8SRrvTPD91UhBmJ16pxL94",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1257779,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim",
          "Amount": "5000000",
          "Destination": "r3qetgSfAtyCpGc4rvKNz4LX3F3urMSJJy",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1257780,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 1257778,
    "SigningPubKey": "ED7031CA5BA4EC745610AB495F5053F318C119E87567BE485A494773AD8ED4FBCE",
    "TransactionType": "Batch",
    "TxnSignature": "0610A277086943BC462C1A5F85BEB667B62B4BDA59525138B6014101C08297897A73D3D2D247CB37A06E1EA36267C53A51C0FDF32F3D8E974029BEDC41105B07",
    "ctid": "C013313800030002",
    "date": 816696290,
    "ledger_index": 1257784
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/AE118213B0A183528418ABC5F14E3BFD6524020C5DB1C060157A0D3FDE15B900

=== Verifying inner transactions... ===

Transaction 1 hash: D18EA54D5653BBB5C87F116978822EAB7A26EDFB1D6C41910F36D7484D4890E3
 - Status: tesSUCCESS (Ledger 1257784)
 - Transaction URL: https://devnet.xrpl.org/transactions/D18EA54D5653BBB5C87F116978822EAB7A26EDFB1D6C41910F36D7484D4890E3

Transaction 2 hash: 5660DB400F08EE5543C54D4D65824A2142F9D5AC17294A4ABF654260F129B44E
 - Status: tesSUCCESS (Ledger 1257784)
 - Transaction URL: https://devnet.xrpl.org/transactions/5660DB400F08EE5543C54D4D65824A2142F9D5AC17294A4ABF654260F129B44E

=== Final balances ===
Sender: rP9EsVosrmx2HyrmLgWJpJacX5ZrVVQsim, Balance: 92.999996 XRP
Wallet1: rGx6SACvYEvX8SRrvTPD91UhBmJ16pxL94, Balance: 102 XRP
Wallet2: r3qetgSfAtyCpGc4rvKNz4LX3F3urMSJJy, Balance: 105 XRP
```

## Multi-Account Batch Transaction

```sh
npm install xrpl
node multiAccountBatch.js
```

The script should output the following:

```sh
=== Funding new wallets from faucet... ===
Alice: rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG, Balance: 100 XRP
Bob: r3ruQ92bqXwWxcR2w4cC1tW35og9h3UbBq, Balance: 100 XRP
Charlie: rsi5D9bkczpbGykPxoGNBVVmFFFXGwm3QA, Balance: 100 XRP
Third-party wallet: rfUpGXTzU3siTr4UovV6Wt86Vw3gQU4ttA, Balance: 100 XRP

=== Creating Batch transaction... ===
{
  "TransactionType": "Batch",
  "Account": "rfUpGXTzU3siTr4UovV6Wt86Vw3gQU4ttA",
  "Flags": 65536,
  "RawTransactions": [
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "rsi5D9bkczpbGykPxoGNBVVmFFFXGwm3QA",
        "Destination": "rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG",
        "Amount": "50000000",
        "Flags": 1073741824
      }
    },
    {
      "RawTransaction": {
        "TransactionType": "Payment",
        "Account": "r3ruQ92bqXwWxcR2w4cC1tW35og9h3UbBq",
        "Destination": "rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG",
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
  "close_time_iso": "2025-11-17T12:08:31Z",
  "ctid": "C013317600000002",
  "hash": "1299D20C6B489DA5C632AE4DBE49475DBF42D9444C7E9C109CC9B8DD0FD55FEC",
  "ledger_hash": "E45ECF69057084CD02BA49A17E4D0C9154D33A98BB3C95A11B2EB9BE18F32C9B",
  "ledger_index": 1257846,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rfUpGXTzU3siTr4UovV6Wt86Vw3gQU4ttA",
            "Balance": "99999994",
            "Flags": 0,
            "OwnerCount": 0,
            "Sequence": 1257845
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "2D9E0A02007241C38A8DF679E7E62AA0B273E8B12A5430B7B9D99300424F0E1F",
          "PreviousFields": {
            "Balance": "100000000",
            "Sequence": 1257844
          },
          "PreviousTxnID": "3153DE8DE922538A6BE54AA8F783CAD4B848A321AFF028D3E6DD0E80C4B9C237",
          "PreviousTxnLgrSeq": 1257844
        }
      }
    ],
    "TransactionIndex": 0,
    "TransactionResult": "tesSUCCESS"
  },
  "tx_json": {
    "Account": "rfUpGXTzU3siTr4UovV6Wt86Vw3gQU4ttA",
    "BatchSigners": [
      {
        "BatchSigner": {
          "Account": "rsi5D9bkczpbGykPxoGNBVVmFFFXGwm3QA",
          "SigningPubKey": "EDEB88C2868BD25BF03DB26050E16579FA6F8F9E3FF3172E0DC3DCBDA5408572EB",
          "TxnSignature": "9508568084596147CFDCFC18A62DC298A78AD1148BA4B0EB99BEE1CD37E5555FE3930810790D5708F9739B0E3F79772012C154CA33C2280BDD5B72473C17A607"
        }
      },
      {
        "BatchSigner": {
          "Account": "r3ruQ92bqXwWxcR2w4cC1tW35og9h3UbBq",
          "SigningPubKey": "ED82F98DA6A3FC3E88D2EE3A5469D92C7070513BEF4DEE75CAB0BDAA81E8AE378D",
          "TxnSignature": "A482C8747F79857530474F1677599766C0BE283CB7E2A05AACF76E61BECCA16DCE3802D2D8244FBF4546A1C0E5EB70691255E3EFD2F8AC80B55357BDAB9ACD05"
        }
      }
    ],
    "Fee": "6",
    "Flags": 65536,
    "LastLedgerSequence": 1257864,
    "RawTransactions": [
      {
        "RawTransaction": {
          "Account": "rsi5D9bkczpbGykPxoGNBVVmFFFXGwm3QA",
          "Amount": "50000000",
          "Destination": "rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1257842,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      },
      {
        "RawTransaction": {
          "Account": "r3ruQ92bqXwWxcR2w4cC1tW35og9h3UbBq",
          "Amount": "50000000",
          "Destination": "rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG",
          "Fee": "0",
          "Flags": 1073741824,
          "Sequence": 1257841,
          "SigningPubKey": "",
          "TransactionType": "Payment"
        }
      }
    ],
    "Sequence": 1257844,
    "SigningPubKey": "ED22A32B61EDF083315515831723BC18F8311F03886BBA375DFF46335BB7A75F0B",
    "TransactionType": "Batch",
    "TxnSignature": "156791D2DBFAEFC9B0AC29F2D8D0CDB25E13F92E70E6D5414FE31BD8573CA23D3F62F8B34FC1F117BD556B25E4F748095A24C4342108AB32F1B2BAFBF1443501",
    "ctid": "C013317600000002",
    "date": 816696511,
    "ledger_index": 1257846
  },
  "validated": true
}

Batch transaction URL:
https://devnet.xrpl.org/transactions/1299D20C6B489DA5C632AE4DBE49475DBF42D9444C7E9C109CC9B8DD0FD55FEC

=== Verifying inner transactions ===

Transaction 1 hash: 0F71979E3F641C980929F926640DCA886C30236ED0CD7C94B6CB36F0D42948AC
 - Status: tesSUCCESS (Ledger 1257846)
 - Transaction URL: https://devnet.xrpl.org/transactions/0F71979E3F641C980929F926640DCA886C30236ED0CD7C94B6CB36F0D42948AC

Transaction 2 hash: BC124CB29334AA1079139A9BE186B69A0AC467797F147754E2406714854D2A50
 - Status: tesSUCCESS (Ledger 1257846)
 - Transaction URL: https://devnet.xrpl.org/transactions/BC124CB29334AA1079139A9BE186B69A0AC467797F147754E2406714854D2A50

=== Final balances ===
Alice: rHpve1GL2ZXUs3NB5iU91BrXBSwb5PbBrG, Balance: 200 XRP
Bob: r3ruQ92bqXwWxcR2w4cC1tW35og9h3UbBq, Balance: 50 XRP
Charlie: rsi5D9bkczpbGykPxoGNBVVmFFFXGwm3QA, Balance: 50 XRP
Third-party wallet: rfUpGXTzU3siTr4UovV6Wt86Vw3gQU4ttA, Balance: 99.999994 XRP
```
