---
html: configure-grpc.html
parent: configure-rippled.html
blurb: gRPC APIを有効にして設定します。
labels:
  - コアサーバ
---
# gRPCの設定

`rippled`サーバは[P2Pモードサーバ](rippled-server-modes.html)が提供できる限定的な[gRPC API](https://grpc.io/)を持っています。レポートモードのサーバはこのAPIを使って、最新の有効なレジャーやトランザクションに関するデータを取得します。新しい設定を使って、サーバ上でgRPC APIを有効にすることができます。

**注意:** gRPCのサポートは、特にP2Pモードサーバからレポートモードサーバにデータを提供することを目的としています。gRPC APIは予告なく変更される可能性がありますし、将来のバージョンで完全に削除される可能性もあります。

## 前提条件

gRPCを有効にするには、次の前提条件を満たす必要があります。

- [rippledのインストール](install-rippled.html)が必要です。.

- サーバは選択したポートに接続できる必要があります。

## 手順

サーバでgRPCを有効にするには、以下の手順を実行します。

1. `[port_grpc]`が`rippled`設定ファイルにあることを確認してください。

        [port_grpc]
        port = 50051
        ip = 127.0.0.1

    - `port`はサーバがクライアントアプリケーションからのgRPC接続を待ち受けるポートを定義します。推奨されるポートは`50051`です。
    - ip`はサーバが待ち受けるインタフェースを定義します。127.0.0.1`はローカルループバックネットワーク(同じマシン)への接続を制限し、デフォルトで有効になっています。この値を`0.0.0.0`に変更すると、利用可能なすべてのネットワークインターフェイスを待ち受けます。

    {% include '_snippets/conf-file-location.ja.md' %}

2. `rippled`サービスを開始（または再起動）します。

        sudo systemctl restart rippled

## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](xrp-ledger-overview.html)
    - [`rippled`サーバのモード](rippled-server-modes.html)
- **チュートリアル:**
    - [HTTP / WebSocketAPIを使ってみる](get-started-using-http-websocket-apis.html)
    - [信頼できるトランザクションの送信](reliable-transaction-submission.html)
    - [rippledサーバの管理](manage-the-rippled-server.html)
- **リファレンス:**
    - [HTTP / WebSocket APIリファレンス](http-websocket-apis.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
