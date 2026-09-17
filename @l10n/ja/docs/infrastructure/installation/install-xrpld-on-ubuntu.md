---
html: install-xrpld-on-ubuntu.html
parent: install-xrpld.html
seo:
    description: プリコンパイル済みのxrpldバイナリーをUbuntu Linuxにインストールします。
labels:
  - コアサーバ
---
# UbuntuまたはDebian Linuxへのインストール

このページでは、[`apt`](https://ubuntu.com/server/docs)ユーティリティを使用して、**Ubuntu Linux 18.04以降**または**Debian 10** に`xrpld`の安定した最新バージョンをインストールする場合の推奨手順を説明します。

以下の手順では、XRPLFによってコンパイルされたバイナリーをインストールします。


## 前提条件

`xrpld`をインストールする前に、[システム要件](system-requirements.md)を満たす必要があります。


## インストール手順

1. リポジトリを更新します。

    ```
    sudo apt -y update
    ```

2. ユーティリティをインストールします。

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. XRPLFのパッケージ署名用のGPGキーを、信頼できるキーのリストに追加します。

    ```
    sudo install -m 0755 -d /etc/apt/keyrings && \
        sudo wget -qO /etc/apt/keyrings/xrplf.asc https://packages.xrplf.org/xrplf.asc
    ```

4. 追加したキーのフィンガープリントを確認します。

    ```
    gpg --show-keys /etc/apt/keyrings/xrplf.asc
    ```

   出力は次のとおりです。

    ```
    pub   rsa4096 2026-08-18 [SC]
          B655416741221F780FBCFBC9AA84D41A11D29FA9
    uid                      XRPLF Packages <distribution@xrplf.org>
    ```

   特に、フィンガープリントが一致することを確認してください。（上記の例では、フィンガープリントは二行目の`B655`で始まる部分です。）

5. XRPLFリポジトリを追加します。

    ```
    echo "deb [signed-by=/etc/apt/keyrings/xrplf.asc] https://packages.xrplf.org/repository/deb-stable any main" | \
        sudo tee /etc/apt/sources.list.d/xrplf.list
    ```

   この行はサポートされているすべてのUbuntuおよびDebianのバージョンに共通です。スイート名は`any`であり、リリースのコードネームではありません。

   `xrpld`の開発バージョンまたはプレリリースバージョンにアクセスするには、`deb-stable`を次のいずれかに置き換えます。

   - `deb-rc` - リリース候補ビルド
   - `deb-beta` - ベータビルド
   - `deb-develop` - [`develop`ブランチ](https://github.com/XRPLF/rippled/tree/develop)へのプッシュごとのビルド

   {% admonition type="danger" name="警告" %}`stable`以外のチャンネルのビルドはいつの時点でも壊れる可能性があります。これらのビルドを本番環境のサーバに使用しないでください。{% /admonition %}

6. XRPLFリポジトリを取得します。

    ```
    sudo apt -y update
    ```

7. `xrpld`ソフトウェアパッケージをインストールします。

    ```
    sudo apt -y install xrpld
    ```

8. `xrpld`サービスのステータスをチェックします。

    ```
    systemctl status xrpld.service
    ```

   `xrpld`サービスが自動的に開始します。開始しない場合は、手動で開始できます。

    ```
    sudo systemctl start xrpld.service
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
    - [xrpld APIの使用開始](../../tutorials/get-started/get-started-http-websocket-apis.md)
- **リファレンス:**
    - [xrpld APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`xrpld`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
