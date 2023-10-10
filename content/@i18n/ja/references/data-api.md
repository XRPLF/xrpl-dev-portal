---
html: data-api.html
parent: references.html
blurb: XRP Ledger分析と履歴データに対するRESTfulインターフェイスです。
status: removed
nav_omit: true
---
# Ripple Data API v2

**警告:** Ripple Data API v2は廃止されました。代わりに[HTTP / WebSocket API](http-websocket-apis.html)を使って下さい。

Ripple Data API v2を使用すると、XRP Ledgerの変更に関する情報（トランザクション履歴や処理済みの分析データなど）にアクセスできます。このような情報は専用データベースに保管されるので、`rippled`サーバーで保持する必要のある履歴レジャーバージョンの数が少なくなります。Data API v2は[XRP Charts](https://xrpcharts.ripple.com/)や[ripple.com](https://www.ripple.com)などのアプリケーションのデータソースとしても機能します。

廃止されましたRipple Data APIについては[rippled-historical-database レポジトリー](https://github.com/ripple/rippled-historical-database)をご覧下さい.
