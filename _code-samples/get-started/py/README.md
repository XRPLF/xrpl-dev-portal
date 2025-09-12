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
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Attempting to fund address rLq4G7esPJ4ma7iBsXCtTLx4d8fcsQkHd
Faucet fund successful.
Wallet: rLq4G7esPJ4ma7iBsXCtTLx4d8fcsQkHd
Account Testnet Explorer URL:
 https://testnet.xrpl.org/accounts/rLq4G7esPJ4ma7iBsXCtTLx4d8fcsQkHd

Generating an x-address from the classic address...
Classic address: rLq4G7esPJ4ma7iBsXCtTLx4d8fcsQkHd
X-address: T7QB1hKGbzTLnGWvuXbmQQ6q2AvjnGSBULJE2gNEVWnbGEc

Getting account info...
Response Status:  ResponseStatus.SUCCESS
{
    "account_data": {
        "Account": "rLq4G7esPJ4ma7iBsXCtTLx4d8fcsQkHd",
        "Balance": "10000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 0,
        "PreviousTxnID": "24825D7C3CA2541899928CD4D5489151BF8ABD848E3F4F08186369E5FF7335B2",
        "PreviousTxnLgrSeq": 10569458,
        "Sequence": 10569458,
        "index": "24C7EB6F9A736270ED5A0A8FD12D01C91DF41E7A7D385E2A19A3D263CE0EF208"
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
    "ledger_hash": "BC2570097583BAAC1DD2DFA107B06291DF579CD46248E10C27377FB3F4317A7D",
    "ledger_index": 10569458,
    "validated": true
}
```
