# Get Started Using JavaScript Library

Connects to the XRP Ledger, gets account information, and subscribes to ledger events using JavaScript.

To download the source code, see [Get Started Using JavaScript Library](http://xrpl.org/docs/tutorials/javascript/build-apps/get-started).

## Run the Code

**Node.js**

Quick setup and usage:

```sh
npm install
node ./get-acct-info.js
```

You should see output similar to the following:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Wallet: rMnXR9p2sZT9iZ6ew3iEqvBMyPts1ADc4i
Balance: 10

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
    "account_flags": {
        "allowTrustLineClawback": false,
        "defaultRipple": false,
        "depositAuth": false,
        "disableMasterKey": false,
        "disallowIncomingCheck": false,
        "disallowIncomingNFTokenOffer": false,
        "disallowIncomingPayChan": false,
        "disallowIncomingTrustline": false,
        "disallowIncomingXRP": false,
        "globalFreeze": false,
        "noFreeze": false,
        "passwordSpent": false,
        "requireAuthorization": false,
        "requireDestinationTag": false
    },
    "ledger_hash": "304C7CC2A33B712BE43EB398B399E290C191A71FCB71784F584544DFB7C441B0",
    "ledger_index": 9949268,
    "validated": true
    },
    "type": "response"
}

Listening for ledger close events...
Ledger #9949269 validated with 0 transactions!
Ledger #9949270 validated with 0 transactions!
Ledger #9949271 validated with 0 transactions!

Disconnected
```

**Web**

To run the web example, open `index.html` in a web browser and wait for the results to appear on the page.

You should see output similar to the following:

```text
Connected to Testnet
Creating a new wallet and funding it with Testnet XRP...
Wallet: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S
Balance: 10
View account on XRPL Testnet Explorer: rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S

Getting account info...
{
    "api_version": 2,
    "id": 5,
    "result": {
    "account_data": {
        "Account": "rf7CWJdNssSzQk2GtypYLVhyvGe8oHS3S",
        "Balance": "10000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "96E4B44F93EC0399B7ADD75489630C6A8DCFC922F20F6810D25490CC0D3AA12E",
        "PreviousTxnLgrSeq": 9949610,
        "Sequence": 9949610,
        "index": "B5D2865DD4BF8EEDFEE2FD95DE37FC28D624548E9BBC42F9FBF61B618E98FAC8"
    },
    "account_flags": {
        "allowTrustLineClawback": false,
        "defaultRipple": false,
        "depositAuth": false,
        "disableMasterKey": false,
        "disallowIncomingCheck": false,
        "disallowIncomingNFTokenOffer": false,
        "disallowIncomingPayChan": false,
        "disallowIncomingTrustline": false,
        "disallowIncomingXRP": false,
        "globalFreeze": false,
        "noFreeze": false,
        "passwordSpent": false,
        "requireAuthorization": false,
        "requireDestinationTag": false
    },
    "ledger_hash": "7692673B8091899C3EEE6807F66B65851D3563F483A49A5F03A83608658473D6",
    "ledger_index": 9949610,
    "validated": true
    },
    "type": "response"
}

Listening for ledger close events...
Ledger #9949611 validated with 0 transactions
Ledger #9949612 validated with 1 transactions
Ledger #9949613 validated with 0 transactions

Disconnected
```
