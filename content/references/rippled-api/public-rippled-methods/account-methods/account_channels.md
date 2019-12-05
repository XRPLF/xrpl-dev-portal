# account_channels
[[Source]](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/AccountChannels.cpp "Source")

_(Requires the [PayChan amendment][] to be enabled. [New in: rippled 0.33.0][])_

The `account_channels` method returns information about an account's Payment Channels. This includes only channels where the specified account is the channel's source, not the destination. (A channel's "source" and "owner" are the same.) All information retrieved is relative to a particular version of the ledger.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "command": "account_channels",
  "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "account_channels",
    "params": [{
        "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "ledger_index": "validated"
    }]
}
```

*Commandline*

```bash
#Syntax: account_channels <account> [<destination_account>] [<ledger>]
rippled account_channels rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn validated
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| Field                 | Type                                       | Description |
|:----------------------|:-------------------------------------------|:--------|
| `account`             | String                                     | The unique identifier of an account, typically the account's [Address][]. The request returns channels where this account is the channel's owner/source. |
| `destination_account` | String                                     | _(Optional)_ The unique identifier of an account, typically the account's [Address][]. If provided, filter results to payment channels whose destination is this account. |
| `ledger_hash`         | String                                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | String or Unsigned Integer                 | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`               | Integer                                    | _(Optional)_ Limit the number of transactions to retrieve. The server is not required to honor this value. Must be within the inclusive range 10 to 400. Defaults to 200. |
| `marker`              | [Marker][] | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. |

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    "channels": [
      {
        "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "amount": "100000000",
        "balance": "1000000",
        "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
        "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_tag": 20170428,
        "expiration": 547073182,
        "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
        "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
        "settle_delay": 86400
      }
    ],
    "ledger_hash": "F168208EECDAA57DDAC32780CDD8330FA3E89F0E84D27A9052AA2F88681EBD08",
    "ledger_index": 37230642,
    "validated": true
  }
}
```

*JSON-RPC*

```json
200 OK

{
    "result": {
        "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "channels": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "amount": "100000000",
            "balance": "0",
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "destination_tag": 20170428,
            "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
            "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
            "settle_delay": 86400
        }],
        "ledger_hash": "B9D3D80EDF4083A06B2D51202E0BFB63C46FC0985E015D06767C21A62853BF6D",
        "ledger_index": 37230600,
        "status": "success",
        "validated": true
    }
}
```

*Commandline*

```json
200 OK

{
    "result": {
        "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "channels": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "amount": "100000000",
            "balance": "0",
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "destination_tag": 20170428,
            "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
            "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
            "settle_delay": 86400
        }],
        "ledger_hash": "B9D3D80EDF4083A06B2D51202E0BFB63C46FC0985E015D06767C21A62853BF6D",
        "ledger_index": 37230600,
        "status": "success",
        "validated": true
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| Field      | Type                                       | Description        |
|:-----------|:-------------------------------------------|:-------------------|
| `account`  | String                                     | The address of the source/owner of the payment channels. This corresponds to the `account` field of the request. |
| `channels` | Array of Channel Objects                   | Payment channels owned by this `account`. |
| `ledger_hash` | String                                  | The identifying [Hash][] of the ledger version used to generate this response. [New in: rippled 0.90.0][] |
| `ledger_index` | Number                                 | The [Ledger Index][] of the ledger version used to generate this response. [New in: rippled 0.90.0][] |
| `validated` | Boolean                                   | _(May be omitted)_ If `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. [New in: rippled 0.90.0][] |
| `limit`    | Number                                     | _(May be omitted)_ The limit to how many channel objects were actually returned by this request. |
| `marker`   | [Marker][] | _(May be omitted)_ Server-defined value for pagination. Pass this to the next call to resume getting results where this call left off. Omitted when there are no additional pages after this one. |

Each Channel Object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `account` | String | The owner of the channel, as an [Address][]. |
| `amount` | String | The total amount of [XRP, in drops][] allocated to this channel. |
| `balance` | String | The total amount of [XRP, in drops][], paid out from this channel, as of the ledger version used. (You can calculate the amount of XRP left in the channel by subtracting `balance` from `amount`.) |
| `channel_id` | String | A unique ID for this channel, as a 64-character hexadecimal string. This is also the [ID of the channel object](paychannel.html#paychannel-id-format) in the ledger's state data. |
| `destination_account` | String | the destination account of the channel, as an [Address][]. Only this account can receive the XRP in the channel while it is open. |
| `public_key` | String | _(May be omitted)_ The public key for the payment channel in the XRP Ledger's [base58][] format. Signed claims against this channel must be redeemed with the matching key pair. |
| `public_key_hex` | String | _(May be omitted)_ The public key for the payment channel in hexadecimal format, if one was specified at channel creation. Signed claims against this channel must be redeemed with the matching key pair. |
| `settle_delay` | Unsigned Integer | The number of seconds the payment channel must stay open after the owner of the channel requests to close it. |
| `expiration` | Unsigned Integer | _(May be omitted)_ Time, in [seconds since the Ripple Epoch][], when this channel is set to expire. This expiration date is mutable. If this is before the close time of the most recent validated ledger, the channel is expired. |
| `cancel_after` | Unsigned Integer | _(May be omitted)_ Time, in [seconds since the Ripple Epoch][], of this channel's immutable expiration, if one was specified at channel creation. If this is before the close time of the most recent validated ledger, the channel is expired. |
| `source_tag` | Unsigned Integer | _(May be omitted)_ A 32-bit unsigned integer to use as a [source tag](become-an-xrp-ledger-gateway.html#source-and-destination-tags) for payments through this payment channel, if one was specified at channel creation. This indicates the payment channel's originator or other purpose at the source account. Conventionally, if you bounce payments from this channel, you should specify this value in the `DestinationTag` of the return payment. |
| `destination_tag` | Unsigned Integer | _(May be omitted)_ A 32-bit unsigned integer to use as a [destination tag](become-an-xrp-ledger-gateway.html#source-and-destination-tags) for payments through this channel, if one was specified at channel creation. This indicates the payment channel's beneficiary or other purpose at the destination account. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
