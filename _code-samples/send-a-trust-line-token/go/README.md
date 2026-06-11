# Send a Trust Line Token (Go)

Example code for sending a trust line token between two accounts on Testnet with [xrpl-go](https://github.com/Peersyst/xrpl-go).

All commands should be run from this `go/` directory.

## Setup

```sh
go mod tidy
```

## Send a Trust Line Token

```sh
go run ./send-trust-line-token
```

You should see output like the following:

```sh
Issuer address:   r33kXgFnMTP7eVhr7YuZNyPnkz1wyfwVmg
Sender address:   rHAcF3ViMQHqjLvLT9GtM34jJyfK9Lq4En
Receiver address: rHEfDbBxc5RmJdPzvi47p37P3XssTA3jB9

=== Creating trust line from receiver to issuer... ===

{
  "Account": "rHEfDbBxc5RmJdPzvi47p37P3XssTA3jB9",
  "LimitAmount": {
    "currency": "FOO",
    "issuer": "r33kXgFnMTP7eVhr7YuZNyPnkz1wyfwVmg",
    "value": "1000000000"
  },
  "TransactionType": "TrustSet"
}
Trust line created from receiver to issuer!
Explorer link: https://testnet.xrpl.org/transactions/835367A47F7D3B466A0BE94A95394AF4D4C46FD17397F3AC4A20964695D73F71

=== Checking initial FOO balances... ===

Holders' perspective:
  Sender's balance:   900
  Receiver's balance: 100
Issuer's perspective:
  Owed to sender:   -900
  Owed to receiver: -100

=== Sending FOO payment... ===

{
  "Account": "rHAcF3ViMQHqjLvLT9GtM34jJyfK9Lq4En",
  "Amount": {
    "currency": "FOO",
    "issuer": "r33kXgFnMTP7eVhr7YuZNyPnkz1wyfwVmg",
    "value": "100"
  },
  "Destination": "rHEfDbBxc5RmJdPzvi47p37P3XssTA3jB9",
  "TransactionType": "Payment"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/3FD2EDE570FADFBB129C6E4703CFBB80BC2BF5D843808F61C30F5041F46A7998

=== Checking final FOO balances... ===

Holders' perspective:
  Sender's balance:   800
  Receiver's balance: 200
Issuer's perspective:
  Owed to sender:   -800
  Owed to receiver: -200
```
