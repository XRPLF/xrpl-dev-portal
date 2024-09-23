---
html: rate-limiting.html
parent: api-conventions.html
seo:
    description: パブリックAPIがどのようにクライアントのリクエスト数を制限しているかについての説明です。
labels:
  - コアサーバ
---
# レート制限

`rippled`サーバはAPIクライアントが公開APIにリクエストできるレートを制限できます。レート制限はクライアントのIPアドレスに基づいて行われるため、[ネットワークアドレス変換](https://ja.wikipedia.org/wiki/ネットワークアドレス変換)の背後にいるクライアントは公開IPアドレスに基づく制限を共有します。

**ヒント:** レート制限は、クライアントが[管理者](../../../tutorials/http-websocket-apis/build-apps/get-started.md#管理者アクセス権限)として接続されているときには適用されません

クライアントがレート制限に近づいている場合、サーバは[APIレスポンス](response-formatting.md)のトップレベルにフィールド`"warning"： "load"`というフィールドを[APIレスポンス](response-formatting.md)のトップレベルに追加します。この警告はすべてのレスポンスに追加されるわけではありませんが、サーバはクライアントを切断する前に何度かこのような警告を送ることがあります。

クライアントがレート制限を超えると、サーバはそのクライアントを切断し、しばらくの間、クライアントのAPIアドレスからのリクエストを受け付けません。WebSocket APIとJSON-RPC APIでは、異なる切断メッセージを使用します。

## WebSocket APIの切断メッセージ

WebSocket APIの場合、サーバは接続を閉じ、切断メッセージとコードを提供します。これらのメッセージにアクセスする方法は、WebSocket クライアントの実装に依存します。例えば、[Node.js ws ライブラリ](https://github.com/websockets/ws)を使用する場合、次のコードは切断時に切断理由を表示します。

```js
const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:6007/')
ws.on('close', (code,reason) => {
  console.log("Disconnected. \ncode: ", code, "\nreason: ", reason)
})

// If rate limited, prints:
// Disconnected.
// code:  1008
// reason:  threshold exceeded
```

レート制限のために接続が切断された場合、切断コードは`1008`で、切断メッセージは`threshold exceeded`という文字列になります。

## JSON-RPCのレート制限エラー

JSON-RPC APIリクエストの場合、クライアントがレート制限を超えると、サーバはHTTPステータスコード**503 Service Unavailable**でレスポンスします。このレスポンスには、サーバに負荷がかかっていることを示すテキスト（JSONではありません）の本文が含まれます。

```text
503 Service Unavailable

Server is overloaded
```

## リクエストあたりのレート
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/resource/Fees.h "ソース")

サーバは時間の経過とともに行われるリクエストの数に基づいてクライアントの使用率を計算し、サーバがリクエストにレスポンスするためにどれだけの作業をしなければならないかに基づいて、異なるタイプのリクエストに重みをつけます。[subscribeメソッド][]と[path_findメソッド][]に対するサーバからの後続メッセージもクライアントの使用率にカウントされます。

使用率は時間とともに指数関数的に低下するため、リクエストを自動的に行わないクライアントは、数秒から数分後にアクセスが回復します。

## 関連項目

- **コンセプト:**
    - [`rippled`サーバ](../../../concepts/networks-and-servers/index.md)
    - [ソフトウェアエコシステム](../../../introduction/software-ecosystem.md)
- **チュートリアル:**
    - [XRP Ledger APIの使用開始](../../../tutorials/http-websocket-apis/build-apps/get-started.md)
    - [rippledのトラブルシューティング](../../../infrastructure/troubleshooting/index.md)
- **リファレンス:**
    - [rippled APIリファレンス](../index.md)
        - [エラーのフォーマット](error-formatting.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
