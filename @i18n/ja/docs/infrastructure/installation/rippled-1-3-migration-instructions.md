---
html: rippled-1-3-migration-instructions.html
parent: install-rippled.html
seo:
    description: rippled 1.2.4以前のバージョンからrippled v1.3以降に移行するプロセスについて説明します。
---
# rippled v1.3.xへの移行手順

このドキュメントでは、`rippled` 1.2.4以前のバージョンから`rippled` v1.3以降に移行するプロセスについて説明します。`rippled`のインストールプロセスがバージョン1.3では変更されたため、この移行プロセスは必須です。

このドキュメントでは、サポートされるプラットフォームでアップグレードするための移行手順について説明します。

- [CentOSまたはRed Hat Enterprise Linux（RHEL）](#centosまたはred-hat-enterprise-linuxrhelでの移行)
- [Ubuntu Linux](#ubuntu-linuxでの移行)

その他のプラットフォームについては、ソースからコンパイルするためのアップデート手順をご覧ください。（[Ubuntu](build-on-linux-mac-windows.md)、[macOS](build-on-linux-mac-windows.md)、または[Windows](https://github.com/XRPLF/rippled/tree/develop/Builds/VisualStudio2017)）


## CentOSまたはRed Hat Enterprise Linux（RHEL）での移行

Rippleの公式RPMリポジトリとそれを使用するための手順が変更されました。[自動更新](update-rippled-automatically-on-linux.md)を有効にしている場合は、システムで移行が自動的に実行されます。以前のリポジトリから新しいリポジトリに手動で移行するには、以下の手順を実行します。

1. `rippled`サーバを停止します。

    ```
    $ sudo systemctl stop rippled.service
    ```

2. 以前のRippleリポジトリパッケージを削除します。

    ```
    $ sudo rpm -e ripple-repo
    ```

   `rippled-repo`パッケージは、現在**廃止予定**です。このパッケージはバージョン1.3.1に対応するために、最後にもう一度だけ更新されました。今後は、リポジトリに変更があれば、`ripple.repo`ファイルに手動で変更を加える必要があります。

3. Rippleの新しいyumリポジトリを追加します。

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

4. 新しい`rippled`パッケージをインストールします。

    ```
    $ sudo yum install rippled
    ```

   バージョン1.3.1では、構成ファイル（`rippled.cfg`および`validators.txt`）を変更する必要はありません。このアップデート手順では、既存の構成ファイルが現在のまま残ります。

5. systemdユニットファイルを再度読み込みます。

    ```
    $ sudo systemctl daemon-reload
    ```

6. `rippled`サービスを開始します。

    ```
    $ sudo systemctl start rippled.service
    ```


**警告:** [自動更新](update-rippled-automatically-on-linux.md)を使用している場合、この移行プロセスを実行した後も自動更新が続きます。ただし、**`ripple-repo`パッケージは、現在は廃止予定**です。そのため、今後は、Rippleのリポジトリへの変更があれば、各自がrepoファイルを手動で更新する必要があります。


## Ubuntu Linuxでの移行

バージョン1.3より前では、Ubuntu Linuxに`rippled`をインストールする方法として、Alienを使用してRPMパッケージをインストールする方法がサポートされていました。`rippled`v1.3.1から、RippleはUbuntuおよびDebian Linux向けのネイティブパッケージを提供しており、これが推奨のインストール方法となります。すでにRPMパッケージをインストールしている場合は、[インストール手順](install-rippled-on-ubuntu.md)を実行して、パッケージをアップグレードし、ネイティブAPT（`.deb`）パッケージに切り替えます。

構成ファイル（`/opt/ripple/etc/rippled.cfg`および`/opt/ripple/etc/validators.txt`）に変更を加えている場合は、インストール中に`apt`から、構成ファイルをパッケージからの最新バージョンで上書きするかどうかを尋ねられる場合があります。バージョン1.3では、構成ファイルに変更を加える必要はありません。そのため、既存の構成ファイルはそのまま維持できます。

1.3用のネイティブAPTパッケージをインストールした後で、サービスを再読み込み/再起動する必要があります。

1. systemdユニットファイルを再度読み込みます。

    ```
    $ sudo systemctl daemon-reload
    ```

2. `rippled`サービスを再起動します。

    ```
    $ sudo systemctl restart rippled.service
    ```

他のパッケージ用にAlienを使用する必要がなくなった場合は、必要に応じて、次の手順でAlienとその依存関係をアンインストールできます。

1. Alienをアンインストールします。

    ```
    $ sudo apt -y remove alien
    ```

2. 使用していない依存関係をアンインストールします。

    ```
    $ sudo apt -y autoremove
    ```

### 自動更新

`rippled` v1.3パッケージには、UbuntuおよびDebian Linuxで動作する最新のauto-updateスクリプトが含まれています。詳細は、[Linuxでの`rippled`の自動更新](update-rippled-automatically-on-linux.md)をご覧ください。

## 関連項目

- **[`rippled` v1.3.1リリースノート](https://github.com/XRPLF/rippled/releases/1.3.1)**
- **コンセプト:**
  - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
  - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
  - [Linuxでの自動更新](update-rippled-automatically-on-linux.md)
  - [rippledのトラブルシューティング](../troubleshooting/index.md)
  - [rippled APIの使用開始](../../tutorials/http-websocket-apis/get-started.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
