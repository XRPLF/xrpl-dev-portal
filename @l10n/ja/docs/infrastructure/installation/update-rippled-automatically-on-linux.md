---
html: update-rippled-automatically-on-linux.html
parent: install-rippled.html
seo:
    description: Linuxでrippledの自動更新を設定します。
labels:
  - コアサーバ
  - セキュリティ
---
# Linuxでの自動更新

Linuxでは、`rippled`が1回限りの`cron`構成を使用して最新バージョンに自動的にアップグレードされるように設定できます。可能であれば自動更新を有効にしておくことが推奨されます。

以下の手順では、`rippled`が[`yum`リポジトリから（CentOS/RedHat）](install-rippled-on-centos-rhel-with-yum.md)、または[`apt`（Ubuntu/Debian）を使用して](install-rippled-on-ubuntu.md)インストールされていることを前提としています。

自動更新を設定するには、以下の手順に従います。

1. `/opt/ripple/etc/update-rippled-cron`が存在することを確認します。存在しない場合は、（[CentOS/Red Hat](update-rippled-manually-on-centos-rhel.md)または[Ubuntu/Debian](update-rippled-manually-on-ubuntu.md)を）手動で更新します。

2. `cron.d`フォルダーに、`/opt/ripple/etc/update-rippled-cron`構成ファイルへのsymlinkを作成します。

    ```
    $ sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
    ```

   このcron構成は、インストール済みの`rippled`パッケージを新版のリリース後1時間以内に更新するためのスクリプトを実行します。同時に更新を実行しているすべてのサーバが停止する可能性を抑えるため、このスクリプトは`rippled`サービスを再起動しません。手動再起動しますまで、以前のバージョンを実行し続けます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}新規: rippled 1.8.1{% /badge %}

3. 新しいリリースが公開された後、`rippled`サービスを手動再起動する。

    ```
    sudo systemctl restart rippled.service
    ```



**注意:** 将来的には、Rippleのリポジトリが変更された場合に、更新を検索するスクリプトが実行されるURLの手動更新が必要となることがあります。必要な変更についての最新情報は、[XRP Ledgerブログ](/blog/)または[ripple-serverメーリングリスト](https://groups.google.com/forum/#!forum/ripple-server)でお知らせします。


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [容量の計画](capacity-planning.md)
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
