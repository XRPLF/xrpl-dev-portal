# CheckCash
[[ソース]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CashCheck.cpp "Source")

_（[Checks Amendment][]が必要です :not_enabled:）_

対応する[CheckCreateトランザクション][]で承認された額まで受領するため、レジャーでCheckオブジェクトの清算を試みます。CheckCashトランザクションでCheckを換金できるのは、Checkの`Destination`アドレスだけです。このCheckの換金方法は、送金先により開始される[Payment][]の実行に似ています。

Checkに相当する資金があるとは保証されないため、送金元に十分な残高がないか、または資金を送金できるだけの十分な流動性がないことが原因で、Checkの清算が失敗することがあります。このような状況が発生した場合、Checkはレジャーに残り、送金先は後でこのCheckの換金を再試行するか、または異なる額で換金を試みることができます。

## {{currentpage.name}} JSONの例

```json
{
   "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
   "TransactionType": "CheckCash",
   "Amount": "100000000",
   "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
   "Fee": "12"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド        | JSONの型           | [内部の型][] | 説明         |
|:-------------|:--------------------|:------------------|:--------------------|
| `CheckID`    | 文字列              | Hash256           | 換金する[Checkレジャーオブジェクト](check.html)のID（64文字の16進文字列）。 |
| `Amount`     | [通貨額][] | Amount            | _（省略可）_ 可能であればCheckを厳密にこの額で清算します。通貨は対応するCheckCreateトランザクションの`SendMax`の通貨と一致している必要があります。このフィールドまたは`DeliverMin`のいずれかを指定する必要があります。 |
| `DeliverMin` | [通貨額][] | Amount            | _（省略可）_ Checkをこの額以上の可能な限りの額で清算します。通貨は対応するCheckCreateトランザクションの`SendMax`の通貨と一致している必要があります。このフィールドまたは`Amount`のいずれかを指定する必要があります。 |

`Amount`または`DeliverMin`のいずれかを指定する***必要があります***が、両方は指定しないでください。

## エラーケース

- CheckCashトランザクションの送信者がCheckの`Destination`ではない場合、トランザクションは結果コード`tecNO_PERMISSION`で失敗します。
- `CheckID`フィールドにより識別されるCheckが存在していない場合、トランザクションは結果コード`tecNO_ENTRY`で失敗します。
- `CheckID`フィールドにより識別されるCheckが有効期限切れである場合、トランザクションは結果コード`tecEXPIRED`で失敗します。
- Checkの送金先でRequireDestフラグが有効であるが、作成されるCheckには送金先タグが指定されていない場合、トランザクションは結果コード`tecDST_TAG_NEEDED`で失敗します。
- トランザクションで`Amount`と`DeliverMin`の両方が指定または省略される場合、トランザクションは結果コード`temMALFORMED`で失敗します。
- `Amount`または`DeliverMin` がCheckの通貨（およびXRP以外の通貨の場合はイシュアー）に一致しない場合、トランザクションは結果コード`temBAD_CURRENCY`で失敗します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
