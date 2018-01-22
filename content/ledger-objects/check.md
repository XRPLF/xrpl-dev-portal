## Check
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/LedgerFormats.cpp#L158 "Source")

A `Check` object describes a check, a potential pull payment, waiting to be cashed. (The potential payment has already been approved by its sender.) Example `Check` object:

```json
{
  TODO
}
```

A `Check` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Description     |
|:--------------------|:-----------------|:------------------|:----------------|
| `LedgerEntryType`   | String           | UInt16            | The value `0x0043`, mapped to the string `Check`, indicates that this object is a Check object. |
| `Account`           | String           | Account           | The sender of the Check. Cashing the Check debits this address's balance. |
| `Destination`       | String           | Account           | The intended recipient of the Check. Only this address can cash the Check, using a [CheckCash transaction][]. |
| `Flags`             | Number           | UInt32            | No flags are defined for Checks, so this value is always `0`. |
| `SendMax`           | String or Object | Amount            | The maximum amount of currency this Check can debit the sender. If the Check is successfully cashed, the destination is credited in the same currency for up to this amount. |
| `Sequence`          | Number           | UInt32            | The sequence number of the [CheckCreate transaction][] that created this check. |
| `OwnerNode`         | String           | UInt64            | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `DestinationNode`   | String           | UInt64            | _(Optional)_ A hint indicating which page of the destination's owner directory links to this object, in case the directory consists of multiple pages. |
| `Expiration`        | Number           | UInt32            | (Optional) Indicates the time after which this Check is considered expired. See [Specifying Time](reference-rippled.html#specifying-time) for details. |
| `InvoiceID`         | String           | Hash256           | _(Optional)_ Arbitrary 256-bit hash provided by the sender as a specific reason or identifier for this Check. |
| `SourceTag`         | Number           | UInt32            | _(Optional)_ An arbitrary tag to further specify the source for this Check, such as a hosted recipient at the sender's address. |
| `DestinationTag`    | Number           | UInt32            | _(Optional)_ An arbitrary tag to further specify the destination for this Check, such as a hosted recipient at the destination address. |
| `PreviousTxnID`     | String           | Hash256           | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | The [index of the ledger](#ledger-index) that contains the transaction that most recently modified this object. |


### Check ID Format
[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/Indexes.cpp#L193-L200 "Source")

The ID of a `Check` object is the [SHA-512Half](#sha512half) of the following values put together:

* The Escrow space key (`0x0043`)
* The AccountID of the sender of the [CheckCreate transaction][] that created the `Check` object
* The Sequence number of the [CheckCreate transaction][] that created the `Check` object
