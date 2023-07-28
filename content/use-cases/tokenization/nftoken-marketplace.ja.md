---
html: nftoken-marketplace.html
parent: nft-mkt-overview.html
blurb: NFTを取引するための「NFTマーケットプレイス」を構築する。
labels:
  - Tokenization
---
# NFTマーケットプレイス

_NFTokenマーケットプレイスでは、XRPLを利用して、厳選されたNFTokenを消費者に譲渡するためのWeb上のサービスを提供し、ブランド構築と売上に応じた仲介手数料を得ることができるというメリットを得ることができるようになります。_

--- 

NFTokenマーケットプレイスは、NFTokenクリエイターとコレクターの仲介役となります。マーケットプレイスの運営は、NFTokenのクリエイターを探し出し、販売するアイテムを集めます。購入者は、あなたのサイトを訪れ、選択されたアイテムを確認し、オファーを提示します。あなたは、クリエイターが設定した最低価格と購入者から提示された最適な価格を照合し、トランザクションを完了させ、仲介手数料を受け取ります。

## NFTマーケットプレイスを作成する

[![NFTマーケットプレイスのフロー](img/nft-mkt-marketplace.png "NFTマーケットプレイスのフロー")](img/nft-mkt-marketplace.png)


## rippledインスタンスのセットアップ

取引量の多い本格的なマーケットプレイスサイトを立ち上げる場合、独自のXRPレジャーサーバインスタンスを立ち上げるという判断が当然となります。[rippledのインストール](install-rippled.html)をご覧ください。


### ウォレットのセットアップ

新しいウォレットをセットアップします。[Xumm](https://xumm.app/)をご覧ください。

基本準備金については[準備金](reserves.html#base-reserve-and-owner-reserve)をご覧ください。

Current wallet options on XRPL: This is a good opportunity for XRPL to highlight wallet providers in the ecosystem


### NFTの取引

NFTの取引は、売りオファーの作成または買いオファーの承諾によって行われます。[NFTokensの取引](transfer-nftokens.html)をご覧ください。

NFTをオークション形式で販売することができます。[NFTオークションの実行](nftoken-auctions.html#running-an-nft-auction)をご覧ください。

あなたはブローカーとして、売り手と入札者をつなぎ、取引を完了させ、購入価格の何パーセントかを保持することができます。[NFTokenの取引を仲介する](broker-sale.html)をご覧ください。


### 準備金要件

販売用のNFTをミントする際には、XRPの準備金が必要となります。各NFTokenページには、2XRPの準備金が必要です。NFTokenページは16～32個のNFTを保管することができます。

各`NFTokenOffer`オブジェクトは、2XRPの準備金が必要です。

`NFTokenOffer`を作成したり、NFTを売却したりする際には、些細な送金手数料（およそ6000ドロップ、または0.006 XRP）が発生します。大量に販売する場合、こうした少額の手数料はすぐにかさみますので、ビジネスのコストとして考慮する必要があります。

次のコンテンツをご覧ください。

1. [NFTokenOffer](nft-reserve-requirements.html#nftokenoffer-reserve)
2. NFToken page ([所有者準備金](nft-reserve-requirements.html#owner-reserve))
3. 少額の[取引手数料](transfer-fees.html)


ブローカー販売については、トピック[XRPレジャーでのトークン取引](non-fungible-token-transfers.html)で詳しく説明しています。

トークン取引手数料については、[取引手数料](transfer-fees.html)で詳しく解説しています。

[NFToken Saleの仲介](broker-sale.html)の手順に従って、ブローカー販売市場の構築を開始することができます。

#### 支払い

XRPL NFTの最もシンプルな支払い方法はXRPです。XRPを使ったNFTの売り買いの例については、[NFTokenの取引](transfer-nftokens.html)をご覧ください。

他の通貨での取引は、DEXを活用してあらゆる種類の発行通貨を受け入れ、取引することができます。[分散型取引所での取引](trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange)をご覧ください。

## NFTのインデックス化

NFTを出品する際、オブジェクトのメタデータを使って分類するのが便利な場合があります。XRPLライブラリ、Clioサーバ、XRPL APIとBithompライブラリの拡張機能などのクエリを使用して、NFTをクリエイター、価格、コレクション、レアリティなどでソートしたりフィルタリングしたりすることができます。

関連項目:

- [Clioのセットアップ](install-clio-on-ubuntu.html) 
- [XRPL Data API](https://api.xrpldata.com/docs/static/index.html#/)
- [Bithomp](https://docs.bithomp.com/#nft-xls-20)

<!-- 

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

