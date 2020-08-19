# CentOS/Red Hatでの手動更新

このページでは、CentOSまたはRed Hat Enterprise Linuxで最新リリースの`rippled`に手動で更新する手順を説明します。可能であれば手動更新ではなく[自動更新](update-rippled-automatically-on-linux.html)を設定することが推奨されます。

以下の手順は、[`rippled`がすでに`yum`リポジトリからインストール](install-rippled-on-centos-rhel-with-yum.html)されていることを前提としています。

**ヒント:** これらの手順をすべて一度に実行するには、`rippled`パッケージに含まれている`/opt/ripple/bin/update-rippled.sh`スクリプトを実行します。このスクリプトは`sudo`ユーザーとして実行する必要があります。

手動で更新するには、以下の手順を実行します。

1. 最新の`rippled`パッケージをダウンロードしてインストールします。
   
        $ sudo yum update rippled

2. `systemd`ユニットファイルを再度読み込みます。
   
        $ sudo systemctl daemon-reload

3. `rippled`サービスを再起動します。
   
        $ sudo service rippled restart


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](the-rippled-server.html)
    - [コンセンサスについて](intro-to-consensus.html)
- **チュートリアル:**
    - [`rippled` v1.3.xへの移行手順](rippled-1-3-migration-instructions.html) <!-- Note: remove when versions older than v1.3 are basically extinct -->
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
    - [rippled APIリファレンス](rippled-api.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
