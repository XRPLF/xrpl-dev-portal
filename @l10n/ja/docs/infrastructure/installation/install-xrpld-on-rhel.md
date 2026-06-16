---
html: install-rippled-on-centos-rhel-with-yum.html
parent: install-xrpld.html
seo:
    description: プリコンパイル済みのxrpldバイナリーをCentOSまたはRed Hat Enterprise Linuxにインストールします。
labels:
  - コアサーバ
---
# yumを使用したCentOS/Red Hatへのインストール

このページでは、Rippleの[yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified)リポジトリを使用して、**CentOS 7**または**Red Hat Enterprise Linux 7**に、`xrpld`の安定した最新バージョンをインストールする場合の推奨手順を説明します。

以下の手順では、Rippleによってコンパイルされたバイナリーをインストールします。


## 前提条件

`xrpld`をインストールする前に、[システム要件](system-requirements.md)を満たす必要があります。


## インストール手順

1. Ripple RPMリポジトリをインストールします。

    ```
    $ cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable/
    enabled=1
    gpgcheck=0
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    repo_gpgcheck=1
    REPOFILE
    ```

2. 最新のrepoのアップデートを取得します。

    ```
    $ sudo yum -y update
    ```

3. 新しい`xrpld`パッケージをインストールします。

    ```
    $ sudo yum install xrpld
    ```

   バージョン1.3.1では、構成ファイル（`rippled.cfg`および`validators.txt`）を変更する必要はありません。このアップデート手順では、既存の構成ファイルが現在のまま残ります。

4. systemdユニットファイルを再度読み込みます。

    ```
    $ sudo systemctl daemon-reload
    ```

5. 起動時に開始するように、`xrpld`サービスを設定します。

    ```
    $ sudo systemctl enable xrpld.service
    ```

6. `xrpld`サービスを開始します。

    ```
    $ sudo systemctl start xrpld.service
    ```


## 次のステップ

{% partial file="/@l10n/ja/docs/_snippets/post-xrpld-install.md" /%}


## 関連項目

- **コンセプト:**
    - [`xrpld`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [xrpldの構成](../configuration/index.md)
    - [xrpldのトラブルシューティング](../troubleshooting/index.md)
    - [xrpld APIの使用開始](/docs/tutorials/get-started/get-started-http-websocket-apis.md)
- **リファレンス:**
    - [xrpld APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`xrpld`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
