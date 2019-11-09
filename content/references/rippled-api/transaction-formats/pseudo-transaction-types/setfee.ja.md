# SetFee

[手数料投票](fee-voting.html)の結果として[トランザクションコスト](transaction-cost.html)または[アカウント準備金](reserves.html)の要件が変更されます。

**注記:** 疑似トランザクションは送信できませんが、レジャーの処理時に疑似トランザクションが見つかることがあります。

```
{
   "Account":"rrrrrrrrrrrrrrrrrrrrrhoLvTp",
   "BaseFee":"000000000000000A",
   "Fee":"0",
   "ReferenceFeeUnits":10,
   "ReserveBase":20000000,
   "ReserveIncrement":5000000,
   "Sequence":0,
   "SigningPubKey":"",
   "TransactionType":"SetFee",
   "date":439578860,
   "hash":"1C15FEA3E1D50F96B6598607FC773FF1F6E0125F30160144BE0C5CBC52F5151B",
   "ledger_index":3721729,
 }
```

| フィールド             | JSONの型        | [内部の型][] | 説明       |
|:------------------|:-----------------|:------------------|:------------------|
| BaseFee           | 文字列           | UInt64            | リファレンストランザクションの手数料（XRPのdrop数、16進数）。（これは、負荷スケーリング前の[トランザクションコスト](transaction-cost.html)です。） |
| ReferenceFeeUnits | 符号なし整数 | UInt32            | リファレンストランザクションのコスト（手数料単位） |
| ReserveBase       | 符号なし整数 | UInt32            | 基本準備金（drop数） |
| ReserveIncrement  | 符号なし整数 | UInt32            | 増分準備金（drop数） |
| LedgerSequence    | 数値           | UInt32            | この疑似トランザクションが含まれているレジャーバージョンのインデックス。これにより、この疑似トランザクションと別途発生する同様の変更が区別されます。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
