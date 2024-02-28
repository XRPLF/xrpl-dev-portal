---
html: configure-statsd.html
parent: configure-rippled.html
seo:
    description: StatsDの統計データでrippledサーバを監視します。
labels:
  - コアサーバ
---
# StatsDの設定

`rippled`は自分自身に関するヘルスや動作情報を[StatsD](https://github.com/statsd/statsd)フォーマットでエクスポートできます。これらの情報は、[`rippledmon`](https://github.com/ripple/rippledmon)やStatsDフォーマットの統計情報を受け付ける他のコレクターを通して取得し、可視化することができます。

## 設定の手順

`rippled`サーバでStatsDを有効にするには、以下の手順を実行します。

1. 別のマシンで`rippledmon`インスタンスをセットアップし、統計情報を受信して集計します。

    ```
    $ git clone https://github.com/ripple/rippledmon.git
    $ cd rippledmon
    $ docker-compose up
    ```

    上記の手順を実行する際には、[Docker](https://docs.docker.com/)と[DockerCompose](https://docs.docker.com/compose/install/)がマシンにインストールされていることを確認してください。`rippledmon`の設定については、[`rippledmon`リポジトリ](https://github.com/ripple/rippledmon)をご覧ください。

0. `[insight]`を`rippled`の設定ファイルに追加します。

    ```
    [insight]
    server=statsd
    address=192.0.2.0:8125
    prefix=my_rippled
    ```

    - `address`には`rippledmon`が接続しているIPアドレスとポートを指定します。デフォルトでは、このポートは8125です。
    - `prefix`には設定する`rippled`サーバを識別する名前を指定します。prefixには、空白、コロン":"、または縦棒"|"を含めてはいけません。このprefix(接頭辞)は、このサーバからエクスポートされるすべてのStatsDの統計情報に表示されます。

    {% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

1. `rippled`サービスを再起動します。

    ```
    $ sudo systemctl restart rippled
    ```

2. 統計情報がエクスポートされていることを確認します。

    ```
    $ tcpdump -i en0 | grep UDP
    ```

    `en0`をあなたのマシンの適切なネットワークインターフェースに置き換えてください。あなたのマシンのインターフェースの完全なリストを取得するには`$ tcpdump -D`を使ってください。

    出力の例:

    ```
    00:41:53.066333 IP 192.0.2.2.63409 > 192.0.2.0.8125: UDP, length 196
    ```

    `rippledmon`インスタンスの設定されたアドレスとポートへの送信トラフィックを示すメッセージが定期的に表示されるはずです。

StatsDの各データの説明については、[`rippledmon`リポジトリ](https://github.com/ripple/rippledmon)をご覧ください。



## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](/about/)
    - [`rippled`サーバ](../../concepts/networks-and-servers/index.md)
- **チュートリアル:**
    - [`rippled`のインストール](../installation/index.md)
    - [容量の計画](../installation/capacity-planning.md)
- **リアファレンス:**
    - [server_infoメソッド](../../references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md)
    - [printメソッド](../../references/http-websocket-apis/admin-api-methods/status-and-debugging-methods/print.md)
