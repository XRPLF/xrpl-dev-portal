---
html: nftoken.html
parent: basic-data-types.html
seo:
    description: XRPL NFTの紹介
labels:
  - 非代替性トークン, NFT
---
# NFToken

`NFToken`オブジェクトは、1つの非代替性トークン(NFT)を表します。単体では保存されず、他の`NFToken`オブジェクトと共に[NFTokenPage オブジェクト][]に格納されます。

_([NonFungibleTokensV1_1 amendment][]により追加されました。)_

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "TokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
    "URI": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"
}
```

通常の[レジャーエントリ](../ledger-data/ledger-entry-types/index.md)とは異なり、`NFToken`にはオブジェクトのタイプや現在の所有者を特定するフィールドはありません。`NFToken`オブジェクトは、そのオブジェクトのタイプを暗黙的に定義し、所有者を特定するページにグループ化されます。


## NFTokenID


NFTokenID, 任意, 文字列, Hash256

この複合フィールドは、トークンを一意に識別するものであり、以下のセクションから構成されます。

A) 16ビットのNFTokenのフラグや設定の識別子

B) 16ビットのNFTokenに関連する送金手数料のエンコード化された値(送金手数料が設定されている場合)

C) 160ビットの発行者のアカウント識別子

D) 32ビットの発行者が指定する[`NFTokenTaxon`](https://www.merriam-webster.com/dictionary/taxon)

E) 32ビットの（自動生成される）単調増加するシーケンス番号

![トークンIDの内訳](/docs/img/nftoken1.png "トークンIDの内訳")

16ビットのフラグ、送金手数料フィールド、32ビットの`NFTokenTaxon`、シーケンス番号フィールドはビッグエンディアン形式で格納されます。

## NFToken フラグ

フラグは、`NFToken`オブジェクトに関連するプロパティやその他のオプションです。


| フラグ名           | フラグ値     | 説明                                 |
|:------------------|:-----------|:--------------------------------------------|
| `lsfBurnable`     | `0x0001`   | 設定されている場合、発行者（または発行者が許可したエンティティ）が`NFToken`を破棄できることを示します。オブジェクトの所有者は常に破棄することができます。 |
| `lsfOnlyXRP`      | `0x0002`   | 設定されている場合、`NFToken`はXRPに対してのみオファーまたは売却できることを示します。 |
| `lsfTrustLine`    | `0x0004`   | **廃止** 設定されている場合、送金手数料を保持するための[トラストライン](../../../concepts/tokens/fungible-tokens/index.md)を自動的に作成します。設定されていない場合、発行者がそのトークンのトラストラインを持っていない場合、この`NFToken`をそのトークンで売買することは失敗します。[fixRemoveNFTokenAutoTrustLine amendment][]により、このフラグは利用できなくなります。|
| `lsfTransferable` | `0x0008`   | 設定されている場合、この`NFToken`は所有者から別の所有者に転送することができます。設定されていない場合、所有者は発行者との間でのみ譲渡が可能です。 |
| `lsfReservedFlag` | `0x8000`   | 将来の使用に備えて確保されています。このフラグを設定しようとすると失敗します。 |

`NFToken`のフラグは変更できません。[NFTokenMint トランザクション][]でのみ設定可能で、後で変更することはできません。

### 例

この例では、`lsfBurnable`(`0x0001`), `lsfOnlyXRP`(`0x0002`), `lsfTransferable`(`0x0008`)の3つのフラグを設定しています。1+2+8 = 11、つまりビッグエンディアン形式で`0x000B`です。

![フラグ](/docs/img/nftokena.png "フラグ")


### 送金手数料

`TransferFee`には、トークンの二次販売時に発行者が請求する手数料を1/100,000単位で指定します。このフィールドの有効な値は0から50,000までです。1の値は1bpsまたは0.01%に相当し、0%から50%の間の送金手数料が設定可能です。

### 例

この値では、転送手数料は31.4bps（0.314％）に設定されます。

![送金手数料](/docs/img/nftokenb.png "送金手数料")

### 発行者の識別

`NFTokenID`の3番目のセクションは、発行者のアドレスをビッグエンディアンで表現したものです。

![発行者アドレス](/docs/img/nftokenc.png "発行者アドレス")

### NFTokenTaxon(分類群)


4番目のセクションは、発行者が指定する`NFTokenTaxon`です。

![`NFTokenTaxon` の概要図](/docs/img/nftokend.png)

発行者は同じ`NFTokenTaxon`を持つ複数の`NFToken`を発行する可能性があります。`NFToken`が複数のページにまたがるようにするため、`NFTokenTaxon`は第5セクションの連番を乱数発生器のシード値として乱数化されています。乱数化された値は`NFToken`と共に保存されますが、乱数化されていない値が実際の`NFTokenTaxon`となります。

`NFTokenTaxon`の値は`0xBC8B858E`ですが、これは発行者が指定した`NFTokenTaxon`の値が乱数化されたものであることに注意してください。`NFTokenTaxon`の実際の値は _乱数化されていない_ 値です。

### トークン連番

5番目のセクションは、発行者が`NFToken`を作成するたびに増加するシーケンス番号です。

![シーケンス番号](/docs/img/nftokene.png "シーケンス番号")

[NFTokenMint トランザクション][]では`NFTokenID`のこのフィールドを`Issuer`アカウントの`MintedNFTokens`フィールドを基に自動的に設定します。発行者の[AccountRoot オブジェクト][]が`MintedNFTokens`フィールドを持っていない場合、そのフィールドは値 0 と見なされます。フィールドの値は1ずつ増加します。

## URI

URIフィールドは、`NFToken`に関連するデータまたはメタデータを指します。このフィールドはHTTPやHTTPSのURLである必要はありません。IPFS URIや紐づくリンク、[RFC2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397)、あるいはカスタムされたのエンコード値である可能性もあります。URIの有効性はチェックされませんが、フィールドの長さは最大256バイトに制限されます。

**注意:** URIは変更不可能であるため、例えば、存在しないウェブサイトにリンクしていたとしても、誰もそれを更新することはできません。

# NFTokenデータとメタデータの取得

機能を犠牲にしたり不必要な制限を課したりすることなく`NFTokens`の容量を最小にするために、XRPL NFTは任意のデータフィールドを持ちません。その代わり、データは別に管理され、`NFToken`によって参照されます。URIは`Hash`に対して不変のコンテンツへの参照を提供し、`NFToken`オブジェクトに対しては任意の変更可能なデータを提供します。

`URI`フィールドは、従来とは異なるピアツーピア(P2P)URLを参照する際に特に有用です。例えば、惑星間ファイルシステム(IPFS)を使用して`NFToken`データやメタデータを保存する発行者は、`URI`フィールドを使用してIPFS上のデータを様々な方法で参照することができ、それぞれが異なるユースケースに適しています。NFTデータの保存に使用できるIPFSリンクの種類については、[Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/#types-of-ipfs-links-and-when-to-use-them)をご覧ください。

## TXTレコードの形式

TXTレコードのフォーマットは以下の通りです。

```
xrpl-nft-data-token-info-v1 IN TXT "https://host.example.com/api/token-info/{tokenid}"
```

情報を問い合わせようとしたときに、文字列`{tokenid}`をリクエストされたトークンの`NFTokenID`(64バイトの16進文字列)に置き換えてください。

実装では、`TXT`レコードの存在を確認し、存在すればそれらのクエリ文字列を使用する必要があります。文字列が存在しない場合、実装はデフォルトのURLを使用するように試みるべきです。ドメインが _example.com_ であると仮定すると、デフォルトのURLは次のようになります。

```
https://example.com/.well-known/xrpl-nft/{tokenid}
```

`NFTokenMint`トランザクションを使用して`NFToken`を作成します。`NFTokenBurn`トランザクションを使用して`NFToken`を破棄することもできます。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
