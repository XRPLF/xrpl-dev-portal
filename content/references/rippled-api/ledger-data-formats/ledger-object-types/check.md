# Check
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L157-L170 "Source")

_(Requires the [Checks amendment][] :not_enabled:.)_

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

| Field               | JSON Type        | [Internal Type][] | Description     |
|:--------------------|:-----------------|:------------------|:----------------|
| `LedgerEntryType`   | String           | UInt16            | The value `0x0043`, mapped to the string `Check`, indicates that this object is a Check object. |
| `Account`           | String           | Account           | The sender of the Check. Cashing the Check debits this address's balance. |
| `Destination`       | String           | Account           | The intended recipient of the Check. Only this address can cash the Check, using a [CheckCash transaction][]. |
| `Flags`             | Number           | UInt32            |  A bit-map of boolean flags. No flags are defined for Checks, so this value is always `0`. |
| `OwnerNode`         | String           | UInt64            | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String           | Hash256           | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `SendMax`           | String or Object | Amount            | The maximum amount of currency this Check can debit the sender. If the Check is successfully cashed, the destination is credited in the same currency for up to this amount. |
| `Sequence`          | Number           | UInt32            | The sequence number of the [CheckCreate transaction][] that created this check. |
| `DestinationNode`   | String           | UInt64            | _(Optional)_ A hint indicating which page of the destination's owner directory links to this object, in case the directory consists of multiple pages. |
| `DestinationTag`    | Number           | UInt32            | _(Optional)_ An arbitrary tag to further specify the destination for this Check, such as a hosted recipient at the destination address. |
| `Expiration`        | Number           | UInt32            | _(Optional)_ Indicates the time after which this Check is considered expired. See [Specifying Time][] for details. |
| `InvoiceID`         | String           | Hash256           | _(Optional)_ Arbitrary 256-bit hash provided by the sender as a specific reason or identifier for this Check. |
| `SourceTag`         | Number           | UInt32            | _(Optional)_ An arbitrary tag to further specify the source for this Check, such as a hosted recipient at the sender's address. |


## Check ID Format
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp#L193-L200 "Source")

The ID of a `Check` object is the [SHA-512Half][] of the following values, concatenated in order:

* The Check space key (`0x0043`)
* The AccountID of the sender of the [CheckCreate transaction][] that created the `Check` object
* The Sequence number of the [CheckCreate transaction][] that created the `Check` object

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
