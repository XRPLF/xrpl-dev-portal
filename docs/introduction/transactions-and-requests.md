---
html: txn-and-requests.html
parent: intro-to-xrpl.html
seo:
    description: All interactions with the ledger are either transactions or requests.
labels:
  - Blockchain
---

# Transactions and Requests

Most interactions with the XRP Ledger involve either sending a transaction that makes changes to the ledger or sending a request for information from the ledger. You can also subscribe to monitor continual notifications of interest.

## How Do Transactions Work?

Use transactions to make changes on the ledger such as transferring XRP and other tokens between accounts; minting and burning NFTs; and creating, accepting, and cancelling offers. You execute a transaction by sending a command to the XRP Ledger and watching for confirmation that the transaction is complete. The command syntax format is the same for every transaction.

- You must always provide the _TransactionType_ and the public address of the _Account_ making the transaction.

- Two required fields are the _Fee_ for the transaction and the next _Sequence_ number for transactions from the account. These fields can be filled in automatically.

- Transactions can also have required fields specific to the transaction type. For example, a _Payment_ transaction requires an _Amount_ value (in _drops_, or millionths of an XRP) and a _Destination_ public address to which the funds are credited.

Here is a sample transaction in JSON format. This transaction transfers 1 XRP from account _rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn_ to destination account _ra5nK24KXen9AHvsdFTKHSANinZseWnPcX_.

```json
{
  "TransactionType": "Payment",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": "1000000",
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
}
```

Optional fields are available for all transactions, with additional fields available for specific transactions. You can include as many optional fields as you need, but do not have to include every field in every transaction.

You send the transaction to the ledger as a command from JavaScript, Python, the command line, or any compatible service. The rippled servers propose transactions to the XRPL. 

![Proposed Transacations](/docs/img/introduction17-gather-txns.png)

When 80% of the validators approve a current set of proposed transactions, they are recorded as part of the permanent ledger. The rippled server returns the results of the transaction you sent.

For more information on Transactions, see [Transactions](../concepts/transactions/index.md).

## How Do Requests Work?

Requests are used to get information from the ledger, but they do not make changes to the ledger. The information is freely available to anyone to view, so there is no need to sign in with your account information.

The fields you send vary with the type of information you request. They typically have several optional fields, but only a few required fields.

When you submit your request, it might be processed by a rippled server or by a Clio server, a server that is dedicated to responding to requests.

![Clio Server](/docs/img/introduction19-clio.png)

Clio servers take some of the load off the other rippled servers on the XRPL to improve processing speed and reliability.

This is a sample request in JSON format. This request gets the current account information for the account number you provide.

```json
{
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn"
}
```

The request returns a wealth of information. Here is an example response for an account information request in JSON format.

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
For information on the fields in an Account record, see [Accounts](../concepts/accounts/index.md).

Next: [Software Ecosystem](software-ecosystem.md)
