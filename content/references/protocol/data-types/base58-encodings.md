---
html: base58-encodings.html
parent: basic-data-types.html
blurb: Formats for representing cryptographic keys and related data in base58 format.
---
# base58 Encodings

XRP Ledger APIs often use a "base58" encoding with a checksum (sometimes called "Base58Check") to represent [account addresses](../../../concepts/accounts/addresses.md) and other types of values related to cryptographic keys. This encoding is the same as [the one used for Bitcoin addresses](https://en.bitcoin.it/wiki/Base58Check_encoding), except that the XRP Ledger uses the following dictionary: `rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`.

The XRP Ledger prefixes different types of values with a specific 8-bit number before encoding them to distinguish between different data types. With the arrangement of characters in the XRP Ledger's base58 dictionary, the result is that the base58 representations for different types of encoded values start with specific letters by type.

The following table lists all the encodings the XRP Ledger uses:

| Data Type                                | Starts With | Type Prefix | Content size¹ | Maximum characters |
|:-----------------------------------------|:------------|:------------|:--------------|:--|
| [Account][] address                      | r           | `0x00`      | 20 bytes      | 35 |
| Account public key                       | a           | `0x23`      | 33 bytes      | 53 |
| Seed value (for secret keys)             | s           | `0x21`      | 16 bytes      | 29 |
| Validation public key or node public key | n           | `0x1C`      | 33 bytes      | 53 |

¹ Content size excludes the 1-byte type prefix.

[Account]: ../../../concepts/accounts/accounts.md

## See Also

- [Address Encoding](../../../concepts/accounts/addresses.md#address-encoding) - detailed information on address encoding
- [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md) - types of cryptographic keys in the XRP Ledger and how they're used
- [wallet_propose Reference][wallet_propose method] - API method for generating account keys
- [validation_create Reference][validation_create method] - API method for generating validator keys

{% raw-partial file="/_snippets/common-links.md" /%}
