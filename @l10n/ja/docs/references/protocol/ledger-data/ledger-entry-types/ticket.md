---
html: ticket.html
parent: ledger-entry-types.html
seo:
    description: チケットは、将来使用するために確保されたアカウントのシーケンス番号を追跡します。
labels:
  - トランザクション送信
---
# Ticket

[[ソース]](https://github.com/XRPLF/rippled/blob/76a6956138c4ecd156c5c408f136ed3d6ab7d0c1/src/ripple/protocol/impl/LedgerFormats.cpp#L155-L164)

_([TicketBatch amendment][]が必要です)_

`Ticket`オブジェクトタイプは、将来の使用のために確保されたアカウント[シーケンス番号](../../data-types/basic-data-types.md#アカウントシーケンス)を追跡する[Ticket](../../../../concepts/accounts/tickets.md)を表します。[TicketCreate トランザクション][]で新しいチケットを作成することができます。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Account" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Flags" : 0,
  "LedgerEntryType" : "Ticket",
  "OwnerNode" : "0000000000000000",
  "PreviousTxnID" : "F19AD4577212D3BEACA0F75FE1BA1644F2E854D46E8D62E9C95D18E9708CBFB1",
  "PreviousTxnLgrSeq" : 4,
  "TicketSequence" : 3
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド            | JSONの型   | [内部の型][]   | 必須? | 説明 |
|:--------------------|:----------|:--------------|:------|:----|
| `Account`           | 文字列     | AccountID     | はい   | このチケットを所有する[アカウント](../../../../concepts/accounts/index.md)です。 |
| `LedgerEntryType`   | 文字列     | UInt16        | はい   | 文字列`Ticket`にマッピングされた値`0x0054`は、このオブジェクトが {% $frontmatter.seo.title %}エントリであることを示しています。 |
| `OwnerNode`         | 文字列     | UInt64        | はい   | 送金元の所有者ディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。注記: このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列     | Hash256       | はい   | 最後にこのオブジェクトを変更した[トランザクション](../../../../concepts/transactions/index.md)の識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値       | UInt32        | はい   | 最後にこのオブジェクトを変更したトランザクションを含む[レジャーインデックス][Ledger Index]。 |
| `TicketSequence`    | 数値       | UInt32        | はい   | 本チケットが設定する[シーケンス番号][]。 |


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、台帳上にエントリがある限り、それを作成したアカウントの所有者準備金の対象の1つとしてカウントされます。チケットを使用すると、準備金が解放されます。


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。


## {% $frontmatter.seo.title %} IDのフォーマット

TicketオブジェクトのIDは、以下の値がこの順序で連結されているSHA-512ハーフです

* Ticketスペースキー (`0x0054`)
* チケットの所有者のアカウントID
* チケットの`TicketSequence`

{% raw-partial file="/docs/_snippets/common-links.md" /%}
