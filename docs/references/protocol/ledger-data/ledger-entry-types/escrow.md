---
seo:
    description: Contains XRP held for a conditional payment.
labels:
  - Escrow
---
# Escrow
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L329-L342 "Source")

An `Escrow` ledger entry represents an [escrow](../../../../concepts/payment-types/escrow.md), which holds XRP until specific conditions are met. You can create an escrow by sending an [EscrowCreate transaction][].

_(Added by the [Escrow amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

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

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type | [Internal Type][] | Required? | Description            |
|:--------------------|:----------|:------------------|:----------|:-----------------------|
| `Account`           | String    | AccountID         | Yes       | The address of the owner (sender) of this escrow. This is the account that provided the XRP, and gets it back if the escrow is canceled. |
| `Amount`            | Object or String    | Amount            | Yes       | The amount to be delivered by the payment is escrow. |
| `CancelAfter`       | Number    | UInt32            | No        | The escrow can be canceled if and only if this field is present _and_ the time it specifies has passed. Specifically, this is specified as [seconds since the Ripple Epoch][] and it "has passed" if it's earlier than the close time of the previous validated ledger. |
| `Condition`         | String    | Blob              | No        | A [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1), as hexadecimal. If present, the [EscrowFinish transaction][] must contain a fulfillment that satisfies this condition. |
| `Destination`       | String    | AccountID         | Yes       | The destination address where the XRP is paid if the escrow is successful. |
| `DestinationNode`   | String    | UInt64            | No        | A hint indicating which page of the destination's owner directory links to this object, in case the directory consists of multiple pages. Omitted on escrows created before enabling the [fix1523 amendment][]. |
| `DestinationTag`    | Number    | UInt32            | No        | An arbitrary tag to further specify the destination for this escrow, such as a hosted recipient at the destination address. |
| `FinishAfter`       | Number    | UInt32            | No        | The time, in [seconds since the Ripple Epoch][], after which this escrow can be finished. Any [EscrowFinish transaction][] before this time fails. (Specifically, this is compared with the close time of the previous validated ledger.) |
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0075`, mapped to the string `Escrow`, indicates that this is an `Escrow` entry. |
| `OwnerNode`         | String    | UInt64            | Yes       | A hint indicating which page of the sender's owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |
| `SourceTag`         | Number    | UInt32            | No        | An arbitrary tag to further specify the source for this escrow, such as a hosted recipient at the owner's address. |
| `TransferRate`      | Number    | UInt32            | No        | The fee to charge when users finish an escrow, initially set on the creation of an escrow contract and updated on subsequent finish transactions. |


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the sender's owner reserve as long as the entry is in the ledger. Finishing or canceling the escrow frees up this reserve.


## Escrow ID Format

The ID of an `Escrow` entry is the [SHA-512Half][] of the following values, concatenated in order:

* The Escrow space key (`0x0075`)
* The AccountID of the sender of the [EscrowCreate transaction][] that created the `Escrow` entry
* The Sequence number of the [EscrowCreate transaction][] that created the `Escrow` entry
    If the EscrowCreate transaction used a [Ticket](../../../../concepts/accounts/tickets.md), use the `TicketSequence` value instead.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
