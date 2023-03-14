---
html: ammvote.html
parent: transaction-types.html
blurb: 自動マーケットメーカーインスタンスの取引手数料を投票する。
labels:
  - AMM
status: not_enabled
---
# AMMVote
[[Source]](https://github.com/gregtatcam/rippled/blob/amm-core-functionality/src/ripple/app/tx/impl/AMMVote.cpp "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.ja.md' %}

[自動マーケットメーカー](automated-market-makers.html)インスタンスの取引手数料を投票します。最大8つのアカウントが、保有するAMMのLPトークンの量に比例して投票することができます。各新規投票では、投票の加重平均に基づいてAMMの取引手数料が再計算されます。

## {{currentpage.name}} JSONの例

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Asset" : {
        "currency" : "XRP"
    },
    "Asset2" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "Fee" : "10",
    "Flags" : 2147483648,
    "Sequence" : 8,
    "TradingFee" : 600,
    "TransactionType" : "AMMVote"
}
```

{% include '_snippets/tx-fields-intro.ja.md' %}

| フィールド     | JSONの型 | [内部の型][] | 必須? | 説明 |
|:-------------|:----------|:-----------|:-----|:------------|
| `Asset`      | Object    | STIssue    | はい | AMMのプールにある資産の一つを定義します。JSONでは、`currency` と `issuer` フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。 |
| `Asset2`     | Object    | STIssue    | はい | AMMのプールにあるもう一つの資産を定義します。JSONでは、`currency` と `issuer` フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。|
| `TradingFee` | Number    | UInt16     | はい | 投票に必要な手数料を100000の1の単位で指定します。最大値は1000で、1％の手数料を表します。 |

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{{currentpage.name}}トランザクションでは、次の[トランザクション結果コード](transaction-results.html)が発生する可能性があります。

| エラーコード              | 説明                                          |
|:------------------------|:---------------------------------------------|
| `tecAMM_INVALID_TOKENS` | 送信者は、このAMMのLPトークンを保有していないため、投票することができません。 |
| `tecAMM_FAILED_VOTE`    | このトランザクションの送信者よりも多くのLPトークンを保有しているアカウントからの投票が既に8件存在しています。 |
| `terNO_ACCOUNT`         | このトランザクションで指定されたアカウントが存在しません。 |
| `temBAD_FEE`            | このトランザクションの`TradingFee`は正しくありません。 |
| `terNO_AMM`             | このトランザクションの資産ペアの自動マーケットメーカー インスタンスが存在しません。 |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
