# Escrow (Go)

This directory contains Go examples demonstrating how to create, finish, and cancel escrows on the XRP Ledger.

## Setup

All commands should be run from this `go/` directory.

Install dependencies before running any examples:

```sh
go mod tidy
```

---

## Send Fungible Token Escrow

```sh
go run ./send-fungible-token-escrow
```

The script issues an MPT and Trust Line Token, setting up both to be escrowable. It then creates and finishes a conditional escrow with the MPT and a timed escrow with the Trust Line Token.

```sh
=== Funding Accounts ===

Funding Issuer account...
Funding Escrow Creator account...
Issuer: rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD
Escrow Creator: rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk

=== Creating MPT ===

{
  "Account": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "Flags": 8,
  "MaximumAmount": "1000000",
  "TransactionType": "MPTokenIssuanceCreate"
}

Submitting MPTokenIssuanceCreate transaction...
MPT created: 00F7A9BD191FD9BB1D11E217CA5643AED429859BDD40EF8B

=== Escrow Creator Authorizing MPT ===

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "MPTokenIssuanceID": "00F7A9BD191FD9BB1D11E217CA5643AED429859BDD40EF8B",
  "TransactionType": "MPTokenAuthorize"
}

Submitting MPTokenAuthorize transaction...
Escrow Creator authorized for MPT.

=== Issuer Sending MPTs to Escrow Creator ===

{
  "Account": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "Amount": {
    "mpt_issuance_id": "00F7A9BD191FD9BB1D11E217CA5643AED429859BDD40EF8B",
    "value": "5000"
  },
  "Destination": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "TransactionType": "Payment"
}

Submitting MPT Payment transaction...
Successfully sent 5000 MPTs to Escrow Creator.

=== Creating Conditional MPT Escrow ===

Condition: A025802057FDC219A423C4F0DA150941EB529B1D927816FAB394617A0430D1DDB39A3EDB810120
Fulfillment: A0228020F16E8A8697ABAE14C60A5D812A2D228F9E6F67B8CA4818DC80BBF539004490DB

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "Amount": {
    "mpt_issuance_id": "00F7A9BD191FD9BB1D11E217CA5643AED429859BDD40EF8B",
    "value": "1000"
  },
  "CancelAfter": 828559916,
  "Condition": "A025802057FDC219A423C4F0DA150941EB529B1D927816FAB394617A0430D1DDB39A3EDB810120",
  "Destination": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "TransactionType": "EscrowCreate"
}

Submitting MPT EscrowCreate transaction...
Conditional MPT escrow created. Sequence: 16230848

=== Finishing Conditional MPT Escrow ===

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "Condition": "A025802057FDC219A423C4F0DA150941EB529B1D927816FAB394617A0430D1DDB39A3EDB810120",
  "Fulfillment": "A0228020F16E8A8697ABAE14C60A5D812A2D228F9E6F67B8CA4818DC80BBF539004490DB",
  "OfferSequence": 16230848,
  "Owner": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "TransactionType": "EscrowFinish"
}

Submitting EscrowFinish transaction...
Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/37CD7FECDC71CE70C24927969AD0FDAD55F57F2905A6F62867CB4F5AB2EE27BB

=== Enabling Trust Line Token Escrows on Issuer ===

{
  "Account": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "SetFlag": 17,
  "TransactionType": "AccountSet"
}

Submitting AccountSet transaction...
Trust line token escrows enabled by issuer.

=== Setting Up Trust Line ===

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "LimitAmount": {
    "currency": "IOU",
    "issuer": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
    "value": "10000000"
  },
  "TransactionType": "TrustSet"
}

Submitting TrustSet transaction...
Trust line successfully created for "IOU" tokens.

=== Issuer Sending IOU Tokens to Escrow Creator ===

{
  "Account": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "Amount": {
    "currency": "IOU",
    "issuer": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
    "value": "5000"
  },
  "Destination": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "TransactionType": "Payment"
}

Submitting Trust Line Token payment transaction...
Successfully sent 5000 IOU tokens.

=== Creating Timed Trust Line Token Escrow ===

Escrow will mature after: 04/03/2026, 12:27:38 PM

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "Amount": {
    "currency": "IOU",
    "issuer": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
    "value": "1000"
  },
  "CancelAfter": 828559948,
  "Destination": "rsHiso1Qb4vb9GfuWSvmPeBuk6BT1479uD",
  "FinishAfter": 828559658,
  "TransactionType": "EscrowCreate"
}

Submitting Trust Line Token EscrowCreate transaction...
Trust Line Token escrow created. Sequence: 16230851

=== Waiting For Timed Trust Line Token Escrow to Mature ===

Waiting for escrow to mature... done.           
Latest validated ledger closed at: 04/03/2026, 12:27:41 PM
Escrow confirmed ready to finish.

=== Finishing Timed Trust Line Token Escrow ===

{
  "Account": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "OfferSequence": 16230851,
  "Owner": "rfQVjJ9sRYcLqwxRV2rqSSFm9jusXXo9Sk",
  "TransactionType": "EscrowFinish"
}

Submitting EscrowFinish transaction...
Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/9D1937BE3ADFC42078F222B1DBAE8571BBC096DDA7A47911C4715221C83EC22D
```
