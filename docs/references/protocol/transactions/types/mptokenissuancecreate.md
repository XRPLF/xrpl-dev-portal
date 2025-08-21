---
blurb: Issue a new Multi-purpose Token.
labels:
 - Multi-purpose Tokens, MPTs
---

# MPTokenIssuanceCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceCreate.cpp "Source")

The `MPTokenIssuanceCreate` transaction creates an [MPTokenIssuance](../../ledger-data/ledger-entry-types/mptokenissuance.md) object and adds it to the relevant directory node of the creator account. This transaction is the only opportunity an issuer has to specify any token fields that are defined as immutable (for example, MPT Flags).

If the transaction is successful, the newly created token is owned by the account (the creator account) that executed the transaction.

Whenever your query returns an `MPTokenIssuance` transaction response, there will always be an `mpt_issuance_id` field on the Transaction Metadata page.

_(Requires the [MPTokensV1 amendment][] {% not-enabled /%}.)_

## Example MPTokenIssuanceCreate JSON

This example assumes that the issuer of the token is the signer of the transaction.

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
  "AssetScale": 2,
  "TransferFee": 314,
  "MaximumAmount": "50000000",
  "Flags": 83659,
  "MPTokenMetadata": "7B227469636B6572223A20225442494C4C222C20226E616D65223A2022542D42696C6C205969656C6420546F6B656E222C202264657363223A202241207969656C642D62656172696E6720737461626C65636F696E206261636B65642062792073686F72742D7465726D20552E532E205472656173757269657320616E64206D6F6E6579206D61726B657420696E737472756D656E74732E222C202269636F6E223A202268747470733A2F2F6578616D706C652E6F72672F7462696C6C2D69636F6E2E706E67222C202261737365745F636C617373223A2022727761222C202261737365745F737562636C617373223A20227472656173757279222C20226973737565725F6E616D65223A20224578616D706C65205969656C6420436F2E222C202275726C73223A205B7B2275726C223A202268747470733A2F2F6578616D706C657969656C642E636F2F7462696C6C222C202274797065223A202277656273697465222C20227469746C65223A202250726F647563742050616765227D2C207B2275726C223A202268747470733A2F2F6578616D706C657969656C642E636F2F646F6373222C202274797065223A2022646F6373222C20227469746C65223A20225969656C6420546F6B656E20446F6373227D5D2C20226164646974696F6E616C5F696E666F223A207B22696E7465726573745F72617465223A2022352E303025222C2022696E7465726573745F74797065223A20227661726961626C65222C20227969656C645F736F75726365223A2022552E532E2054726561737572792042696C6C73222C20226D617475726974795F64617465223A2022323034352D30362D3330222C20226375736970223A2022393132373936525830227D7D",
  "Fee": "10"
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type            | [Internal Type][] | Required? | Description |
|:------------------|:---------------------|:------------------|:----------|:------------|
| `AssetScale`      | Number               | UInt8             | No        | Where to put the decimal place when displaying amounts of this MPT. More formally, the asset scale is a non-negative integer (0, 1, 2, …) such that one standard unit equals 10^(-scale) of a corresponding fractional unit. For example, if a US Dollar Stablecoin has an asset scale of _2_, then 1 unit of that MPT would equal 0.01 US Dollars. This indicates to how many decimal places the MPT can be subdivided. If omitted, the default is 0, meaning that the MPT cannot be divided into smaller than 1 unit. |
| `DomainID`        | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain that will manage access to the MPT. You must set the `tfMPTRequireAuth` flag to use permissioned domains. _(Requires the [PermissionedDomains amendment][] and [SingleAssetVault amendment][])_ |
| `TransferFee`     | Number               | UInt16            | No        | The value specifies the fee to charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values for this field are between 0 and 50,000 inclusive, allowing transfer rates of between 0.000% and 50.000% in increments of 0.001. The field _must not_ be present if the tfMPTCanTransfer flag is not set. If it is, the transaction should fail and a fee should be claimed. |
| `MaximumAmount`   | String - Number      | UInt64            | No        | The maximum asset amount of this token that can ever be issued, as a base-10 number encoded as a string. The current default maximum limit is 9,223,372,036,854,775,807 (2^63-1). _This limit may increase in the future. If an upper limit is required, you must specify this field._ |
| `MPTokenMetadata` | String - Hexadecimal | Blob              | No        | Arbitrary metadata about this issuance. The limit for this field is 1024 bytes. By convention, the metadata should decode to JSON data describing what the MPT represents. The [XLS-89d specification](https://github.com/XRPLF/XRPL-Standards/pull/293) defines a recommended format for metadata. |

## MPTokenIssuanceCreate Flags

Transactions of the MPTokenIssuanceCreate type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTCanLock`     | `0x00000002` | `2`           | If set, indicates that the MPT can be locked both individually and globally. If not set, the MPT cannot be locked in any way. |
| `tfMPTRequireAuth` | `0x00000004` | `4`           | If set, indicates that individual holders must be authorized. This enables issuers to limit who can hold their assets. |
| `tfMPTCanEscrow`   | `0x00000008` | `8`           | If set, indicates that individual holders can place their balances into an escrow. |
| `tfMPTCanTrade`    | `0x00000010` | `16`          | If set, indicates that individual holders can trade their balances using the XRP Ledger DEX. |
| `tfMPTCanTransfer` | `0x00000020` | `32`          | If set, indicates that tokens can be transferred to other accounts that are not the issuer. |
| `tfMPTCanClawback` | `0x00000040` | `64`          | If set, indicates that the issuer can use the `Clawback` transaction to claw back value from individual holders. |

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:--------------------------|:------------|
| `temDISABLED`             | The `MPTokensV1` amendment is disabled. You will also receive this error if you include a `DomainID` field in the transaction, and either the `PermissionedDomains` or `SingleAssetVault` amendment is disabled. |
| `temMALFORMED`            | The `DomainID` points to an invalid permissioned domain; you can also receive this error if you include a `DomainID` without setting the `tfMPTRequireAuth` flag. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
