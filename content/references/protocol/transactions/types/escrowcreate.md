---
html: escrowcreate.html
parent: transaction-types.html
seo:
    description: Create an escrowed XRP payment.
labels:
  - Escrow
---
# EscrowCreate

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_Added by the [Escrow amendment][]._

Sequester XRP until the escrow process either finishes or is canceled.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowCreate",
    "Amount": "10000",
    "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "CancelAfter": 533257958,
    "FinishAfter": 533171558,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "DestinationTag": 23480,
    "SourceTag": 11747
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_EscrowCreate%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7%22%2C%22binary%22%3Afalse%7D)

{% partial file="/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->


| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | String    | Amount            | Amount of [XRP, in drops][Currency Amount], to deduct from the sender's balance and escrow. Once escrowed, the XRP can either go to the `Destination` address (after the `FinishAfter` time) or returned to the sender (after the `CancelAfter` time). |
| `Destination`    | String    | AccountID         | Address to receive escrowed XRP. |
| `CancelAfter`    | Number    | UInt32            | _(Optional)_ The time, in [seconds since the Ripple Epoch][], when this escrow expires. This value is immutable; the funds can only be returned to the sender after this time. |
| `FinishAfter`    | Number    | UInt32            | _(Optional)_ The time, in [seconds since the Ripple Epoch][], when the escrowed XRP can be released to the recipient. This value is immutable, and the funds can't be accessed until this time. |
| `Condition`      | String    | Blob              | _(Optional)_ Hex value representing a [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1). The funds can only be delivered to the recipient if this condition is fulfilled. If the condition is not fulfilled before the expiration time specified in the `CancelAfter` field, the XRP can only revert to the sender. |
| `DestinationTag` | Number    | UInt32            | _(Optional)_ Arbitrary tag to further specify the destination for this escrowed payment, such as a hosted recipient at the destination address. |

You must specify one of the following combinations of fields:

| Summary                           | `FinishAfter` | `Condition` | `CancelAfter` |
|-----------------------------------|---------------|-------------|---------------|
| Time-based                        | ✅            |             |               |
| Time-based with expiration        | ✅            |             | ✅            |
| Timed conditional                 | ✅            | ✅          |               |
| Timed conditional with expiration | ✅            | ✅          | ✅            |
| Conditional with expiration       |               | ✅          | ✅            |

It is not possible to create a conditional escrow with no expiration, but you can specify an expiration that is very far in the future.

**Note:** Before the [fix1571 amendment][] became enabled on 2018-06-19, it was possible to create an escrow with `CancelAfter` only. These escrows could be finished by anyone at any time before the specified expiration.

{% raw-partial file="/_snippets/common-links.md" /%}
