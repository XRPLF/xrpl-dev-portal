---
seo:
    description: Escrowプロセスが終了または取り消されるまでXRPを隔離します。
labels:
    - Escrow
---
# EscrowCreate
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

Escrowプロセスが終了または取り消されるまでXRPを隔離します。

{% amendment-disclaimer name="Escrow" /%}

## {% $frontmatter.seo.title %} JSONの例

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

{% tx-example txid="C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7" /%}


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド            | JSONの型 | [内部の型][] | 説明               |
|:-----------------|:----------|:------------------|:--------------------------|
| `Amount`         | 文字列    | Amount            | 送金元の残高から差し引いてエスクローに留保する[XRPのdrop数][]の額。エスクローに留保されたXRPは`Destination`アドレスに送金されるか（`FinishAfter`時刻の経過後）、または送金元に戻されます（`CancelAfter`時刻の経過後）。 |
| `Destination`    | 文字列    | AccountID         | エスクローに留保されたXRPを受領するアドレス。 |
| `CancelAfter`    | 数値    | UInt32            | _（省略可）_ このEscrowの有効期限（[Rippleエポック以降の経過秒数][]）。この値は変更できません。この時刻の経過後にのみ資金を送金元に返金できます。 |
| `FinishAfter`    | 数値    | UInt32            | _（省略可）_ Escrowに留保されたXRPを受取人に対してリリースできる時刻（[Rippleエポック以降の経過秒数][]）。この値は変更できません。この時刻に達するまでは資金を移動できません。 |
| `Condition`      | 文字列    | Blob              | _（省略可）_[PREIMAGE-SHA-256 Crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)を表す16進数値。この条件が満たされている場合にのみ、資金を受取人に送金できます。 |
| `DestinationTag` | 数値    | UInt32            | _（省略可）_ Escrowに留保されている支払いの宛先（宛先アドレスでホスティングされている受取人など） を詳しく指定するための任意のタグ。 |

次のフィールドの組み合わせのいずれかを指定する必要があります。

| 概要                              | `FinishAfter` | `Condition` | `CancelAfter` |
|-----------------------------------|---------------|-------------|---------------|
| 時刻ベース                        | ✅            |             |               |
| 有効期限ありの時刻ベース          | ✅            |             | ✅            |
| 時刻あり条件                      | ✅            | ✅          |               |
| 有効期限と時刻ありの条件          | ✅            | ✅          | ✅            |
| 有効期限ありの条件                |               | ✅          | ✅            |

有効期限のない条件付きエスクローを作成することはできませんが、有効期限を非常に遠い将来に指定することはできます。

{% admonition type="info" name="注記" %}
[fix1571 Amendment][]が有効になる前は、`CancelAfter`のみを指定してエスクローを作成することができました。これらのエスクローは、指定された有効期限より前の任意の時刻に誰でも終了できました。
{% /admonition %}

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
