# base58 Encodings

The `rippled` APIs often use a [base58](https://en.wikipedia.org/wiki/Base58) encoding with a checksum (sometimes called "Base58Check") to represent [account addresses](accounts.html#addresses) and other types of values related to cryptographic keys. This encoding is the same as the one used for Bitcoin addresses, except that the XRP Ledger uses the following dictionary: `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`.

The XRP Ledger prefixes different types of values with a specific 8-bit number before encoding them to distinguish between different data types. Combined with the arrangement of characters in the XRP Ledger's base58 dictionary, the result is that the base58 representations for different types of encoded values start with specific letters by type.

The following table lists all the encodings the XRP Ledger uses:

| Data Type                                | Starts With | Type Prefix | Content size¹ | Maximum characters |
|:-----------------------------------------|:------------|:------------|:--------------|:--|
| [Account][] address                      | r           | `0x00`      | 20 bytes      | 35 |
| Account public key                       | a           | `0x23`      | 33 bytes      | 53 |
| Seed value (for secret keys)             | s           | `0x21`      | 16 bytes      | 29 |
| Validation public key or node public key | n           | `0x1C`      | 33 bytes      | 53 |

¹ Content size excludes the 1-byte type prefix.

[Account]: accounts.html

## See Also

- [Address Encoding](accounts.html#address-encoding) - detailed information on address encoding
- [Cryptographic Keys](cryptographic-keys.html) - types of cryptographic keys in the XRP Ledger and how they're used
- [wallet_propose Reference][wallet_propose method] - API method for generating account keys
- [validation_create Reference][validation_create method] - API method for generating validator keys


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
