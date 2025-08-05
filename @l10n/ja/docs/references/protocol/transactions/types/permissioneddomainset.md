---
seo:
    description: 許可型ドメインを作成または更新する
labels:
  - コンプライアンス
  - 許可型ドメイン
---
# PermissionedDomainSet
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PermissionedDomainSet.cpp "ソース")

[許可型ドメイン][]を作成するか、所有するドメインを変更します。

_([PermissionedDomains amendment][]が必要です {% not-enabled /%})_

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "TransactionType": "PermissionedDomainSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "10",
  "Sequence": 390,
  "AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    }
  ]
}
```

<!-- TODO: {% tx-example txid="TODO" /%} -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド            | JSONの型              | [内部の型][] | 必須?  | 説明 |
|:----------------------|:----------------------|:-------------|:-------|:------------|
| `DomainID`            | 文字列 - [ハッシュ][] | Hash256      | いいえ | 変更する既存の許可型ドメインのレジャーエントリID。省略すると、新しい許可型ドメインが作成されます。 |
| `AcceptedCredentials` | 配列                  | Array        | はい   | このドメインへのアクセスを許可する1から10個の[**Accepted Credentialsオブジェクト**](#accepted-credentials-objects)のリスト。リストはソートする必要はありませんが、重複ことはできません。既存のドメインを変更する場合、このリストは既存のリストを置き換えます。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/accepted-credentials-objects.md" /%}

## {% $frontmatter.seo.title %}のフラグ

{% $frontmatter.seo.title %}トランザクションには、フラグは定義されていません。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード              | 説明 |
|:--------------------------|:-----|
| `tecDIR_FULL`             | このトランザクションは、新しい許可型ドメインを作成しますが、送信者の所有者ディレクトリがいっぱいです。 |
| `tecINSUFFICIENT_RESERVE` | このトランザクションは、新しい許可型ドメインを作成しますが、送信者が増加分の所有者準備金を満たす十分なXRPを持っていません。 |
| `tecNO_ENTRY`             | このトランザクションは、存在しないドメインを変更しようとしました。トランザクションの`DomainID`フィールドを確認してください。 |
| `tecNO_ISSUER`            | `AcceptedCredentials`フィールドで指定された発行者の少なくとも1つがXRP Ledgerに存在しません。配列の各メンバーの`Issuer`フィールドを確認してください。 |
| `tecNO_PERMISSION`        | このトランザクションは、既存のドメインを変更しようとしましたが、トランザクションの送信者は指定されたドメインの所有者ではありません。 |
| `temDISABLED`             | `PermissionedDomains` amendmentが有効ではないか、または`Credentials` amendmentが有効ではありません。 |


{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
