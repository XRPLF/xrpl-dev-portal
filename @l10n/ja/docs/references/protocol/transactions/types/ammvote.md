---
html: ammvote.html
parent: transaction-types.html
seo:
    description: 自動マーケットメーカーインスタンスの取引手数料へ投票する。
labels:
    - AMM
    - DEX
requiredAmendment: AMM
txIcon: modify
---
# AMMVote
{% source-link path="src/libxrpl/tx/transactors/dex/AMMVote.cpp" /%}

[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)インスタンスの取引手数料を投票します。最大8つのアカウントが、保有するAMMのLPトークンの量に比例して投票することができます。投票を行うごとには、投票の加重平均に基づいてAMMの取引手数料が再計算されます。

{% amendment-disclaimer name="AMM" /%}

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

{% tx-example txid="BE72A46233F91C71030DC88D8D86077D37FD98223E9114A46180C09FC5C11E5B" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

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
| `temBAD_FEE`            | このトランザクションの`TradingFee`は正しくありません。 |
| `terNO_AMM`             | このトランザクションの資産ペアの自動マーケットメーカー インスタンスが存在しません。 |

8つの投票スロットがすべて埋まっており、送信者が保有するLPトークンが、既存の投票者の中でLPトークンの保有量が最も少ない投票者よりも少ない場合、トランザクションは[`tesSUCCESS`](../transaction-results/tes-success.md)で成功しますが、送信者の投票は記録されません。送信者が保有するLPトークンがその投票者と同じ量で、投票対象の取引手数料がその投票者の取引手数料以下の場合も同様です。いずれの場合も、既存の投票の重みとAMMの取引手数料は、投票者が現在保有するLPトークンの量に基づいて再計算されます。投票が記録されたかどうかを確認するには、トランザクションが検証された後に[AMMエントリ][]の`VoteSlots`フィールドを確認します。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
