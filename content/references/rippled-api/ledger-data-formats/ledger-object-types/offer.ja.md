# Offer
[[ソース]<br>](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L57 "Source")

`Offer`オブジェクトタイプは、XRP Ledgerの分散型取引所での（従来は _オーダー_ と呼ばれていた）通貨取引オファーを記述します。[OfferCreateトランザクション][]は、レジャーにすでに含まれている他のオファーを消費することでは完全にオファーを実行できない場合に、レジャーに`Offer`オブジェクトを作成します。

オファーがレジャーに存在している間に、ネットワークの他のアクティビティによってオファーが資金化されないことがあります。ただし`rippled`ではトランザクション処理において資金化されないオファーはすべて自動的に取り除かれます（レジャー状態を変更できるのはトランザクションだけであることから、これはトランザクション処理で _のみ_ 行われます）。

詳細は、[オファー](offers.html)を参照してください。

## {{currentpage.name}}のJSONの例

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

## {{currentpage.name}}のフィールド

`Offer`オブジェクトのフィールドを次に示します。

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | 文字列    | UInt16    | 値が`0x006F`（文字列`Offer`にマッピング）の場合は、このオブジェクトが通貨取引オーダーを記述することを示します。 |
| `Flags`             | 数値    | UInt32    | このオファーに対して有効になっているブール値フラグのビットマップ。 |
| `Account`           | 文字列    | AccountID | このオファーを所有するアカウントのアドレス。 |
| `Sequence`          | 数値    | UInt32    | `Offer`オブジェクトを作成した[OfferCreate][]トランザクションの`Sequence` 値。`Account`とこのフィールドの組み合わせによってこのオファーが識別されます。 |
| `TakerPays`         | 文字列またはオブジェクト | Amount | オファー作成者が要求する残額と通貨の種類。 |
| `TakerGets`         | 文字列またはオブジェクト | Amount | オファー作成者が提供する残額と通貨の種類。 |
| `BookDirectory`     | 文字列    | UInt256   | このオファーにリンクしている[オファーディレクトリー](directorynode.html)のID。 |
| `BookNode`          | 文字列    | UInt64    | オファーディレクトリーが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `OwnerNode`         | 文字列    | UInt64    | 所有者ディレクトリーが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオファーには、オファーを含む所有者ディレクトリーへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列 | Hash256 | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値 | UInt32 | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `Expiration`        | 数値    | UInt32    | （省略可）このオファーが資金化されなかったとみなされる時刻を示します。詳細は、[時間の指定][]を参照してください。 |

## Offerのフラグ

[OfferCreateトランザクション][]でOfferオブジェクトを作成するときに有効化または無効化できる各種オプションがあります。レジャーではフラグはバイナリ値として表され、これらのバイナリ値はビットOR演算と組み合わせることができます。レジャーでのフラグのビット値は、トランザクションでこれらのフラグを有効または無効にするために使用する値とは異なります。レジャーのフラグには、 _lsf_ で始まる名前が付いています。

`Offer` オブジェクトには以下のフラグ値を指定できます。

| フラグ名 | 16進値 | 10進値 | 説明 | 対応する[OfferCreateフラグ](offercreate.html#offercreateフラグ) |
|-----------|-----------|---------------|-------------|------------------------|
| lsfPassive | 0x00010000 | 65536 | オブジェクトはパッシブオファーとして配置されました。レジャー内のオブジェクトには影響しません。 | tfPassive |
| lsfSell   | 0x00020000 | 131072 | オブジェクトはセルオファーとして配置されました。レジャー内のオブジェクトへの影響はありません。これは、要求したレートよりも良いレートを得た場合にのみtfSellが関連するためです。この状況はオブジェクトがレジャーに記録された後では発生することはありません。 | tfSell |

## オファーIDのフォーマット

`Offer`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* Offerスペースキー（`0x006F`）
* オファーを行うアカウントのAccountID
* オファーを作成した[OfferCreateトランザクション][]のシーケンス番号。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
