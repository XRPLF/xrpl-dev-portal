---
html: nftoken.html
parent: basic-data-types.html
blurb: XRPL NFTの紹介
labels:
  - Non-fungible Tokens, NFTs
---
# NFToken

`NFToken` オブジェクトは、1つの非代替性トークン (NFT) を表します。単体では保存されず、他の NFT と共に [NFTokenPage オブジェクト][] に格納されます。

{{currentpage.name}} JSONの例

```json
{
    "TokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
    "URI": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"
}
```


他のオブジェクトとは異なり、`NFToken` にはオブジェクトの種類や現在の所有者を特定するためのフィールドはありません。NFToken オブジェクトは、オブジェクトの種類と所有者を暗黙的に定義する `NFTokenPages` にグループ化されています。

_([NonFungibleTokensV1_1 amendment][]が必要です)_


## トークンID

トークンID, 任意, 文字列, Hash256

この複合フィールドは、トークンを一意に識別するものであり、以下のセクションから構成されます。

1. NFT固有のフラグや設定を識別する16ビット
2. このトークンに関連する送金手数料がある場合、それをコード化する16ビット
3. 発行者の160ビットのアカウント識別子
4. 32 ビットの発行者が指定する[分類群](https://www.merriam-webster.com/dictionary/taxon)
5. （自動生成される）単調増加する32ビットのシーケンス番号


![トークンIDの内訳](img/nftoken1.png "トークンIDの内訳")


16 ビットのフラグ、転送料フィールド、32 ビットのタクソン、シーケンス番号フィールドはビッグエンディアン 形式で格納されます。


## NFToken フラグ

フラグは、`NFToken` オブジェクトに関連するプロパティやその他のオプションです。


<table>
  <tr>
   <td><strong>フラグ名</strong>
   </td>
   <td><strong>フラグ値</strong>
   </td>
   <td><strong>説明</strong>
   </td>
  </tr>
  <tr>
   <td><code>lsfBurnable</code>
   </td>
   <td><code>0x0001</code>
   </td>
   <td>設定されている場合、発行者（または発行者が許可したエンティティ）がオブジェクトを破棄できることを示します。オブジェクトの所有者は<em>常に</em>破棄することができます。
   </td>
  </tr>
  <tr>
   <td><code>lsfOnlyXRP</code>
   </td>
   <td><code>0x0002</code>
   </td>
   <td>設定されている場合、トークンはXRPに対してのみオファーまたは売却できることを示します。
   </td>
  </tr>
  <tr>
   <td><code>lsfTrustLine</code>
   </td>
   <td><code>0x0004</code>
   </td>
   <td>設定されている場合、発行者がトラストラインを自動的に作成することを望んでいることを示します。<code>lsfTrustLine</code> フィールドは、トークンが XRP 以外の資産で販売される可能性があり、発行者が <code>送金手数料</code>を請求する場合に有用です。フラグが設定されている場合、発行者が適切な送金手数料を受け取るために、必要に応じてトラストラインが自動的に作成されます。フラグが設定されていない場合、発行者がトラストラインを持たないアセットに対するNFTokeの譲渡は失敗します。
   </td>
  </tr>
  <tr>
   <td><code>lsfTransferable</code>
   </td>
   <td><code>0x0008</code>
   </td>
   <td>設定されている場合、この NFT が転送可能であることを示します。このフラグは、トークンが<em>発行者から転送</em>される場合、または<em>発行者に転送</em>される場合には、何の効果もありません。
   </td>
  </tr>
  <tr>
   <td><code>lsfReservedFlag</code>
   </td>
   <td><code>0x8000</code>
   </td>
   <td>本提案では、このフラグを将来の使用に備えて確保します。このフラグを設定しようとすると失敗します。
   </td>
  </tr>
</table>


`NFToken` フラグ は不変です。 `NFTokenMint` トランザクション中にのみ設定可能で、後で変更することはできません。


### 例

この例では、lsfBurnable (0x0001), lsfOnlyXRP (0x0002), lsfTransferable (0x0008) の3つのフラグを設定しています。1+2+8 = 11、つまりビッグエンディアン形式で0x000Bです。

![フラグ](img/nftokena.png "フラグ")


### 送金手数料

送金手数料には、トークンの二次販売時に発行者が請求する手数料を1/100,000単位で指定します。このフィールドの有効な値は0から50,000までです。1の値は1bpsまたは0.01%に相当し、0%から50%の間の転送レートを許容します。


### 例

この値では、転送手数料は31.4bps（0.314％）に設定されます。

![送金手数料](img/nftokenb.png "送金手数料")



### 発行者識別

TokenIDの3番目のセクションは、発行者の公開アドレスをビッグ・エンディアンで表現したものである。

![発行者アドレス](img/nftokenc.png "発行者アドレス")



### 分類群

4番目のセクションは、発行者が作成する分類群です。

![分類群](img/nftokend.png "分類群")

発行者は同じ分類群を持つ複数のNFTを発行する可能性があります。NFTが複数のページにまたがるようにするため、分類群は第5セクションの連番を乱数発生器のシード値としてスクランブルされています。スクランブルされた値は `NFToken` と共に保存されるが、スクランブルされていない値が実際の分類群となります。

![連番](img/nftokene.png "連番")

スクランブルされた分類群は `0xBC8B858E` であることに注意してください。発行者が指定したスクランブルされた分類群のバージョンです。しかし、 _実際の_ 分類群の値はスクランブルされていない値です。

### トークン連番

5番目のセクションは、発行者が `NFToken` を作成するたびに増加するシーケンス番号です。[NFTokenMint トランザクション][] では `NFTokenID` のこの部分を `Issuer` アカウントの `MintedTokens` フィールドを基に自動的に設定します。発行者の [AccountRoot オブジェクト][] が `MintedTokens` フィールドを持っていない場合、そのフィールドは値 0 と見なされます。


## URI

URIフィールドは、`NFToken`に関連するデータおよび/またはメタデータを指します。このフィールドはHTTPやHTTPSのURLである必要はありません。IPFS URIや紐づくリンク、RFC2379 ["data" URL](https://datatracker.ietf.org/doc/html/rfc2397) としてエンコードされた即値、あるいは不透明な発行者固有のエンコーディングである可能性もあります。URIの有効性はチェックされませんが、フィールドの長さは最大256バイトに制限されます。

この方式の欠点は、値が不変であるため、発行者がデータを永続的に保持する必要があることです。


# `NFToken` データとメタデータの取得

機能を犠牲にしたり不必要な制限を課したりすることなく`NFTokens`の容量を最小にするために、XRPL NFTは任意のデータフィールドを持ちません。その代わり、データは別に管理され、`NFToken`によって参照されます。URI は `Hash` に対して不変のコンテンツへの参照を提供し、`NFToken` オブジェクトに対しては任意の変更可能なデータを提供します。

`URI` フィールドは、従来とは異なるピアツーピア (P2P) URL を参照する際に特に有用です。例えば、惑星間ファイルシステム (IPFS) を使用して `NFToken` データやメタデータを保存する `minter` は、 `URI` フィールドを使用して IPFS 上のデータを様々な方法で参照することができ、それぞれが異なるユースケースに適しています。NFTデータの保存に使用できるIPFSリンクの種類については、[Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/#types-of-ipfs-links-and-when-to-use-them)を参照してください。

URI の代わりに、`NFToken` オブジェクトの発行者が発行者アカウントの `Domain` フィールドに正しいドメインを設定し、特定の `NFToken` に関連するデータやメタデータを検索したいクライアントに対して API を提供する方法があります。このメカニズムを使用するには、 `minter` がドメイン名を取得し、その発行アカウントにドメイン名を設定する必要があります。しかし、 `minter` がこのデータを照会するためのサーバーやその他のサービスを運営する必要はありません。

実装では、まず `URI` フィールドが存在するかどうかを調べて、関連するデータやメタデータを取得することを試みるべきです。`URI` フィールドが存在しない場合、実装は `Domain` フィールドの存在を確認する必要があります。どちらのフィールドも存在しない場合は、何も起こりません。実装では、URIからのHTTPリダイレクト（例えば、HTTPレスポンス301、302、307、308を使用）を処理できるように準備しておく必要があります。


## TXTレコードの形式

TXTレコードのフォーマットは以下の通りです。


```
xrpl-nft-data-token-info-v1 IN TXT "https://host.example.com/api/token-info/{tokenid}"
```


情報を問い合わせようとしたときに、文字列 `{tokenid}` を要求されたトークンの `NFTokenID` (64バイトの16進文字列) に置き換えてください。

実装では、`TXT`レコードの存在を確認し、存在すればそれらのクエリ文字列を使用する必要があります。文字列が存在しない場合、実装はデフォルトの URL を使用するように試みるべきです。ドメインが _example.com_ であると仮定すると、デフォルトのURLは次のようになります。


```
https://example.com/.well-known/xrpl-nft/{tokenid}
```


`NFTokenMint` トランザクションを使用して NFT を作成します。`NFTokenBurn` トランザクションを使用して NFToken を破棄することもできます。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
