---
seo:
    description: A channel for asynchronous XRP payments.
labels:
  - Payment Channels
---
# PayChannel
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L348-L363 "Source")

A `PayChannel` entry represents a [payment channel](../../../../concepts/payment-types/payment-channels.md). You can create a payment channel with a [PaymentChannelCreate transaction][].

_(Added by the [PayChan amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rBqb89MRQJnMPq8wTwEbtz4kvxrEDfcYvt",
    "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": "4325800",
    "Balance": "2323423",
    "PublicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A",
    "SettleDelay": 3600,
    "Expiration": 536027313,
    "CancelAfter": 536891313,
    "SourceTag": 0,
    "DestinationTag": 1002341,
    "DestinationNode": "0000000000000000",
    "Flags": 0,
    "LedgerEntryType": "PayChannel",
    "OwnerNode": "0000000000000000",
    "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
    "PreviousTxnLgrSeq": 14524914,
    "index": "96F76F27D8A327FC48753167EC04A46AA0E382E6F57F32FD12274144D00F1797"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type | [Internal Type][] | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `Account`           | String    | AccountID         | Yes       | The source address that owns this payment channel. This comes from the sending address of the transaction that created the channel. |
| `Amount`            | String    | Amount            | Yes       | Total [XRP, in drops][] or tokens, that have been allocated to this channel. This includes amounts that have been paid to the destination address. This is initially set by the transaction that created the channel and can be increased if the source address sends a `PaymentChannelFund` transaction. |
| `Balance`           | Object or String  | Amount            | Yes       | Total already paid out by the channel. The difference between this value and the `Amount` field is how much can still be paid to the destination address with `PaymentChannelClaim` transactions. If the channel closes, the remaining difference is returned to the source address. |
| `CancelAfter`       | Number    | UInt32            | No        | The immutable expiration time for this payment channel, in [seconds since the Ripple Epoch][]. This channel is expired if this value is present and smaller than the previous ledger's [`close_time` field](../ledger-header.md). This is optionally set by the transaction that created the channel, and cannot be changed. |
| `Destination`       | String    | AccountID         | Yes       | The destination address for this payment channel. While the payment channel is open, this address is the only one that can receive XRP from the channel. This comes from the `Destination` field of the transaction that created the channel. |
| `DestinationTag`    | Number    | UInt32            | No        | An arbitrary tag to further specify the destination for this payment channel, such as a hosted recipient at the destination address. |
| `DestinationNode`   | String    | UInt64            | No        | A hint indicating which page of the destination's owner directory links to this entry, in case the directory consists of multiple pages. Omitted on payment channels created before enabling the [fixPayChanRecipientOwnerDir amendment][]. |
| `Expiration`        | Number    | UInt32            | No        | The mutable expiration time for this payment channel, in [seconds since the Ripple Epoch][]. The channel is expired if this value is present and smaller than the previous ledger's [`close_time` field](../ledger-header.md). See [Channel Expiration](#channel-expiration) for more details. |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0078`, mapped to the string `PayChannel`, indicates that this is a payment channel entry. |
| `OwnerNode`         | String    | UInt64            | Yes       | A hint indicating which page of the source address's owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |
| `PublicKey`         | String    | Blob              | Yes       | Public key, in hexadecimal, of the key pair that can be used to sign claims against this channel. This can be any valid secp256k1 or Ed25519 public key. This is set by the transaction that created the channel and must match the public key used in claims against the channel. The channel source address can also send XRP from this channel to the destination without signed claims. |
| `SettleDelay`       | Number    | UInt32            | Yes       | Number of seconds the source address must wait to close the channel if it still has any XRP in it. Smaller values mean that the destination address has less time to redeem any outstanding claims after the source address requests to close the channel. Can be any value that fits in a 32-bit unsigned integer (0 to 2^32-1). This is set by the transaction that creates the channel. |
| `SourceTag`         | Number    | UInt32            | No        | An arbitrary tag to further specify the source for this payment channel, such as a hosted recipient at the owner's address. |
| `TransferRate`      | Number    | UInt32            | No        | The fee to charge when users make claims on a payment channel, initially set on the creation of a payment channel and updated on subsequent funding or claim transactions. |

## Channel Expiration

The `Expiration` field of a payment channel is the mutable expiration time, in contrast to the immutable expiration time represented by the `CancelAfter` field. The expiration of a channel is always considered relative to the [`close_time` field](../ledger-header.md) of the previous ledger. The `Expiration` field is omitted when a `PayChannel` entry is created. There are several ways the `Expiration` field of a `PayChannel` entry can be updated, which can be summarized as follows: a channel's source address can set the `Expiration` of the channel freely as long as the channel always remains open at least `SettleDelay` seconds after the first attempt to close it.

When a payment channel expires, at first it remains on the ledger, because only new transactions can modify ledger contents. Transaction processing automatically closes a payment channel when any transaction accesses it after the expiration. To close an expired channel and return the unspent XRP to the owner, some address must send a new PaymentChannelClaim or PaymentChannelFund transaction accessing the channel.


### Source Address

The source address can set the `Expiration` directly with the PaymentChannelFund transaction type. The new value must not be earlier than whichever of the following values is earliest:

- The current `Expiration` value (if one is set)
- The previous ledger's close time plus the `SettleDelay` of the channel

In other words, the source address can always make the `Expiration` later if an expiration is already set. The source can make an `Expiration` value earlier or set an `Expiration` if one isn't currently set, as long as the new value is at least `SettleDelay` seconds in the future. If the source address attempts to set an invalid `Expiration` date, the transaction fails with the `temBAD_EXPIRATION` error code.

The source address can also set the `Expiration` with the `tfClose` flag of the PaymentChannelClaim transaction type. If the flag is enabled, the ledger automatically sets the `Expiration` to whichever of the following values is earlier:

- The current `Expiration` value (if one is set)
- The previous ledger's close time plus the `SettleDelay` of the channel

The source address can remove the `Expiration` with the `tfRenew` flag of the PaymentChannelClaim transaction type.

### Destination Address

The destination address cannot set the `Expiration` field. However, the destination address can use the PaymentChannelClaim's `tfClose` flag to close a channel immediately.

### Other Addresses

If any other address attempts to set an `Expiration` field, the transaction fails with the `tecNO_PERMISSION` error code. However, if the channel is already expired, the transaction causes the channel to close and results in `tesSUCCESS` instead.



## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that created the payment channel, as long as the entry is in the ledger. Removing the channel frees up the reserve; this can only be done after the channel expires (including as a result of being explicitly closed).


## PayChannel ID Format

The ID of a `PayChannel` entry is the [SHA-512Half][] of the following values, concatenated in order:

* The PayChannel space key (`0x0078`)
* The AccountID of the source account
* The AccountID of the destination account
* The Sequence number of the [PaymentChannelCreate transaction][] that created the channel
    If the PaymentChannelCreate transaction used a [Ticket](../../../../concepts/accounts/tickets.md), use the `TicketSequence` value instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
