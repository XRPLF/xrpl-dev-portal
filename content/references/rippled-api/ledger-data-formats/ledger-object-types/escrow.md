# Escrow
[[Source]](https://github.com/ripple/rippled/blob/c6b6d82a754fe449cc533e18659df483c10a5c98/src/ripple/protocol/impl/LedgerFormats.cpp#L90-L101 "Source")

_(Requires the [Escrow amendment][].)_

The `Escrow` object type represents a held payment of XRP waiting to be executed or canceled. An [EscrowCreate transaction][] creates an `Escrow` object in the ledger. A successful [EscrowFinish][] or [EscrowCancel][] transaction deletes the object. If the ``Escrow`` object has a [_crypto-condition_](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02), the payment can only succeed if an EscrowFinish transaction provides the corresponding _fulfillment_ that satisfies the condition. (The only supported crypto-condition type is [PREIMAGE-SHA-256](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1).) If the `Escrow` object has a `FinishAfter` time, the held payment can only execute after that time.

An `Escrow` object is associated with two addresses:

- The owner, who provides the XRP when creating the `Escrow` object. If the held payment is canceled, the XRP returns to the owner.
- The destination, where the XRP is paid when the held payment succeeds. The destination can be the same as the owner.

## Example {{currentpage.name}} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": "10000",
    "CancelAfter": 545440232,
    "Condition": "A0258020A82A88B2DF843A54F58772E4A3861866ECDB4157645DD9AE528C1D3AEEDABAB6810120",
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "DestinationTag": 23480,
    "FinishAfter": 545354132,
    "Flags": 0,
    "LedgerEntryType": "Escrow",
    "OwnerNode": "0000000000000000",
    "DestinationNode": "0000000000000000",
    "PreviousTxnID": "C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7",
    "PreviousTxnLgrSeq": 28991004,
    "SourceTag": 11747,
    "index": "DC5F3851D8A1AB622F957761E5963BC5BD439D5C24AC6AD7AC4523F0640244AC"
}
```

## {{currentpage.name}} Fields

An `Escrow` object has the following fields:

| Name              | JSON Type | [Internal Type][] | Description |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | String    | UInt16    | The value `0x0075`, mapped to the string `Escrow`, indicates that this object is an `Escrow` object. |
| `Account`           | String | AccountID | The address of the owner (sender) of this held payment. This is the account that provided the XRP, and gets it back if the held payment is canceled. |
| `Destination`       | String | AccountID | The destination address where the XRP is paid if the held payment is successful. |
| `Amount`            | String | Amount    | The amount of XRP, in drops, to be delivered by the held payment. |
| `Condition`         | String | VariableLength | _(Optional)_ A [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1), as hexadecimal. If present, the [EscrowFinish transaction][] must contain a fulfillment that satisfies this condition. |
| `CancelAfter`       | Number | UInt32 | _(Optional)_ The held payment can be canceled if and only if this field is present _and_ the time it specifies has passed. Specifically, this is specified as [seconds since the Ripple Epoch][] and it "has passed" if it's earlier than the close time of the previous validated ledger. |
| `FinishAfter`       | Number | UInt32 | _(Optional)_ The time, in [seconds since the Ripple Epoch][], after which this held payment can be finished. Any [EscrowFinish transaction][] before this time fails. (Specifically, this is compared with the close time of the previous validated ledger.) |
| `Flags`             | Number | UInt32 | A bit-map of boolean flags. No flags are defined for the Escrow type, so this value is always `0`. |
| `SourceTag`         | Number | UInt32 | _(Optional)_ An arbitrary tag to further specify the source for this held payment, such as a hosted recipient at the owner's address. |
| `DestinationTag`    | Number | UInt32 | _(Optional)_ An arbitrary tag to further specify the destination for this held payment, such as a hosted recipient at the destination address. |
| `OwnerNode`         | String    | UInt64    | A hint indicating which page of the owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `DestinationNode`   | String    | UInt64    | _(Optional)_ A hint indicating which page of the destination's owner directory links to this object, in case the directory consists of multiple pages. Omitted on escrows created before enabling the [fix1523 amendment][]. |
| `PreviousTxnID`     | String | Hash256 | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number | UInt32 | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |


## Escrow ID Format

The ID of an `Escrow` object is the [SHA-512Half][] of the following values, concatenated in order:

* The Escrow space key (`0x0075`)
* The AccountID of the sender of the [EscrowCreate transaction][] that created the `Escrow` object
* The Sequence number of the [EscrowCreate transaction][] that created the `Escrow` object

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
