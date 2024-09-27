---
html: offer.html
parent: ledger-entry-types.html
seo:
    description: 通貨取引を行う注文
labels:
  - 分散型取引所
---
# Offer
[[ソース]](https://github.com/XRPLF/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L57 "Source")

台帳の`Offer`エントリは、XRP Ledgerの[分散型取引所](../../../../concepts/tokens/decentralized-exchange/index.md)で通貨を交換する[オファー](../../../../concepts/tokens/decentralized-exchange/offers.md)を表しています。（金融ではより伝統的に _オーダー_ として知られています）。[OfferCreateトランザクション][]は台帳にある他のOfferを全額約定できない場合、台帳に`Offer`エントリを作成します。

オファーがネットワーク上の他の活動によって資金不足になることはありますが、元帳には残ります。トランザクションを処理する際、ネットワークはトランザクションが見つけた資金不足のオファーを自動的に削除します。( _トランザクションのみ_ が台帳の状態を変更できるため、削除が行われないと資金不足のオファーが残ってしまいます。)

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "Account": "rBqb89MRQJnMPq8wTwEbtz4kvxrEDfcYvt",
  "BookDirectory": "ACC27DE91DBA86FC509069EAF4BC511D73128B780F2E54BF5E07A369E2446000",
  "BookNode": "0000000000000000",
  "Flags": 131072,
  "LedgerEntryType": "Offer",
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
  "PreviousTxnLgrSeq": 14524914,
  "Sequence": 866,
  "TakerGets": {
    "currency": "XAG",
    "issuer": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH",
    "value": "37"
  },
  "TakerPays": "79550000000",
  "index": "96F76F27D8A327FC48753167EC04A46AA0E382E6F57F32FD12274144D00F1797"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| 名前              | JSONの型 | [内部の型][] | 必須? | 説明 |
|-------------------|-----------|-----------|------|-------|
| `Account`           | 文字列    | AccountID | はい  | このオファーを所有するアカウントのアドレス。 |
| `BookDirectory`     | 文字列    | Hash256   | はい  | このオファーにリンクしている[オファーディレクトリー](directorynode.md)のID。 |
| `BookNode`          | 文字列    | UInt64    | はい  | Offerディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒント。 |
| `Expiration`        | 数値    | UInt32    | いいえ | （省略可）このオファーが資金不足とみなされる時刻。詳細は、[時間の指定][]をご覧ください。 |
| `Flags`             | 数値    | UInt32    | はい  | このオファーに対して有効になっているブール値フラグのビットマップ。 |
| `LedgerEntryType`   | 文字列    | UInt16    | はい  | 値が`0x006F`（文字列`Offer`にマッピング）の場合は、このオブジェクトが通貨取引オーダーを記述することを示す。 |
| `OwnerNode`         | 文字列    | UInt64    | はい  | 所有者ディレクトリーが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒント。**注記:** このオファーには、オファーを含む所有者ディレクトリーへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列 | Hash256 | はい  | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `Sequence`          | 数値    | UInt32    | はい  | `Offer`オブジェクトを作成した[OfferCreate][]トランザクションの`Sequence`値。`Account`とこのフィールドの組み合わせによってこのオファーが識別されます。 |
| `PreviousTxnLgrSeq` | 数値 | UInt32 | はい  | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `TakerPays`         | 文字列またはオブジェクト | Amount | はい  | オファー作成者がリクエストする残額と通貨の種類。 |
| `TakerGets`         | 文字列またはオブジェクト | Amount | はい  | オファー作成者が提供する残額と通貨の種類。 |

## Offerのフラグ

`Offer`エントリは以下のフラグを`Flags`フィールドに指定することができます。

| フラグ名 | 16進数値 | 10進数値 | 対応する[OfferCreateフラグ](../../transactions/types/offercreate.md#offercreateフラグ) | 説明 |
|-----------|-----------|---------------|-------------|------------------------|
| `lsfPassive` | `0x00010000` | 65536 | `tfPassive` | オブジェクトはパッシブオファーとして発注されています。レジャー内のオブジェクトには影響しません。 |
| `lsfSell`   | `0x00020000` | 131072 | `tfSell` | オブジェクトは売却オファーとして発注されています。これは台帳にあるオブジェクトには何の影響もありません (`tfSell`は指定したレートよりも良いレートが存在する場合にのみ意味を持ち、台帳にこのフラグを持ったオブジェクトが入ることはありません。)。 |


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、台帳上にエントリがある限り、オファーを出したアカウントの所有者準備金の対象の1つとしてカウントされます。オファーをキャンセルまたは約定すると、準備金が解放されます。準備金は、資金がないことが判明してオファーが削除された場合にも解放されます。


## オファーIDのフォーマット

`Offer`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Offerスペースキー（`0x006F`）
* オファーを行うアカウントのAccountID
* オファーを作成した[OfferCreateトランザクション][]のシーケンス番号

    OfferCreateトランザクションが[Ticket](../../../../concepts/accounts/tickets.md)を使用した場合、代わりに`TicketSequence`値を使用します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
