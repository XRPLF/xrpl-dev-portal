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
Vault owner address: rNy1EuyDgBDE3d8nsDSz94vVhBSTDkWmR9
MPT issuance ID: 005012226C561192AC49DD839820C7AF6167D896E70C710D
Permissioned domain ID: 6E522F2362D04E06A7A0DB59FB07D96AFDA7A8F7C26C1C6045144BFC545A8346


=== VaultCreate transaction ===
{
  "TransactionType": "VaultCreate",
  "Account": "rNy1EuyDgBDE3d8nsDSz94vVhBSTDkWmR9",
  "Asset": {
    "mpt_issuance_id": "005012226C561192AC49DD839820C7AF6167D896E70C710D"
  },
  "Flags": 65536,
  "DomainID": "6E522F2362D04E06A7A0DB59FB07D96AFDA7A8F7C26C1C6045144BFC545A8346",
  "Data": "7B226E223A224C4154414D2046756E64204949222C2277223A226578616D706C6566756E642E636F6D227D",
  "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
  "AssetsMaximum": "0",
  "WithdrawalPolicy": 1,
  "VaultKind": 1,
  "SubscriptionDate": 845105490,
  "RedemptionDate": 876641490
}

=== Submitting VaultCreate transaction... ===
Vault created successfully!

Vault ID: 5E4008EBCDDA931A0AA0542191C2D7E1B2B092DE084E030FB7E0B457F3C2110D
Vault pseudo-account address: rNmeC4agdAvbs7Ugn5xKqpe5FDnsaRru7M
Share MPT issuance ID: 00000001970B602DC14255431BBD613C1B1D0931F30DAF55
Subscription closes: 10/12/2026, 12:31:30 AM
Redemption opens: 10/12/2027, 12:31:30 AM

=== Getting vault_info... ===
{
  "api_version": 2,
  "id": 18,
  "result": {
    "ledger_hash": "DBBB3BB812470272992F7ACF2AA0934BA9D81FC4B73B1ADA12A2D7C256751E2B",
    "ledger_index": 5247532,
    "validated": true,
    "vault": {
      "Account": "rNmeC4agdAvbs7Ugn5xKqpe5FDnsaRru7M",
      "Asset": {
        "mpt_issuance_id": "005012226C561192AC49DD839820C7AF6167D896E70C710D"
      },
      "Data": "7B226E223A224C4154414D2046756E64204949222C2277223A226578616D706C6566756E642E636F6D227D",
      "Flags": 65536,
      "LEVersion": 1,
      "LedgerEntryType": "Vault",
      "Owner": "rNy1EuyDgBDE3d8nsDSz94vVhBSTDkWmR9",
      "OwnerNode": "0",
      "PreviousTxnID": "C04B7EC4FCF3F48ADC54E4C48D3E2EF43EE1233B7E501BAB16DEBFF684FE230F",
      "PreviousTxnLgrSeq": 5247532,
      "RedemptionDate": 876641490,
      "Sequence": 5247531,
      "ShareMPTID": "00000001970B602DC14255431BBD613C1B1D0931F30DAF55",
      "SubscriptionDate": 845105490,
      "VaultKind": 1,
      "WithdrawalPolicy": 1,
      "index": "5E4008EBCDDA931A0AA0542191C2D7E1B2B092DE084E030FB7E0B457F3C2110D",
      "shares": {
        "DomainID": "6E522F2362D04E06A7A0DB59FB07D96AFDA7A8F7C26C1C6045144BFC545A8346",
        "Flags": 60,
        "Issuer": "rNmeC4agdAvbs7Ugn5xKqpe5FDnsaRru7M",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C742E222C2269223A226578616D706C652E636F6D2F61737365742D69636F6E2E706E67222C22696E223A22417373657420497373756572204E616D65222C226E223A225661756C7420736861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "C04B7EC4FCF3F48ADC54E4C48D3E2EF43EE1233B7E501BAB16DEBFF684FE230F",
        "PreviousTxnLgrSeq": 5247532,
        "ReferenceHolding": "AE4BC1E458029701103F7EDD53A98E7548AA83DDA0942E336F2D15EBB4316AB5",
        "Sequence": 1,
        "index": "FDEEBD51FF560A4D49D3858FAF8A492759B0933DF9924CB73FEE4CB2586841B7",
        "mpt_issuance_id": "00000001970B602DC14255431BBD613C1B1D0931F30DAF55"
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
