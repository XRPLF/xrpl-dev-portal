---
seo:
    description: Check whether an account is authorized to send money directly to another.
labels:
  - Accounts
  - Security
---
# deposit_authorized
[[Source]](https://github.com/XRPLF/rippled/blob/817d2339b8632cb2f97d3edd6f7af33aa7631744/src/ripple/rpc/handlers/DepositAuthorized.cpp "Source")

The `deposit_authorized` command indicates whether one account is authorized to send payments directly to another. See [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth/) for information on how to require authorization to deliver money to your account.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "deposit_authorized",
  "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "credentials": [
    "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
    "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
  ],
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "deposit_authorized",
  "params": [
    {
      "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
      "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
      "credentials": [
        "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
        "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
      ],
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}

```bash
#Syntax: deposit_authorized <source_account> <destination_account> [<ledger>]
rippled deposit_authorized rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8 validated
```
{% /tab %}
{% /tabs %}

The request includes the following parameters:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|-------------|
| `source_account`      | String - [Address][] | Yes       | The sender of a possible payment. |
| `destination_account` | String - [Address][] | Yes       | The recipient of a possible payment. |
| `ledger_hash`         | [Hash][]             | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | [Ledger Index][]     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `credentials`         | Array                | No        | A set of credentials to take into account when checking if the sender can send funds to the destination. Each member of the array must be the unique ID of a [Credential entry][] in the ledger. Cannot be an empty array. |

{% admonition type="info" name="Note" %}
If you provide a set of credentials that does not exactly match a set of credentials preauthorized by the destination, the payment is not authorized, even if the destination has preauthorized a subset of those credentials. This matches the behavior of transaction processing.
{% /admonition %}

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "credentials": [
      "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
      "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
    ],
    "deposit_authorized": true,
    "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "ledger_hash": "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
    "ledger_index": 8,
    "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "credentials": [
      "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
      "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
    ],
    "deposit_authorized": true,
    "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "ledger_hash": "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
    "ledger_index": 8,
    "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
2018-Jul-30 20:07:38.771658157 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "credentials": [
        "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
        "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
      ],
      "deposit_authorized" : true,
      "destination_account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
      "ledger_hash" : "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
      "ledger_index" : 8,
      "source_account" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}
{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field                  | Type                      | Required? | Description   |
|:-----------------------|:--------------------------|:----------|:--------------|
| `credentials`          | Array of [Hash][]         | No        | The credentials specified in the request, if any. |
| `deposit_authorized`   | Boolean                   | Yes       | Whether the specified source account is authorized to send payments directly to the destination account. If `true`, either the destination account does not require [deposit authorization](https://xrpl.org/docs/concepts/accounts/depositauth) or the source account is preauthorized. |
| `destination_account`  | String - [Address][]      | Yes       | The destination account specified in the request. |
| `ledger_hash`          | String                    | No        | The identifying hash of the ledger that was used to generate this response. |
| `ledger_index`         | Number - [Ledger Index][] | No        | The ledger index of the ledger version that was used to generate this response. |
| `ledger_current_index` | Number - [Ledger Index][] | No        | The ledger index of the current in-progress ledger version, which was used to generate this response. |
| `source_account`       | String - [Address][]      | Yes       | The source account specified in the request. |
| `validated`            | Boolean                   | No        | If `true`, the information comes from a validated ledger version. |

{% admonition type="info" name="Note" %}
A `deposit_authorized` status of `true` does not guarantee that a payment can be sent from the specified source to the specified destination. For example, the destination account may not have a [trust line](https://xrpl.org/docs/concepts/tokens/fungible-tokens) for the specified currency, or there may not be enough liquidity to deliver a payment.
{% /admonition %}

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actMalformed` - An [Address][] specified in the `source_account` or `destination_account` field of the request was not properly formatted. (It may contain a typo or be the wrong length, causing a failed checksum.)
* `badCredentials` - At least one of the supplied credentials does not exist, is expired, or has not been accepted.
* `dstActNotFound` - The `destination_account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `srcActNotFound` - The `source_account` field of the request does not correspond to an account in the ledger.


{% raw-partial file="/docs/_snippets/common-links.md" /%}
