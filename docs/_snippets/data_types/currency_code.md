The [HTTP / WebSocket APIs](../../references/http-websocket-apis/index.md) support two formats of currency code:

- **[Standard Currency Codes](../../references/protocol/data-types/currency-formats.md#standard-currency-codes):** As a 3-character string such as `"EUR"` or `"USD"`.
- **[Nonstandard Currency Codes](../../references/protocol/data-types/currency-formats.md#nonstandard-currency-codes):** As a 160-bit hexadecimal string, such as `"0158415500000000C1F76FF6ECB0BAC600000000"`. This is uncommon.

Tokens with the same code can [ripple](../../concepts/tokens/fungible-tokens/rippling.md) across connected trust lines. Currency codes have no other behavior built into the XRP Ledger.
