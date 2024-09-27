---
html: nft-storage.html
parent: non-fungible-tokens.html
seo:
    description: NFTのペイロードのストレージオプション。
labels:
  - 非代替性トークン, NFT
---
# NFTペイロードのストレージ

NFTはブロックチェーン上で作成されます。しかし、メディア、メタデータ、属性を含むNFTのコンテンツは、XRP Ledger上、XRP Ledger外の分散型、XRP Ledger外の中央集権型など、様々な方法で保存することができます。

## XRP Ledger上

データが256バイトより小さい場合は、`data://`URIを使用し、URIフィールドに直接埋め込むことを検討することができます。これには、信頼性が高く、永続的で、レスポンス性の高いデータベースにデータを保存できるという利点があります。

## 分散型, XRP Ledger外

NFTのメタデータには、既存の分散ストレージソリューションを使用できます。

IPFSやArweaveは分散化ソリューションを提供しています。しかし、メタデータの効率的なフェッチが問題になることがあります。IPFSやArweaveに直接クエリしてメタデータをフェッチするのは、高品質なメディアを含むNFTの複数ページをスクロールするユーザからのすばやいレスポンスを必要とする最新のウェブサイトには十分な速度ではありません。

クラウドストレージソリューションの例については、ブログポスト[NFT Payload Storage Options](https://dev.to/ripplexdev/nft-payload-storage-options-569i)をご覧ください。

## 中央集権型, XRP Ledger外

URIフィールドを使用して、ペイロードが提供されるWebサーバを指定できます。

別の方法として、レジャー上のスペースを節約するために、`AccountSet`を使用して発行者の`Domain`フィールドを設定し、トークンのNFT IDをそのドメイン上のパスとして扱うこともできます。例えば、NFTのIDが`123ABC`で、発行者のドメインが`example.com`の場合、ペイロードは`example.com/tokens/123ABC`から送信されます。
