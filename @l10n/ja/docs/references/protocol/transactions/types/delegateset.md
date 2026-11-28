---
seo:
    description: 自分の代わりに一部のトランザクションを送信する権限を別のアカウントに付与するか、その権限を取り消します。
labels:
  - Accounts
  - Permissions
  - Delegate
requiredAmendment: PermissionDelegationV1_1
txIcon: modify
---
# DelegateSet
{% source-link path="src/libxrpl/tx/transactors/delegate/DelegateSet.cpp" /%}

自分の代わりにトランザクションを送信できるよう、別のアカウントに[権限を委任](../../../../concepts/accounts/permission-delegation.md)します。このトランザクションタイプでは権限の付与、変更、取り消しができ、それに応じて[Delegateエントリ][]を作成、変更、削除します。

{% amendment-disclaimer name="PermissionDelegationV1_1" /%}

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "TransactionType": "DelegateSet",
    "Account": "rw81qtsfF9rws4RbmYepf5394gp81TQv5Y",
    "Authorize": "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT",
    "Fee": "1",
    "Flags": 0,
    "LastLedgerSequence": 4747822,
    "Permissions": [
        {
            "Permission": {
                "PermissionValue": "AccountDomainSet"
            }
        }
    ],
    "Sequence": 4747802
}
```

{% tx-example txid="13E1C2CE2BCECB6223AEA39407169C5429FE9A126825CDD6952E3FF4C728F603" server="devnet" /%}

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド    | 必須？ | JSONの型              | 内部の型  | 説明 |
|:--------------|--------|-----------------------|-----------|------|
| `Authorize`   | はい   | 文字列 - [アドレス][] | AccountID | 権限を付与されるアカウント。_被委任者_ とも呼ばれます。 |
| `Permissions` | はい   | 配列                  | Array     | 被委任者に付与する権限を1つずつ指定する[Permissionオブジェクト](#permissionオブジェクト)のリスト（最大10個）。被委任者の権限は、このリストのとおりに更新されます。すべての権限を取り消すには空の配列を指定します。空の配列は、被委任者の[Delegateエントリ][]がすでに存在する場合にのみ有効です。 |

付与した権限を記録する[Delegateエントリ][]が存在しない場合、このトランザクションはDelegateエントリを作成します。すでに存在する場合は、権限のセットをトランザクションのリストのとおりに更新し、リストにない権限は取り消します。すべての権限が取り消された場合、トランザクションはDelegateエントリを削除します。空の`Permissions`リストは既存のDelegateエントリを削除する場合にのみ有効で、エントリが存在しない場合、トランザクションは`tecNO_ENTRY`で失敗します。

{% admonition type="success" name="ヒント" %}
10個を超える権限を委任したい場合は、代わりに[マルチシグ](../../../../concepts/accounts/multi-signing.md)の使用を検討してください。
{% /admonition %}

### Permissionオブジェクト

`Permissions`配列の各要素は、次の入れ子のフィールドを持つ内部オブジェクトです。

| フィールド        | JSONの型         | [内部の型][] | 必須？ | 説明 |
|:------------------|:-----------------|:-------------|:-------|:-----|
| `PermissionValue` | 文字列または数値 | UInt32       | はい   | 被委任者に付与する権限。トランザクションタイプまたは詳細権限のいずれかを指定します。すべての値の一覧については、[権限の値](../../data-types/permission-values.md)を参照してください。 |


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード              | 説明 |
|:--------------------------|:-----|
| `tecNO_ENTRY`             | `Permissions`リストが空ですが、被委任者の[Delegateエントリ][]が存在しません。空のリストは既存のエントリを削除する場合にのみ有効です。 |
| `tecNO_TARGET`            | `Authorize`フィールドに指定したアカウントがレジャーに存在しません。 |
| `tecPSEUDO_ACCOUNT`       | `Authorize`のアカウントが[疑似アカウント](../../../../concepts/accounts/pseudo-accounts.md)です。 |
| `temARRAY_TOO_LARGE`      | `Permissions`リストが大きすぎます。指定できるエントリは10個までです。 |
| `temMALFORMED`            | トランザクションが無効です。たとえば次のような場合です。<ul><li>`Authorize`のアカウントがトランザクションの送信者と同じである</li><li>`Permissions`リストに重複したエントリが含まれている</li><li>委任できない権限が含まれている。[委任できない権限の一覧](../../data-types/permission-values.md#委任できない権限の一覧)を参照してください。</li></ul> |
| `temBAD_SIGNER`           | `Delegate`が`Account`と同じです。 |

## 関連項目

- [Delegateエントリ][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
