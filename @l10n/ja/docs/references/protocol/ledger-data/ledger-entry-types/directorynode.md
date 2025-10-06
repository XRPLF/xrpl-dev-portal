---
seo:
    description: 他のオブジェクトへのリンクを保持します。
labels:
  - データ保持
  - 分散型取引所
---
# DirectoryNode
[[ソース]](https://github.com/XRPLF/rippled/blob/7e24adbdd0b61fb50967c4c6d4b27cc6d81b33f3/include/xrpl/protocol/detail/ledger_entries.macro#L177-L192 "Source")

`DirectoryNode`オブジェクトタイプは、レジャーの状態ツリー内の他オブジェクトへのリンクのリストを提供します。概念上の1つの _ディレクトリ_ は、1つ以上の各DirectoryNodeオブジェクトが含まれる二重リンクリストの形式になっています。各DirectoryNodeオブジェクトには、他オブジェクトの[ID](../common-fields.md)が最大32個まで含まれています。1番目のオブジェクトはディレクトリのルートと呼ばれ、ルートオブジェクト以外のオブジェクトはすべて必要に応じて自由に追加または削除できます。

ディレクトリには3種類があります。

* _所有者ディレクトリ_ は、[`RippleState`(トラストライン)](ripplestate.md)エントリや[`Offer`](offer.md)エントリなどアカウントが所有するその他のエントリの一覧です。
* _オファーディレクトリ_ は、[分散型取引所(DEX)](../../../../concepts/tokens/decentralized-exchange/index.md)で利用可能なオファーの一覧です。1つのオファーディレクトリには、同一トークン(通貨コードと発行者)に同一の取引レートが設定されているすべてのオファーが含まれます。
* _NFTオファーディレクトリ_ は、NFTの買いオファーと売りオファーの一覧です。各NFTには、買いオファー用と売りオファー用の2つのディレクトリがあります。

## {% $frontmatter.seo.title %}のJSONの例

{% tabs %}

{% tab label="オファーディレクトリ" %}
```json
{
  "ExchangeRate": "4e133c40576f7c00",
  "Flags": 0,
  "Indexes": [
    "353E55E7A0B0E82D16DF6E748D48BDAFE4C56045DF5A8B0ED723FF3C38A4787A"
  ],
  "LedgerEntryType": "DirectoryNode",
  "PreviousTxnID": "0F79E60C8642A23658ECB29D939499EA0F28D804077B7EE16613BE0C813A2DD6",
  "PreviousTxnLgrSeq": 91448326,
  "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E133C40576F7C00",
  "TakerGetsCurrency": "0000000000000000000000000000000000000000",
  "TakerGetsIssuer": "0000000000000000000000000000000000000000",
  "TakerPaysCurrency": "0000000000000000000000005553440000000000",
  "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230",
  "index": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784E133C40576F7C00"
}
```
{% /tab %}

{% tab label="所有者ディレクトリ" %}
```json
{
  "Flags": 0,
  "IndexNext": "0",
  "IndexPrevious": "0",
  "Indexes": [
    "1192C0191D1B8861AA6F5A84A575E0CBE4B97574A5E8B3D7B7AD64643EE38CA7",
    "16A0674079229DB47EDDF4FD83AFEA59ADAC944DD5F16EA5D9C989ED8F918AE0",
    "1F65776E640C97B76E365763E97E5B59B6C4CDBB46FB7C8869D1712528985E6D",
    "35D6A9F578E63C875EDB6348E55EFADBD300A0817290276D8CC3DD3587FAD4B3",
    "36B236D80688C2975A5D24935020B75BEB4B26F5115D71943356E86CCD3B8CE4",
    "39E8F12D519E5C6C1AC36434D7340281C362508B7D5BC863166C8FE8621A124C",
    "4DF14053E1BD697C5B4A4A1A7BA8988BD802F0CD5DB6ED9C2AC74AD8A7B91A35",
    "5E2D97ABAB0D2BE1948F275823096597E3359DD0696CF2938A712169394236BE",
    "678CE03A2F8157FBF7D5EFDED2D55D127F60EC26BC4F51DBC8FB05DF370B248E",
    "8250CE37F6495903C1F7D16E072E8823ECE06FA73F011A0F8D79D5626BF581BB",
    "C353DA9F84EB02B4206D6F5166A9277916559115EEDF7B841C38E4473084A010",
    "CB2D979DE863A7AF792A12D6C4518E2B299EF782E361705DE7F1D0077521D521",
    "DFA7CB434A3D9D782C2FACEB95F431476D3AAAD62078C0FBE8C115E00039C6F5"
  ],
  "LedgerEntryType": "DirectoryNode",
  "Owner": "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
  "PreviousTxnID": "CB802FC111C4C03B1E1D762E813D3F1F47347E57C68D00B5F92822C417C2484C",
  "PreviousTxnLgrSeq": 91448329,
  "RootIndex": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3",
  "index": "0A2600D85F8309FE7F75A490C19613F1CE0C37483B856DB69B8140154C2335F3"
}
```
{% /tab %}

{% tab label="NFTオファーディレクトリ" %}
```json
{
  "Flags": 1,
  "Indexes": [
    "68227B203065DED9EEB8B73FC952494A1DA6A69CEABEAA99923836EB5E77C95A"
  ],
  "LedgerEntryType": "DirectoryNode",
  "NFTokenID": "000822603EA060FD1026C04B2D390CC132D07D600DA9B082CB5CE9AC0487E50B",
  "PreviousTxnID": "EF8A9AD51E7CC6BBD219C3C980EC3145C7B0814ED3184471FD952D9D23A1918D",
  "PreviousTxnLgrSeq": 91448417,
  "RootIndex": "0EC5802BD1AB56527A9DE524CCA2A2BA25E1085CCE7EA112940ED115FFF91EE2",
  "index": "0EC5802BD1AB56527A9DE524CCA2A2BA25E1085CCE7EA112940ED115FFF91EE2"
}
```
{% /tab %}

{% /tabs %}

## {% $frontmatter.seo.title %}のフィールド

| 名前                | JSONの型  | [内部の型][] | 必須?  | 説明 |
|---------------------|-----------|--------------|:-------|-------------|
| `DomainID`          | 文字列    | Hash256      | いいえ | (オファーディレクトリのみ) 許可型DEXのレジャーエントリID。指定された場合、対応する[許可型DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md)のみを使用するパスを返します。([PermissionedDEX amendment][] {% not-enabled /%}が必要です。) |
| `ExchangeRate`      | 数値      | UInt64       | いいえ | （オファーディレクトリのみ）**廃止予定**。使用しないでください。 |
| `Flags`             | 数値      | UInt32       | はい   | このディレクトリに対して有効になっているブール値フラグのビットマップ。現在、プロトコルではDirectoryNodeオブジェクトのフラグは定義されていません。 |
| `Indexes`           | 配列      | Vector256    | はい   | このディレクトリの内容: 他のオブジェクトのIDの配列。 |
| `IndexNext`         | 数値      | UInt64       | いいえ | （省略可）このディレクトリに複数のページが含まれている場合、このIDはチェーン内の次のオブジェクトにリンクし、末尾でラップアラウンドします。 |
| `IndexPrevious`     | 数値      | UInt64       | いいえ | （省略可）このディレクトリに複数のページが含まれている場合、このIDはチェーン内の前のオブジェクトにリンクし、先頭でラップアラウンドします。 |
| `LedgerEntryType`   | 文字列    | UInt16       | はい   | 値が`0x0064`（文字列`DirectoryNode`にマッピング）の場合は、このオブジェクトがディレクトリの一部であることを示します。 |
| `NFTokenID`         | 文字列    | UInt256      | いいえ |(NFTオファーディレクトリのみ) 購入または売却オファーに紐づくNFTのID。. |
| `Owner`             | 文字列    | AccountID    | いいえ | （所有者ディレクトリのみ）このディレクトリ内のオブジェクトを所有するアカウントのアドレス。 |
| `PreviousTxnID`     | 文字列    | UInt256      | いいえ | このエントリを最後に変更したトランザクションの識別ハッシュ。{% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq` | 数値      | UInt32       | いいえ | このエントリを最後に変更したトランザクションが含まれる[レジャーインデックス](../ledger-header.md)。{% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `RootIndex`         | 文字列    | UInt256      | はい   | このディレクトリのルートオブジェクトのID。 |
| `TakerGetsCurrency` | 文字列    | UInt160      | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerGetsの額の通貨コード。 |
| `TakerGetsIssuer`   | 文字列    | UInt160      | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerGetsの額のイシュアー。 |
| `TakerPaysCurrency` | 文字列    | UInt160      | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerPaysの額の通貨コード。 |
| `TakerPaysIssuer`   | 文字列    | UInt160      | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerPaysの額のイシュアー。 |


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%} エントリは以下のフラグを持つことができます。

| フラグ名               | 16進数値     | 10進数値 | 説明 |
|:-----------------------|:-------------|:---------|:------------|
| `lsfNFTokenBuyOffers`  | `0x00000001` | 1        | このディレクトリにはNFTの購入オファーが含まれます。 |
| `lsfNFTokenSellOffers` | `0x00000002` | 2        | このディレクトリにはNFTの売却オファーが含まれます。 |

オファーディレクトリと所有者ディレクトリはフラグを使用しません。それらの`Flags`の値は常に0です。


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは準備金が不要です。


## ディレクトリ IDのフォーマット

DirectoryNodeのIDを作成するときには、DirectoryNodeが以下のどのページを表しているかに応じて3種類の方式があります。

* 所有者ディレクトリまたはNFTオファーディレクトリの1番目のページ（ルートとも呼ばれます）
* オファーディレクトリの1番目のページ
* オファーディレクトリの最初のページ。オープンDEXと認可型DEX用のバージョンが含まれます。 _([PermissionedDEX amendment][]が必要です。 {% not-enabled /%})_
* いずれかのディレクトリの以降のページ

**所有者ディレクトリまたはNFTオファーディレクトリの1番目のページ**のIDは、以下の値がこの順序で連結されている[SHA-512Half][]です。

* 所有者ディレクトリのスペースキー（`0x004F`）
* `Owner`フィールドのAccountID。

**オファーディレクトリの1番目のページ**には特殊なIDがあります。このIDの上位192ビットはオーダーブックを定義し、それ以降の64ビットはこのディレクトリ内のオファーの為替レートを定義します。（IDはビッグエンディアンであるため、最初に位置する上位ビットにブックが含まれ、後に位置する下位ビットにクオリティが含まれます。）これにより、最適なオファーから最低のオファーへの順にオーダーブックを反復できます。具体的には、先頭192ビットとは、以下の値がこの順序で連結されている[SHA-512Half][]の先頭192ビットです。

* ブックディレクトリのスペースキー（`0x0042`）
* `TakerPaysCurrency`の160ビットの通貨コード
* `TakerGetsCurrency`の160ビットの通貨コード
* `TakerPaysIssuer`のAccountID
* `TakerGetsIssuer`のAccountID
* このオーダーブックが属する許可型DEXの許可型ドメインの`DomainID`。許可型DEXのオーダーブックの場合。オープンDEXのオーダーブックの場合は省略。

オファーディレクトリのIDの下位64ビットは、そのディレクトリ内のオファーのTakerPaysの額をTakerGetsの額で割った結果を、XRP Ledgerの内部金額フォーマットの64ビット数値で表したものです。

**DirectoryNodeがディレクトリの1番目のページではない場合**、DirectoryNodeのIDは、以下の値をこの順序で連結した[SHA-512Half][]です。

* DirectoryNodeスペースキー（`0x0064`）
* ルートDirectoryNodeのID
* このオブジェクトのページ番号（ルートDirectoryNodeは0であるため、この値は1以上の整数値です。）

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
