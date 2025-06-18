---
html: paymentchannelfund.html
parent: transaction-types.html
seo:
    description: Add more XRP to a payment channel.
labels:
  - Payment Channels
---
# PaymentChannelFund
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PayChan.cpp "Source")

_Added by the [PayChan amendment][]._

Add an additional amount to an open [payment channel](../../../../concepts/payment-types/payment-channels.md), and optionally update the expiration time of the channel. Only the source account of the channel can use this transaction.

Example PaymentChannelFund:

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "PaymentChannelFund",
    "Channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
    "Amount": "200000",
    "Expiration": 543171558
}
```

{% tx-example txid="877FA6E2FF8E08597D1F24E30BE8E52D0C9C06F0D620C5721E55622B6A632DFF" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field        | JSON Type | [Internal Type][] | Description                   |
|:-------------|:----------|:------------------|:------------------------------|
| `Channel`    | String    | Hash256           | The unique ID of the channel to fund, as a 64-character hexadecimal string. |
| `Amount`     | Object or String    | Amount  | Amount to add to the channel. Must be a positive amount. |
| `Expiration` | Number    | UInt32            | _(Optional)_ New `Expiration` time to set for the channel, in [seconds since the Ripple Epoch][]. This must be later than either the current time plus the `SettleDelay` of the channel, or the existing `Expiration` of the channel. After the `Expiration` time, any transaction that would access the channel closes the channel without taking its normal action. Any unspent XRP is returned to the source address when the channel closes. (`Expiration` is separate from the channel's immutable `CancelAfter` time.) For more information, see the [PayChannel ledger object type](../../ledger-data/ledger-entry-types/paychannel.md). |

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description                                      |
|:--------------------------|:-------------------------------------------------|
| `tecINSUFFICIENT_RESERVE` | The sending account has less XRP than the [reserve requirement](../../../../concepts/accounts/reserves.md). |
| `tecNO_DST`               | The destination account of the channel has been deleted. This is only possible if the payment channel was created before the [fixPayChanRecipientOwnerDir amendment](/resources/known-amendments.md#fixpaychanrecipientownerdir) became enabled (on 2020-05-01). |
| `tecNO_ENTRY`             | The Payment Channel identified by the `Channel` field does not exist. |
| `tecNO_PERMISSION`        | The sender of the transaction is not the source address for the channel. |
| `tecUNFUNDED`             | The sending account does not have enough XRP or fungible tokens to fund the channel with the requested amount and still meet the [reserve requirement](../../../../concepts/accounts/reserves.md). |
| `temBAD_AMOUNT`           | The `Amount` field of the transaction is invalid. The amount must either be XRP or fungible tokens and cannot be zero or negative. |
| `temBAD_EXPIRATION`       | The `Expiration` field is invalid.              |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
