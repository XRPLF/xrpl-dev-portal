The [`rippled` APIs](rippled-api.html) support two formats of currency code for issued currencies:

- **[Standard Currency Codes](currency-formats.html#standard-currency-codes):** As a 3-character string such as `"EUR"` or `"USD"`.
- **[Nonstandard Currency Codes](currency-formats.html#nonstandard-currency-codes):** As a 160-bit hexadecimal string, such as `"0158415500000000C1F76FF6ECB0BAC600000000"`. This is uncommon.

Currencies with the same code can [ripple](rippling.html) across connected trust lines. Currency codes have no other behavior built into the XRP Ledger.
