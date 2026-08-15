# Get Started Using TypeScript Library

Connects to the XRP Ledger, gets account information, builds and validates a typed transaction, and subscribes to ledger events using TypeScript and `xrpl.js`.

To download the source code, see the [Get Started Using TypeScript tutorial](https://xrpl.org/docs/tutorials/get-started/get-started-typescript) on xrpl.org.

## Setup

Install the runtime and development dependencies (`xrpl`, `typescript`, and `@types/node`):

```sh
npm install
```

## Run the Code

**Node.js**

Compile the TypeScript to JavaScript, then run it:

```sh
npx tsc
node ./dist/get-acct-info.js
```

You should see output similar to the following:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Wallet: rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i
Balance: 100
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i

Getting account info...
{
  "api_version": 2,
  "id": 4,
  "result": {
    "account_data": {
      "Account": "rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i",
      "Balance": "10000000",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 0,
      "PreviousTxnID": "0FF9DB2FE141DD0DF82566A171B6AF70BB2C6EB6A53D496E65D42FC062C91A78",
      "PreviousTxnLgrSeq": 9949268,
      "Sequence": 9949268,
      "index": "4A9C9220AE778DC38C004B2B17A08E218416D90E01456AFCF844C18838B36D01"
    },
    "ledger_hash": "304C7CC2A33B712BE43EB398B399E290C191A71FCB71784F584544DFB7C441B0",
    "ledger_index": 9949268,
    "validated": true
  },
  "type": "response"
}

Built and validated a Payment transaction:
{
  "TransactionType": "Payment",
  "Account": "rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i",
  "Amount": "22000000",
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
}

Submitted the transaction:
{
  "hash": "84AF8035CD41B0E411968FC9BDD52254C662197DB2BE669640F6DF25D79A7E0A",
  "ledger_index": 19257811,
  "meta": {
    "TransactionResult": "tesSUCCESS",
    "delivered_amount": "22000000"
  },
  "validated": true
}

Listening for ledger close events...
Ledger #9949269 validated with 0 transactions!
Ledger #9949270 validated with 0 transactions!
Ledger #9949271 validated with 0 transactions!

Disconnected
```

**Web**

Compile the TypeScript, then open `index.html` in a web browser and wait for the results to appear on the page:

```sh
npx tsc
```

The page loads `xrpl.js` through an import map and runs the compiled `dist/browser.js`. You should see output similar to the following:

```text
Connected to Testnet
Creating a new wallet and funding it with Testnet XRP...
Wallet: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S
Balance: 100
View account on XRPL Testnet Explorer: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S

Getting account info...
{ ...account_info response... }

Built and validated a Payment transaction:
{
  "TransactionType": "Payment",
  "Account": "rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S",
  "Amount": "22000000",
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
}

Submitted the transaction:
{
  "hash": "84AF8035CD41B0E411968FC9BDD52254C662197DB2BE669640F6DF25D79A7E0A",
  "ledger_index": 19257811,
  "meta": {
    "TransactionResult": "tesSUCCESS",
    "delivered_amount": "22000000"
  },
  "validated": true
}

Listening for ledger close events...
Ledger #9949611 validated with 0 transactions
Ledger #9949612 validated with 1 transactions
Ledger #9949613 validated with 0 transactions

Disconnected
```
