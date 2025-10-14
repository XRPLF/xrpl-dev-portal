---
seo:
    description: Escrow funds, which can be released to the destination after a specific time or condition.
labels:
    - Escrow
---
# EscrowCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

Set aside funds in an [escrow](../../../../concepts/payment-types/escrow.md) that delivers them to a predetermined recipient when certain conditions are met. If the escrow has an expiration, the funds can also be returned to the sender after it expires.

{% admonition type="info" name="Note" %}
To escrow fungible tokens you must take note of the following:

- Trust Line Tokens must have the **Allow Trust Line Locking** flag enabled on their account.
- Multi-Purpose-Tokens (MPTs) must have both the **Can Escrow** and **Can Transfer** flags enabled.
- All token escrows must specify a **Cancel After** time.
- If the token requires **authorization**, both sender and recipient must be pre-authorized by the issuer.
{% /admonition %}

{% amendment-disclaimer name="TokenEscrow" mode="updated" /%}


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

{% tx-example txid="C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field            | JSON Type | [Internal Type][] | Description               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | Object or String    | Amount            | Amount of XRP, in drops, or fungible tokens to deduct from the sender's balance and escrow. Once escrowed, the payment can either go to the `Destination` address (after the `FinishAfter` time) or be returned to the sender (after the `CancelAfter` time). {% amendment-disclaimer name="TokenEscrow" mode="updated" /%} |
| `Destination`    | String    | AccountID         | Address to receive escrowed funds. |
| `CancelAfter`    | Number    | UInt32            | _(Optional for XRP escrows, but mandatory for token escrows)_ The time, in [seconds since the Ripple Epoch][], when this escrow expires. This value is immutable; the funds can only be returned to the sender after this time. |
| `FinishAfter`    | Number    | UInt32            | _(Optional)_ The time, in [seconds since the Ripple Epoch][], when the escrowed funds can be released to the recipient. This value is immutable, and the funds can't be accessed until this time. |
| `Condition`      | String    | Blob              | _(Optional)_ Hex value representing a [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1). The funds can only be delivered to the recipient if this condition is fulfilled. If the condition is not fulfilled before the expiration time specified in the `CancelAfter` field, the funds can only revert to the sender. |
| `DestinationTag` | Number    | UInt32            | _(Optional)_ Arbitrary tag to further specify the destination for this escrowed payment, such as a hosted recipient at the destination address. |

You must specify one of the following combinations of fields:

| Summary                           | `FinishAfter` | `Condition` | `CancelAfter` |
|-----------------------------------|---------------|-------------|---------------|
| Time-based (XRP only)             | ✅            |             |               |
| Time-based with expiration        | ✅            |             | ✅            |
| Timed conditional (XRP only)      | ✅            | ✅          |               |
| Timed conditional with expiration | ✅            | ✅          | ✅            |
| Conditional with expiration       |               | ✅          | ✅            |

It is not possible to create a conditional escrow with no expiration, but you can specify an expiration that is very far in the future.

{% admonition type="info" name="Note" %}
Before the [fix1571 amendment][] became enabled on 2018-06-19, it was possible to create an XRP escrow with `CancelAfter` only. These escrows could be finished by anyone at any time before the specified expiration.
{% /admonition %}

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code            | Description                                  |
|:--------------------- |:---------------------------------------------|
| `tecNO_PERMISSION` | The transaction failed because the necessary permissions for token escrow are not in place. For example, the issuer hasn't enabled the Allow Trust Line Locking flag for a Trust Line Token.|
| `tecNO_AUTH` | The transaction failed because authorization requirements for the token were not met. For example, the sender lacks authorization when creating the escrow. |
| `tecUNFUNDED`         | The sender lacks sufficient spendable balance. For Trust Line Tokens, this means the sender's trust line with the issuer has insufficient available balance. For XRP escrows, this means the sender doesn't have enough XRP. |
| `tecOBJECT_NOT_FOUND` | The sender does not hold the MPT. |
| `tecFROZEN`           | The token is frozen (for Trust Line Tokens) or locked (for MPTs) for the sender. |

## See Also

- [Escrow entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
