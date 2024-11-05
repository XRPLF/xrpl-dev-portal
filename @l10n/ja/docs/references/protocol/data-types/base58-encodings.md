---
html: base58-encodings.html
parent: basic-data-types.html
seo:
    description: 暗号鍵と関連データをbase58形式で表すフォーマットです。
---
# base58エンコード

`rippled` APIでは、チェックサムを含む**base58**エンコード（「Base58Check」とも呼ばれます）を使用して[アカウントアドレス](../../../concepts/accounts/addresses.md)や暗号鍵に関連するその他のタイプの値が表現されることがよくあります。このエンコードは、[Bitcoinのアドレスに使用されているエンコード](https://en.bitcoin.it/wiki/Base58Check_encoding)と同じですが、XRP Ledgerでは以下のディクショナリが使用される点が異なります。`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`。

XRP Ledgerにより、さまざまなタイプの値をエンコードする前に、データタイプを区別する固有の8ビット数値が値の前に付加されます。XRP Ledgerのbase58ディクショナリの文字配列と組み合わされた、さまざまなタイプのエンコード値のbase58表現は、タイプごとに固有の文字で始まります。

以下の表に、XRP Ledgerで使用されるすべてのエンコードを示します。

| データタイプ | 開始文字 | タイププレフィクス | コンテンツのサイズ¹ | 最大文字数 |
|:-----------------------------------------|:------------|:------------|:--------------|:--|
| [アカウント][]アドレス | r | `0x00` | 20バイト | 35 |
| アカウントの公開鍵 | a | `0x23` | 33バイト | 53 |
| シード値（シークレットキー） | s | `0x21` | 16バイト | 29 |
| 検証公開鍵またはノード公開鍵 | n | `0x1C` | 33バイト | 53 |

¹ コンテンツのサイズでは1バイトのタイププレフィクスは除外されます。

[アカウント]: ../../../concepts/accounts/index.md

## 関連項目

- [アドレスのエンコード](../../../concepts/accounts/addresses.md#アドレスのエンコード) - アドレスのエンコードについての詳細な情報
- [暗号鍵](../../../concepts/accounts/cryptographic-keys.md) - XRP Ledgerの暗号鍵のタイプとその使用法
- [wallet_proposeリファレンス][wallet_proposeメソッド] - アカウントキーを生成するためのAPIメソッド
- [validation_createリファレンス][validation_createメソッド] - バリデータキーを生成するためのAPIメソッド

{% raw-partial file="/docs/_snippets/common-links.md" /%}
