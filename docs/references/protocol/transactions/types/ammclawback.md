---
seo:
    description: Claw back tokens from a holder who has deposited your issued tokens into an Automated Market Maker pool.
labels:
    - AMM
    - DEX
requiredAmendment: AMMClawback
txIcon: cancel
---
# AMMClawback

{% source-link path="src/libxrpl/tx/transactors/dex/AMMClawback.cpp" /%}

Claw back tokens from a holder who has deposited your issued tokens into an AMM pool.

Clawback is disabled by default:

- **For trust line tokens:** You must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists. After you enable clawback, it cannot be reverted: the account permanently gains the ability to claw back issued assets on trust lines.

- **For MPTs:** The MPT issuance must have the **Can Clawback** flag enabled.

{% amendment-disclaimer name="AMMClawback" /%}

{% amendment-disclaimer name="MPTokensV2" mode="updated" /%}

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
| `Asset`   | Object               | Issue             | Yes      | The asset to claw back, which can be a trust line token or MPT (see: [Specifying Without Amounts][]). XRP cannot be clawed back. The issuer must be the sender of this transaction. |
| `Asset2`  | Object               | Issue             | Yes      | The other asset of the AMM pool to claw back from. The asset can be XRP, a trust line token, or an MPT (see: [Specifying Without Amounts][]). |
| `Amount`  | [Currency Amount][]  | Amount            | No       | The maximum amount to claw back from the AMM account. The asset specified in this field must match `Asset`. If this field isn't specified, or the `value` subfield meets or exceeds the holder's available tokens in the AMM, all of the holder's tokens are clawed back. {% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%} |
| `Holder`  | String - [Address][] | AccountID         | Yes      | The account holding the asset to be clawed back. |

{% admonition type="info" name="Note" %}
A clawback bypasses the holder's reserve requirement, so a holder can't avoid clawback by staying below their reserve or removing the trust line or MPToken that would otherwise need to be re-created to receive the returned assets. {% amendment-disclaimer name="fixCleanup3_4_0" /%}
{% /admonition %}

## AMMClawback Flags

| Flag Name         | Hex Value    | Decimal Value | Description |
|-------------------|--------------|---------------|-------------|
| `tfClawTwoAssets` | `0x00000001` | 1             | Claw back the specified amount of `Asset`, and a corresponding amount of `Asset2` based on the AMM pool's asset proportion; both assets must be issued by the issuer in the `Account` field. If this flag isn't enabled, the issuer claws back the specified amount of `Asset`, while a corresponding proportion of `Asset2` goes back to the `Holder`. |


## Error Cases

Besides errors that can occur for all transactions, `AMMClawback` transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description |
|:--------------------|:------------|
| `tecAMM_BALANCE`    | The `Holder` doesn't hold any LP tokens from the AMM pool. |
| `tecAMM_FAILED`     | Rounding results in zero extracted tokens on either side of the pair. {% amendment-disclaimer name="fixCleanup3_4_0" /%} |
| `tecNO_PERMISSION`  | The sender does not have permission to claw back the requested asset or assets. This includes the following cases:<ul><li>For trust line tokens: the issuer account doesn't have the **Allow Trust Line Clawback** flag enabled.</li><li>For MPTs: the MPT issuance doesn't have the **Can Clawback** flag enabled.</li><li>The sender of the transaction is not the issuer of the token to be clawed back.</li><li>The `tfClawTwoAssets` flag is enabled, but `Asset2` also doesn't permit clawback.</li></ul> |
| `tecPRECISION_LOSS` | The clawback would leave more LP Tokens outstanding than the pool's assets support. {% amendment-disclaimer name="fixAMMv1_3" /%} {% amendment-disclaimer name="fixCleanup3_3_0" /%} |
| `temDISABLED`       | The [AMMClawback amendment][] is not enabled, or at least one of the assets or the amount is an MPT and the [MPTokensV2 amendment][] is not enabled. |
| `temBAD_AMOUNT`     | The `Amount` field is less than or equal to 0, or the asset in `Amount` doesn't match `Asset`. |
| `temINVALID_FLAG`   | You tried enabling flags besides `tfClawTwoAssets`, or `tfClawTwoAssets` is enabled but the two assets don't have the same issuer. |
| `temMALFORMED`      | The issuer in `Asset` doesn't match `Account`, `Account` is the same as `Holder`, or `Asset` is XRP. |
| `terNO_AMM`         | The AMM pool specified by `Asset` and `Asset2` doesn't exist. |

## See Also

- [AMM entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
