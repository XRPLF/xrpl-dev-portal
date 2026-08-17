# Send an MPT (Python)

Example code for sending a Multi-Purpose Token (MPT) between non-issuer holders with [xrpl-py](https://github.com/XRPLF/xrpl-py).

## Setup

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Send an MPT

```sh
python send_mpt.py
```

You should see output like the following:

```sh
Sender address:   ranFqciDSPu22Z2zCN1YviFVBBWWpD7cou
MPT issuance ID:  01146CB14887541F014D48DEFC3F814BBB360F9627C4D4C6

Creating and funding receiver wallet...
Receiver address: raSjkoxk9sRWbcbvEfeUK8qgsFjsGWLmKz

=== Authorizing receiver to hold the MPT... ===

{
  "Account": "raSjkoxk9sRWbcbvEfeUK8qgsFjsGWLmKz",
  "TransactionType": "MPTokenAuthorize",
  "SigningPubKey": "",
  "MPTokenIssuanceID": "01146CB14887541F014D48DEFC3F814BBB360F9627C4D4C6"
}
Receiver authorized to hold the MPT!
Explorer link: https://testnet.xrpl.org/transactions/DF70291B29383AC7CE0D7B6E829327D28B09CF99455E3283CBD87217A41471F6

=== Checking initial MPT balances for issuance 01146CB14887541F014D48DEFC3F814BBB360F9627C4D4C6... ===

Sender balance:   300
Receiver balance: 0

=== Sending MPT payment... ===

{
  "Account": "ranFqciDSPu22Z2zCN1YviFVBBWWpD7cou",
  "TransactionType": "Payment",
  "SigningPubKey": "",
  "Amount": {
    "mpt_issuance_id": "01146CB14887541F014D48DEFC3F814BBB360F9627C4D4C6",
    "value": "100"
  },
  "Destination": "raSjkoxk9sRWbcbvEfeUK8qgsFjsGWLmKz"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/3A1EDB153B37DE69B940A32FC37C974B8C49183EA8569CB93E5522E7526FF164

=== Checking final MPT balances for issuance 01146CB14887541F014D48DEFC3F814BBB360F9627C4D4C6... ===

Sender balance:   200
Receiver balance: 100
```
