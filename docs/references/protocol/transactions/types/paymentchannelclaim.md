---
html: paymentchannelclaim.html
parent: transaction-types.html
seo:
    description: Claim money from a payment channel.
labels:
  - Payment Channels
---
# PaymentChannelClaim
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PayChan.cpp "Source")

_Added by the [PayChan amendment][]._

Claim XRP or fungible tokens from a payment channel, adjust the payment channel's expiration, or both. This transaction can be used differently depending on the transaction sender's role in the specified channel:

The **source address** of a channel can:

- Send XRP or fungible tokens from the channel to the destination with _or without_ a signed Claim.
- Set the channel to expire as soon as the channel's `SettleDelay` has passed.
- Clear a pending `Expiration` time.
- Close a channel immediately, with or without processing a claim first. The source address cannot close the channel immediately if the channel has any amount remaining.

The **destination address** of a channel can:

- Receive XRP or fungible tokens from the channel using a signed Claim.
- Close the channel immediately after processing a Claim, refunding any unclaimed amount to the channel's source.

**Any address** sending this transaction can:

- Cause a channel to be closed if its `Expiration` or `CancelAfter` time is older than the previous ledger's close time. Any validly formed `PaymentChannelClaim` transaction has this effect, regardless of the contents of the transaction.

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
  "Balance": "1000000",
  "Amount": "1000000",
  "Signature": "30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1E721B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80ECA3CD7B9B",
  "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A"
}
```

{% tx-example txid="9C0CAAC3DD1A74461132DA4451F9E53BDF4C93DFDBEFCE1B10021EC569013B33" /%}

<!--{# TODO: replace the above example with one where the channel, public key, signature, and balance match #}-->

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field       | JSON Type | [Internal Type][] | Required? | Description |
|:------------|:----------|:------------------|:----------|:------------|
| `Amount`    | Object or String    | Amount            | No        | The amount of [XRP, in drops][Currency Amount], or fungible tokens authorized by the `Signature`. This must match the amount in the signed message. This is the cumulative amount of XRP and fungible tokens that can be dispensed by the channel, including funds previously redeemed. |
| `Balance`   | String    | Amount            | No        | Total amount of [XRP, in drops][Currency Amount], or fungible tokens delivered by this channel after processing this claim. Required to deliver XRP or fungible tokens. Must be more than the total amount delivered by the channel so far, but not greater than the `Amount` of the signed claim. Must be provided except when closing the channel. |
| `Channel`   | String    | Hash256           | Yes       | The unique ID of the channel, as a 64-character hexadecimal string. |
| `CredentialIDs` | Array of Strings | Vector256  | No    | Set of Credentials to authorize a deposit made by this transaction. Each member of the array must be the ledger entry ID of a Credential entry in the ledger. For details, see [Credential IDs](./payment.md#credential-ids). |
| `PublicKey` | String    | Blob              | No        | The public key used for the signature, as hexadecimal. This must match the `PublicKey` stored in the ledger for the channel. Required unless the sender of the transaction is the source address of the channel and the `Signature` field is omitted. (The transaction includes the public key so that `rippled` can check the validity of the signature before trying to apply the transaction to the ledger.) |
| `Signature` | String    | Blob              | No        | The signature of this claim, as hexadecimal. The signed message contains the channel ID and the amount of the claim. Required unless the sender of the transaction is the source address of the channel. |

If the payment channel was created before the [fixPayChanRecipientOwnerDir amendment](/resources/known-amendments.md#fixpaychanrecipientownerdir) became enabled (on 2020-05-01), it is possible that the destination account has been [deleted](../../../../concepts/accounts/deleting-accounts.md) and does not currently exist in the ledger. If the destination has been deleted, the source account cannot send XRP from the channel to the destination; instead, the transaction fails with `tecNO_DST`. Other uses of this transaction type are unaffected when the destination account has been deleted, including adjusting the channel expiration, closing a channel with no XRP, or removing a channel that has passed its expiration time.


## PaymentChannelClaim Flags

Transactions of the `PaymentChannelClaim` type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name | Hex Value    | Decimal Value | Description                       |
|:----------|:-------------|:--------------|:----------------------------------|
| `tfRenew` | `0x00010000` | 65536         | Clear the channel's `Expiration` time. (`Expiration` is different from the channel's immutable `CancelAfter` time.) Only the source address of the payment channel can use this flag. |
| `tfClose` | `0x00020000` | 131072        | Request to close the channel. Only the channel source and destination addresses can use this flag. This flag closes the channel immediately if it has no more XRP allocated to it after processing the current claim, or if the destination address uses it. If the source address uses this flag when the channel still holds XRP, this schedules the channel to close after `SettleDelay` seconds have passed. (Specifically, this sets the `Expiration` of the channel to the close time of the previous ledger plus the channel's `SettleDelay` time, unless the channel already has an earlier `Expiration` time.) If the destination address uses this flag when the channel still holds XRP, any XRP that remains after processing the claim is returned to the source address. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
