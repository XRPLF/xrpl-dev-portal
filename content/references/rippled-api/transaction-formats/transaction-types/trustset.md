# TrustSet

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/SetTrust.cpp "Source")

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

| Field                        | JSON Type        | [Internal Type][] | Description |
|:-----------------------------|:-----------------|:------------------|:-------|
| [LimitAmount](#trust-limits) | Object           | Amount            | Object defining the trust line to create or modify, in the format of a [Currency Amount][]. |
| LimitAmount.currency         | String           | (Amount.currency) | The currency to this trust line applies to, as a three-letter [ISO 4217 Currency Code](http://www.xe.com/iso4217.php) or a 160-bit hex value according to [currency format](reference-currency.html). "XRP" is invalid. |
| LimitAmount.value            | String           | (Amount.value)    | Quoted decimal representation of the limit to set on this trust line. |
| LimitAmount.issuer           | String           | (Amount.issuer)   | The address of the account to extend trust to. |
| QualityIn                    | Unsigned Integer | UInt32            | _(Optional)_ Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |
| QualityOut                   | Unsigned Integer | UInt32            | _(Optional)_ Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. |

## Trust Limits

All balances on the XRP Ledger, except for XRP, represent value owed in the world outside the XRP Ledger. The address that issues those funds in the XRP Ledger (identified by the `issuer` field of the `LimitAmount` object) is expected to pay the balance back, outside of the XRP Ledger, when users redeem their XRP Ledger balances by returning them to the issuer.

Since a computer program cannot force a someone to keep a promise and not default in real life, trust lines represent a way of configuring how much you trust an issuer to hold on your behalf. Since a large, reputable financial institution is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuer "owe" you in the XRP Ledger. If the issuer defaults or goes out of business, you can lose up to that much money because the balances you hold in the XRP Ledger can no longer be exchanged for equivalent balances elsewhere. (You can still keep or trade the issuances in the XRP Ledger, but they no longer have any reason to be worth anything.)

There are two cases where you can hold a balance on a trust line that is *greater* than your limit: when you acquire more of that currency through [trading](#offercreate), or when you decrease the limit on your trust line.

Since a trust line occupies space in the ledger, [a trust line increases the XRP your account must hold in reserve](concept-reserves.html). This applies to the account extending trust, not to the account receiving it.

A trust line with settings in the default state is equivalent to no trust line.

The default state of all flags is off, except for the [NoRipple flag](concept-noripple.html), whose default state depends on the DefaultRipple flag.

The Auth flag of a trust line does not determine whether the trust line counts towards its owner's XRP reserve requirement. However, an enabled Auth flag prevents the trust line from being in its default state. An authorized trust line can never be deleted. An issuer can pre-authorize a trust line with the `tfSetfAuth` flag only, even if the limit and balance of the trust line are 0.

## TrustSet Flags

Transactions of the TrustSet type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name       | Hex Value  | Decimal Value | Description                   |
|:----------------|:-----------|:--------------|:------------------------------|
| tfSetfAuth      | 0x00010000 | 65536         | Authorize the other party to hold issuances from this account. (No effect unless using the [*asfRequireAuth* AccountSet flag](#accountset-flags).) Cannot be unset. |
| tfSetNoRipple   | 0x00020000 | 131072        | Blocks rippling between two trustlines of the same currency, if this flag is set on both. (See [No Ripple](concept-noripple.html) for details.) |
| tfClearNoRipple | 0x00040000 | 262144        | Clears the No-Rippling flag. (See [NoRipple](concept-noripple.html) for details.) |
| tfSetFreeze     | 0x00100000 | 1048576       | [Freeze](concept-freeze.html) the trustline. |
| tfClearFreeze   | 0x00200000 | 2097152       | [Unfreeze](concept-freeze.html) the trustline. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
