---
html: channel_authorize.html
parent: payment-channel-methods.html
seo:
    description: 特定額のXRPをPayment Channelから清算するときに使用できる署名を作成します。
labels:
  - Payment Channel
---
# channel_authorize
[[ソース]](https://github.com/XRPLF/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L41 "Source")

_（[PayChan Amendment][]が有効になっている必要があります。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.33.0" %}新規: rippled 0.33.0{% /badge %}）_

`channel_authorize`メソッドは、特定額のXRPをPayment Channelから清算するときに使用できる署名を作成します。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "channel_authorize_example_id1",
    "command": "channel_authorize",
    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
    "seed": "s████████████████████████████",
    "key_type": "secp256k1",
    "amount": "1000000",
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
POST http://localhost:5005/
Content-Type: application/json

{
    "method": "channel_authorize",
    "params": [{
        "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
        "seed": "s████████████████████████████",
        "key_type": "secp256k1",
        "amount": "1000000"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: channel_authorize <private_key> [<key_type>] <channel_id> <drops>
rippled channel_authorize s████████████████████████████ secp256k1 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| フィールド | 型 | 説明        |
|-------|------|-------------|
| `channel_id` | 文字列 | Payment Channelが使用する一意のID。
| `secret` | 文字列 | _（省略可）_ クレームへの署名に使用する秘密鍵。これは、Channelに指定されている公開鍵と同じキーペアである必要があります。`seed`、`seed_hex`、`passphrase`と同時に使用することはできません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}更新: rippled 1.4.0{% /badge %} |
| `seed ` | 文字列 | _（省略可）_ クレームへの署名に使用する秘密シード。これは、Channelに指定されている公開鍵と同じキーペアである必要があります。XRP Ledgerの[base58][]フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed_hex`、`passphrase`と同時に使用することはできません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %} |
| `seed_hex` | 文字列 | _（省略可）_ クレームへの署名に使用する秘密シード。これは、Channelに指定されている公開鍵と同じキーペアである必要があります。16進フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`passphrase`と同時に使用することはできません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %} |
| `passphrase` | 文字列 | _（省略可）_ クレームへの署名に使用する文字列パスフレーズ。これは、Channelに指定されている公開鍵と同じキーペアである必要があります。[このパスフレーズから導出した鍵](../../../../concepts/accounts/cryptographic-keys.md#鍵導出)は、チャネルで指定された公開鍵と一致する必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`seed_hex`と同時に使用することはできません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %} |
| `key_type` | 文字列 | _（省略可）_ 指定された暗号化キーペアの[署名アルゴリズム](../../../../concepts/accounts/cryptographic-keys.md#署名アルゴリズム)。有効な種類は、`secp256k1`または`ed25519`です。デフォルトは`secp256k1`です。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %} |
| `amount` | 文字列 | 承認するXRPの累積額（drop数）送金先がこのChannelからすでに受領しているXRPの額がこのフィールドの額よりも少ない場合、このメソッドで作成される署名を使用して差額を清算できます。 |

リクエストでは、`secret`、`seed`、`seed_hex`、`passphrase`のうち1つだけを指定する**必要があります**。

**警告:** 信頼できないサーバに対して、またはセキュリティが確保されていないネットワーク接続を通じて秘密鍵を送信しないでください。（これには、このリクエストの`secret`、`seed`、`seed_hex`、または`passphrase`フィールドも含まれます）このメソッドは、自身が実行するサーバ、または資金を預けている十分に信頼できるサーバへの、安全で暗号化されたネットワーク接続でのみ使用してください。そうでない場合、盗聴者があなたの秘密鍵を使用してクレームに署名し、同じキーペアを使用してこのPayment Channelなどから資金をすべて持ち出す可能性があります。手順については、[安全な署名の設定](../../../../concepts/transactions/secure-signing.md)をご覧ください。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "channel_authorize_example_id1",
    "status": "success",
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
    "result": {
        "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド | 型 | 説明        |
|-------|------|-------------|
| `signature` | 文字列 | このクレームの署名（16進値）。このクレームを処理するには、Payment Channelの送金先アカウントがこの署名、正確なChannel ID、XRPの額、およびChannelの公開鍵が指定された[PaymentChannelClaimトランザクション][]を送信する必要があります。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `badKeyType` - リクエストの`key_type`パラメーターは、有効なキータイプではありません。(有効なタイプは、`secp256k1`または`ed25519`です。){% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %}
* `badSeed` - リクエストの`secret`が有効なシークレットキーではありません。
* `channelAmtMalformed` - リクエストの`amount`が有効な[XRPの額][XRP、drop単位]ではありません。
* `channelMalformed` - リクエストの`channel_id`が有効なChannel IDではありません。Channel IDは256ビット（64文字）の16進文字列です。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
