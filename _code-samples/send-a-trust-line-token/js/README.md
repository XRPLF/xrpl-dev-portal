# Send a Trust Line Token (JavaScript)

Example code for sending a trust line token between two accounts on Testnet with [xrpl.js](https://github.com/XRPLF/xrpl.js).

## Setup

```sh
npm install
```

## Send a Trust Line Token

```sh
node sendTrustLineToken.js
```

You should see output like the following:

```sh
Issuer address:   rUrWYSHAX8kVwwPRxgVzhYQg9Ko3kxoqoy
Sender address:   rEx369HEEn1S2Cg2WC6Wi66awc45KzNBfV
Receiver address: rE1LWiuCAB7VogxWAAymFegbB7t1WKsD6v

=== Creating trust line from receiver to issuer... ===

{
  "TransactionType": "TrustSet",
  "Account": "rE1LWiuCAB7VogxWAAymFegbB7t1WKsD6v",
  "LimitAmount": {
    "currency": "FOO",
    "issuer": "rUrWYSHAX8kVwwPRxgVzhYQg9Ko3kxoqoy",
    "value": "1000000000"
  }
}
Trust line created from receiver to issuer!
Explorer link: https://testnet.xrpl.org/transactions/76AE546380FFA6CBDD3967FFECF2F75093D0EEC9925DE7969CF63FCFC71A439E

=== Checking initial FOO balances... ===

Holders' perspective:
  Sender's balance:   600
  Receiver's balance: 400
Issuer's perspective:
  Owed to sender:   -600
  Owed to receiver: -400

=== Sending FOO payment... ===

{
  "TransactionType": "Payment",
  "Account": "rEx369HEEn1S2Cg2WC6Wi66awc45KzNBfV",
  "Destination": "rE1LWiuCAB7VogxWAAymFegbB7t1WKsD6v",
  "Amount": {
    "currency": "FOO",
    "issuer": "rUrWYSHAX8kVwwPRxgVzhYQg9Ko3kxoqoy",
    "value": "100"
  }
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/E6313B9CEA42C45EA1047790BCF1DC5B8D49A35AEAC5735288ABBD252C56D1AD

=== Checking final FOO balances... ===

Holders' perspective:
  Sender's balance:   500
  Receiver's balance: 500
Issuer's perspective:
  Owed to sender:   -500
  Owed to receiver: -500
```
