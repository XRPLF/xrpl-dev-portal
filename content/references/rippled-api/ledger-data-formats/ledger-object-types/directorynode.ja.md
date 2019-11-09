# DirectoryNode
[[ソース]<br>](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L44 "Source")

`DirectoryNode`オブジェクトタイプは、レジャーの状態ツリー内の他オブジェクトへのリンクのリストを提供します。概念上の1つの _ディレクトリー_ は、1つ以上の各DirectoryNodeオブジェクトが含まれる二重リンクリストの形式になっています。各DirectoryNodeオブジェクトには、他オブジェクトの[ID](ledgers.html#ツリーの形式)が最大32個まで含まれています。1番目のオブジェクトはディレクトリーのルートと呼ばれ、ルートオブジェクト以外のオブジェクトはすべて必要に応じて自由に追加または削除できます。

2種類のディレクトリーがあります。

* **所有者ディレクトリー**は、アカウントが所有するその他のオブジェクト（`RippleState`オブジェクトや`Offer`オブジェクトなど）をリストします。
* **オファーディレクトリー**は、分散型取引所で利用可能なオファーをリストします。1つのオファーディレクトリーには、同一イシュアンスに同一為替レートが設定されているすべてのオファーが含まれます。

## {{currentpage.name}}のJSONの例

<!-- MULTICODE_BLOCK_START -->

*オファーディレクトリー*

```json
{
   "ExchangeRate": "4F069BA8FF484000",
   "Flags": 0,
   "Indexes": [
       "AD7EAE148287EF12D213A251015F86E6D4BD34B3C4A0A1ED9A17198373F908AD"
   ],
   "LedgerEntryType": "DirectoryNode",
   "RootIndex": "1BBEF97EDE88D40CEE2ADE6FEF121166AFE80D99EBADB01A4F069BA8FF484000",
   "TakerGetsCurrency": "0000000000000000000000000000000000000000",
   "TakerGetsIssuer": "0000000000000000000000000000000000000000",
   "TakerPaysCurrency": "0000000000000000000000004A50590000000000",
   "TakerPaysIssuer": "5BBC0F22F61D9224A110650CFE21CC0C4BE13098",
   "index": "1BBEF97EDE88D40CEE2ADE6FEF121166AFE80D99EBADB01A4F069BA8FF484000"
}
```

*所有者ディレクトリー*

```json
{
   "Flags": 0,
   "Indexes": [
       "AD7EAE148287EF12D213A251015F86E6D4BD34B3C4A0A1ED9A17198373F908AD",
       "E83BBB58949A8303DF07172B16FB8EFBA66B9191F3836EC27A4568ED5997BAC5"
   ],
   "LedgerEntryType": "DirectoryNode",
   "Owner": "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ",
   "RootIndex": "193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94",
   "index": "193C591BF62482468422313F9D3274B5927CA80B4DD3707E42015DD609E39C94"
}
```

<!-- MULTICODE_BLOCK_END -->

## {{currentpage.name}}のフィールド

| 名前              | JSONの型 | [内部の型][] | 説明 |
|-------------------|-----------|---------------|-------------|
| `LedgerEntryType`   | 文字列    | UInt16    | 値が`0x0064`（文字列`DirectoryNode`にマッピング）の場合は、このオブジェクトがディレクトリーの一部であることを示します。 |
| `Flags`             | 数値    | UInt32    | このディレクトリーに対して有効になっているブール値フラグのビットマップ。現在、プロトコルではDirectoryNodeオブジェクトのフラグは定義されていません。 |
| `RootIndex`         | 文字列    | Hash256   | このディレクトリーのルートオブジェクトのID。 |
| `Indexes`           | 配列     | Vector256 | このディレクトリーの内容: 他のオブジェクトのIDの配列。 |
| `IndexNext`         | 数値    | UInt64    | （省略可）このディレクトリーに複数のページが含まれている場合、このIDはチェーン内の次のオブジェクトにリンクし、末尾でラップアラウンドします。 |
| `IndexPrevious`     | 数値    | UInt64    | （省略可）このディレクトリーに複数のページが含まれている場合、このIDはチェーン内の前のオブジェクトにリンクし、先頭でラップアラウンドします。 |
| `Owner`             | 文字列    | AccountID | （所有者ディレクトリーのみ）このディレクトリー内のオブジェクトを所有するアカウントのアドレス。 |
| `ExchangeRate`      | 数値    | UInt64    | （オファーディレクトリーのみ）**廃止予定**。使用しないでください。 |
| `TakerPaysCurrency` | 文字列    | Hash160   | （オファーディレクトリーのみ）このディレクトリーのオファーのTakerPaysの額の通貨コード。 |
| `TakerPaysIssuer`   | 文字列    | Hash160   | （オファーディレクトリーのみ）このディレクトリーのオファーのTakerPaysの額のイシュアー。 |
| `TakerGetsCurrency` | 文字列    | Hash160   | （オファーディレクトリーのみ）このディレクトリーのオファーのTakerGetsの額の通貨コード。 |
| `TakerGetsIssuer`   | 文字列    | Hash160   | （オファーディレクトリーのみ）このディレクトリーのオファーのTakerGetsの額のイシュアー。 |

## ディレクトリー IDのフォーマット

DirectoryNodeのIDを作成するときには、DirectoryNodeが以下のどのページを表しているかに応じて3種類の方式があります。

* 所有者ディレクトリーの1番目のページ（ルートとも呼ばれます）
* オファーディレクトリーの1番目のページ
* いずれかのディレクトリーの以降のページ

**所有者ディレクトリーの1番目のページ**のIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* 所有者ディレクトリーのスペースキー（`0x004F`）
* `Owner`フィールドのAccountID。

**オファーディレクトリーの1番目のページ**には特殊なIDがあります。このIDの上位192ビットはオーダーブックを定義し、それ以降の64ビットはこのディレクトリー内のオファーの為替レートを定義します。（IDはビッグエンディアンであるため、最初に位置する上位ビットにブックが含まれ、後に位置する下位ビットにクオリティが含まれます。）これにより、最適なオファーから最低のオファーへの順にオーダーブックを反復できます。具体的には、先頭192ビットとは、以下の値がこの順序で連結されている[SHA-512ハーフ][]の先頭192ビットです。

* ブックディレクトリーのスペースキー（`0x0042`）
* `TakerPaysCurrency`の160ビットの通貨コード
* `TakerGetsCurrency`の160ビットの通貨コード
* `TakerPaysIssuer`のAccountID
* `TakerGetsIssuer`のAccountID

オファーディレクトリーのIDの下位64ビットは、そのディレクトリー内のオファーのTakerPaysの額をTakerGetsの額で割った結果を、XRP Ledgerの内部金額フォーマットの64ビット数値で表したものです。

**DirectoryNodeがディレクトリーの1番目のページではない場合**（所有者ディレクトリー、オファーディレクトリーのいずれの場合でも）、DirectoryNodeのIDは、以下の値をこの順序で連結した[SHA-512ハーフ][]です。

* DirectoryNodeスペースキー（`0x0064`）
* ルートDirectoryNodeのID
* このオブジェクトのページ番号（ルートDirectoryNodeは0であるため、この値は1以上の整数値です。）

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
