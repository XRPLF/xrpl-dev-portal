---
html: ticketcreate.html
parent: transaction-types.html
blurb: チケットとして1つ以上のシーケンス番号を確保する。
labels:
  - Transaction Sending
---
# TicketCreate

[[ソース]](https://github.com/ripple/rippled/blob/develop/src/ripple/app/tx/impl/CreateTicket.cpp "Source")

_([TicketBatch amendment][]が必要です)_

TicketCreateトランザクションは、1つまたは複数の[シーケンス番号](basic-data-types.html#アカウントシーケンス)を[Tickets](ticket.html)として確保します。

## {{currentpage.name}}JSONの例

```json
{
    "TransactionType": "TicketCreate",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10",
    "Sequence": 381,
    "TicketCount": 10
}
```

{% include '_snippets/tx-fields-intro.ja.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド         | JSONの型          | [内部の型][]       | 説明                |
|:-----------------|:-----------------|:------------------|:-------------------|
| `TicketCount`    | 数値              | UInt32            | 作成するチケットの枚数。これは正の数でなければならず、このトランザクションの実行の結果、アカウントが250枚以上のチケットを所有することはできません。 |

トランザクションが要求されたチケット_全て_を作成できない場合(250チケットの制限または[所有者準備金](reserves.html)のいずれかが原因)、失敗してチケットは作成されません。アカウントが現在所有しているチケットの数を調べるには、[account_info メソッド][]を使用して、`account_data.TicketCount`フィールドを確認してください。

**ヒント:** このトランザクションは、送信アカウントの[シーケンス番号][Sequence Number]を1 _+_ 作成するチケットの数(`TicketCount`)だけ増加させます。この取引は、アカウントのシーケンス番号を1より多く増加させる唯一の取引です。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{{currentpage.name}}トランザクションでは、次の[トランザクション結果コード](transaction-results.html)が発生する可能性があります。

| エラーコード                | 説明                                              |
|:--------------------------|:-------------------------------------------------|
| `temINVALID_COUNT`        | TicketCount`フィールドが無効です。1から250までの整数でなければなりません。|
| `tecDIR_FULL`             | この取引により、アカウントが一度に所有するチケットの上限である250枚を超えたり、一般的なレジャーオブジェクトの上限数を超えたりすることになります。 |
| `tecINSUFFICIENT_RESERVE` | 送信側のアカウントには、要求されたすべてのチケットの[所有者準備金](reserves.html)を満たすだけのXRPがありません。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
