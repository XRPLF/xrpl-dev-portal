---
html: setfee.html
parent: pseudo-transaction-types.html
seo:
    description: 手数料投票の結果としてトランザクションコストまたはアカウント準備金の要件が変更されます。
labels:
  - 手数料
---
# SetFee

[手数料投票](../../../../concepts/consensus-protocol/fee-voting.md)の結果として[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)または[アカウント準備金](../../../../concepts/accounts/reserves.md)の要件が変更されます。

**注記:** 疑似トランザクションは送信できませんが、レジャーの処理時に疑似トランザクションが見つかることがあります。

```json
{
    "Account": "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
    "BaseFee": "000000000000000A",
    "Fee": "0",
    "ReferenceFeeUnits": 10,
    "ReserveBase": 20000000,
    "ReserveIncrement": 5000000,
    "Sequence": 0,
    "SigningPubKey": "",
    "TransactionType": "SetFee",
    "date": 439578860,
    "hash": "1C15FEA3E1D50F96B6598607FC773FF1F6E0125F30160144BE0C5CBC52F5151B",
    "ledger_index": 3721729,
  }
```

| フィールド        | JSONの型          | [内部の型][]      | 説明               |
|:------------------|:-----------------|:------------------|:------------------|
| BaseFee | 文字列 | UInt64 | リファレンストランザクションの手数料（XRPのdrop数、16進数）。（これは、負荷スケーリング前の[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)です。） |
| ReferenceFeeUnits | 符号なし整数 | UInt32 | リファレンストランザクションのコスト（手数料単位） |
| ReserveBase | 符号なし整数 | UInt32 | 基本準備金（drop数） |
| ReserveIncrement | 符号なし整数 | UInt32 | 増分準備金（drop数） |
| LedgerSequence | 数値 | UInt32 | _（過去に発生した`SetFee`疑似トランザクションの場合は省略）_ この擬似トランザクションが表示されるレジャーバージョンのインデックス。これにより、この疑似トランザクションと別途発生する同様の変更が区別されます。 |

{% raw-partial file="/@i18n/ja/docs/_snippets/setfee_uniqueness_note.md" /%}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
