---
html: didset.html
parent: transaction-types.html
seo:
    description: DIDを作成または更新します。
labels:
  - DID
status: not_enabled
---
# DIDSet

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DID.cpp "ソース")

_([DID Amendment][] {% not-enabled /%} が必要です。)_

新しい[DIDレジャーエントリ](../../ledger-data/ledger-entry-types/did.md)を作成したり、既存の項目を更新したりします。


## {% $frontmatter.seo.title %} JSONの例

```json
{
  "TransactionType": "DIDSet",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Fee": "10",
  "Sequence": 391,
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Data": "",
  "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド      | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------|:---------|:-----------|:------|:----|
| `Data`        | 文字列    | Blob       | いいえ | DIDに関連付けられたID情報の公開証明。 |
| `DIDDocument` | 文字列    | Blob       | いいえ | DIDに関連付けられたDIDドキュメント。 |
| `URI`         | 文字列    | Blob       | いいえ | DIDに関連付けられたデータを指すユニバーサルリソース識別子 |

`DIDSet`トランザクションを送信するときには`Data`、`DIDDocument`、`URI`のいずれかを含める必要があります。この3つのフィールドが欠けていると、トランザクションは失敗します。

**注記:** 既存のDIDレジャーエントリから`Data`、`DIDDocument`、`URI`フィールドを削除するには、そのフィールドを空文字列として設定します。


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード          | 説明                                         |
|:--------------------|:---------------------------------------------|
| `tecEMPTY_DID`      | トランザクションによって空のDIDレジャーエントリを作成しています。更新によって`Data`、`DIDDocument`、`URI`フィールドが削除されていないか確認してください。 |
| `temEMPTY_DID`      | トランザクションが不正で、DID情報がありません。`Data`、`DIDDocument`、`URI`フィールドのいずれかを含めてください。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
