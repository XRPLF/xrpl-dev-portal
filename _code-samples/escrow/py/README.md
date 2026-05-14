# Escrow (Python)

Demonstrates how to create, finish, and cancel escrows on the XRP Ledger.

## Setup

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Send Timed Escrow

```sh
python send_timed_escrow.py
```

## Send Conditional Escrow

```sh
python send_conditional_escrow.py
```

## Send Fungible Token Escrow

```sh
python send_fungible_token_escrow.py
```

The script issues an MPT and Trust Line Token, setting up both to be escrowable. It then creates and finishes a conditional escrow with the MPT and a timed escrow with the Trust Line Token.

```sh
=== Funding Accounts ===

Attempting to fund address rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2
Faucet fund successful.
Attempting to fund address rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU
Faucet fund successful.
Issuer: rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2
Escrow Creator: rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU

=== Creating MPT ===

{
  "Account": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "TransactionType": "MPTokenIssuanceCreate",
  "Flags": 8,
  "SigningPubKey": "",
  "MaximumAmount": "1000000"
}

Submitting MPTokenIssuanceCreate transaction...
MPT created: 00F7705DFE38372A760229755F9E4F5EADE06F2CE36BDA18

=== Escrow Creator Authorizing MPT ===

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "MPTokenAuthorize",
  "SigningPubKey": "",
  "MPTokenIssuanceID": "00F7705DFE38372A760229755F9E4F5EADE06F2CE36BDA18"
}

Submitting MPTokenAuthorize transaction...
Escrow Creator authorized for MPT.

=== Issuer Sending MPTs to Escrow Creator ===

{
  "Account": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "TransactionType": "Payment",
  "SigningPubKey": "",
  "Amount": {
    "mpt_issuance_id": "00F7705DFE38372A760229755F9E4F5EADE06F2CE36BDA18",
    "value": "5000"
  },
  "Destination": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU"
}

Submitting MPT Payment transaction...
Successfully sent 5000 MPTs to Escrow Creator.

=== Creating Conditional MPT Escrow ===

Condition: A02580202959C2DFA17829F23F8A7F2F3A81FE73F9E964A56810A250CB836DE1AB851E47810120
Fulfillment: A022802079204EBCCCF4816441F0D4F7B15E7003A757675FC90691107AB770044B07697B

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "EscrowCreate",
  "SigningPubKey": "",
  "Amount": {
    "mpt_issuance_id": "00F7705DFE38372A760229755F9E4F5EADE06F2CE36BDA18",
    "value": "1000"
  },
  "Destination": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "CancelAfter": 828514495,
  "Condition": "A02580202959C2DFA17829F23F8A7F2F3A81FE73F9E964A56810A250CB836DE1AB851E47810120"
}

Submitting MPT EscrowCreate transaction...
Conditional MPT escrow created. Sequence: 16216160

=== Finishing Conditional MPT Escrow ===

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "EscrowFinish",
  "SigningPubKey": "",
  "Owner": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "OfferSequence": 16216160,
  "Condition": "A02580202959C2DFA17829F23F8A7F2F3A81FE73F9E964A56810A250CB836DE1AB851E47810120",
  "Fulfillment": "A022802079204EBCCCF4816441F0D4F7B15E7003A757675FC90691107AB770044B07697B"
}

Submitting EscrowFinish transaction...
Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/4FE4B0AD6FD9D8CD968F5AFD43C3E1F2180C40C3A20DE7416B1E16069D2340DD

=== Enabling Trust Line Token Escrows on Issuer ===

{
  "Account": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "TransactionType": "AccountSet",
  "SigningPubKey": "",
  "SetFlag": 17
}

Submitting AccountSet transaction...
Trust line token escrows enabled by issuer.

=== Setting Up Trust Line ===

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "TrustSet",
  "SigningPubKey": "",
  "LimitAmount": {
    "currency": "IOU",
    "issuer": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
    "value": "10000000"
  }
}

Submitting TrustSet transaction...
Trust line successfully created for "IOU" tokens.

=== Issuer Sending IOU Tokens to Escrow Creator ===

{
  "Account": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "TransactionType": "Payment",
  "SigningPubKey": "",
  "Amount": {
    "currency": "IOU",
    "issuer": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
    "value": "5000"
  },
  "Destination": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU"
}

Submitting Trust Line Token payment transaction...
Successfully sent 5000 IOU tokens.

=== Creating Timed Trust Line Token Escrow ===

Escrow will mature after: 04/02/2026, 11:50:39 PM

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "EscrowCreate",
  "SigningPubKey": "",
  "Amount": {
    "currency": "IOU",
    "issuer": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
    "value": "1000"
  },
  "Destination": "rQBByeTLvRVQy9GLsqvsnczMB3QZ7b7gs2",
  "CancelAfter": 828514529,
  "FinishAfter": 828514239
}

Submitting Trust Line Token EscrowCreate transaction...
Trust Line Token escrow created. Sequence: 16216163

=== Waiting For Timed Trust Line Token Escrow to Mature ===

Waiting for escrow to mature... done.           
Latest validated ledger closed at: 04/02/2026, 11:50:42 PM
Escrow confirmed ready to finish.

=== Finishing Timed Trust Line Token Escrow ===

{
  "Account": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "TransactionType": "EscrowFinish",
  "SigningPubKey": "",
  "Owner": "rBkkT1Q3E3bm5tM5D5YazgX8cpq3a2V6zU",
  "OfferSequence": 16216163
}

Submitting EscrowFinish transaction...
Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/F3FCFE9D0E9A0A7CC6FA804526A509532833AEAD4C7A7BF1978194F4F1CCDED4
```

## List Escrows

```sh
python list_escrows.py
```

## Get Account Escrows

```sh
python account_escrows.py
```

## Cancel Escrow

```sh
python cancel_escrow.py
```
