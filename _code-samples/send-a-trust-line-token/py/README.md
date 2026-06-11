# Send a Trust Line Token (Python)

Example code for sending a trust line token between two accounts on Testnet with [xrpl-py](https://github.com/XRPLF/xrpl-py).

## Setup

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Send a Trust Line Token

```sh
python send_trust_line_token.py
```

You should see output like the following:

```sh
Issuer address:   rpQrTB7Zko3i8QTZa1jn3MqTjFFtjvnpDD
Sender address:   rNXVfWdMs8oScEDBUfZgv5Auds6ahWvgMS
Receiver address: rQpATksgqj3XNatYZ89mnxPrCXgSvuWKkN

=== Creating trust line from receiver to issuer... ===

{
  "Account": "rQpATksgqj3XNatYZ89mnxPrCXgSvuWKkN",
  "TransactionType": "TrustSet",
  "SigningPubKey": "",
  "LimitAmount": {
    "currency": "FOO",
    "issuer": "rpQrTB7Zko3i8QTZa1jn3MqTjFFtjvnpDD",
    "value": "1000000000"
  }
}
Trust line created from receiver to issuer!
Explorer link: https://testnet.xrpl.org/transactions/9DA16FEE0B361C96BAD6F341E15E4FD6A6601BC4DD6227EC7EF655C29A1A412D

=== Checking initial FOO balances... ===

Holders' perspective:
  Sender's balance:   900
  Receiver's balance: 100
Issuer's perspective:
  Owed to sender:   -900
  Owed to receiver: -100

=== Sending FOO payment... ===

{
  "Account": "rNXVfWdMs8oScEDBUfZgv5Auds6ahWvgMS",
  "TransactionType": "Payment",
  "SigningPubKey": "",
  "Amount": {
    "currency": "FOO",
    "issuer": "rpQrTB7Zko3i8QTZa1jn3MqTjFFtjvnpDD",
    "value": "100"
  },
  "Destination": "rQpATksgqj3XNatYZ89mnxPrCXgSvuWKkN"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/7779331C8AE458A8342A36CCCD53CA5ED03219C61B8F159EDC36A1BBD6FC85EC

=== Checking final FOO balances... ===

Holders' perspective:
  Sender's balance:   800
  Receiver's balance: 200
Issuer's perspective:
  Owed to sender:   -800
  Owed to receiver: -200
```
