---
html: update-rippled-manually-on-centos-rhel.html
parent: install-xrpld.html
seo:
    description: CentOSまたはRed Hat Enterprise Linuxでxrpldを手動更新します。
labels:
  - コアサーバ
  - セキュリティ
---
# CentOS/Red Hatでの手動更新

このページでは、CentOSまたはRed Hat Enterprise Linuxで最新リリースの`xrpld`に手動で更新する手順を説明します。可能であれば手動更新ではなく[自動更新](update-xrpld-automatically-on-linux.md)を設定することが推奨されます。

以下の手順は、[`rippled`がすでに`yum`リポジトリからインストール](install-xrpld-on-rhel.md)されていることを前提としています。

{% admonition type="success" name="ヒント" %}これらの手順をすべて一度に実行するには、`rippled`パッケージに含まれている`/opt/ripple/bin/update-rippled.sh`スクリプトを実行します。このスクリプトは`sudo`ユーザとして実行する必要があります。{% /admonition %}

手動で更新するには、以下の手順を実行します。

1. `xrpld` 1.7.0にその以前のバージョンから更新する場合は、リポジトリを再度追加して、Rippleの更新されたGPGキーを取得します。それ以外の場合は、この手順をスキップしてください。

    ```
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    REPOFILE
    ```

1. 最新の`xrpld`パッケージをダウンロードしてインストールします。

    ```
    sudo yum update xrpld
    ```

2. `systemd`ユニットファイルを再度読み込みます。

    ```
    sudo systemctl daemon-reload
    ```

3. `xrpld`サービスを再起動します。

    ```
    sudo systemctl restart rippled.service
    ```


## 関連項目

- **コンセプト:**
    - [`xrpld`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [xrpldのトラブルシューティング](../troubleshooting/index.md)
- **リファレンス:**
    - [xrpld APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`xrpld`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
