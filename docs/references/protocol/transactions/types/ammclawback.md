---
seo:
    description: Claw back tokens from a holder who has deposited your issued tokens into an Automated Market Maker pool.
labels:
    - AMM
    - Tokens
---
# AMMClawback

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMClawback.cpp "Source")

Claw back tokens from a holder who has deposited your issued tokens into an AMM pool.

Clawback is disabled by default:

- **For Trust Line Tokens:** You must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists. After you enable clawback, it cannot be reverted: the account permanently gains the ability to claw back issued assets on trust lines.

- **For MPTs:** The MPT issuance must have the **Can Clawback** flag enabled.

{% amendment-disclaimer name="AMMClawback" /%}

<!-- TODO: Add {% amendment-disclaimer name="MPTokensV2" mode="updated" /%} badge. -->

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="Trust Line Token/Trust Line Token" %}
```json
{
  "TransactionType": "AMMClawback",
  "Account": "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
  "Holder": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Asset": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL"
  },
  "Asset2" : {
      "currency" : "BAR",
      "issuer" : "rHtptZx1yHf6Yv43s1RWffM3XnEYv3XhRg"
  },
  "Amount": {
      "currency" : "FOO",
      "issuer" : "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
      "value" : "1000"
  }
}
```
{% /tab %}

{% tab label="MPT/MPT" %}
```json
{
  "TransactionType": "AMMClawback",
  "Account": "rPdYxU9dNkbzC5Y2h4jLbVJ3rMRrk7WVRL",
  "Holder": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Asset": {
      "mpt_issuance_id" : "00002403C84A0A28E0190E208E982C352BBD71B2"
  },
  "Asset2" : {
      "mpt_issuance_id" : "00002710D5F38CCE3B43BD597D1B6CCED4AC2D5C"
  },
  "Amount": {
      "mpt_issuance_id" : "00002403C84A0A28E0190E208E982C352BBD71B2",
      "value" : "1000"
  }
}
```
{% /tab %}

{% /tabs %}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field     | JSON Type            | [Internal Type][] | Required | Description |
|:----------|:---------------------|:------------------|:---------|:------------------|
| `Account` | String - [Address][] | AccountID         | Yes      | The issuer of the asset being clawed back. Only the issuer can submit this transaction. |
| `Asset`   | Object               | Issue             | Yes      | Specifies the asset that the issuer wants to claw back from the AMM pool. The asset can be XRP, or a fungible token (see: [Specifying Without Amounts][]). The `issuer` field must match with `Account`. |
| `Asset2`  | Object               | Issue             | Yes      | Specifies the other asset in the AMM's pool. The asset can be XRP or a fungible token (see: [Specifying Without Amounts][]). |
| `Amount`  | [Currency Amount][]  | Amount            | No       | The maximum amount to claw back from the AMM account. The `currency` and `issuer` subfields should match the `Asset` subfields. If this field isn't specified, or the `value` subfield exceeds the holder's available tokens in the AMM, all of the holder's tokens are clawed back. |
| `Holder`  | String - [Address][] | AccountID         | Yes      | The account holding the asset to be clawed back. |


## AMMClawback Flags

| Flag Name         | Hex Value    | Decimal Value | Description |
|-------------------|--------------|---------------|-------------|
| `tfClawTwoAssets` | `0x00000001` | 1             | Claw back the specified amount of `Asset`, and a corresponding amount of `Asset2` based on the AMM pool's asset proportion; both assets must be issued by the issuer in the `Account` field. If this flag isn't enabled, the issuer claws back the specified amount of `Asset`, while a corresponding proportion of `Asset2` goes back to the `Holder`. |


## Error Cases

Besides errors that can occur for all transactions, `AMMClawback` transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code         | Description |
|:-------------------|:------------|
| `tecAMM_BALANCE`   | The `Holder` doesn't hold any LP tokens from the AMM pool. |
| `tecNO_PERMISSION` | One of the following might have occurred:<ul><li>For Trust Line Tokens: the issuer account doesn't have the **Allow Trust Line Clawback** flag enabled.</li><li>For MPTs: the MPT issuance doesn't have the **Can Clawback** flag enabled, or the issuer in the MPT issuance doesn't match the `Account` field.</li><li>The `tfClawTwoAssets` flag is enabled but you didn't issue both assets in the AMM.</li></ul> |
| `temDISABLED`      | At least one of the assets or the amount is an MPT, but the [MPTokensV2 amendment][] is not enabled. (Also occurs if the [AMMClawback amendment][] is not enabled.) |
| `temBAD_AMOUNT`    | The `Amount` field is less than or equal to 0, or the asset in `Amount` doesn't match `Asset`. |
| `temINVALID_FLAG`  | You tried enabling flags besides `tfClawTwoAssets`, or `tfClawTwoAssets` is enabled but the two assets don't have the same issuer. |
| `temMALFORMED`     | The issuer in `Asset` doesn't match `Account`, `Account` is the same as `Holder`, or `Asset` is XRP. |
| `terNO_AMM`        | The AMM pool specified by `Asset` and `Asset2` doesn't exist. |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
