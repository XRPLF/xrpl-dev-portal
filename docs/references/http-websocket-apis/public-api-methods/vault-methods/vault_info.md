---
seo:
    description: Retrieve information about a vault, its owner, available assets, and details on issued shares.
labels:
  - Single Asset Vault
---

# vault_info

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/VaultInfo.cpp "Source")

The `vault_info` command retrieves information about a vault, its owner, available assets, and details on issued shares. All information retrieved is relative to a particular version of the ledger. {% badge href="https://github.com/XRPLF/rippled/releases/tag/3.3.0" %}New in: rippled 3.3.0{% /badge %}

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "vault_info",
  "vault_id": "45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "vault_info",
  "params": [
    {
      "vault_id": "45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166"
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: vault_info [<vault_id>]
rippled vault_info 45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166
```
{% /tab %}

{% /tabs %}

<!-- TODO: Add this when available on Devnet -->
<!-- {% try-it method="vault_info" /%} -->

The request includes the following parameters:

| `Field`    | Type   | Description                                |
| :--------- | :----- | :----------------------------------------- |
| `vault_id` | String | The object ID of the Vault to be returned. |
| `owner`    | String | The account address of the Vault Owner.    |
| `seq`      | Number | The transaction sequence number that created the vault. |

You can provide either the `vault_id`, or both `owner` and `seq` values in the request.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "ledger_current_index": 222403,
    "validated": false,
    "vault": {
      "Account": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
      "Asset": {
        "currency": "USD",
        "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
      },
      "AssetsAvailable": "0",
      "AssetsMaximum": "1000000",
      "AssetsTotal": "0",
      "Data": "5661756C74206D65746164617461",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
      "OwnerNode": "0",
      "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
      "PreviousTxnLgrSeq": 219033,
      "Scale": 6,
      "Sequence": 200370,
      "ShareMPTID": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175",
      "WithdrawalPolicy": 1,
      "index": "45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166",
      "shares": {
        "AssetScale": 6,
        "Flags": 56,
        "Issuer": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B2274223A225473745368617265222C226E223A2254657374205661756C74205368617265222C2264223A22412074657374207661756C742073686172652E222C2269223A226578616D706C652E6F72672F73686172652D69636F6E2E706E67222C226163223A22727761222C226173223A22657175697479222C22696E223A224D53205465737420497373756572222C227573223A5B7B2275223A226578616D706C657969656C642E636F2F7473747368617265222C2263223A2277656273697465222C2274223A2250726F647563742050616765227D2C7B2275223A226578616D706C657969656C642E636F2F646F6373222C2263223A22646F6373222C2274223A225969656C6420546F6B656E20446F6373227D5D2C226169223A7B22766F6C6174696C697479223A226C6F77227D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
        "PreviousTxnLgrSeq": 219033,
        "Sequence": 1,
        "index": "10D193CFF4619D2C7D552746A8C9F76AD6335E6D4452712CB39F8C7F096AE474",
        "mpt_issuance_id": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175"
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
    "ledger_current_index": 222403,
    "status": "success",
    "validated": false,
    "vault": {
      "Account": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
      "Asset": {
        "currency": "USD",
        "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
      },
      "AssetsAvailable": "0",
      "AssetsMaximum": "1000000",
      "AssetsTotal": "0",
      "Data": "5661756C74206D65746164617461",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
      "OwnerNode": "0",
      "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
      "PreviousTxnLgrSeq": 219033,
      "Scale": 6,
      "Sequence": 200370,
      "ShareMPTID": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175",
      "WithdrawalPolicy": 1,
      "index": "45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166",
      "shares": {
        "AssetScale": 6,
        "Flags": 56,
        "Issuer": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B2274223A225473745368617265222C226E223A2254657374205661756C74205368617265222C2264223A22412074657374207661756C742073686172652E222C2269223A226578616D706C652E6F72672F73686172652D69636F6E2E706E67222C226163223A22727761222C226173223A22657175697479222C22696E223A224D53205465737420497373756572222C227573223A5B7B2275223A226578616D706C657969656C642E636F2F7473747368617265222C2263223A2277656273697465222C2274223A2250726F647563742050616765227D2C7B2275223A226578616D706C657969656C642E636F2F646F6373222C2263223A22646F6373222C2274223A225969656C6420546F6B656E20446F6373227D5D2C226169223A7B22766F6C6174696C697479223A226C6F77227D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
        "PreviousTxnLgrSeq": 219033,
        "Sequence": 1,
        "index": "10D193CFF4619D2C7D552746A8C9F76AD6335E6D4452712CB39F8C7F096AE474",
        "mpt_issuance_id": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175"
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
    "ledger_current_index": 222403,
    "validated": false,
    "vault": {
      "Account": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
      "Asset": {
        "currency": "USD",
        "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
      },
      "AssetsAvailable": "0",
      "AssetsMaximum": "1000000",
      "AssetsTotal": "0",
      "Data": "5661756C74206D65746164617461",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
      "OwnerNode": "0",
      "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
      "PreviousTxnLgrSeq": 219033,
      "Scale": 6,
      "Sequence": 200370,
      "ShareMPTID": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175",
      "WithdrawalPolicy": 1,
      "index": "45E6742527EDE6A2B537AE8A77B8D8CCFEFE115A22B3BF664A39407631F9A166",
      "shares": {
        "AssetScale": 6,
        "Flags": 56,
        "Issuer": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
        "LedgerEntryType": "MPTokenIssuance",
        "MPTokenMetadata": "7B2274223A225473745368617265222C226E223A2254657374205661756C74205368617265222C2264223A22412074657374207661756C742073686172652E222C2269223A226578616D706C652E6F72672F73686172652D69636F6E2E706E67222C226163223A22727761222C226173223A22657175697479222C22696E223A224D53205465737420497373756572222C227573223A5B7B2275223A226578616D706C657969656C642E636F2F7473747368617265222C2263223A2277656273697465222C2274223A2250726F647563742050616765227D2C7B2275223A226578616D706C657969656C642E636F2F646F6373222C2263223A22646F6373222C2274223A225969656C6420546F6B656E20446F6373227D5D2C226169223A7B22766F6C6174696C697479223A226C6F77227D7D",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "39CBBE3629AD9ADF9BA5CBAC5BF18665E785D0B199D2B2773A8A1EAA6CBC622B",
        "PreviousTxnLgrSeq": 219033,
        "Sequence": 1,
        "index": "10D193CFF4619D2C7D552746A8C9F76AD6335E6D4452712CB39F8C7F096AE474",
        "mpt_issuance_id": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175"
      }
    }
  },
  "status": "success"
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing following fields:

| `Field`                | Type             | Description |
| :--------------------- | :--------------- | :---------- |
| `ledger_hash`          | [Hash][]         | _(Omitted if `ledger_current_index` is provided instead)_ The identifying hash of the ledger version that was used when retrieving this data. |
| `ledger_current_index` | [Ledger Index][] | _(Omitted if `ledger_index` is provided instead)_ The [ledger index][] of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_index`         | [Ledger Index][] | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index][] of the ledger version used when retrieving this information. |
| `validated`            | Boolean          | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. |
| `vault`                | Object           | The [**Vault Description Object**](#vault-description-object) that represents the current status of the vault. |

### Vault Description Object

The `vault` field is an object describing the current status of a Vault entry in the ledger, and contains the following fields:

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
