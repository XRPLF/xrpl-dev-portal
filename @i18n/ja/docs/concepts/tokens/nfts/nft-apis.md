---
html: nft-apis.html
parent: non-fungible-tokens.html
seo:
    description: 専用のAPIを使用すると、有用なNFTメタデータにアクセスできます。
labels:
  - 非代替性トークン, NFT
---
# NFTのAPI

このページでは、NFTに関連するトランザクションとリクエストを一覧でご紹介します。

## NFTのオブジェクト

- [NFToken][]データ型 - 台帳に保存されるNFTのオブジェクト。
- レジャーオブジェクト
    - [NFTokenOfferオブジェクト][] - NFTを売買するためのオファー。
    - [NFTokenPageオブジェクト][] - NFTページは最大32個のNFTオブジェクトを保持します。実際には、各NFTページは通常16～24個のNFTを保持します。

## NFTのトランザクション

- [NFTokenMint][] - NFTをミントする。

- [NFTokenCreateOffer][] - NFTを売買するためのオファーを作成します。

- [NFTokenCancelOffer][] - NFTを売買するためのオファーをキャンセルします。

- [NFTokenAcceptOffer][] - NFTを売買するためのオファーを承認します。

- [NFTokenBurn][] - 永久的にNFTをバーンします。

## NFTのリクエスト

- [account_nftsメソッド][] - アカウントが所有するNFTのリストを取得します。
- [nft_buy_offersメソッド][] - 指定したNFTokenオブジェクトの購入オファーのリストを取得します。
- [nft_sell_offersメソッド][] - 指定したNFTokenオブジェクトの売却オファーのリストを取得します。
- [subscribeメソッド][] - 特定のテーマに関する最新情報をリッスンします。例えば、マーケットプレイスは、自身のプラットフォームに出品されているNFTのステータスに関する最新情報をリアルタイムで提供することができます。
- [unsubscribeメソッド][] - 特定のテーマに関する最新情報のリッスンを停止します。

## Clio

Clioサーバは、キャッシュに基づいて情報のリクエストを処理することで、ネットワーク全体のパフォーマンスを向上させ、XRP Ledger上のバリデータをトランザクション処理に集中させることができます。一般的なXRP Ledgerのリクエストタイプに加えて、Clioサーバはより詳細なレスポンスを提供する追加のリクエストタイプを処理します。

### Clio特有のNFTのリクエスト

- [nft_info](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_info.md) - 指定されたNFTに関する現在のステータスを取得します。
- [nft_history](../../../references/http-websocket-apis/public-api-methods/clio-methods/nft_history.md) - 指定されたNFTの過去のトランザクションメタデータを取得します。

<!-- 
[nfts_by_issuer](nfts_by_issuer.html) - 指定した発行者が作成したNFTの一覧を取得します。
-->

パブリックClioサーバにアクセスするには、そのURLとClioポート（通常51233）にリクエストを送信します。パブリックClio APIサーバには、SLAも優先的に処理する責任もありません。ビジネスユースケースで継続的な監視や情報リクエストが必要な場合は、独自のClioサーバインスタンスをセットアップすることを検討してください。[UbuntuにClioをインストール](../../../infrastructure/installation/install-clio-on-ubuntu.md)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
