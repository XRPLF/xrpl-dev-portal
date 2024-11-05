---
html: authorized-minter.html
parent: nft-mkt-overview.html
seo:
    description: 他のアカウントのためにNFTをミントし、販売する。
labels:
  - Tokenization
---
# 認可Minter

_私は認可Minterとして、トークン発行者のために合意されたレートでトークンをミントし、トークンを売却して利益を得て、ロイヤリティを発行者に還元したいのです。_

トークン発行者の認可Minterとして動作することができます。この場合、あなたはNFTokenを所有しますが、ロイヤリティはNFTokenの発行者が受け取ります。そのNFTokenを売却する場合、最初の売却益はあなたに入ります。発行者と合意の上、初回売却額の一部または全部を発行者に支払うことができます。

チュートリアル[認可Minterの割り当て](../../tutorials/javascript/nfts/assign-an-authorized-minter.md)で詳しく説明されています。

[![認可Minterのフロー](/docs/img/nft-mkt-auth-minter.png "認可Minterのフロー")](/docs/img/nft-mkt-auth-minter.png)

## rippledインスタンスのセットアップ

取引量の多い本格的なマーケットプレイスサイトを立ち上げる場合、独自のXRP Ledgerサーバインスタンスを立ち上げるという判断が当然となります。[rippledのインストール](../../infrastructure/installation/index.md)をご覧ください。

## マーケットプレイスのセットアップ

NFTを自分で設計するのではなく、NFTクリエイターと連携して認可Minterとなり、NFTの生成を代行することができます。これにより、NFTクリエイターは新しいNFTの生成に専念でき、あなたはNFTのミントと販売を担当することができます。[認可Minter](../../concepts/tokens/nfts/authorizing-another-minter.md)をご覧ください。

NFTの作成を終了すると、作成者は認可Minterの権限を取り消し、NFTに対する権限を取り戻すことができます。また、NFTの販売を行うマーケットプレイスにトークンを譲渡することもできます。あなたは、売りオファーと買いオファーのマッチングを行うブローカーとして機能することができます。[NFTオークションの実行](../../concepts/tokens/nfts/running-an-nft-auction.md)をご覧ください。

他のアカウントに代わって最初のNFTをミントする場合は、[他アカウントからのNFTミントを許可する](../../tutorials/javascript/nfts/assign-an-authorized-minter.md)をご覧ください。

発行者として将来的にトークンをバーンできるようにしたい場合は、`Flags`フィールドを _1_ に設定します。NFTを譲渡可能にするには、`Flags`フィールドを _8_ に設定します。NFTをバーン可能かつ譲渡可能にするには、`Flags`フィールドを _9_ に設定します。[Burnableフラグ](../../references/protocol/data-types/nftoken.md#nftoken-flags)および[Transferableフラグ](../../references/protocol/data-types/nftoken.md#nftoken-flags)をご覧ください。

<code>transfer fee</code>を設定することで、将来の取引からロイヤリティを徴収することができます。これは販売価格の0～50%を表す0～50000の値です。[NFTの取引手数料](../../references/protocol/data-types/nftoken.md#transferfee)をご覧ください。

NFTokenのURLは、NFTのコンテンツが保存されている場所へのリンクです。IPFSアカウントを作成し、永続的なURLにNFTokenのコンテンツを保存するのも1つの方法です。[NFTデータ保存のベストプラクティス](https://docs.ipfs.io/how-to/best-practices-for-nft-data)をご覧ください。

最も気になるであろう留意点：

* [コレクションとしてNFTをミントする](../../concepts/tokens/nfts/collections.md)
TokenTaxonフィールドを使用して、特定のテーマや目的をもったNFTのセットを作成します。
* [NFTの固定供給](../../concepts/tokens/nfts/guaranteeing-a-fixed-supply.md)
また、「使い捨て」アカウントでNFTを作成し、別のアカウントで一定数のNFTを取得した後、ミントに使用した「使い捨て」アカウントを削除することで、作成したNFTの希少性を確保することができます。[NFTの固定供給](../../concepts/tokens/nfts/guaranteeing-a-fixed-supply.md)をご覧ください。

## NFTの取引

NFTの取引は、売りオファーの作成または買いオファーの承諾によって行われます。[NFTokensの取引](../../tutorials/javascript/nfts/transfer-nfts.md)をご覧ください。

NFTをオークション形式で販売することができます。[NFTオークションの実行](../../concepts/tokens/nfts/running-an-nft-auction.md)をご覧ください。

あなたはブローカーとして、売り手と入札者をつなぎ、取引を完了させ、購入価格の何パーセントかを保持することができます。[NFTokenの取引を仲介する](../../tutorials/javascript/nfts/broker-an-nft-sale.md)をご覧ください。

### 準備金要件

販売用のNFTをミントする際には、XRPの準備金が必要となります。各NFTokenページには、2XRPの準備金が必要です。NFTokenページは16～32個のNFTを保管することができます。

各`NFTokenOffer`オブジェクトは、2XRPの準備金が必要です。

`NFTokenOffer`を作成したり、NFTを売却したりする際には、些細な送金手数料（およそ6000ドロップ、または0.006 XRP）が発生します。大量に販売する場合、こうした少額の手数料はすぐにかさみますので、ビジネスのコストとして考慮する必要があります。

次のコンテンツをご覧ください。

1. [NFTokenOffer](../../concepts/tokens/nfts/reserve-requirements.md#nftokenoffer-reserve)
2. NFToken page ([所有者準備金](../../concepts/tokens/nfts/reserve-requirements.md#owner-reserve))
3. 少額の[取引手数料](../../concepts/tokens/transfer-fees.md)

### 支払い

XRPL NFTの最もシンプルな支払い方法はXRPです。XRPを使ったNFTの売り買いの例については、[NFTokenの取引](../../tutorials/javascript/nfts/transfer-nfts.md)をご覧ください。

他の通貨での取引は、DEXを活用してあらゆる種類の発行通貨を受け入れ、取引することができます。[分散型取引所での取引](../../tutorials/how-tos/use-tokens/trade-in-the-decentralized-exchange.md#trade-in-the-decentralized-exchange)をご覧ください。

## NFTのインデックス

NFTを出品する際、オブジェクトのメタデータを使って分類するのが便利な場合があります。XRPLライブラリ、Clioサーバ、XRPL APIやBithompライブラリの拡張機能などのクエリを使用して、NFTをクリエイター、価格、コレクション、レアリティなどでソートしたりフィルタリングしたりすることができます。

関連項目:

- [Clioのセットアップ](../../infrastructure/installation/install-clio-on-ubuntu.md)
- [XRPL Data API](https://api.xrpldata.com/docs/static/index.html#/)
- [Bithomp](https://docs.bithomp.com/#nft-xls-20)

<!--
[Clio setup](../../infrastructure/installation/install-clio-on-ubuntu.md)

[https://api.xrpldata.com/docs/static/index.html#/](https://api.xrpldata.com/docs/static/index.html#/)

[https://docs.bithomp.com/#nft-xls-20](https://docs.bithomp.com/#nft-xls-20)

Sorting and filtering [No link]
    Creator - nft_info (issuer field)
    Price - nft_sell_offer->offers->amount field)
    Popularity - ?
    Newly listed
    Collection - nft_info (token taxon field)
    XRP vs $ vs IOUs
Search [No link]
Featured NFTs [No link]
Supplement Information [No link]
    Rarity
    Floor price
    History
        Number of owners
        Price History
 -->
