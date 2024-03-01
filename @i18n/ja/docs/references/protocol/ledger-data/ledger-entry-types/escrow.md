---
html: escrow-object.html #escrow.html is taken by the concept page
parent: ledger-entry-types.html
seo:
    description: 条件付き決済のために保有されているXRPを含みます。
labels:
  - Escrow
---
# Escrow
[[ソース]](https://github.com/XRPLF/rippled/blob/c6b6d82a754fe449cc533e18659df483c10a5c98/src/ripple/protocol/impl/LedgerFormats.cpp#L90-L101 "Source")

_（[Escrow Amendment][]により追加されました。）_

`Escrow`レジャーエントリは特定の条件が満たされるまでXRPを保持する1つの[エスクロー](../../../../concepts/payment-types/escrow.md)を表します。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": "10000",
  "CancelAfter": 545440232,
  "Condition": "A0258020A82A88B2DF843A54F58772E4A3861866ECDB4157645DD9AE528C1D3AEEDABAB6810120",
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "DestinationTag": 23480,
  "FinishAfter": 545354132,
  "Flags": 0,
  "LedgerEntryType": "Escrow",
  "OwnerNode": "0000000000000000",
  "DestinationNode": "0000000000000000",
  "PreviousTxnID": "C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7",
  "PreviousTxnLgrSeq": 28991004,
  "SourceTag": 11747,
  "index": "DC5F3851D8A1AB622F957761E5963BC5BD439D5C24AC6AD7AC4523F0640244AC"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前                 | JSONの型 | [内部の型][]     | 必須? | 説明 |
|:--------------------|:----------|:--------------|:------|:----|
| `Account`           | 文字列    | AccountID      | はい   | この保留中の支払の所有者（送金元）のアドレス。これはXRPを供給し、保留中の支払が取り消された場合にXRPが返金されるアカウントです。 |
| `Amount`            | 文字列    | Amount         | はい   | 保留中の支払から送金されるXRPの額（drop単位）。 |
| `CancelAfter`       | 数値      | UInt32         | いいえ | _（省略可）_ このフィールドがあり、 _かつ_ 指定されている時刻を経過している場合にのみ、保留中の支払を取り消すことができます。具体的には、これは[Rippleエポック以降の経過秒数][]として指定され、前の検証済みレジャーの閉鎖時刻よりも早い場合に「経過した」ことになります。 |
| `Condition`         | 文字列    | VariableLength | いいえ | _（省略可）_ [PREIMAGE-SHA-256 Crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)（16進数）。指定されている場合、[EscrowFinishトランザクション][]にこの条件を満たすフルフィルメントが含まれている必要があります。 |
| `Destination`       | 文字列    | AccountID      | はい   | 保留中の支払が成功するとXRPが支払われる宛先アドレス。 |
| `DestinationNode`   | 文字列    | UInt64         | いいえ | _（省略可）_ 宛先の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。[fix1523 Amendment][]を有効にする前に作成されたEscrowでは省略されています。 |
| `DestinationTag`    | 数値      | UInt32         | いいえ | _（省略可）_ この保留中の支払の宛先（宛先アドレスにホスティングされている受取人など）を詳しく指定するための任意のタグ。 |
| `FinishAfter`       | 数値      | UInt32         | いいえ | _（省略可）_ [Rippleエポック以降の経過秒数][]で示される時刻が経過した後、保留中の支払を完了できます。この時刻より前の[EscrowFinishトランザクション][]はすべて失敗します。（特にこれは、前の検証済みレジャーの閉鎖時刻と比較されます。） |
| `LedgerEntryType`   | 文字列    | UInt16         | はい   | 値`0x0075`が文字列`Escrow`にマッピングされている場合は、このオブジェクトが`Escrow`オブジェクトであることを示します。 |
| `OwnerNode`         | 文字列    | UInt64         | はい   | 所有者のディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列    | Hash256        | はい   | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値      | UInt32         | はい   | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `SourceTag`         | 数値      | UInt32         | いいえ | _（省略可）_ この保留中の支払の支払元（所有者のアドレスにホスティングされている受取人など）を詳しく指定するための任意のタグ。 |


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%} エントリは、台帳上にエントリがある限り、送信者の所有者準備金の1つとしてカウントされます。エスクローを終了またはキャンセルすると、この準備金は解放されます。


## Escrow IDのフォーマット

`Escrow`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Escrowスペースキー（`0x0075`）
* `Escrow`オブジェクトを作成した[EscrowCreateトランザクション][]の送信者のAccountID。
* `Escrow`オブジェクトを作成した[EscrowCreateトランザクション][]のシーケンス番号。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
