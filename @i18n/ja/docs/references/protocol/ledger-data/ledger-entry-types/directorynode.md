---
html: directorynode.html
parent: ledger-entry-types.html
seo:
    description: 他のオブジェクトへのリンクを含みます。
labels:
  - 分散型取引所
  - データ保持
---
# DirectoryNode
[[ソース]](https://github.com/XRPLF/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L44 "Source")

`DirectoryNode`オブジェクトタイプは、レジャーの状態ツリー内の他オブジェクトへのリンクのリストを提供します。概念上の1つの _ディレクトリ_ は、1つ以上の各DirectoryNodeオブジェクトが含まれる二重リンクリストの形式になっています。各DirectoryNodeオブジェクトには、他オブジェクトの[ID](../common-fields.md)が最大32個まで含まれています。1番目のオブジェクトはディレクトリのルートと呼ばれ、ルートオブジェクト以外のオブジェクトはすべて必要に応じて自由に追加または削除できます。

2種類のディレクトリがあります。

* **所有者ディレクトリ**は、アカウントが所有するその他のオブジェクト（`RippleState`オブジェクトや`Offer`オブジェクトなど）をリストします。
* **オファーディレクトリ**は、分散型取引所で利用可能なオファーをリストします。1つのオファーディレクトリには、同一イシュアンスに同一為替レートが設定されているすべてのオファーが含まれます。

## {% $frontmatter.seo.title %}のJSONの例

{% tabs %}

{% tab label="オファーディレクトリ" %}
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
{% /tab %}

{% tab label="所有者ディレクトリ" %}
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
{% /tab %}

{% /tabs %}

## {% $frontmatter.seo.title %}のフィールド

| 名前                | JSONの型   | [内部の型][] | 必須? | 説明 |
|---------------------|-----------|------------|:------|-------------|
| `ExchangeRate`      | 数値      | UInt64      | いいえ | （オファーディレクトリのみ）**廃止予定**。使用しないでください。 |
| `Flags`             | 数値      | UInt32      | はい  | このディレクトリに対して有効になっているブール値フラグのビットマップ。現在、プロトコルではDirectoryNodeオブジェクトのフラグは定義されていません。 |
| `Indexes`           | 配列      | Vector256   | はい  | このディレクトリの内容: 他のオブジェクトのIDの配列。 |
| `IndexNext`         | 数値      | UInt64      | いいえ | （省略可）このディレクトリに複数のページが含まれている場合、このIDはチェーン内の次のオブジェクトにリンクし、末尾でラップアラウンドします。 |
| `IndexPrevious`     | 数値      | UInt64      | いいえ | （省略可）このディレクトリに複数のページが含まれている場合、このIDはチェーン内の前のオブジェクトにリンクし、先頭でラップアラウンドします。 |
| `LedgerEntryType`   | 文字列    | UInt16      | はい  | 値が`0x0064`（文字列`DirectoryNode`にマッピング）の場合は、このオブジェクトがディレクトリの一部であることを示します。 |
| `Owner`             | 文字列    | AccountID   | いいえ | （所有者ディレクトリのみ）このディレクトリ内のオブジェクトを所有するアカウントのアドレス。 |
| `RootIndex`         | 文字列    | Hash256     | はい  | このディレクトリのルートオブジェクトのID。 |
| `TakerGetsCurrency` | 文字列    | Hash160     | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerGetsの額の通貨コード。 |
| `TakerGetsIssuer`   | 文字列    | Hash160     | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerGetsの額のイシュアー。 |
| `TakerPaysCurrency` | 文字列    | Hash160     | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerPaysの額の通貨コード。 |
| `TakerPaysIssuer`   | 文字列    | Hash160     | いいえ | （オファーディレクトリのみ）このディレクトリのオファーのTakerPaysの額のイシュアー。 |


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。


## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは準備金が不要です。


## ディレクトリ IDのフォーマット

DirectoryNodeのIDを作成するときには、DirectoryNodeが以下のどのページを表しているかに応じて3種類の方式があります。

* 所有者ディレクトリの1番目のページ（ルートとも呼ばれます）
* オファーディレクトリの1番目のページ
* いずれかのディレクトリの以降のページ

**所有者ディレクトリの1番目のページ**のIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* 所有者ディレクトリのスペースキー（`0x004F`）
* `Owner`フィールドのAccountID。

**オファーディレクトリの1番目のページ**には特殊なIDがあります。このIDの上位192ビットはオーダーブックを定義し、それ以降の64ビットはこのディレクトリ内のオファーの為替レートを定義します。（IDはビッグエンディアンであるため、最初に位置する上位ビットにブックが含まれ、後に位置する下位ビットにクオリティが含まれます。）これにより、最適なオファーから最低のオファーへの順にオーダーブックを反復できます。具体的には、先頭192ビットとは、以下の値がこの順序で連結されている[SHA-512ハーフ][]の先頭192ビットです。

* ブックディレクトリのスペースキー（`0x0042`）
* `TakerPaysCurrency`の160ビットの通貨コード
* `TakerGetsCurrency`の160ビットの通貨コード
* `TakerPaysIssuer`のAccountID
* `TakerGetsIssuer`のAccountID

オファーディレクトリのIDの下位64ビットは、そのディレクトリ内のオファーのTakerPaysの額をTakerGetsの額で割った結果を、XRP Ledgerの内部金額フォーマットの64ビット数値で表したものです。

**DirectoryNodeがディレクトリの1番目のページではない場合**（所有者ディレクトリ、オファーディレクトリのいずれの場合でも）、DirectoryNodeのIDは、以下の値をこの順序で連結した[SHA-512ハーフ][]です。

* DirectoryNodeスペースキー（`0x0064`）
* ルートDirectoryNodeのID
* このオブジェクトのページ番号（ルートDirectoryNodeは0であるため、この値は1以上の整数値です。）

{% raw-partial file="/docs/_snippets/common-links.md" /%}
