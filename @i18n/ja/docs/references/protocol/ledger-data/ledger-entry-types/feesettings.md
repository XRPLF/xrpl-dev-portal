---
html: feesettings.html
parent: ledger-entry-types.html
seo:
    description: コンセンサスで承認された基本トランザクションコストと必要準備金があるシングルトンオブジェクトです。
labels:
  - 手数料
---
# FeeSettings
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L115-L120 "Source")

`FeeSettings`オブジェク
トタイプには、現在の基本[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)と、[手数料投票](../../../../concepts/consensus-protocol/fee-voting.md)により決定する[準備金の額](../../../../concepts/accounts/reserves.md)が含まれています。各レジャーバージョンには**最大で1つの** `FeeSettings`オブジェクトが含まれています。

## {% $frontmatter.seo.title %} JSONの例

`FeeSettings`オブジェクトの例。

```json
{
  "BaseFee": "000000000000000A",
  "Flags": 0,
  "LedgerEntryType": "FeeSettings",
  "ReferenceFeeUnits": 10,
  "ReserveBase": 20000000,
  "ReserveIncrement": 5000000,
  "index": "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651"
}
```

## {% $frontmatter.seo.title %}フィールド

`FeeSettings`オブジェクトのフィールドは次のとおりです。

| 名前                | JSONの型 | [内部の型][] | 説明            |
|:--------------------|:----------|:------------------|:-----------------------|
| `LedgerEntryType`   | 文字列    | UInt16            | 値`0x0073`が文字列`FeeSettings`にマッピングされている場合は、このオブジェクトにレジャーの手数料設定が含まれていることを示します。 |
| `BaseFee`           | 文字列    | UInt64            | 「リファレンストランザクション」の[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)（XRPのdrop数、16進数） |
| `ReferenceFeeUnits` | 数値    | UInt32            | 「手数料単位」に変換された`BaseFee` |
| `ReserveBase`       | 数値    | UInt32            | XRP Ledgerのアカウントの[基本準備金](../../../../concepts/accounts/reserves.md#基本準備金と所有者準備金)（XRPのdrop数）。 |
| `ReserveIncrement`  | 数値    | UInt32            | 所有するオブジェクトごとに増加する[所有者準備金](../../../../concepts/accounts/reserves.md#基本準備金と所有者準備金)（XRPのdrop数）。 |
| `Flags`             | 数値    | UInt32            | このオブジェクトのブールフラグのビットマップ。このタイプではフラグは定義されていません。 |

**警告:** このレジャーオブジェクトのJSONフォーマットは一般的ではありません。`BaseFee`、`ReserveBase`、および`ReserveIncrement`はXRPのdrop数を示しますが、通常の[XRP指定][通貨額]フォーマットでは***ありません*** 。

## FeeSettings IDのフォーマット

`FeeSettings`オブジェクトIDは、`FeeSettings`スペースキー（`0x0065`）のハッシュのみです。つまり、レジャーの`FeeSettings`オブジェクトのIDは常に次の値になります。

```
4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
