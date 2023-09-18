---
html: nftokenpage.html
parent: ledger-entry-types.html
blurb: NFTokenを記録するためのレジャー構造。
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenPage

`NFTokenPage` オブジェクトは、同じアカウントが所有する `NFToken` オブジェクトのコレクションを表します。一つのアカウントは複数の `NFTokenPage` 型のレジャーオブジェクトを持つことができ、それらは双方向リストを形成します。

_([NonFungibleTokensV1_1 amendment][]により追加されました)_


## {{currentpage.name}} JSONの例

```json
{
  "LedgerEntryType": "NFTokenPage",
  "PreviousTokenPage":
    "598EDFD7CF73460FB8C695d6a9397E907378C8A841F7204C793DCBEF5406",
  "PreviousTokenNext":
    "598EDFD7CF73460FB8C695d6a9397E9073781BA3B78198904F659AAA252A",
  "PreviousTxnID":
    "95C8761B22894E328646F7A70035E9DFBECC90EDD83E43B7B973F626D21A0822",
  "PreviousTxnLgrSeq":
    42891441,
  "NFTokens": [
    {
      "NFTokenID":
          "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
    },
    /* 更に多くのオブジェクト */
  ]
}
```



ページのサイズを最小にし、ストレージを最適化するために、`Owner`フィールドは存在しません。なぜなら、それはオブジェクトのレジャー識別子の一部としてエンコードされているからです。


## {{currentpage.name}} フィールド

`NFTokenPage` オブジェクトは、以下の必須フィールドと任意フィールドを持つことができます。


| 名前                | JSONの型   | [内部の型][] | 必須？ | 説明        |
|:--------------------|:----------|:-----------|:----------|:------------|
| `LedgerEntryType`   | 文字列    | UInt16      | はい   | レジャーオブジェクトのタイプを識別文字列です。予約されているレジャーの種類は、0x0050 です。|
| `NextPageMin`       | 文字列    | Hash256     | いいえ | 次のページの位置情報(もしあれば)。このフィールドの詳細および使用方法については、NFTokenPageID の構築についての説明以降に記載しています。|
| `NFTokens`          | オブジェクト  | TOKEN    | はい   | この NFTokenPage オブジェクトに含まれる NFToken オブジェクトのコレクション。本仕様では、1 ページあたり 32 の NFToken オブジェクトを上限としています。オブジェクトは、TokenID をソート パラメータとして使用して、低いものから高いものへとソートされた順序で格納されています。|
| `PreviousPageMin`   | 文字列    | Hash256     | いいえ | 前のページの位置情報(もしあれば)。このフィールドの詳細および使用方法については、NFTokenPageID の構築についての説明以降に記載しています。|
| `PreviousTxnID`     | 文字列    | HASH256     | いいえ | この NFTokenPage オブジェクトを最も最近変更したトランザクションのトランザクション ID の情報を示します。|
| `PreviousTxnLgrSeq` | 数値    | UInt32       | いいえ  | この NFTokenPage オブジェクトを最も最近変更したトランザクションを含むレジャーのシーケンスを示します。|


### TokenPage ID のフォーマット

`NFTokenPage` 識別子は、`NFTokens` に最適で、より効率的なページング構造を採用できるように特別に構築されています。

`NFTokenPage` の識別子は、そのページの所有者の 160 ビットの `AccountID` と、そのページに特定の `NFTokenID` が含まれるかどうかを示す 96 ビットの値を連結して得られます。

具体的には、関数 `low96(x)` が 256 ビットの値の下位 96 ビットを返すと仮定すると、`NFTokenID` `A` の NFT は `NFTokenPageID` `B` のページに含めることができるのは `low96(A) >= low96(B)` の場合のみとなります。

例えば、`000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65`というIDを持つ先ほどのNFTに`low96`関数を適用すると、`42540EE208C3098E00000D65`が返されます。

この不思議な構造は、SHAMap の構造を利用して、`NFTokenPages` の二重リンクされたリストを反復することなく、個々の `NFToken` オブジェクトを効率的に検索できるようにするものです。


### `NFToken` オブジェクトの検索

特定の `NFToken` を検索するには、上記のように所有者のアカウントとトークンの `NFTokenID` を使用して `NFTokenPageID` を計算します。識別子がその値以下であるレジャーの項目を検索します。そのエントリーが存在しないか、`NFTokenPage` でない場合、`NFToken` は与えられたアカウントによって保持されていません。


### `NFToken` オブジェクトの追加

`NFToken` オブジェクトを追加するには、そのオブジェクトが含まれるべき `NFTokenPage` を見つけ（`NFToken` オブジェクトを検索するのと同じテクニックを使用します)、そのページに追加します。`NFToken` を追加した後にページがオーバーフローした場合は、 `next` と `previous` ページを探し (もしあれば)、その 3 ページでバランスをとりながら、必要に応じて新しいページを挿入します。


### `NFToken` オブジェクトの削除

`NFToken` は同じ手法で削除することもできます。ページ内の `NFToken` の数がある閾値を下回ると、サーバーはそのページを前後のページと統合して準備金を取り戻そうとします。


### `NFTokenPage` オブジェクトの準備金

`NFTokenPage`ごとに、所有者アカウントに追加で準備金の費用がかかります。つまり、複数のNFTを保有するアカウントでは、NFTあたりの _実効_ 準備金コストは _R_ /32（ _R_ は準備金増分）と低くすることが可能です。


### 準備金の実例

増分準備金の値は、この記事の執筆時点では 2 XRP です。下の表は、あるページが1、8、16、32のNFTを含む場合、トークンごとの _実効_準備金がどの程度になるかを示しています。


| 増分準備金            | 1 NFToken | 8 NFTokens | 16 NFTokens | 32 NFTokens | 64 NFTokens |
|:--------------------|:----------|:-----------|:------------|:------------|:------------|
| 5 XRP               | 5 XRP     | 0.625 XRP  | 0.3125 XRP  | 0.15625 XRP | 0.07812 XRP |
| 2 XRP               | 2 XRP     | 0.25 XRP   | 0.125 XRP   | 0.0625 XRP  | 0.03125 XRP |
| 1 XRP               | 1 XRP     | 0.125 XRP  | 0.0625 XRP  | 0.03125 XRP | 0.01562 XRP |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
