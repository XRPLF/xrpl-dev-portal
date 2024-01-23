The most secure way to sign a transaction is to [sign locally with a client library](../concepts/transactions/secure-signing.md#local-signing-example). Alternatively, if you run your own `rippled` node you can sign the transaction using the [sign method](../references/http-websocket-apis/admin-api-methods/signing-methods/sign.md), but this must be done through a trusted and encrypted connection, or through a local (same-machine) connection.

In all cases, note the signed transaction's identifying hash for later.
