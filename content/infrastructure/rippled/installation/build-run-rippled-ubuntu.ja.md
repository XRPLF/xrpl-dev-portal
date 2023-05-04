---
html: build-run-rippled-ubuntu.html
parent: install-rippled.html
blurb: Ubuntu Linuxでrippledを自分でコンパイルします。
labels:
  - コアサーバー
---
# Ubuntuでのrippledの構築と実行

`rippled`は、XRP Ledgerを管理するコアのピアツーピアサーバーです。`rippled`サーバーは、ピアのネットワークに接続し、暗号で署名された取引を中継し、共有のグローバル台帳の完全なローカルコピーを維持します。

`rippled`の概要については、[Operating rippled Servers](install-rippled.html)を参照してください。

次の手順を使用し、Ubuntu Linux上で、`rippled`実行可能ファイルを構築します。これらの手順は、Ubuntu 18.04 LTSでテスト済みです。

その他のプラットフォームでの`rippled`の構築については、`rippled` GitHubリポジトリの[Builds](https://github.com/ripple/rippled/tree/develop/Builds)を参照してください。


## 前提条件

`rippled`をコンパイルまたはインストールする前に、[システム要件](system-requirements.html)を満たす必要があります。

## 1. `rippled`の構築

次の手順では、UbuntuのAPT（Advanced Packaging Tool）を使用し、`rippled`の構築と実行に必要なソフトウェアをインストールします。

1. `apt-get`でインストールまたはアップグレードできるパッケージのリストを更新します。

        sudo apt-get update

2. 現在インストールされているパッケージをアップグレードします。

        sudo apt-get -y upgrade

3. 依存関係をインストールします。

        sudo apt-get -y install git pkg-config protobuf-compiler libprotobuf-dev libssl-dev wget

4. CMakeをインストールします。

   `rippled`のバージョン1.9.0は、CMake 3.16.3以降を必要とします。

   CMake 3.16.3をインストールするには、以下を実行します。

        wget https://github.com/Kitware/CMake/releases/download/v3.16.3/cmake-3.16.3-Linux-x86_64.sh
        sudo sh cmake-3.16.3-Linux-x86_64.sh --prefix=/usr/local --exclude-subdir

   `cmake --version`を使用し、正常にインストールされたことを確認します。

5. Boostをコンパイルします。

    `rippled`のバージョン1.9.0は、Boostライブラリを必要とします、Boostバージョン1.71.0から1.77.0と互換性があります。 Ubuntu 18.04（または20.04）ソフトウェアリポジトリに互換性なBoostバージョンがないため、自分でコンパイルする必要があります。（次の例では、執筆時点の最新バージョンであるBoost 1.75.0を使用しています。）
   以前に`rippled`用にBoost 1.75.0をインストールしていて、`BOOST_ROOT`環境変数を構成した場合には、このステップはスキップできます。

   1. Boost 1.75.0をダウンロードします。

           wget https://boostorg.jfrog.io/artifactory/main/release/1.75.0/source/boost_1_75_0.tar.gz

   2. `boost_1_75_0.tar.gz`を抽出します。

           tar xvzf boost_1_75_0.tar.gz

   3. 新しい`boost_1_75_0`ディレクトリーに移動します。

           cd boost_1_75_0

   4. 使用するBoost.Buildシステムを準備します。

           ./bootstrap.sh

   5. 個別にコンパイルされたBoostライブラリを構築します。ハードウェアの仕様にもよりますが、これには約10分かかります。

           ./b2 -j 4

      **ヒント:** この例では、4つのプロセスを並行して構築します。使用する最適なプロセス数は、お使いのハードウェアで使用可能なCPUコア数によって異なります。`cat /proc/cpuinfo`を使用して、ハードウェアプロセッサーに関する情報を取得できます。

   6. `BOOST_ROOT`環境変数を、新しい`boost_1_75_0`ディレクトリーを参照するように設定します。ログイン時に自動的に設定されるようにするため、この環境変数を、シェル用の`.profile`またはそれに相当するファイルに入れることをお勧めします。ファイルに次の行を追加します。

           export BOOST_ROOT=/home/my_user/boost_1_75_0

   7. 更新した`.profile`ファイルを読み込みます。例:

           source ~/.profile

6. 作業ディレクトリーから、`rippled`ソースコードを取得します。`master`ブランチに最新のリリースバージョンがあります。

        git clone https://github.com/ripple/rippled.git
        cd rippled
        git checkout master

7. コミットログを調べ、正しいバージョンをコンパイルしていることを確認します。最新のコミットは、よく知られるRipple開発者によって署名され、バージョン番号が最新のリリースバージョンに設定されています。[`rippled`のリリースアナウンスは](https://xrpl.org/blog/label/rippled-release-notes.html)そのリリースの最新のコミットを示す。

        $ git log -1


8. 以前に`rippled`を構築したことがある場合、または（そしてもっと重要なのは）構築しようとして失敗したことがある場合には、クリーンな状態から開始するために、次のステップに移る前に`my_build/`ディレクトリー（またはユーザーが付けた名前）を削除する必要があります。このディレクトリーを削除しないと、セグメンテーションエラー（segfault）が原因で`rippled`実行可能ファイルがクラッシュするなど、予期しない動作が発生することがあります。

   `rippled` 1.0.0以上を構築するのが初めての場合には、`my_build/`ディレクトリーはないため、次のステップに進むことができます。

9. CMakeを使用して、ソースコードから`rippled`バイナリー実行可能ファイルを構築します。その結果、`my_build`ディレクトリーに`rippled`バイナリー実行可能ファイルが構築されます。

   1. ビルドシステムを生成します。ビルドは、ソースツリールートとは別のディレクトリーで実行します。この例では、`rippled`のサブディレクトリーである`my_build`ディレクトリーを使用します。

           mkdir my_build
           cd my_build
           cmake ..

      **ヒント:** デフォルトのビルドには、本番環境では有用ではないものの、開発環境に便利なデバッグ記号が含まれています。`rippled`を本番環境用サーバーで使用するには、`cmake`コマンドの実行時に`-DCMAKE_BUILD_TYPE=Release`フラグを追加します。

   2. `rippled`のバイナリー実行可能ファイルを構築します。ハードウェアの仕様にもよりますが、これには約30分かかります。

           cmake --build .

10. _（省略可能）_`rippled`ユニットテストを実行します。テストエラーがない場合には、`rippled`実行可能ファイルがほぼ確実に正しくコンパイルされています。

        ./rippled -u


## 2. `rippled`の構成

`rippled`を正常に起動させるために必要な以下の構成を行います。その他の構成はすべて省略可能であり、作業サーバーをセットアップしてから調整することもできます。

1. `rippled`フォルダーに移動して、サンプル構成ファイルのコピーを作成します。構成ファイルをこの場所に保存すると、`rippled`を非ルートユーザーとして実行できます（推奨）。

        mkdir -p ~/.config/ripple
        cp cfg/rippled-example.cfg ~/.config/ripple/rippled.cfg

2. 構成ファイルを編集し、必要なファイルパスを設定します。`rippled`を実行するユーザーは、ここで指定するすべてのパスへの書き込み権限を持っている必要があります。

   1. `[node_db]`のパスを、台帳データベースを保存する場所に設定します。

   2. `[database_path]`を、その他のデータベースデータを保存する場所に設定します。（この場所には、構成データを持つSQLiteデータベースも含まれ、通常、`[node_db]`パスフィールドの1つ上のレベルになります。）

   3. `[debug_logfile]`を`rippled`がログ情報を書き込めるパスに設定します。

3. サンプルの`validators.txt`ファイルを`rippled.cfg`と同じフォルダーに保存します。

        cp cfg/validators-example.txt ~/.config/ripple/validators.txt

   **警告:** `validators.txt`のファイルはあなたのサーバーがレジャーを検証する判断の為の設定を含まれています。　バリデータの設定に注意しない変更を加えると、サーバーがネットワークから分岐し、古い、不完全、または正しくないデータについて報告する原因となることがあります。そのようなデータを使用すると、経費の無駄になります。


## 3. `rippled`の実行

定義した構成を使用し、構築した実行可能ファイルからストック`rippled`サーバーを実行するには、以下を実行します。

```sh
./rippled
```


### ターミナルに表示される内容

`rippled`を実行するとターミナルに表示される内容の抜粋を以下に示します。

```text
Loading: "/home/ubuntu/.config/ripple/rippled.cfg"
Watchdog: Launching child 1
2018-Jun-06 00:51:35.094331139 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads.
2018-Jun-06 00:51:35.100607625 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
2018-Jun-06 00:51:35.101226904 Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC is supported.
2018-Jun-06 00:51:35.101354503 Amendments:DBG Amendment 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE is supported.
2018-Jun-06 00:51:35.101503304 Amendments:DBG Amendment 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 is supported.
2018-Jun-06 00:51:35.101624717 Amendments:DBG Amendment 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 is supported.
...
2018-Jun-06 00:51:35.106970906 OrderBookDB:DBG Advancing from 0 to 3
2018-Jun-06 00:51:35.107158071 OrderBookDB:DBG OrderBookDB::update>
2018-Jun-06 00:51:35.107380722 OrderBookDB:DBG OrderBookDB::update< 0 books found
2018-Jun-06 00:51:35.168875072 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBARBMi2MC3LJYuvs9Rhp94WcfbxoQD5BGhwN3jaHBsPkbNpoZq;Seq: 1;
2018-Jun-06 00:51:35.172099325 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHB57Sey9QgaB8CubTPvMZLkLAzfJzNMWBCCiDRgazWJujRdnz13;Seq: 1;
2018-Jun-06 00:51:35.175302816 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHDsPCxoBHZS9KNNfsd7iVaQXBSitNtbqXfB6BS1iEmJwwEKLhhQ;Seq: 1;
2018-Jun-06 00:51:35.178486951 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBQ3CT3EWYZ4uzbnL3k6TRf9bBPhWRFVcK1F5NjtwCBksMEt5yy;Seq: 2;
2018-Jun-06 00:51:35.181681868 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHU5egMCYs1g7YRVKrKjEqVYFL12mFWwkqVFTiz2Zi4Z8jppPgxU;Seq: 2;
2018-Jun-06 00:51:35.184864291 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBbiP5ua5dUqCTz5i5vd3ia9jg3KJthohDjgKxnc7LxtmnauW7Z;Seq: 2;
...
2018-Jun-06 00:51:35.317972033 LedgerConsensus:NFO Entering consensus process, watching, synced=no
2018-Jun-06 00:51:35.318155351 LedgerConsensus:NFO Consensus mode change before=observing, after=observing
2018-Jun-06 00:51:35.318360468 NetworkOPs:DBG Initiating consensus engine
2018-Jun-06 00:51:35.358673488 Server:NFO Opened 'port_rpc_admin_local' (ip=127.0.0.1:5005, admin IPs:127.0.0.1, http)
2018-Jun-06 00:51:35.359296222 Server:NFO Opened 'port_peer' (ip=0.0.0.0:51235, peer)
2018-Jun-06 00:51:35.359778994 Server:NFO Opened 'port_ws_admin_local' (ip=127.0.0.1:6006, admin IPs:127.0.0.1, ws)
2018-Jun-06 00:51:35.360240190 Application:FTL Startup RPC:
{
	"command" : "log_level",
	"severity" : "warning"
}
...
2018-Jun-06 00:52:32.385295633 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jun-06 00:52:32.388552023 LedgerConsensus:WRN Need consensus ledger 84726E8C5B346E28C21ADE6AAD703E65F802322EDAA5B76446A4D0C5206AB2DB
2018-Jun-06 00:52:33.379448561 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=wrongLedger
2018-Jun-06 00:52:33.379541915 LedgerConsensus:WRN 84726E8C5B346E28C21ADE6AAD703E65F802322EDAA5B76446A4D0C5206AB2DB to 1720162AE3BA8CD953BFB40EB746D7B78D13E1C97905E8C553E0B573F1B6A517
2018-Jun-06 00:52:33.379747629 LedgerConsensus:WRN {"accepted":true,"account_hash":"CC1F1EC08E76BC9FE843BBF9C6068C5B73192E6957B9CC1174DCB2B94DD2025A","close_flags":0,"close_time":581561550,"close_time_human":"2018-Jun-06 00:52:30.000000000","close_time_resolution":30,"closed":true,"hash":"94354A7FECAB638C29BBC79B18CFDBDC05E4FF72647AD62F072DB4D23A5E0317","ledger_hash":"94354A7FECAB638C29BBC79B18CFDBDC05E4FF72647AD62F072DB4D23A5E0317","ledger_index":"3","parent_close_time":581561490,"parent_hash":"80BF92A69F65F5C543E962DF4B41715546FDD97FC6988028E5ACBB46654756CA","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
...
2018-Jun-06 00:53:50.568965045 LedgerConsensus:WRN {"accepted":true,"account_hash":"A79E6754544F9C8FC74870C95A39CED1D45CC1206DDA4C113E51F9DB6DDB0E76","close_flags":0,"close_time":581561630,"close_time_human":"2018-Jun-06 00:53:50.000000000","close_time_resolution":10,"closed":true,"hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","ledger_hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","ledger_index":"29","parent_close_time":581561623,"parent_hash":"5F57870CE5160D6B53271955F26E3BE63696D1127B91BC7943F9A199B313CB85","seqNum":"29","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
2018-Jun-06 00:53:50.569776678 LedgerConsensus:WRN Need consensus ledger 6A0DE66550B6BA9636E3F8FDB71C2E924D182A1835E4143B2170DAA1D33CAE8D
2018-Jun-06 00:53:51.576778862 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jun-06 00:53:53.576524564 LedgerConsensus:WRN View of consensus changed during establish status=establish,  mode=wrongLedger
2018-Jun-06 00:53:53.576783663 LedgerConsensus:WRN 6A0DE66550B6BA9636E3F8FDB71C2E924D182A1835E4143B2170DAA1D33CAE8D to 1CB9C9A1C27403CBAB9DFCFA61E1F915059DFE4FA93524537B885CC190DB5C6B
2018-Jun-06 00:53:53.577079124 LedgerConsensus:WRN {"accepted":true,"account_hash":"5CAB3E4F5F2AC1A764106D7CC0729E6E7D1F7F93C65B7D8CB04C8DE2FC2C1305","close_flags":0,"close_time":581561631,"close_time_human":"2018-Jun-06 00:53:51.000000000","close_time_resolution":10,"closed":true,"hash":"201E147BD195CE3C56B0C0B8DF58386FC7BFF450E1E5B286A29AB856926D5F79","ledger_hash":"201E147BD195CE3C56B0C0B8DF58386FC7BFF450E1E5B286A29AB856926D5F79","ledger_index":"30","parent_close_time":581561630,"parent_hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","seqNum":"30","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```


## 次のステップ

* これでストック`rippled`サーバーを実行できたので、次に検証サーバーとして実行してみましょう。検証サーバーの詳細について、そして検証サーバーを実行する理由については、[rippledのセットアップチュートリアル](install-rippled.html)を参照してください。

* `rippled` APIを使用して`rippled`サーバーと通信する方法については、[`rippled` APIリファレンス](http-websocket-apis.html)を参照してください。

* 開発のベストプラクティスとして、`rippled` `.deb`パッケージをビルドすることをお勧めします。CMakeビルドのdebパッケージターゲットを使用して、ソースツリーから直接`deb`パッケージをビルドできます。ビルドマシンには[Dockerをインストール](https://docs.docker.com/install/#supported-platforms)している必要があります。このプロセスを完了するのに1時間以上かかる場合があります。`deb`パッケージをビルドするには、以下の手順に従います。

        mkdir -p build/pkg && cd build/pkg
        cmake -Dpackages_only=ON ../..
        cmake --build . --target dpkg

* また、`systemd`をインストールすることもできます。詳細は、[systemd for Upstart Users](https://wiki.ubuntu.com/SystemdForUpstartUsers)を参照してください。[公式の`rippled`システムユニットファイル](https://github.com/ripple/rippled/blob/master/Builds/containers/shared/rippled.service)をそのまま使用するか、ニーズに合わせてファイルを編集して使用できます。

## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [コンセンサスについて](intro-to-consensus.html)
- **チュートリアル:**
    - [rippledの構成](configure-rippled.html)
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
    - [rippled APIの使用開始](get-started-using-http-websocket-apis.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
