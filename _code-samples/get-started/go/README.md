# Get Started Using Go Library

Connects to the XRP Ledger, gets account information, and subscribes to ledger events using Go. A second command does the same with the JSON-RPC client instead of WebSocket.

To download the source code, see [Get Started Using Go Library](https://xrpl.org/docs/tutorials/get-started/get-started-go).

## Run the Code

**WebSocket**

Quick setup and usage:

```sh
go mod tidy
go run ./get-acct-info
```

You should see output similar to the following:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Wallet: rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb

Getting account info...
{
  "account_data": {
    "index": "E02B88187332A044320B0CE553B2962FF593E00C42A3C2D5D59FBD80A551217B",
    "Flags": 0,
    "LedgerEntryType": "AccountRoot",
    "Account": "rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb",
    "Balance": "100000000",
    "OwnerCount": 0,
    "PreviousTxnID": "538931DECCE783C08991B7BB242A84ED14397FF1DAD40BD9366F97F34FD8144C",
    "PreviousTxnLgrSeq": 22090474,
    "Sequence": 22090474
  },
  "ledger_index": 22090474,
  "validated": true
}

Listening for ledger close events...
Ledger #22090475 validated with 27 transactions!
Ledger #22090476 validated with 28 transactions!

Disconnected
```

**JSON-RPC**

The JSON-RPC client can't subscribe to events, so this version stops after querying the account:

```sh
go run ./get-acct-info-rpc
```

You should see output similar to the following:

```sh
Using Testnet JSON-RPC

Creating a new wallet and funding it with Testnet XRP...
Wallet: rwJWDKpSxuR1QUbofKjisxbbQiCMdhy75E
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rwJWDKpSxuR1QUbofKjisxbbQiCMdhy75E

Getting account info...
{
  "account_data": {
    "index": "64BAB3B146DC0368C50A55F4A7D0D6D16C9D0D9D0E07137C7E006EF34DDD9C7C",
    "Flags": 0,
    "LedgerEntryType": "AccountRoot",
    "Account": "rwJWDKpSxuR1QUbofKjisxbbQiCMdhy75E",
    "Balance": "100000000",
    "OwnerCount": 0,
    "PreviousTxnID": "BB7C26A13438A27FF1C6EBC51073109761DF937F8E7E8CF93CDA25FC47D30C04",
    "PreviousTxnLgrSeq": 22113755,
    "Sequence": 22113755
  },
  "ledger_index": 22113755,
  "validated": true
}
```
