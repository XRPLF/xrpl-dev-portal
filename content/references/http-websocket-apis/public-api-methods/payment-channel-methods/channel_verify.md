---
html: channel_verify.html
parent: payment-channel-methods.html
seo:
    description: Check a payment channel claim's signature.
labels:
  - Payment Channels
---
# channel_verify
[[Source]](https://github.com/XRPLF/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L89 "Source")

_(Added by the [PayChan amendment][] to be enabled.)_

The `channel_verify` method checks the validity of a signature that can be used to redeem a specific amount of XRP from a payment channel.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "command": "channel_verify",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
    "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
    "amount": "1000000"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "channel_verify",
    "params": [{
        "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
        "amount": "1000000"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: channel_verify <public_key> <channel_id> <amount> <signature>
rippled channel_verify aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000 304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| `amount` | String | The amount of [XRP, in drops][], the provided `signature` authorizes. |
| `channel_id` | String | The Channel ID of the channel that provides the XRP. This is a 64-character hexadecimal string. |
| `public_key` | String | The public key of the channel and the key pair that was used to create the signature, in hexadecimal or the XRP Ledger's [base58][] format. {% badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0" %}Updated in: rippled 0.90.0{% /badge %} |
| `signature` | String | The signature to verify, in hexadecimal. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "status": "success",
    "type": "response",
    "result": {
        "signature_verified":true
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "signature_verified":true,
        "status":"success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
    "result": {
        "signature_verified":true,
        "status":"success"
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `signature_verified` | Boolean | If `true`, the signature is valid for the stated amount, channel, and public key. |

**Caution:** This does not indicate check that the channel has enough XRP allocated to it. Before considering a claim valid, you should look up the channel in the latest validated ledger and confirm that the channel is open and its `amount` value is equal or greater than the `amount` of the claim. To do so, use the [account_channels method][].

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `publicMalformed` - The `public_key` field of the request is not a valid public key in the correct format. Public keys are 33 bytes and must be represented in base58 or hexadecimal. The [base58 representation of account public keys starts with the letter `a`](../../../protocol/data-types/base58-encodings.md). The hexadecimal representation is 66 characters long.
* `channelMalformed` - The `channel_id` field of the request is not a valid Channel ID. The Channel ID must be a 256-bit (64-character) hexadecimal string.
* `channelAmtMalformed` - The value specified in the `amount` field was not a valid [XRP amount][XRP, in drops].

{% raw-partial file="/_snippets/common-links.md" /%}
