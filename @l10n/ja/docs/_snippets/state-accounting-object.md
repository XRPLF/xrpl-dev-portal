### State Accountingオブジェクト
<!-- このネストされたオブジェクトの定義は、server_stateとserver_infoで共通です。 -->

`state_accounting`オブジェクトの各フィールドは、キーが特定の[サーバの状態](../references/http-websocket-apis/api-conventions/xrpld-server-states.md)を表し、値が次のフィールドを持つオブジェクトです。

| フィールド      | 値           | 説明 |
|---------------|-------------|------|
| `duration_us` | 文字列 - 数値 | サーバがこの状態で過ごしたマイクロ秒数。（サーバが別の状態に移行するたびに更新されます。） |
| `transitions` | 文字列 - 数値 | サーバがこの状態に移行した回数。 |
