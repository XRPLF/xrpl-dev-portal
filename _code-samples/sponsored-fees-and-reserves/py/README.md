# Sponsored Fees and Reserves (Python)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows. Also shows how to manage a sponsorship pool and transfer a reserve sponsorship.

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr
Sponsee address: rE6xJKN6YskBej95nTnkMiNqeW7Kxmrt4m

=== Preparing Payment transaction to create the sponsee's account... ===
{
  "Account": "rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "rE6xJKN6YskBej95nTnkMiNqeW7Kxmrt4m"
}

=== Submitting Payment transaction... ===
Sponsee account created successfully!
Account reserve sponsored by: rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr
Transaction URL: https://devnet.xrpl.org/transactions/CA34F92D79AE74011790069CD1FAE5B1E548C6AEECA9932F6759A187B0C4A0E2

=== Preparing sponsored DepositPreauth transaction... ===
{
  "Account": "rE6xJKN6YskBej95nTnkMiNqeW7Kxmrt4m",
  "TransactionType": "DepositPreauth",
  "Fee": "1",
  "Sequence": 4658908,
  "LastLedgerSequence": 4658928,
  "SigningPubKey": "",
  "Sponsor": "rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr",
  "SponsorFlags": 3,
  "Authorize": "rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr"
}

=== Submitting sponsored DepositPreauth transaction... ===
{
  "Account": "rE6xJKN6YskBej95nTnkMiNqeW7Kxmrt4m",
  "TransactionType": "DepositPreauth",
  "Fee": "1",
  "Sequence": 4658908,
  "LastLedgerSequence": 4658928,
  "SigningPubKey": "ED09F6101225BBE8411259E88A5980ABEB68484731B181FA48FD222B8EB4BE4C27",
  "TxnSignature": "4AEAB6303792FC4C1FE884A0AB7AAAEAD8312E318D2201DC4B269434755CDF43A1CC5ABB43A4E9251755903657305358450EFD65F60DDF379DB8C685BA56960D",
  "Sponsor": "rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr",
  "SponsorFlags": 3,
  "SponsorSignature": {
    "SigningPubKey": "EDF2CC2229F5E1F8A2FA147BFFD9D16FC613E76F873E4239677B3D3B4764B996AD",
    "TxnSignature": "489E4E2F3709BC1398519DD51BB0EA42A12FC8EFC379D97DCD9684CEDDC0EEFEB824EEF5B18F0190BF179992FA4089D2FC1B9442FD8A43FD6D8BD993CC92B301"
  },
  "Authorize": "rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr"
}
Transaction sponsored successfully!
Transaction URL: https://devnet.xrpl.org/transactions/C276168D0F9300872F0CB53FC9D3BAA93F8F699F2B380CCC8A798EC0AB47A702

=== Sponsorship Information ===
DepositPreauth ID: BCC289E1336B7F6143A6580BA43568AD3FFA15DA9D0DE9EB0536215BCF23D480
DepositPreauth reserve sponsored by: rUZBDKMmUvQTjRzjrCvN25TAZAzmbk2wUr

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k
Sponsee address: r3juxgV44dmTtiEUBpjpde5Q53qQvdebE7

=== Preparing Payment transaction to create the sponsee's account... ===
{
  "Account": "rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "r3juxgV44dmTtiEUBpjpde5Q53qQvdebE7"
}

=== Submitting Payment transaction... ===
Sponsee account created successfully!
Transaction URL: https://devnet.xrpl.org/transactions/E74AF5B34FDA3C356BD6F7CFB4F92C0BBEA374666CDDAAD1C71E5A2874D50787

=== Preparing SponsorshipSet transaction... ===
{
  "Account": "rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "r3juxgV44dmTtiEUBpjpde5Q53qQvdebE7",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship created successfully!
Sponsorship ID: 3A8C48CB9FB10804803C66FF96DB910F71BB38EBA031D313E9EF722A4735FD0F
Transaction URL: https://devnet.xrpl.org/transactions/B91120941063C808E731F18867BCE4E04297F5EE43E1B4F82A1BECEE2C379847

=== Preparing sponsored DepositPreauth transaction... ===
{
  "Account": "r3juxgV44dmTtiEUBpjpde5Q53qQvdebE7",
  "TransactionType": "DepositPreauth",
  "SigningPubKey": "",
  "Sponsor": "rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k",
  "SponsorFlags": 3,
  "Authorize": "rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k"
}

=== Submitting sponsored DepositPreauth transaction... ===
Transaction sponsored successfully!
Transaction URL: https://devnet.xrpl.org/transactions/D5708AAFC60E52750B26A22233E7E2AF53951D5E383981C6FB51159CD0C02CFF

=== Sponsorship Pool information ===
DepositPreauth ID: D5D0BF35C372AB04D652BA6BB3C4F942095051E4D02B762980DEE30C0D5D09F2
DepositPreauth reserve sponsored by: rs9WfdA442ECu3H6cKRTNdi8RzoRgzEY2k

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor address: rfXfPXJ8HpYDW4ubyXeSiSAhmxS7SVYrLE
Sponsee address: rfMh63FHS2Xsy4BArFhi6h6PaN5sRWSbk5

=== Preparing SponsorshipSet transaction... ===
{
  "Account": "rfXfPXJ8HpYDW4ubyXeSiSAhmxS7SVYrLE",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rfMh63FHS2Xsy4BArFhi6h6PaN5sRWSbk5",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship created successfully!
Sponsorship ID: FFAD9709AF26F11AB0AC85DD111F01956D9DC5273399D2FD1F2B3E59DE2E212C
Transaction URL: https://devnet.xrpl.org/transactions/CDA7144962D4E7401C93C0E8925F50962DA88C9CF504A8768953C33B348707F4

=== Submitting sponsored DepositPreauth transaction... ===
Sponsorship pool:
  Fee amount:            999999 drops
  Owner reserves count:  4
Transaction URL: https://devnet.xrpl.org/transactions/40CD5EF5D260D6CEC65D726A2F379F09A7007D9E9137110BF65935AB4FF4052E

=== Preparing SponsorshipSet transaction to top up sponsorship pool... ===
{
  "Account": "rfXfPXJ8HpYDW4ubyXeSiSAhmxS7SVYrLE",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rfMh63FHS2Xsy4BArFhi6h6PaN5sRWSbk5",
  "FeeAmountDelta": "1000000",
  "MaxFee": "1000",
  "RemainingOwnerCountDelta": 5
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship pool topped up successfully:
  Fee amount:            1999999 drops
  Owner reserves count:  9
Transaction URL: https://devnet.xrpl.org/transactions/EEE76998F0460C69B538CE9BBD3FC5CA5865BB70AC58E068DA67136F9F1290A2

=== Preparing SponsorshipSet transaction to delete the sponsorship... ===
{
  "Account": "rfXfPXJ8HpYDW4ubyXeSiSAhmxS7SVYrLE",
  "TransactionType": "SponsorshipSet",
  "Flags": 1048576,
  "SigningPubKey": "",
  "Sponsee": "rfMh63FHS2Xsy4BArFhi6h6PaN5sRWSbk5"
}

=== Submitting SponsorshipSet transaction... ===
Sponsorship deleted successfully!
Transaction URL: https://devnet.xrpl.org/transactions/5B2FD9B785A73796DA5002FACA5EFCC47E9482E0055573AEFFF048588559CA94

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
=== Creating the sponsor and sponsee wallets... ===
Sponsor A address: r4Z4ofLNfJJfRverLXiwEdjkynjxeU7YTS
Sponsor B address: roN6ooZcG2oULERieUryT4uwZCBhXg9QL
Sponsee address:   rhx2iqm6PndpJS2yEMTsnjcjuU5zjb5WVc

=== Submitting unsponsored DepositPreauth transaction... ===
DepositPreauth created successfully, with its reserve paid by the sponsee.
DepositPreauth ID: F2EE779E76C14B217CB43190A7C84611DE01BE9527C664411E03044E581CE523
Transaction URL: https://devnet.xrpl.org/transactions/58C547F2A0EBAE6F4B4827BAAFD2B21CAC8F6E48E9368334FA8066DE7D6E7856

=== Preparing SponsorshipTransfer transaction to start the sponsorship... ===
{
  "Account": "rhx2iqm6PndpJS2yEMTsnjcjuU5zjb5WVc",
  "TransactionType": "SponsorshipTransfer",
  "Fee": "1",
  "Sequence": 4658892,
  "Flags": 131072,
  "LastLedgerSequence": 4658914,
  "SigningPubKey": "",
  "Sponsor": "r4Z4ofLNfJJfRverLXiwEdjkynjxeU7YTS",
  "SponsorFlags": 2,
  "ObjectID": "F2EE779E76C14B217CB43190A7C84611DE01BE9527C664411E03044E581CE523"
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship started successfully!
DepositPreauth reserve now sponsored by: r4Z4ofLNfJJfRverLXiwEdjkynjxeU7YTS
Transaction URL: https://devnet.xrpl.org/transactions/FEF55DCAD6FD6AB9D5FE90F8418340C17F6DBBF6CEC1D7B4F0B8B16ADE893BAF

=== Preparing SponsorshipTransfer transaction to reassign the sponsorship... ===
{
  "Account": "rhx2iqm6PndpJS2yEMTsnjcjuU5zjb5WVc",
  "TransactionType": "SponsorshipTransfer",
  "Fee": "1",
  "Sequence": 4658893,
  "Flags": 262144,
  "LastLedgerSequence": 4658916,
  "SigningPubKey": "",
  "Sponsor": "roN6ooZcG2oULERieUryT4uwZCBhXg9QL",
  "SponsorFlags": 2,
  "ObjectID": "F2EE779E76C14B217CB43190A7C84611DE01BE9527C664411E03044E581CE523"
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship reassigned successfully!
DepositPreauth reserve now sponsored by: roN6ooZcG2oULERieUryT4uwZCBhXg9QL
Transaction URL: https://devnet.xrpl.org/transactions/10BA7735C46A54DD49AD732AF02DD08673ECB177CEBBDD019CF9AE6DF7D8C2C8

=== Preparing SponsorshipTransfer transaction to end the sponsorship... ===
{
  "Account": "rhx2iqm6PndpJS2yEMTsnjcjuU5zjb5WVc",
  "TransactionType": "SponsorshipTransfer",
  "Flags": 65536,
  "SigningPubKey": "",
  "ObjectID": "F2EE779E76C14B217CB43190A7C84611DE01BE9527C664411E03044E581CE523"
}

=== Submitting SponsorshipTransfer transaction... ===
Sponsorship ended successfully!
The sponsee now pays the DepositPreauth entry's owner reserve again.
Transaction URL: https://devnet.xrpl.org/transactions/8E66CCBFBE1F4ACEFA1B01CB8A38E4ED50A5BE1D14ADCC5D659EE1C8D586AADE
```
