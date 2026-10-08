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

Loads a sender that already holds TST, runs the pre-flight checks on the receiver, sends 2 TST, and prints both balances before and after. If no setup data exists, the setup script runs first and buys TST for the sender on the DEX.

You should see output like the following:

```sh
=== Tutorial setup data doesn't exist. Running setup script... ===

Setting up tutorial: Complete!
Issuer address:   rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd
Sender address:   r4dLURGAzr6DfQgvLd3pVq5TgHV6cRRW7g
Receiver address: rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE

=== Checking sender's TST balance... ===

Sender's balance: 5

=== Checking receiver can receive TST... ===

✓ Receiver has a trust line to the issuer
✓ Rippling is allowed (issuer Default Ripple: true)
✓ Receiver's limit covers the payment
✓ Authorization OK (issuer Require Auth: false)
✓ No transfer fee

Balances before payment:
  Sender:   5 TST
  Receiver: 12 TST

=== Sending 2 TST to receiver... ===

{
  "TransactionType": "Payment",
  "Account": "r4dLURGAzr6DfQgvLd3pVq5TgHV6cRRW7g",
  "Destination": "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE",
  "Amount": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value": "2"
  }
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/5A09469A0F618C79CA30565C88161ABF706322FE645278F3C1DD71506858C0F4

=== Checking final TST balances... ===

  Sender:   3 TST
  Receiver: 14 TST
```
