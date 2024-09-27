---
html: update-rippled-manually-on-ubuntu.html
parent: install-rippled.html
seo:
    description: Ubuntu Linuxでrippledを手動更新します。
labels:
  - コアサーバ
  - セキュリティ
---
# UbuntuまたはDebianでの手動更新

このページでは、Ubuntu Linuxで最新リリースの`rippled`に手動で更新する手順を説明します。以下の手順は、[`rippled`がすでにネイティブパッケージを使用してインストール](install-rippled-on-ubuntu.md)されていることを前提としています。可能であれば手動更新ではなく[自動更新](update-rippled-automatically-on-linux.md)を設定することが推奨されます。

**注意:** Ubuntu Linuxで`rippled` 1.2.xから1.3.1以降にアップグレードするには、[1.3.1への移行手順](rippled-1-3-migration-instructions.md)に従う必要があります。以下の手順は、バージョン1.3.1以降で提供されているネイティブAPTパッケージがインストール済みであることを前提としています。

**ヒント:** これらの手順をすべて一度に実行するには、`rippled`パッケージに含まれている`/opt/ripple/bin/update-rippled.sh`スクリプトを実行します。`rippled`バージョン1.3.1以降、このスクリプトはUbuntuおよびDebianと互換性があります。このスクリプトは`sudo`ユーザとして実行する必要があります。

手動で更新するには、以下の手順を実行します。

1. リポジトリを更新します。

    ```
    $ sudo apt -y update
    ```

2. `rippled`パッケージをアップグレードします。

    ```
    $ sudo apt -y upgrade rippled
    ```

3. `systemd`ユニットファイルを再度読み込みます。

    ```
    $ sudo systemctl daemon-reload
    ```

4. `rippled`サービスを再起動します。

    ```
    $ sudo service rippled restart
    ```


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [`rippled` v1.3.xへの移行手順](rippled-1-3-migration-instructions.md) <!-- Note: remove when versions older than v1.3 are basically extinct -->
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
