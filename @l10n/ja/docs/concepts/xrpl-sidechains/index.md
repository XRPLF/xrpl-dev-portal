---
html: xrpl-sidechains.html
parent: concepts.html
seo:
    description: XRPLサイドチェーンは、独自のコンセンサスアルゴリズム、トランザクションタイプ、ルールを持つ独立した台帳です。
labels:
  - ブロックチェーン
  - 相互運用性
---
# XRPLサイドチェーン

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

サイドチェーンは、独自のコンセンサスアルゴリズム、トランザクションタイプ、ルール、ノードを持つ独立した台帳です。サイドチェーンは、メインチェーン(XRP Ledger)と並行して動作する独自のブロックチェーンとして機能し、メインチェーンのスピード、効率性、スループットを損なうことなく、両者の間で価値の移動を可能にします。

サイドチェーンは、XRP Ledgerのプロトコルを特定のユースケースやプロジェクトのニーズに合わせてカスタマイズし、独自のブロックチェーンとして運用することができます。いくつかの例を紹介します。

* スマートコントラクト層の追加: [Xahau](https://xahau.network/)をご覧ください。
* イーサリアム仮想マシン(EVM)互換性の追加: [EVMサイドチェーン](https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/)をご覧ください。
* 独自のアルゴリズムによるステーブルコインの構築。
* メインネットの[分散型取引所](../tokens/decentralized-exchange/index.md)で資産を取引できる、パーミッションあり、またはほぼパーミッションレス、中央集権型、または大部分が分散されている台帳の構築。


**ノート:**

  - サイドチェーンは独自のバリデータを使い、メインチェーンの `rippled` UNL とは別のUNLを必要とします。
  - メインチェーンとサイドチェーンのノードはお互いを認識していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
