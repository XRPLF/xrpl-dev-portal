---
html: nft-mkt-overview.html
parent: tokenization.html
blurb: NFTマーケットプレイスのユースケースの概要。
labels:
  - Tokenization
---
# NFTマーケットプレイスの概要


## 主な特徴

NFTのXRPLネイティブサポートでは、以下のようなことが可能なツールを提供しています。

- NFTのミント、販売、バーン
- NFTのプロジェクトを短期間・低コストでスタート
- 売り手と買い手の間の取引を仲介するブローカーの設定
- 他のアカウントへのNFTのミントを代行する権限の付与
- クリエイターフレンドリーで、マーケットプレイス取引でも保証されるオンレジャーのロイヤリティの受け取り。

これらはすべて、XRPレジャーの10年以上にわたる性能と信頼性の上に成り立っています。

## ゴールの設定

まず、どのようなマーケットプレイスを作りたいかを決めることから始めましょう。

- マーケットプレイスでは、他の人がミントしたNFTを販売します。
- 認可Minter：アーティストのためにNFTをミントする。
- デジタルアーティスト：自分でNFTを作成して販売する。

NFTビジネスを始めるにあたって、必要不可欠な4つの準備項目があります。

1. ネットワークへの接続方法の決定
2. ブロックチェーンでの処理の設定
3. 必要なNFT情報のインデックス作成
4. NFTをキャッシュするための永続的なストレージ戦略の決定

[![NFTマーケットのフロー](img/nft-mkt-overview.png "NFTマーケットのフロー")](img/nft-mkt-overview.png)

## XRPLへの接続

トランザクションの少ない小規模なサイトを立ち上げたい場合は、XRPレジャーの無料の公開サーバのいずれかと連携することができます。[パブリックサーバ](public-servers.html)をご覧ください。

大規模なサイトを大量に立ち上げたい場合は、独自のXRPレジャーのサーバインスタンスを導入する価値があるかもしれません。[rippledのインストール](install-rippled.html)をご覧ください。

関連項目:

* [独自サーバ運用のメリットとデメリット](xrpl-servers.html#reasons-to-run-your-own-server).

## ブロックチェーンの基本機能のセットアップ

NFTをいくつかミントして販売することで、マーケットプレイスを構築し始めることができます。

最初のNFTを作成するには、チュートリアル _NFTonenのミントとバーン_ の指示に従います。[NFTのミントとバーン](mint-and-burn-nftokens.html)をご覧ください。

NFTokenのURLは、NFTのコンテンツが保存されている場所へのリンクです。IPFSアカウントを作成し、永続的なURLにNFTokenのコンテンツを保存するのも1つの方法です。[NFTデータ保存のベストプラクティス](https://docs.ipfs.io/how-to/best-practices-for-nft-data)をご覧ください。

発行者として将来的にトークンをバーンできるようにしたい場合は、`Flags`フィールドを _1_ に設定します。NFTを譲渡可能にするには、`Flags`フィールドを _8_ に設定します。NFTをバーン可能かつ譲渡可能にするには、`Flags`フィールドを _9_ に設定します。[Burnableフラグ](nftoken.html#nftoken-flags)および[Transferableフラグ](nftoken.html#nftoken-flags)をご覧ください。

<code>transfer fee</code>を設定することで、将来の取引からロイヤリティを徴収することができます。これは販売価格の0～50%を表す0～50000の値です。[NFTの取引手数料](nftoken.html#transferfee)をご覧ください。

`TokenTaxon`フィールドを使用すると、NFTを論理的なコレクションとしてミントすることができます。[NFTをコレクションとしてミントする](nft-collections.html#minting-nfts-into-collections)をご覧ください。

自分で作成したコンテンツで自分のNFTをミントすることもできますが、他のクリエイターの代わりにNFTを生成する認可Minterになることもできます。この場合、クリエイターは新しいNFTの作成に専念し、あなたはNFTのミントと販売を担当することができます。

認可MinterがクリエイターのためにNFTをミントし終えたら、その権限を取り消し、クリエイターのNFTを制御できないようにすることができます。

[認可Minter](nftoken-authorized-minting.html)をご覧ください。

ミント済みのNFTは、`NFTokenPage`に記録されます。アカウント上の`NFTokenPage`1つにつき2XRPの準備金が必要です。[NFT準備金](nft-reserve-requirements.html)をご覧ください。

各「NFTokenPage」は16～32個のNFTを保持します。大量のNFTをミントすると、あなたのXRPを大量に準備金としてロックすることになります。オンデマンドミント（または _遅延ミント_ ）を行うことで、XRPを柔軟に維持することができます。[遅延ミント](nftoken-batch-minting.html#mint-on-demand-lazy-minting)と[スクリプトミント](nftoken-batch-minting.html#scripted-minting)をご覧下さい。


### ウォレットのセットアップ

新しいウォレットをセットアップします。[Xumm](https://xumm.app/)をご覧ください。

アカウントを作成する際には、10 XRPの基本準備金が必要であることに注意してください。[準備金](reserves.html#base-reserve-and-owner-reserve)をご覧ください。

### NFTの取引

NFTの取引は、売りオファーの作成または買いオファーの承諾によって行われます。[NFTokensの取引](transfer-nftokens.html)をご覧ください。

NFTをオークション形式で販売することができます。[NFTオークションの実行](nftoken-auctions.html#running-an-nft-auction)をご覧ください。

あなたはブローカーとして、売り手と入札者をつなぎ、取引を完了させ、購入価格の何パーセントかを保持することができます。[NFTokenの取引を仲介する](broker-sale.html)をご覧ください。

#### 準備金要件

販売用のNFTをミントする際には、XRPの準備金が必要となります。各NFTokenページには、2XRPの準備金が必要です。NFTokenページは16～32個のNFTを保管することができます。

各`NFTokenOffer`オブジェクトは、2XRPの準備金が必要です。

`NFTokenOffer`を作成したり、NFTを売却したりする際には、些細な送金手数料（およそ6000ドロップ、または0.006 XRP）が発生します。大量に販売する場合、こうした少額の手数料はすぐにかさみますので、ビジネスのコストとして考慮する必要があります。

次のコンテンツをご覧ください。

1. [NFTokenOffer](nft-reserve-requirements.html#nftokenoffer-reserve)
2. NFToken page ([所有者準備金](nft-reserve-requirements.html#owner-reserve))
3. 少額の[取引手数料](transfer-fees.html)

#### 支払い

XRPL NFTの最もシンプルな支払い方法はXRPです。XRPを使ったNFTの売り買いの例については、[NFTokenの取引](transfer-nftokens.html)をご覧ください。

他の通貨での取引は、DEXを活用してあらゆる種類の発行通貨を受け入れ、取引することができます。[分散型取引所での取引](trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange)をご覧ください。

<!-- 

- Fiat payment ([Cross-currency payments](cross-currency-payments.html))
- On-chain validation of completing transactions [No link- isn’t this just a cross-currency payment?] (Query after the transaction is completed.]
 -->

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

## NFTのキャッシュ
<!-- 

Image optimization for web experience [No link]

 -->
クリプト分野で作成されるNFTは、メディアや属性などのメタデータを保存することが想定されています。現在は中央集権化を避けるため、ほとんどがIPFSやArweaveに保存されています。

<!--  We can't use this example.
See  [HERE](https://xrp.cafe/nft/00081770CCE71D9E7BD07E3A771C7619DA982D62CD37325A99B664A500000209)) -->

IPFS/Arweaveは分散化を促進する素晴らしいソリューションですが、メタデータを効率的にフェッチすることが問題になっています。IPFS/Arweaveに直接アクセスしてメタデータをフェッチするのは、高品質のメディアを持つNFTの複数ページをスクロールしているユーザからの即時応答を必要とする現代のウェブサイトにとって十分な速度とは言えません。現在、XRPL上の多くのNFTマーケットプレイスは、高速で信頼性の高いレスポンシブなウェブサイトを持つために、IPFSオリジナルのキャッシュバージョンを保存していますが、このプロセスは高価で非効率です。

CloudflareやInfuraをはじめとする多くのプロバイダが、こうした分散型ファイルの保存と、ユーザのための高速な検索に力を入れるようになっています。

[NFTのキャッシュ](nftoken.html#nftoken-データとメタデータの取得)をご覧ください。

<!-- 
You can also consider a solution such as Pinata. [https://drive.google.com/file/d/14wuulkvjVjtGlUJj0ppaJ4Sziyp5WFGA/view?usp=sharing](https://drive.google.com/file/d/14wuulkvjVjtGlUJj0ppaJ4Sziyp5WFGA/view?usp=sharing) 

We can derive inspiration for the need of caching and point to some of their docs 
[https://docs.pinata.cloud/gateways](https://docs.pinata.cloud/gateways) 
 -->


