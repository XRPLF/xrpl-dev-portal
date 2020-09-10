# CheckCreate
[[ソース]](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateCheck.cpp "Source")

_（[Checks Amendment][]が必要です）_

レジャーにCheckオブジェクトを作成します。これにより指定の送金先は後日換金することができます。このトランザクションの送信者はCheckの送金元です。

## {{currentpage.name}} JSONの例

```json
{
 "TransactionType": "CheckCreate",
 "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
 "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
 "SendMax": "100000000",
 "Expiration": 570113521,
 "InvoiceID": "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
 "DestinationTag": 1,
 "Fee": "12"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド            | JSONの型           | [内部の型][] | 説明     |
|:-----------------|:--------------------|:------------------|:----------------|
| `Destination`    | 文字列              | AccountID          | Checkを換金できる[アカウント](accounts.html)の一意アドレス。 |
| `SendMax`        | [通貨額][] | Amount            | Checkで送金元から引き落とすことができる送金元通貨の最大額（XRP以外の通貨の[送金手数料](transfer-fees.html)を含む）。Checkは同一通貨の送金先にのみ入金可能です（XRP以外の通貨の場合は同一イシュアーから）。XRP以外の金額の場合、入れ子フィールドの名前にはアルファベットの小文字のみ使用してください。 |
| `DestinationTag` | 数値              | UInt32            | _（省略可）_ Checkの理由を明確にする任意のタグ、または支払先となる、ホスティングされている受取人。 |
| `Expiration`     | 数値              | UInt32            | _（省略可）_ Checkが無効になる時刻（[Rippleエポック以降の経過秒数][]）。 |
| `InvoiceID`      | 文字列              | Hash256           | _（省略可）_ このCheckの具体的な理由または識別子を表現する任意の256ビットハッシュ。 |

## エラーケース

- `Destination`がトランザクションの送信者である場合、トランザクションは結果コード`temREDUNDANT`で失敗します。
- `Destination`[アカウント](accounts.html)がレジャーに存在していない場合、トランザクションは結果コード`tecNO_DST`で失敗します。
- `Destination`アカウントでRequireDestフラグが有効であるが、トランザクションに`DestinationTag`フィールドが含まれていない場合、トランザクションは結果コード`tecDST_TAG_NEEDED`で失敗します。
- `SendMax`に[凍結](freezes.html)されている発行済み通貨が指定されている場合、トランザクションは結果コード`tecFROZEN`で失敗します。
- トランザクションの`Expiration`が過去の日時である場合、トランザクションは結果コード`tecEXPIRED`で失敗します。
- Checkの追加後に送金元が[所有者準備金](reserves.html#所有者準備金)条件を満たすのに十分なXRPを保有していない場合、トランザクションは結果コード`tecINSUFFICIENT_RESERVE`で失敗します。
- Checkの送金元または送金先のいずれかがレジャーでこれ以上のオブジェクトを所有できない場合、トランザクションは結果コード`tecDIR_FULL`で失敗します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
