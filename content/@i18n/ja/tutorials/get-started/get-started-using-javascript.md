---
html: get-started-using-javascript.html
parent: javascript.html
blurb: XRP Ledgerを参照するためのエントリーレベルのJavaScriptアプリケーションを構築します。
top_nav_name: JavaScript
top_nav_grouping: 始めましょう
labels:
  - 開発
showcase_icon: assets/img/logos/javascript.svg
---
# JavaScriptを使ってみよう

このチュートリアルでは、JavaScriptまたはTypeScript向けのクライアントライブラリである　[`xrpl.js`](https://github.com/XRPLF/xrpl.js/)　を使用して、Node.jsまたはウェブブラウザでXRP Ledgerに接続されたアプリケーションを構築するための基本的な手順を説明します。

本ガイドで使用しているスクリプトや設定ファイルは、[本サイトのGitHubリポジトリ]({{target.github_forkurl}}/tree/{{target.github_branch}}/content/_code-samples/get-started/js/)で公開されています。


## 学習目標

このチュートリアルでは、以下のことを学びます。

* XRP Ledgerベースのアプリケーションの基本構成要素。
* xrpl.jsを使ったXRP Ledgerへの接続方法。
* xrpl.jsを使った[テストネット](xrp-testnet-faucet.html)でのウォレット生成方法。
* `xrpl.js`ライブラリを使った、XRP Ledgerアカウント情報の検索方法。
* How to put these steps together to create a simple JavaScript app or web-app.


## 前提条件

このチュートリアルを実行するには、JavaScriptでコードを書き、小さなJavaScriptプロジェクトを管理することにある程度慣れている必要があります。ブラウザでは、JavaScriptをサポートする最新のWebブラウザであれば問題なく使用できます。Node.jsでは、**バージョン14**を推奨します。Node.jsのバージョン12と16も定期的にテストされています。


## npmを使用したインストール

空のフォルダを作成して新しいプロジェクトを開始し、そのフォルダに移動して[NPM](https://www.npmjs.com/)で最新版のxrpl.jsをインストールします。

```sh
npm install xrpl
```


## 作り始めましょう

XRP Ledgerを使用する際には、XRPを[ウォレット](wallets.html)に追加したり、[分散型取引所](decentralized-exchange.html)と統合したり、[トークンを発行](issued-currencies.html)したりと、管理しなければならないことがいくつかあります。このチュートリアルでは、これらすべてのユースケースを始めるための共通の基本パターンを説明し、それらを実装するためのサンプルコードを提供します。

多くのXRP Ledgerプロジェクトで使用している手順をご紹介します。

1. [ライブラリのインポート](#1-ライブラリのインポート)
1. [XRP Ledgerへの接続](#2-xrp-ledgerへの接続)
1. [ウォレットの作成](#3-ウォレットの作成)
1. [XRP Ledgerの参照](#4-xrp-ledgerの参照)
1. [イベントのListen](#5-イベントのlisten)

### 1. ライブラリのインポート

プロジェクトに `xrpl.js` をどのように読み込むかは、開発環境によって異なります。

#### ブラウザ

以下のような`<script>`タグをHTMLに追加してください。

```html
<script src="https://unpkg.com/xrpl@2.0.0/build/xrpl-latest-min.js"></script>
```

上記の例のようにCDNからライブラリをロードすることも、リリースをダウンロードして自分のウェブサイトでホストすることもできます。

これは、モジュールを `xrpl` としてトップレベルにロードします。

#### Node.js

[npm](https://www.npmjs.com/)を使って、ライブラリを追加します。これにより、`package.json`ファイルが更新されます。まだ存在していなければ新しいファイルが作成されます。

```sh
npm install xrpl
```

その後、ライブラリをインポートします。

```js
const xrpl = require("xrpl")
```


### 2. XRP Ledgerへの接続

参照や取引を行うには、XRP Ledgerへの接続を確立する必要があります。`xrpl.js`でこれを行うには、`Client`クラスのインスタンスを作成し、`connect()`メソッドを使用します。

**Tip:** `xrpl.js` の多くのネットワーク関数は、[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を使って非同期に値を返します。ここで紹介するコードサンプルでは、[`async/await` パターン](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)を使用して、Promises の実際の結果を待ちます。

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

#### XRP Ledger メインネットへの接続

前節のサンプルコードでは、利用可能な[並列ネットワーク](parallel-networks.html)の1つであるTestnetに接続する方法を紹介しました。本番環境に移行するには、XRP Ledger Mainnetに接続する必要があります。それには2つの方法があります。

* [コアサーバをインストール](install-rippled.html) (`rippled`)して、自分でノードを動かしてみましょう。コアサーバーはデフォルトではMainnetに接続しますが、設定を変更してTestnetやDevnetを使うこともできます](connect-your-rippled-to-thexrp-test-net.html)。[独自のコアサーバーを運用するのには良い理由があります](networks-and-servers.html#reasons-to-run-your-own-server)。独自のサーバーを走らせた場合、次のようにして接続することができます。

        const MY_SERVER = "ws://localhost:6006/"
        const client = new xrpl.Client(MY_SERVER)
        await client.connect()

    デフォルト値の詳細については、[コアサーバー設定ファイル](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562)の例を参照してください。

* 利用可能な[公開サーバー][]を利用する:

        const PUBLIC_SERVER = "wss://xrplcluster.com/"
        const client = new xrpl.Client(PUBLIC_SERVER)
        await client.connect()


### 3. ウォレットの作成

`xrpl.js` ライブラリには、XRP Ledgerアカウントのキーとアドレスを扱うための "Wallet "クラスが用意されています。Testnetでは、次のようにして新しいウォレットに資金を供給することができます。

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Create a wallet", end_before="// Get info", language="js") }}

キーを生成するだけであれば、次のように新しいWalletインスタンスを作成することができます。

```js
const test_wallet = xrpl.Wallet.generate()
```

また、[base58][]でエンコードされたシードをすでに持っている場合は、次のようにしてそのシードからWalletをインスタンス化することができます。

```js
const test_wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9") // テスト用シークレット、本番環境では使用しないでください
```

### 4. XRP Ledgerの参照

クライアントの`request()`メソッドを使って、XRP Ledgerの[WebSocket API](request-formatting.html)にアクセスします。例えば、以下のようになります。

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Get info", end_before="// Listen to ledger close events", language="js") }}


### 5. イベントのListen

XRP Ledgerの[コンセンサス プロセス](consensus.html)が新しい[レジャーバージョン](ledgers.html)を生成したときなど、`xrpl.js`ではさまざまなタイプのイベントのハンドラを設定することができます。そのためには、まず[subscribeメソッド][]を呼び出して欲しいイベントの種類を取得し、クライアントの`on(eventType, callback)`メソッドを使ってイベントハンドラをアタッチします。

{{ include_code("_code-samples/get-started/js/get-acct-info.js", start_with="// Listen to ledger close events", end_before="// Disconnect when done", language="js") }}


## 作り続けましょう

これで、`xrpl.js`を使って、XRP Ledgerに接続したり、ウォレットを生成したり、アカウントの情報を調べたりする方法がわかりました。
次のようなことも可能です。

* [XRPの送信](send-xrp.html).
* [代替可能トークンの発行](issue-a-fungible-token.html)
* アカウントに[安全な署名](secure-signing.html) を設定する。


## 関連記事

- **概念:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [クライアントライブラリ](client-libraries.html)
- **Tutorials:**
    - [XRPの送信](send-xrp.html)
- **References:**
    - [`xrpl.js` リファレンス](https://js.xrpl.org/)
    - [Public API Methods](public-api-methods.html)
    - [API規約](api-conventions.html)
        - [base58 エンコード](base58-encodings.html)
    - [トランザクションフォーマット](transaction-formats.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
