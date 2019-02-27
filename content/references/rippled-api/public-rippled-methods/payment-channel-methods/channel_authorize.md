# channel_authorize
[[Source]<br>](https://github.com/ripple/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L41 "Source")

_(Requires the [PayChan amendment][] to be enabled. [New in: rippled 0.33.0][])_

The `channel_authorize` method creates a signature that can be used to redeem a specific amount of XRP from a payment channel.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": "channel_authorize_example_id1",
    "command": "channel_authorize",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "secret": "s████████████████████████████",
    "amount": "1000000"
}
```

*JSON-RPC*

```json
POST http://localhost:5005/
Content-Type: application/json

{
    "method": "channel_authorize",
    "params": [{
        "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
        "secret": "s████████████████████████████",
        "amount": "1000000"
    }]
}
```

*Commandline*

```
#Syntax: channel_authorize <private_key> <channel_id> <drops>
rippled channel_authorize s████████████████████████████ 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| Field | Type | Description |
|-------|------|-------------|
| `channel_id` | String | The unique ID of the payment channel to use.
| `secret` | String | The secret key to use to sign the claim. This must be the same key pair as the public key specified in the channel. |
| `amount` | String | Cumulative amount of XRP, in drops, to authorize. If the destination has already received a lesser amount of XRP from this channel, the signature created by this method can be redeemed for the difference. |

**Note:** You cannot use Ed25519 keys to sign claims with this method. This is a known bug (RIPD-1474).

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": "channel_authorize_example_id1",
    "status": "success"
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
    }
}
```

*JSON-RPC*

```json
200 OK

{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```

*Commandline*

```
{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `signature` | String | The signature for this claim, as a hexadecimal value. To process the claim, the destination account of the payment channel must send a [PaymentChannelClaim transaction][] with this signature, the exact Channel ID, XRP amount, and public key of the channel. |

## Possible Errors

* Any of the [universal error types][].
* `badSeed` - The `secret` in the request is not a valid secret key.
* `channelAmtMalformed` - The `amount` in the request is not a valid [XRP amount][XRP, in drops].
* `channelMalformed` - The `channel_id` in the request is not a valid Channel ID. The Channel ID should be a 256-bit (64-character) hexadecimal string.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
