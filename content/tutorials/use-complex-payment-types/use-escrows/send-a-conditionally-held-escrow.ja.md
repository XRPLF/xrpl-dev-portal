# 条件に基づくEscrowの送信

## 1.条件とフルフィルメントの生成

XRP Ledger EscrowにはPREIMAGE-SHA-256 [Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03)が必要です。条件とフルフィルメントを適切なフォーマットで計算するには、[five-bells-condition](https://github.com/interledgerjs/five-bells-condition)などのCrypto-conditionsライブラリを使用する必要があります。フルフィルメントについては、以下のフルフィルメントを生成するためのメソッドのいずれかを使用することが推奨されます。

- 暗号論的に安全な乱数ソースを使用して、32バイト以上のランダムバイトを生成します。
- Interledger Protocolの[PSK仕様](https://github.com/interledger/rfcs/blob/master/deprecated/0016-pre-shared-key/0016-pre-shared-key.md)に従い、ILPパケットのHMAC-SHA-256をフルフィルメントとして使用します。

ランダムなフルフィルメントと条件のJavaScriptコードの例:

```js
const cc = require('five-bells-condition')
const crypto = require('crypto')

const preimageData = crypto.randomBytes(32)
const myFulfillment = new cc.PreimageSha256()
myFulfillment.setPreimage(preimageData)

const condition = myFulfillment.getConditionBinary().toString('hex').toUpperCase()
console.log('Condition:', condition)
// (Random hexadecimal, 72 chars in length)

// keep secret until you want to finish executing the held payment:
const fulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase()
console.log('Fulfillment:', fulfillment)
// (Random hexadecimal, 78 chars in length)
```

後で使用できるように条件とフルフィルメントを保存します。保留中の支払いの実行が完了するまでは、フルフィルメントを公開しないでください。フルフィルメントを知っていれば誰でもEscrowを終了でき、保留中の資金を指定された送金先にリリースできます。


## 2.リリース時刻または取消し時刻の計算

条件付き`Escrow`トランザクションには、`CancelAfter`フィールドと`FinishAfter`フィールドのいずれか、または両方が含まれている必要があります。`CancelAfter`フィールドを使用すると、指定の時刻までに条件を満たすことができなかった場合に送金元へXRPを返金できます。`FinishAfter`フィールドに指定される時刻より前の時間は、正しいフルフィルメントが送信されてもEscrowを実行できません。いずれのフィールドでも、将来の時刻を指定する必要があります。

`CancelAfter`の時刻を24時間先に設定する例:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

```js
const rippleOffset = 946684800
const CancelAfter = Math.floor(Date.now() / 1000) + (24*60*60) - rippleOffset
console.log(CancelAfter)
// Example:556927412
```

<!--{# Striking Python example for now since we don't have full examples
_Python 2/3_

```python
from time import time
ripple_offset = 946684800
cancel_after = int(time()) + (24*60*60) - 946684800
print(cancel_after)
# Example: 556927412
```

#}-->

<!-- MULTICODE_BLOCK_END -->

**警告:** XRP Ledgerでは、時刻を**Rippleエポック（2000-01-01T00:00:00Z）以降の経過秒数**として指定する必要があります。`CancelAfter`または`FinishAfter`フィールドで、UNIX時刻を同等のRipple時刻に変換せずに使用すると、ロック解除時刻が**30年**先に設定されることになります。

## 3.EscrowCreateトランザクションの送信

[EscrowCreateトランザクション][]に[署名して送信](transaction-basics.html#トランザクションへの署名とトランザクションの送信)します。トランザクションの`Condition`フィールドを、保留中の支払いがリリースされる時刻に設定します。`Destination`を受取人に設定します。受取人と送金元のアドレスは同じでもかまいません。前の手順で算出した`CancelAfter`または`FinishAfter`の時刻も指定します。`Amount`を、Escrowする[XRP、drop単位][]の合計額に設定します。

{% include '_snippets/secret-key-warning.md' %} <!--#{ fix md highlighting_ #}-->

要求:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-request-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

応答:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-response-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## 4.検証の待機

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## 5.Escrowが作成されたことの確認

トランザクションの識別用ハッシュを指定した[txメソッド][]を使用して、トランザクションの最終ステータスを確認します。特に、[Escrowレジャーオブジェクト](escrow.html)が作成されたことを示す`CreatedNode`をトランザクションメタデータで探します。

要求:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-request-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

応答:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-response-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## 6.EscrowFinishトランザクションの送信

`FinishAfter`の時刻が経過した後で資金のリリースを実行する[EscrowFinishトランザクション][]に[署名して送信](transaction-basics.html#トランザクションへの署名とトランザクションの送信)します。トランザクションの`Owner`フィールドにEscrowCreateトランザクションの`Account`アドレスを設定し、`OfferSequence` にEscrowCreateトランザクションの`Sequence`番号を設定します。`Condition`フィールドと`Fulfillment`フィールドに、ステップ1で生成した条件値とフルフィルメント値をそれぞれ16進数で設定します。フルフィルメントのサイズ（バイト数）に基づいて`Fee`（[トランザクションコスト](transaction-cost.html)）の値を設定します。条件付きEscrowFinishでは、少なくとも330 drop（XRP）と、フルフィルメントのサイズで16バイトごとに10 dropが必要です。

**注記:** EscrowCreateトランザクションに`FinishAfter`フィールドが含まれている場合、Escrowの条件として正しいフルフィルメントを指定しても、この時刻よりも前の時点ではこのトランザクションを実行できません。前に閉鎖されたレジャーの閉鎖時刻が`FinishAfter`の時刻よりも前である場合、EscrowFinishトランザクションは[結果コード](transaction-results.html)`tecNO_PERMISSION`で失敗します。

Escrowが有効期限切れの場合は、[Escrowの取消し](cancel-an-expired-escrow.html)だけが可能です。

{% include '_snippets/secret-key-warning.md' %} <!--#{ fix md highlighting_ #}-->

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/submit-request-escrowfinish-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

応答:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/submit-response-escrowfinish-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

トランザクションの識別用`hash`値をメモしておきます。これにより、検証済みレジャーバージョンに記録されるときにその最終ステータスを確認できます。

## 7.検証の待機

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## 8.最終結果の確認

EscrowFinishトランザクションの識別用ハッシュを指定した[txメソッド][]を使用して、トランザクションの最終ステータスを確認します。特にトランザクションメタデータ内で、エスクローに預託された支払いの送金先の`ModifiedNode`（タイプが`AccountRoot`）を確認します。オブジェクトの`FinalFields`に、`Balance`フィールドのXRP返金額の増分が表示されている必要があります。

要求:

```json
{% include '_code-samples/escrow/websocket/tx-request-escrowfinish-condition.json' %}
```

応答:

```json
{% include '_code-samples/escrow/websocket/tx-response-escrowfinish-condition.json' %}
```


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
