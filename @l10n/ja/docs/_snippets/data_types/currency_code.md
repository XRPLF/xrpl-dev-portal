[HTTP / WebSocket API](../../references/http-websocket-apis/index.md)は、2種類の通貨コードをサポートしています。

- **[標準通貨コード](../../references/protocol/data-types/currency-formats.md#標準通貨コード):** `"EUR"`や`"USD"`のような3文字の文字列
- **[非標準通貨コード](../../references/protocol/data-types/currency-formats.md#非標準通貨コード):** `"444F4C4C415259444F4F00000000000000000000"`のような160ビットの16進数の文字列。

同じコードを持つトークンは、接続されたトラストラインを越えて[rippling(波及)](../../concepts/tokens/fungible-tokens/rippling.md)することができます。通貨コードには、XRP Ledgerに組み込まれた他の動作はありません。
