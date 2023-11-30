---
html: update-rippled-manually-on-centos-rhel.html
parent: install-rippled.html
blurb: CentOSまたはRed Hat Enterprise Linuxでrippledを手動更新します。
labels:
  - コアサーバー
  - セキュリティ
---
# CentOS/Red Hatでの手動更新

このページでは、CentOSまたはRed Hat Enterprise Linuxで最新リリースの`rippled`に手動で更新する手順を説明します。可能であれば手動更新ではなく[自動更新](update-rippled-automatically-on-linux.html)を設定することが推奨されます。

以下の手順は、[`rippled`がすでに`yum`リポジトリからインストール](install-rippled-on-centos-rhel-with-yum.html)されていることを前提としています。

**ヒント:** これらの手順をすべて一度に実行するには、`rippled`パッケージに含まれている`/opt/ripple/bin/update-rippled.sh`スクリプトを実行します。このスクリプトは`sudo`ユーザーとして実行する必要があります。

手動で更新するには、以下の手順を実行します。

1. `rippled` 1.7.0にその以前のバージョンから更新する場合は、リポジトリを再度追加して、Rippleの更新されたGPGキーを取得します。それ以外の場合は、この手順をスキップしてください。

        cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
        [ripple-stable]
        name=XRP Ledger Packages
        enabled=1
        gpgcheck=0
        repo_gpgcheck=1
        baseurl=https://repos.ripple.com/repos/rippled-rpm/stable
        gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
        REPOFILE

1. 最新の`rippled`パッケージをダウンロードしてインストールします。

        sudo yum update rippled

2. `systemd`ユニットファイルを再度読み込みます。

        sudo systemctl daemon-reload

3. `rippled`サービスを再起動します。

        sudo systemctl restart rippled.service


## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](xrpl-servers.html)
    - [コンセンサスについて](consensus.html)
- **チュートリアル:**
    - [`rippled` v1.3.xへの移行手順](rippled-1-3-migration-instructions.html) <!-- Note: remove when versions older than v1.3 are basically extinct -->
    - [rippledのトラブルシューティング](troubleshoot-the-rippled-server.html)
- **リファレンス:**
    - [rippled APIリファレンス](http-websocket-apis.html)
      - [`rippled`コマンドラインの使用](commandline-usage.html)
      - [server_infoメソッド][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
