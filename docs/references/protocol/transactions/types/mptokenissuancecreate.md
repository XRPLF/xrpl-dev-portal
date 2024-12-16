---
html: mptokenissuancecreate.html
parent: transaction-types.html
blurb: Issue a new Multi-purpose Token.
labels:
 - Multi-purpose Tokens, MPTs
---

# MPTokenIssuanceCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/MPTokenIssuanceCreate.cpp "Source")

{% partial file="/docs/_snippets/mpts-disclaimer.md" /%}

The `MPTokenIssuanceCreate` transaction creates an MPTokenIssuance <!--[MPTokenIssuance](mptokenissuance.html)--> object and adds it to the relevant directory node of the creator account. This transaction is the only opportunity an issuer has to specify any token fields that are defined as immutable (for example, MPT Flags).

If the transaction is successful, the newly created token is owned by the account (the creator account) that executed the transaction.

Whenever your query returns an `MPTokenIssuance` transaction response, there will always be an `mpt_issuance_id` field on the Transaction Metadata page.

## Example MPTokenIssuanceCreate JSON

This example assumes that the issuer of the token is the signer of the transaction.

```json
Example MPTokenIssuanceCreate transaction
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
  "AssetScale": "2",
  "TransferFee": 314,
  "MaximumAmount": "50000000",
  "Flags": 83659,
  "MPTokenMetadata": "FOO",
  "Fee": 10
}
```

## MPTokenIssuanceCreate Fields

<!-- {% include '_snippets/tx-fields-intro.md' %} -->

| Field           | JSON Type           | [Internal Type][] | Description        |
|:----------------|:--------------------|:------------------|:-------------------|
| `TransactionType` | string              | UInt16            | Indicates the new transaction type MPTokenIssuanceCreate. |
| `AssetScale`      | number              | UInt8             | (Optional) An asset scale is the difference, in orders of magnitude, between a standard unit and a corresponding fractional unit. More formally, the asset scale is a non-negative integer (0, 1, 2, …) such that one standard unit equals 10^(-scale) of a corresponding fractional unit. If the fractional unit equals the standard unit, then the asset scale is 0. Note that this value is optional, and will default to 0 if not supplied. |
| `Flags`           | number              | UInt16            | Specifies the flags for this transaction. See [MPTokenIssuanceCreate Flags](#mptokenissuancecreate-flags). |
| `TransferFee`      | number             | UInt16            | (Optional) The value specifies the fee to charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values for this field are between 0 and 50,000 inclusive, allowing transfer rates of between 0.000% and 50.000% in increments of 0.001. The field _must not_ be present if the tfMPTCanTransfer flag is not set. If it is, the transaction should fail and a fee should be claimed. |
| `MaximumAmount`   | string              | UInt64            | (Optional) The maximum asset amount of this token that should ever be issued, as a base 10 encoded string. For issuances that do not have a maximum limit, set this value to 9,223,372,036,854,775,807 (2^63-1). |
| `MPTokenMetadata` | string              | Blob              | Arbitrary metadata about this issuance, in hex format. The limit for this field is 1024 bytes. |

## MPTokenIssuanceCreate Flags

Transactions of the MPTokenIssuanceCreate type support additional values in the `Flags` field <!-- [`Flags` field](transaction-common-fields.html#flags-field)-->, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTCanLock`     | `0x00000002`     | `2`           | If set, indicates that the MPT can be locked both individually and globally. If not set, the MPT cannot be locked in any way. |
| `tfMPTRequireAuth` | `0x00000004`     | `4`           | If set, indicates that individual holders must be authorized. This enables issuers to limit who can hold their assets. |
| `tfMPTCanEscrow`   | `0x00000008`     | `8`           | If set, indicates that individual holders can place their balances into an escrow. |
| `tfMPTCanTrade`    | `0x00000010`     | `16`          | If set, indicates that individual holders can trade their balances using the XRP Ledger DEX. |
| `tfMPTCanTransfer` | `0x00000020`     | `32`          | If set, indicates that tokens can be transferred to other accounts that are not the issuer. |
| `tfMPTCanClawback` | `0x00000040`     | `64`          | If set, indicates that the issuer can use the Clawback transaction to claw back value from individual holders. |

