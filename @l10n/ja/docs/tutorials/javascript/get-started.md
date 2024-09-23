---
html: get-started-using-javascript.html
parent: javascript.html
seo:
    description: XRP Ledgerを参照するためのエントリレベルのJavaScriptアプリケーションを構築します。
top_nav_name: JavaScript
top_nav_grouping: 始めましょう
labels:
  - 開発
showcase_icon: assets/img/logos/javascript.svg
---
# JavaScriptを使ってみよう

このチュートリアルでは、JavaScriptまたはTypeScript向けのクライアントライブラリである　[`xrpl.js`](https://github.com/XRPLF/xrpl.js/)　を使用して、Node.jsまたはウェブブラウザでXRP Ledgerに接続されたアプリケーションを構築するための基本的な手順を説明します。

本ガイドで使用しているスクリプトや設定ファイルは、{% repo-link path="_code-samples/get-started/js/" %}本サイトのGitHubリポジトリ{% /repo-link %}で公開されています。


## 学習目標

このチュートリアルでは、以下のことを学びます。

* XRP Ledgerベースのアプリケーションの基本構成要素。
* xrpl.jsを使ったXRP Ledgerへの接続方法。
* xrpl.jsを使った[テストネット](/resources/dev-tools/xrp-faucets)でのウォレット生成方法。
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

XRP Ledgerを使用する際には、XRPを[ウォレット](../../introduction/crypto-wallets.md)に追加したり、[分散型取引所](../../concepts/tokens/decentralized-exchange/index.md)と統合したり、[トークンを発行](../../concepts/tokens/index.md)したりと、管理しなければならないことがいくつかあります。このチュートリアルでは、これらすべてのユースケースを始めるための共通の基本パターンを説明し、それらを実装するためのサンプルコードを提供します。

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

{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}

#### XRP Ledger メインネットへの接続

前節のサンプルコードでは、利用可能な[並列ネットワーク](../../concepts/networks-and-servers/parallel-networks.md)の1つであるTestnetに接続する方法を紹介しました。本番環境に移行するには、XRP Ledger Mainnetに接続する必要があります。それには2つの方法があります。

* [コアサーバをインストール](../../infrastructure/installation/index.md) (`rippled`)して、自分でノードを動かしてみましょう。コアサーバはデフォルトではMainnetに接続しますが、設定を変更してTestnetやDevnetを使うこともできます](connect-your-rippled-to-thexrp-test-net.html)。[独自のコアサーバを運用するのには良い理由があります](../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server)。独自のサーバを走らせた場合、次のようにして接続することができます。

    ```
    const MY_SERVER = "ws://localhost:6006/"
    const client = new xrpl.Client(MY_SERVER)
    await client.connect()
    ```

    デフォルト値の詳細については、[コアサーバ設定ファイル](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562)の例をご覧ください。

* 利用可能な[公開サーバ][]を利用する:

    ```
    const PUBLIC_SERVER = "wss://xrplcluster.com/"
    const client = new xrpl.Client(PUBLIC_SERVER)
    await client.connect()
    ```


### 3. ウォレットの作成

`xrpl.js` ライブラリには、XRP Ledgerアカウントのキーとアドレスを扱うための "Wallet "クラスが用意されています。Testnetでは、次のようにして新しいウォレットに資金を供給することができます。

{% code-snippet file="/_code-samples/get-started/js/get-acct-info.js" from="// Create a wallet" before="// Get info" language="js" /%}

キーを生成するだけであれば、次のように新しいWalletインスタンスを作成することができます。

```js
const test_wallet = xrpl.Wallet.generate()
```

また、[base58][]でエンコードされたシードをすでに持っている場合は、次のようにしてそのシードからWalletをインスタンス化することができます。

```js
const test_wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9") // テスト用シークレット、本番環境では使用しないでください
```

### 4. XRP Ledgerの参照

クライアントの`request()`メソッドを使って、XRP Ledgerの[WebSocket API](../../references/http-websocket-apis/api-conventions/request-formatting.md)にアクセスします。例えば、以下のようになります。

{% code-snippet file="/_code-samples/get-started/js/get-acct-info.js" from="// Get info" before="// Listen to ledger close events" language="js" /%}


### 5. イベントのListen

XRP Ledgerの[コンセンサス プロセス](../../concepts/consensus-protocol/index.md)が新しい[レジャーバージョン](../../concepts/ledgers/index.md)を生成したときなど、`xrpl.js`ではさまざまなタイプのイベントのハンドラを設定することができます。そのためには、まず[subscribeメソッド][]を呼び出して欲しいイベントの種類を取得し、クライアントの`on(eventType, callback)`メソッドを使ってイベントハンドラをアタッチします。

{% code-snippet file="/_code-samples/get-started/js/get-acct-info.js" from="// Listen to ledger close events" before="// Disconnect when done" language="js" /%}


## 作り続けましょう

これで、`xrpl.js`を使って、XRP Ledgerに接続したり、ウォレットを生成したり、アカウントの情報を調べたりする方法がわかりました。
次のようなことも可能です。

* [XRPの送信](../how-tos/send-xrp.md).
* [代替可能トークンの発行](../how-tos/use-tokens/issue-a-fungible-token.md)
* アカウントに[安全な署名](../../concepts/transactions/secure-signing.md) を設定する。


## 関連記事

- **概念:**
    - [XRP Ledger Overview](/about/)
    - [クライアントライブラリ](../../references/client-libraries.md)
- **Tutorials:**
    - [XRPの送信](../how-tos/send-xrp.md)
- **References:**
    - [`xrpl.js` リファレンス](https://js.xrpl.org/)
    - [Public API Methods](../../references/http-websocket-apis/public-api-methods/index.md)
    - [API規約](../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 エンコード](../../references/protocol/data-types/base58-encodings.md)
    - [トランザクションフォーマット](../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
