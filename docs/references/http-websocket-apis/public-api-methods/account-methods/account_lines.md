---
html: account_lines.html
parent: account-methods.html
seo:
    description: Get info about an account's trust lines.
labels:
  - Tokens
---
# account_lines

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/rpc/handlers/AccountLines.cpp "Source")

The `account_lines` method returns information about an account's trust lines, which contain balances in all non-XRP currencies and assets. All information retrieved is relative to a particular version of the ledger.

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_account_lines",
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_lines",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: account_lines <account> [<peer>] [<ledger_index>|<ledger_hash>]
rippled account_lines r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59
```
{% /tab %}

{% /tabs %}

{% try-it method="account_lines" /%}

The request accepts the following parameters:

| Field            | Type                 | Required? | Description |
|:-----------------|:---------------------|:----------|:------------|
| `account`        | String - [Address][] | Yes       | Look up trust lines connected to this account, from this account's perspective. |
| `ignore_default` | Boolean              | No        | If `true`, don't return trust lines where this account's side is in the default state. The default is `false`. |
| `ledger_hash`    | String - [Hash][]    | No        | The unique hash of the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`   | [Ledger Index][]     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`          | Number               | No        | Limit the number of trust lines to retrieve. The server may return less than the specified limit, even if there are more pages of results. Must be within the inclusive range 10 to 400.  Positive values outside this range are replaced with the closest valid option. The default is 200. |
| `marker`         | [Marker][]           | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |
| `peer`           | String - [Address][] | No        | A second account; if provided, filter results to trust lines connecting the two accounts. |
| `locked_balance` | Object              | No         | The total amount locked in payment channels or escrow. |
| `lock_count` | Number | UInt32         | No         | the total number of lock balances on a RippleState ledger object. |

The following parameters are deprecated and may be removed without further notice: `ledger` and `peer_index`.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_lines/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_lines/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="Commandline" %}
{% code-snippet file="/_api-examples/account_lines/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2025-Apr-09 21:10:16.085500844 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the address of the account and an array of trust line objects. Specifically, the result object contains the following fields:

| Field                  | Type              | Required? | Description |
|:-----------------------|:------------------|:----------|:------------|
| `account`              | String            | Yes       | Unique [Address][] of the account this request corresponds to. This is the "perspective account" for purpose of the trust lines. |
| `lines`                | Array             | Yes       | Array of trust line objects, as described below. If the number of trust lines is large, only returns up to the `limit` at a time. |
| `ledger_current_index` | [Ledger Index][]  | No        | The ledger index that was used when retrieving this data. This field is only provided when using an open ledger version. |
| `ledger_index`         | [Ledger Index][]  | No        | The ledger index that was used when retrieving this data. This field is only provided when using a closed ledger version. |
| `ledger_hash`          | String - [Hash][] | No        | The identifying hash the ledger version that was used when retrieving this data. This field is only provided when using a closed ledger version. |
| `marker`               | [Marker][]        | No        | Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no additional pages after this one. |
|`limit`                 | Number            | No        | The maximum number of trust lines retrieved. The server may return fewer than the specified limit, even if more results are available. If no limit was specified in the request, use a default limit of 200. |

Each trust line object has some combination of the following fields:

| Field            | Type                       | Required? | Description |
|:-----------------|:---------------------------|:----------|:------------|
| `account`        | String - [Address][]       | Yes       | The counterparty to this trust line. |
| `balance`        | [String Number][]          | Yes       | Representation of the numeric balance currently held against this line. A positive balance means that the perspective account holds value; a negative balance means that the perspective account owes value. |
| `currency`       | String - [Currency Code][] | Yes       | The currency code of the token this trust line can hold. |
| `limit`          | [String Number][]          | Yes       | The maximum amount of the given currency that this account is willing to owe the peer account |
| `limit_peer`     | [String Number][]          | Yes       | The maximum amount of currency that the counterparty account is willing to owe the perspective account |
| `quality_in`     | Number                     | Yes       | Rate at which the account values incoming balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| `quality_out`    | Number                     | Yes       | Rate at which the account values outgoing balances on this trust line, as a ratio of this value per 1 billion units. (For example, a value of 500 million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1 ratio. |
| `no_ripple`      | Boolean                    | No        | If `true`, this account has enabled the [No Ripple flag](../../../../concepts/tokens/fungible-tokens/rippling.md) for this trust line. If present and `false`, this account has disabled the No Ripple flag, but, because the account also has the Default Ripple flag disabled, that is not considered [the default state](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve). If omitted, the account has the No Ripple flag disabled for this trust line and Default Ripple enabled. |
| `no_ripple_peer` | Boolean                    | No        | If `true`, the peer account has enabled the [No Ripple flag](../../../../concepts/tokens/fungible-tokens/rippling.md) for this trust line. If present and `false`, this account has disabled the No Ripple flag, but, because the account also has the Default Ripple flag disabled, that is not considered [the default state](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve). If omitted, the account has the No Ripple flag disabled for this trust line and Default Ripple enabled. |
| `authorized`     | Boolean                    | No        | If `true`, the perspective account has [authorized this trust line](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md). The default is `false`. |
| `peer_authorized`| Boolean                    | No        | If `true`, the counterparty has [authorized this trust line](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md). The default is `false`. |
| `freeze`         | Boolean                    | No        | If `true`, the perspective account has [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) this trust line. The default is `false`. |
| `freeze_peer`    | Boolean                    | No        | If `true`, the counterparty has [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) this trust line. The default is `false`. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `actMalformed` - If the `marker` field provided is not acceptable.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
