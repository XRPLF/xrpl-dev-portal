# ripple-libへのコードの提供

[RippleAPI](rippleapi-reference.html)の公式クライアントライブラリである`ripple-lib`の機能向上のために、コードまたはバグレポートを提供いただけますか? RippleAPIは、XRP Ledgerとやり取りするためのJavaScript APIです。以下は、コードと機能性の迅速なレビューの実現に向けたロードマップです。


<!-- USE_CASE_STEPS_START -->
{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
## [`ripple-lib`リポジトリにアクセスする](https://github.com/ripple/ripple-lib)

`ripple-lib` はオープンソースプロジェクトです。`ripple-lib`のコードを参照するには、`ripple-lib` GitHubリポジトリにアクセスします。バグの報告またはご協力いただく前に、以下の作業を行いコードと開発者の作業を理解することをお勧めします。


<span class="use-case-step-num">{{n.next()}}</span>
## [`rippled`サーバーを設定して実行する](manage-the-rippled-server.html)

RippleAPIは、XRP Ledgerとやり取りするためのAPIです。`rippled`は、XRP Ledgerを管理するコアのピアツーピアサーバーです。オプションとして、開発者の作業と機能性を理解するために`rippled`サーバーを設定して実行できます。誰もが自身の`rippled`サーバーを運用して、ネットワークをフォローし、XRP Ledgerの完全なコピーを保持できます。


<span class="use-case-step-num">{{n.next()}}</span>
## [Test Net XRP Ledgerアカウントを取得する](xrp-test-net-faucet.html)

XRP Test Net Faucetを使用して、XRP Test Networkでテストアカウントを取得します。`rippled`サーバーを設定している場合は、Test Netに接続してテストコールを実行し、XRP Ledgerに慣れましょう。


<span class="use-case-step-num">{{n.next()}}</span>
## [`ripple-lib`開発環境を設定する](get-started-with-rippleapi-for-javascript.html#環境の設置)

`ripple-lib` ではNode.jsといくつかの依存関係が必要です。[Node.js v10 LTS](https://nodejs.org/en/)および[Yarn](https://yarnpkg.com/en/)などの依存関係管理ツールの使用が推奨されます。また、各自でGitHubの`ripple-lib`リポジトリの専用フォークを作成してください。これにより、公式リポジトリへのプルリクエストを発行できるようになります。


<span class="use-case-step-num">{{n.next()}}</span>
## [最初の`ripple-lib`スクリプトを実行する](get-started-with-rippleapi-for-javascript.html#最初のrippleapiスクリプト)

`get-account-info.js`スクリプトの内容を確認し、このスクリプトを実行します。このスクリプトを使用すると、RippleAPIスクリプトがどのように機能するかを把握し、RippleAPIインターフェイスの動作を検証できます。


<span class="use-case-step-num">{{n.next()}}</span>
## [コードを提供する](https://github.com/ripple/ripple-lib/pulls)

`ripple-lib`を理解すると、その改善に関するアイデアが浮かぶこともあるかと思います。

XRP Ledgerで開発作業を進めておられると思いますが、`ripple-lib`がご使用のアプリケーションに必要な機能を提供できるよう、コードを提供することもできます。

アイデアが必要な場合は、[Help Wantedイシュー](https://github.com/ripple/ripple-lib/issues?utf8=%E2%9C%93&q=label%3A%22help+wanted%22)のリストを参照してください。

`ripple-lib`リポジトリにアクセスして課題やプルリクエストを登録します。


<span class="use-case-step-num">{{n.next()}}</span>
## [バグを報告する](https://github.com/ripple/ripple-lib/issues)

`ripple-lib`を検証していくうちに、意図されているとおりに機能していないと思われるコードが見つかることがあります。バグを報告するには、`ripple-lib`リポジトリで[課題を登録](https://github.com/ripple/ripple-lib/issues)します。

セキュリティ関連のバグの報告については、Rippleの[Bug Bountyプログラム](https://ripple.com/bug-bounty/)を通じて責任を持って是非公開いただけるようお願い致します。
