---
seo:
    description: Offer to trade currencies in the decentralized exchange; create a limit order.
labels:
    - Decentralized Exchange
---
# OfferCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CreateOffer.cpp "Source")

Place an [offer](../../../../concepts/tokens/decentralized-exchange/offers.md) to trade in the [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md).

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

{% tx-example txid="0CD69FD1F0A890CC57CDA430213FD294F7D65FF4A0F379A0D09D07A222D324E6" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `DomainID`       | String - [Hash][]   | UInt256           | No        | The ledger entry ID of a permissioned domain. If provided, restrict this offer to the [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md) of that domain. {% amendment-disclaimer name="PermissionedDEX" /%} |
| [`Expiration`](../../../../concepts/tokens/decentralized-exchange/offers.md#offer-expiration) | Number | UInt32 | No | Time after which the Offer is no longer active, in [seconds since the Ripple Epoch][]. |
| `OfferSequence`  | Number              | UInt32            | No        | An Offer to delete first, specified in the same way as [OfferCancel][]. |
| `TakerGets`      | [Currency Amount][] | Amount            | Yes       | The amount and type of currency being sold. |
| `TakerPays`      | [Currency Amount][] | Amount            | Yes       | The amount and type of currency being bought. |

## OfferCreate Flags

Transactions of the OfferCreate type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name             | Hex Value    | Decimal Value | Description           |
|:----------------------|:-------------|:--------------|:----------------------|
| `tfPassive`           | `0x00010000` | 65536         | Do not consume offers that exactly match this one, only offers that cross it. This makes it possible to set up offers in the ledger that peg the exchange rate at a specific value. |
| `tfImmediateOrCancel` | `0x00020000` | 131072        | Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel) and do not place an [Offer entry][] into the order books. The transaction trades as much as it can by consuming existing offers when it's processed. |
| `tfFillOrKill`        | `0x00040000` | 262144        | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill), do not place an [Offer entry][] into the order books, and cancel the offer if it cannot be fully filled at the time of execution. By default, this means that the owner must receive the full `TakerPays` amount; if the `tfSell` flag is enabled, the owner must be able to spend the entire `TakerGets` amount instead. |
| `tfSell`              | `0x00080000` | 524288        | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |
| `tfHybrid`            | `0x00100000` | 1048576       | Make this a hybrid offer that can use both a permissioned DEX and the open DEX. The `DomainID` field must be provided when using this flag. {% amendment-disclaimer name="PermissionedDEX" /%} |


## Error Cases

| Error Code               | Description                                       |
|:-------------------------|:--------------------------------------------------|
| `tecDIR_FULL`            | The owner owns too many items in the ledger, or the order book contains too many Offers at the same exchange rate already. |
| `tecEXPIRED`             | The transaction specifies an `Expiration` time that has already passed. |
| `tecFROZEN`              | The transaction involves a token on a [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) trust line (including local and global freezes). The `TakerPays` (buy amount) token has been deep-frozen by the issuer. |
| `tecINSUF_RESERVE_OFFER` | The owner does not have enough XRP to meet the reserve requirement of adding a new offer ledger entry, and the transaction did not convert any currency. (If the transaction successfully traded any amount, the transaction succeeds with the result code `tesSUCCESS`, but does not create an offer ledger entry for the remainder.) |
| `tecKILLED`              | The transaction specifies `tfFillOrKill`, and the full amount cannot be filled. If the _[ImmediateOfferKilled amendment][]_ is enabled, this result code also occurs when the transaction specifies `tfImmediateOrCancel` and executes without moving funds (previously, an Immediate or Cancel offer would return `tesSUCCESS` even if no funds were moved). |
| `tecNO_AUTH`             | The transaction involves a token whose issuer uses [Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) and the the trust line that would receive the tokens exists but has not been authorized. |
| `tecNO_ISSUER`           | The transaction specifies a token whose `issuer` value is not a funded account in the ledger. |
| `tecNO_LINE`             | The transaction involves a token whose issuer uses [Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) and the necessary trust line does not exist. |
| `tecNO_PERMISSION`       | The transaction uses a `DomainID` but the sender is not a member of that domain. {% amendment-disclaimer name="PermissionedDEX" /%} |
| `tecUNFUNDED_OFFER`      | The owner does not hold a positive amount of the `TakerGets` currency. (Exception: if `TakerGets` specifies a token that the owner issues, the transaction can succeed.) |
| `temBAD_CURRENCY`        | The transaction specifies a fungible token incorrectly, such as a fungible token with the currency code "XRP". |
| `temBAD_EXPIRATION`      | The transaction contains an `Expiration` field that is not validly formatted. |
| `temBAD_ISSUER`          | The transaction specifies a token with an invalid `issuer` value. |
| `temBAD_OFFER`           | The offer tries to trade XRP for XRP, or tries to trade an invalid or negative amount of a token. |
| `temBAD_SEQUENCE`        | The transaction contains an `OfferSequence` that is not validly formatted, or is higher than the transaction's own `Sequence` number. |
| `temINVALID_FLAG`        | The transaction specifies an invalid flag combination, such as both `tfImmediateOrCancel` and `tfFillOrKill`, or the transaction uses `tfHybrid` but omits the `DomainID` field. |
| `temREDUNDANT`           | The transaction would trade a token for the same token (same issuer and currency code). |

## See Also

- [Offer entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
