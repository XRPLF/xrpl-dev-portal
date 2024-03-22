---
html: ammvote.html
parent: transaction-types.html
seo:
    description: 自動マーケットメーカーインスタンスの取引手数料へ投票する。
labels:
  - AMM
---
# AMMVote
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/AMMVote.cpp "Source")

_([AMM amendment][])_

[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)インスタンスの取引手数料を投票します。最大8つのアカウントが、保有するAMMのLPトークンの量に比例して投票することができます。投票を行うごとには、投票の加重平均に基づいてAMMの取引手数料が再計算されます。

## {% $frontmatter.seo.title %} JSONの例

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

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド     | JSONの型   | [内部の型][] | 必須? | 説明 |
|:-------------|:-----------|:-----------|:-----|:------------|
| `Asset`      | オブジェクト | STIssue    | はい | AMMのプールにある資産の一つを定義します。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。 |
| `Asset2`     | オブジェクト | STIssue    | はい | AMMのプールにあるもう一つの資産を定義します。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。|
| `TradingFee` | 数値       | UInt16     | はい | 投票に必要な手数料を1/100,000の単位で指定します。値1は0.001%を表します。最大値は1000で、1％の手数料を表します。 |

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード              | 説明                                          |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | AMMのプールに資産がありません。この状態では、AMMを削除するか、新しい入金を行い資金を供給することしかできません。 |
| `tecAMM_INVALID_TOKENS` | 送信者は、このAMMのLPトークンを保有していないため、投票することができません。 |
| `tecAMM_FAILED_VOTE`    | このトランザクションの送信者よりも多くのLPトークンを保有しているアカウントからの投票が既に8件存在しています。 |
| `temBAD_FEE`            | このトランザクションの`TradingFee`は正しくありません。 |
| `terNO_AMM`             | このトランザクションの資産ペアの自動マーケットメーカー インスタンスが存在しません。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
