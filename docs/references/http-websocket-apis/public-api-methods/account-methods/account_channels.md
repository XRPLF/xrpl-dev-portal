---
html: account_channels.html
parent: account-methods.html
seo:
    description: Get a list of payment channels where the account is the source of the channel.
labels:
  - Payment Channels
---
# account_channels
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountChannels.cpp "Source")

_(Added by the [PayChan amendment][].)_

The `account_channels` method returns information about an account's Payment Channels. This includes only channels where the specified account is the channel's source, not the destination. (A channel's "source" and "owner" are the same.) All information retrieved is relative to a particular version of the ledger.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "account_channels",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_channels",
    "params": [{
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "ledger_index": "validated"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```bash
#Syntax: account_channels <account> [<destination_account>] [<ledger>]
rippled account_channels rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn ra5nK24KXen9AHvsdFTKHSANinZseWnPcX validated
```
{% /tab %}

{% /tabs %}

{% try-it method="account_channels" /%}

The request includes the following parameters:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|-------------|
| `account`             | String - [Address][] | Yes       | Look up channels where this account is the channel's owner/source. |
| `amount`              | Object or String     | No        | The total amount allocated to this channel. |
| `balance`             | Object or String     | No        | The total amount paid out from this channel, as of the ledger version used. (You can calculate the amount left in the channel by subtracting `balance` from `amount`). |
| `destination_account` | String - [Address][] | No        | A second account; if provided, filter results to payment channels whose destination is this account. |
| `ledger_hash`         | String               | No        | The unique hash of the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index`        | Number or String     | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`               | Number               | No        | Limit the number of transactions to retrieve. Cannot be less than 10 or more than 400. Positive values outside this range are replaced with the closest valid option. The default is 200. |
| `marker`              | [Marker][]           | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |
| `transfer_rate`       | Number               | No        | The fee to charge when users make claims on a payment channel, initially set on the creation of a payment channel and updated on subsequent funding or claim transactions. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "1EDBBA3C793863366DF5B31C2174B6B5E6DF6DB89A7212B86838489148E2A581",
    "ledger_index": 71766314,
    "validated": true
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
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "27F530E5C93ED5C13994812787C1ED073C822BAEC7597964608F2C049C2ACD2D",
    "ledger_index": 71766343,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
200 OK

{
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "27F530E5C93ED5C13994812787C1ED073C822BAEC7597964608F2C049C2ACD2D",
    "ledger_index": 71766343,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field          | Type                     | Description                      |
|:---------------|:-------------------------|:---------------------------------|
| `account`      | String                   | The address of the source/owner of the payment channels. This corresponds to the `account` field of the request. |
| `channels`     | Array of Channel Objects | Payment channels owned by this `account`. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.5.0" %}Updated in: rippled 1.5.0{% /badge %} |
| `ledger_hash`  | String                   | _(May be omitted)_ The identifying [Hash][] of the ledger version used to generate this response. |
| `ledger_index` | Number                   | The [Ledger Index][] of the ledger version used to generate this response. |
| `validated`    | Boolean                  | _(May be omitted)_ If `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |
| `limit`        | Number                   | _(May be omitted)_ The limit to how many channel objects were actually returned by this request. |
| `marker`       | [Marker][]               | _(May be omitted)_ Server-defined value for pagination. Pass this to the next call to resume getting results where this call left off. Omitted when there are no additional pages after this one. |

Each Channel Object has the following fields:

| Field                 | Type             | Description                       |
|:----------------------|:-----------------|:----------------------------------|
| `account`             | String           | The owner of the channel, as an [Address][]. |
| `amount`              | Object or String | The total amount of [XRP, in drops][] or fungible tokens allocated to this channel. |
| `balance`             | String           | The total amount of [XRP, in drops][] or fungible tokens paid out from this channel, as of the ledger version used. (You can calculate the amount left in the channel by subtracting `balance` from `amount`.) |
| `channel_id`          | String           | A unique ID for this channel, as a 64-character hexadecimal string. This is also the [ID of the channel object](../../../protocol/ledger-data/ledger-entry-types/paychannel.md#paychannel-id-format) in the ledger's state data. |
| `destination_account` | String           | The destination account of the channel, as an [Address][]. Only this account can receive the `amount` in the channel while it is open. |
| `settle_delay`        | Unsigned Integer | The number of seconds the payment channel must stay open after the owner of the channel requests to close it. |
| `public_key`          | String           | _(May be omitted)_ The public key for the payment channel in the XRP Ledger's [base58][] format. Signed claims against this channel must be redeemed with the matching key pair. |
| `public_key_hex`      | String           | _(May be omitted)_ The public key for the payment channel in hexadecimal format, if one was specified at channel creation. Signed claims against this channel must be redeemed with the matching key pair. |
| `expiration`          | Unsigned Integer | _(May be omitted)_ Time, in [seconds since the Ripple Epoch][], when this channel is set to expire. This expiration date is mutable. If this is before the close time of the most recent validated ledger, the channel is expired. |
| `cancel_after`        | Unsigned Integer | _(May be omitted)_ Time, in [seconds since the Ripple Epoch][], of this channel's immutable expiration, if one was specified at channel creation. If this is before the close time of the most recent validated ledger, the channel is expired. |
| `source_tag`          | Unsigned Integer | _(May be omitted)_ A 32-bit unsigned integer to use as a [source tag](../../../../concepts/transactions/source-and-destination-tags.md) for payments through this payment channel, if one was specified at channel creation. This indicates the payment channel's originator or other purpose at the source account. Conventionally, if you bounce payments from this channel, you should specify this value in the `DestinationTag` of the return payment. |
| `destination_tag`     | Unsigned Integer | _(May be omitted)_ A 32-bit unsigned integer to use as a [destination tag](../../../../concepts/transactions/source-and-destination-tags.md) for payments through this channel, if one was specified at channel creation. This indicates the payment channel's beneficiary or other purpose at the destination account. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
