---
html: invariant-checking.html
parent: consensus.html
seo:
    description: 不変性チェックとは何か、なぜ存在するのか、どのように機能するのか、どのような不変性チェックが有効なのかを理解することができます。
labels:
  - ブロックチェーン
  - セキュリティ
---
# 不変性チェック

不変性チェックは、XRP Ledgerの安全機能です。これは、通常のトランザクション処理とは別に、すべての取引において特定の「不変量」が真であることを保証する一連のチェックで構成されています。

多くの安全機能がそうであるように、私たちは不変性チェックが実際に何もする必要がないことを望んでいます。しかし、XRP Ledger の不変量は XRP Ledger のトランザクション処理に対するハードリミットを定義しているため、それを理解することは有用であり、万が一不変量チェックに違反したためにトランザクションが失敗した場合に問題を認識するために有用です。

不変性はトリガーされるべきではありませんが、まだ発見されていない、あるいは作成されてもいないバグからXRP Ledgerの整合性を確保するものです。


## なぜ存在するのか

- XRP Ledgerのソースコードは複雑かつ膨大であり、コードが誤って実行される可能性が高いです。
- トランザクションを誤って実行した場合のコストは高く、どのような基準でも許容されるものではありません。

具体的には、不正なトランザクションの実行により、無効または破損したデータが作成され、後にネットワーク上のサーバを「動作不可能」な状態にすることで一貫してクラッシュさせ、ネットワーク全体を停止させる可能性があります。

不正なトランザクションの処理は、XRP Ledgerの信頼という価値を損なうことになります。不変性チェックは、信頼性という機能を付加するため、XRP Ledger 全体に価値を提供します。



## 仕組み

不変性チェッカーは、各トランザクションの後にリアルタイムで自動的に実行される第2層のコードです。トランザクションの結果がレジャーにコミットされる前に、不変性チェッカーはそれらの変更が正しいかどうかを検証します。もしトランザクションの結果がXRP Ledgerの厳格なルールに沿わない場合、不変性チェッカーはそのトランザクションを拒否します。このように拒否されたトランザクションは結果コード `tecINVARIANT_FAILED` を持ち、何の効果もなくレジャーに含まれます。

トランザクションを `tec` クラスのコードでレジャーに含めるには、何らかの最小限の処理が必要です。この最小限の処理でも不変条件に沿わない場合、トランザクションは `tefINVARIANT_FAILED` というコードで失敗し、レジャーには一切含まれません。


## 有効な不変条件

XRP Ledgerは、各トランザクションについて、以下のすべての不変条件をチェックします。

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L92 "ソース")

- [トランザクション手数料チェック](#トランザクション手数料チェック)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L118 "ソース")

- [XRPは作成されません](#xrpは作成されません)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L146 "ソース")

- [アカウントルートが削除されていない](#アカウントルートが削除されていない)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L173 "ソース")

- [XRPの残高確認](#xrpの残高確認)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L197 "ソース")

- [レジャーエントリ形式の一致](#レジャーエントリ形式の一致)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L224 "ソース")

- [XRPのトラストラインはありません](#xrpのトラストラインはありません)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L251 "ソース")

- [不正なオファーでない](#不正なオファーでない)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L275 "ソース")

- [0のエスクローでない](#0のエスクローでない)

[[ソース]](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h#L300 "ソース")

- [有効な新規アカウントルート](#有効な新規アカウントルート)


### トランザクション手数料チェック

- **不変条件:**
    - [トランザクションコスト](../transactions/transaction-cost.md)の金額は決してマイナスになってはならず、またトランザクションで指定されたコストより大きくなってはいけません。


### XRPは作成されません

- **不変条件:**
    - トランザクションはXRPを生成してはならず、XRPを破棄するのみです[トランザクションコスト](../transactions/transaction-cost.md)。


### アカウントルートが削除されていない

- **不変条件:**
    - [アカウント](../accounts/index.md)は、[AccountDeleteトランザクション][]によってのみレジャーから削除することができます。
    - AccountDelete が成功すると、常にちょうど1つのアカウントが削除されます。


### XRPの残高確認

- **不変条件:**
    - アカウントのXRP残高はXRPの形式である必要があり、0未満または1000億XRPを超えることはできません。


### レジャーエントリ形式の一致

- **不変条件:**
    - 変更されたレジャーの項目は形式が一致し、追加された項目は[有効なタイプ](../../references/protocol/ledger-data/ledger-entry-types/index.md)である必要があります。


### XRPのトラストラインはありません

- **不変条件:**
    - XRPを使用した[トラストライン](../tokens/fungible-tokens/index.md)は作成できません。


### 不正なオファーでない

- **不変条件:**
    - [オファー](../../references/protocol/ledger-data/ledger-entry-types/offer.md)は負でない金額でなければならず、XRP同士であってはいけません。


### 0のエスクローでない

- **不変条件:**
    - [エスクロー](../../references/protocol/ledger-data/ledger-entry-types/escrow.md)エントリは、0XRP以上1000億XRP未満を保有している必要があります。


### 有効な新規アカウントルート

- **不変条件:**
    - 新しい[アカウントルート](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)は、支払いの結果でなければなりません。
    - 新しいアカウントルートは、正しい開始[シーケンス](../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)を持たなければなりません。
    - 1つのトランザクションで複数の新しい[アカウント](../accounts/index.md)を作成してはいけません。


## 関連項目

- **ブログ:**
    - [レジャーの保護: 不変性チェック](https://xrpl.org/blog/2017/invariant-checking.html)

- **リポジトリ:**
    - [Invariant Check.h](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.h)
    - [Invariant Check.cpp](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/app/tx/impl/InvariantCheck.cpp)
    - [System Parameters](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/SystemParameters.h#L43)
    - [XRP Amount](https://github.com/XRPLF/rippled/blob/develop/src/ripple/basics/XRPAmount.h#L244)
    - [Ledger Formats](https://github.com/XRPLF/rippled/blob/023f5704d07d09e70091f38a0d4e5df213a3144b/src/ripple/protocol/LedgerFormats.h#L36-L94)


- **その他:**
    - [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md)
    - [トランザクションの残高変化の計算](https://xrpl.org/blog/2015/calculating-balance-changes-for-a-transaction.html#calculating-balance-changes-for-a-transaction)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
