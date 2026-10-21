# Send a Trust Line Token (Python)

Example code for sending a trust line token from one holder to another on Testnet with [xrpl-py](https://github.com/XRPLF/xrpl-py). Before sending, the script checks that the receiver is able to receive the payment.

## Setup

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Send a Trust Line Token

```sh
python3 send_trust_line_token.py
```

Loads a sender that already holds TST, checks the sender's balance including any transfer fee, runs the pre-flight checks on the receiver, sends 2 TST, and prints both balances before and after along with the delivered amount. If no setup data exists, the setup script runs first and buys TST for the sender on the DEX.

You should see output like the following:

```sh
=== Tutorial setup data doesn't exist. Running setup script... ===

Setting up tutorial: Complete!
Issuer address:   rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd
Sender address:   rH8MNKC9CfUGrkZjaRQTd6MMs6JphMJbZ2
Receiver address: rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE

=== Checking sender's TST balance... ===

✓ No transfer fee
Sender's balance: 5

=== Checking receiver can receive TST... ===

✓ Receiver has a trust line to the issuer
✓ Rippling is allowed (issuer Default Ripple: True)
✓ Receiver's limit covers the payment
✓ Authorization OK (issuer Require Auth: False)

Balances before payment:
  Sender:   5 TST
  Receiver: 62 TST

=== Sending 2 TST to receiver... ===

{
  "Account": "rH8MNKC9CfUGrkZjaRQTd6MMs6JphMJbZ2",
  "TransactionType": "Payment",
  "SigningPubKey": "",
  "Amount": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value": "2"
  },
  "Destination": "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/D96C144FF298B5E86A6AF5C192563857504C86C871E3AFCABE5255EF0D4E0A6E

=== Checking final TST balances... ===

  Delivered amount: 2 TST
  Sender:   3 TST
  Receiver: 64 TST
```
