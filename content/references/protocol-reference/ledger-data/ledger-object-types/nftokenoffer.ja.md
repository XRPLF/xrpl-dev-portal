---
html: nftokenoffer.html
parent: ledger-object-types.html
blurb: NFTを売買するオファーを作成する。
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenOffer

`lsfTransferable` フラグが設定されているトークンは、オファーを使って 参加者間で転送することができます。`NFTokenOffer` オブジェクトは `NFToken` オブジェクトの購入、売却、または譲渡のオファーを表します。`NFToken` の所有者は `NFTokenCreateOffer` を使用して売買を行うことができます。

_([NonFungibleTokensV1_1 amendment][]が必要です)_


### `NFTokenOfferID`のフォーマット

`NFTokenOffer` オブジェクトのユニーク ID (`NFTokenOfferID`) は、以下の値を順番に結合したものである。



* `NFTokenOffer` のスペースキー、`0x0074` 
* オファーを出すアカウントの `AccountID`
* `NFTokenCreateOffer` トランザクションが生成する `Sequence` (または `Ticket`)


### `NFTokenOffer`のフィールド

| 名前                | JSONの型     | [内部の型][]        | 必須？ | 説明        |
|:--------------------|:------------|:------------------|:------|:-----------|
| `Amount`            | [通貨額][]   | AMOUNT            | はい   | NFTokenに対して見込まれる、または提示される金額です。トークンに `lsfOnlyXRP` フラグが設定されている場合、金額は XRP で指定する必要があります。XRP 以外の資産を指定する売却オファーは、0 以外の金額を指定する必要があります。XRP を指定する売却オファーは、`無料`にすることができます（つまり、このフィールドは `"0"` とすることができます）。 |
| `Destination`       | 文字列       | AccountID         | いいえ | このオファーの対象となるAccountID。存在する場合、そのアカウントのみがオファーを受け入れることができます。 |
| `Expiration`        | 数値         | UInt32            | いいえ | オファーが有効でなくなる時刻。値は、リップルエポックからの秒数です。 |
| `Flags`             | 数値         | UInt32            | はい   | このオブジェクトに関連付けられたフラグのセットで、様々なオプションや設定を指定するために使用されます。フラグは、以下の表に示すとおりです。 |
| `LedgerEntryType`   | 文字列       | UInt16            | はい   | レジャーオブジェクトの種類を示します（0x0074）。 |
| `NFTokenID`         | 文字列       | Hash256           | はい   | このオファーが参照する NFToken オブジェクトの NFTokenID。 |
| `NFTokenOfferNode`  | 文字列       | UInt64            | いいえ | トークン購入または売却のオファーディレクトリの中で、このトークンが記録されている内部的な台帳です。このフィールドを使用することで、オファーを効率的に削除することができます。 |
| `Owner`             | 文字列       | AccountID         | はい   | オファーの作成者であり、所有者であるアカウント。NFToken の現在の所有者のみが NFToken の売却オファーを作成できますが、NFToken の購入オファーはどのアカウントでも作成できます。 |
| `OwnerNode`         | 文字列       | UInt64            | いいえ | このトークンが記録されているオーナーディレクトリ内のページを示す、内部的な台帳です。このフィールドを使用することで、オファーを効率的に削除することができます。 |
| `PreviousTxnID`     | 文字列       | Hash256           | はい   | このオブジェクトを最も最近更新したトランザクションの識別ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値         | UInt32            | はい   | このオブジェクトを最も最近更新したトランザクションを含むレジャーのインデックス。 |



#### NFTokenOffer フラグ


|フラグ名|フラグ値|説明|
|---|---|---|
| `lsfSellNFToken `| `0x00000001` | 有効な場合、オファーは売却オファーとなります。そうでない場合、オファーは購入オファーとなります。 |

## `NFTokenOffer` トランザクション

XRPL上のトークン・オファーは、オーダーブックに品質順に保存され、オンレジャーのメカニズムによって自動的にマッチングされます。`NFTokenOffer`はオーダーブックに保存されず、自動的にマッチングされたり実行されたりすることはありません。

購入者は `NFToken` の購入を申し出る `NFTokenOffer` を受け入れるかどうかを明示的に選択しなければなりません。同様に、販売者は自分が所有する `NFToken` オブジェクトの購入を申し出る特定の `NFTokenOffer` を受け入れることを明示的に選択する必要があります。


定義されたトランザクションは3つあります。



1. `NFTokenCreateOffer`


2. `NFTokenCancelOffer`


3. `NFTokenAcceptOffer`


### `NFTokenOffer` オブジェクトの検索

各トークンには、2つのディレクトリがあります。1 つはトークンを購入するためのオファー、もう 1 つはトークンを売却するためのオファーが含まれています。これにより、特定のトークンの `NFTokenOffer` を簡単に見つけることができます。オフレッジャー システムが、オファーの取得、提示、通知、作成、照会、承認、キャンセルに使用されることが予想されます。たとえば、マーケットプレイスは、ウェブやアプリベースの直感的なインターフェースをユーザに提供することができます。


### `NFTokenOffer` の準備金

各NFTokenOfferオブジェクトは、オファーを出すアカウントに準備金の増額を1つ要求します。この記事の執筆時点では、準備金の増分は2 XRPです。この準備金は、オファーをキャンセルすることで 取り戻すことができます。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
