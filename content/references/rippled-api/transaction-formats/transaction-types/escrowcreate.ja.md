# EscrowCreate

[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/Escrow.cpp "Source")

_[Escrow Amendment][]が必要です。_

Escrowプロセスが終了または取り消されるまでXRPを隔離します。

## {{currentpage.name}} JSONの例

```json
{
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "TransactionType": "EscrowCreate",
   "Amount": "10000",
   "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
   "CancelAfter": 533257958,
   "FinishAfter": 533171558,
   "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
   "DestinationTag": 23480,
   "SourceTag": 11747
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->


| フィールド            | JSONの型 | [内部の型][] | 説明               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | 文字列    | Amount            | 送金元の残高から差し引いてエスクローに留保する[XRP、drop単位][]の額。エスクローに留保されたXRPは`Destination`アドレスに送金されるか（`FinishAfter`時刻の経過後）、または送金元に戻されます（`CancelAfter`時刻の経過後）。 |
| `Destination`    | 文字列    | AccountID         | エスクローに留保されたXRPを受領するアドレス。 |
| `CancelAfter`    | 数値    | UInt32            | _（省略可）_ このEscrowの有効期限（[Rippleエポック以降の経過秒数][]）。この値は変更できません。この時刻の経過後にのみ資金を送金元に返金できます。 |
| `FinishAfter`    | 数値    | UInt32            | _（省略可）_ Escrowに留保されたXRPを受取人に対してリリースできる時刻（[Rippleエポック以降の経過秒数][]）。この値は変更できません。この時刻に達するまでは資金を移動できません。 |
| `Condition`      | 文字列    | Blob              | _（省略可）_[PREIMAGE-SHA-256 Crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)を表す16進数値。この条件が満たされている場合にのみ、資金を受取人に送金できます。 |
| `DestinationTag` | 数値    | UInt32            | _（省略可）_ Escrowに留保されている支払いの宛先（宛先アドレスでホスティングされている受取人など） を詳しく指定するための任意のタグ。 |

`CancelAfter`と`FinishAfter`のいずれかを指定する必要があります。両方を指定する場合は、`FinishAfter`の時刻が`CancelAfter`の時刻よりも前でなければなりません。

[fix1571 Amendment][]が有効な場合は、`FinishAfter`、`Condition`のいずれかまたは両方を指定する必要があります。[新規: rippled 1.0.0][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
