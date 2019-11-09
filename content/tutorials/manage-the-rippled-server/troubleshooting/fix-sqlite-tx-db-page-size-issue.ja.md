# SQLiteトランザクションデータベースのページサイズの問題の解決

全トランザクション履歴（または極めて大量のトランザクション履歴）が記録されている`rippled`サーバーと、0.40.0（2017年1月リリース）よりも古いバージョンの`rippled`で最初に作成されたデータベースでは、SQLiteデータベースのページサイズが原因でサーバーが適切に稼働しなくなる問題が発生する可能性があります。最近のトランザクション履歴のみが保管されているサーバー（デフォルト構成）と、バージョン0.40.0以降の`rippled`でデータベースファイルが作成されているサーバーでは、この問題が発生する可能性はそれほどありません。

このドキュメントでは、この問題の発生時に問題を検出し解決する手順を説明します。

## 背景

`rippled` サーバーではトランザクション履歴のコピーがSQLiteデータベースに保管されます。バージョン0.40.0より古い`rippled`では、このデータベースの容量は約2TBに設定されました。ほとんどの場合はこの容量で十分です。ただし、レジャー32570（本番環境XRP Ledgerの履歴で利用可能な最も古いレジャーバージョン）以降の全トランザクション履歴は、このSQLiteデータベースの容量を超える可能性があります。`rippled`サーバーバージョン0.40.0以降では、これよりも大きな容量でSQLiteデータベースファイルが作成されているため、この問題が発生する可能性は低くなります。

SQLiteデータベースの容量は、データベースの_ページサイズ_パラメーターによって決まります。この容量は、データベース作成後は容易に変更できません。（SQLiteの内部についての詳細は、[SQLite公式ドキュメント](https://www.sqlite.org/fileformat.html)を参照してください。）データベースが保管されているディスクとファイルシステムに空き容量がある場合でも、データベースが容量いっぱいになることがあります。以下の「[解決策](#解決策)」で説明するように、この問題を回避するためにページサイズを再構成するには、時間のかかる移行プロセスが必要です。

**ヒント:** ほとんどの場合、`rippled`サーバーの稼働に全履歴が必要となることはありません。サーバーにトランザクションの全履歴が記録されていれば、長期分析やアーカイブ、または災害に対する事前対策に役立ちます。リソースを大量に消費せずにトランザクション履歴を保管する方法については、[履歴シャーディング](history-sharding.html)を参照してください。


## 検出

サーバーがこの問題に対して脆弱である場合は、次の2種類の方法でこの問題を検出できます。

- ご使用の`rippled`サーバーが[バージョン1.1.0][新規: rippled 1.1.0]以降の場合、（問題が発生する前に）[事前に](#事前の検出)問題を検出できます。
- （サーバーがクラッシュした場合）どの`rippled`バージョンでも、問題を[事後に](#事後の検出)特定できます。

いずれの場合でも、問題を検出するには`rippled`のサーバーログへのアクセスが必要です。

**ヒント:** このデバッグログの位置は、`rippled`サーバーの構成ファイルの設定に応じて異なる可能性があります。[デフォルトの構成](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142)では、サーバーのデバッグログは`/var/log/rippled/debug.log`ファイルに書き込まれます。

### 事前の検出

SQLiteのページサイズの問題を事前に検出するには、 **[rippled 1.1.0][新規: rippled 1.1.0]以上**を実行している必要があります。`rippled`サーバーは、以下のようなメッセージをデバッグログに定期的に（少なくとも2分間隔で）書き込みます。（ログエントリーの正確な数値とトランザクションデータベースへのパスは、ご使用の環境に応じて異なります。）

```text
Transaction DB pathname:/opt/rippled/transaction.db; SQLite page size:1024
 bytes; Free pages:247483646; Free space:253423253504 bytes; Note that this
 does not take into account available disk space.
```

`SQLite page size: 1024 bytes`という値は、トランザクションデータベースが小さいページサイズで構成されており、全トランザクション履歴に対応できる容量がないことを示しています。この値がすでに4096バイト以上の場合、SQLiteデータベースにはすでに全トランザクション履歴を保管できる十分な容量があり、このドキュメントで説明する移行を行う必要はありません。

`rippled`サーバーは、このログメッセージに示されている`Free space`が524288000バイト（500MB）未満になると停止します。空き容量がこのしきい値に近づいている場合は、予期しない停止を回避するために[この問題を解決](#解決策)してください。

### 事後の検出

サーバーのSQLiteデータベース容量をすでに超えている場合には、`rippled`サービスがこの問題を示すログメッセージを書き込み、停止します。

#### rippled 1.1.0以降

`rippled`バージョン1.1.0以降では、サーバーは以下のようなメッセージをサーバーのデバッグログに書き込み、通常の方法でシャットダウンします。

```text
Free SQLite space for transaction db is less than 512MB.To fix this, rippled
 must be executed with the vacuum <sqlitetmpdir> parameter before restarting.
 Note that this activity can take multiple days, depending on database size.
```

#### rippled 1.1.0より前

バージョン1.1.0より前の`rippled`では、サーバーが繰り返しクラッシュし、以下のようなメッセージがサーバーのデバッグログに書き込まれます。

```text
Terminating thread doJob:AcquisitionDone: unhandled
 N4soci18sqlite3_soci_errorE 'sqlite3_statement_backend::loadOne: database or
 disk is full while executing "INSERT INTO [...]
```


## 解決策

この問題を解決するには、このドキュメントで説明する手順に従い、サポートされているLinuxシステムで`rippled`を使用します。[推奨されるハードウェア構成](capacity-planning.html#推奨事項-1)とおおよそ一致するシステムスペックで全履歴を記録するサーバーの場合、このプロセスにかかる日数は2日を超える可能性があります。

### 前提条件

- **[rippledバージョン1.1.0][新規: rippled 1.1.0]以上**を実行している必要があります。

    - このプロセスを開始する前に、安定した最新バージョンに[rippledをアップグレード](install-rippled.html)します。

    - 以下のコマンドを実行して、ローカルにインストールした`rippled`のバージョンを確認できます。

            rippled --version

- `rippled`ユーザーが書き込めるディレクトリーに、トランザクションデータベースの2つめのコピーを一時的に保管するのに十分な空き容量が必要です。この空き容量は、既存のトランザクションデータベースと同じファイルシステムに設ける必要はありません。

    トランザクションデータベースは、構成の`[database_path]`設定で指定されるフォルダーの`transaction.db`ファイルに保管されます。このファイルのサイズを調べ、必要な空き容量を確認できます。次に例を示します。

        ls -l /var/lib/rippled/db/transaction.db

### 移行プロセス

トランザクションデータベースを大きなページサイズに移行するには、以下の手順を実行します。

1. すべての[前提条件](#前提条件)を満たしていることを確認します。

2. 移行プロセスの実行中に一時ファイルを保管するフォルダーを作成します。

        mkdir /tmp/rippled_txdb_migration

3. `rippled`ユーザーに、一時フォルダーの所有権を付与します。これにより、ユーザーは一時フォルダー内のファイルに書き込みできるようになります。（`rippled`ユーザーがすでにアクセス権限を持つ場所に一時フォルダーがある場合は、この操作は不要です。）

        chown rippled /tmp/rippled_txdb_migration

4. 一時フォルダーに、トランザクションデータベースのコピーを保管するのに十分な空き容量があることを確認します。

    たとえば、`df`コマンドの`Avail`出力と、[`transaction.db`ファイルのサイズ](#前提条件)を比較します。

        df -h /tmp/rippled_txdb_migration

        Filesystem      Size  Used Avail Use% Mounted on
        /dev/sda2       5.4T  2.6T  2.6T  50% /tmp

5. `rippled`がまだ稼働している場合は停止します。

        sudo systemctl stop rippled

6. `screen`セッション（または類似のツール）を開き、ログアウトしてもプロセスが停止しないようにします。

        screen

7. `rippled`ユーザーになります。

        sudo su - rippled

8. 一時ディレクトリへのパスを指定した`--vacuum`コマンドで、`rippled`実行可能ファイルを直接実行できます。

        /opt/ripple/bin/rippled -q --vacuum /tmp/rippled_txdb_migration

    `rippled`実行可能ファイルにより次のメッセージが即時に表示されます。

        VACUUM beginning. page_size:1024

9. プロセスが完了するまで待ちます。これには丸2日以上かかることがあります。

    プロセスが完了したら、`rippled`実行可能ファイルは以下のメッセージを表示して終了します。

        VACUUM finished. page_size:4096

    待機している間に`screen`セッションを切り離すには、**CTRL-A**を押してから**D**を押します。その後、以下のようなコマンドでスクリーンセッションを再接続します。

        screen -x -r

    プロセスが完了したら、スクリーンセッションを終了します。

        exit

    `screen`コマンドについての詳細は、[公式Screenユーザーマニュアル](https://www.gnu.org/software/screen/manual/screen.html)またはオンラインで使用可能なその他の多数のリソースを参照してください。

10. `rippled`サービスを再起動します。

        sudo systemctl start rippled

11. `rippled`サービスが正常に起動したかどうかを確認します。

    [コマンドラインインターフェイス](get-started-with-the-rippled-api.html#コマンドライン)を使用してサーバーの状況を確認できます（サーバーがJSON-RPC要求を受け入れないように設定している場合を除く）。次に例を示します。

        /opt/ripple/bin/rippled server_info

    このコマンドの予期される応答の説明については、[server_infoメソッド][]ドキュメントを参照してください。

12. サーバーのデバッグログを参照し、`SQLite page size`が現在4096であることを確認します。

        tail -F /var/log/rippled/debug.log

    また[定期的なログメッセージ](#事前の検出)には、移行前に比べて非常に多くのフリーページとフリースペースが示されているはずです。

13. 必要に応じて、移行プロセスのために作成した一時フォルダーをこの時点で削除できます。

        rm -r /tmp/rippled_txdb_migration

    トランザクションデータベースの一時コピーを保持するために追加のストレージをマウントした場合は、この時点でそのストレージをアンマウントして取り外すことができます。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
