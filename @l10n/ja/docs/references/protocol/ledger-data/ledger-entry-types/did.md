---
html: did.html
parent: ledger-entry-types.html
seo:
    description: 分散型ID(DID)の定義と詳細
labels:
  - DID
status: not_enabled
---
# DID
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L330-L341 "ソース)

_([DID Amendment][] {% not-enabled /%} が必要です。)_

`DID`のレジャーエントリは、単一の[DID](../../../../concepts/accounts/decentralized-identifiers.md)への参照、またはそれに関連するデータを保持します。


## DID JSONの例

```json
{
    "Account": "rpfqJrXg5uidNo2ZsRhRY6TiF1cvYmV9Fg",
    "DIDDocument": "646F63",
    "Data": "617474657374",
    "Flags": 0,
    "LedgerEntryType": "DID",
    "OwnerNode": "0",
    "PreviousTxnID": "A4C15DA185E6092DF5954FF62A1446220C61A5F60F0D93B4B09F708778E41120",
    "PreviousTxnLgrSeq": 4,
    "URI": "6469645F6578616D706C65",
    "index": "46813BE38B798B3752CA590D44E7FEADB17485649074403AD1761A2835CE91FF"
}
```

## DIDのフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド            | JSONの型  | [内部の型][] | 必須? | 説明  |
|:--------------------|:----------|:-----------|:------|--------------|
| `Account`           | 文字列     | AccountID  | はい   | DIDを管理するアカウント。 |
| `DIDDocument`       | 文字列     | Blob       | いいえ | DIDに関連付けられたW3C規格のDIDドキュメント。`DIDDocument`フィールドの有効性はチェックされず、最大長は256バイトに制限されます。 |
| `Data`              | 文字列     | Blob       | いいえ | DIDに関連付けられたID情報の公開証明。`Data`フィールドの有効性はチェックされず、最大長は 256 バイトに制限されます。 |
| `LedgerEntryType`   | 文字列     | UInt16     | はい   | 文字列`DID`にマップされる値`0x0049`は、このオブジェクトがDIDオブジェクトであることを示します。 |
| `OwnerNode`         | 文字列     | UInt64     | はい   | ディレクトリが複数のページで構成されている場合に、送信者のオーナーディレクトリのどのページがこのエントリにリンクしているかを示すヒント。 |
| `PreviousTxnID`     | 文字列     | Hash256    | はい   | このオブジェクトを最近変更したトランザクションの識別ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値       | UInt32     | はい   | このオブジェクトを最後に変更したトランザクションを含むレジャーインデックス。 |
| `URI`               | 文字列     | Blob       | いいえ  | 対応するDIDドキュメントまたはDIDに関連付けられたデータを指すユニバーサルリソース識別子。このフィールドにはHTTP(S)URLまたはIPFS URIを指定できます。このフィールドの有効性はチェックされず、最大長は256バイトに制限されます。 |


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}オブジェクトを作成したアカウントには、1つの所有者準備金が発生します。


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリにはフラグが定義されていません。


## DID IDのフォーマット

`DID`エントリのIDは以下の値の[SHA-512Half][]を順番に連結したものです：

1. `DID`のスペースキー(`0x0049`).
2. DIDを管理するAccountID。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
