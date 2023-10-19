---
html: non-fungible-tokens.html
parent: tokens.html
blurb: XRPL NFTの紹介。
labels:
 - Non-fungible Tokens, NFTs
---

# NFTのコンセプトの概要

XRP Ledgerは、_IOUs_ としても知られる[発行済み通貨](tokens.html)のサポートを提供しています。このような資産は、主に、代替可能(Fungible)です。

> 代替可能性
>
> 1. 個々の単位が本質的に交換可能であり、各部分が別の部分と区別できない商品または商品の特性である

代替可能トークンは、XRP Ledgerの分散型取引所において、ユーザー間でXRPや他の発行済み通貨と手軽に交換することができます。そのため、決済に適しています。


例えば、切手などがそうです。1919年当時、あなたが航空便で手紙を送る必要がある場合、24セントの切手を購入し、封筒に張ったでしょう。もしその切手をなくしてしまったら、別の24セント切手を使うか、10セント切手2枚と2セント切手2枚を使うことができます。非常に使い勝手がいいのです。

![Jenny Stamps](img/nft-concepts1.png "Jenny Stamps")

しかし、1919年という時代のことですから、切手の飛行機が偶然にも逆さまに印刷されている24セントの航空郵便切手が出回るかもしれません。これが世界的に有名な「インバート・ジェニー」切手です。1枚の切手シートで100枚しか流通しなかったため、非常に希少で人気の高い切手です。現在、鑑定では一枚150万円以上の価値があるとされています。

![Jenny Stamps](img/nft-concepts2.png "Jenny Stamps")

これらの切手は、他の24セント切手と交換することはできません。非代替(Non-fungible)になってしまったのです。

[NonFungibleTokensV1の修正][] :現在有効ではありません: は、XRP Ledgerに非代替性トークン（NFT）のサポートをネイティブで追加するものです。 非代替性トークンは、芸術品やゲーム内アイテムなど、ユニークな物理的、非物理的、あるいは純粋なデジタル商品の所有権をコード化する役割を果たします。


## XRP Ledger上のNFT

XRP Ledger上では、non-fungible tokenは[NFToken][]オブジェクトとして表されます。NFTokenはユニークで分割できない単位で、決済には使用できません。ユーザーはこのようなトークンを発行（作成）、保有、購入、売却、焼却（破棄）することができます。

XRP Ledgerでは、容量を節約するために、一つのアカウントで最大32個の `NFToken` オブジェクトを一つの[NFTokenPageオブジェクト][]に格納します。その結果、所有者の `NFToken` オブジェクトに対する [準備金] (reserves.html) は、追加のトークンを格納するためにレジャーが新しいページを作成する場合にのみ増加します。

また、アカウントは、自分に代わってNFTokenオブジェクトを発行・販売するブローカー（代理発行者）を指定することができます。

`NFToken` オブジェクトは、トークンが発行された時点で確定し、後で変更することが出来ない設定項目を持ちます。これらは以下の通りです。

- トークンを一意に定義する各種識別データ。
- 発行者が、現在の保有者に関係なく、トークンを焼却できるかどうか。
- トークンの保持者がトークンを他者に転送できるかどうか。( `NFToken` は常に発行者に直接送信したり、発行者から送信することが可能です)。
    - 転送が許可されている場合、発行者は販売価格に対する一定の割合で手数料を徴収することができます。
- NFTokenを[発行済み通貨](tokens.html)で売却できるか、XRPのみでしか売却できないか。


## `NFToken`のライフサイクル

誰もが [NFTokenMint トランザクション][] を使って新しい `NFToken` を作成することができます。`NFToken` は発行者アカウントの [NFTokenPage オブジェクト][] に格納されます。所有者または利害関係者は [NFTokenCreateOffer トランザクション][]を送信して `NFToken` の売買を提案できます。レジャーは提案された転送を [NFTokenOffer オブジェクト][]として追跡し、一方が承諾またはキャンセルすると `NFTokenOffer` を削除します。`NFToken` が転送可能であれば、アカウント間で複数回取引することができます。

[NFTokenBurn トランザクション][] を使用して、自分が所有する `NFToken` を破棄することができます。発行者が `tfBurnable` フラグを有効にしてトークンを発行した場合、発行者は現在の所有者に関係なくトークンを破棄することが可能です。( 例えば、あるイベントのチケットを表すトークンである場合、そのチケットをある時点で消費するといった場合に便利です)。

![The NFT Lifecycle](img/nft-lifecycle.png "NFT Lifecycle Image")

`NFToken` オブジェクトの転送に関する詳細は、[XRP Ledger上でNFTokenを売買する](non-fungible-token-transfers.html) を参照してください。


## 関連項目

- [NFToken][] データ型
- レジャーオブジェクト
    - [NFTokenOffer オブジェクト][]
    - [NFTokenPage オブジェクト][]
- トランザクション
    - [NFTokenMint トランザクション][]
    - [NFTokenCreateOffer トランザクション][]
    - [NFTokenCancelOffer トランザクション][]
    - [NFTokenAcceptOffer トランザクション][]
    - [NFTokenBurn トランザクション][]
- API メソッド
    - [account_nfts メソッド][]
    - [nft_sell_offers メソッド][]
    - [nft_buy_offers メソッド][]
    - [nft_info メソッド][] (Clioサーバのみ)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
