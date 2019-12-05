# PayChannel
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L141-L155 "Source")

_(Requires the [PayChan amendment][].)_

The `PayChannel` object type represents a payment channel. Payment channels enable small, rapid off-ledger payments of XRP that can be later reconciled with the consensus ledger. A payment channel holds a balance of XRP that can only be paid out to a specific destination address until the channel is closed. Any unspent XRP is returned to the channel's owner (the source address that created and funded it) when the channel closes.

The [PaymentChannelCreate transaction][] type creates a `PayChannel` object. The [PaymentChannelFund][] and [PaymentChannelClaim transaction][] types modify existing `PayChannel` objects.

When a payment channel expires, at first it remains on the ledger, because only new transactions can modify ledger contents. Transaction processing automatically closes a payment channel when any transaction accesses it after the expiration. To close an expired channel and return the unspent XRP to the owner, some address must send a new PaymentChannelClaim or PaymentChannelFund transaction accessing the channel.

For an example of using payment channels, see the [Payment Channels Tutorial](use-payment-channels.html).

## Example {{currentpage.name}} JSON

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
    "Flags": 0,
    "LedgerEntryType": "PayChannel",
    "OwnerNode": "0000000000000000",
    "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
    "PreviousTxnLgrSeq": 14524914,
    "index": "96F76F27D8A327FC48753167EC04A46AA0E382E6F57F32FD12274144D00F1797"
}
```

## {{currentpage.name}} Fields

A `PayChannel` object has the following fields:

| Name                | JSON Type | [Internal Type][] | Description            |
|:--------------------|:----------|:------------------|:-----------------------|
| `LedgerEntryType`   | String    | UInt16            | The value `0x0078`, mapped to the string `PayChannel`, indicates that this object is a payment channel object. |
| `Account`           | String    | AccountID         | The source address that owns this payment channel. This comes from the sending address of the transaction that created the channel. |
| `Destination`       | String    | AccountID         | The destination address for this payment channel. While the payment channel is open, this address is the only one that can receive XRP from the channel. This comes from the `Destination` field of the transaction that created the channel. |
| `Amount`            | String    | Amount            | Total [XRP, in drops][], that has been allocated to this channel. This includes XRP that has been paid to the destination address. This is initially set by the transaction that created the channel and can be increased if the source address sends a PaymentChannelFund transaction. |
| `Balance`           | String    | Amount            | Total [XRP, in drops][], already paid out by the channel. The difference between this value and the `Amount` field is how much XRP can still be paid to the destination address with PaymentChannelClaim transactions. If the channel closes, the remaining difference is returned to the source address. |
| `PublicKey`         | String    | PubKey            | Public key, in hexadecimal, of the key pair that can be used to sign claims against this channel. This can be any valid secp256k1 or Ed25519 public key. This is set by the transaction that created the channel and must match the public key used in claims against the channel. The channel source address can also send XRP from this channel to the destination without signed claims. |
| `SettleDelay`       | Number    | UInt32            | Number of seconds the source address must wait to close the channel if it still has any XRP in it. Smaller values mean that the destination address has less time to redeem any outstanding claims after the source address requests to close the channel. Can be any value that fits in a 32-bit unsigned integer (0 to 2^32-1). This is set by the transaction that creates the channel. |
| `OwnerNode`         | String    | UInt64            | A hint indicating which page of the source address's owner directory links to this object, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256           | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Flags`             | Number    | UInt32            | A bit-map of boolean flags enabled for this payment channel. Currently, the protocol defines no flags for `PayChannel` objects. |
| `Expiration`        | Number    | UInt32            | _(Optional)_ The mutable expiration time for this payment channel, in [seconds since the Ripple Epoch][]. The channel is expired if this value is present and smaller than the previous ledger's [`close_time` field](ledger-header.html). See [Setting Channel Expiration](#setting-channel-expiration) for more details. |
| `CancelAfter`       | Number    | UInt32            | _(Optional)_ The immutable expiration time for this payment channel, in [seconds since the Ripple Epoch][]. This channel is expired if this value is present and smaller than the previous ledger's [`close_time` field](ledger-header.html). This is optionally set by the transaction that created the channel, and cannot be changed. |
| `SourceTag`         | Number    | UInt32            | _(Optional)_ An arbitrary tag to further specify the source for this payment channel, such as a hosted recipient at the owner's address. |
| `DestinationTag`    | Number    | UInt32            | _(Optional)_ An arbitrary tag to further specify the destination for this payment channel, such as a hosted recipient at the destination address. |


## Setting Channel Expiration

The `Expiration` field of a payment channel is the mutable expiration time, in contrast to the immutable expiration time represented by the `CancelAfter` field. The expiration of a channel is always considered relative to the [`close_time` field](ledger-header.html) of the previous ledger. The `Expiration` field is omitted when a `PayChannel` object is created. There are several ways the `Expiration` field of a `PayChannel` object can be updated, which can be summarized as follows: a channel's source address can set the `Expiration` of the channel freely as long as the channel always remains open at least `SettleDelay` seconds after the first attempt to close it.

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


## PayChannel ID Format

The ID of a `PayChannel` object is the [SHA-512Half][] of the following values, concatenated in order:

* The PayChannel space key (`0x0078`)
* The AccountID of the source account
* The AccountID of the destination account
* The Sequence number of the transaction that created the channel

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
