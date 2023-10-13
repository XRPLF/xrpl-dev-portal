---
html: update-rippled-automatically-on-linux.html
parent: install-rippled.html
blurb: Linuxでrippledの自動更新を設定します。
labels:
  - コアサーバー
  - セキュリティ
---
# Linuxでの自動更新

Linuxでは、`rippled`が1回限りの`cron`構成を使用して最新バージョンに自動的にアップグレードされるように設定できます。可能であれば自動更新を有効にしておくことが推奨されます。

以下の手順では、`rippled`が[`yum`リポジトリから（CentOS/RedHat）](install-rippled-on-centos-rhel-with-yum.html)、または[`apt`（Ubuntu/Debian）を使用して](install-rippled-on-ubuntu.html)インストールされていることを前提としています。

自動更新を設定するには、以下の手順に従います。

1. `/opt/ripple/etc/update-rippled-cron`が存在することを確認します。存在しない場合は、（[CentOS/Red Hat](update-rippled-manually-on-centos-rhel.html)または[Ubuntu/Debian](update-rippled-manually-on-ubuntu.html)を）手動で更新します。

2. `cron.d`フォルダーに、`/opt/ripple/etc/update-rippled-cron`構成ファイルへのsymlinkを作成します。

        $ sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/

   このcron構成は、インストール済みの`rippled`パッケージを新版のリリース後1時間以内に更新するためのスクリプトを実行します。同時に更新を実行しているすべてのサーバーが停止する可能性を抑えるため、このスクリプトは`rippled`サービスを再起動しません。手動再起動しますまで、以前のバージョンを実行し続けます。[新規: rippled 1.8.1][]

3. 新しいリリースが公開された後、`rippled`サービスを手動再起動する。

        sudo systemctl restart rippled.service



**注意:** 将来的には、Rippleのリポジトリが変更された場合に、更新を検索するスクリプトが実行されるURLの手動更新が必要となることがあります。必要な変更についての最新情報は、[XRP Ledgerブログ](/blog/)または[ripple-serverメーリングリスト](https://groups.google.com/forum/#!forum/ripple-server)でお知らせします。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [コンセンサスについて](consensus.html)
- **チュートリアル:**
    - [容量の計画](capacity-planning.html)
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
