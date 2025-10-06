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

Clawback is disabled by default. To use clawback, you must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists. After you enable clawback, it cannot reverted: the account permanently gains the ability to claw back issued assets on trust lines.

{% amendment-disclaimer name="AMMClawback" /%}


## Example {% $frontmatter.seo.title %} JSON

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


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field     | JSON Type            | [Internal Type][] | Required | Description |
|:----------|:---------------------|:------------------|:---------|:------------------|
| `Account` | String - [Address][] | AccountID         | Yes      | The issuer of the asset being clawed back. Only the issuer can submit this transaction. |
| `Asset`   | Object               | Issue             | Yes      | Specifies the asset that the issuer wants to claw back from the AMM pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). The `issuer` field must match with `Account`. |
| `Asset2`  | Object               | Issue             | Yes      | Specifies the other asset in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
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
| `tecNO_PERMISSION` | Occurs if you attempt to claw back tokens from an AMM without the `lsfAllowTrustlineClawback` flag enabled, or the `tfClawTwoAssets` flag is enabled when you didn't issue both assets in the AMM. Also occurs if the `Asset` issuer doesn't match `Account`. |
| `tecAMM_BALANCE`   | Occurs if the `Holder` doesn't hold any LP tokens from the AMM pool. |
| `temDISABLED`      | Occurs if the [AMMClawback amendment][] is not enabled. |
| `temBAD_AMOUNT`    | Occurs if the `Amount` field in the `AMMClawback` transaction is less than or equal to 0, or the `currency` and `issuer` subfields don't match between `Amount` and `Asset`. |
| `temINVALID_FLAG`  | Occurs if you try enabling flags besides `tfClawTwoAssets`. |
| `temMALFORMED`     | Occurs if the `issuer` subfield doesn't match between `Asset` and `Account`, `Account` is the same as the `Holder`, or `Asset` is XRP. |
| `terNO_AMM`        | Occurs if the AMM pool specified by `Asset` and `Asset2` doesn't exist. |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
