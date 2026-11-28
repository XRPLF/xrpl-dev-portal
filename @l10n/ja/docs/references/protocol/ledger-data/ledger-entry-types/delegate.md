---
seo:
    description: 別のアカウントにどの権限が付与されているかの記録です。
labels:
  - アカウント
  - 権限
---
# Delegate
[[ソース]](https://github.com/XRPLF/rippled/blob/a5d238e7d4fa6ef2b539b759d58744d0a1c33c0c/include/xrpl/protocol/detail/ledger_entries.macro#L465-L473 "Source")

`Delegate`レジャーエントリは、あるアカウントが別のアカウントに委任した権限のセットを保存します。`Delegate`エントリは[DelegateSetトランザクション][]を送信して作成します。

{% amendment-disclaimer name="PermissionDelegationV1_1" /%}

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Account": "rG8uoRH9uA6AJ6NRj8P4cJG1HNfYcnMPrt",
  "Authorize": "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT",
  "Flags": 0,
  "LedgerEntryType": "Delegate",
  "OwnerNode": "0",
  "Permissions": [
    {
      "Permission": {
        "PermissionValue": "AccountDomainSet"
      }
    }
  ],
  "PreviousTxnID": "08DB1BD6ECFC9E8CBD8D954F4EFF6EFD155A392C5060D767B5621CE18951983A",
  "PreviousTxnLgrSeq": 4748731,
  "index": "749D3DCDF9F032DDDB8AC49641BACBFDD398C4B6C231C4AB325B7755962329A2"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド](../common-fields.md)に加えて、{% code-page-name /%}エントリには次のフィールドがあります。

| フィールド          | JSONの型              | [内部の型][] | 必須？ | 説明 |
|:--------------------|:----------------------|:-------------|:-------|:-----|
| `Account`           | 文字列 - [アドレス][] | AccountID    | はい   | 別のアカウントに権限を委任するアカウント。_委任者_ とも呼ばれます。 |
| `Authorize`         | 文字列 - [アドレス][] | AccountID    | はい   | 権限を付与されるアカウント。_被委任者_ とも呼ばれます。 |
| `Permissions`       | 配列                  | Array        | はい   | 付与されている権限のリスト。要素は1個以上10個以下です。リストの各要素は[Permissionオブジェクト](#permissionオブジェクト)です。 |
| `OwnerNode`         | 文字列 - 16進数       | UInt64       | はい   | 委任者の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `DestinationNode`   | 文字列 - 16進数       | UInt64       | いいえ | 被委任者の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `PreviousTxnID`     | 文字列 - 16進数       | UInt256      | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値                  | UInt32       | はい   | 最後にこのオブジェクトを変更したトランザクションが含まれる[レジャーのインデックス][レジャーインデックス]。 |

### Permissionオブジェクト

`Permissions`配列の各要素は、次の入れ子のフィールドを持つ内部オブジェクトです。

| フィールド        | JSONの型         | [内部の型][] | 必須？ | 説明 |
|:------------------|:-----------------|:-------------|:-------|:-----|
| `PermissionValue` | 文字列または数値 | UInt32       | はい   | 被委任者に付与されている権限。トランザクションタイプまたは詳細権限のいずれかです。すべての値の一覧については、[権限の値](../../data-types/permission-values.md)を参照してください。 |

## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。

## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、委任する権限の数にかかわらず、そのエントリがレジャー上にある限り、委任者の所有者準備金の1アイテムとしてカウントされます。すべての権限を取り消すとエントリが削除され、準備金が解放されます。

{% code-page-name /%}エントリは削除ブロッカーではありません。所有者（委任者）のアカウントが削除されると、そのようなレジャーエントリもすべて一緒に削除されます。`Authorize`（被委任者）のアカウントを削除した場合もエントリは削除され、委任者の準備金が解放されます。

## 関連項目

- **トランザクション:**
  - [DelegateSetトランザクション][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
