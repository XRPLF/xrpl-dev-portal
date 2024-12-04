---
html: nftoken-batch-minting.html
parent: non-fungible-tokens.html
seo:
    description: NFTokenオブジェクトを一括でMintする。
labels:
 - 非代替性トークン, NFT
---

# NFTのバッチMint

NFTokenオブジェクトを一括でMintする方法には、一般的に、オンデマンドでMintする方法とスクリプトでMintする方法の2つがあります。

## オンデマンドMint (遅延Minting)

オンデマンドMintモデルを使用する場合、発行者または潜在的購入者は、XRP LedgerからNFTokenオブジェクトの初期販売に対して購入または売却オファーを出します。初期販売を開始する準備ができたら、トークンをMintして、売却オファーを作成するか、購入オファーを受け入れて、取引を完了させます。

### メリット

* 売れ残りのNFTokenオブジェクトを保有するための準備金が発生しません。
* 売れると分かった時点でリアルタイムにNFTokenオブジェクトをMintします。 <!-- STYLE_OVERRIDE: will -->

### デメリット

NFTokenオブジェクトの初回販売以前の市場活動は、XRP Ledgerには記録されません。これは、一部のアプリケーションでは問題にならない場合があります。

## スクリプトMinting

プログラムまたはスクリプトを使用して、一度に多数のトークンをMintします。[チケット](../../accounts/tickets.md)を使えば、1度に200件までのトランザクションを並行して処理することができます。

実用例としては、チュートリアルの[JavaScriptでNFTをバッチMint](../../../tutorials/javascript/nfts/batch-mint-nfts.md)をご覧ください

### メリット

* NFToken オブジェクトは事前にMintされます。
* NFTokenオブジェクトの初回販売の市場活動は台帳に記録されます。

### デメリット

NFTokenオブジェクトをMintする際には、[準備金要件](../../accounts/reserves.md)を満たす必要があります。目安としては、現在の準備金レートで、NFTokenオブジェクトあたりおよそ1/12XRPです。十分なXRPがない場合は、XRPが調達できるまで、Mintトランザクションは失敗します。
