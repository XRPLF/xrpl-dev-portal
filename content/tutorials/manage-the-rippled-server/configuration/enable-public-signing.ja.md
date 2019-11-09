# パブリック署名の有効化

[新規: rippled 1.1.0][]デフォルトでは、`rippled`の署名メソッドは管理者接続に限定されています。v1.1.0以前のバージョンの`rippled`のように、署名メソッドをパブリックAPIメソッドとして使用できるようにするには、構成を変更することで、これを使用できるようにします。

これにより、サーバーが「パブリック」[JSON-RPC接続およびWebSocket接続](get-started-with-the-rippled-api.html)を受け入れる場合は、これらのパブリック接続で以下のメソッドが使用できるようになります。

- [sign][signメソッド]
- [sign_for][sign_forメソッド]
- [submit][submitメソッド](in "sign-and-submit" mode)

これらのメソッドを使用するにあたり、管理者接続からパブリック署名を有効にする必要は**ありません**。

**注意:** パブリック署名を有効にすることは推奨されません。[wallet_proposeメソッド][]と同様に、署名コマンドでは管理レベルの権限を必要とするアクションは実行されませんが、署名コマンドを管理者接続に制限することにより、ユーザーが安全ではない通信経由で、またはユーザーの管理下にないサーバーとの間でシークレットキーを無責任に送受信することを防止します。

パブリック署名を有効にするには、以下の手順を実行します。

1. `rippled`の構成ファイルを編集します。

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. 以下のスタンザを構成ファイルに追加し、変更を保存します。

        [signing_support]
        true

3. `rippled`サーバーを再起動します。

        systemctl restart rippled


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
