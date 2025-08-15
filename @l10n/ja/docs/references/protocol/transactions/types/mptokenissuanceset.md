---
seo:
    description: MPTの変更可能なプロパティを設定します。
labels:
 - Multi-Purpose Token, MPT
---
# MPTokenIssuanceSet
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceSet.cpp "ソース")

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

このトランザクションを使用して、Multi-Purpose Tokenの変更可能なプロパティを更新します。

## MPTokenIssuanceSetの例

```json 
{
      "TransactionType": "MPTokenIssuanceSet",
      "Fee": "10",
      "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
      "Flags": 1
}
```

<!-- ## MPTokenIssuanceSetのフィールド -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド         | JSON型             | [内部の型][] | 説明                |
|:-------------------|:-------------------|:-------------|:-------------------|
| `TransactionType`  | 文字列             | UInt16       | 新しいトランザクションタイプ`MPTokenIssuanceSet`を示します。 |
| `MPTokenIssuanceID`| 文字列             | UInt192      | `MPTokenIssuance`の識別子。 |
| `Holder`           | 文字列             | AccountID    | (任意) ロック/アンロックする個別のトークン保有者残高のXRPLアドレス。省略した場合、このトランザクションはMPTを保有する全てのアカウントに適用されます。 |
| `Flag`             | 数値               | UInt64       | このトランザクションのフラグを指定します。[MPTokenIssuanceSetのフラグ](#mptokenissuancesetのフラグ)をご覧ください。 |

### MPTokenIssuanceSetのフラグ

`MPTokenIssuanceSet`トランザクションでは、`Flags`フィールドで以下の追加の値がサポートされています。

| フラグ名           | 16進値       | 10進値        | 説明                          |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTLock`        | `0x00000001` | 1             | 設定された場合、このアセットの全てのMPT残高をロックすることを示します。 |
| `tfMPTUnlock`      | `0x00000002` | 2             | 設定された場合、このアセットの全てのMPT残高をアンロックすることを示します。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
