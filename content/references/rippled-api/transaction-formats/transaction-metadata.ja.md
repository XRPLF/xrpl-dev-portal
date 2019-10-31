# トランザクションのメタデータ

トランザクションのメタデータは、トランザクションの処理後にトランザクションに追加されるひとまとまりのデータです。レジャーに記録されるトランザクションは、トランザクションが成功するかどうかにかかわらず、メタデータを保持しています。トランザクションのメタデータには、トランザクションの結果の詳細が含まれます。

**警告:** トランザクションのメタデータに示された変更が最終的なものになるのは、トランザクションが検証済みバージョンのレジャーに記録された場合のみです。

以下に、トランザクションのメタデータに含まれる可能性があるフィールドをいくつか示します。

| フィールド                                 | 値               | 説明    |
|:--------------------------------------|:--------------------|:---------------|
| `AffectedNodes`                       | 配列               | このトランザクションで作成、削除、または修正された[レジャーオブジェクト](ledger-object-types.html)のリストと、個々のオブジェクトに対する具体的な変更内容。 |
| `DeliveredAmount`                     | [通貨額][] | **廃止予定。**`delivered_amount`で置き換えられます。Partial Paymentsでない場合は省略されます。 |
| `TransactionIndex`                    | 符号なし整数    | トランザクションが記録されているレジャーでのトランザクションの位置。この配列は0から始まります。（例えば、値が`2`の場合、そのレジャーの3番目のトランザクションであったことを意味します）。 |
| `TransactionResult`                   | 文字列              | トランザクションが成功したか、どのような理由で失敗したかを示す[結果コード](transaction-results.html)。 |
| [`delivered_amount`](#delivered_amount) | [通貨額][] | `Destination`アカウントが実際に受取った[通貨額][]。このフィールドは、トランザクションが[Partial Payments](partial-payments.html)であるかどうかにかかわらず、送金された金額を特定するために使用します。[新規: rippled 0.27.0][] |

## delivered_amount

[Paymentトランザクション][]の`Amount`。`Destination`に送金された金額を示し、トランザクションが成功すると、**[Partial Payments](partial-payments.html)であった場合を除いて、** 宛先は当該の金額を受取ります（Partial Paymentsの場合、`Amount`を上限とする正の金額が受取られます）。`Amount`フィールドを信頼するかどうかを選択するのではなく、メタデータの`delivered_amount`フィールドを使用して、宛先に実際に到達する金額を確認してください。

トランザクションのメタデータの`delivered_amount`フィールドは、成功したすべてのPaymentトランザクションが保持しており、フォーマットは通常の通貨額と同様です。ただし、送金額は、以下の両方の条件に該当するトランザクションについては使用できません。

* Partial Paymentsである
* 2014-01-20よりも前の検証済みレジャーに含まれている

両方の条件に該当する場合、`delivered_amount`には、実際の金額ではなく文字列値`unavailable`が記述されます。この場合、トランザクションのメタデータにあるAffectedNodesを読み取ることが、実際に送金された金額を割り出せる唯一の手段になります。

関連項目: [Partial Payments](partial-payments.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
