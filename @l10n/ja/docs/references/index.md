---
seo:
    description: XRP LedgerプロトコルやAPIメソッドなどのリファレンスドキュメント
---
# リファレンス

XRP LedgerリファレンスはXRP LedgerプロトコルやAPIメソッドなどのドキュメントです。

## クライアントライブラリ

お使いのプログラミング言語からXRP Ledgerにアクセスするには、以下のライブラリをご利用ください。

{% card-grid %}

{% xrpl-card title="JavaScript / TypeScript" body="xrpl.js - JavaScript/TypeScriptライブラリ" href="https://js.xrpl.org/" image="/img/logos/javascript.svg" imageAlt="Javascript logo" /%}

{% xrpl-card title="Python" body="xrpl.py - Pythonライブラリ" href="https://xrpl-py.readthedocs.io/" image="/img/logos/python.svg" imageAlt="Python logo" /%}

{% xrpl-card title="Java" body="xrpl4j - Javaライブラリ" href="https://javadoc.io/doc/org.xrpl/" image="/img/logos/java.svg" imageAlt="Java logo" /%}

{% /card-grid %}

[さらに見る...](/ja/docs/references/client-libraries/)

## XRP Ledgerプロトコルリファレンス

{% card-grid %}

{% xrpl-card title="基本的なデータ" body="基本的なデータの形式と定義" href="/docs/references/protocol/data-types/basic-data-types/" /%}

{% xrpl-card title="レジャーのデータ" body="XRP Ledgerの状態データを構成する個々のデータ" href="/docs/references/protocol/ledger-data/" /%}

{% xrpl-card title="トランザクション" body="プロトコルのすべてのトランザクションタイプとその結果の定義" href="/docs/references/protocol/transactions/" /%}

{% xrpl-card title="バイナリフォーマット" body="XRP Ledgerのトランザクションやその他のオブジェクトのJSON形式と標準バイナリデータとの変換" href="/docs/references/protocol/binary-format/" /%}

{% /card-grid %}

## HTTP / WebSocket API

{% card-grid %}

{% xrpl-card title="APIの規約" body="rippledサーバに実装されているHTTP API(JSON-RPCとWebSocket)のデータタイプとフォーマットの説明" href="/docs/references/http-websocket-apis/api-conventions/" /%}

{% xrpl-card title="公開APIメソッド" body="サーバーに接続されたクライアントが使用する公開APIメソッド" href="/docs/references/http-websocket-apis/public-api-methods/" /%}

{% xrpl-card title="管理者APIメソッド" body="rippledサーバを運用する信頼できる管理者のための管理者APIメソッド" href="/docs/references/http-websocket-apis/admin-api-methods/" /%}

{% xrpl-card title="Peer Portメソッド" body="XRPL Peer Protocolポートで提供される、ネットワーク情報とステータス情報を共有するための特別なAPIメソッド" href="/docs/references/http-websocket-apis/peer-port-methods/" /%}

{% /card-grid %}

## xrp-ledger.tomlファイル

xrp-ledger.tomlファイルは、他のXRP Ledgerユーザに、あなたのXRP Ledgerの使用状況に関する可読情報を提供します。

- [**ファイルの提供方法**](/ja/docs/references/xrp-ledger-toml/#ファイルの提供方法)
- [**内容**](/ja/docs/references/xrp-ledger-toml/#内容)
- [**CORSの設定**](/ja/docs/references/xrp-ledger-toml/#corsの設定)
- [**ドメイン検証**](/ja/docs/references/xrp-ledger-toml/#ドメイン検証)
- [**アカウント検証**](/ja/docs/references/xrp-ledger-toml/#アカウント検証)
