# Sponsored Fees and Reserves (JavaScript)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows. Also shows how to manage a sponsorship pool and transfer a reserve sponsorship.

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn
Sponsee address: rBua89quDdN8FM7UsNc2JTPpFZQKuHyW5p

=== Preparing Payment transaction to create the sponsee's account... ===
{
  "TransactionType": "Payment",
  "Account": "rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn",
  "Destination": "rBua89quDdN8FM7UsNc2JTPpFZQKuHyW5p",
  "Amount": "1",
  "Flags": 524288
}

=== Submitting Payment transaction... ===
Sponsee account created successfully!
Account reserve sponsored by: rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn
Transaction URL: https://devnet.xrpl.org/transactions/25597CA48C911A329E5E3112C6CD5E572AF8C05A04B709A3897132E9828EA921

=== Preparing sponsored DepositPreauth transaction... ===
{
  "TransactionType": "DepositPreauth",
  "Account": "rBua89quDdN8FM7UsNc2JTPpFZQKuHyW5p",
  "Authorize": "rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn",
  "Sponsor": "rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn",
  "SponsorFlags": 3,
  "Flags": 0,
  "Sequence": 4658814,
  "Fee": "1",
  "LastLedgerSequence": 4658834
}

=== Submitting sponsored DepositPreauth transaction... ===
{
  "TransactionType": "DepositPreauth",
  "Flags": 0,
  "Sequence": 4658814,
  "LastLedgerSequence": 4658834,
  "SponsorFlags": 3,
  "Fee": "1",
  "SigningPubKey": "EDF9B614E38DBFB5B66703C29A3E0905D8EF93876991580DEDFE0FD26DBFA13599",
  "TxnSignature": "4576FF48E6563A4386B49E9ACCE5C074DB5CFCBE902F0B2B24D758C06340EE885E11C743BCA840BF09024708AE834A1ECC094CF86CEA8B1614CADB70EA932002",
  "Account": "rBua89quDdN8FM7UsNc2JTPpFZQKuHyW5p",
  "Authorize": "rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn",
  "Sponsor": "rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn",
  "SponsorSignature": {
    "SigningPubKey": "ED9698E818625CD45D0500EC8FB5E299655B6D2D94FD670E8FFD66955070B6E1DA",
    "TxnSignature": "9C6FB70756BF85B8281799706EF424A08D6A622CB13222CB65D8B1426BF15649D82B9C295D13040DFD714851B5190FFED89E0556E75793E1DA2EDDA8A7B25305"
  }
}
Transaction sponsored successfully!
Transaction URL: https://devnet.xrpl.org/transactions/6681920C0780D77D62A0A9EE134550883DC4E42DBE0C6A55CBC318F0C77855EB

=== Sponsorship Information ===
DepositPreauth ID: 478A85D84D05EAF0728532AF3CFB17A3AAC0C70AE84E7CC3BA806A35C2E3F984
DepositPreauth reserve sponsored by: rwBnZ717YQJBr3r4JA6Zh7VEPM3TihYAn

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc
Sponsee address: rDNZyXRwSTXFJt5azHvBYS8QAAgUerPCBV

=== Preparing Payment transaction to create the sponsee's account... ===
{
  "TransactionType": "Payment",
  "Account": "rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc",
  "Destination": "rDNZyXRwSTXFJt5azHvBYS8QAAgUerPCBV",
  "Amount": "1",
  "Flags": 524288
}

=== Submitting Payment transaction... ===
Sponsee account created successfully!
Transaction URL: https://devnet.xrpl.org/transactions/13B49585EF2DC00CEDA90F1795FDAE0C8D678993C0367A365F6A5FA31AD9A79D

=== Preparing SponsorshipSet transaction... ===
{
  "TransactionType": "SponsorshipSet",
  "Account": "rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc",
  "Sponsee": "rDNZyXRwSTXFJt5azHvBYS8QAAgUerPCBV",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship created successfully!
Sponsorship ID: 5D3309812B9EC7D225DAA1426273E1EFD3B635E44EBFE978561A614EF1A51284
Transaction URL: https://devnet.xrpl.org/transactions/7C5CD7C30AC03CB0A76FEB9109B54D77A7EC4C8C8FE519CAC7FC8A0EF70A6EBB

=== Preparing sponsored DepositPreauth transaction... ===
{
  "TransactionType": "DepositPreauth",
  "Account": "rDNZyXRwSTXFJt5azHvBYS8QAAgUerPCBV",
  "Authorize": "rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc",
  "Sponsor": "rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc",
  "SponsorFlags": 3
}

=== Submitting sponsored DepositPreauth transaction... ===
Transaction sponsored successfully!
Transaction URL: https://devnet.xrpl.org/transactions/35A33AE61BD4EB0808C44C75F75E9C848BEB5F8EB55FE31FF6FF067CE3F55162

=== Sponsorship Pool information ===
DepositPreauth ID: DBC78EF0627B2A0CDB4FC24F2D4E04179158376D4ED8867A3720C91E89AA7520
DepositPreauth reserve sponsored by: rDFcVKJevMD5xrUwLbez9HP1tciFjST1Lc

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rMsuxcTBPW5wQKhqGrkEMW975oU4ZYaayu
Sponsee address: raQxWDs36XL5UiTux2ZexwQ9he25ZPbi4u

=== Preparing SponsorshipSet transaction... ===
{
  "TransactionType": "SponsorshipSet",
  "Account": "rMsuxcTBPW5wQKhqGrkEMW975oU4ZYaayu",
  "Sponsee": "raQxWDs36XL5UiTux2ZexwQ9he25ZPbi4u",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship created successfully!
Sponsorship ID: 6EF4402894AD6856C0D87B4BF44DB947721C18129C17A40DDC6CEC2D2733CE24
Transaction URL: https://devnet.xrpl.org/transactions/904AF62250BEFFFA423F92D84B3E6D1684BA14B0A915052DE412BA80906BD84E

=== Submitting sponsored DepositPreauth transaction... ===
Sponsorship pool:
  Fee amount:            999999 drops
  Owner reserves count:  4
Transaction URL: https://devnet.xrpl.org/transactions/4D1DCFFE9DB153FF738086225D5F7096AEC90479A2D9D75CF68109687B839BDB

=== Preparing SponsorshipSet transaction to top up sponsorship pool... ===
{
  "TransactionType": "SponsorshipSet",
  "Account": "rMsuxcTBPW5wQKhqGrkEMW975oU4ZYaayu",
  "Sponsee": "raQxWDs36XL5UiTux2ZexwQ9he25ZPbi4u",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship pool topped up successfully:
  Fee amount:            1999999 drops
  Owner reserves count:  9
Transaction URL: https://devnet.xrpl.org/transactions/A9ECCE3907F57361E6E8FF65E0ACC73CF14512610D98CD4CAF9E1E127054A27B

=== Preparing SponsorshipSet transaction to delete the sponsorship... ===
{
  "TransactionType": "SponsorshipSet",
  "Account": "rMsuxcTBPW5wQKhqGrkEMW975oU4ZYaayu",
  "Sponsee": "raQxWDs36XL5UiTux2ZexwQ9he25ZPbi4u",
  "Flags": 1048576
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship deleted successfully!
Transaction URL: https://devnet.xrpl.org/transactions/00ABCA71C518D4C43273C50A5BC8D87DA10C69F598D409287D76ED0812DDF6B5

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor A address: rUAcaMZ1r5ZKKXNA3aJ31SzCg9C9Ytbo3B
Sponsor B address: rHJZhAPzrVu9asLuUxAtcgPQ1SAPXesb8n
Sponsee address:   r4kfnPi4EAvmhN5xDH88eZY7Nk8hGgtVHB

=== Submitting unsponsored DepositPreauth transaction... ===
DepositPreauth created successfully, with its reserve paid by the sponsee.
DepositPreauth ID: 726C0DACD6C1D23C6932ECA1936C3B15A9AD3A846AD402C1AE3B6BF8F22E6CE5
Transaction URL: https://devnet.xrpl.org/transactions/F48F4B3F55BFA0F693AF1EC4F570FCEC68D99C246A7E5C8531E5721807077EF1

=== Preparing SponsorshipTransfer transaction to start the sponsorship... ===
{
  "TransactionType": "SponsorshipTransfer",
  "Account": "r4kfnPi4EAvmhN5xDH88eZY7Nk8hGgtVHB",
  "ObjectID": "726C0DACD6C1D23C6932ECA1936C3B15A9AD3A846AD402C1AE3B6BF8F22E6CE5",
  "Flags": 131072,
  "Sponsor": "rUAcaMZ1r5ZKKXNA3aJ31SzCg9C9Ytbo3B",
  "SponsorFlags": 2,
  "Sequence": 4658802,
  "Fee": "1",
  "LastLedgerSequence": 4658823
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship started successfully!
DepositPreauth reserve now sponsored by: rUAcaMZ1r5ZKKXNA3aJ31SzCg9C9Ytbo3B
Transaction URL: https://devnet.xrpl.org/transactions/1054C144D6E6BDA9A1ED6CEC7EEF38B357D64103076AFB42825DEC373AE67CD0

=== Preparing SponsorshipTransfer transaction to reassign the sponsorship... ===
{
  "TransactionType": "SponsorshipTransfer",
  "Account": "r4kfnPi4EAvmhN5xDH88eZY7Nk8hGgtVHB",
  "ObjectID": "726C0DACD6C1D23C6932ECA1936C3B15A9AD3A846AD402C1AE3B6BF8F22E6CE5",
  "Flags": 262144,
  "Sponsor": "rHJZhAPzrVu9asLuUxAtcgPQ1SAPXesb8n",
  "SponsorFlags": 2,
  "Sequence": 4658803,
  "Fee": "1",
  "LastLedgerSequence": 4658825
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship reassigned successfully!
DepositPreauth reserve now sponsored by: rHJZhAPzrVu9asLuUxAtcgPQ1SAPXesb8n
Transaction URL: https://devnet.xrpl.org/transactions/E0F5EE52F939CE5C1689DE57F3981D25A898D0CA0BFCF23BE5AEC0531D5FC7D0

=== Preparing SponsorshipTransfer transaction to end the sponsorship... ===
{
  "TransactionType": "SponsorshipTransfer",
  "Account": "r4kfnPi4EAvmhN5xDH88eZY7Nk8hGgtVHB",
  "ObjectID": "726C0DACD6C1D23C6932ECA1936C3B15A9AD3A846AD402C1AE3B6BF8F22E6CE5",
  "Flags": 65536
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship ended successfully!
The sponsee now pays the DepositPreauth entry's owner reserve again.
Transaction URL: https://devnet.xrpl.org/transactions/5E6373439738B4881F8E6B2036AFD72303D6EB9F90F76AFC6F90004BA9F05259
```
