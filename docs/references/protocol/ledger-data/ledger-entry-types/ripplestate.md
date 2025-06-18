---
seo:
    description: This entry represents a trust line, tracking the net balance of tokens between them.
labels:
  - Tokens
---
# RippleState
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L277-L289 "Source")

A `RippleState` ledger entry represents a [trust line](../../../../concepts/tokens/fungible-tokens/index.md) between two accounts. Each account can change its own limit and other settings, but the balance is a single shared value. A trust line that is entirely in its default state is considered the same as a trust line that does not exist and is automatically deleted. You can create or modify a trust line with a [TrustSet transaction][].

## High vs. Low Account

There can only be one `RippleState` entry per currency for any given pair of accounts. Since no account is privileged in the XRP Ledger, a `RippleState` entry sorts account addresses numerically, to ensure a canonical form. Whichever address is numerically lower when [decoded](../../../../concepts/accounts/addresses.md#address-encoding) is deemed the "low account" and the other is the "high account". The net balance of the trust line is stored from the low account's perspective.

The ["issuer"](../../../../concepts/tokens/fungible-tokens/index.md) for the balance in a trust line depends on whether the balance is positive or negative. If a `RippleState` entry shows a positive balance, the high account is the issuer. If the balance is negative, the low account is the issuer. Often, the issuer has its limit set to 0 and the other account has a positive limit, but this is not reliable because limits can change without affecting an existing balance.


## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Balance": {
        "currency": "USD",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "-10"
    },
    "Flags": 393216,
    "HighLimit": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "110"
    },
    "HighNode": "0000000000000000",
    "LedgerEntryType": "RippleState",
    "LowLimit": {
        "currency": "USD",
        "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "value": "0"
    },
    "LowNode": "0000000000000000",
    "PreviousTxnID": "E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879",
    "PreviousTxnLgrSeq": 14090896,
    "index": "9CA88CDEDFF9252B3DE183CE35B038F57282BC9503CDFA1923EF9A95DF0D6F7B"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:--------------|:----------|:------------|
| `Balance`           | Object    | Amount        | Yes       | The balance of the trust line, from the perspective of the low account. A negative balance indicates that the high account holds tokens issued by the low account. The issuer in this is always set to the neutral value [ACCOUNT_ONE](../../../../concepts/accounts/addresses.md#special-addresses). |
| `Flags`             | Number    | UInt32        | Yes       | A bit-map of boolean options enabled for this entry. |
| `HighLimit`         | Object    | Amount        | Yes       | The limit that the high account has set on the trust line. The `issuer` is the address of the high account that set this limit. |
| `HighNode`          | String    | UInt64        | Yes       | (Omitted in some historical ledgers) A hint indicating which page of the high account's owner directory links to this entry, in case the directory consists of multiple pages. |
| `HighQualityIn`     | Number    | UInt32        | No        | The inbound quality set by the high account, as an integer in the implied ratio `HighQualityIn`:1,000,000,000. As a special case, the value 0 is equivalent to 1 billion, or face value. |
| `HighQualityOut`    | Number    | UInt32        | No        | The outbound quality set by the high account, as an integer in the implied ratio `HighQualityOut`:1,000,000,000. As a special case, the value 0 is equivalent to 1 billion, or face value. |
| `LedgerEntryType`   | String    | UInt16        | Yes       | The value `0x0072`, mapped to the string `RippleState`, indicates that this is a RippleState entry. |
| `LockCount`         | Object or String | Amount | No     | The total number of lock balances on a `RippleState` ledger object. |
| `LockedBalance`     | Object or String | Amount | No     | The total number of locked tokens on a `RippleState` ledger object. |
| `LowLimit`          | Object    | Amount        | Yes       | The limit that the low account has set on the trust line. The `issuer` is the address of the low account that set this limit. |
| `LowNode`           | String    | UInt64        | Yes       | (Omitted in some historical ledgers) A hint indicating which page of the low account's owner directory links to this entry, in case the directory consists of multiple pages. |
| `LowQualityIn`      | Number    | UInt32        | No        | The inbound quality set by the low account, as an integer in the implied ratio `LowQualityIn`:1,000,000,000. As a special case, the value 0 is equivalent to 1 billion, or face value. |
| `LowQualityOut`     | Number    | UInt32        | No        | The outbound quality set by the low account, as an integer in the implied ratio `LowQualityOut`:1,000,000,000. As a special case, the value 0 is equivalent to 1 billion, or face value. |
| `PreviousTxnID`     | String    | Hash256       | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number    | UInt32        | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |

## RippleState Flags

`RippleState` entries can have the following flags combined into the `Flags` field:

| Flag Name         | Hex Value    | Decimal Value | Corresponding [TrustSet Flag](../../transactions/types/trustset.md#trustset-flags) | Description |
|-------------------|--------------|---------------|-----------------|---------|
| `lsfAMMNode`      | `0x01000000` | 16777216      | (None)          | This entry consumed AMM liquidity to complete a [`Payment`](../../transactions/types/payment.md) transaction. |
| `lsfLowReserve`   | `0x00010000` | 65536         | (None)          | This entry [contributes to the low account's owner reserve](#ripplestate-reserve). |
| `lsfHighReserve`  | `0x00020000` | 131072        | (None)          | This entry [contributes to the high account's owner reserve](#ripplestate-reserve). |
| `lsfLowAuth`      | `0x00040000` | 262144        | `tfSetAuth`     | The low account has authorized the high account to hold tokens issued by the low account. |
| `lsfHighAuth`     | `0x00080000` | 524288        | `tfSetAuth`     | The high account has authorized the low account to hold tokens issued by the high account. |
| `lsfLowNoRipple`  | `0x00100000` | 1048576       | `tfSetNoRipple` | The low account [has disabled rippling](../../../../concepts/tokens/fungible-tokens/rippling.md) from this trust line. |
| `lsfHighNoRipple` | `0x00200000` | 2097152       | `tfSetNoRipple` | The high account [has disabled rippling](../../../../concepts/tokens/fungible-tokens/rippling.md) from this trust line. |
| `lsfLowFreeze`    | `0x00400000` | 4194304       | `tfSetFreeze`   | The low account has frozen the trust line, preventing the high account from transferring the asset. |
| `lsfHighFreeze`   | `0x00800000` | 8388608       | `tfSetFreeze`   | The high account has frozen the trust line, preventing the low account from transferring the asset. |
| `lsfLowDeepFreeze` | `0x02000000` | 33554432 |`tfSetLowDeepFreeze` | The low account has deep-frozen the trust line, preventing the high account from sending and receiving the asset. |
| `lsfHighDeepFreeze` | `0x04000000` | 67108864 | `tfSetHighDeepFreeze` | The high account has deep-frozen the trust line, preventing the low account from sending and receiving the asset. |

The two accounts connected by the trust line can each change their own settings with a [TrustSet transaction][].


## {% $frontmatter.seo.title %} Reserve
<a id="contributing-to-the-owner-reserve"></a>

A `RippleState` entry counts as one item towards the [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves) of _one or both_ of the accounts it connects. In typical cases, the holder of a token owes a reserve and the issuer of the token does not.

Specifically, the entry counts towards an account's reserve if that account modifies a trust line to put it in a non-default state. The `lsfLowReserve` and `lsfHighReserve` flags indicate which account(s) are responsible for the owner reserve. The protocol automatically sets these flags when it modifies a trust line.

The values that count towards a trust line's non-default state are as follows:

| High account responsible if... | Low account responsible if... |
|-----------------------|----------------------|
| `Balance` is negative (the high account holds currency) | `Balance` is positive (the low account holds currency) |
| `HighLimit` is not `0` | `LowLimit` is not `0`  |
| `LowQualityIn` is not `0` and not `1000000000` | `HighQualityIn` is not `0` and not `1000000000` |
| `LowQualityOut` is not `0` and not `1000000000` | `HighQualityOut` is not `0` and not `1000000000` |
| `lsfHighNoRipple` flag is not in its default state | `lsfLowNoRipple` flag is not in its default state |
| `lsfHighFreeze` flag is enabled | `lsfLowFreeze` flag is enabled |

The **`lsfLowAuth`** and **`lsfHighAuth`** flags do not count against the default state, because they cannot be disabled.

The default state of the two No Ripple flags depends on the state of the [`lsfDefaultRipple` flag](accountroot.md#accountroot-flags) in their corresponding AccountRoot entries. If Default Ripple is disabled (the default), then the default state of the `lsfNoRipple` flag is _enabled_ for all of an account's trust lines. If an account enables Default Ripple, then the `lsfNoRipple` flag is _disabled_ (rippling is enabled) for an account's trust lines by default.

{% admonition type="info" name="Note" %}Prior to the introduction of the Default Ripple flag in `rippled` version 0.27.3 (March 10, 2015), the default state for all trust lines was with both No Ripple flags disabled (rippling enabled).{% /admonition %}

The XRP Ledger uses lazy evaluation to calculate the owner reserve. This means that even if an account changes the default state of all its trust lines by changing the Default Ripple flag, that account's reserve stays the same initially. When an account modifies a trust line, the protocol re-evaluates whether that individual trust line is in its default state and should contribute to the owner reserve.


## RippleState ID Format

The ID of a RippleState entry is the [SHA-512Half][] of the following values, concatenated in order:

* The RippleState space key (`0x0072`)
* The AccountID of the low account
* The AccountID of the high account
* The 160-bit currency code of the trust line(s)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
