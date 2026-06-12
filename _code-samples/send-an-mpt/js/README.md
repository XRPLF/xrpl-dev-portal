# Send an MPT (JavaScript)

Example code for sending a Multi-Purpose Token (MPT) between non-issuer holders with [xrpl.js](https://github.com/XRPLF/xrpl.js).

## Setup

```sh
npm install
```

## Send an MPT

```sh
node sendMPT.js
```

You should see output like the following:

```sh
Sender address:   rfuAUXHzy1338jtPzXcy81jVk3gnV8wvXm
MPT issuance ID:  011468E4BB17E28C35336935F83C8D6A1234CE93201039D2

Creating and funding receiver wallet...
Receiver address: rGmFCpZaPTc7xfbJrkNbHMJypHBDV6WFfw

=== Authorizing receiver to hold the MPT... ===

{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rGmFCpZaPTc7xfbJrkNbHMJypHBDV6WFfw",
  "MPTokenIssuanceID": "011468E4BB17E28C35336935F83C8D6A1234CE93201039D2"
}
Receiver authorized to hold the MPT!
Explorer link: https://testnet.xrpl.org/transactions/D1CFB27BA0B795A5EBBDE51228B14FB2103523786B4D25D28EAB43DEE1854065

=== Checking initial MPT balances for issuance 011468E4BB17E28C35336935F83C8D6A1234CE93201039D2... ===

Sender balance:   100
Receiver balance: 0

=== Sending MPT payment... ===

{
  "TransactionType": "Payment",
  "Account": "rfuAUXHzy1338jtPzXcy81jVk3gnV8wvXm",
  "Destination": "rGmFCpZaPTc7xfbJrkNbHMJypHBDV6WFfw",
  "Amount": {
    "mpt_issuance_id": "011468E4BB17E28C35336935F83C8D6A1234CE93201039D2",
    "value": "100"
  }
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/8510AE79E962EDE285A4BD563CADE4F92B62CE96BC75893B34B71D009E7256A1

=== Checking final MPT balances for issuance 011468E4BB17E28C35336935F83C8D6A1234CE93201039D2... ===

Sender balance:   0
Receiver balance: 100
```
