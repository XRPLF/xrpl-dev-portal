---
seo:
    description: 現在オフラインと思われるバリデータの一覧を表します。
labels:
    - ブロックチェーン
---
# NegativeUNL

`NegativeUNL`オブジェクトタイプは、[ネガティブUNL](../../../../concepts/consensus-protocol/negative-unl.md)の現在の状態、つまり現在オフラインであると考えられる信頼できるバリデーションのリストを含んでいます。

各台帳のバージョンには、**最大1つの**`NegativeUNL`オブジェクトが含まれます。無効になっているか、無効になる予定のバリデータがない場合、台帳には`NegativeUNL`オブジェクトは存在しません。

{% amendment-disclaimer name="NegativeUNL" /%}

## {% $frontmatter.seo.title %} JSONの例

```json
{
  "DisabledValidators": [
    {
      "DisabledValidator": {
        "FirstLedgerSequence": 91371264,
        "PublicKey": "ED58F6770DB5DD77E59D28CB650EC3816E2FC95021BB56E720C9A12DA79C58A3AB"
      }
    }
  ],
  "Flags": 0,
  "LedgerEntryType": "NegativeUNL",
  "PreviousTxnID": "8D47FFE664BE6C335108DF689537625855A6A95160CC6D351341B92624D9C5E3",
  "PreviousTxnLgrSeq": 91442944,
  "index": "2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244"
}
```


`NegativeUNL`オブジェクトは、以下のフィールドを持ちます。

| 名前                  | JSONの型 | [内部の型][] | 必須?  | 説明                 |
|:----------------------|:---------|:-------------|:-------|:---------------------|
| `DisabledValidators`  | 配列     | Array        | いいえ | `DisabledValidator`オブジェクト(下記参照)は、現在無効になっている信頼できるバリデータを表すリストです。 |
| `Flags`               | 数値     | UInt32       | はい   | 真偽値フラグのビットマップ。NegativeUNLオブジェクトタイプにはフラグが定義されていないため、この値は常に`0`となります。 |
| `LedgerEntryType`     | 文字列   | UInt16       | はい   | `0x004E`は文字列`NegativeUNL`に対応し、このオブジェクトがNegativeUNLであることを意味します。 |
| `PreviousTxnID`       | 文字列   | UInt256      | いいえ | このエントリを最後に変更したトランザクションの識別ハッシュ。{% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq`   | 数値     | UInt32       | いいえ | このエントリを最後に変更したトランザクションが含まれる[レジャーインデックス](../ledger-header.md)。{% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `ValidatorToDisable`  | 文字列   | Blob         | いいえ | 次回のフラグレジャーで無効化される予定の信頼できるバリデータの公開鍵を表します。 |
| `ValidatorToReEnable` | 文字列   | Blob         | いいえ | 次回のフラグレジャーで再有効化される予定のネガティブUNLの信頼できるバリデータの公開鍵を表します。 |

## DisabledValidatorオブジェクト

各`DisabledValidator`オブジェクトは無効化されたバリデータ一つ分を表します。JSONでは、`DisabledValidator`オブジェクトは`DisabledValidator`という1つのフィールドを持ち、そのオブジェクトは以下のフィールドを持つ別のオブジェクトを含んでいます。

| 名前                   | JSONの型 | [内部の型][]| 説明                  |
|:----------------------|:---------|:----------|:----------------------|
| `FirstLedgerSequence` | 数値      | UInt32    | バリデータがネガティブUNLに追加されたときの[レジャーインデックス][]を表します。 |
| `PublicKey`           | 文字列    | Blob       | バリデータのマスター公開鍵を16進数で表します。 |



## NegativeUNL IDのフォーマット

`NegativeUNL`オブジェクトのIDは、`NegativeUNL`のスペースキー(`0x004E`)のみのハッシュです。つまり、台帳上の`NegativeUNL`オブジェクトのIDは常に次のようになります。

```
2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244
```

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
