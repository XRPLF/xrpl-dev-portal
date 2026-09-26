---
seo:
    description: Get the MPTokenIssuances created by a given account as of a given ledger.
labels:
  - Accounts
  - Multi Purpose Tokens, MPTs
---

# account_mptoken_issuances

[[Source]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/AccountMPTokenIssuances.cpp "Source")

The `account_mptoken_issuances` method returns information about [MPT](/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens) issuances created by an account. This method may return large data sets, so you should expect to implement [pagination][Marker]. {% badge href="https://github.com/XRPLF/clio/releases/tag/2.7.0" %}New in: Clio v2.7.0{% /badge %}

This method is only available using Clio, not `xrpld`.

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
| `account`      | String - [Address][]      | Yes       | Look up MPT issuances created by this account. |
| `ledger_index` | [Ledger Index][]          | No        | The [Ledger Index][] of the ledger version to use, or a shortcut string to choose a ledger automatically. See [Specifying Ledgers][]. |
| `ledger_hash`  | String                    | No        | A 32-byte hex string for the ledger version to use. See [Specifying Ledgers][]. |
| `marker`       | [Marker][]                | No        | Used to continue your query where it left off in paginating. |
| `limit`        | Number (positive integer) | No        | Specify a limit to the number of MPT issuances returned. Must be within the inclusive range 10 to 400. Positive values outside this range are replaced with the closest valid option. The default is 200. |

## Response Format

{% tabs %}
{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_mptoken_issuances/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_mptoken_issuances/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with the result containing the following fields:

| Field           | Type             | Description |
|:----------------|:-----------------|:------------|
| `account`       | String           | The account whose MPT issuances were queried. |
| `mpt_issuances` | Array            | An array of [MPT Issuance objects](#mpt-issuance-objects) created by the account. |
| `marker`        | [Marker][]       | Used to continue querying where we left off when paginating. Omitted if there are no more entries after this result. |
| `limit`         | Number           | The limit, as specified in the request. |
| `ledger_hash`   | String           | The hash of the ledger version used to generate this response. |
| `ledger_index`  | [Ledger Index][] | The index of the ledger version used to generate this response. |
| `validated`     | Boolean          | If `true`, the ledger has been validated by the consensus process and is immutable. Otherwise, the contents of the ledger are not final and may change. In Clio, this is _always_ true as Clio stores and returns validated ledger data. |

### MPT Issuance objects

Each MPT Issuance object has the following fields. Fields marked _(May be omitted)_ are only present when they have a meaningful (non-default) value.

| Field                | Type    | Description |
|:---------------------|:--------|:------------|
| `mpt_issuance_id`    | String  | The `MPTokenIssuanceID` of this issuance. |
| `issuer`             | String  | The account that created this issuance. |
| `sequence`           | Number  | The sequence number of the transaction that created this issuance. |
| `transfer_fee`       | Number  | _(May be omitted)_ The fee charged, in units of 1/100,000, when tokens of this issuance are transferred between non-issuer accounts. Omitted if the issuance charges no transfer fee. |
| `asset_scale`        | Number  | _(May be omitted)_ The number of decimal places used to represent amounts of this token. |
| `maximum_amount`     | Number  | _(May be omitted)_ The maximum number of tokens that can be issued for this `MPTokenIssuance`. |
| `outstanding_amount` | Number  | _(May be omitted)_ The number of tokens of this issuance currently held by all holders. |
| `locked_amount`      | Number  | _(May be omitted)_ The number of tokens of this issuance currently held in [escrow](/docs/concepts/payment-types/escrow). |
| `mptoken_metadata`   | String  | _(May be omitted)_ Arbitrary metadata about this issuance, in hexadecimal. |
| `domain_id`          | String  | _(May be omitted)_ The `PermissionedDomainID` associated with this issuance, if any. |
| `mpt_locked`         | Boolean | _(May be omitted)_ All balances of this issuance are frozen by the issuer. This is unrelated to `locked_amount`. |
| `mpt_can_lock`       | Boolean | _(May be omitted)_ The issuer can freeze individual balances or the entire issuance. |
| `mpt_require_auth`   | Boolean | _(May be omitted)_ Individual holders must be authorized by the issuer before they can hold this token. |
| `mpt_can_escrow`     | Boolean | _(May be omitted)_ Holders can place balances of this token into [escrow](/docs/concepts/payment-types/escrow). |
| `mpt_can_trade`      | Boolean | _(May be omitted)_ Holders can trade balances of this token on the [decentralized exchange](/docs/concepts/tokens/decentralized-exchange/index.md). _(Requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2). {% not-enabled /%})_ |
| `mpt_can_transfer`   | Boolean | _(May be omitted)_ Tokens of this issuance can be transferred between non-issuer accounts. |
| `mpt_can_clawback`   | Boolean | _(May be omitted)_ The issuer can [claw back tokens](/docs/concepts/tokens/fungible-tokens/clawing-back-tokens) of this issuance from holders. |

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actMalformed` - The [Address][] specified in the `account` field of the request is not a valid account address.
- `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
- `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
