---
html: configure-the-peer-crawler.html
parent: configure-peering.html
blurb: rippledサーバーがステータスとピアについてどの程度の情報を公表するか設定します。
labels:
  - Core Server
  - Security
---
# ピアクローラの設定

デフォルトでは、[`rippled`サーバ](xrpl-servers.html)は、[ピアクローラAPI](peer-crawler.html)を使って要求してきた人に統計を公開し、[XRP Ledgerのピアツーピアネットワーク](peer-protocol.html)の健全性と状況を追跡しやすくしています。より多くの情報を提供したり、より少ない情報を提供したり、あるいはピアクローラーのリクエストを完全に拒否するように、サーバを設定することができます。

このドキュメントには、2つのオプションについて説明しています。

- [ピアクローラが報告する情報の変更](#ピアクローラが報告する情報の変更)
- [ピアクローラの無効化](#ピアクローラの無効化)

## ピアクローラが報告する情報の変更

ピアクローラからの要求に対してサーバが提供する情報量を設定するには、以下の手順を実行します。

1. `rippled`の設定ファイルを編集します。

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.ja.md' %}<!--_ -->

2. 設定ファイルに`[crawl]`を追加または更新し、変更を保存します。

        [crawl]
        overlay = 1
        server = 1
        counts = 0
        unl = 1

    このスタンザのフィールドは、サーバが[peer crawlerレスポンス](peer-crawler.html#レスポンスのフォーマット)で返すフィールドを制御します。設定フィールドの名前はAPIレスポンスのフィールドと一致します。値が`1`の設定は、レスポンスにそのフィールドを含めることを意味します。0`の値は、そのフィールドをレスポンスから省略することを意味します。この例では、各設定のデフォルト値を示しています。

3. 設定ファイルに変更を保存したら、`rippled`サーバを再起動して、更新された設定を適用します。

        systemctl restart rippled


## ピアクローラの無効化

サーバのピアクローラAPIを無効にして、ピアクローラーリクエストにまったく応答しないようにするには、以下の手順を実行します。

1. `rippled`の設定ファイルを編集します。

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.ja.md' %}<!--_ -->

2. 設定ファイルに`[crawl]`を追加または更新し、変更を保存します。

        [crawl]
        0

    `[crawl]`の他のすべての内容を削除するか、コメントアウトしてください。

3. 設定ファイルに変更を保存したら、`rippled`サーバを再起動して、更新された設定を適用します。

        systemctl restart rippled


## 関連項目

- **コンセプト:**
    - [ピアプロトコル](peer-protocol.html)
- **チュートリアル:**
    - [rippledサーバの管理](manage-the-rippled-server.html)
- **リファレンス:**
    - [server_infoメソッド][]
    - [peersメソッド][]
    - [ピアクローラ](peer-crawler.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
