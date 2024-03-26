---
html: install-rippled-on-centos-rhel-with-yum.html
parent: install-rippled.html
seo:
    description: プリコンパイル済みのrippledバイナリーをCentOSまたはRed Hat Enterprise Linuxにインストールします。
labels:
  - コアサーバ
---
# yumを使用したCentOS/Red Hatへのインストール

このページでは、Rippleの[yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified)リポジトリを使用して、**CentOS 7**または**Red Hat Enterprise Linux 7**に、`rippled`の安定した最新バージョンをインストールする場合の推奨手順を説明します。

以下の手順では、Rippleによってコンパイルされたバイナリーをインストールします。


## 前提条件

`rippled`をインストールする前に、[システム要件](system-requirements.md)を満たす必要があります。


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

3. 新しい`rippled`パッケージをインストールします。

    ```
    $ sudo yum install rippled
    ```

   バージョン1.3.1では、構成ファイル（`rippled.cfg`および`validators.txt`）を変更する必要はありません。このアップデート手順では、既存の構成ファイルが現在のまま残ります。

4. systemdユニットファイルを再度読み込みます。

    ```
    $ sudo systemctl daemon-reload
    ```

5. 起動時に開始するように、`rippled`サービスを設定します。

    ```
    $ sudo systemctl enable rippled.service
    ```

6. `rippled`サービスを開始します。

    ```
    $ sudo systemctl start rippled.service
    ```


## 次のステップ

{% partial file="/@i18n/ja/docs/_snippets/post-rippled-install.md" /%}


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [rippledの構成](../configuration/index.md)
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
    - [rippled APIの使用開始](../../tutorials/http-websocket-apis/build-apps/get-started.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
