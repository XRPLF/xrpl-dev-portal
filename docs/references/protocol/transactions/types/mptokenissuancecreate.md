---
seo:
    description: Define the properties of a new Multi-Purpose Token (MPT).
labels:
    - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceCreate.cpp "Source")

Creates a new [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance, which defines the properties of those MPTs. This is a prerequisite to actually issuing the tokens.

If the transaction is successful, it creates an [MPTokenIssuance entry][] where the sender of the transaction is the MPT's issuer.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenIssuanceCreate JSON

This example assumes that the issuer of the token is the signer of the transaction.

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "AssetScale": 4,
  "TransferFee": 0,
  "MaximumAmount": "50000000",
  "Flags": 83659,
  "MPTokenMetadata": "7B2274223A225442494C4C222C226E223A22542D42696C6C205969656C6420546F6B656E222C2264223A2241207969656C642D62656172696E6720737461626C65636F696E206261636B65642062792073686F72742D7465726D20552E532E205472656173757269657320616E64206D6F6E6579206D61726B657420696E737472756D656E74732E222C2269223A226578616D706C652E6F72672F7462696C6C2D69636F6E2E706E67222C226163223A22727761222C226173223A227472656173757279222C22696E223A224578616D706C65205969656C6420436F2E222C227573223A5B7B2275223A226578616D706C657969656C642E636F2F7462696C6C222C2263223A2277656273697465222C2274223A2250726F647563742050616765227D2C7B2275223A226578616D706C657969656C642E636F2F646F6373222C2263223A22646F6373222C2274223A225969656C6420546F6B656E20446F6373227D5D2C226169223A7B22696E7465726573745F72617465223A22352E303025222C22696E7465726573745F74797065223A227661726961626C65222C227969656C645F736F75726365223A22552E532E2054726561737572792042696C6C73222C226D617475726974795F64617465223A22323034352D30362D3330222C226375736970223A22393132373936525830227D7D",
  "Fee": "12",
  "Flags": 122,
  "Sequence": 99536574
}
```

{% tx-example txid="F4491A84EE3BC27A2F5B63FEBF0CB310368E27E9EF07E00A46F1DC2764852133" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type            | [Internal Type][] | Required? | Description |
|:------------------|:---------------------|:------------------|:----------|:------------|
| `AssetScale`      | Number               | UInt8             | No        | Where to put the decimal place when displaying amounts of this MPT. More formally, the asset scale is a non-negative integer (0, 1, 2, …) such that one standard unit equals 10^(-scale) of a corresponding fractional unit. For example, if a US Dollar Stablecoin has an asset scale of _2_, then 1 unit of that MPT would equal 0.01 US Dollars. This indicates to how many decimal places the MPT can be subdivided. If omitted, the default is 0, meaning that the MPT cannot be divided into smaller than 1 unit. |
| `DomainID`        | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain that grants access to the MPT. You must set the `tfMPTRequireAuth` flag to use permissioned domains.<br>{% amendment-disclaimer name="PermissionedDomains" /%}<br>{% amendment-disclaimer name="SingleAssetVault" /%} |
| `TransferFee`     | Number               | UInt16            | No        | The value specifies the fee to charged by the issuer for secondary sales of the Token, if such sales are allowed. Valid values for this field are between 0 and 50,000 inclusive, allowing transfer rates of between 0.000% and 50.000% in increments of 0.001. The field _must not_ be present if the tfMPTCanTransfer flag is not set. If it is, the transaction should fail and a fee should be claimed. |
| `MaximumAmount`   | String - Number      | UInt64            | No        | The maximum asset amount of this token that can ever be issued, as a base-10 number encoded as a string. The current default maximum limit is 9,223,372,036,854,775,807 (2^63-1). _This limit may increase in the future. If an upper limit is required, you must specify this field._ |
| `MPTokenMetadata` | String - Hexadecimal | Blob              | No        | Arbitrary metadata about this issuance. The limit for this field is 1024 bytes. By convention, the metadata should decode to JSON data describing what the MPT represents. The [XLS-89 specification](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema) defines a recommended format for metadata. |

{% admonition type="success" name="Tip" %}
For an example of how to encode metadata for the `MPTokenMetadata` field, see {% repo-link path="_code-samples/issue-mpt-with-metadata/" %}Code Sample: Issue MPT with Metadata{% /repo-link %}.
{% /admonition %}

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
| `tecDIR_FULL`             | The owner directory of the account creating the `MPTokenIssuance` ledger entry is full. |
| `temBAD_TRANSFER_FEE`     | The transfer fee specified is greater than the maximum allowed value of 50,000. |
| `temDISABLED`             | The `MPTokensV1` amendment is disabled. You will also receive this error if you include a `DomainID` field in the transaction, but the `PermissionedDomains` and `SingleAssetVault` amendments are both disabled. |
| `tecINSUFFICIENT_RESERVE` | The account creating the `MPTokenIssuance` ledger entry doesn't have enough XRP to meet the owner reserve. |
| `temMALFORMED`            | - A non-zero transfer fee is set, but the `tfMPTCanTransfer` flag is _not_ set.<br>- The `DomainID` points to an invalid permissioned domain; you can also receive this error if you include a `DomainID` without setting the `tfMPTRequireAuth` flag.<br>- The `MPTokenMetadata` field is an invalid length (0 or exceeds 1024 bytes).<br>- The `MaximumAmount` field is 0 or exceeds 9,223,372,036,854,775,807 (2^63-1). |


## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
