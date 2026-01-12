# Get Started Using Python Library

Connects to the XRP Ledger and gets account information using Python.

To download the source code, see [Get Started Using Python Library](http://xrpl.org/docs/tutorials/python/build-apps/get-started).

## Run the Code

Quick setup and usage:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python ./get-acct-info.py
```

You should see output similar to the following:

```sh
Creating a new wallet and funding it with Testnet XRP...
Attempting to fund address ravbHNootpSNQkxyEFCWevSkHsFGDHfyop
Faucet fund successful.
Wallet: ravbHNootpSNQkxyEFCWevSkHsFGDHfyop
Account Testnet Explorer URL:
 https://testnet.xrpl.org/accounts/ravbHNootpSNQkxyEFCWevSkHsFGDHfyop

Getting account info...
Response Status:  ResponseStatus.SUCCESS
{
    "account_data": {
        "Account": "ravbHNootpSNQkxyEFCWevSkHsFGDHfyop",
        "Balance": "100000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "3DACF2438AD39F294C4EFF6132D5D88BCB65D2F2261C7650F40AC1F6A54C83EA",
        "PreviousTxnLgrSeq": 12039759,
        "Sequence": 12039759,
        "index": "148E6F4B8E4C14018D679A2526200C292BDBC5AB77611BC3AE0CB97CD2FB84E5"
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
    "ledger_hash": "CA624D717C4FCDD03BAD8C193F374A77A14F7D2566354A4E9617A8DAD896DE71",
    "ledger_index": 12039759,
    "validated": true
}
```
