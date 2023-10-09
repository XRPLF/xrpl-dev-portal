---
html: transaction-metadata.html
parent: transaction-formats.html
blurb: トランザクションのメタデータは、トランザクションの処理後にトランザクションに追加されるひとまとまりのデータです。
labels:
  - ブロックチェーン
---
# トランザクションのメタデータ

トランザクションのメタデータは、トランザクションの処理後にトランザクションに追加されるひとまとまりのデータです。レジャーに記録されるトランザクションは、トランザクションが成功するかどうかにかかわらず、メタデータを保持しています。トランザクションのメタデータには、トランザクションの結果の詳細が含まれます。

**警告:** トランザクションのメタデータに示された変更が最終的なものになるのは、トランザクションが検証済みバージョンのレジャーに記録された場合のみです。

以下に、トランザクションのメタデータに含まれる可能性があるフィールドをいくつか示します。

{% include '_snippets/tx-metadata-field-table.ja.md' %} <!--_ -->

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
