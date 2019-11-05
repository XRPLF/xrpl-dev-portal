# base58エンコード

`rippled` APIでは、チェックサムを含む[base58](https://en.wikipedia.org/wiki/Base58)エンコード（「Base58Check」とも呼ばれます）を使用して[アカウントアドレス](accounts.html#アドレス)や暗号鍵に関連するその他のタイプの値が表現されることがよくあります。このエンコードは、Bitcoinのアドレスに使用されているエンコードと同じですが、XRP Ledgerでは以下のディクショナリが使用される点が異なります。`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`。

XRP Ledgerにより、さまざまなタイプの値をエンコードする前に、データタイプを区別する固有の8ビット数値が値の前に付加されます。XRP Ledgerのbase58ディクショナリの文字配列と組み合わされた、さまざまなタイプのエンコード値のbase58表現は、タイプごとに固有の文字で始まります。

以下の表に、XRP Ledgerで使用されるすべてのエンコードを示します。

| データタイプ                    | 開始文字 | タイププレフィクス | コンテンツのサイズ¹ | 最大文字数 |
|:-----------------------------|:------------|:---------------|:--------------|:--|
| [アカウント][]アドレス          | r           | `0x00`         | 20バイト      | 35 |
| アカウントの公開鍵           | a           | `0x23`         | 33バイト      | 53 |
| シード値（シークレットキー） | s           | `0x21`         | 16バイト      | 29 |
| 検証の公開鍵        | n           | `0x1C`         | 33バイト      | 53 |

¹ コンテンツのサイズでは1バイトのタイププレフィクスは除外されます。

[アカウント]: accounts.html

## 関連項目

- [アドレスのエンコード](accounts.html#アドレスのエンコード) - アドレスのエンコードについての詳細な情報
- [暗号鍵](cryptographic-keys.html) - XRP Ledgerの暗号鍵のタイプとその使用法
- [wallet_proposeリファレンス][wallet_propose method] - アカウントキーを生成するためのAPIメソッド
- [validation_createリファレンス][validation_create method] - バリデータキーを生成するためのAPIメソッド


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
