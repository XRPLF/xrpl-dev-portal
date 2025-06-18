---
seo:
    description: Open a new payment channel.
labels:
  - Payment Channels
---
# PaymentChannelCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PayChan.cpp "Source")

_Added by the [PayChan amendment][]._

Create a [payment channel](../../../../concepts/payment-types/payment-channels.md) and fund it with XRP. The address sending this transaction becomes the "source address" of the payment channel.

## Example {% $frontmatter.seo.title %} JSON

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

{% tx-example txid="711C4F606C63076137FAE90ADC36379D7066CF551E96DA6FE2BDAB5ECBFACF2B" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | Object or String    | Amount            | Amount to deduct from the sender's balance and set aside in this channel. While the channel is open, the amount can only go to the `Destination` address. When the channel closes, any unclaimed amount is returned to the source account's balance.|
| `Destination`    | String    | AccountID         | Address to receive XRP claims against this channel. This is also known as the "destination address" for the channel. Cannot be the same as the sender (`Account`). |
| `SettleDelay`    | Number    | UInt32            | Amount of time the source address must wait before closing the channel if it has unclaimed XRP. |
| `PublicKey`      | String    | Blob              | The 33-byte public key of the key pair the source will use to sign claims against this channel, in hexadecimal. This can be any secp256k1 or Ed25519 public key. For more information on key pairs, see [Key Derivation](../../../../concepts/accounts/cryptographic-keys.md#key-derivation) <!-- STYLE_OVERRIDE: will --> |
| `CancelAfter`    | Number    | UInt32            | _(Optional)_ The time, in [seconds since the Ripple Epoch][], when this channel expires. Any transaction that would modify the channel after this time closes the channel without otherwise affecting it. This value is immutable; the channel can be closed earlier than this time but cannot remain open after this time. |
| `DestinationTag` | Number    | UInt32            | _(Optional)_ Arbitrary tag to further specify the destination for this payment channel, such as a hosted recipient at the destination address. |

If the `Destination` account is blocking incoming payment channels, the transaction fails with result code `tecNO_PERMISSION`. _(Requires the [DisallowIncoming amendment][] )_

{% raw-partial file="/docs/_snippets/common-links.md" /%}
