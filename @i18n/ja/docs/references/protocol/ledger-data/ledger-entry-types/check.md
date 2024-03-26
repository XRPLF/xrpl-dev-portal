---
html: check.html
parent: ledger-entry-types.html
seo:
    description: 送信先が清算して資金にできるCheckです。
labels:
  - Checks
---
# Check
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L157-L170 "Source")

_（[Checks Amendment][]が必要です）_

`Check`オブジェクトはCheckを表します。Checkは紙の個人小切手に似ており、送金先はCheckを換金して送金元からの資金を獲得できます。（予定されている支払いは送金元によりすでに承認されていますが、換金されるまでは資金の移動は発生しません。[Escrow](../../../../concepts/payment-types/escrow.md)とは異なり、Checkの資金は預託されず、資金不足が原因でCheckの換金が失敗することがあります。）

## {% $frontmatter.seo.title %}のJSONの例

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

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド            | JSONの型             | [内部の型][] | 必須? | 説明     |
|:--------------------|:---------------------|:-----------|:-------|:----------------|
| `Account`           | 文字列                | Account    | はい | Checkの送金元。Checkを換金するとこのアドレスの残高から引き落とされます。 |
| `Destination`       | 文字列                | Account    | はい | Checkの指定受取人。このアドレスだけが[CheckCashトランザクション][]を使用してCheckを換金できます。 |
| `DestinationNode`   | 文字列                | UInt64     | いいえ | _（省略可）_ 送金先の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `DestinationTag`    | 数値                  | UInt32     | いいえ | _（省略可）_ このCheckの送金先（送金先アドレスのホスティングされている受取人など）を詳しく指定するための任意のタグ。 |
| `Expiration`        | 数値                  | UInt32     | いいえ | _（省略可）_ 経過後にこのCheckが有効期限切れとみなされる時刻を示します。詳細は[時間の指定][]をご覧ください。 |
| `InvoiceID`         | 文字列                | Hash256    | いいえ | _（省略可）_ このCheckの具体的な理由または識別子として送金元が指定する任意の256ビットハッシュ。 |
| `LedgerEntryType`   | 文字列                | UInt16     | はい | 値`0x0043`が文字列`Check`にマッピングされている場合は、このオブジェクトがCheckオブジェクトであることを示します。 |
| `OwnerNode`         | 文字列                | UInt64     | はい | 送金元の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列                | Hash256    | はい | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値                  | UInt32     | はい | 最後にこのオブジェクトを変更したトランザクションを含む[レジャーインデックス][]。 |
| `SendMax`           | 文字列またはオブジェクト | Amount     | はい | このCheckで送金元から引き落とすことができる最大通貨額。Checkの換金が成功すると、送金先に同じ通貨で最大この額までの資金が入金されます。 |
| `Sequence`          | 数値                  | UInt32     | はい | このCheckを作成した[CheckCreateトランザクション][]のシーケンス番号。 |
| `SourceTag`         | 数値                  | UInt32     | いいえ | _（省略可）_ このCheckの送金元（送金元アドレスのホスティングされている返金時の受取人など）を詳しく指定するための任意のタグ。 |

## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、そのエントリが台帳上にある限り、Checkの送金人の所有者準備金の1つとしてカウントされます。この準備金は、小切手が換金されるか、またはキャンセルされたときに解放されます。


## Check IDのフォーマット
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp#L193-L200 "Source")

`Check`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Checkスペースキー（`0x0043`）
* `Check`オブジェクトを作成した[CheckCreateトランザクション][]の送信者のAccountID。
* `Check`オブジェクトを作成した[CheckCreateトランザクション][]のシーケンス番号。
    CheckCreateトランザクションが[Ticket](../../../../concepts/accounts/tickets.md)を使用する場合は、代わりに`TicketSequence`値を使用します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
