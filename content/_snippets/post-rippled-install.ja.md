`rippled`が残りのネットワークと同期されるまでには数分かかることがあります。その間、レジャーがない旨を知らせる警告が出力されます。

`rippled`ログメッセージの詳細は、[ログメッセージについて](understanding-log-messages.html)を参照してください。

`rippled`が残りのネットワークと同期されたら、ストック`rippled`サーバーが完全に機能するようになります。このサーバーを、ローカル署名やXRP LedgerへのAPIアクセスに使用できます。`rippled`サーバーがネットワークと同期されているかどうかを判別するには、[`rippled`サーバーの状況](rippled-server-states.html)を使用します。[`rippled`のコマンドラインインターフェイス](get-started-using-http-websocket-apis.html#コマンドライン)を使用すれば、これを迅速にテストできます。

{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}
    $ ./rippled server_info
{% else %}
    $ /opt/ripple/bin/rippled server_info
{% endif %}

rippled APIを使用した`rippled`サーバーとの通信について詳しくは、[rippled API reference](http-websocket-apis.html)を参照してください。

ストック`rippled`サーバーを実行できたら、次に検証サーバーとして実行してみましょう。検証サーバーについて、そして検証サーバーを実行する理由については、[バリデータとしてのrippledの実行](run-rippled-as-a-validator.html)を参照してください。

`rippled`サーバーの起動でお困りですか? [rippledサーバーが起動しない](server-wont-start.html)を参照してください。

### その他の構成

`rippled`は、デフォルト構成でXRP Ledgerに接続する必要があります。ただし、`rippled.cfg`ファイルを編集すれば、設定を変更できます。推奨される構成設定については、[容量の計画](capacity-planning.html)を参照してください。

{% include '_snippets/conf-file-location.md' %}<!--_ -->

すべての構成オプションの説明については、[`rippled` GitHubリポジトリー](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg)を参照してください。

構成の変更を有効にするには、`rippled`を再起動する必要があります。

{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-centos-rhel-with-yum" %}
        $ sudo systemctl restart rippled.service

{% elif currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
        currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}


* Ctrl-Cを使用して`rippled`を停止し、その後再起動します。

      $ ./rippled

{% endif %}

`[debug_logfile]`セクションまたは`[database_path]`セクションを変更すると、`rippled`を実行するユーザーに、新しく構成したパスの所有権を付与する必要が生じる場合があります。

### 更新

`rippled`を定期的に更新して、残りのXRP Ledgerネットワークと同期させておく必要があります。[rippledのGoogleグループ](https://groups.google.com/forum/#!forum/ripple-server)をサブスクライブすれば、`rippled`の新しいリリースに関する通知を受け取ることができます。

`rippled`のパッケージには、[Linuxでの自動更新を有効にする](update-rippled-automatically-on-linux.html)ために使用できるスクリプトが含まれています。その他のプラットフォームでは、手動での更新が必要です。
