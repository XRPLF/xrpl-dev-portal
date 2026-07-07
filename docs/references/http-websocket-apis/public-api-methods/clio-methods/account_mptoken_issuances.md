---
seo:
    description: Get the MPTokenIssuances created by a given account as of a given ledger.
labels:
  - Accounts
  - Multi Purpose Tokens, MPTs
---

# account_mptoken_issuances

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/AccountMPTokenIssuances.cpp "Source")

The `account_mptoken_issuances` method returns information about the [MPTokenIssuance entries][MPTokenIssuance entry] created by a given account. This method may return large data sets, so you should expect to implement paging via the `marker` field. This API is only available using Clio, not `xrpld`. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.7.0" %}New in: Clio v2.7.0{% /badge %}

## Request Format

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_mptoken_issuances",
  "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_mptoken_issuances",
  "params": [
    {
      "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="account_mptoken_issuances" /%}

The request contains the following parameters:

| Field          | Type                      | Required? | Description |
|:---------------|:--------------------------|:----------|-------------|
| `account`      | String                    | Yes       | The unique identifier of an account, typically the account's address. |
| `ledger_index` | [Ledger Index][]          | No        | The [Ledger Index][] of the max ledger to use, or a shortcut string to choose a ledger automatically. See [Specifying Ledgers][]. |
| `ledger_hash`  | String                    | No        | A 32-byte hex string for the ledger version to use. See [Specifying Ledgers][]. |
| `marker`       | [Marker][]                | No        | Used to continue your query where it left off in paginating. |
| `limit`        | Number (positive integer) | No        | Specify a limit to the number of MPTokenIssuances returned. |

## Response Format

{% tabs %}
{% tab label="WebSocket" %}
```json
{
  "result": {
    "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
    "ledger_hash": "F59397558275DF1B9DD3D2430332DB9A58147B102791883D7A6731B3CA5B590C",
    "ledger_index": 105505430,
    "validated": true,
    "limit": 200,
    "mpt_issuances": [
      {
        "mpt_issuance_id": "6F490E070CD43B4FEF94E7334F35A8C263B08D87F4F8413D8E3EA509751DC1F5",
        "issuer": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
        "sequence": 104954046,
        "asset_scale": 6,
        "maximum_amount": 14300000000000,
        "outstanding_amount": 1000000500,
        "locked_amount": 500000000,
        "mptoken_metadata": "7B226163223A22727761222C226169223A7B226261636B696E67223A22382E344D206F7A204A4F524320696E2D73697475202B207661756C74656420676F6C64222C22696E697469616C5F6E6176223A2231342E334220555344222C22697373756572223A225147502053504320284361796D616E2049736C616E6473205365677265676174656420506F7274666F6C696F20436F6D70616E7929222C226A7572697364696374696F6E223A224361796D616E2049736C616E6473222C22726567697374726174696F6E223A2243522D343136323233222C22726573657276655F6175646974223A224D6F6E74686C79206174746573746174696F6E2C20717561727465726C79204A4F524320757064617465227D2C226173223A22636F6D6D6F64697479222C2264223A22476F6C642D6261636B65642052574120746F6B656E206F6E20585250204C65646765722E204261636B656420627920382E344D206F7A204A4F52432D63657274696669656420696E2D7369747520676F6C6420726573657276657320706C7573207661756C74656420706879736963616C20676F6C642E222C2269223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D69636F6E2E706E67222C22696E223A2251475020535043222C226E223A2256474F4C4420434F52452B222C2274223A2256434F5245222C227573223A5B7B2263223A2277656273697465222C2274223A2256434F5245204F6666696369616C222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F7265227D2C7B2263223A22646F6373222C2274223A2257686974657061706572222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D77686974657061706572227D5D7D",
        "mpt_can_escrow": true,
        "mpt_can_trade": true,
        "mpt_can_transfer": true,
        "mpt_can_clawback": true
      },
      {
        "mpt_issuance_id": "8F601A25D0DA4308FC69CB844B99B0F7B91EC2563FD00854B5E46C7CA70F5036",
        "issuer": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
        "sequence": 104954064,
        "asset_scale": 6,
        "maximum_amount": 14300000000000,
        "outstanding_amount": 275500000000,
        "locked_amount": 220400000000,
        "mptoken_metadata": "7B226163223A22727761222C226169223A7B226261636B696E67223A22382E344D206F7A204A4F524320696E2D73697475202B207661756C74656420676F6C64222C22696E697469616C5F6E6176223A2231342E334220555344222C22697373756572223A225147502053504320284361796D616E2049736C616E6473205365677265676174656420506F7274666F6C696F20436F6D70616E7929222C226A7572697364696374696F6E223A224361796D616E2049736C616E6473222C22726567697374726174696F6E223A2243522D343136323233222C22726573657276655F6175646974223A224D6F6E74686C79206174746573746174696F6E2C20717561727465726C79204A4F524320757064617465227D2C226173223A22636F6D6D6F64697479222C2264223A22476F6C642D6261636B65642052574120746F6B656E206F6E20585250204C65646765722E204261636B656420627920382E344D206F7A204A4F52432D63657274696669656420696E2D7369747520676F6C6420726573657276657320706C7573207661756C74656420706879736963616C20676F6C642E222C2269223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D69636F6E2E706E67222C22696E223A2251475020535043222C226E223A2256474F4C4420434F52452B222C2274223A2256434F5245222C227573223A5B7B2263223A2277656273697465222C2274223A2256434F5245204F6666696369616C222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F7265227D2C7B2263223A22646F6373222C2274223A2257686974657061706572222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D77686974657061706572227D5D7D",
        "mpt_can_escrow": true,
        "mpt_can_trade": true,
        "mpt_can_transfer": true,
        "mpt_can_clawback": true
      }
    ]
  },
  "id": "example_account_mptoken_issuances",
  "status": "success",
  "type": "response",
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
    "ledger_hash": "F59397558275DF1B9DD3D2430332DB9A58147B102791883D7A6731B3CA5B590C",
    "ledger_index": 105505430,
    "validated": true,
    "limit": 200,
    "mpt_issuances": [
      {
        "mpt_issuance_id": "6F490E070CD43B4FEF94E7334F35A8C263B08D87F4F8413D8E3EA509751DC1F5",
        "issuer": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
        "sequence": 104954046,
        "asset_scale": 6,
        "maximum_amount": 14300000000000,
        "outstanding_amount": 1000000500,
        "locked_amount": 500000000,
        "mptoken_metadata": "7B226163223A22727761222C226169223A7B226261636B696E67223A22382E344D206F7A204A4F524320696E2D73697475202B207661756C74656420676F6C64222C22696E697469616C5F6E6176223A2231342E334220555344222C22697373756572223A225147502053504320284361796D616E2049736C616E6473205365677265676174656420506F7274666F6C696F20436F6D70616E7929222C226A7572697364696374696F6E223A224361796D616E2049736C616E6473222C22726567697374726174696F6E223A2243522D343136323233222C22726573657276655F6175646974223A224D6F6E74686C79206174746573746174696F6E2C20717561727465726C79204A4F524320757064617465227D2C226173223A22636F6D6D6F64697479222C2264223A22476F6C642D6261636B65642052574120746F6B656E206F6E20585250204C65646765722E204261636B656420627920382E344D206F7A204A4F52432D63657274696669656420696E2D7369747520676F6C6420726573657276657320706C7573207661756C74656420706879736963616C20676F6C642E222C2269223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D69636F6E2E706E67222C22696E223A2251475020535043222C226E223A2256474F4C4420434F52452B222C2274223A2256434F5245222C227573223A5B7B2263223A2277656273697465222C2274223A2256434F5245204F6666696369616C222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F7265227D2C7B2263223A22646F6373222C2274223A2257686974657061706572222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D77686974657061706572227D5D7D",
        "mpt_can_escrow": true,
        "mpt_can_trade": true,
        "mpt_can_transfer": true,
        "mpt_can_clawback": true
      },
      {
        "mpt_issuance_id": "8F601A25D0DA4308FC69CB844B99B0F7B91EC2563FD00854B5E46C7CA70F5036",
        "issuer": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
        "sequence": 104954064,
        "asset_scale": 6,
        "maximum_amount": 14300000000000,
        "outstanding_amount": 275500000000,
        "locked_amount": 220400000000,
        "mptoken_metadata": "7B226163223A22727761222C226169223A7B226261636B696E67223A22382E344D206F7A204A4F524320696E2D73697475202B207661756C74656420676F6C64222C22696E697469616C5F6E6176223A2231342E334220555344222C22697373756572223A225147502053504320284361796D616E2049736C616E6473205365677265676174656420506F7274666F6C696F20436F6D70616E7929222C226A7572697364696374696F6E223A224361796D616E2049736C616E6473222C22726567697374726174696F6E223A2243522D343136323233222C22726573657276655F6175646974223A224D6F6E74686C79206174746573746174696F6E2C20717561727465726C79204A4F524320757064617465227D2C226173223A22636F6D6D6F64697479222C2264223A22476F6C642D6261636B65642052574120746F6B656E206F6E20585250204C65646765722E204261636B656420627920382E344D206F7A204A4F52432D63657274696669656420696E2D7369747520676F6C6420726573657276657320706C7573207661756C74656420706879736963616C20676F6C642E222C2269223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D69636F6E2E706E67222C22696E223A2251475020535043222C226E223A2256474F4C4420434F52452B222C2274223A2256434F5245222C227573223A5B7B2263223A2277656273697465222C2274223A2256434F5245204F6666696369616C222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F7265227D2C7B2263223A22646F6373222C2274223A2257686974657061706572222C2275223A2268747470733A2F2F7167707370632E636F6D2F76636F72652D77686974657061706572227D5D7D",
        "mpt_can_escrow": true,
        "mpt_can_trade": true,
        "mpt_can_transfer": true,
        "mpt_can_clawback": true
      }
    ],
    "status": "success"
  },
  "warnings": [
    {
      "id": 2001,
      "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with the result containing the following fields:

| Field           | Type             | Description |
|:----------------|:-----------------|:------------|
| `account`       | String           | The address of the account whose MPTokenIssuances were queried. |
| `mpt_issuances` | Array            | An array of `MPTokenIssuance` objects created by the account. |
| `marker`        | [Marker][]       | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
| `limit`         | Number           | The limit, as specified in the request. |
| `ledger_hash`   | String           | The hash of the ledger version used to generate this response. |
| `ledger_index`  | [Ledger Index][] | The index of the ledger version used to generate this response. |
| `validated`     | Boolean          | If `true`, the ledger has been validated by the consensus process and is immutable. Otherwise, the contents of the ledger are not final and may change. In Clio, this is _always_ true as Clio stores and returns validated ledger data. |

#### MPTokenIssuance

Each `MPTokenIssuance` object has the following fields. Fields marked _(May be omitted)_ are only present when they have a meaningful (non-default) value.

| Field                | Type    | Description |
|:---------------------|:--------|:------------|
| `mpt_issuance_id`    | String  | The `MPTokenIssuanceID` of this issuance. |
| `issuer`             | String  | The account address that created this issuance. |
| `sequence`           | Number  | The sequence number of the transaction that created this issuance. |
| `transfer_fee`       | Number  | _(May be omitted)_ The fee charged, in units of 1/100,000, when tokens of this issuance are transferred between non-issuer accounts. |
| `asset_scale`        | Number  | _(May be omitted)_ The number of decimal places used to represent amounts of this token. |
| `maximum_amount`     | Number  | _(May be omitted)_ The maximum number of tokens that can be issued for this `MPTokenIssuance`. |
| `outstanding_amount` | Number  | _(May be omitted)_ The number of tokens of this issuance currently held by all holders. |
| `locked_amount`      | Number  | _(May be omitted)_ The number of tokens of this issuance currently held in escrow or otherwise locked. |
| `mptoken_metadata`   | String  | _(May be omitted)_ Arbitrary metadata about this issuance, in hexadecimal. |
| `domain_id`          | String  | _(May be omitted)_ The `PermissionedDomainID` associated with this issuance, if any. |

The following boolean capability flags are included only when they are `true`:

| Field                 | Type    | Description |
|:----------------------|:--------|:------------|
| `mpt_locked`          | Boolean | All balances of this issuance are locked. |
| `mpt_can_lock`        | Boolean | The issuer can lock individual balances or the entire issuance. |
| `mpt_require_auth`    | Boolean | Individual holders must be authorized by the issuer before they can hold this token. |
| `mpt_can_escrow`      | Boolean | Holders can place balances of this token into escrow. |
| `mpt_can_trade`       | Boolean | Holders can trade balances of this token on the decentralized exchange. |
| `mpt_can_transfer`    | Boolean | Tokens of this issuance can be transferred between non-issuer accounts. |
| `mpt_can_clawback`    | Boolean | The issuer can claw back tokens of this issuance from holders. |

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actMalformed` - The [Address][] specified in the `account` field of the request is not a valid account address.
- `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
- `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
