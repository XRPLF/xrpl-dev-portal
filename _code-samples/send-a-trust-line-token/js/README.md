# Send a Trust Line Token (JavaScript)

Example code for sending a trust line token from one holder to another on Testnet with [xrpl.js](https://github.com/XRPLF/xrpl.js). Before sending, the script checks that the receiver is able to receive the payment.

## Setup

```sh
npm install
```

## Send a Trust Line Token

```sh
node sendTrustLineToken.js
```

Loads a sender that already holds TST, checks the sender's balance including any transfer fee, runs the pre-flight checks on the receiver, sends 2 TST, and prints both balances before and after along with the delivered amount. If no setup data exists, the setup script runs first and buys TST for the sender on the DEX.

You should see output like the following:

```sh
=== Tutorial setup data doesn't exist. Running setup script... ===

Setting up tutorial: Complete!
Issuer address:   rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd
Sender address:   raRkJrz86w6EEsRxYw26wwGXUpGTSwF9PT
Receiver address: rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE

=== Checking sender's TST balance... ===

✓ No transfer fee
Sender's balance: 5

=== Checking receiver can receive TST... ===

✓ Receiver has a trust line to the issuer
✓ Rippling is allowed (issuer Default Ripple: true)
✓ Receiver's limit covers the payment
✓ Authorization OK (issuer Require Auth: false)

Balances before payment:
  Sender:   5 TST
  Receiver: 60 TST

=== Sending 2 TST to receiver... ===

{
  "TransactionType": "Payment",
  "Account": "raRkJrz86w6EEsRxYw26wwGXUpGTSwF9PT",
  "Destination": "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE",
  "Amount": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value": "2"
  }
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/17209562FE0153762E011449C6FF7368F28F756D1BB7559FE673CC0A9881BF5D

=== Checking final TST balances... ===

  Delivered amount: 2 TST
  Sender:   3 TST
  Receiver: 62 TST
```
