---
html: txn-and-requests.html
parent: intro-to-xrpl.html
blurb: All interactions with the ledger are either transactions or requests.
labels:
  - Blockchain
---

# Transactions and Requests

All interactions with the XRP Ledger involve either sending a transaction that makes changes to the ledger or sending a request for information from the ledger.

## How Do Transactions Work?

You execute a transaction by sending a REST command to the XRP Ledger and waiting for the response. The command syntax is always the same for every transaction.

You must always provide the _TransactionType_ and the public address of the _Account_ making the transaction.

Two required fields are the _Fee_ for the transaction and the next _Sequence_ number for transactions from the account. These fields can be filled in automatically by the ledger server when you submit the transaction.

Specific transactions also have required fields specific to the transaction type. For example, a _Payment_ transaction requires an _Amount_ value (in _drops_, or millionths of an XRP) and a _Destination_ public address to which the funds are credited.

Here is a sample transaction in JSON format. This transaction transfers 1 XRP from account _rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn_ to destination account _ra5nK24KXen9AHvsdFTKHSANinZseWnPcX_.

```json
{
  "TransactionType": "Payment",
  "Account": rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn,
  "Amount": 1000000,
  "Destination": ra5nK24KXen9AHvsdFTKHSANinZseWnPcX
}
```

Optional fields are available for all transactions, with additional fields available for specific transactions. You can include as many optional fields as you need, but do not have to include every field in every transaction.

You send the transaction to the ledger as a RESTful command from JavaScript, Python, the command line, or any compatible service. The rippled server proposes the transaction to the ledger. When 80% of the validators approve the transaction, it is recorded as part of the permanent ledger. The ledger returns the results of the transaction.

For more information on Transactions, see [Transactions](transactions.html).

## How Do Requests Work?

Requests are similar to transactions, but they do not make changes to the ledger.

The fields you send vary with the type of information you request. They typically have several optional fields, but only a few required fields.

This is a sample request in JSON format. This request gets the current account information for the account number you provide.

```json
{
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn"
}
```

The request returns a wealth of information in a format appropriate for the language you used to make the request. Here is an example of the response for an account information request in JSON format.

```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```
For information on the fields in an Account record, see [Accounts](accounts.html).