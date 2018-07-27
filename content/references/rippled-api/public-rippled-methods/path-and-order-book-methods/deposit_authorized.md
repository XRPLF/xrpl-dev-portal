# deposit_authorized
[[Source]<br>](https://github.com/ripple/rippled/blob/817d2339b8632cb2f97d3edd6f7af33aa7631744/src/ripple/rpc/handlers/DepositAuthorized.cpp "Source")

The `deposit_authorized` command indicates whether one account is authorized to send payments directly to another. See [Deposit Authorization](depositauth.html) for information on how to require authorization to deliver money to your account.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "deposit_authorized",
  "source_account": "rnUy2SHTrB9DubsPmkJZUXTf5FcNDGrYEA",
  "destination_account": "rDg53Haik2475DJx8bjMDSDPj4VX7htaMd",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "deposit_authorized",
  "params": [
    {
      "source_account": "rnUy2SHTrB9DubsPmkJZUXTf5FcNDGrYEA",
      "destination_account": "rDg53Haik2475DJx8bjMDSDPj4VX7htaMd",
      "ledger_index": "validated"
    }
  ]
}
```

*Commandline*

```bash
#Syntax: deposit_authorized <source_account> <destination_account> [<ledger>]
rippled deposit_authorized rnUy2SHTrB9DubsPmkJZUXTf5FcNDGrYEA rDg53Haik2475DJx8bjMDSDPj4VX7htaMd validated
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`               | Type                       | Description             |
|:----------------------|:---------------------------|:------------------------|
| `source_account`      | String - [Address][]       | The sender of a possible payment. |
| `destination_account` | String - [Address][]       | The recipient of a possible payment. |
| `ledger_hash`         | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | String or Unsigned Integer | _(Optional)_ The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |


## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
TODO
```

*JSON-RPC*

```json
{
  "result":
  {
    "deposit_authorized": true,
    "destination_account": "rDg53Haik2475DJx8bjMDSDPj4VX7htaMd",
    "ledger_hash": "4C99E5F63C0D0B1C2283B4F5DCE2239F80CE92E8B1A6AED1E110C198FC96E659",
    "ledger_index": 14380380,
    "source_account": "rnUy2SHTrB9DubsPmkJZUXTf5FcNDGrYEA",
    "status": "success",
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                 | Description                  |
|:-----------------------|:---------------------|:-----------------------------|
| `deposit_authorized`   | Boolean              | Whether the specified source account is authorized to send payments directly to the destination account. If `true`, either the destination account does not require [Deposit Authorization](depositauth.html) or the source account is preauthorized. |
| `destination_account`  | String - [Address][] | The destination account specified in the request. |
| `ledger_hash`          | String               | _(May be omitted)_ The identifying hash of the ledger that was used to generate this response. |
| `ledger_index`         | Number               | _(May be omitted)_ The sequence number of the ledger version that was used to generate this response. |
| `ledger_current_index` | Number               | _(May be omitted)_ The sequence number of the current in-progress ledger version that was used to generate this response. |
| `source_account`       | String - [Address][] | The source account specified in the request. |
| `validated`            | Boolean              | _(May be omitted)_ If `true`, the information comes from a validated ledger version. |

**Note:** A `deposit_authorized` status of `true` does not guarantee that a payment can be sent from the specified source to the specified destination. For example, the destination account may not have a [trust line](trust-lines-and-issuing.html) for the specified currency, or there may not be sufficient liquidity to deliver a payment.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - An [Address][] specified in the `source_account` or `destination_account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
