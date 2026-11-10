# Get Started Using PHP Library

Connects to the XRP Ledger, creates and funds a Testnet account, and looks up its account info using PHP.

To follow along, see [Get Started Using PHP Library](https://xrpl.org/docs/tutorials/get-started/get-started-php).

## Run the Code

Quick setup and usage:

```sh
composer install
php get-acct-info.php
```

You should see output similar to the following:

```sh
Creating a new wallet and funding it with Testnet XRP...
Wallet: rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH

Getting account info...
{
    "account_data": {
        "Account": "rEgozW7ZzQV2d2y2KHXfnSggihd8CzrwCH",
        "Balance": "100000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "62A194278A2645DDC2A42F5FED8E56645A7B789CEFF4AB75F451AD8827095290",
        "PreviousTxnLgrSeq": 22224694,
        "Sequence": 22224694,
        "index": "F5C5332360D33A27D7915F021196710927F1BA53B4993C9D04854F635E02EB9A"
    },
    "account_flags": {
        "allowTrustLineClawback": false,
        "allowTrustLineLocking": false,
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
    "ledger_hash": "8A30A2F2E14DC9B7D0726D48B61671521525918900EC9368D20FAE81A2FCC9A8",
    "ledger_index": 22224694,
    "status": "success",
    "validated": true
}
```
