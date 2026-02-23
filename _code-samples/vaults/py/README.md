# Single Asset Vault Examples (Python)

This directory contains Python examples demonstrating how to create, deposit into, and withdraw from single asset vaults on the XRP Ledger.

## Setup

Install dependencies before running any examples:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Create a Vault

```sh
python create_vault.py
```

The script should output the VaultCreate transaction, vault ID, and complete vault information:

```sh
Vault owner address: rfsTcqjyg7j2xfJFNbd9u8mt65yrGZvLnu
MPT issuance ID: 00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03
Permissioned domain ID: 76397457A19E093654F74848E5255E6111FDC0A2BF9FB2143F7C2C33424E1B3E


=== VaultCreate transaction ===
{
  "Account": "rfsTcqjyg7j2xfJFNbd9u8mt65yrGZvLnu",
  "TransactionType": "VaultCreate",
  "Flags": 65536,
  "SigningPubKey": "",
  "Asset": {
    "mpt_issuance_id": "00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03"
  },
  "Data": "7b226e223a20224c4154414d2046756e64204949222c202277223a20226578616d706c6566756e642e636f6d227d",
  "AssetsMaximum": "0",
  "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
  "DomainID": "76397457A19E093654F74848E5255E6111FDC0A2BF9FB2143F7C2C33424E1B3E",
  "WithdrawalPolicy": 1
}

=== Submitting VaultCreate transaction... ===
Vault created successfully!

Vault ID: 3E5BB3E4789603CC20D7A874ECBA36B74188F1B991EC9199DFA129FDB44D846D
Vault pseudo-account address: rPgYFS3qFrUYQ3qWpF9RLKc9ECkGhgADtm
Share MPT issuance ID: 00000001F8CD8CC81FFDDC9887627F42390E85DB32D44D0E

=== Getting vault_info... ===
{
  "ledger_hash": "5851C21E353DEDEC5C6CC285E1E9835C378DCBBE5BA69CF33124DAC7EE5A08AD",
  "ledger_index": 3693379,
  "validated": true,
  "vault": {
    "Account": "rPgYFS3qFrUYQ3qWpF9RLKc9ECkGhgADtm",
    "Asset": {
      "mpt_issuance_id": "00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03"
    },
    "Data": "7B226E223A20224C4154414D2046756E64204949222C202277223A20226578616D706C6566756E642E636F6D227D",
    "Flags": 65536,
    "LedgerEntryType": "Vault",
    "Owner": "rfsTcqjyg7j2xfJFNbd9u8mt65yrGZvLnu",
    "OwnerNode": "0",
    "PreviousTxnID": "4B29E4DBA09CBDCAF591792ACFFB5F8717AD230185207C10F10B2A405FB2D576",
    "PreviousTxnLgrSeq": 3693379,
    "Sequence": 3693375,
    "ShareMPTID": "00000001F8CD8CC81FFDDC9887627F42390E85DB32D44D0E",
    "WithdrawalPolicy": 1,
    "index": "3E5BB3E4789603CC20D7A874ECBA36B74188F1B991EC9199DFA129FDB44D846D",
    "shares": {
      "DomainID": "76397457A19E093654F74848E5255E6111FDC0A2BF9FB2143F7C2C33424E1B3E",
      "Flags": 60,
      "Issuer": "rPgYFS3qFrUYQ3qWpF9RLKc9ECkGhgADtm",
      "LedgerEntryType": "MPTokenIssuance",
      "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
      "OutstandingAmount": "0",
      "OwnerNode": "0",
      "PreviousTxnID": "4B29E4DBA09CBDCAF591792ACFFB5F8717AD230185207C10F10B2A405FB2D576",
      "PreviousTxnLgrSeq": 3693379,
      "Sequence": 1,
      "index": "EAD6924CB5DDA61CC5B85A6776A32E460FBFB0C34F5076A6A52005459B38043D",
      "mpt_issuance_id": "00000001F8CD8CC81FFDDC9887627F42390E85DB32D44D0E"
    }
  }
}
```

---

## Deposit into a Vault

```sh
python deposit.py
```

The script should output the vault state before and after the deposit, along with the depositor's share balance:

```sh
Depositor address: r4pfiPR5y4GTbajHXzUS29KBDHUdxR8kCK
Vault ID: 9966AF609568AFFCB3AEDEAC340B6AABB23C0483F013E186E83AF27EDA82C925
Asset MPT issuance ID: 00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03
Vault share MPT issuance ID: 00000001890BF384C217368D89BBB82B814B94B2597702B1

=== Getting initial vault state... ===
 - Total vault value: 1000
 - Available assets: 1000

=== Checking depositor's balance... ===
Balance: 9000

=== VaultDeposit transaction ===
{
  "Account": "r4pfiPR5y4GTbajHXzUS29KBDHUdxR8kCK",
  "TransactionType": "VaultDeposit",
  "SigningPubKey": "",
  "VaultID": "9966AF609568AFFCB3AEDEAC340B6AABB23C0483F013E186E83AF27EDA82C925",
  "Amount": {
    "mpt_issuance_id": "00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03",
    "value": "1"
  }
}

=== Submitting VaultDeposit transaction... ===
Deposit successful!

=== Vault state after deposit ===
 - Total vault value: 1001
 - Available assets: 1001

=== Depositor's share balance ===
Shares held: 1001
```

---

## Withdraw from a Vault

```sh
python withdraw.py
```

The script should output the vault state before and after the withdrawal, along with updated share and asset balances:

```sh
Depositor address: r4pfiPR5y4GTbajHXzUS29KBDHUdxR8kCK
Vault ID: 9966AF609568AFFCB3AEDEAC340B6AABB23C0483F013E186E83AF27EDA82C925
Asset MPT issuance ID: 00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03
Vault share MPT issuance ID: 00000001890BF384C217368D89BBB82B814B94B2597702B1

=== Getting initial vault state... ===
Initial vault state:
  Assets Total: 1001
  Assets Available: 1001

=== Checking depositor's share balance... ===
Shares held: 1001

=== Preparing VaultWithdraw transaction ===
{
  "Account": "r4pfiPR5y4GTbajHXzUS29KBDHUdxR8kCK",
  "TransactionType": "VaultWithdraw",
  "SigningPubKey": "",
  "VaultID": "9966AF609568AFFCB3AEDEAC340B6AABB23C0483F013E186E83AF27EDA82C925",
  "Amount": {
    "mpt_issuance_id": "00385B21AF216177F319AC73F25F0FCBCDA09330D1D50D03",
    "value": "1"
  }
}

=== Submitting VaultWithdraw transaction... ===
Withdrawal successful!

=== Vault state after withdrawal ===
  Assets Total: 1000
  Assets Available: 1000

=== Depositor's share balance ==
Shares held: 1000

=== Depositor's asset balance ==
Balance: 9000
```
