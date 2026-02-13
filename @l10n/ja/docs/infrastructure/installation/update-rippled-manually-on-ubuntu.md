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

手動で更新するには、以下の手順を実行します。

1. リポジトリを更新します。

    ```
    sudo apt -y update
    ```

2. `rippled`パッケージをアップグレードします。

    ```
    sudo apt -y upgrade rippled
    ```

3. `systemd`ユニットファイルを再度読み込みます。

    ```
    sudo systemctl daemon-reload
    ```

4. `rippled`サービスを再起動します。

    ```
    sudo service rippled restart
    ```


## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
