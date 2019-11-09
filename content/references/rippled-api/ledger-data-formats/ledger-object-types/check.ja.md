# Check
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L157-L170 "Source")

_（[Checks Amendment][]が必要です :not_enabled:）_

`Check`オブジェクトはCheckを表します。Checkは紙の個人小切手に似ており、送金先はCheckを換金して送金元からの資金を獲得できます。（予定されている支払いは送金元によりすでに承認されていますが、換金されるまでは資金の移動は発生しません。[Escrow](escrow.html)とは異なり、Checkの資金は預託されず、資金不足が原因でCheckの換金が失敗することがあります。）

## {{currentpage.name}} JSONの例

```json
{
 "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
 "Destination": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
 "DestinationNode": "0000000000000000",
 "DestinationTag": 1,
 "Expiration": 570113521,
 "Flags": 0,
 "InvoiceID": "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
 "LedgerEntryType": "Check",
 "OwnerNode": "0000000000000000",
 "PreviousTxnID": "5463C6E08862A1FAE5EDAC12D70ADB16546A1F674930521295BC082494B62924",
 "PreviousTxnLgrSeq": 6,
 "SendMax": "100000000",
 "Sequence": 2,
 "index": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0"
}
```

## {{currentpage.name}}フィールド

`Check`オブジェクトのフィールドは次のとおりです。

| フィールド               | JSONの型        | [内部の型][] | 説明     |
|:--------------------|:-----------------|:------------------|:----------------|
| `LedgerEntryType`   | 文字列           | UInt16            | 値`0x0043`が文字列`Check`にマッピングされている場合は、このオブジェクトがCheckオブジェクトであることを示します。 |
| `Account`           | 文字列           | Account           | Checkの送金元。Checkを換金するとこのアドレスの残高から引き落とされます。 |
| `Destination`       | 文字列           | Account           | Checkの指定受取人。このアドレスだけが[CheckCashトランザクション][]を使用してCheckを換金できます。 |
| `Flags`             | 数値           | UInt32            |  ブール値フラグのビットマップ。Checkにはフラグが定義されていないため、この値は常に`0`です。 |
| `OwnerNode`         | 文字列           | UInt64            | 送金元の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列           | Hash256           | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値           | UInt32            | 最後にこのオブジェクトを変更したトランザクションを含む[レジャーインデックス][]。 |
| `SendMax`           | 文字列またはオブジェクト | Amount            | このCheckで送金元から引き落とすことができる最大通貨額。Checkの換金が成功すると、送金先に同じ通貨で最大この額までの資金が入金されます。 |
| `Sequence`          | 数値           | UInt32            | このCheckを作成した[CheckCreateトランザクション][]のシーケンス番号。 |
| `DestinationNode`   | 文字列           | UInt64            | _（省略可）_ 送金先の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `DestinationTag`    | 数値           | UInt32            | _（省略可）_ このCheckの送金先（送金先アドレスのホスティングされている受取人など）を詳しく指定するための任意のタグ。 |
| `Expiration`        | 数値           | UInt32            | _（省略可）_ 経過後にこのCheckが有効期限切れとみなされる時刻を示します。詳細は[時間の指定][]を参照してください。 |
| `InvoiceID`         | 文字列           | Hash256           | _（省略可）_ このCheckの具体的な理由または識別子として送金元が指定する任意の256ビットハッシュ。 |
| `SourceTag`         | 数値           | UInt32            | _（省略可）_ このCheckの送金元（送金元アドレスのホスティングされている返金時の受取人など）を詳しく指定するための任意のタグ。 |


## Check IDのフォーマット
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp#L193-L200 "Source")

`Check`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Checkスペースキー（`0x0043`）
* `Check`オブジェクトを作成した[CheckCreateトランザクション][]の送信者のAccountID。
* `Check`オブジェクトを作成した[CheckCreateトランザクション][]のシーケンス番号。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
