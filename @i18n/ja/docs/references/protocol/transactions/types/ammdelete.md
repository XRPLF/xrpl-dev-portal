---
html: ammdelete.html
parent: transaction-types.html
seo:
    description: 空のプールを持つ自動マーケットメーカーのインスタンスを削除します。
labels:
  - AMM
---
# AMMDelete
[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/AMMDelete.cpp "Source")

_([AMM amendment][])_

自動で削除しきれなかった空の[自動マーケットメーカー](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md)(AMM)インスタンスを削除します。

通常、[AMMWithdraw トランザクション][]は、AMMのプールからすべての資産を引き出すと、AMMと関連するすべてのレジャーエントリを自動的に削除します。ただし、AMMアカウントへのトラストラインが多すぎて1回のトランザクションで削除できない場合は、AMMの削除を行わない場合があります。しかしこの場合でも、AMMDeleteトランザクションは最大512のトラストラインを削除します。すべてのトラストラインとそのAMMを削除するには、数回のAMMDeleteトランザクションが必要な場合があります。いずれの場合も、AMMとAccountRootのレジャーエントリが削除されるのは、最後のトランザクションのみです。


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
    "Flags" : 0,
    "Sequence" : 9,
    "TransactionType" : "AMMDelete"
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド | JSONの型   | [内部の型][] | 必須? | 説明 |
|:---------|:-----------|:-----------|:------|:----|
| `Asset`  | オブジェクト | STIssue    | はい   | AMMのプールにある資産の一つを定義します。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトになります（XRPの場合は`issuer`を省略します）。 |
| `Asset2` | オブジェクト | STIssue    | はい   | AMMのプールにあるもう一つの資産を定義します。JSONでは、`currency`と`issuer`フィールドを持つオブジェクトです(XRPの場合は`issuer`を省略)。 |


## エラーケース

AMMCreateトランザクションでは、すべてのトランザクションで発生する可能性のあるエラーの他に、以下の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード               | 説明                                          |
|:--------------------|:---------------------------------------------|
| `tecAMM_NOT_EMPTY`  | AMMが空でないため、削除することができません。AMMの流動性プロバイダーの一人である場合は、まず[AMMWithdraw][]を使用してください。 |
| `tecINCOMPLETE`     | 関連するレジャーエントリを可能な限り削除しましたが、AMM は完全には削除されませんでした。別の AMMDelete トランザクションを送信して、作業を続行し、完了させることができます。 |
| `terNO_AMM`         | 指定したAMMが存在しません。(すでに削除されているか、指定したAMMの資産が間違っている可能性があります)。|

{% raw-partial file="/docs/_snippets/common-links.md" /%}
