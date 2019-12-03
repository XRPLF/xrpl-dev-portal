# macOSでのrippledの構築と実行

現時点において、Rippleでは`rippled`の本番環境にmacOSの使用を推奨していません。本番環境には、最高レベルの品質管理とテストを経た、[Ubuntuプラットフォーム](install-rippled-on-ubuntu-with-alien.html)のご使用をご検討ください。

しかしながら、macOSは多くの開発やテストの作業に適しています。 `rippled` は、10.13 High SierraまでのmacOSでテスト済みです。

開発目的の場合は、`sudo`を使用するのではなく、自身のユーザーとして`rippled`を実行することをお勧めします。

1. [Xcode](https://developer.apple.com/download/)をインストールします。

0. Xcodeコマンドラインツールをインストールします。

        $ xcode-select --install

0. [Homebrew](https://brew.sh/)をインストールします。

        $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

0. Homebrewをアップデートします。

        $ brew update

0. Homebrewを使用して依存関係をインストールします。

        $ brew install git cmake pkg-config protobuf openssl ninja

0. Boost 1.71.0をインストールします。 `rippled` 1.4.0はBoost 1.70以上と互換性を持ちます。

      1. [Boost 1.71.0](https://dl.bintray.com/boostorg/release/1.71.0/source/boost_1_71_0.tar.bz2)をダウンロードします。

      2. フォルダに抽出します。場所をメモしておいてください。

      3. ターミナルで以下を実行します。

            cd /LOCATION/OF/YOUR/BOOST/DIRECTORY
            ./bootstrap.sh
            ./b2 cxxflags="-std=c++14"

0. `BOOST_ROOT`環境変数が、Boostのインストールで作成されたディレクトリーを指すようにします。Boostのインストールディレクトリーを見つけるには、`brew info boost`を使用します。この環境変数を`.bash_profile`ファイルに追加すると、ログイン時に自動的に設定されます。例えば、次のようにします。

        export BOOST_ROOT=/Users/my_user/boost_1_71_0

0. 前のステップで`.bash_profile`ファイルをアップデートした場合には、それを読み込みます。例:

        $ source .bash_profile

0. 希望の場所に`rippled`ソースコードをクローンし、`rippled`ディレクトリーにアクセスします。これを行うには、Git（Homebrewを使用して前にインストール済み）とGitHubを設定する必要があります。例えば、GitHubアカウントを作成し、SSHキーを設定します。詳細は、[Set up git](https://help.github.com/articles/set-up-git/)を参照してください。

        $ git clone git@github.com:ripple/rippled.git
        $ cd rippled

0. デフォルトでは、クローンを実行すると`develop`ブランチに移動します。開発作業をしていて、未テストの機能の最新セットを使用したい場合にはこのブランチを使用します。

      最新の安定したリリースを使用したい場合には、`master`ブランチをチェックアウトします。

        $ git checkout master

      最新のリリース候補をテストしたい場合には、`release`ブランチをチェックアウトします。

        $ git checkout release

      または、[GitHub](https://github.com/ripple/rippled/releases)にリストされたタグ付きのリリースをチェックアウトすることもできます。

0. クローンしたばかりの`rippled`ディレクトリー内にビルドディレクトリーを作成し、そこにアクセスします。例:

        $ mkdir my_build
        $ cd my_build

0. `rippled`を構築します。ハードウェアの仕様にもよりますが、これには約5分ほどかかります。

        $ cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Debug ..

      `CMAKE_BUILD_TYPE`を`Debug`または`Release`ビルドタイプに設定できます。標準的な4つの[`CMAKE_BUILD_TYPE`](https://cmake.org/cmake/help/v3.0/variable/CMAKE_BUILD_TYPE.html)の値がすべてサポートされています。

0. CMakeを使用してビルドを実行します。ハードウェアの仕様にもよりますが、これには約10分ほどかかります。

        $ cmake --build .-- -j 4

      **ヒント:** この例では、`-j`パラメーターが`4`に設定されています。これにより、4つのプロセスを使用し、並行してビルドします。使用する最適なプロセス数は、お使いのハードウェアで使用可能なCPUコア数によって異なります。`sysctl -n hw.ncpu`を使用して、CPUのコア数を調べてください。

0. サーバー実行可能ファイルに組み込まれたユニットテストを実行します。ハードウェアの仕様にもよりますが、これには約5分ほどかかります。（省略可能ですが、推奨します）

        $ ./rippled --unittest

0. `rippled` は、`rippled.cfg`構成ファイルの実行を必要とします。`rippled/cfg`に、サンプル構成ファイルの`rippled-example.cfg`があります。このファイルをコピーし、`rippled`を非ルートユーザーとして実行できる場所に`rippled.cfg`という名前で保存します。`rippled`ディレクトリーにアクセスして、以下を実行します。

        $ mkdir -p $HOME/.config/ripple
        $ cp cfg/rippled-example.cfg $HOME/.config/ripple/rippled.cfg

0. `rippled.cfg`を編集し、必要なファイルパスを設定します。`rippled`を実行するユーザーは、ここで指定するすべてのパスへの書き込み権限を持っている必要があります。

      * `[node_db]`パスを、台帳データベースを保存する場所に設定します。

      * `[database_path]`パスを、その他のデータベースデータを保存する場所に設定します。（この場所には、構成データを持つSQLiteデータベースも含まれ、通常、`[node_db]`パスフィールドの1つ上のレベルになります。）

      * `[debug_logfile]`を`rippled`がログ情報を書き込めるパスに設定します。

      `rippled`を正常に起動するために必要な構成はこれだけです。その他の構成はすべて省略可能であり、作業サーバーをセットアップしてから調整することもできます。詳細については、[追加構成](#additional-configuration)を参照してください。

0. `rippled` は、`validators.txt`ファイルの実行を必要とします。`rippled/cfg/`に、サンプルバリデータファイルの`validators-example.txt`があります。このファイルをコピーし、`rippled.cfg`ファイルと同じフォルダーに`validators.txt`という名前で保存します。`rippled`ディレクトリーにアクセスして、以下を実行します。

        $ cp cfg/validators-example.txt $HOME/.config/ripple/validators.txt

      **警告:** Rippleは、安全を第一に考えて分散プランをデザインしました。特にRippleから勧められない限り、移行中に`validators.txt`ファイルを変更しないでください。小さな変更であっても、バリデータの設定に変更を加えると、サーバーがネットワークから分岐し、古い、不完全、または正しくないデータについて報告する原因となることがあります。そのようなデータを使用すると、経費の無駄になります。

0. ビルドディレクトリー（`my_build`など）にアクセスし、`rippled`サービスを開始します。

        $ ./rippled

      以下は、ターミナルに表示される内容の抜粋です。

```
      2018-Oct-26 18:21:39.593738 JobQueue:NFO Auto-tuning to 6 validation/transaction/proposal threads.
      2018-Oct-26 18:21:39.599634 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
      2018-Oct-26 18:21:39.599874 Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC is supported.
      2018-Oct-26 18:21:39.599965 Amendments:DBG Amendment 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE is supported.
      2018-Oct-26 18:21:39.600024 Amendments:DBG Amendment 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 is supported.
      ...
      2018-Oct-26 18:21:39.603201 OrderBookDB:DBG Advancing from 0 to 3
      2018-Oct-26 18:21:39.603291 OrderBookDB:DBG OrderBookDB::update>
      2018-Oct-26 18:21:39.603480 OrderBookDB:DBG OrderBookDB::update< 0 books found
      2018-Oct-26 18:21:39.649617 ValidatorList:DBG Loading configured trusted validator list publisher keys
      2018-Oct-26 18:21:39.649709 ValidatorList:DBG Loaded 0 keys
      2018-Oct-26 18:21:39.649798 ValidatorList:DBG Loading configured validator keys
      2018-Oct-26 18:21:39.650213 ValidatorList:DBG Loaded 5 entries
      2018-Oct-26 18:21:39.650266 ValidatorSite:DBG Loading configured validator list sites
      2018-Oct-26 18:21:39.650319 ValidatorSite:DBG Loaded 0 sites
      2018-Oct-26 18:21:39.650829 NodeObject:DBG NodeStore.main target size set to 131072
      2018-Oct-26 18:21:39.650876 NodeObject:DBG NodeStore.main target age set to 120000000000
      2018-Oct-26 18:21:39.650931 TaggedCache:DBG LedgerCache target size set to 256
      2018-Oct-26 18:21:39.650981 TaggedCache:DBG LedgerCache target age set to 180000000000
      2018-Oct-26 18:21:39.654252 TaggedCache:DBG TreeNodeCache target size set to 512000
      2018-Oct-26 18:21:39.654336 TaggedCache:DBG TreeNodeCache target age set to 90000000000
      2018-Oct-26 18:21:39.674131 NetworkOPs:NFO Consensus time for #3 with LCL AF8D8984A226AE7099D8A9749B09CE1D84360D5AF9FB86CE2F37500FE1009F9D
      2018-Oct-26 18:21:39.674271 ValidatorList:DBG 5  of 5 listed validators eligible for inclusion in the trusted set
      2018-Oct-26 18:21:39.674334 ValidatorList:DBG Using quorum of 4 for new set of 5 trusted validators (5 added, 0 removed)
      2018-Oct-26 18:21:39.674400 LedgerConsensus:NFO Entering consensus process, watching, synced=no
      2018-Oct-26 18:21:39.674475 LedgerConsensus:NFO Consensus mode change before=observing, after=observing
      2018-Oct-26 18:21:39.674539 NetworkOPs:DBG Initiating consensus engine
      2018-Oct-26 18:21:39.751225 Server:NFO Opened 'port_rpc_admin_local' (ip=127.0.0.1:5005, admin IPs:127.0.0.1, http)
      2018-Oct-26 18:21:39.751515 Server:NFO Opened 'port_peer' (ip=0.0.0.0:51235, peer)
      2018-Oct-26 18:21:39.751689 Server:NFO Opened 'port_ws_admin_local' (ip=127.0.0.1:6006, admin IPs:127.0.0.1, ws)
      2018-Oct-26 18:21:39.751915 Application:FTL Startup RPC:
      {
      	"command" : "log_level",
      	"severity" : "warning"
      }
      2018-Oct-26 18:21:39.752079 Application:FTL Result: {}
      2018-Oct-26 18:22:33.013409 NetworkOPs:WRN We are not running on the consensus ledger
      2018-Oct-26 18:22:33.013875 LedgerConsensus:WRN Need consensus ledger 81804C95ADE119CC874572BAF24DB0C0D240AC58168597951B0CB64C4DA2C628
      2018-Oct-26 18:22:33.883648 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=wrongLedger
      2018-Oct-26 18:22:33.883815 LedgerConsensus:WRN 81804C95ADE119CC874572BAF24DB0C0D240AC58168597951B0CB64C4DA2C628 to 9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1
      2018-Oct-26 18:22:33.884068 LedgerConsensus:WRN {"accepted":true,"account_hash":"BBA0E7273005D42E5548DD6456E5AD1F7C89B6EDCB01881E1EECD393E8545947","close_flags":0,"close_time":593893350,"close_time_human":"2018-Oct-26 18:22:30.000000","close_time_resolution":30,"closed":true,"hash":"9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1","ledger_hash":"9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1","ledger_index":"3","parent_close_time":593893290,"parent_hash":"AF8D8984A226AE7099D8A9749B09CE1D84360D5AF9FB86CE2F37500FE1009F9D","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
      2018-Oct-26 18:23:03.034119 InboundLedger:WRN Want: D901E53926E68EFDA33172DDAC74E8C767D280B68EE68E3010AB0E3179D07B1C
      2018-Oct-26 18:23:03.034334 InboundLedger:WRN Want: 1C01EE79083DE5CE76F3634519D6364C589C4D48631CB9CD10FC2408F87684E2
      2018-Oct-26 18:23:03.034560 InboundLedger:WRN Want: 8CFE3912001BDC5B2C4B2691F3C7811B9F3F193E835D293459D80FBF1C4E684E
      2018-Oct-26 18:23:03.034750 InboundLedger:WRN Want: 8DFAD21AD3090DE5D6F7592B3821C3DA77A72287705B4CF98DC0F84D5DD2BDF8
```

`rippled`ログメッセージの詳細については、[ログメッセージについて](understanding-log-messages.html)を参照してください。

## 次のステップ

{% include '_snippets/post-rippled-install.md' %}<!--_ -->

## 関連項目

- [Ubuntu Linuxでrippledをインストール](install-rippled-on-ubuntu-with-alien.html)（本番環境用の、Ubuntu上の事前構築済みバイナリー）
- [Ubuntuでの`rippled`の構築と実行](build-run-rippled-ubuntu.html)（Ubuntuで`rippled`を自分でコンパイル）
- [その他のプラットフォーム用のコンパイル手順](https://github.com/ripple/rippled/tree/develop/Builds)
