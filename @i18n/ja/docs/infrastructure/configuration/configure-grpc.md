---
html: configure-grpc.html
parent: configure-rippled.html
seo:
    description: gRPC APIを有効にして設定します。
labels:
  - コアサーバ
---
# gRPCの設定

`rippled`サーバは[P2Pモードサーバ](../../concepts/networks-and-servers/rippled-server-modes.md)が提供できる限定的な[gRPC API](https://grpc.io/)を持っています。レポートモードのサーバはこのAPIを使って、最新の有効なレジャーやトランザクションに関するデータを取得します。新しい設定を使って、サーバ上でgRPC APIを有効にすることができます。

**注意:** gRPCのサポートは、特にP2Pモードサーバからレポートモードサーバにデータを提供することを目的としています。gRPC APIは予告なく変更される可能性がありますし、将来のバージョンで完全に削除される可能性もあります。

## 前提条件

gRPCを有効にするには、次の前提条件を満たす必要があります。

- [rippledのインストール](../installation/index.md)が必要です。.

- サーバは選択したポートに接続できる必要があります。

## 手順

サーバでgRPCを有効にするには、以下の手順を実行します。

1. `[port_grpc]`が`rippled`設定ファイルにあることを確認してください。

    ```
    [port_grpc]
    port = 50051
    ip = 127.0.0.1
    ```

    - `port`はサーバがクライアントアプリケーションからのgRPC接続を待ち受けるポートを定義します。推奨されるポートは`50051`です。
    - ip`はサーバが待ち受けるインタフェースを定義します。127.0.0.1`はローカルループバックネットワーク(同じマシン)への接続を制限し、デフォルトで有効になっています。この値を`0.0.0.0`に変更すると、利用可能なすべてのネットワークインターフェイスを待ち受けます。

    {% partial file="/@i18n/ja/docs/_snippets/conf-file-location.md" /%}

2. `rippled`サービスを開始（または再起動）します。

    ```
    sudo systemctl restart rippled
    ```

## 関連項目

- **コンセプト:**
    - [XRP Ledgerの概要](/about/)
    - [`rippled`サーバのモード](../../concepts/networks-and-servers/rippled-server-modes.md)
- **チュートリアル:**
    - [HTTP / WebSocketAPIを使ってみる](../../tutorials/http-websocket-apis/build-apps/get-started.md)
    - [信頼できるトランザクションの送信](../../concepts/transactions/reliable-transaction-submission.md)
    - [rippledサーバの管理](../installation/install-rippled-on-ubuntu.md)
- **リファレンス:**
    - [HTTP / WebSocket APIリファレンス](../../references/http-websocket-apis/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
