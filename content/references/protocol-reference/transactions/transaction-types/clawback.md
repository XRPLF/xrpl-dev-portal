---
html: clawback.html
parent: transaction-types.html
blurb: Claw back an issued currency transfer between accounts in a trust set.
labels:
  - Tokens
status: not_enabled
---
# Clawback

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Clawback.cpp "Source")

Claw back an issued currency transfer between accounts in a trust set.

## Example {{currentpage.name}} JSON

```json
{
  "TransactionType": "Clawback",
  "Account": "rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S",
  "Amount": {
      "currency": "FOO",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "314.159"
    }
}
```

[Clawback example transaction. >](websocket-api-tool.html?server=wss%3A%2F%2Fs.devnet.rippletest.net%2F&tx=%7B%22id%22%3A%22example_Clawback%22%2C%22command%22%3A%22Clawback%22%2C%22Account%22%3A%22rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S%22%2C%22Amount%22%3A%7B%22currency%22%3A%22FOO%22%2C%22issuer%22%3A%22rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW%22%2C%22value%22%3A%22314.159%22%7D%7D)

{% include '_snippets/tx-fields-intro.md' %}

| Field              | JSON Type | [Internal Type][] | Description       |
|:-------------------|:----------|:------------------|:------------------|
| `TransactionType`  | string    | `UINT16`          | Indicates the new transaction type `Clawback`. The integer value is `30`. The name is ttCLAWBACK. |
| `Account`          | string    | `ACCOUNT ID`      | The account executing this transaction. The account must be the issuer of the asset being clawed back. Note that in the XRP Ledger, trustlines are bidirectional and, under some configurations, both sides can be seen as the "issuer" of an asset. In this specification, the term issuer is used to mean the side of the trustline that has an outstanding balance (that is, 'owes' the issued asset) that it wants to claw back.|
| `Flags`            | number    | `UINT32`          | (Optional) The universal transaction flags that are applicable to all transactions (for example, `tfFullyCanonicalSig`) are valid. This proposal introduces no new transaction-specific flags. |
| `Amount`           | object     | `AMOUNT`          | Indicates the amount being clawed back, as well as the counterparty from which the amount is being clawed back from. |

It is not an error if the amount exceeds the holder's balance; in that case, the maximum available balance is clawed back. It returns temBAD_AMOUNT if the amount is zero.

It is an error if the counterparty listed in `Amount` is the same as the `Account` issuing this transaction; the transaction fails execution with `temBAD_AMOUNT`.

If there doesn't exist a trustline with the counterparty or that trustline's balance is 0, the error `tecNO_LINE` is returned.

The sub-field `issuer` within `Amount` represents the token holder's account ID rather than the issuer's.

## lsfAllowTrustLineClawback

Clawback is disabled by default. To use clawback, you must set the `lsfAllowTrustLineClawback` flag through an `AccountSet` transaction. The `AccountSet` transaction only succeeds if the account has an empty owner directory, meaning that the account has no trustlines, offers, escrows, payment channels, or checks. After you set this flag, it cannot reverted. The account permanently gains the ability to claw back issued assets on trustlines.

If you attempt to set `lsfAllowTrustLineClawback` while `lsfNoFreeze` is set, the transaction returns `tecNO_PERMISSION`, because clawback cannot be enabled on an account that has already disclaimed the ability to freeze trustlines. 
Conversely, if you try to set `lsfNoFreeze` while `lsfAllowTrustLineClawback` is set, the transaction also returns `tecNO_PERMISSION`.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
