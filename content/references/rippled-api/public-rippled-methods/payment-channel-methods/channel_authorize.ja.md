# channel_authorize
[[ソース]<br>](https://github.com/ripple/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L41 "Source")

_（[PayChan Amendment][]が有効になっている必要があります。[新規: rippled 0.33.0][]）_

`channel_authorize`メソッドは、特定額のXRPをPayment Channelから清算するときに使用できる署名を作成します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":"channel_authorize_example_id1",
   "command":"channel_authorize",
   "channel_id":"5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
   "secret":"s████████████████████████████",
   "amount":"1000000"
}
```

*JSON-RPC*

```json
POST http://localhost:5005/
Content-Type: application/json

{
   "method":"channel_authorize",
   "params":[{
       "channel_id":"5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
       "secret":"s████████████████████████████",
       "amount":"1000000"
   }]
}
```

*コマンドライン*

```
#Syntax: channel_authorize <private_key> <channel_id> <drops>
rippled channel_authorize s████████████████████████████ 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `channel_id` | 文字列 | Payment Channelが使用する一意のID。
| `secret` | 文字列 | クレームへの署名に使用するシークレットキー。これは、Channelに指定されている公開鍵と同じキーペアである必要があります。 |
| `amount` | 文字列 | 承認するXRPの累積額（drop数）送金先がこのChannelからすでに受領しているXRPの額がこのフィールドの額よりも少ない場合、このメソッドで作成される署名を使用して差額を清算できます。 |

**注記:** このメソッドでクレームに署名するときにはEd25519キーは使用できません。これは既知のバグです（RIPD-1474）。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":"channel_authorize_example_id1",
   "status":"success"
   "result":{
       "signature":"304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
   }
}
```

*JSON-RPC*

```json
200 OK

{
   "result":{
       "signature":"304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
       "status":"success"
   }
}
```

*コマンドライン*

```
{
   "result":{
       "signature":"304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `signature` | 文字列 | このクレームの署名（16進値）。このクレームを処理するには、Payment Channelの送金先アカウントがこの署名、正確なChannel ID、XRPの額、およびChannelの公開鍵が指定された[PaymentChannelClaimトランザクション][]を送信する必要があります。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `badSeed` - 要求の`secret`が有効なシークレットキーではありません。
* `channelAmtMalformed` - 要求の`amount`が有効な[XRPの額][XRP、drop単位]ではありません。
* `channelMalformed` - 要求の`channel_id`が有効なChannel IDではありません。Channel IDは256ビット（64文字）の16進文字列です。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
