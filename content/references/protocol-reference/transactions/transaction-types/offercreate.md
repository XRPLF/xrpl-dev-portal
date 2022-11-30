---
html: offercreate.html
parent: transaction-types.html
blurb: Submit an order to exchange currency.
labels:
  - Decentralized Exchange
---
# OfferCreate

[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "Source")

An OfferCreate transaction places an [Offer](offers.html) in the [decentralized exchange](decentralized-exchange.html).

## Example {{currentpage.name}} JSON

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

[Query example transaction. >](websocket-api-tool.html?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_OfferCreate%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%220CD69FD1F0A890CC57CDA430213FD294F7D65FF4A0F379A0D09D07A222D324E6%22%2C%22binary%22%3Afalse%7D)

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| Field          | JSON Type           | [Internal Type][] | Description       |
|:---------------|:--------------------|:------------------|:------------------|
| [`Expiration`](offers.html#offer-expiration) | Number | UInt32 | _(Optional)_ Time after which the Offer is no longer active, in [seconds since the Ripple Epoch][]. |
| `OfferSequence`  | Number              | UInt32            | _(Optional)_ An Offer to delete first, specified in the same way as [OfferCancel][]. |
| `TakerGets`      | [Currency Amount][] | Amount            | The amount and type of currency being sold. |
| `TakerPays`      | [Currency Amount][] | Amount            | The amount and type of currency being bought. |

## OfferCreate Flags

Transactions of the OfferCreate type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name             | Hex Value    | Decimal Value | Description           |
|:----------------------|:-------------|:--------------|:----------------------|
| `tfPassive`           | `0x00010000` | 65536         | If enabled, the Offer does not consume Offers that exactly match it, and instead becomes an Offer object in the ledger. It still consumes Offers that cross it. |
| `tfImmediateOrCancel` | `0x00020000` | 131072        | Treat the Offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). The Offer never creates an [Offer object][] in the ledger: it only trades as much as it can by consuming existing Offers at the time the transaction is processed. If no Offers match, it executes "successfully" without trading anything. In this case, the transaction still uses the [result code](transaction-results.html) `tesSUCCESS`. |
| `tfFillOrKill`        | `0x00040000` | 262144        | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). The Offer never creates an [Offer object][] in the ledger, and is canceled if it cannot be fully filled at the time of execution. By default, this means that the owner must receive the full `TakerPays` amount; if the `tfSell` flag is enabled, the owner must be able to spend the entire `TakerGets` amount instead. |
| `tfSell`              | `0x00080000` | 524288        | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |


## Error Cases

| Error Code               | Description                                       |
|:-------------------------|:--------------------------------------------------|
| `temINVALID_FLAG`        | Occurs if the transaction specifies both `tfImmediateOrCancel` and `tfFillOrKill`. |
| `tecEXPIRED`             | Occurs if the transaction specifies an `Expiration` time that has already passed _(Updated by the [DepositPreauth amendment][]: previously, the transaction used the result code `tesSUCCESS` in this case. In either case, the transaction has no effect except to destroy the XRP paid as a [transaction cost](transaction-cost.html).)_ |
| `tecKILLED`              | Occurs if the transaction specifies `tfFillOrKill`, and the full amount cannot be filled. _(Updated by the [fix1578 amendment][]: previously, the transaction used the result code `tesSUCCESS` in this case. In either case, the transaction does not execute any trades.)_ |
| `temBAD_EXPIRATION`      | Occurs if the transaction contains an `Expiration` field that is not validly formatted. |
| `temBAD_SEQUENCE`        | Occurs if the transaction contains an `OfferSequence` that is not validly formatted, or is higher than the transaction's own `Sequence` number. |
| `temBAD_OFFER`           | Occurs if the Offer tries to trade XRP for XRP, or tries to trade an invalid or negative amount of a token. |
| `temREDUNDANT`           | Occurs if the transaction specifies a token for the same token (same issuer and currency code). |
| `temBAD_CURRENCY`        | Occurs if the transaction specifies a token with the currency code "XRP". |
| `temBAD_ISSUER`          | Occurs if the transaction specifies a token with an invalid `issuer` value. |
| `tecNO_ISSUER`           | Occurs if the transaction specifies a token whose `issuer` value is not a funded account in the ledger. |
| `tecFROZEN`              | Occurs if the transaction involves a token on a [frozen](freezes.html) trust line (including local and global freezes). |
| `tecUNFUNDED_OFFER`      | Occurs if the owner does not hold a positive amount of the `TakerGets` currency. (Exception: if `TakerGets` specifies a token that the owner issues, the transaction can succeed.) |
| `tecNO_LINE`             | Occurs if the transaction involves a token whose issuer uses [Authorized Trust Lines](authorized-trust-lines.html) and the necessary trust line does not exist. |
| `tecNO_AUTH`             | Occurs if the transaction involves a token whose issuer uses [Authorized Trust Lines](authorized-trust-lines.html) and the the trust line that would receive the tokens exists but has not been authorized. |
| `tecINSUF_RESERVE_OFFER` | Occurs if the owner does not have enough XRP to meet the reserve requirement of adding a new Offer object to the ledger, and the transaction did not convert any currency. (If the transaction successfully traded any amount, the transaction succeeds with the result code `tesSUCCESS`, but does not create an Offer object in the ledger for the remainder.) |
| `tecDIR_FULL`            | Occurs if the owner owns too many items in the ledger, or the order book contains too many Offers at the same exchange rate already. |



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
