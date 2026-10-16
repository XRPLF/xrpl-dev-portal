# Send a Trust Line Token (Go)

Example code for sending a trust line token from one holder to another on Testnet with [xrpl-go](https://github.com/Peersyst/xrpl-go). Before sending, the script checks that the receiver is able to receive the payment.

## Setup

All commands should be run from this `go/` directory.

```sh
go mod tidy
```

## Send a Trust Line Token

```sh
go run ./send-trust-line-token
```

Loads a sender that already holds TST, checks the sender's balance including any transfer fee, runs the pre-flight checks on the receiver, sends 2 TST, and prints both balances before and after along with the delivered amount. If no setup data exists, the setup script runs first and buys TST for the sender on the DEX.

You should see output like the following:

```sh
=== Tutorial setup data doesn't exist. Running setup script... ===

Setting up tutorial: Complete!
Issuer address:   rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd
Sender address:   rMD2XQ6s2JgxNK3ibA41VJogCNYBjekfjT
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
  Receiver: 54 TST

=== Sending 2 TST to receiver... ===

{
  "Account": "rMD2XQ6s2JgxNK3ibA41VJogCNYBjekfjT",
  "Amount": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value": "2"
  },
  "Destination": "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE",
  "TransactionType": "Payment"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/55647900766CDF65522FADF294BFD1E0D7A3E4E60D6723CADBC5CB7A491C5293

=== Checking final TST balances... ===

Delivered amount: 2 TST
  Sender:   3 TST
  Receiver: 56 TST
```
