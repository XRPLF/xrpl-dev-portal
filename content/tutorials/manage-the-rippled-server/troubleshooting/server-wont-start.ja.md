# rippledサーバーが起動しない

このページでは、`rippled`サーバーが起動しない際に考えられる原因とその修正方法を説明します。

以下の手順では、サポートされているプラットフォームに[`rippled`がインストール](install-rippled.html)されていることを前提としています。


## ファイル記述子の制限

一部のLinuxバリアントでは、`rippled`を実行しようとすると以下のようなエラーメッセージが出力されることがあります。

```テキスト
WARNING: There are only 1024 file descriptors (soft limit) available, which
limit the number of simultaneous connections.
```

これは、セキュリティの点からシステムで1つのプロセスが開くことができるファイルの数に制限があるが、その制限が`rippled`にとっては少なすぎる場合に発生します。この問題を修正するには、**ルートアクセス権限が必要です**。以下の手順に従い、`rippled`が開くことができるファイルの数を増やします。

1. 次の行を`/etc/security/limits.conf` ファイルの終わりに追加します。

        *                soft    nofile          65536
        *                hard    nofile          65536

2. [開くことができるファイルの数のハード制限](https://ss64.com/bash/ulimit.html)が現在`65536`であることを確認します。

        ulimit -Hn

    このコマンドの出力は`65536`になるはずです。

3. `rippled`をもう一度起動します。

        systemctl start rippled

4. それでも`rippled`が起動しない場合は、`/etc/sysctl.conf`を開き、以下のカーネルレベル設定を付加します。

        fs.file-max = 65536


## /etc/opt/ripple/rippled.cfgを開くことができない

`rippled` が起動時にクラッシュし、以下のようなエラーが出力される場合は、`rippled`が構成ファイルを読み取ることができません。

```テキスト
Loading: "/etc/opt/ripple/rippled.cfg"
Failed to open '"/etc/opt/ripple/rippled.cfg"'.
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/opt/ripple"'
Aborted (core dumped)
```

考えられる解決策:

- 構成ファイル（デフォルトのロケーションは`/etc/opt/ripple/rippled.cfg`）が存在しており、`rippled`プロセスを実行するユーザー（通常は`rippled`）にこのファイルの読み取り権限があることを確認します。

- `rippled`ユーザーが読み取ることができる構成ファイルを`$HOME/.config/ripple/rippled.cfg`に作成します（`$HOME`は`rippled`ユーザーのホームディレクトリを指しています）。

    **ヒント:**`rippled`リポジトリには、RPMのインストール時にデフォルトの構成として提供される[`rippled.cfg`サンプルファイル](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg)が含まれています。このファイルがない場合は、上記のリンク先からコピーできます。

- `--conf` [コマンドラインオプション](commandline-usage.html)を使用して、使用する構成ファイルのパスを指定します。

## バリデータファイルを開くことができない

`rippled`が起動時にクラッシュし、以下のようなエラーが出力される場合は、`rippled`はプライマリ構成ファイルを読み取ることはできても、この構成ファイルに指定されている別のバリデータ構成ファイル（通常は`validators.txt`）を読み取ることができません。

```テキスト
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'The file specified in [validators_file] does not exist: /home/rippled/.config/ripple/validators.txt'
Aborted (core dumped)
```

考えられる解決策:

- `[validators.txt]`ファイルが存在し、`rippled`ユーザーにこのファイルの読み取り権限があることを確認します。

    **ヒント:**`rippled`リポジトリには、RPMのインストール時にデフォルトの構成として提供される[`validators.txt`サンプルファイル](https://github.com/ripple/rippled/blob/master/cfg/validators-example.txt)が含まれています。このファイルがない場合は、上記のリンク先からコピーできます。

- `rippled.cfg`ファイルを編集し、`[validators_file]`設定を変更して、`validators.txt`ファイル（またはこれに相当するファイル）の正しいパスを指定します。ファイル名の前後に余分な空白があるかどうかを確認します。

- `rippled.cfg`ファイルを編集し、`[validators_file]`設定を削除します。バリデータ設定を`rippled.cfg`ファイルに直接追加します。例:

        [validator_list_sites]
        https://vl.ripple.com

        [validator_list_keys]
        ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734


## データベースパスを作成できない

`rippled`が起動時にクラッシュし、以下のようなエラーが出力される場合は、その構成ファイルの`[database_path]`への書き込み権限がサーバーにありません。

```text
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/lib/rippled/db"'
Aborted (core dumped)
```

構成ファイルのパス（`/home/rippled/.config/ripple/rippled.cfg`）とデータベースのパス（`/var/lib/rippled/db`）は、システムによっては異なる可能性があります。

考えられる解決策:

- エラーメッセージに出力されているデータベースパスへの書き込み権限を持つ別のユーザーとして`rippled`を実行します。

- `rippled.cfg`ファイルを編集し、`[database_path]`設定を変更して、`rippled`ユーザーに書き込み権限があるパスを使用します。

- `rippled`ユーザーに対し、設定されているデータベースパスへの書き込み権限を付与します。


## 状態DBエラー

`rippled`サーバーの状態データベースが破損している場合に、以下のエラーが発生する可能性があります。これは、予期しないシャットダウンが行われた場合、またはデータベースのタイプをRocksDBからNuDBに変更したが構成ファイルの`path`設定と`[database_path]`設定を変更しなかった場合に発生する可能性があります。

```text
2018-Aug-21 23:06:38.675117810 SHAMapStore:ERR state db error:
 writableDbExists false archiveDbExists false
 writableDb '/var/lib/rippled/db/rocksdb/rippledb.11a9' archiveDb '/var/lib/rippled/db/rocksdb/rippledb.2d73'

To resume operation, make backups of and remove the files matching /var/lib/rippled/db/state* and contents of the directory /var/lib/rippled/db/rocksdb

Terminating thread rippled: main: unhandled St13runtime_error 'state db error'
```

この問題を修正する最も簡単な方法は、データベース全体を削除することです。あるいは、データベースを任意の場所にバックアップすることもできます。例:

```sh
mv /var/lib/rippled/db /var/lib/rippled/db-bak
```

あるいは、データベースが必要ではないことが判明している場合は以下のようにします。

```sh
rm -r /var/lib/rippled/db
```

**ヒント:** 一般に`rippled`データベースは安全に削除できます。これは、個々のサーバーはXRP Ledgerネットワーク内の他のサーバーからレジャー履歴を再ダウンロードできるためです。

あるいは、構成ファイルでデータベースのパスを変更できます。例:

```
[node_db]
type=NuDB
path=/var/lib/rippled/custom_nudb_path

[database_path]
/var/lib/rippled/custom_sqlite_db_path
```


## オンライン削除の値がレジャー履歴の値よりも少ない

以下のようなエラーメッセージが出力される場合、`rippled.cfg`ファイルの`[ledger_history]`と`online_delete`に矛盾する値が指定されています。

```テキスト
Terminating thread rippled: main: unhandled St13runtime_error 'online_delete must not be less than ledger_history (currently 3000)
```

`[ledger_history]`設定は、サーバーが埋め戻す履歴のレジャー数を表します。`online_delete`フィールド（`[node_db]`スタンザ）は、古い履歴を削除するときに維持する履歴のレジャー数を示します。サーバーがダウンロードしようとしている履歴レジャーを削除しないようにするため、`online_delete`の値は`[ledger_history]`以上でなければなりません。

この問題を修正するには、`rippled.cfg`ファイルを編集し、`[ledger_history]`オプションまたは`online_delete`オプションのいずれかを変更または削除します。（`[ledger_history]`を省略すると、デフォルトの256レジャーバージョンに設定されるので、`online_delete`を残して指定する場合は256よりも大きな値にする必要があります。`online_delete`を省略すると、古いレジャーバージョンの自動削除が無効になります。）


## node_sizeの値が正しくない

以下のようなエラーが出力される場合は、`rippled.cfg`ファイルの`node_size`設定の値が誤っています。

```テキスト
Terminating thread rippled: main: unhandled N5beast14BadLexicalCastE 'std::bad_cast'
```

`node_size`フィールドの有効なパラメーターは`tiny`、`small`、`medium`、`large`、`huge`です。詳細は、[ノードサイズ](capacity-planning.html#ノードサイズ)を参照してください。


## シャードパスが欠落している

以下のようなエラーが出力される場合は、`rippled.cfg`の[履歴シャーディング](history-sharding.html)の設定が不完全です。

```テキスト
Terminating thread rippled: main: unhandled St13runtime_error 'shard path missing'
```

設定に`[shard_db]`スタンザが含まれている場合、このスタンザには`path`フィールドが指定されている必要があります。このフィールドは、`rippled`がシャードストアーのデータを書き込むことができるディレクトリを指しています。このエラーが発生する場合は、`path`フィールドが欠落しているか、誤った位置に指定されています。構成ファイルで余分な空白やスペルミスがないかどうかを確認し、[シャード設定の例](configure-history-sharding.html#2-rippledcfgの編集)と比較してください。


## ShardStoreがRocksDBを開くかまたは作成することができない

[履歴シャーディング](history-sharding.html)を有効にし、その後設定を変更してNuDBではなくRocksDBを使用するように設定した場合、サーバーは既存のNuDBデータをRocksDBデータとして読み取ろうとし、起動に失敗します。この場合、サーバーは以下のようなエラーを書き込みます。

```テキスト
ShardStore:ERR shard 504 error: Unable to open/create RocksDB: Invalid argument: /var/lib/rippled/db/shards/504: does not exist (create_if_missing is false)
```

この問題を修正するには、以下のいずれかを行います。

- 設定されているフォルダーから既存のシャードデータを移動する。
- ディスク上のシャードストアーの位置を変更するため、`rippled.cfg`ファイルの`[shard_db]`スタンザの`path`を変更する。
- NuDBを使用するようにシャードストアーを変更する。
