---
html: paymentchannelcreate.html
parent: transaction-types.html
blurb: Open a new payment channel.
labels:
  - Payment Channels
---
# PaymentChannelCreate
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/PayChan.cpp "Source")

_Added by the [PayChan amendment][]._

Create a unidirectional channel and fund it with XRP. The address sending this transaction becomes the "source address" of the payment channel.

## Example {{currentpage.name}} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "PaymentChannelCreate",
    "Amount": "10000",
    "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "SettleDelay": 86400,
    "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A",
    "CancelAfter": 533171558,
    "DestinationTag": 23480,
    "SourceTag": 11747
}
```

[Query example transaction. >](websocket-api-tool.html?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_PaymentChannelCreate%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22711C4F606C63076137FAE90ADC36379D7066CF551E96DA6FE2BDAB5ECBFACF2B%22%2C%22binary%22%3Afalse%7D)

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | String    | Amount            | Amount of [XRP, in drops][Currency Amount], to deduct from the sender's balance and set aside in this channel. While the channel is open, the XRP can only go to the `Destination` address. When the channel closes, any unclaimed XRP is returned to the source address's balance. |
| `Destination`    | String    | AccountID         | Address to receive XRP claims against this channel. This is also known as the "destination address" for the channel. Cannot be the same as the sender (`Account`). |
| `SettleDelay`    | Number    | UInt32            | Amount of time the source address must wait before closing the channel if it has unclaimed XRP. |
| `PublicKey`      | String    | Blob              | The 33-byte public key of the key pair the source will use to sign claims against this channel, in hexadecimal. This can be any secp256k1 or Ed25519 public key. For more information on key pairs, see [Key Derivation](cryptographic-keys.html#key-derivation) <!-- STYLE_OVERRIDE: will --> |
| `CancelAfter`    | Number    | UInt32            | _(Optional)_ The time, in [seconds since the Ripple Epoch][], when this channel expires. Any transaction that would modify the channel after this time closes the channel without otherwise affecting it. This value is immutable; the channel can be closed earlier than this time but cannot remain open after this time. |
| `DestinationTag` | Number    | UInt32            | _(Optional)_ Arbitrary tag to further specify the destination for this payment channel, such as a hosted recipient at the destination address. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
