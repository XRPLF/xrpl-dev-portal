## EscrowCancel

[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/app/tx/impl/Escrow.cpp "Source")

_Requires the [Escrow Amendment](reference-amendments.html#escrow)._

Return escrowed XRP to the sender.

Example EscrowCancel:

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowCancel",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
}
```

| Field           | JSON Type        | [Internal Type][] | Description               |
|:----------------|:-----------------|:------------------|:--------------------------|
| `Owner`         | String           | AccountID         | Address of the source account that funded the escrow payment.
| `OfferSequence` | Unsigned Integer | UInt32            | Transaction sequence of [EscrowCreate transaction][] that created the escrow to cancel.

Any account may submit an EscrowCancel transaction.

* If the corresponding [EscrowCreate transaction][] did not specify a `CancelAfter` time, the EscrowCancel transaction fails.
* Otherwise the EscrowCancel transaction fails if the `CancelAfter` time is after the close time of the most recently-closed ledger.
