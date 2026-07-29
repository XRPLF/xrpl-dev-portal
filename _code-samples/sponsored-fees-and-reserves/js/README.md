# Sponsored Fees and Reserves (JavaScript)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows. It also shows how to manage a sponsorship pool and transfer a reserve sponsorship.

Quick setup:

```sh
npm install
```

## Sponsor a transaction

```sh
node sponsorATransaction.js
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: rwejGqupp31MiuKQWMZrRj26zS8cKryeEp
Sponsee address: rnitfhgyFAqYmwXbGLewawtECH7dBGCvNG

=== Preparing Payment transaction to create the sponsee's account ===

{
  "TransactionType": "Payment",
  "Account": "rwejGqupp31MiuKQWMZrRj26zS8cKryeEp",
  "Destination": "rnitfhgyFAqYmwXbGLewawtECH7dBGCvNG",
  "Amount": "1",
  "Flags": 524288
}

=== Submitting Payment transaction ===

Sponsee account created successfully!
Account reserve sponsored by: rwejGqupp31MiuKQWMZrRj26zS8cKryeEp

=== Preparing sponsored DepositPreauth transaction ===

{
  "TransactionType": "DepositPreauth",
  "Account": "rnitfhgyFAqYmwXbGLewawtECH7dBGCvNG",
  "Authorize": "rwejGqupp31MiuKQWMZrRj26zS8cKryeEp",
  "Sponsor": "rwejGqupp31MiuKQWMZrRj26zS8cKryeEp",
  "SponsorFlags": 3,
  "Flags": 0,
  "Sequence": 4278789,
  "Fee": "1",
  "LastLedgerSequence": 4278809
}

=== Submitting sponsored DepositPreauth transaction ===

{
  "TransactionType": "DepositPreauth",
  "Flags": 0,
  "Sequence": 4278789,
  "LastLedgerSequence": 4278809,
  "SponsorFlags": 3,
  "Fee": "1",
  "SigningPubKey": "EDB4A3D95CEDA0F8B9C4FD8F6683368A1EF5950B1779B48ED08FD73DAF5154CDE6",
  "TxnSignature": "24AA668A10CD8184E9AC84990DB62876297428097CAEB05CBAFB095FCE06CA27FC9B4B7028DD6024A8AE4D8D5D2722A9854596DB478338382EF0DE536B77DC00",
  "Account": "rnitfhgyFAqYmwXbGLewawtECH7dBGCvNG",
  "Authorize": "rwejGqupp31MiuKQWMZrRj26zS8cKryeEp",
  "Sponsor": "rwejGqupp31MiuKQWMZrRj26zS8cKryeEp",
  "SponsorSignature": {
    "SigningPubKey": "EDD72E53C6FC8CA96A0ABEC60F2C99250983A9F85BA7771C5E269E2862B0D52CB3",
    "TxnSignature": "DD26DAC422C7F1EF6611248D00D774EDCE9A065D72AA147F83F545FD15983B4FCA488E74E38AA445DC3FC45A9329FE11CD211EDD56CABB7FB038DF06FCACDC0E"
  }
}
Transaction sponsored successfully!

=== Sponsorship Information ===

DepositPreauth ID: 66E78F44BA7059B079E1146901C41C61088FDFBB750776721E878FD6543AB177
DepositPreauth reserve sponsored by: rwejGqupp31MiuKQWMZrRj26zS8cKryeEp

Sponsor fee paid: 1 drops
Sponsor balance:  99999997 drops
Reserves sponsored (SponsoringOwnerCount): 1

Sponsee fee paid: 0 drops
Sponsee balance:  1 drops
Sponsee owner count: 1
```

## Sponsor a transaction with a pre-funded pool

```sh
node sponsorWithPreFundedPool.js
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS
Sponsee address: rUHrRx6nbravYVEr4GPRxwWLCGTe6vGtdC

=== Preparing Payment transaction to create the sponsee's account ===

{
  "TransactionType": "Payment",
  "Account": "r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS",
  "Destination": "rUHrRx6nbravYVEr4GPRxwWLCGTe6vGtdC",
  "Amount": "1",
  "Flags": 524288
}

=== Submitting Payment transaction ===

Sponsee account created successfully!

=== Preparing SponsorshipSet transaction ===

{
  "TransactionType": "SponsorshipSet",
  "Account": "r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS",
  "Sponsee": "rUHrRx6nbravYVEr4GPRxwWLCGTe6vGtdC",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction ===

Sponsorship created successfully!
Sponsorship ID: FDB97EE0E6735B984C417FA1C71CAD06C0E1432A32197ABAB94498676F2CE281

=== Preparing sponsored DepositPreauth transaction ===

{
  "TransactionType": "DepositPreauth",
  "Account": "rUHrRx6nbravYVEr4GPRxwWLCGTe6vGtdC",
  "Authorize": "r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS",
  "Sponsor": "r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS",
  "SponsorFlags": 3
}

=== Submitting sponsored DepositPreauth transaction ===

Transaction sponsored successfully!

=== Sponsorship Pool information ===

DepositPreauth ID: 482B66E9BCC7301B3FAEED12BE99E2E130A42610BB0D9FD74C2CE5F1C2BDC4F7
DepositPreauth reserve sponsored by: r4TPxpGEeX2Hugpgaan26N2Q8fvgLxkPMS

Fee spent from the pool: 1 drops
Fee remaining in the pool: 999999 drops
Owner reserves spent: 1
Owner reserves remaining: 4
```

## Manage a sponsorship pool

```sh
node manageSponsorshipPool.js
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor address: r4yaN7hKFS4TAxn82Zk43RK1wTA6zPsy4x
Sponsee address: rfxWPx5eGFuUxCaRT1jGpA3Bov5Gub3gP9

=== Preparing SponsorshipSet transaction ===

{
  "TransactionType": "SponsorshipSet",
  "Account": "r4yaN7hKFS4TAxn82Zk43RK1wTA6zPsy4x",
  "Sponsee": "rfxWPx5eGFuUxCaRT1jGpA3Bov5Gub3gP9",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction ===

Sponsorship created successfully!
Sponsorship ID: 29471C8F7802EC71A8802EC706098C4B54AB954A476DD4CCB5345459A8A3CDE0

=== Submitting sponsored DepositPreauth transaction ===

Sponsorship pool:
  Fee amount:            999999 drops
  Owner reserves count:  4

=== Preparing SponsorshipSet transaction to top up sponsorship pool ===

{
  "TransactionType": "SponsorshipSet",
  "Account": "r4yaN7hKFS4TAxn82Zk43RK1wTA6zPsy4x",
  "Sponsee": "rfxWPx5eGFuUxCaRT1jGpA3Bov5Gub3gP9",
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
  "TransactionType": "SponsorshipSet",
  "Account": "r4yaN7hKFS4TAxn82Zk43RK1wTA6zPsy4x",
  "Sponsee": "rfxWPx5eGFuUxCaRT1jGpA3Bov5Gub3gP9",
  "Flags": 1048576
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
node transferReserveSponsorship.js
```

You should see output similar to this:

```sh
=== Creating the sponsor and sponsee wallets ===

Sponsor A address: rpTEHbF8R3FWa9S9WNC7L8P8PPX7EzSHXe
Sponsor B address: rNMCToTCmcHsCDwYAAKbpnuazvvi543HA1
Sponsee address:   rhhuGQVZeeMc1eWDH6z2X4mZmL6c4egPfS

=== Submitting unsponsored DepositPreauth transaction ===

DepositPreauth created successfully, with its reserve paid by the sponsee.
DepositPreauth ID: F3A81F73E44467D6C30227C33C7395FED02A0DB66DB38BAD8791AA75F2B55025

=== Preparing SponsorshipTransfer transaction to start the sponsorship ===

{
  "TransactionType": "SponsorshipTransfer",
  "Account": "rhhuGQVZeeMc1eWDH6z2X4mZmL6c4egPfS",
  "ObjectID": "F3A81F73E44467D6C30227C33C7395FED02A0DB66DB38BAD8791AA75F2B55025",
  "Flags": 131072,
  "Sponsor": "rpTEHbF8R3FWa9S9WNC7L8P8PPX7EzSHXe",
  "SponsorFlags": 2,
  "Sequence": 4278814,
  "Fee": "1",
  "LastLedgerSequence": 4278834
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship started successfully!
DepositPreauth reserve now sponsored by: rpTEHbF8R3FWa9S9WNC7L8P8PPX7EzSHXe

=== Preparing SponsorshipTransfer transaction to reassign the sponsorship ===

{
  "TransactionType": "SponsorshipTransfer",
  "Account": "rhhuGQVZeeMc1eWDH6z2X4mZmL6c4egPfS",
  "ObjectID": "F3A81F73E44467D6C30227C33C7395FED02A0DB66DB38BAD8791AA75F2B55025",
  "Flags": 262144,
  "Sponsor": "rNMCToTCmcHsCDwYAAKbpnuazvvi543HA1",
  "SponsorFlags": 2,
  "Sequence": 4278815,
  "Fee": "1",
  "LastLedgerSequence": 4278835
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship reassigned successfully!
DepositPreauth reserve now sponsored by: rNMCToTCmcHsCDwYAAKbpnuazvvi543HA1

=== Preparing SponsorshipTransfer transaction to end the sponsorship ===

{
  "TransactionType": "SponsorshipTransfer",
  "Account": "rhhuGQVZeeMc1eWDH6z2X4mZmL6c4egPfS",
  "ObjectID": "F3A81F73E44467D6C30227C33C7395FED02A0DB66DB38BAD8791AA75F2B55025",
  "Flags": 65536
}

=== Submitting SponsorshipTransfer transaction ===

Sponsorship ended successfully!
The sponsee now pays the DepositPreauth entry's owner reserve again.
```
