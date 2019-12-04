# deposit_authorized
[[Source]](https://github.com/ripple/rippled/blob/817d2339b8632cb2f97d3edd6f7af33aa7631744/src/ripple/rpc/handlers/DepositAuthorized.cpp "Source")

The `deposit_authorized` command indicates whether one account is authorized to send payments directly to another. See [Deposit Authorization](depositauth.html) for information on how to require authorization to deliver money to your account.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "deposit_authorized",
  "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "deposit_authorized",
  "params": [
    {
      "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
      "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
      "ledger_index": "validated"
    }
  ]
}
```

*Commandline*

```bash
#Syntax: deposit_authorized <source_account> <destination_account> [<ledger>]
rippled deposit_authorized rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8 validated
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`               | Type                       | Description             |
|:----------------------|:---------------------------|:------------------------|
| `source_account`      | String - [Address][]       | The sender of a possible payment. |
| `destination_account` | String - [Address][]       | The recipient of a possible payment. |
| `ledger_hash`         | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |


## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "result": {
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

*JSON-RPC*

```json
{
  "result": {
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

*Commandline*

```json
Loading: "/etc/rippled.cfg"
2018-Jul-30 20:07:38.771658157 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
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

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                      | Description             |
|:-----------------------|:--------------------------|:------------------------|
| `deposit_authorized`   | Boolean                   | Whether the specified source account is authorized to send payments directly to the destination account. If `true`, either the destination account does not require [Deposit Authorization](depositauth.html) or the source account is preauthorized. |
| `destination_account`  | String - [Address][]      | The destination account specified in the request. |
| `ledger_hash`          | String                    | _(May be omitted)_ The identifying hash of the ledger that was used to generate this response. |
| `ledger_index`         | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the ledger version that was used to generate this response. |
| `ledger_current_index` | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the current in-progress ledger version, which was used to generate this response. |
| `source_account`       | String - [Address][]      | The source account specified in the request. |
| `validated`            | Boolean                   | _(May be omitted)_ If `true`, the information comes from a validated ledger version. |

**Note:** A `deposit_authorized` status of `true` does not guarantee that a payment can be sent from the specified source to the specified destination. For example, the destination account may not have a [trust line](trust-lines-and-issuing.html) for the specified currency, or there may not be sufficient liquidity to deliver a payment.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actMalformed` - An [Address][] specified in the `source_account` or `destination_account` field of the request was not properly formatted. (It may contain a typo or be the wrong length, causing a failed checksum.)
* `dstActNotFound` - The `destination_account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `srcActNotFound` - The `source_account` field of the request does not correspond to an account in the ledger.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
