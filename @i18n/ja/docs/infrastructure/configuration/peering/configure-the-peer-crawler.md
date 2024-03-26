---
html: configure-the-peer-crawler.html
parent: configure-peering.html
seo:
    description: rippledサーバがステータスとピアについてどの程度の情報を公表するか設定します。
labels:
  - Core Server
  - Security
---
# ピアクローラの設定

デフォルトでは、[`rippled`サーバ](../../../concepts/networks-and-servers/index.md)は、[ピアクローラAPI](../../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)を使ってリクエストしてきた人に統計を公開し、[XRP Ledgerのピアツーピアネットワーク](../../../concepts/networks-and-servers/peer-protocol.md)の健全性と状況を追跡しやすくしています。より多くの情報を提供したり、より少ない情報を提供したり、あるいはピアクローラーのリクエストを完全に拒否するように、サーバを設定することができます。

このドキュメントには、2つのオプションについて説明しています。

- [ピアクローラが報告する情報の変更](#ピアクローラが報告する情報の変更)
- [ピアクローラの無効化](#ピアクローラの無効化)

## ピアクローラが報告する情報の変更

ピアクローラからのリクエストに対してサーバが提供する情報量を設定するには、以下の手順を実行します。

1. `rippled`の設定ファイルを編集します。

    ```
    vim /etc/opt/ripple/rippled.cfg
    ```

    {% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

2. 設定ファイルに`[crawl]`を追加または更新し、変更を保存します。

    ```
    [crawl]
    overlay = 1
    server = 1
    counts = 0
    unl = 1
    ```

    このスタンザのフィールドは、サーバが[peer crawlerレスポンス](../../../references/http-websocket-apis/peer-port-methods/peer-crawler.md#レスポンスのフォーマット)で返すフィールドを制御します。設定フィールドの名前はAPIレスポンスのフィールドと一致します。値が`1`の設定は、レスポンスにそのフィールドを含めることを意味します。0`の値は、そのフィールドをレスポンスから省略することを意味します。この例では、各設定のデフォルト値を示しています。

3. 設定ファイルに変更を保存したら、`rippled`サーバを再起動して、更新された設定を適用します。

    ```
    systemctl restart rippled
    ```


## ピアクローラの無効化

サーバのピアクローラAPIを無効にして、ピアクローラーリクエストにまったくレスポンスしないようにするには、以下の手順を実行します。

1. `rippled`の設定ファイルを編集します。

    ```
    vim /etc/opt/ripple/rippled.cfg
    ```

    {% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

2. 設定ファイルに`[crawl]`を追加または更新し、変更を保存します。

    ```
    [crawl]
    0
    ```

    `[crawl]`の他のすべての内容を削除するか、コメントアウトしてください。

3. 設定ファイルに変更を保存したら、`rippled`サーバを再起動して、更新された設定を適用します。

    ```
    systemctl restart rippled
    ```


## 関連項目

- **コンセプト:**
    - [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)
- **チュートリアル:**
    - [rippledサーバの管理](../../installation/install-rippled-on-ubuntu.md)
- **リファレンス:**
    - [server_infoメソッド][]
    - [peersメソッド][]
    - [ピアクローラ](../../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
