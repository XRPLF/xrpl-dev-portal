# Escrow (JavaScript)

Demonstrates how to create, finish, and cancel escrows on the XRP Ledger.

## Setup

```sh
npm install
```

## Send Timed Escrow

```sh
node send-timed-escrow.js
```

## Send Conditional Escrow

```sh
node send-conditional-escrow.js
```

## Send Fungible Token Escrow

```sh
node sendFungibleTokenEscrow.js
```

The script issues an MPT and Trust Line Token, setting up both to be escrowable. It then creates and finishes a conditional escrow with the MPT and a timed escrow with the Trust Line Token.

```sh
=== Funding Accounts ===

Issuer: rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP
Escrow Creator: rGRvH4FanVixca934o3ui4MbcrU56x9Qj4

=== Creating MPT ===

{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "MaximumAmount": "1000000",
  "Flags": 8
}

Submitting MPTokenIssuanceCreate transaction...
MPT created: 00F763A2D998FA5E720228B31E1162AC55E6311C7D31F3FC

=== Escrow Creator Authorizing MPT ===

{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "MPTokenIssuanceID": "00F763A2D998FA5E720228B31E1162AC55E6311C7D31F3FC"
}

Submitting MPTokenAuthorize transaction...
Escrow Creator authorized for MPT.

=== Issuer Sending MPTs to Escrow Creator ===

{
  "TransactionType": "Payment",
  "Account": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "Destination": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Amount": {
    "mpt_issuance_id": "00F763A2D998FA5E720228B31E1162AC55E6311C7D31F3FC",
    "value": "5000"
  }
}

Submitting MPT Payment transaction...
Successfully sent 5000 MPTs to Escrow Creator.

=== Creating Conditional MPT Escrow ===

Condition: A0258020AA2B8450898500A9E6332B7AD107264982CB09C63E3D16D139D63E997597E6F6810120
Fulfillment: A0228020CA07971CB0C63ED20C69931B41EEA7C4C8CC6F214183FDE031CDC7413856977F

{
  "TransactionType": "EscrowCreate",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Destination": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "Amount": {
    "mpt_issuance_id": "00F763A2D998FA5E720228B31E1162AC55E6311C7D31F3FC",
    "value": "1000"
  },
  "Condition": "A0258020AA2B8450898500A9E6332B7AD107264982CB09C63E3D16D139D63E997597E6F6810120",
  "CancelAfter": 828504579
}

Submitting MPT EscrowCreate transaction...
Conditional MPT escrow created. Sequence: 16212899

=== Finishing Conditional MPT Escrow ===

{
  "TransactionType": "EscrowFinish",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Owner": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "OfferSequence": 16212899,
  "Condition": "A0258020AA2B8450898500A9E6332B7AD107264982CB09C63E3D16D139D63E997597E6F6810120",
  "Fulfillment": "A0228020CA07971CB0C63ED20C69931B41EEA7C4C8CC6F214183FDE031CDC7413856977F"
}

Submitting EscrowFinish transaction...
Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/BB6E8BF8A7F28D15C12C24FFDB215180262ABFAEAD43FB020DCB39E826027078

=== Enabling Trust Line Token Escrows on Issuer ===

{
  "TransactionType": "AccountSet",
  "Account": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "SetFlag": 17
}

Submitting AccountSet transaction...
Trust line token escrows enabled by issuer.

=== Setting Up Trust Line ===

{
  "TransactionType": "TrustSet",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "LimitAmount": {
    "currency": "IOU",
    "issuer": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
    "value": "10000000"
  }
}

Submitting TrustSet transaction...
Trust line successfully created for "IOU" tokens.

=== Issuer Sending IOU Tokens to Escrow Creator ===

{
  "TransactionType": "Payment",
  "Account": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "Destination": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Amount": {
    "currency": "IOU",
    "value": "5000",
    "issuer": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP"
  }
}

Submitting Trust Line Token payment transaction...
Successfully sent 5000 IOU tokens.

=== Creating Timed Trust Line Token Escrow ===

Escrow will mature after: 4/2/2026, 9:05:12 PM

{
  "TransactionType": "EscrowCreate",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Destination": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP",
  "Amount": {
    "currency": "IOU",
    "value": "1000",
    "issuer": "rLqYtjhg56pVNJFKueVVKkiA8z5UtznxQP"
  },
  "FinishAfter": 828504312,
  "CancelAfter": 828504602
}

Submitting Trust Line Token EscrowCreate transaction...
Trust Line Token escrow created. Sequence: 16212902

=== Waiting For Timed Trust Line Token Escrow to Mature ===

Waiting for escrow to mature... done.           
Latest validated ledger closed at: 4/2/2026, 9:05:13 PM
Escrow confirmed ready to finish.

=== Finishing Timed Trust Line Token Escrow ===

{
  "TransactionType": "EscrowFinish",
  "Account": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "Owner": "rGRvH4FanVixca934o3ui4MbcrU56x9Qj4",
  "OfferSequence": 16212902
}

Submitting EscrowFinish transaction...
Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/136402974863BF553706B0A4A341F24DDA5385BB6F93B905038D8FD9863B6D91
```

## List Escrows

```sh
node list-escrows.js
```

## Cancel Escrow

```sh
node cancel-escrow.js
```
