---
seo:
    description: 許可型ドメインのレジャーエントリを削除する
labels:
  - コンプライアンス
  - 許可型ドメイン
---
# PermissionedDomainDelete
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PermissionedDomainDelete.cpp "ソース")

所有する[許可型ドメイン][]を削除します。

_([PermissionedDomains amendment][]が必要です {% not-enabled /%})_

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "TransactionType": "PermissionedDomainDelete",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Fee": "10",
  "Sequence": 392,
  "DomainID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

<!-- TODO: {% tx-example txid="TODO" /%} -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド | JSONの型              | [内部の型][] | 必須? | 説明 |
|:-----------|:----------------------|:-------------|:------|:-----|
| `DomainID` | 文字列 - [ハッシュ][] | Hash256      | はい  | 削除する許可型ドメインのレジャーエントリID。 |

## {% $frontmatter.seo.title %}のフラグ

{% $frontmatter.seo.title %}トランザクションには、フラグは定義されていません。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード  | 説明                                  |
|:--------------|:--------------------------------------|
| `tecNO_ENTRY` | `DomainID`フィールドで指定された許可型ドメインがレジャーに存在しません。 |
| `temDISABLED` | `PermissionedDomains` amendmentが有効ではありません。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
