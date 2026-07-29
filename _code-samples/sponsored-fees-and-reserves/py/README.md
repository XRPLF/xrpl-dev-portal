# Sponsored Fees and Reserves (Python)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows. It also shows how to manage a sponsorship pool and transfer a reserve sponsorship.

Quick setup:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Sponsor a transaction

```sh
python sponsor_a_transaction.py
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC
Sponsee address: rKeMpUToZq6bHFHarVb3chpEt5svca5Pht

=== Preparing Payment transaction to create the sponsee's account ===

{
  "Account": "rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "rKeMpUToZq6bHFHarVb3chpEt5svca5Pht"
}

=== Submitting Payment transaction ===

Sponsee account created successfully!
Account reserve sponsored by: rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC

=== Preparing sponsored DepositPreauth transaction ===

{
  "Account": "rKeMpUToZq6bHFHarVb3chpEt5svca5Pht",
  "TransactionType": "DepositPreauth",
  "Fee": "1",
  "Sequence": 4278708,
  "LastLedgerSequence": 4278728,
  "SigningPubKey": "",
  "Sponsor": "rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC",
  "SponsorFlags": 3,
  "Authorize": "rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC"
}

=== Submitting sponsored DepositPreauth transaction ===

{
  "Account": "rKeMpUToZq6bHFHarVb3chpEt5svca5Pht",
  "TransactionType": "DepositPreauth",
  "Fee": "1",
  "Sequence": 4278708,
  "LastLedgerSequence": 4278728,
  "SigningPubKey": "ED14DD8DE5B94CD3007BEB70281C76FC6199C1B67593CD4BB7DD72210718DF59AB",
  "TxnSignature": "E7D737BD9D42FD5DD9FFBE6E59364451E29B2F5DBD00914FBC03FB1499797F717F91A9F5657B4350D716569E1E86937B257C68BFB61896782353565450FFC80B",
  "Sponsor": "rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC",
  "SponsorFlags": 3,
  "SponsorSignature": {
    "SigningPubKey": "EDE49E1400F65ECAF702F2125B8CA689D4A310806F7CAB252458847A58EF2B24E5",
    "TxnSignature": "8898969E9FE18D3347646512710AD14E27DD4D3A94AC81F46BD7D55311E003CF4270D5FEFDBB85A31F6EF075A6701F76F88C6B0973AE61C720FBA1EBD97EC20C"
  },
  "Authorize": "rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC"
}
Transaction sponsored successfully!

=== Sponsorship Information ===

DepositPreauth ID: E8F64C27C5A3F593F4785634B9E15305D65252290320EB05EC469C8A4EC71E4B
DepositPreauth reserve sponsored by: rNyigV6W3Uu16CmyJGFxgv7e5CkxFiN6LC

Sponsee fee paid: 0 drops
Sponsee balance:  1 drops
Sponsee owner count: 1

Sponsor fee paid: 1 drops
Sponsor balance:  99999997 drops
Reserves sponsored (SponsoringOwnerCount): 1
```

## Sponsor a transaction with a pre-funded pool

```sh
python sponsor_with_pre_funded_pool.py
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin
Sponsee address: rK3iBZhTy4g7jF4C739jcHUk42jF1ndRo8

=== Preparing Payment transaction to create the sponsee's account ===

{
  "Account": "rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "rK3iBZhTy4g7jF4C739jcHUk42jF1ndRo8"
}

=== Submitting Payment transaction ===

Sponsee account created successfully!

=== Preparing SponsorshipSet transaction ===

{
  "Account": "rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rK3iBZhTy4g7jF4C739jcHUk42jF1ndRo8",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction ===

Sponsorship created successfully!
Sponsorship ID: A343B8BBE6614A6B849F10AB1391A3EA82D8D070AA2936325F427FB4FA37263B

=== Preparing sponsored DepositPreauth transaction ===

{
  "Account": "rK3iBZhTy4g7jF4C739jcHUk42jF1ndRo8",
  "TransactionType": "DepositPreauth",
  "SigningPubKey": "",
  "Sponsor": "rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin",
  "SponsorFlags": 3,
  "Authorize": "rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin"
}

=== Submitting sponsored DepositPreauth transaction ===

Transaction sponsored successfully!

=== Sponsorship Pool information ===

DepositPreauth ID: 277317B184278C483779721031A5189401A8BEFFC818A63A1744F41181D48577
DepositPreauth reserve sponsored by: rnLJPmVysiUnRSXfFEk3S24Aw66uEGEiin

Fee spent from the pool: 1 drops
Fee remaining in the pool: 999999 drops
Owner reserves spent: 1
Owner reserves remaining: 4
```

## Manage a sponsorship pool

```sh
python manage_sponsorship_pool.py
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: rfhJ7RWiiuHsWJzE72yBiSN9EWFzzbciqm
Sponsee address: rpiPHnM6heNapJERNFGtkH7f2RUkuA7Yfy

=== Preparing SponsorshipSet transaction ===

{
  "Account": "rfhJ7RWiiuHsWJzE72yBiSN9EWFzzbciqm",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rpiPHnM6heNapJERNFGtkH7f2RUkuA7Yfy",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction ===

Sponsorship created successfully!
Sponsorship ID: BC41EBF0F94FD7610EE9831A1AFC8E13FDE217BCDF018DE52274FFE3F0042A07

=== Submitting sponsored DepositPreauth transaction ===

Sponsorship pool:
  Fee amount:            999999 drops
  Owner reserves count:  4

=== Preparing SponsorshipSet transaction to top up sponsorship pool ===

{
  "Account": "rfhJ7RWiiuHsWJzE72yBiSN9EWFzzbciqm",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rpiPHnM6heNapJERNFGtkH7f2RUkuA7Yfy",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction ===

Sponsorship pool topped up successfully:
  Fee amount:            1999999 drops
  Owner reserves count:  9

=== Preparing SponsorshipSet transaction to delete the sponsorship ===

{
  "Account": "rfhJ7RWiiuHsWJzE72yBiSN9EWFzzbciqm",
  "TransactionType": "SponsorshipSet",
  "Flags": 1048576,
  "SigningPubKey": "",
  "Sponsee": "rpiPHnM6heNapJERNFGtkH7f2RUkuA7Yfy"
}

=== Submitting SponsorshipSet transaction ===

Sponsorship deleted successfully!

=== Reclaimed Funds ===

Unspent fee amount returned from pool: 1999999 drops
Sponsor balance "before" deletion:     97999998 drops
Sponsor balance "after" deletion:      99999996 drops
Delete transaction (fee paid):         1 drops
```

## Transfer a reserve sponsorship

```sh
python transfer_reserve_sponsorship.py
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor A address: raiNxmUnLnJ6spd3ZuYr5McojfMZXAFG2q
Sponsor B address: rpVJDsR8DP2AbLgjKMyeZirHw6ppeVm95a
Sponsee address:   rG5QVv9vJbdhKShWmp4bu5VEqyYwRqjc4S

=== Submitting unsponsored DepositPreauth transaction ===

DepositPreauth created successfully, with its reserve paid by the sponsee.
DepositPreauth ID: 6A5468141C6277BC3BE01EB988EE7B267D7C5EE269D7F801C8B81E68ECB51287

=== Preparing SponsorshipTransfer transaction to start the sponsorship ===

{
  "Account": "rG5QVv9vJbdhKShWmp4bu5VEqyYwRqjc4S",
  "TransactionType": "SponsorshipTransfer",
  "Fee": "1",
  "Sequence": 4278747,
  "Flags": 131072,
  "LastLedgerSequence": 4278769,
  "SigningPubKey": "",
  "Sponsor": "raiNxmUnLnJ6spd3ZuYr5McojfMZXAFG2q",
  "SponsorFlags": 2,
  "ObjectID": "6A5468141C6277BC3BE01EB988EE7B267D7C5EE269D7F801C8B81E68ECB51287"
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship started successfully!
DepositPreauth reserve now sponsored by: raiNxmUnLnJ6spd3ZuYr5McojfMZXAFG2q

=== Preparing SponsorshipTransfer transaction to reassign the sponsorship ===

{
  "Account": "rG5QVv9vJbdhKShWmp4bu5VEqyYwRqjc4S",
  "TransactionType": "SponsorshipTransfer",
  "Fee": "1",
  "Sequence": 4278748,
  "Flags": 262144,
  "LastLedgerSequence": 4278772,
  "SigningPubKey": "",
  "Sponsor": "rpVJDsR8DP2AbLgjKMyeZirHw6ppeVm95a",
  "SponsorFlags": 2,
  "ObjectID": "6A5468141C6277BC3BE01EB988EE7B267D7C5EE269D7F801C8B81E68ECB51287"
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship reassigned successfully!
DepositPreauth reserve now sponsored by: rpVJDsR8DP2AbLgjKMyeZirHw6ppeVm95a

=== Preparing SponsorshipTransfer transaction to end the sponsorship ===

{
  "Account": "rG5QVv9vJbdhKShWmp4bu5VEqyYwRqjc4S",
  "TransactionType": "SponsorshipTransfer",
  "Flags": 65536,
  "SigningPubKey": "",
  "ObjectID": "6A5468141C6277BC3BE01EB988EE7B267D7C5EE269D7F801C8B81E68ECB51287"
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship ended successfully!
The sponsee now pays the DepositPreauth entry's owner reserve again.
```
