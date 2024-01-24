---
html: install-rippled-on-ubuntu.html
parent: install-rippled.html
seo:
    description: プリコンパイル済みのrippledバイナリーをUbuntu Linuxにインストールします。
labels:
  - コアサーバー
---
# UbuntuまたはDebian Linuxへのインストール

このページでは、[`apt`](https://ubuntu.com/server/docs)ユーティリティを使用して、**Ubuntu Linux 18.04以降**または**Debian 10** に`rippled`の安定した最新バージョンをインストールする場合の推奨手順を説明します。

以下の手順では、Rippleによってコンパイルされたバイナリーをインストールします。


## 前提条件

`rippled`をインストールする前に、[システム要件](system-requirements.md)を満たす必要があります。


## インストール手順

1. リポジトリを更新します。

    ```
    sudo apt -y update
    ```

2. ユーティリティをインストールします。

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Rippleのパッケージ署名用のGPGキーを、信頼できるキーのリストに追加します。

    ```
    sudo mkdir /usr/local/share/keyrings/
    wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
    sudo mv ripple-key.gpg /usr/local/share/keyrings
    ```

4. 追加したキーのフィンガープリントを確認します。

    ```
    gpg /usr/local/share/keyrings/ripple-key.gpg
    ```

   出力に、次のようなRipple用のエントリーが含まれていることを確認してください。

    ```
    gpg: WARNING: no command supplied.  Trying to guess what you mean ...
    pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
        C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
    uid           TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]
    ```

   特に、フィンガープリントが一致することを確認してください。（上記の例では、フィンガープリントは三行目の`C001`で始まる部分です。）

5. 使用しているオペレーティングシステムのバージョンに対応する適切なRippleリポジトリを追加します。

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

   上記の例は、**Ubuntu 20.04 Focal Fossa**向けのものです。。その他のオペレーティングシステムについては、`focal`という単語を次のいずれかに置き換えます。

    - `bionic` for **Ubuntu 18.04 Bionic Beaver**
    - `buster` for **Debian 10 Buster**
    - `bullseye` for **Debian 11 Bullseye**
    - `jammy` for **Ubuntu 22.04 Jammy Jellyfish**

   `rippled`の開発バージョンまたはプレリリースバージョンにアクセスするには、`stable`ではなく次のいずれかを使用します。

   - `unstable` - プレインストールビルド（[`release`ブランチ](https://github.com/XRPLF/rippled/tree/release)）
   - `nightly` - 実験/開発ビルド（[`develop`ブランチ](https://github.com/XRPLF/rippled/tree/develop)）

   **警告:** 安定版ではないナイトリービルドはいつの時点でも壊れる可能性があります。これらのビルドを本番環境のサーバーに使用しないでください。

6. Rippleリポジトリを取得します。

    ```
    sudo apt -y update
    ```

7. `rippled`ソフトウェアパッケージをインストールします。

    ```
    sudo apt -y install rippled
    ```

8. `rippled`サービスのステータスをチェックします。

    ```
    systemctl status rippled.service
    ```

   `rippled`サービスが自動的に開始します。開始しない場合は、手動で開始できます。

    ```
    sudo systemctl start rippled.service
    ```

## 次のステップ

{% partial file="/_snippets/post-rippled-install.md" /%}



## 関連項目

- **コンセプト:**
    - [`rippled`サーバー](../../concepts/networks-and-servers/index.md)
    - [コンセンサスについて](../../concepts/consensus-protocol/index.md)
- **チュートリアル:**
    - [rippledの構成](../configuration/index.md)
    - [rippledのトラブルシューティング](../troubleshooting/index.md)
    - [rippled APIの使用開始](../../tutorials/get-started/get-started-using-http-websocket-apis.md)
- **リファレンス:**
    - [rippled APIリファレンス](../../references/http-websocket-apis/index.md)
      - [`rippled`コマンドラインの使用](../commandline-usage.md)
      - [server_infoメソッド][]

{% raw-partial file="/_snippets/common-links.md" /%}
