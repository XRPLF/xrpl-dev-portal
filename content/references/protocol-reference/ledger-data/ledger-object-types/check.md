---
html: check.html
parent: ledger-object-types.html
blurb: A check that can be redeemed for money by its destination.
labels:
  - Checks
---
# Check
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L157-L170 "Source")

_(Added by the [Checks amendment][].)_

A `Check` object describes a check, similar to a paper personal check, which can be cashed by its destination to get money from its sender. (The potential payment has already been approved by its sender, but no money moves until it is cashed. Unlike an [Escrow](escrow.html), the money for a Check is not set aside, so cashing the Check could fail due to lack of funds.)

## Example {{currentpage.name}} JSON

```json
{
  "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
  "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "DestinationNode": "0000000000000000",
  "DestinationTag": 1,
  "Expiration": 570113521,
  "Flags": 0,
  "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
  "LedgerEntryType": "Check",
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924",
  "PreviousTxnLgrSeq": 6,
  "SendMax": "100000000",
  "Sequence": 2,
  "index": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0"
}
```

## {{currentpage.name}} Fields

A `Check` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `Account`           | String           | Account           | Yes       | The sender of the Check. Cashing the Check debits this address's balance. |
| `Destination`       | String           | Account           | Yes       | The intended recipient of the Check. Only this address can cash the Check, using a [CheckCash transaction][]. |
| `DestinationNode`   | String           | UInt64            | No        | A hint indicating which page of the destination's owner directory links to this object, in case the directory consists of multiple pages. |
| `DestinationTag`    | Number           | UInt32            | No        | An arbitrary tag to further specify the destination for this Check, such as a hosted recipient at the destination address. |
| `Expiration`        | Number           | UInt32            | No        | Indicates the time after which this Check is considered expired. See [Specifying Time][] for details. |
| `Flags`             | Number           | UInt32            | Yes       | A bit-map of boolean flags enabled for this object. Currently, the protocol defines no flags for `Check` objects. The value is always `0`. |
| `InvoiceID`         | String           | Hash256           | No        | Arbitrary 256-bit hash provided by the sender as a specific reason or identifier for this Check. |
| `LedgerEntryType`   | String           | UInt16            | Yes       | The value `0x0043`, mapped to the string `Check`, indicates that this object is a Check object. |
| `OwnerNode`         | String           | UInt64            | Yes       | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String           | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | Yes       |The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `SendMax`           | String or Object | Amount            | Yes       | The maximum amount of currency this Check can debit the sender. If the Check is successfully cashed, the destination is credited in the same currency for up to this amount. |
| `Sequence`          | Number           | UInt32            | Yes       | The sequence number of the [CheckCreate transaction][] that created this check. |
| `SourceTag`         | Number           | UInt32            | No        | An arbitrary tag to further specify the source for this Check, such as a hosted recipient at the sender's address. |


## Check ID Format
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp#L193-L200 "Source")

The ID of a `Check` object is the [SHA-512Half][] of the following values, concatenated in order:

* The Check space key (`0x0043`)
* The AccountID of the sender of the [CheckCreate transaction][] that created the `Check` object
* The `Sequence` number of the [CheckCreate transaction][] that created the `Check` object.
    If the CheckCreate transaction used a [Ticket](tickets.html), use the `TicketSequence` value instead.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
