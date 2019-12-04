# TrustSet

[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/SetTrust.cpp "Source")

Create or modify a trust line linking two accounts.

## Example {{currentpage.name}} JSON

```json
{
    "TransactionType": "TrustSet",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 262144,
    "LastLedgerSequence": 8007750,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
      "value": "100"
    },
    "Sequence": 12
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field                    | JSON Type | [Internal Type][] | Description       |
|:-------------------------|:----------|:------------------|:------------------|
| `LimitAmount`            | Object    | Amount            | Object defining the trust line to create or modify, in the format of a [Currency Amount][]. |
| `LimitAmount`.`currency` | String    | (Amount.currency) | The currency to this trust line applies to, as a three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to [currency format](currency-formats.html). "XRP" is invalid. |
| `LimitAmount`.`value`    | String    | (Amount.value)    | Quoted decimal representation of the limit to set on this trust line. |
| `LimitAmount`.`issuer`   | String    | (Amount.issuer)   | The address of the account to extend trust to. |
| `QualityIn`              | Number    | UInt32            | _(Optional)_ Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |
| `QualityOut`             | Number    | UInt32            | _(Optional)_ Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |


## TrustSet Flags

Transactions of the TrustSet type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name       | Hex Value  | Decimal Value | Description                   |
|:----------------|:-----------|:--------------|:------------------------------|
| tfSetfAuth      | 0x00010000 | 65536         | Authorize the other party to hold issuances from this account. (No effect unless using the [*asfRequireAuth* AccountSet flag](accountset.html#accountset-flags).) Cannot be unset. |
| tfSetNoRipple   | 0x00020000 | 131072        | Blocks rippling between two trustlines of the same currency, if this flag is set on both. (See [No Ripple](rippling.html) for details.) If the [fix1578 amendment][] is enabled, a transaction that uses this flag and cannot enable NoRipple fails with the result code `tecNO_PERMISSION`. If the amendment is not enabled, the transaction can result in `tesSUCCESS` (making any other changes it can) even if it cannot enable NoRipple on the trust line. |
| tfClearNoRipple | 0x00040000 | 262144        | Clears the No-Rippling flag. (See [NoRipple](rippling.html) for details.) |
| tfSetFreeze     | 0x00100000 | 1048576       | [Freeze](freezes.html) the trustline. |
| tfClearFreeze   | 0x00200000 | 2097152       | [Unfreeze](freezes.html) the trustline. |

The Auth flag of a trust line does not determine whether the trust line counts towards its owner's XRP reserve requirement. However, an enabled Auth flag prevents the trust line from being in its default state. An authorized trust line can never be deleted. An issuer can pre-authorize a trust line with the `tfSetfAuth` flag only, even if the limit and balance of the trust line are 0.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
