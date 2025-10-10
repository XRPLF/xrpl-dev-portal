---
seo:
    description: Definition of a Multi-Purpose Token (MPT) issuance.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
status: not_enabled
---
# MPTokenIssuance

An `MPTokenIssuance` entry represents a single [MPT](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance and holds data associated with the issuance itself. You can create an `MPTokenIssuance` using an [MPTokenIssuanceCreate transaction][], and can delete it with an [MPTokenIssuanceDestroy transaction][].

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenIssuance JSON

```json
{
    "LedgerEntryType": "MPTokenIssuance",
    "Flags": 131072,
    "Issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "AssetScale": 2,
    "MaximumAmount": "100000000",
    "OutstandingAmount": "100",
    "TransferFee": 50000,
    "MPTokenMetadata": "7B227469636B6572223A20225442494C4C222C20226E616D65223A2022542D42696C6C205969656C6420546F6B656E222C202264657363223A202241207969656C642D62656172696E6720737461626C65636F696E206261636B65642062792073686F72742D7465726D20552E532E205472656173757269657320616E64206D6F6E6579206D61726B657420696E737472756D656E74732E222C202269636F6E223A202268747470733A2F2F6578616D706C652E6F72672F7462696C6C2D69636F6E2E706E67222C202261737365745F636C617373223A2022727761222C202261737365745F737562636C617373223A20227472656173757279222C20226973737565725F6E616D65223A20224578616D706C65205969656C6420436F2E222C202275726C73223A205B7B2275726C223A202268747470733A2F2F6578616D706C657969656C642E636F2F7462696C6C222C202274797065223A202277656273697465222C20227469746C65223A202250726F647563742050616765227D2C207B2275726C223A202268747470733A2F2F6578616D706C657969656C642E636F2F646F6373222C202274797065223A2022646F6373222C20227469746C65223A20225969656C6420546F6B656E20446F6373227D5D2C20226164646974696F6E616C5F696E666F223A207B22696E7465726573745F72617465223A2022352E303025222C2022696E7465726573745F74797065223A20227661726961626C65222C20227969656C645F736F75726365223A2022552E532E2054726561737572792042696C6C73222C20226D617475726974795F64617465223A2022323034352D30362D3330222C20226375736970223A2022393132373936525830227D7D",
    "OwnerNode": "74"
}
```

{% admonition type="success" name="Tip" %}
By convention, the metadata should decode to JSON data describing what the MPT represents. The [XLS-89 specification](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema) defines a recommended format for metadata. The above `MPTokenMetadata` field encodes the sample JSON from the spec, as a UTF-8 string with minimal whitespace.
{% /admonition %}

## MPTokenIssuance Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field Name          | JSON Type            | Internal Type | Required? | Description |
|:--------------------|:---------------------|:--------------|:----------|:------------|
| `Issuer`            | String - [Address][] | AccountID     | Yes       | The address of the account that controls both the issuance amounts and characteristics of a particular fungible token. |
| `AssetScale`        | Number               | UInt8         | Yes       | Where to put the decimal place when displaying amounts of this MPT. More formally, the asset scale is a non-negative integer (0, 1, 2, …) such that one standard unit equals 10^(-scale) of a corresponding fractional unit. For example, if a US Dollar Stablecoin has an asset scale of _2_, then 1 unit of that MPT would equal 0.01 US Dollars. This indicates to how many decimal places the MPT can be subdivided. The default is `0`, meaning that the MPT cannot be divided into smaller than 1 unit. |
| `MaximumAmount`     | String - Number      | UInt64        | No        | The maximum number of MPTs that can exist at one time. If omitted, the maximum is currently limited to 2<sup>63</sup>-1. |
| `OutstandingAmount` | String - Number      | UInt64        | Yes       | The total amount of MPTs of this issuance currently in circulation. This value increases when the issuer sends MPTs to a non-issuer, and decreases whenever the issuer receives MPTs. |
| `LockedAmount`      | String - Number      | UInt64        | No        | The amount of tokens currently locked up (for example, in escrow). This amount is already included in the `OutstandingAmount`. {% amendment-disclaimer name="TokenEscrow" /%} |
| `TransferFee`       | Number               | UInt16        | Yes       | This value specifies the fee, in tenths of a basis point, charged by the issuer for secondary sales of the token, if such sales are allowed at all. Valid values for this field are between 0 and 50,000 inclusive. A value of 1 is equivalent to 1/10 of a basis point or 0.001%, allowing transfer rates between 0% and 50%. A `TransferFee` of 50,000 corresponds to 50%. The default value for this field is 0. Any decimals in the transfer fee are rounded down. The fee can be rounded down to zero if the payment is small. Issuers should make sure that their MPT's `AssetScale` is large enough. |
| `MPTokenMetadata`   | String - Hexadecimal | Blob          | Yes       | Arbitrary metadata about this issuance, in hex format. The limit for this field is 1024 bytes. |
| `OwnerNode`         | String - Hexadecimal | UInt64        | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String - Hexadecimal | UInt256       | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number               | UInt32        | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`          | Number               | UInt32        | Yes       | The `Sequence` (or `Ticket`) number of the transaction that created this issuance. This helps to uniquely identify the issuance and distinguish it from any other later MPT issuances created by this account. |

### MPTokenIssuance Flags

Flags are properties or other options associated with the `MPToken` object. Except for `lsfMPTLocked`, which can be mutated via  `MPTokenIssuanceSet` transactions, these flags are immutable: they can only be set during the `MPTokenIssuanceCreate` transaction and cannot be changed later.


| Flag Name           | Flag Value   | Description                                     |
|:--------------------|:-------------|:------------------------------------------------|
| `lsfMPTLocked`      | `0x00000001` | If set, indicates that all balances are locked. |
| `lsfMPTCanLock`     | `0x00000002` | If set, indicates that the issuer can lock an individual balance or all balances of this MPT. If not set, the MPT cannot be locked in any way. |
| `lsfMPTRequireAuth` | `0x00000004` | If set, indicates that individual holders must be authorized. This enables issuers to limit who can hold their assets. |
| `lsfMPTCanEscrow`   | `0x00000008` | If set, indicates that individual holders can place their balances into an escrow. |
| `lsfMPTCanTrade`    | `0x00000010` | If set, indicates that individual holders can trade their balances using the XRP Ledger DEX or AMM. |
| `lsfMPTCanTransfer` | `0x00000020` | If set, indicates that tokens held by non-issuers can be transferred to other accounts. If not set, indicates that tokens held by non-issuers cannot be transferred except back to the issuer; this enables use cases such as store credit. |
| `lsfMPTCanClawback` | `0x00000040` | If set, indicates that the issuer may use the `Clawback` transaction to claw back value from individual holders. |

## MPTokenIssuanceID

The ID of an `MPTokenIssuance` entry is the [SHA-512Half][] of the following values, concatenated in order:

- The `MPTokenIssuance` space key (0x007E).
- The transaction sequence number.
- The `AccountID` of the issuer.

The `MPTokenIssuanceID` is a 192-bit integer, concatenated in order:

- The transaction sequence number.
- The AccountID of the issuer.

## See Also

- **Transactions:**
   - [MPTokenIssuanceCreate transaction][]
   - [MPTokenIssuanceDestroy transaction][]
   - [MPTokenIssuanceSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
