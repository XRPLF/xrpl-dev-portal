---
seo:
    description: Set mutable properties of a Multi-Purpose Token definition.
labels:
    - Multi-purpose Tokens, MPTs
    - Tokens
requiredAmendment: MPTokensV1
txIcon: modify
---
# MPTokenIssuanceSet
{% source-link path="src/libxrpl/tx/transactors/token/MPTokenIssuanceSet.cpp" /%}

Update a mutable property of a [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance, including locking (freezing) or unlocking the tokens globally or for an individual holder.

{% amendment-disclaimer name="MPTokensV1" /%}


## Example MPTokenIssuanceSet JSON

This example locks the balances of all holders of the specified MPT issuance.

```json
{
    "TransactionType": "MPTokenIssuanceSet",
    "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
    "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
    "Fee": "10",
    "Flags": 1,
    "Sequence": 99536577
}
```

{% tx-example txid="5DB41F975E3AC04DD4AE9E93764AFBBABB0E4C7322B2D6F2E84B253FAA170BF3" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type            | [Internal Type][] | Required? | Description |
|:--------------------|:---------------------|:------------------|:----------|-------------|
| `DomainID`          | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain that grants access to the MPT. An empty value or `0` removes the permissioned domain from the MPT issuance so that only users who are explicitly approved by the issuer can send and receive the MPT. You can only set a `DomainID` if the MPT issuance has [**Require Auth**](/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens#transferability-controls) enabled. {% amendment-disclaimer name="PermissionedDomains" /%} {% amendment-disclaimer name="SingleAssetVault" /%} |
| `MPTokenIssuanceID` | String - Hexadecimal | UInt192           | Yes       | The identifier of the `MPTokenIssuance` to update. |
| `Holder`            | String - [Address][] | AccountID         | No        | An individual token holder. If provided, apply changes to the given holder's balance of the given MPT issuance. If omitted, apply to all accounts holding the given MPT issuance. |
| `MPTokenMetadata`   | String - Hexadecimal | Blob              | No        | New metadata to replace the existing value. Setting an empty value removes the field. Mutable by default; can't be updated if the `MPTokenMetadata` field was made immutable. {% amendment-disclaimer name="DynamicMPT" /%} |
| `TransferFee`       | Number               | UInt16            | No        | The new transfer fee value. Setting this to zero removes the field. Mutable by default; can't be updated if the `TransferFee` field was made immutable. See [Transfer Fee Rules](#transfer-fee-rules). {% amendment-disclaimer name="DynamicMPT" /%} |
| `ImmutableFlags`    | Number               | UInt32            | No        | A bitwise combination of flags declaring which fields and capability-setting flags become immutable and can never be changed again after this transaction. See [MPTokenIssuanceSet Immutable Flags](#mptokenissuanceset-immutable-flags). {% amendment-disclaimer name="DynamicMPT" /%} |


## MPTokenIssuanceSet Flags

Transactions of the `MPTokenIssuanceSet` type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name             | Hex Value    | Decimal Value | Description |
|:----------------------|:-------------|:--------------|:------------|
| `tfMPTLock`           | `0x00000001` | 1             | Lock the balances of this MPT issuance. Can only be combined with a `Holder` or `DomainID` in the same transaction. |
| `tfMPTUnlock`         | `0x00000002` | 2             | Unlock the balances of this MPT issuance. Can only be combined with a `Holder` or `DomainID` in the same transaction. |
| `tfMPTSetCanLock`     | `0x00000004` | 4             | Enable the MPT's **Can Lock** flag, which lets the issuer lock and unlock holders' balances. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tfMPTSetRequireAuth` | `0x00000008` | 8             | Enable the MPT's **Require Auth** flag, which requires individual holders to be authorized. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tfMPTSetCanEscrow`   | `0x00000010` | 16            | Enable the MPT's **Can Escrow** flag, which lets holders place their balances into escrow. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tfMPTSetCanTrade`    | `0x00000020` | 32            | Enable the MPT's **Can Trade** flag, which lets holders trade their balances on the XRP Ledger DEX or AMM. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tfMPTSetCanTransfer` | `0x00000040` | 64            | Enable the MPT's **Can Transfer** flag, which lets tokens be transferred to accounts other than the issuer. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tfMPTSetCanClawback` | `0x00000080` | 128           | Enable the MPT's **Can Clawback** flag, which lets the issuer claw back value from individual holders. Once enabled, this flag cannot be disabled. {% amendment-disclaimer name="DynamicMPT" /%} |

Note that a single transaction can enable more than one capability-setting flag (`tfMPTSet...`) at once, and can also update the `MPTokenMetadata`, `TransferFee`, and `ImmutableFlags` fields in the same transaction. These changes can't be combined with a `tfMPTLock` or `tfMPTUnlock` flag, or with a `Holder`. {% amendment-disclaimer name="DynamicMPT" /%}

## MPTokenIssuanceSet Immutable Flags

{% amendment-disclaimer name="DynamicMPT" /%}

The following flags are set in the `ImmutableFlags` field, which is separate from the `Flags` field. Setting a flag makes the corresponding field or capability-setting flag immutable.

{% admonition type="warning" name="Caution" %}
**Immutability is permanent.** A field or flag declared immutable can never be changed, so declare a property immutable only if you're absolutely sure you don't want to change it in future.
{% /admonition %}

| Flag Name           | Hex Value    | Decimal Value | Description |
|:------------------- |:-------------|:--------------|:------------|
| `tifMPTCanLock`     | `0x00000002` | 2             | If enabled, the **Can Lock** flag, which gives the issuer the power to lock and unlock holders' balances, cannot be changed. |
| `tifMPTRequireAuth` | `0x00000004` | 4             | If enabled, the **Require Auth** flag, which indicates that individual holders must be authorized, cannot be changed. |
| `tifMPTCanEscrow`   | `0x00000008` | 8             | If enabled, the **Can Escrow** flag, which indicates that the token can be placed in escrow, cannot be changed. |
| `tifMPTCanTrade`    | `0x00000010` | 16            | If enabled, the **Can Trade** flag, which indicates that individual holders can trade their balances using the XRP Ledger DEX or AMM, cannot be changed. |
| `tifMPTCanTransfer` | `0x00000020` | 32            | If enabled, the **Can Transfer** flag, which indicates that tokens held by non-issuers can be transferred to other accounts, cannot be changed. |
| `tifMPTCanClawback` | `0x00000040` | 64            | If enabled, the **Can Clawback** flag, which indicates that the issuer can claw back value from individual holders, cannot be changed. |
| `tifMPTMetadata`    | `0x00010000` | 65536         | If enabled, the `MPTokenMetadata` field cannot be modified. |
| `tifMPTTransferFee` | `0x00020000` | 131072        | If enabled, the `TransferFee` field cannot be modified. |


## Transfer Fee Rules

{% amendment-disclaimer name="DynamicMPT" /%}

The `TransferFee` field is mutable by default. Whether you can set or remove it depends on two conditions:

- The `TransferFee` field must not be immutable. If it was made immutable with `tifMPTTransferFee`, any attempt to set it fails.
- A non-zero `TransferFee` requires the **Can Transfer** flag. This flag must either already be enabled on the issuance, or be enabled in the same transaction with `tfMPTSetCanTransfer`.

Assuming the field is not immutable, the following table describes how setting a zero or non-zero `TransferFee` behaves. The first column represents whether **Can Transfer** is enabled, either already set on the `MPTokenIssuance` object on-ledger, or being enabled in the same transaction with `tfMPTSetCanTransfer`. The second column represents the `TransferFee` value being set in the transaction.

| Can Transfer | Transfer Fee Value | Result | Description |
|:-------------|:-------------------|:-------|:------------|
| Enabled      | Non-zero           | ✅ | Sets the `TransferFee` field. |
| Enabled      | Zero               | ✅ | Removes the `TransferFee` field. |
| Not enabled  | Non-zero           | ❌ | A non-zero fee requires **Can Transfer**. |
| Not enabled  | Zero               | ✅ | No effect; there is no `TransferFee` to remove. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:--------------------------|:------------|
| `temDISABLED`             | Common causes include:<br>- The `MPTokensV1` amendment is disabled.<br>- You include a `DomainID` field in the transaction, but the `PermissionedDomains` and `SingleAssetVault` amendments aren't both enabled.<br>- The `ImmutableFlags`, `MPTokenMetadata`, or `TransferFee` field is present, but the `DynamicMPT` amendment is not enabled. {% amendment-disclaimer name="DynamicMPT" mode="updated" /%} |
| `temBAD_TRANSFER_FEE`     | The `TransferFee` exceeds the maximum allowed value of 50,000. {% amendment-disclaimer name="DynamicMPT" /%} |
| `temINVALID_FLAG`         | You can receive this error if:<br>- Both `tfMPTLock` and `tfMPTUnlock` are set.<br>- The `ImmutableFlags` field is present but contains no flags or an undefined flag. {% amendment-disclaimer name="DynamicMPT" /%} |
| `tecNO_DST`               | The account specified in the `Holder` field doesn't exist. |
| `tecNO_PERMISSION`        | You can receive this error if:<br>- The **Can Lock** flag isn't enabled, but you are attempting to lock or unlock an MPT.<br>- You attempt to modify a field or enable a capability-setting flag that was made immutable. {% amendment-disclaimer name="DynamicMPT" mode="updated" /%} |
| `temMALFORMED`            | Besides generally malformed transactions, you can receive this error if:<br>- You specified both a `DomainID` and a `Holder`; only one can be set in a single transaction.<br>- You specified the same account for both `Account` and `Holder`.<br>- The transaction isn't changing anything; it must either update a flag or modify the DomainID.<br>- A lock or unlock flag is combined with a field update or the enabling of a capability-setting flag in the same transaction. {% amendment-disclaimer name="DynamicMPT" mode="updated" /%} |
| `tecOBJECT_NOT_FOUND`    | The specified `MPToken`, `MPTokenIssuance`, or `PermissionedDomain` ledger entry doesn't exist. |


## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
