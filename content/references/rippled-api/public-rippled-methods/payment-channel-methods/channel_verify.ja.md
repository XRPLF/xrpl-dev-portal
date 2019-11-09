# channel_verify
[[ソース]<br>](https://github.com/ripple/rippled/blob/d4a56f223a3b80f64ff70b4e90ab6792806929ca/src/ripple/rpc/handlers/PayChanClaim.cpp#L89 "Source")

_（[PayChan Amendment][]が有効になっている必要があります。[新規: rippled 0.33.0][]）_

`channel_verify`メソッドは、特定額のXRPをPayment Channelから清算するときに使用できる署名の有効性を検証します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "command":"channel_verify",
   "channel_id":"5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
   "signature":"304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
   "public_key":"aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
   "amount":"1000000"
}
```

*JSON-RPC*

```
POST http://localhost:5005/
Content-Type: application/json

{
   "method":"channel_verify",
   "params":[{
       "channel_id":"5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
       "signature":"304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
       "public_key":"aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
       "amount":"1000000"
   }]
}
```

*コマンドライン*

```
#Syntax: channel_verify <public_key> <channel_id> <amount> <signature>
rippled channel_verify aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3 1000000 304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `amount` | 文字列 | 指定された`signature`で承認する[XRP、drop単位][]の額。 |
| `channel_id` | 文字列 | XRPを供給するChannelのChannel ID。これは64文字の16進文字列です。 |
| `public_key` | 文字列 | Channelの公開鍵と、署名の作成に使用されたキーペア（16進数またはXRP Ledgerの[base58][]形式）。[更新: rippled 0.90.0][新規: rippled 0.90.0] |
| `signature` | 文字列 | 検証する署名（16進数）。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "status":"success",
   "type":"response",
   "result":{
       "signature_verified":true
   }
}
```

*JSON-RPC*

```
200 OK

{
   "result":{
       "signature_verified":true,
       "status":"success"
   }
}
```

*コマンドライン*

```
{
   "result":{
       "signature_verified":true,
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `signature_verified` | ブール値 | `true`の場合、示されている額、Channel、公開鍵で署名が有効です。 |

**注意:** これは、Channelに十分なXRPが割り当てられていることを確認するものではありません。クレームが有効であると判断する前に、最新の検証済みレジャーでこのChannelを調べ、このChannelがオープンでありその`amount`の値がクレームの`amount`以上であることを確認してください。このためには[account_channelsメソッド][]を使用します。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `publicMalformed` - 要求の`public_key`フィールドが、正しいフォーマットの有効な公開鍵ではありません。公開鍵は33バイトであり、base58または16進数で表記されている必要があります。[アカウントの公開鍵のbase58表現は文字`a`から始まります](base58-encodings.html)。16進表現は66文字です。
* `channelMalformed` - 要求の`channel_id`フィールドが有効なChannel IDではありません。Channel IDは256ビット（64文字）の16進文字列である必要があります。
* `channelAmtMalformed` - 要求の`amount`に指定された値が、有効な[XRPの額][XRP、drop単位]ではありませんでした。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
