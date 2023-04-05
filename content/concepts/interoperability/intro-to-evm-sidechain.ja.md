---
html: intro-to-evm-sidechain.html
parent: xrpl-interoperability.html
blurb: EVM互換 XRP Ledger サイドチェーンの紹介
labels:
  - 相互運用性
status: not_enabled
---
# EVM互換 XRP Ledger サイドチェーンの紹介

{% include '_snippets/evmsc-disclaimer.ja.md' %}

Ethereum Virtual Machine（EVM）互換のXRP Ledgerサイドチェーンは、安全で高速なパブリックブロックチェーンで、あらゆる種類のWeb3アプリケーションをXRP Ledgerコミュニティにもたらします。

- エクスプローラ: [https://evm-sidechain.xrpl.org](https://evm-sidechain.xrpl.org/)
- 公開RPC: [https://rpc-evm-sidechain.xrpl.org](https://rpc-evm-sidechain.xrpl.org/)


EVMサイドチェーンは、以下の特徴を持つ強力な最新世代のブロックチェーンです。

- 1秒間に最大1000件のトランザクションをサポートし、大量のデータとスループットを処理する。
- 5秒ごとにブロックが生成され、平均してトランザクションの承認までの時間が短い。
- ブロックがチェーンに追加され、確認されると、そのブロックは確定される（確定時間1ブロック）。
- Ethereum Virtual Machine (EVM)との完全な互換性があり、ウォレットを接続し、Solidityで書かれたスマートコントラクトと相互にやり取りしたり、デプロイしたりすることが可能。

## コンセンサス

EVMサイドチェーンはプルーフオブステーク（PoS）コンセンサスアルゴリズムで動作しています。ステーキングとは、トランザクションの検証に使用するコインを担保にすることです。プルーフ・オブ・ステークモデルでは、暗号通貨（「コイン」とも呼ばれる）をステークし、独自のバリデーターノードを作成することが可能です。 コインはステーキングしている間はロックされますが、コインをトレードしたい場合は、ステーキングを解除することができます。

プルーフ・オブ・ステーク型ブロックチェーンでは、マイニングパワーはバリデーターがステークしているコインの量に依存します。より多くのコインをステークしている参加者は、新しいブロックの生成者として選ばれる可能性が高くなります。

暗号通貨のステーキングや独自のバリデータの運用に興味がある方は、[EVMサイドチェーン Devnetに参加する](join-evm-sidechain-devnet.html)で詳細を確認してください。

XRP Ledger EVMサイドチェーンのコンセンサスの基盤技術は、ブロックチェーン構築のためのByzantine-Fault Tolerantエンジンである[Tendermint](https://tendermint.com/)です。

ブロックチェーンはTendermintの上にある`cosmos-sdk`ライブラリを使用し、その組み込みモジュールを使ってブロックチェーンを作成・カスタマイズします。EVMサイドチェーンは、[Ethermint](https://github.com/evmos/ethermint)の`cosmos-sdk`モジュールを使用し、EVMとの互換性を提供します。

## EVMサイドチェーンを利用した相互運用性

EVMサイドチェーンは、XRP Ledgerブリッジ[https://bridge.devnet.xrpl](https://bridge.devnet.xrpl.org/)を介してXRP Ledgerに直接接続されています。このブリッジを通じて、EVMサイドチェーンに接続し、その機能を利用することができます。

## 関連項目

[EVMサイドチェーンを始めよう](get-started-evm-sidechain.html)
