# スタンドアロンモードでの保存済みレジャーの読み込み

`rippled`サーバーが以前にXRP Ledgerピアツーピアネットワーク（本番環境ネットワークまたは[Test Net](parallel-networks.html)）と同期されている場合は、ディスクに保存されたレジャーバージョンから開始できます。

## 1.`rippled`を通常の方法で起動します。

既存のレジャーを読み込むには、最初にネットワークから当該のレジャーを取得する必要があります。`rippled`をオンラインモードで通常の方法で起動します。

```
rippled --conf=/path/to/rippled.cfg
```

## 2.`rippled`が同期されるまで待ちます。

[server_infoメソッド][]を使用して、ネットワークに対するサーバーの状態を確認します。`server_state`に以下のいずれかの値が示される場合は、サーバーは同期しています。

* `full`
* `proposing`
* `validating`

詳細は、[考えられるサーバーの状態](rippled-server-states.html)を参照してください。

## 3.（省略可）特定のレジャーバージョンを取得します。

最新レジャーのみを必要とする場合は、このステップをスキップできます。

特定の履歴レジャーバージョンを読み込むには、[ledger_requestメソッド][]を実行して`rippled`にそのレジャーバージョンを取得させます。`rippled`にまだレジャーバージョンがない場合は、レジャーの取得が完了するまで`ledger_request`コマンドを複数回実行する必要があります。

特定の履歴レジャーバージョンをリプレイする場合は、リプレイするレジャーバージョンとその直前のレジャーバージョンの両方を取得する必要があります。（前のレジャーバージョンにより、リプレイするレジャーバージョンに記述されている変更を適用する初期状態が設定されます。）

## 4.`rippled`をシャットダウンします。

[stopメソッド][]を使用します。

```
rippled stop --conf=/path/to/rippled.cfg
```

## 5.スタンドアロンモードで`rippled`を起動します。

最新のレジャーバージョンを読み込むには、`-a`オプションと`--load`オプションを指定してサーバーを起動します。

```
rippled -a --load --conf=/path/to/rippled.cfg
```

特定の履歴レジャーを読み込むには、`--load`パラメーターと`--ledger`パラメーターを使用し、読み込むレジャーバージョンのレジャーインデックスまたは識別用ハッシュを指定してサーバーを起動します。

```
rippled -a --load --ledger 19860944 --conf=/path/to/rippled.cfg
```

スタンドアロンモードで`rippled`を起動するときに使用できるオプションについての詳細は、[コマンドラインの使用リファレンスの「スタンドアロンモードのオプション」](commandline-usage.html#スタンドアロンモードのオプション)を参照してください。

## 6.レジャーを手動で進めます。

スタンドアロンモードで`--ledger`を使用してレジャーを読み込むと、読み込まれたレジャーが現行のオープンレジャーになるので、[レジャーを手動で進める](advance-the-ledger-in-stand-alone-mode.html)必要があります。

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}