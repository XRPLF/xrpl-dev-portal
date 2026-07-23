`xrpld`が残りのネットワークと同期されるまでには数分かかることがあります。その間、レジャーがない旨を知らせる警告が出力されます。

`xrpld`ログメッセージの詳細は、[ログメッセージについて](../infrastructure/troubleshooting/understanding-log-messages.md)をご覧ください。

`xrpld`が残りのネットワークと同期されたら、ストック`xrpld`サーバが完全に機能するようになります。このサーバを、ローカル署名やXRP LedgerへのAPIアクセスに使用できます。`xrpld`サーバがネットワークと同期されているかどうかを判別するには、[`xrpld`サーバの状況](../references/http-websocket-apis/api-conventions/xrpld-server-states.md)を使用します。[`xrpld`のコマンドラインインターフェイス](../tutorials/get-started/get-started-http-websocket-apis.md#コマンドライン)を使用すれば、これを迅速にテストできます。

```sh
xrpld server_info
```

xrpld APIを使用した`xrpld`サーバとの通信について詳しくは、[xrpld API reference](../references/http-websocket-apis/index.md)をご覧ください。

ストック`xrpld`サーバを実行できたら、次に検証サーバとして実行してみましょう。検証サーバについて、そして検証サーバを実行する理由については、[バリデータとしてのxrpldの実行](../infrastructure/configuration/server-modes/run-xrpld-as-a-validator.md)をご覧ください。

`xrpld`サーバの起動でお困りですか? [xrpldサーバが起動しない](../infrastructure/troubleshooting/server-wont-start.md)をご覧ください。

### その他の構成

`xrpld`は、デフォルト構成でXRP Ledgerに接続する必要があります。ただし、`xrpld.cfg`ファイルを編集すれば、設定を変更できます。推奨される構成設定については、[容量の計画](../infrastructure/installation/capacity-planning.md)をご覧ください。

{% partial file="/@l10n/ja/docs/_snippets/conf-file-location.md" /%}

すべての構成オプションの説明については、{% source-link name="xrpld GitHubリポジトリー" path="cfg/xrpld-example.cfg" /%}をご覧ください。

構成の変更を有効にするには、`xrpld`を再起動する必要があります。

`[debug_logfile]`セクションまたは`[database_path]`セクションを変更すると、`xrpld`を実行するユーザに、新しく構成したパスの所有権を付与する必要が生じる場合があります。

### 更新

`xrpld`を定期的に更新して、残りのXRP Ledgerネットワークと同期させておく必要があります。[xrpldのGoogleグループ](https://groups.google.com/forum/#!forum/ripple-server)をサブスクライブすれば、`xrpld`の新しいリリースに関する通知を受け取ることができます。

パッケージベースのLinuxインストールでは、オペレーティングシステムに応じた更新手順に従ってください。
