---
seo:
    description: Retrieve information about a vault, its owner, available assets, and details on issued shares.
labels:
  - Single Asset Vault
---

# vault_info

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/VaultInfo.cpp "Source")

The `vault_info` command retrieves information about a vault, its owner, available assets, and details on issued shares. All information retrieved is relative to a particular version of the ledger. {% badge href="https://github.com/XRPLF/rippled/releases/tag/3.1.0" %}New in: rippled 3.1.0{% /badge %}

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "vault_info",
  "vault_id": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "vault_info",
  "params": [
    {
      "vault_id": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA"
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: vault_info [<vault_id>]
rippled vault_info 9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA
```
{% /tab %}

{% /tabs %}

{% try-it method="vault_info" server="devnet" /%}

The request includes the following parameters:

| Field      | Type                 | Required? | Description                                             |
| :--------- | :------------------- | :-------- | :------------------------------------------------------ |
| `vault_id` | String               | No        | The [ledger entry ID][] of the `Vault` to be returned.  |
| `owner`    | String - [Address][] | No        | The account address of the `Vault` owner.               |
| `seq`      | Number               | No        | The transaction sequence number that created the vault. |

You can provide either the `vault_id`, or both `owner` and `seq` values in the request.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "ledger_current_index": 3280200,
    "validated": false,
    "vault": {
      "Account": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
      "Asset": {
        "mpt_issuance_id": "002F830036E4E56185F871D70CFFC7BDD554F897606BB6D3"
      },
      "Data": "50726976617465207661756C7420666F72207475746F7269616C73",
      "Flags": 65536,
      "LedgerEntryType": "Vault",
      "Owner": "rJdYtgaiEgzL7xD2QdPKg5xoHkWc7CZjvm",
      "OwnerNode": "0",
      "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
      "PreviousTxnLgrSeq": 3113735,
      "Sequence": 3113728,
      "ShareMPTID": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493",
      "WithdrawalPolicy": 1,
      "index": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA",
      "shares": {
        "DomainID": "17060E04AD63975CDE5E4B0C6ACB95ABFA2BA1D569473559448B6E556F261D4A",
        "Flags": 60,
        "Issuer": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C74222C2269223A226578616D706C652E636F6D2F7661756C742D7368617265732D69636F6E2E706E67222C22696E223A225661756C74204F776E6572222C226E223A225661756C7420536861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
        "PreviousTxnLgrSeq": 3113735,
        "Sequence": 1,
        "index": "F231A0382544EC0ABE810A9D292F3BD455A21CD13CC1DFF75EAFE957A1C8CAB4",
        "mpt_issuance_id": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493"
      }
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "ledger_hash": "DC8D26A6DC85C70A112F5D798A3B5AF599A730098AFCC20CE18BFE6ADA5E66F9",
    "ledger_index": 3279463,
    "status": "success",
    "validated": true,
    "vault": {
      "Account": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
      "Asset": {
        "mpt_issuance_id": "002F830036E4E56185F871D70CFFC7BDD554F897606BB6D3"
      },
      "Data": "50726976617465207661756C7420666F72207475746F7269616C73",
      "Flags": 65536,
      "LedgerEntryType": "Vault",
      "Owner": "rJdYtgaiEgzL7xD2QdPKg5xoHkWc7CZjvm",
      "OwnerNode": "0",
      "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
      "PreviousTxnLgrSeq": 3113735,
      "Sequence": 3113728,
      "ShareMPTID": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493",
      "WithdrawalPolicy": 1,
      "index": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA",
      "shares": {
        "DomainID": "17060E04AD63975CDE5E4B0C6ACB95ABFA2BA1D569473559448B6E556F261D4A",
        "Flags": 60,
        "Issuer": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C74222C2269223A226578616D706C652E636F6D2F7661756C742D7368617265732D69636F6E2E706E67222C22696E223A225661756C74204F776E6572222C226E223A225661756C7420536861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
        "PreviousTxnLgrSeq": 3113735,
        "Sequence": 1,
        "index": "F231A0382544EC0ABE810A9D292F3BD455A21CD13CC1DFF75EAFE957A1C8CAB4",
        "mpt_issuance_id": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493"
      }
    }
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "ledger_current_index": 3280200,
    "validated": false,
    "vault": {
      "Account": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
      "Asset": {
        "mpt_issuance_id": "002F830036E4E56185F871D70CFFC7BDD554F897606BB6D3"
      },
      "Data": "50726976617465207661756C7420666F72207475746F7269616C73",
      "Flags": 65536,
      "LedgerEntryType": "Vault",
      "Owner": "rJdYtgaiEgzL7xD2QdPKg5xoHkWc7CZjvm",
      "OwnerNode": "0",
      "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
      "PreviousTxnLgrSeq": 3113735,
      "Sequence": 3113728,
      "ShareMPTID": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493",
      "WithdrawalPolicy": 1,
      "index": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA",
      "shares": {
        "DomainID": "17060E04AD63975CDE5E4B0C6ACB95ABFA2BA1D569473559448B6E556F261D4A",
        "Flags": 60,
        "Issuer": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B226163223A2264656669222C226169223A7B226578616D706C655F696E666F223A2274657374227D2C2264223A2250726F706F7274696F6E616C206F776E65727368697020736861726573206F6620746865207661756C74222C2269223A226578616D706C652E636F6D2F7661756C742D7368617265732D69636F6E2E706E67222C22696E223A225661756C74204F776E6572222C226E223A225661756C7420536861726573222C2274223A22534841524531222C227573223A5B7B2263223A2277656273697465222C2274223A2241737365742057656273697465222C2275223A226578616D706C652E636F6D2F6173736574227D2C7B2263223A22646F6373222C2274223A22446F6373222C2275223A226578616D706C652E636F6D2F646F6373227D5D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
        "PreviousTxnLgrSeq": 3113735,
        "Sequence": 1,
        "index": "F231A0382544EC0ABE810A9D292F3BD455A21CD13CC1DFF75EAFE957A1C8CAB4",
        "mpt_issuance_id": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493"
      }
    }
  },
  "status": "success"
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

|  Field                 | Type             | Description |
| :--------------------- | :--------------- | :---------- |
| `ledger_hash`          | [Hash][]         | _(Omitted if either `ledger_current_index` or `ledger_index` is provided instead)_ The identifying hash of the ledger version that was used when retrieving this data. |
| `ledger_current_index` | [Ledger Index][] | _(Omitted if `ledger_index` is provided instead)_ The [ledger index][] of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_index`         | [Ledger Index][] | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index][] of the ledger version used when retrieving this information. |
| `validated`            | Boolean          | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |
| `vault`                | Object           | The [**Vault Description Object**](#vault-description-object) that represents the current status of the vault. |

### Vault Description Object

The `vault` field is an object describing the current status of a `Vault` entry in the ledger, and contains the following fields:

| `Field`                | Type                 | Description |
| :--------------------- | :------------------- | :---------- |
| `Account`              | String - [Address][] | The address of the vault's pseudo-account. |
| `Asset`                | Object               | The [**Asset**](#asset-object) of the vault. An asset can be XRP, a trust line token, or an MPT. |
| `AssetsAvailable`      | Number               | The asset amount that is available in the vault. |
| `AssetsMaximum`        | Number               | The maximum asset amount that can be held in the vault. If set to 0, this indicates there is no cap. |
| `AssetsTotal`          | Number               | The total value of the vault. |
| `Flags`                | String               | Set of bit-flags for this ledger object. |
| `LossUnrealized`       | Number               |  The potential loss amount that is not yet realized, expressed as the vault's asset. |
| `ShareMPTID`           | String               | The identifier of the share `MPTokenIssuance` object. |
| `WithdrawalPolicy`     | String               | Indicates the withdrawal strategy used by the vault. |
| `index`                | String               | The unique index of the vault ledger entry.  |
| `shares`               | Object               | A [**Shares Object**](#shares-object) containing details about the vault's issued shares.  |
| `Scale`                | Number               | Specifies decimal precision for share calculations. Assets are multiplied by 10<sup>Scale</sup > to convert fractional amounts into whole number shares. For example, with a `Scale` of `6`, depositing 20.3 units creates 20,300,000 shares (20.3 × 10<sup>Scale</sup >). For **trust line tokens** this can be configured at vault creation, and valid values are between 0-18, with the default being `6`. For **XRP** and **MPTs**, this is fixed at `0`. |

### Asset Object

The `asset` object contains the following nested fields:

| `Field`                | Type                 | Description |
| :--------------------- | :------------------- | :---------- |
| `currency`             | String               | _(Omitted if the asset is an MPT)_ The currency code of the asset stored in the vault. |
| `issuer`               | String - [Address][] | _(Omitted if the asset is XRP or an MPT)_ The address of the asset issuer. |
| `mpt_issuance_id`      | String               | _(Omitted if the asset is XRP or a trust line token)_ The identifier of the asset's `MPTokenIssuance` object. |

### Shares Object

The `shares` object contains the following nested fields:

| `Field`                | Type             | Description |
| :--------------------- | :--------------- | :---------- |
| `DomainID`             | String           | _(Omitted if the vault is public)_ The permissioned domain associated with the vault's shares. |
| `Flags`                | Number           | Set of bit-flags for this ledger object. |
| `Issuer`               | String           | The address issuing the shares. This is always the vault's pseudo-account. |
| `LedgerEntryType`      | String           | The ledger object type (i.e., `MPTokenIssuance`). |
| `OutstandingAmount`    | String           | The total outstanding shares issued. |
| `OwnerNode`            | String           | Identifies the page where this item is referenced in the owner's directory. |
| `PreviousTxnID`        | String           | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq`    | Number           | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `Sequence`             | Number           | The transaction sequence number that created the shares. |
| `index`                | String           | The unique index of the shares ledger entry.  |
| `mpt_issuance_id`      | String           | The identifier of the `MPTokenIssuance` object. This is always equal to the vault's `ShareMPTID`. |
| `AssetScale`           | Number           | The decimal precision for share calculations. |

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
