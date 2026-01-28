# Single Asset Vault Examples (JavaScript)

This directory contains JavaScript examples demonstrating how to create, deposit into, and withdraw from single asset vaults on the XRP Ledger.

## Setup

Install dependencies before running any examples:

```sh
npm i
```

---

## Create a Vault

```sh
node createVault.js
```

The script should output the VaultCreate transaction, vault ID, and complete vault information:

```sh
Vault owner address: rLXZNDSS7gWvQZKunRUFiaViSiHo1yd4Ms
MPT issuance ID: 0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4
Permissioned domain ID: 3BB81D0D164456A2D74720F63FD923F16DE08FB3223D3ED103D09F525A8D69D1


=== VaultCreate transaction ===
{
  "TransactionType": "VaultCreate",
  "Account": "rLXZNDSS7gWvQZKunRUFiaViSiHo1yd4Ms",
  "Asset": {
    "mpt_issuance_id": "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"
  },
  "Flags": 65536,
  "DomainID": "3BB81D0D164456A2D74720F63FD923F16DE08FB3223D3ED103D09F525A8D69D1",
  "Data": "50726976617465207661756C74",
  "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
  "AssetsMaximum": "0",
  "WithdrawalPolicy": 1
}

=== Submitting VaultCreate transaction... ===
Vault created successfully!

Vault ID: 9D25282C143F0F7F71F0E6FC7ABB3BD6FB30B7DCF04DF4A1E31C701B1B332D29
Vault pseudo-account address: rnBAKKEBBTqswakdeJJkZtBs9SRgpMkThj
Share MPT issuance ID: 000000012DF200D67FF9DA7686FF8B6F32097337D7765211

=== Getting vault_info... ===
{
  "api_version": 2,
  "id": 12,
  "result": {
    "ledger_hash": "73B53C0608A9C87C2B97314F0BAD109F236C4A95FB53FE4E8CEAEFE826A1E7AB",
    "ledger_index": 597229,
    "validated": true,
    "vault": {
      "Account": "rnBAKKEBBTqswakdeJJkZtBs9SRgpMkThj",
      "Asset": {
        "mpt_issuance_id": "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"
      },
      "Data": "50726976617465207661756C74",
      "Flags": 65536,
      "LedgerEntryType": "Vault",
      "Owner": "rLXZNDSS7gWvQZKunRUFiaViSiHo1yd4Ms",
      "OwnerNode": "0",
      "PreviousTxnID": "8B64609225F802258250824B2C6C0A8B752AB8CBB6FAF64D433DC2F35C09E131",
      "PreviousTxnLgrSeq": 597229,
      "Sequence": 597228,
      "ShareMPTID": "000000012DF200D67FF9DA7686FF8B6F32097337D7765211",
      "WithdrawalPolicy": 1,
      "index": "9D25282C143F0F7F71F0E6FC7ABB3BD6FB30B7DCF04DF4A1E31C701B1B332D29",
      "shares": {
        "DomainID": "3BB81D0D164456A2D74720F63FD923F16DE08FB3223D3ED103D09F525A8D69D1",
        "Flags": 60,
        "Issuer": "rnBAKKEBBTqswakdeJJkZtBs9SRgpMkThj",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "8B64609225F802258250824B2C6C0A8B752AB8CBB6FAF64D433DC2F35C09E131",
        "PreviousTxnLgrSeq": 597229,
        "Sequence": 1,
        "index": "4C3CC0AF1FE27EBE364F02AFF889D73D1F6F7CB5ED6126D1CD605E8952E18302",
        "mpt_issuance_id": "000000012DF200D67FF9DA7686FF8B6F32097337D7765211"
      }
    }
  },
  "type": "response"
}
```

---

## Deposit into a Vault

```sh
node deposit.js
```

The script should output the vault state before and after the deposit, along with the depositor's share balance:

```sh
Depositor address: rnEmvWahVbNXzs8zGjhEfkBwo41Zn5wDDU
Vault ID: 6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF
Asset MPT issuance ID: 0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4
Vault share MPT issuance ID: 0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5

=== Getting initial vault state... ===
 - Total vault value: 1
 - Available assets: 1

=== Checking depositor's balance... ===
Balance: 9937

=== VaultDeposit transaction ===
{
  "TransactionType": "VaultDeposit",
  "Account": "rnEmvWahVbNXzs8zGjhEfkBwo41Zn5wDDU",
  "VaultID": "6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF",
  "Amount": {
    "mpt_issuance_id": "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4",
    "value": "1"
  }
}

=== Submitting VaultDeposit transaction... ===
Deposit successful!

=== Vault state after deposit ===
 - Total vault value: 2
 - Available assets: 2

=== Depositor's share balance ==
Shares held: 2
```

---

## Withdraw from a Vault

```sh
node withdraw.js
```

The script should output the vault state before and after the withdrawal, along with updated share and asset balances:

```sh
Depositor address: rnEmvWahVbNXzs8zGjhEfkBwo41Zn5wDDU
Vault ID: 6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF
Asset MPT issuance ID: 0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4
Vault share MPT issuance ID: 0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5

=== Getting initial vault state... ===
Initial vault state:
  Assets Total: 2
  Assets Available: 2

=== Checking depositor's share balance... ===
Shares held: 2

=== Preparing VaultWithdraw transaction ===
{
  "TransactionType": "VaultWithdraw",
  "Account": "rnEmvWahVbNXzs8zGjhEfkBwo41Zn5wDDU",
  "VaultID": "6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF",
  "Amount": {
    "mpt_issuance_id": "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4",
    "value": "1"
  }
}

=== Submitting VaultWithdraw transaction... ===
Withdrawal successful!

=== Vault state after withdrawal ===
  Assets Total: 1
  Assets Available: 1

=== Depositor's share balance ==
Shares held: 1

=== Depositor's asset balance ==
Balance: 9937
```
