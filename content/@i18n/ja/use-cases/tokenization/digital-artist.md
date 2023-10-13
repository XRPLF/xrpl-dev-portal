---
html: digital-artist.html
parent: nft-mkt-overview.html
blurb: Creating an NFT Marketplace for buying and selling NFTs.
labels:
  - Tokenization
---
# デジタルアーティスト

_デジタルアーティストとして、私はXRPLを使って自分の作品のNFTokenを作成し、XRPLで販売したいと思います。XRPLはコスト効率がよく、カーボンニュートラルだからです。_

---

NFTokenを作成すると、実際の物理的またはデジタル資産の実質的なプレースホルダーとなる一意のトークンがXRPL上に作成されます。NFTokenを作成する際には、デジタルアートワークのようなアイテムそのものであるデジタルファイルへのURL、または物理的な世界でのアイテムを表すプレースホルダへのURLを提供します。

デジタルアーティストとして、あなたはNFTの作成に専念しており、おそらくXRP Ledgerで販売するためでしょう（自分の作品の実績を証明する方法としてNFTを作成する可能性もありますね）。

[Xumm](https://xumm.app)などのアプリを使用してNFTokenを作成することができます。

より実践的な体験をしたい方は、[クイックスタート・チュートリアル3 - NFTokenのミントとバーン](mint-and-burn-nfts-using-javascript.html)をご覧ください。

[![デジタルアーティストのフロー](img/nft-mkt-digital-artist.png "デジタルアーティストのフロー")](img/nft-mkt-digital-artist.png)

## 公開サーバを利用する

開始当初は、トランザクションは比較的少ないでしょう。無料のXRP Ledger公開サーバの1つで作業することができます。ビジネスが成長するにつれて、増加する販売トラフィックを処理するために、独自のXRP Ledgerインスタンスを検討することができます。[パブリックサーバ](public-servers.html)をご覧ください。

## NFTの作成

NFTをミントして販売することで、マーケットプレイスを構築します。

初めてNFTを作成する場合は、チュートリアル _NFTokenのミントとバーン_ の手順に従ってください。NFTを作成する際には、以下の点にも留意してください。

* <code>transfer fee</code>を設定することで、将来の取引からロイヤリティを徴収することができます。これは販売価格の0～50%を表す0～50000の値です。[NFTの取引手数料](nftoken.html#transferfee)を参照してください。
* NFTokenのURLは、NFTのコンテンツが保存されている場所へのリンクです。IPFSアカウントを作成し、永続的なURLにNFTokenのコンテンツを保存するのも1つの方法です。[NFTデータ保存のベストプラクティス](https://docs.ipfs.io/how-to/best-practices-for-nft-data)をご覧ください。
<!--[Add link to blog post about alternative NFT cache options.] -->
* `TokenTaxon`フィールドを使用すると、NFTを論理的なコレクションとしてミントすることができます。[NFTをコレクションとしてミントする](nft-collections.html)をご覧ください。
* 発行者として将来的にトークンをバーンできるようにしたい場合は、`Flags`フィールドを _1_ に設定します。NFTを譲渡可能にするには、`Flags`フィールドを _8_ に設定します。NFTをバーン可能かつ譲渡可能にするには、`Flags`フィールドを _9_ に設定します。[Burnableフラグ](nftoken.html#nftoken-flags)および[Transferableフラグ](nftoken.html#nftoken-flags)をご覧ください。

[NFTokenのミントとバーン](mint-and-burn-nfts-using-javascript.html)をご覧ください。

## NFTの販売

NFTを売却する場合は、売却オファーを作成する必要があります。[NFTokensの取引](transfer-nfts-using-javascript.html)をご覧ください。

NFTをオークション形式で販売することができます。[NFTオークションの実行](transfer-nfts-using-javascript.html)をご覧ください。

### 準備金要件

販売用のNFTをミントする際には、XRPの準備金が必要となります。各NFTokenページには、2XRPの準備金が必要です。NFTokenページは16～32個のNFTを保管することができます。

各`NFTokenOffer`オブジェクトは、2XRPの準備金が必要です。

`NFTokenOffer`を作成したり、NFTを売却したりする際には、些細な送金手数料（およそ6000ドロップ、または0.006 XRP）が発生します。大量に販売する場合、こうした少額の手数料はすぐにかさみますので、ビジネスのコストとして考慮する必要があります。

次のコンテンツをご覧ください。

1. [NFTokenOffer](nft-reserve-requirements.html#nftokenoffer-reserve)
2. NFToken page ([所有者準備金](nft-reserve-requirements.html#owner-reserve))
3. 少額の[取引手数料](transfer-fees.html)

### 支払い

XRPL NFTの最もシンプルな支払い方法はXRPです。XRPを使ったNFTの売り買いの例については、[NFTokenの取引](transfer-nfts-using-javascript.html))をご覧ください。

他の通貨での取引は、DEXを活用してあらゆる種類の発行通貨を受け入れ、取引することができます。[分散型取引所での取引](trade-in-the-decentralized-exchange.html#trade-in-the-decentralized-exchange)をご覧ください。

## NFTのインデックス化

NFTを出品する際、オブジェクトのメタデータを使って分類するのが便利な場合があります。XRPLライブラリ、Clioサーバ、XRPL APIとBithompライブラリの拡張機能などのクエリを使用して、NFTをクリエイター、価格、コレクション、レアリティなどでソートしたりフィルタリングしたりすることができます。

関連項目:

- [Clioのセットアップ](install-clio-on-ubuntu.html)
- [XRPL Data API](https://api.xrpldata.com/docs/static/index.html#/)
- [Bithomp](https://docs.bithomp.com/#nft-xls-20)


## NFTのバーン

ワークフローの中には、現在の所有者に関係なく、将来のある時点で発行者がトークンをバーンする権利を保持することが適切な場合があります。例えば、カーボンクレジットに使用されるNFTはミントして取引することができますが、二酸化炭素が排出されると、NFTをバーンして取引不能にすることが可能です。このようなシナリオでは、NFTをミントする際に`lsfBurnable`フラグを設定します。

また、ゲーム内でライフを失った後にゲーム内資産をバーンすることもあります。また、NFTのチケットは、換金に成功した後、再び使用されないようにバーンすることができます。
