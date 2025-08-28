---
seo:
    description: Retrieve information about a specific vault in the XRP Ledger.
labels:
  - Single Asset Vault
---

# vault_info

[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/xrpld/rpc/handlers/VaultInfo.cpp "Source")<br/>

The `vault_info` command retrieves information about a vault, its owner, available assets, and details on issued shares. All information retrieved is relative to a particular version of the ledger.

<!-- 
{% badge href="https://github.com/XRPLF/rippled/releases/tag/<add-version-here>" %}New in: rippled <add-version-here>{% /badge %} -->

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "vault_info",
  "vault_id": "C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "vault_info",
  "params": [
    {
      "vault_id": "C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52"
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: vault_info [<vault_id>]
rippled vault_info C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52
```
{% /tab %}

{% /tabs %}

<!-- TODO: Add this when we move the docs to xrpl.org -->
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
    "ledger_hash": "31E9E3738E9A07219E49BC7B71E2CD9490AC3CDFB6CB2FD4F173FB8AE1619B34",
    "ledger_index": 11,
    "validated": true,
    "vault": {
      "Account": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
      "Asset": {
        "mpt_issuance_id": "000000065E7AE0F677CFC3478DD710CD900EE92B99AB5B7A"
      },
      "AssetsAvailable": "0",
      "AssetsTotal": "0",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rwhaYGnJMexktjhxAKzRwoCcQ2g6hvBDWu",
      "OwnerNode": "0",
      "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
      "PreviousTxnLgrSeq": 10,
      "Sequence": 4,
      "ShareMPTID": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D",
      "WithdrawalPolicy": 1,
      "index": "C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52",
      "shares": {
        "DomainID": "3B61A239626565A3FBEFC32863AFBF1AD3325BD1669C2C9BC92954197842B564",
        "Flags": 56,
        "Issuer": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
        "LedgerEntryType": "MPTokenIssuance",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
        "PreviousTxnLgrSeq": 10,
        "Sequence": 1,
        "index": "5D316FC6A8C5D2344F5A85E256DCBF06A9596C79B2F450ED7BF4E7E8442F8668",
        "mpt_issuance_id": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D"
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
    "ledger_hash": "31E9E3738E9A07219E49BC7B71E2CD9490AC3CDFB6CB2FD4F173FB8AE1619B34",
    "ledger_index": 11,
    "validated": true,
    "vault": {
      "Account": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
      "Asset": {
        "mpt_issuance_id": "000000065E7AE0F677CFC3478DD710CD900EE92B99AB5B7A"
      },
      "AssetsAvailable": "0",
      "AssetsTotal": "0",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rwhaYGnJMexktjhxAKzRwoCcQ2g6hvBDWu",
      "OwnerNode": "0",
      "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
      "PreviousTxnLgrSeq": 10,
      "Sequence": 4,
      "ShareMPTID": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D",
      "WithdrawalPolicy": 1,
      "index": "C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52",
      "shares": {
        "DomainID": "3B61A239626565A3FBEFC32863AFBF1AD3325BD1669C2C9BC92954197842B564",
        "Flags": 56,
        "Issuer": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
        "LedgerEntryType": "MPTokenIssuance",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
        "PreviousTxnLgrSeq": 10,
        "Sequence": 1,
        "index": "5D316FC6A8C5D2344F5A85E256DCBF06A9596C79B2F450ED7BF4E7E8442F8668",
        "mpt_issuance_id": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D"
      }
    }
  },
  "status": "success"
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "ledger_hash": "31E9E3738E9A07219E49BC7B71E2CD9490AC3CDFB6CB2FD4F173FB8AE1619B34",
    "ledger_index": 11,
    "validated": true,
    "vault": {
      "Account": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
      "Asset": {
        "mpt_issuance_id": "000000065E7AE0F677CFC3478DD710CD900EE92B99AB5B7A"
      },
      "AssetsAvailable": "0",
      "AssetsTotal": "0",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rwhaYGnJMexktjhxAKzRwoCcQ2g6hvBDWu",
      "OwnerNode": "0",
      "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
      "PreviousTxnLgrSeq": 10,
      "Sequence": 4,
      "ShareMPTID": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D",
      "WithdrawalPolicy": 1,
      "index": "C043BB1B350FFC5FED21E40535609D3D95BC0E3CE252E2F69F85BE0157020A52",
      "shares": {
        "DomainID": "3B61A239626565A3FBEFC32863AFBF1AD3325BD1669C2C9BC92954197842B564",
        "Flags": 56,
        "Issuer": "rhXGX3ecZ8Gqxj9cCZBnJHzcoHfzMJijtV",
        "LedgerEntryType": "MPTokenIssuance",
        "OutstandingAmount": "0",
        "OwnerNode": "0",
        "PreviousTxnID": "B1F81724FA751966AC1B6A257815D8135F608A74A75C6ED3E29C3E9F5D8DB2D7",
        "PreviousTxnLgrSeq": 10,
        "Sequence": 1,
        "index": "5D316FC6A8C5D2344F5A85E256DCBF06A9596C79B2F450ED7BF4E7E8442F8668",
        "mpt_issuance_id": "0000000126A1CFADAB543B2A1D81D2ACC22FBEC14231F81D"
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
| `Asset`                | Object               | The [Asset](#asset-object) of the vault. An asset can be XRP, a Fungible Token, or an MPT. |
| `AssetsAvailable`      | Number               | The asset amount that is available in the vault. |
| `AssetsMaximum`        | Number               | The maximum asset amount that can be held in the vault. If set to 0, this indicates there is no cap. |
| `AssetsTotal`          | Number               | The total value of the vault. |
| `Flags`                | String               | Set of bit-flags for this ledger object. |
| `LossUnrealized`       | Number               |  The potential loss amount that is not yet realized, expressed as the vault's asset. |
| `ShareMPTID`           | String               | The identifier of the share `MPTokenIssuance` object. |
| `WithdrawalPolicy`     | String               | Indicates the withdrawal strategy used by the vault. |
| `index`                | String               | The unique index of the vault ledger entry.  |
| `shares`               | Object               | A [**Shares Object**](#shares-object) containing details about the vault's issued shares.  |

### Asset Object

The `asset` object contains the following nested fields:

| `Field`                | Type                 | Description |
| :--------------------- | :------------------- | :---------- |
| `currency`             | String               | _(Omitted if the asset is an MPT)_ The currency code of the asset stored in the vault. |
| `issuer`               | String - [Address][] | _(Omitted if the asset is XRP or an MPT)_ The address of the asset issuer. |
| `mpt_issuance_id`      | String               | _(Omitted if the asset is XRP or a Fungible Token)_ The identifier of the asset's `MPTokenIssuance` object. |

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

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
