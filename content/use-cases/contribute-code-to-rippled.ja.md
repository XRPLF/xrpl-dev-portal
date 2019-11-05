# rippledへのコードの提供

XRP Ledgerを管理するピアツーピアのコアサーバーである`rippled`の機能向上のために、コードまたはバグレポートを提供いただけますか? 以下は、コードと機能性の迅速なレビューの実現に向けたロードマップです。

<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
## [`rippled`リポジトリにアクセスする](https://github.com/ripple/rippled)

`rippled` はオープンソースプロジェクトです。`rippled`のコードを参照するには、`rippled` GitHubリポジトリにアクセスします。バグの報告またはご協力いただく前に、以下の作業を行いコードと開発者の作業を理解することをお勧めします。


<span class="use-case-step-num">{{n.next()}}</span>
## [`rippled`サーバーを設定、実行する](manage-the-rippled-server.html)

`rippled`サーバーを設定および実行して、XRP Ledgerを管理するこのピアツーピアのコアサーバーの開発者の作業と機能を理解します。誰もが自身の`rippled`サーバーを運用して、ネットワークをフォローし、XRP Ledgerの完全なコピーを保持できます。


<span class="use-case-step-num">{{n.next()}}</span>
## [XRP Ledger統合ツールを試す](get-started-with-the-rippled-api.html)

XRP Ledgerとの統合を支援するさまざまなツールがあります。WebSocketおよびJSON-RPC APIエンドポイントから`ripple-lib` JavaScriptライブラリまで、開発者コミュニティに提供されているさまざまな統合ツールを試してみてください。


<span class="use-case-step-num">{{n.next()}}</span>
## [サンドボックスXRP Ledgerアカウントを取得する](xrp-test-net-faucet.html)

XRP Ledger Test Netを使用してサンドボックスアカウントを取得します。`rippled server`をTest Netに接続し、テストコールを実行してXRP Ledgerに慣れましょう。


<span class="use-case-step-num">{{n.next()}}</span>
## 開発環境を設定する

`rippled`開発環境は、C++コンパイラー、`rippled`のコンパイルに必要なライブラリ（Boostなど）へのアクセス、ソースファイルを変更するためのエディターを提供します。[`rippled`リポジトリ](https://github.com/ripple/rippled)で、最新の推奨ツールを確認してください。また、各自でGitHubの`rippled`リポジトリの専用フォークを作成してください。これにより、公式リポジトリへプルリクエストを発行できるようになります。 <!-- for future, awaiting links to a few rippled repo md files - Nik -->


<span class="use-case-step-num">{{n.next()}}</span>
## [`rippled`のコーディングスタイルを理解する](https://github.com/ripple/rippled/blob/develop/docs/CodingStyle.md)

`rippled`にコードを提供する前に、`rippled`リポジトリで使用されているコーディング基準を理解しておいてください。コーディング基準は徐々に進化しており、コードレビューを通じて伝達されます。いくつかの点については、他よりも厳しく適用されます。


<span class="use-case-step-num">{{n.next()}}</span>
## [コードを提供する](https://github.com/ripple/rippled/pulls)

`rippled`を理解できたので、rippledの改善に関するアイデアが浮かんでくることもあるかと思います。XRP Ledgerで開発作業を行っていて、ご使用のアプリケーションに必要な機能をXRP Ledgerが提供できるようにするコードの提供を希望されているかもしれません。`rippled`リポジトリにアクセスして課題やプルリクエストを登録します。


<span class="use-case-step-num">{{n.next()}}</span>
## [バグを報告する](https://github.com/ripple/rippled/issues)

`rippled`を検証する過程で、意図したとおりに機能していないと思われるコードが見つかることがあります。バグを報告するには、`rippled`リポジトリで[課題を登録](https://github.com/ripple/rippled/issues)します。

セキュリティ関連のバグの報告については、Rippleの[Bug Bountyプログラム](https://ripple.com/bug-bounty/)を通じて責任を持ってぜひ公開いただけるようお願い致します。
