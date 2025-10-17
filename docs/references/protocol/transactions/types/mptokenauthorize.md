---
seo:
    description: Set up your account to receive a specific MPT as a holder; or authorize a holder as an MPT issuer.
labels:
    - Multi-purpose Tokens, MPTs
---
# MPTokenAuthorize
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenAuthorize.cpp "Source")

Control whether an account can hold a given [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md). This transaction has several uses:

- An account indicates their willingness to hold an MPT. This creates a new [MPToken entry][] with an initial zero balance owned by that account. This is a prerequisite to receive that type of MPT in a payment.
- An account revokes their willingness to hold an MPT, deleting the [MPToken entry][]. This can only be done if their balance of the given MPT is zero.
- For an MPT that uses allow-listing, an issuer grants or revokes permission for another account to hold the given MPT.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenAuthorize JSON

This example assumes that the transaction is submitted by the holder of the token.

```json
{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rsNw23ygZatXv7h8QVSgAE4jktY2uW1iZP",
  "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "Fee": "10",
  "Flags": 0,
  "Sequence": 99537811
}
```

{% tx-example txid="9C19FBB8C0C92C17B11DF626A94303776D44AC36D7A760863FF3585532C38230" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type            | [Internal Type][] | Required? | Description |
|:--------------------|:---------------------|:------------------|:----------|:------------|
| `MPTokenIssuanceID` | String               | `UInt192`         | Yes       | The ID of the MPT to authorize. |
| `Holder`            | String - [Address][] | `AccountID`       | No        | The holder to authorize. Only used for authorization/allow-listing; must be omitted if submitted by the holder. |

### MPTokenAuthorize Flags

Transactions of the MPTokenAuthorize type support additional values in the `Flags` field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTUnauthorize` | `0x00000001` | 1             | When the holder enables this flag, if their balance of the given MPT is zero, it revokes their willingness to hold this MPT and deletes their `MPToken` entry. If their balance is non-zero, the transaction fails. When an issuer enables this flag, it revokes permission for the specified holder to hold this MPT; the transaction fails if the MPT does not use allow-listing. |

## See Also

- [MPToken entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
