---
html: channel_authorize.html
parent: payment-channel-methods.html
blurb: Sign a claim for money from a payment channel.
labels:
  - Payment Channels
---
# channel_authorize
[[Source]](https://github.com/XRPLF/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L41 "Source")

_(Added by the [PayChan amendment][] to be enabled.)_

The `channel_authorize` method creates a signature that can be used to redeem a specific amount of XRP from a payment channel.

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "channel_authorize_example_id1",
    "command": "channel_authorize",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "seed": "s████████████████████████████",
    "key_type": "secp256k1",
    "amount": "1000000",
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
POST http://localhost:5005/
Content-Type: application/json

{
    "method": "channel_authorize",
    "params": [{
        "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
        "seed": "s████████████████████████████",
        "key_type": "secp256k1",
        "amount": "1000000"
    }]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: channel_authorize <private_key> [<key_type>] <channel_id> <drops>
rippled channel_authorize s████████████████████████████ secp256k1 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| `channel_id` | String | The unique ID of the payment channel to use.
| `secret` | String | _(Optional)_ The secret key to use to sign the claim. This must be the same key pair as the public key specified in the channel. Cannot be used with `seed`, `seed_hex`, or `passphrase`. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}Updated in: rippled 1.4.0{% /badge %} |
| `seed`         | String  | _(Optional)_ The secret seed to use to sign the claim. This must be the same key pair as the public key specified in the channel. Must be in the XRP Ledger's [base58][] format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed_hex`, or `passphrase`. |
| `seed_hex`     | String  | _(Optional)_ The secret seed to use to sign the claim. This must be the same key pair as the public key specified in the channel. Must be in hexadecimal format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `passphrase`. |
| `passphrase`   | String  | _(Optional)_ A string passphrase to use to sign the claim. This must be the same key pair as the public key specified in the channel. The [key derived from this passphrase](../../../../concepts/accounts/cryptographic-keys.md#key-derivation) must match the public key specified in the channel. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `seed_hex`. |
| `key_type` | String | _(Optional)_ The [signing algorithm](../../../../concepts/accounts/cryptographic-keys.md#signing-algorithms) of the cryptographic key pair provided. Valid types are `secp256k1` or `ed25519`. The default is `secp256k1`. |
| `amount` | String | Cumulative amount of XRP, in drops, to authorize. If the destination has already received a lesser amount of XRP from this channel, the signature created by this method can be redeemed for the difference. |

The request **must** specify exactly one of `secret`, `seed`, `seed_hex`, or `passphrase`.

**Warning:** Do not send secret keys to untrusted servers or through unsecured network connections. (This includes the `secret`, `seed`, `seed_hex`, or `passphrase` fields of this request.) You should only use this method on a secure, encrypted network connection to a server you run or fully trust with your funds. Otherwise, eavesdroppers could use your secret key to sign claims and take all the money from this payment channel and anything else using the same key pair. See [Set Up Secure Signing](../../../../concepts/transactions/secure-signing.md) for instructions.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "channel_authorize_example_id1",
    "status": "success"
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `signature` | String | The signature for this claim, as a hexadecimal value. To process the claim, the destination account of the payment channel must send a [PaymentChannelClaim transaction][] with this signature, the exact Channel ID, XRP amount, and public key of the channel. |

## Possible Errors

* Any of the [universal error types][].
* `badKeyType` - The `key_type` parameter in the request is not a valid key type. (Valid types are `secp256k1` or `ed25519`.)
* `badSeed` - The `secret` in the request is not a valid secret key.
* `channelAmtMalformed` - The `amount` in the request is not a valid [XRP amount][XRP, in drops].
* `channelMalformed` - The `channel_id` in the request is not a valid Channel ID. The Channel ID should be a 256-bit (64-character) hexadecimal string.

{% raw-partial file="/_snippets/common-links.md" /%}
