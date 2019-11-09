# RippleAPI入門ガイド

このチュートリアルでは、[Node.js](http://nodejs.org/)と[RippleAPI](rippleapi-reference.html)（XRP LedgerにアクセスするためのJavaScript API）を使用して、XRP Ledgerに接続されるアプリケーションを開発するための基本事項を説明します。

このガイドで使用しているスクリプトと構成ファイルは、[Ripple開発者ポータルのGitHubリポジトリで入手できます](https://github.com/ripple/ripple-dev-portal/tree/master/content/_code-samples/rippleapi_quickstart)。


<!--#{ keep multiple H1s so that all steps are surfaced in sidebar. Do not change H1 titles unless they provide a clear improvement bc they are linked to on external sites. }# -->
# 環境の設置

RippleAPIを使用するための最初のステップは、開発環境の設置です。



## Node.jsとnpmのインストール

RippleAPIはNode.jsランタイム環境向けのアプリケーションとして構築されているため、最初のステップはNode.jsのインストールです。RippleAPIでは、Node.js v6以降が必要です。Node.js v10 LTSを使用することをお勧めします。

このステップは、オペレーティングシステムによって内容が異なります。使用しているオペレーティングシステムの[パッケージマネージャーを使用してNode.jsをインストールする場合の公式の手引き](https://nodejs.org/en/download/package-manager/)に準拠することをお勧めします。Node.jsとnpm（Node Package Manager）のパッケージが分かれている場合、両方をインストールします（これに該当するのは、Arch Linux、CentOS、Fedora、RHELの場合です）。

Node.jsのインストール後、`node`バイナリーのバージョンはコマンドラインから確認できます。

```
node --version
```

プラットフォームによっては、バイナリーの名前が`nodejs`となっています。

```
nodejs --version
```



## Yarnのインストール

RippleAPIでは、Yarnを使用して依存関係を管理します。Yarn v1.13.0を使用することをお勧めします。

このステップは、オペレーティングシステムによって内容が異なります。使用しているオペレーティングシステムの[パッケージマネージャーを使用してYarnをインストールする場合の公式の手引き](https://yarnpkg.com/en/docs/install#mac-stable)に準拠することをお勧めします。

Yarnのインストール後、`yarn`バイナリーのバージョンはコマンドラインから確認できます。

```
yarn --version
```



## RippleAPIと依存関係のインストール

以下のステップに従い、Yarnを使用してRippleAPIと依存関係のインストールを完了します。


### 1. プロジェクトの新規ディレクトリーを作成

`my_ripple_experiment`といった名前でフォルダーを作成します。

```
mkdir my_ripple_experiment && cd my_ripple_experiment
```

コードに対する変更を追跡できるよう、このディレクトリーに[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)リポジトリーを作成します（省略可）。

```
git init
```

作業内容のバージョン管理や共有を目的として、[GitHubにリポジトリーを作成](https://help.github.com/articles/create-a-repo/)してもかまいません。設置後、ローカルマシンに[リポジトリーのクローンを作成](https://help.github.com/articles/cloning-a-repository/)し、そのディレクトリーに`cd`します。


### 2. プロジェクトの新規`package.json`ファイルを作成

次の内容が含まれている、以下のテンプレートを使用します。

- RippleAPI自体（`ripple-lib`）
- （省略可）コード品質を確認するための[ESLint](http://eslint.org/)（`eslint`）

```
{% include '_code-samples/rippleapi_quickstart/package.json' %}
```


### 3. Yarnを使用してRippleAPIと依存関係をインストール

Yarnを使用して、プロジェクトで作成した`package.json`ファイルに定義されているRippleAPIと依存関係をインストールします。

```
yarn
```

これで、RippleAPIと依存関係がローカルフォルダー`node_modules/`にインストールされます。

インストールプロセスの終了時に、いくつかの警告が表示される場合があります。以下の警告は無視してかまいません。

```
warning eslint > file-entry-cache > flat-cache > circular-json@0.3.3: CircularJSON is in maintenance only, flatted is its successor.

npm WARN optional Skipping failed optional dependency /chokidar/fsevents: 

npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
```



# 最初のRippleAPIスクリプト

スクリプト`get-account-info.js`は、ハードコーディングされたアカウントに関する情報をフェッチします。このスクリプトを使用して、RippleAPIが動作することをテストします。

```
{% include '_code-samples/rippleapi_quickstart/get-account-info.js' %}
```



## スクリプトの実行

以下のコマンドを使用して、最初のRippleAPIスクリプトを実行します。

```
node get-account-info.js
```

出力:

```
getting account info for rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
{ sequence: 359,
  xrpBalance: '75.181663',
  ownerCount: 4,
  previousInitiatedTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionLedgerVersion: 18489336 }
getAccountInfo done
done and disconnected.
```



## スクリプトの内容解説

このスクリプトでは、RippleAPI固有のコードに加え、JavaScriptにおける近年の開発成果である構文や規定も利用しています。今回のサンプルコードを小さめのチャンクに分割して、個別に説明していきます。


### スクリプトの冒頭

```
'use strict'; 
const RippleAPI = require('ripple-lib').RippleAPI;
```

先頭行では、[strictモード](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)を有効にしています。このモードを使用するかどうかは任意に選択できますが、JavaScriptで陥りやすいいくつかの落とし穴を回避する上で役立ちます。

2行目では、Node.jsのrequire関数を使用して、RippleAPIを現在のスコープにインポートしています。RippleAPIは、[`ripple-lib`がエクスポートするモジュール](https://github.com/ripple/ripple-lib/blob/develop/src/index.ts)の1つです。


### APIのインスタンス化

```
const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
```

このセクションでは、RippleAPIクラスの新規インスタンスを作成し、変数`api`に代入しています（[`const`キーワード](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)は、値`api`を何らかの別の値に再代入できないことを意味します。ただし、オブジェクトの内部状態は変化する可能性があります）。

コンストラクターへの引数の1つはoptionsオブジェクトであり、このオブジェクトには[さまざまなオプション](rippleapi-reference.html#parameters)が用意されています。`server`パラメーターでは、どの`rippled`サーバーに接続するのかを指定しています。

- この`server`設定例では、セキュアなWebSocket接続を使用して、Ripple社が運営している公開サーバーの1つに接続しています。
- `server`オプションを記述しない場合、RippleAPIは、ネットワーク接続の不要なメソッドのみが提供される[オフラインモード](rippleapi-reference.html#offline-functionality)で実行されます。
- 代わりに[Rippleテストネット](https://ripple.com/build/ripple-test-net/)サーバーを指定すると、本番環境のXRP Ledgerではなく、別空間のテストネットワークに接続できます。
- [独自の`rippled`を運用している](install-rippled.html)場合は、ローカルサーバーに接続するよう指示できます。例えば、代わりに`server: 'ws://localhost:5005'`と記述します。


### 接続とPromise

```
api.connect().then(() => {
```

[connect()メソッド](rippleapi-reference.html#connect)は、特殊なJavaScriptオブジェクトである[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を返す多くのRippleAPIメソッドの1つです。Promiseは、XRP Ledgerを照会するなど、値を後ほど返す非同期操作の実行を目的としています。

何らかの式（`api.connect()`など）からPromiseが返された場合、Promiseの`then`メソッドを呼び出して、コールバック関数を渡します。関数を引数として渡すことはJavaScriptでは常套的な手法であり、JavaScriptの関数が[第一級オブジェクト](https://en.wikipedia.org/wiki/First-class_function)であることを利用しています。

Promiseは、自身の非同期動作を完了すると、渡されたコールバック関数を実行します。`then`メソッドからの戻り値は別のPromiseオブジェクトであるため、別の`then`メソッドへの、または同様にコールバックを受け付けるPromiseの`catch`メソッドへの「チェーン」にすることができます。`catch`に渡すコールバックは、何らかの問題が生じた場合に呼び出されます。

この例では、非同期関数を手軽に定義できる手段である[arrow関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)を使用しています。この方法は、1回限りの関数をコールバックとして大量に定義する場合に便利です。`()=> {...}`という構文は、 {...}/>`function() {...}`とほぼ等価です。パラメーターを1つ取る非同期関数が必要な場合は、代わりに`info => {...}`などの構文を使用できます。この構文は、 {...}/>`function(info) {...}`という構文とほぼ同一です。


### カスタムコード

```
  /* begin custom code ------------------------------------ */
  const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'; 

  console.log('getting account info for', myAddress); 
  return api.getAccountInfo(myAddress); 

}).then(info => {
  console.log(info); 
  console.log('getAccountInfo done'); 

  /* end custom code -------------------------------------- */
```

ここが、スクリプトで実行する処理を記述するために変更を加える部分です。

このサンプルコードでは、XRP Ledgerアカウントのアドレスを使用してXRP Ledgerアカウントを参照しています。さまざまなアドレスを指定してコードを実行し、結果が変化することを確認してみてください。

`console.log()`関数はNode.jsとWebブラウザーの両方に組み込まれているもので、結果をコンソールに出力します。この例では大量のコンソール出力を得られるので、コードによって実行される処理の内容を簡単に理解できます。

このサンプルコードは、（RippleAPIが接続を終了した時点で呼び出される）コールバック関数の中が始点となっています。その関数がRippleAPIの[`getAccountInfo`](rippleapi-reference.html#getaccountinfo)メソッドを呼び出すと、結果が返されます。

`getAccountInfo` APIメソッドは別のPromiseを返すものであるため、`}).then( info => {`の行で、このPromiseの非同期処理が完了した時点で実行される別の非同期コールバック関数を定義しています。前述の例とは異なり、このコールバック関数は、`getAccountInfo` APIメソッドからの非同期戻り値を保持する`info`という引数を1つ取ります。このコールバック関数の残りの部分は、その戻り値をコンソールに出力するものです。


### クリーンアップ

```
}).then(() => {
  return api.disconnect(); 
}).then(() => {
  console.log('done and disconnected.'); 
}).catch(console.error);
```

サンプルコードの残りの部分は、概ね[ボイラープレートコード](rippleapi-reference.html#boilerplate)としての性質を持ちます。1行目は前のコールバック関数を終了するもので、次に、終了時に実行される別のコールバックへのチェーンを作成しています。そのメソッドはXRP Ledgerからの明示的な切断を実行し、終了時にコンソールへの書き込みを実行する別のコールバックが記述されています。スクリプトで[RippleAPIイベント](rippleapi-reference.html#api-events)を待機する場合は、イベントの待機を終了するまで切断を実行しないでください。

`catch`メソッドで、このPromiseチェーンを終了します。ここに記述しているコールバックは、いずれかのPromiseまたはそのコールバック関数でエラーが発生した場合に実行されます。ここでは、カスタムのコールバックを定義するのではなく、コンソールへの書き込みを実行する標準の`console.error`関数を渡しています。より高機能のコールバック関数をここに定義して、特定のタイプのエラーをインテリジェントにキャッチすることもできます。



# 検証の待機

XRP Ledger（または任意の分散されたシステム）を使用する上で最大の課題の1つとなるのが、最終的かつ不変のトランザクション結果を把握することです。[ベストプラクティスに従っている](reliable-transaction-submission.html)場合も、トランザクションが最終的に受け入れられるか拒否されるまで、[コンセンサスプロセス](https://ripple.com/build/ripple-ledger-consensus-process/)を待機しなければならないことに変わりはありません。以下のサンプルコードは、トランザクションの最終的な結果を待機する方法を示しています。

```
{% include '_code-samples/rippleapi_quickstart/submit-and-verify.js' %}
```

このコードは注文トランザクションを作成して送信するものですが、他のタイプのトランザクションにも同様の原則があてはまります。トランザクションを送信した後、setTimeoutを使用して所定の時間が経過するまで待機し、新しいPromiseでレジャーをもう一度照会して、トランザクションが検証済みとなっているかどうかを確認します。検証済みとなっていない場合は、検証済みレジャーの中にトランザクションが見つかるか、返されたレジャーがLastLedgerSequenceパラメーターの値よりも大きくなるまで、このプロセスを繰り返します。

まれなケースとして（特に、大きな遅延や電源喪失が発生した場合）、トランザクションを送信してから、`maxLedgerVersion`がネットワークから渡されたと判断するまでの間に、レジャーのいずれかのバージョンが`rippled`サーバーで欠落することがあります。この場合、トランザクションが失敗したのか、欠落したバージョンのレジャーに含まれているのかを最終的に確定することはできません。RippleAPIは、この場合、`MissingLedgerHistoryError`を返します。

`rippled`サーバーの管理者である場合は、[欠落しているレジャーを手動で要求できます](ledger_request.html)。管理者でない場合は、別のサーバーを使用してレジャー履歴を確認してみるという方法が考えられます（Rippleは、この目的で、すべての履歴が記録される公開サーバーを`s2.ripple.com`で運用しています）。

詳細は、[信頼できるトランザクションの送信](reliable-transaction-submission.html)を参照してください。



# WebブラウザーでのRippleAPI

RippleAPIは、ブラウザー互換のバージョンをコンパイルし、RippleAPIスクリプトよりも前に[lodash](https://www.npmjs.com/package/lodash)を依存関係として含めた場合、Webブラウザーでも使用できます。



## ブラウザー互換バージョンのRippleAPIのビルド

RippleAPIをブラウザーで使用するには、ブラウザー互換バージョンをビルドする必要があります。以下の手順では、RippleAPIをコンパイルして、Webページに含めることのできる単一のJavaScriptファイルを生成します。


### 1. RippleAPI gitリポジトリーのコピーをダウンロード

[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)がインストールされている場合は、リポジトリーのクローンを作成して、**master**ブランチをチェックアウトできます。このブランチには、常に最新の公式リリースが収められています。

```
git clone https://github.com/ripple/ripple-lib.git
cd ripple-lib
git checkout master
```

または、特定のリリースのアーカイブ（.zipまたは.tar.gz）を[RippleAPIリリースページ](https://github.com/ripple/ripple-lib/releases)からダウンロードし、抽出します。


### 2. Yarnのインストール

[Yarnのインストール](#yarnのインストール)に関する手順に従います。


### 3. Yarnを使用して依存関係をインストール

```
yarn
```


### 4. Gulpを使用して単一のJavaScript出力をビルド

RippleAPIには、[gulp](http://gulpjs.com/)パッケージを使用してすべてのソースコードをコンパイルし、ブラウザー互換バージョンのJavaScriptファイルを生成するためのコードが付属しています。Gulpは依存関係の1つとして自動的にインストールされるため、実行するだけで済みます。RippleAPIの構成上、これは容易に実行できるようになっています。

```
yarn run build
```

出力:

```
> ripple-lib@0.16.5 build /home/username/ripple-lib
> gulp

[14:11:02] Using gulpfile /home/username/ripple-lib/gulpfile.js
[14:11:02] Starting 'build'...
[14:11:03] Starting 'build-debug'...
[14:11:03] Starting 'build-min'...
[14:11:18] Finished 'build-debug' after 15 s
[14:11:18] Finished 'build' after 16 s
[14:11:18] Finished 'build-min' after 15 s
[14:11:18] Starting 'default'...
[14:11:18] Finished 'default' after 19 μs
```

完了までに、しばらく時間がかかる場合があります。最終的に、ビルドプロセスによって、目的のファイルが含まれた新しい`build/`フォルダーが作成されます。

`build/ripple-<VERSION NUMBER>.js`ファイルは、ブラウザーですぐに使用できる（ビルドしたバージョンの）RippleAPIの直接エクスポートです。名前の末尾が`-min.js`のファイルも同じものですが、読み込みを高速化するため、内容が[縮小](https://en.wikipedia.org/wiki/Minification_%28programming%29)されています。



## ブラウザーでのRippleAPIのデモ

以下のHTMLファイルは、RippleAPIのブラウザーバージョンで公開`rippled`サーバーに接続し、そのサーバーに関する情報のレポートを生成するための基本的な使用方法を示しています。Node.jsの「require」構文を使用するのではなく、ブラウザーバージョンを使用して、`RippleAPI`クラスが含まれている`ripple`という名前のグローバル変数を作成します。

この例を使用するには、最初に[RippleAPIのブラウザー互換バージョンをビルド](#ブラウザー互換バージョンのrippleapiのビルド)した後、結果として生成される出力ファイルのいずれかを、このHTMLファイルと同一のフォルダーにコピーします（縮小バージョンとフルサイズバージョンのどちらを使用してもかまいません）。この例にある2番目の`<script>`タグを変更して、ビルドしたバージョンのRippleAPIに対応する適切なファイル名が使用されるようにします。

[**browser-demo.html:**](https://github.com/ripple/ripple-dev-portal/blob/master/content/_code-samples/rippleapi_quickstart/browser-demo.html "Source on GitHub")

```
{% include '_code-samples/rippleapi_quickstart/browser-demo.html' %}
```

このデモHTMLでは、Lodash v4.17.11をCloudflare上のCDNJSから読み込んだ後、ripple-lib v1.1.2を読み込んでいますが、Lodashのバリアントをローカルにダウンロードして読み込んでもかまいません。 <!--#{ no specific recommended or required version at this time. Update this once we have some guidance to provide here. }#-->
