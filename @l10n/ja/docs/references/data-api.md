---
html: data-api.html
parent: references.html
seo:
    description: (非推奨)XRP Ledger分析と履歴データに対するRESTfulインターフェイスです。
status: removed
nav_omit: true
---
# Ripple Data API v2

**警告:** Ripple Data API v2は非推奨となりました。代わりに[HTTP / WebSocket API](http-websocket-apis/index.md)を使って下さい。

古いData APIについては[rippled-historical-database リポジトリ](https://github.com/ripple/rippled-historical-database)をご覧ください.

## Alternatives

アカウント残高や取引履歴のリクエストなど、ほとんどの一般的な操作では、[WebSocket接続](../tutorials/http-websocket-apis/get-started.md#websocket-api)または[JSON-RPC（HTTP POST）](../tutorials/http-websocket-apis/build-apps/get-started.md#json-rpc)を使用して、セルフホストまたは[公開XRP Ledgerサーバ](../tutorials/public-servers.md)にリクエストすることとができます。

詳細については、[HTTP / WebSocket APIsの使用を開始する](../tutorials/http-websocket-apis/build-apps/get-started.md)ページをご覧ください。
