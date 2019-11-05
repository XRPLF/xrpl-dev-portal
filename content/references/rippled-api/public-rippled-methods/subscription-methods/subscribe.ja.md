# subscribe
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Subscribe.cpp "Source")

`subscribe`メソッドは、特定のイベントが発生した場合に、定期的に通知するようサーバーに要求します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*アカウントのサブスクライブ*

```
{
 "id": "Example watch Bitstamp's hot wallet",
 "command": "subscribe",
 "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
}
```

*オーダーブックのサブスクライブ*

```
{
   "id": "Example subscribe to XRP/GateHub USD order book",
   "command": "subscribe",
   "books": [
       {
           "taker_pays": {
               "currency": "XRP"
           },
           "taker_gets": {
               "currency": "USD",
               "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
           },
           "snapshot": true
       }
   ]
}
```

*レジャーストリームのサブスクライブ*

```
{
 "id": "Example watch for new validated ledgers",
 "command": "subscribe",
 "streams": ["ledger"]
}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#subscribe)

要求には以下のパラメーターが含まれます。

| `Field`             | 型   | 説明                                   |
|:--------------------|:-------|:----------------------------------------------|
| `streams`           | 配列  | _（省略可）_ 以下に説明する、サブスクライブする汎用ストリームの文字列名の配列。 |
| `accounts`          | 配列  | _（省略可）_ 検証済みトランザクションを監視するアカウントの一意のアドレスを持つ配列。これらのアドレスはXRP Ledgerの[base58][]フォーマットで記述されている必要があります。サーバーは、1つ以上のアカウントに影響するすべてのトランザクションについて通知を送信します。 |
| `accounts_proposed` | 配列  | _（省略可）_`accounts`と同様ですが、まだファイナライズされていないトランザクションを含みます。 |
| `books`             | 配列  | _（省略可）_ 以下に説明するとおり、更新の監視のために[オーダーブック](http://www.investopedia.com/terms/o/order-book.asp)を定義するオブジェクトの配列。 |
| `url`               | 文字列 | （Websocketでは省略可、それ以外では必須）サーバーが各イベントのJSON-RPCコールバックを送信するURL。*管理者専用。* |
| `url_username`      | 文字列 | _（省略可）_ コールバックURLで基本認証を行うためのユーザー名。 |
| `url_password`      | 文字列 | _（省略可）_ コールバックURLで基本認証を行うためのパスワード。 |

以下のパラメーターは廃止予定で、今後予告なしに削除される可能性があります。`user`, `password`, `rt_accounts`

`streams`パラメーターは、以下のデフォルトの情報ストリームへのアクセスを可能にします。

* `server` - `rippled` サーバーのステータス（ネットワーク接続など）が変更されるたびにメッセージを送信します。
* `ledger` - コンセンサスプロセスで新しい検証済みレジャーが宣言されるたびにメッセージを送信します。
* `transactions` - 閉鎖済みレジャーにトランザクションが追加されるたびにメッセージを送信します。
* `transactions_proposed` - 閉鎖済みレジャーにトランザクションが追加される場合や、検証済みレジャーにまだ追加されておらず、今後も追加される見込みのない一部のトランザクションが閉鎖済みレジャーに追加される場合に、メッセージを送信します。提案されたすべてのトランザクションが検証前に表示されるわけではありません。
    **注記:** 検証済みレジャーには[失敗したトランザクションも記録されます](transaction-results.html)。これは、このようなトランザクションにはスパム対策のトランザクション手数料が課されるためです。
* `validations` - サーバーがバリデータを信頼しているか否かにかかわらず、サーバーが検証メッセージを受信するたびに、メッセージを送信します。（個々の`rippled`は、サーバーが少なくとも定数の信頼できるバリデータから検証メッセージを受信した時点で、レジャーが検証済みであると宣言します。）
* `peer_status` - **（管理者専用）** 接続しているピア`rippled`サーバーに関する情報（特にコンセンサスプロセスに関する情報）。

`books` 配列が指定されている場合、この配列の各要素は、以下のフィールドを持つオブジェクトです。

| `Field`      | 型    | 説明                                         |
|:-------------|:--------|:----------------------------------------------------|
| `taker_gets` | オブジェクト  | オファーを受諾するアカウントが受け取る通貨を[金額なしの通貨オブジェクト](basic-data-types.html#金額なしでの通貨の指定)として指定します。 |
| `taker_pays` | オブジェクト  | オファーを受諾するアカウントが支払う通貨を[金額なしの通貨オブジェクト](basic-data-types.html#金額なしでの通貨の指定)として指定します。 |
| `taker`      | 文字列  | オファーを表示するパースペクティブとして使用する一意のアカウントアドレス（XRP Ledgerの[base58][]フォーマット）。（これはオファーの資金提供ステータスと手数料に影響します。） |
| `snapshot`   | ブール値 | （省略可、デフォルトではfalse）trueの場合は、更新の送信前にサブスクライブした時点でオーダーブックの現在の状態を一度返します。 |
| `both`       | ブール値 | （省略可、デフォルトではfalse）trueの場合は、オーダーブックの両サイドを返します。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": "Example watch Bitstamp's hot wallet",
 "status": "success",
 "type": "response",
 "result": {}
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っています。応答に含まれるフィールドは、要求に指定されたサブスクリプションに応じて異なります。

* `accounts` および`accounts_proposed` - フィールドが返されません。
* *Stream: server* - `load_base`（サーバーの現在の読み込みレベル）、`random`（ランダムに生成された値）などのサーバーのステータスに関する情報。これらの情報は変更される可能性があります。
* *Stream: transactions*、*Stream: transactions_proposed*、および*Stream: validations* - フィールドは返されません。
* *Stream: ledger* - 手元にあるレジャーと現在の手数料体系に関する情報。`fee_base`（XRP単位のトランザクションの現行基本手数料）、`fee_ref`（手数料単位のトランザクションの現行基本手数料）、`ledger_hash`（最新の検証済みレジャーのハッシュ）、`reserve_base`（アカウントの最低必要準備金）などがあります。
* `books` - フィールドはデフォルトで返されません。要求が`"snapshot": true`に設定されている場合、`offers`（オーダーブックを定義するオファー定義オブジェクトの配列）を返します。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noPermission` - 要求に`url`フィールドが指定されていますが、管理者として接続していません。
* `unknownStream` - 要求の`streams`フィールドの1つ以上の要素が有効なストリーム名ではありません。
* `malformedStream` - 要求の`streams`フィールドのフォーマットが適切ではありません。
* `malformedAccount` - 要求の`accounts`または`accounts_proposed`フィールドのアドレスのいずれか1つが、適切なフォーマットのXRP Ledgerアドレスではありません。（**注記:** グローバルレジャーにまだエントリーのないアドレスのストリームをサブスクライブして、そのアドレスに資金が供給されたらメッセージを受け取るように _できます_ 。）
* `srcCurMalformed` - 要求の`books`フィールドの1つ以上の`taker_pays`サブフィールドのフォーマットが適切ではありません。
* `dstAmtMalformed` - 要求の`books`フィールドの1つ以上の`taker_gets`サブフィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - 要求の`books`フィールドの1つ以上の`taker_pays`サブフィールドの`issuer`フィールドが無効です。
* `dstIsrMalformed` - 要求の`books`フィールドの1つ以上の`taker_gets`サブフィールドの`issuer`フィールドが無効です。
* `badMarket` - `books` フィールドに指定されている1つ以上のオーダーブックが存在していません（ある通貨とその通貨自体の交換オファーなど）。

特定のストリームをサブスクライブすると、サブスクライブを解除するか、WebSocket接続を閉じるまで、そのストリームに関する応答を定期的に受信します。これらの応答の内容は、サブスクライブしている内容に応じて異なります。以下に、いくつかの例を紹介します。

## レジャーストリーム

`ledger`ストリームは、[コンセンサスプロセス](https://ripple.com/build/ripple-ledger-consensus-process/)で新しい検証済みレジャーが宣言されたときにのみ`ledgerClosed`メッセージを送信します。このメッセージはレジャーを識別し、そのレジャーの内容について何らかの情報を伝えます。

```
{
 "type": "ledgerClosed",
 "fee_base": 10,
 "fee_ref": 10,
 "ledger_hash": "687F604EF6B2F67319E8DCC8C66EF49D84D18A1E18F948421FC24D2C7C3DB464",
 "ledger_index": 7125358,
 "ledger_time": 455751310,
 "reserve_base": 20000000,
 "reserve_inc": 5000000,
 "txn_count": 7,
 "validated_ledgers": "32570-7125358"
}
```

レジャーストリームメッセージのフィールドは次のとおりです。

| `Field`             | 型             | 説明                         |
|:--------------------|:-----------------|:------------------------------------|
| `type`              | 文字列           | `ledgerClosed` は、このメッセージがレジャーストリームからのものであることを示します。 |
| `fee_base`          | 符号なし整数 | 「リファレンストランザクション」のコスト（XRPのdrop数）（[トランザクションコスト](transaction-cost.html)を参照してください。レジャーに[SetFee疑似トランザクション](setfee.html)が記録されている場合、このレジャー以降のすべてのトランザクションに新しいトランザクションコストが適用されます。） |
| `fee_ref`           | 符号なし整数 | 「リファレンストランザクション」のコスト（手数料単位） |
| `ledger_hash`       | 文字列           | 閉鎖されたレジャーの一意のハッシュ（16進数） |
| `ledger_index`      | 符号なし整数 | 閉鎖されたレジャーのシーケンス番号 |
| `ledger_time`       | 符号なし整数 | レジャーが閉鎖された時刻（[Rippleエポック以降の経過秒数][]） |
| `reserve_base`      | 符号なし整数 | アカウントに最低限必要とされる準備金（XRPのdrop数）。レジャーに[SetFee疑似トランザクション](setfee.html)が記録されている場合、このレジャー以降は新しい基本準備金が適用されます。 |
| `reserve_inc`       | 符号なし整数 | アカウントが所有する各アイテムに、オファーやトラストラインなどが追加されたことによるアカウント準備金の増加。レジャーに[SetFee疑似トランザクション](setfee.html)が記録されている場合、このレジャー以降は新しい所有者準備金が適用されます。 |
| `txn_count`         | 符号なし整数 | このレジャーに記録される新規トランザクションの数 |
| `validated_ledgers` | 文字列           | （省略される場合があります）サーバーで使用可能なレジャーの範囲。これは連続的ではない可能性があります。サーバーがネットワークに接続されていない場合や、サーバーが接続されていてもネットワークからレジャーをまだ取得していない場合は、このフィールドは返されません。 |


## 検証ストリーム

[新規: rippled 0.29.0][]

検証ストリームは、検証メッセージ（検証投票）を信頼するバリデータから受信するたびに、次のようなメッセージを送信します。

```
{
   "type": "validationReceived",
   "amendments":[
       "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
       "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
       "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
       "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490",
       "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13"
   ],
   "base_fee":10,
   "flags":2147483649,
   "full":true,
   "ledger_hash":"EC02890710AAA2B71221B0D560CFB22D64317C07B7406B02959AD84BAD33E602",
   "ledger_index":"6",
   "load_fee":256000,
   "reserve_base":20000000,
   "reserve_inc":5000000,
   "signature":"3045022100E199B55643F66BC6B37DBC5E185321CF952FD35D13D9E8001EB2564FFB94A07602201746C9A4F7A93647131A2DEB03B76F05E426EC67A5A27D77F4FF2603B9A528E6",
   "signing_time":515115322,
   "validation_public_key":"n94Gnc6svmaPPRHUAyyib1gQUov8sYbjLoEwUBYPH39qHZXuo8ZT"
}
```

検証ストリームメッセージのフィールドは次のとおりです。

| `Field`                 | 型             | 説明                     |
|:------------------------|:-----------------|:--------------------------------|
| `type`                  | 文字列           | 値`validationReceived`は、このメッセージが検証ストリームからであることを示します。 |
| `amendments`            | 文字列の配列 | （省略される場合があります）このサーバーがプロトコルへの追加を求める[Amendment](amendments.html)。[新規: rippled 0.32.0][] |
| `base_fee`              | 整数          | （省略される場合があります）サーバーが[手数料投票](fee-voting.html)による設定を希望するスケーリングされていないトランザクションコスト（`reference_fee` 値）。[新規: rippled 0.32.0][] |
| `flags`                 | 数値           | この検証メッセージに追加されるフラグのビットマスク。フラグ0x80000000は、検証の署名が完全に正規であることを示します。フラグ0x00000001は、完全な検証であることを示します。それ以外の場合は部分検証です。部分検証とは、特定のレジャーに対する投票ではありません。部分検証は、バリデータがオンラインであるがコンセンサスにまだ同意していないことを示します。[新規: rippled 0.32.0][] |
| `full`                  | ブール値          | `true`の場合は、完全な検証です。それ以外の場合は部分検証です。部分検証とは、特定のレジャーに対する投票ではありません。部分検証は、バリデータがオンラインであるがコンセンサスにまだ同意していないことを示します。[新規: rippled 0.32.0][] |
| `ledger_hash`           | 文字列           | 提案されたレジャーの識別ハッシュを検証中です。 |
| `ledger_index`          | 文字列 - 整数 | 提案されたレジャーの[レジャーインデックス][]。[新規: rippled 0.31.0][] |
| `load_fee`              | 整数          | （省略される場合があります）このバリデータにより現在施行されているローカルの負荷スケーリングされたトランザクションコスト（手数料単位）。[新規: rippled 0.32.0][] |
| `reserve_base`          | 整数          | （省略される場合があります）このバリデータが[手数料投票](fee-voting.html)による設定を希望する最低必要準備金（`account_reserve` 値）。[新規: rippled 0.32.0][] |
| `reserve_inc`           | 整数          | （省略される場合があります）このバリデータが[手数料投票](fee-voting.html)による設定を希望する必要準備金（`owner_reserve` 値）の増分。[新規: rippled 0.32.0][] |
| `signature`             | 文字列           | バリデータがこのレジャーへの投票に署名するときに使用する署名。 |
| `signing_time`          | 数値           | この検証投票が署名された時刻（[Rippleエポック以降の経過秒数][]）。[新規: rippled 0.32.0][] |
| `validation_public_key` | 文字列           | バリデータがメッセージの署名に使用したキーペアの公開鍵（XRP Ledgerの[base58][]形式）。このフィールドは、メッセージを送信するバリデータを特定します。また`signature`の検証にも使用できます。 |


## トランザクションストリーム

サブスクリプションの多くは、次のようなトランザクションに関するメッセージをもたらします。

* `transactions`ストリーム
* `transactions_proposed`ストリーム
* `accounts` サブスクリプション
* `accounts_proposed` サブスクリプション
* `book` （オーダーブック）サブスクリプション

`transactions_proposed`ストリームは、厳密には`transactions`ストリームのスーパーセットです。このストリームにはすべての検証済みトランザクションと、検証済みレジャーにまだ記録されておらず、今後も記録される見込みのない提案されたトランザクションがいくつか記録されます。このような「処理中」のトランザクションはそのフィールドから判断できます。

* `validated`フィールドがないか、または値`false`が指定されている。
* `meta`フィールドまたは`metadata`フィールドがない。
* トランザクションがファイナライズされたレジャーバージョンを指定する`ledger_index`フィールドと`ledger_hash`フィールドの代わりに、現在これらのトランザクションに提案されているレジャーバージョンを指定する`ledger_current_index`フィールドが存在する。

上記に該当しない場合、`transactions_proposed`ストリームからのメッセージは`transactions`ストリームからのメッセージと同じです。

アカウントまたはオーダーブックを変更できるのはトランザクションだけであるため、特定の`accounts`または`books`をサブスクライブすることにより送信されるメッセージも、トランザクションメッセージの形式（`transactions`ストリームのメッセージと同じ形式）となります。唯一の異なる点は、監視中のアカウントまたはオーダーブックに影響するトランザクションに対するメッセージだけを受信することです。

`accounts_proposed`サブスクリプションも同様に機能しますが、このサブスクリプションには、`transactions_proposed`ストリームと同様、監視中のアカウントの未確定トランザクションも記録される点が異なります。

```
{
 "status": "closed",
 "type": "transaction",
 "engine_result": "tesSUCCESS",
 "engine_result_code": 0,
 "engine_result_message": "The transaction was applied.",
 "ledger_hash": "989AFBFD65D820C6BD85301B740F5D592F060668A90EEF5EC1815EBA27D58FE8",
 "ledger_index": 7125442,
 "meta": {
   "AffectedNodes": [
     {
       "ModifiedNode": {
         "FinalFields": {
           "Flags": 0,
           "IndexPrevious": "0000000000000000",
           "Owner": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
           "RootIndex": "ABD8CE2D1205D0C062876E9E1F3CBDC902ED8EF4E8D3D071B962C7ED0E113E68"
         },
         "LedgerEntryType": "DirectoryNode",
         "LedgerIndex": "0BBDEE7D0BE120F7BF27640B5245EBFE0C5FD5281988BA823C44477A70262A4D"
       }
     },
     {
       "DeletedNode": {
         "FinalFields": {
           "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
           "BookDirectory": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
           "BookNode": "0000000000000000",
           "Flags": 0,
           "OwnerNode": "000000000000006E",
           "PreviousTxnID": "58A17D95770F8D07E08B81A85896F4032A328B6C2BDCDEC0A00F3EF3914DCF0A",
           "PreviousTxnLgrSeq": 7125330,
           "Sequence": 540691,
           "TakerGets": "4401967683",
           "TakerPays": {
             "currency": "BTC",
             "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
             "value": "0.04424"
           }
         },
         "LedgerEntryType": "Offer",
         "LedgerIndex": "386B7803A9210747941B0D079BB408F31ACB1CB98832184D0287A1CBF4FE6D00"
       }
     },
     {
       "DeletedNode": {
         "FinalFields": {
           "ExchangeRate": "4A03920BFC5E99BE",
           "Flags": 0,
           "RootIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
           "TakerGetsCurrency": "0000000000000000000000000000000000000000",
           "TakerGetsIssuer": "0000000000000000000000000000000000000000",
           "TakerPaysCurrency": "0000000000000000000000004254430000000000",
           "TakerPaysIssuer": "92D705968936C419CE614BF264B5EEB1CEA47FF4"
         },
         "LedgerEntryType": "DirectoryNode",
         "LedgerIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE"
       }
     },
     {
       "ModifiedNode": {
         "FinalFields": {
           "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
           "Balance": "11133297300",
           "Flags": 0,
           "OwnerCount": 9,
           "Sequence": 540706
         },
         "LedgerEntryType": "AccountRoot",
         "LedgerIndex": "A6C2532E1008A513B3F822A92B8E5214BD0D413DC20AD3631C1A39AD6B36CD07",
         "PreviousFields": {
           "Balance": "11133297310",
           "OwnerCount": 10,
           "Sequence": 540705
         },
         "PreviousTxnID": "484D57DFC4E446DA83B4540305F0CE836D4E007361542EC12CC0FFB5F0A1BE3A",
         "PreviousTxnLgrSeq": 7125358
       }
     }
   ],
   "TransactionIndex": 1,
   "TransactionResult": "tesSUCCESS"
 },
 "transaction": {
   "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
   "Fee": "10",
   "Flags": 2147483648,
   "OfferSequence": 540691,
   "Sequence": 540705,
   "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
   "TransactionType": "OfferCancel",
   "TxnSignature": "30450221008223604A383F3AED25D53CE7C874700619893A6EEE4336508312217850A9722302205E0614366E174F2DFF78B879F310DB0B3F6DA1967E52A32F65E25DCEC622CD68",
   "date": 455751680,
   "hash": "94CF924C774DFDBE474A2A7E40AEA70E7E15D130C8CBEF8AF1D2BE97A8269F14"
 },
 "validated": true
}
```

トランザクションストリームメッセージには次のフィールドがあります。

| `Field`                 | 型             | 説明                     |
|:------------------------|:-----------------|:--------------------------------|
| `type`                  | 文字列           | `transaction` は、トランザクションの通知であることを示します。この通知はさまざまなストリームから送信される可能性があります。 |
| `engine_result`         | 文字列           | 文字列の[トランザクション結果コード](transaction-results.html) |
| `engine_result_code`    | 数値           | 数値の[トランザクション応答コード](transaction-results.html)（該当する場合） |
| `engine_result_message` | 文字列           | 人間が読み取れる形式のトランザクション応答の説明 |
| `ledger_current_index`  | 符号なし整数 | （検証済みトランザクションでは省略）このトランザクションが現在提案されている現行レジャーバージョンのシーケンス番号。 |
| `ledger_hash`           | 文字列           | （未検証のトランザクションでは省略）このトランザクションが記録されているレジャーバージョンの一意のハッシュ（16進数） |
| `ledger_index`          | 符号なし整数 | （未検証のトランザクションでは省略）このトランザクションが記録されているレジャーバージョンのシーケンス番号。 |
| `meta`                  | オブジェクト           | （未検証のトランザクションでは省略）このトランザクションに関する各種メタデータ（影響するレジャーエントリーを含む） |
| `transaction`           | オブジェクト           | JSONフォーマットの[トランザクションの定義](transaction-formats.html)。 |
| `validated`             | ブール値          | trueの場合、このトランザクションは検証済みレジャーに記録されてます。`transaction`ストリームからの応答は常に検証される必要があります。 |


## ピアステータスストリーム

管理者専用の`peer_status`ストリームは、このサーバーが接続している他の`rippled`サーバーの活動に関する大量の情報、特にコンセンサスプロセスでのサーバーのステータスを報告します。

ピアステータスストリームメッセージの例:

```
{
   "action": "CLOSING_LEDGER",
   "date": 508546525,
   "ledger_hash": "4D4CD9CD543F0C1EF023CC457F5BEFEA59EEF73E4552542D40E7C4FA08D3C320",
   "ledger_index": 18853106,
   "ledger_index_max": 18853106,
   "ledger_index_min": 18852082,
   "type": "peerStatusChange"
}
```

ピアステータスストリームメッセージは、ピア`rippled`サーバーのステータスが変化したイベントを表します。これらのメッセージは、次のフィールドを持つJSONオブジェクトです。

| `Field`            | 値  | 説明                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `type`             | 文字列 | `peerStatusChange` は、ピアステータスストリームからのメッセージであることを示します。 |
| `action`           | 文字列 | このメッセージが送信される原因となったイベントのタイプ。有効な値については、[ピアステータスイベント](#ピアステータスイベント)を参照してください。 |
| `date`             | 数値 | このイベントが発生した時刻（[Rippleエポック以降の経過秒数][]） |
| `ledger_hash`      | 文字列 | （省略される場合があります）このメッセージに関連するレジャーバージョンの識別用[ハッシュ][]。 |
| `ledger_index`     | 数値 | （省略される場合があります）このメッセージに関連するレジャーバージョンの[レジャーインデックス][]。 |
| `ledger_index_max` | 数値 | （省略される場合があります）ピアで現在使用可能な最大[レジャーインデックス][]。 |
| `ledger_index_min` | 数値 | （省略される場合があります）ピアで現在使用可能な最小[レジャーインデックス][]。 |

### ピアステータスイベント

ピアステータスストリームメッセージの`action`フィールドには次のいずれかの値が含まれます。

| `Value`           | 意味                                                  |
|:------------------|:---------------------------------------------------------|
| `CLOSING_LEDGER`  | ピアがこの[レジャーインデックス][]のレジャーバージョンを閉鎖しました。この場合、通常はコンセンサスが間もなく開始されます。 |
| `ACCEPTED_LEDGER` | ピアがコンセンサスラウンドの結果としてこのレジャーバージョンを作成しました。**注記:** このレジャーが不変的に検証済みになるかどうかはまだ確実ではありません。 |
| `SWITCHED_LEDGER` | ピアは、ネットワークの他の部分に従っていないと結論付け、異なるレジャーバージョンに切り替えました。 |
| `LOST_SYNC`       | ピアは検証済みのレジャーバージョンとコンセンサス処理中のレジャーバージョンの追跡でネットワークの他の部分に遅れをとりました。 |


## オーダーブックストリーム

`books`フィールドを使用して1つ以上のオーダーブックをサブスクライブすると、これらのオーダーブックに影響するすべてのトランザクションを取得します。

オーダーブックストリームメッセージの例:

```
{
   "engine_result": "tesSUCCESS",
   "engine_result_code": 0,
   "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
   "ledger_hash": "08547DD866F099CCB3666F113116B7AA2DF520FA2E3011DD1FF9C9C04A6C7C3E",
   "ledger_index": 18852105,
   "meta": {
       "AffectedNodes": [{
           "ModifiedNode": {
               "FinalFields": {
                   "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                   "AccountTxnID": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
                   "Balance": "3070332374272",
                   "Flags": 0,
                   "OwnerCount": 23,
                   "RegularKey": "r9S56zu6QeJD5d8A7QMfLAeYavgB9dhaX4",
                   "Sequence": 12142921
               },
               "LedgerEntryType": "AccountRoot",
               "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
               "PreviousFields": {
                   "AccountTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
                   "Balance": "3070332385272",
                   "Sequence": 12142920
               },
               "PreviousTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
               "PreviousTxnLgrSeq": 18852102
           }
       }, {
           "ModifiedNode": {
               "FinalFields": {
                   "Flags": 0,
                   "IndexPrevious": "00000000000022D2",
                   "Owner": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                   "RootIndex": "F435FBBEC9654204D7151A01E686BAA8CB325A472D7B61C7916EA58B59355767"
               },
               "LedgerEntryType": "DirectoryNode",
               "LedgerIndex": "29A543B6681AD7FC8AFBD1386DAE7385F02F9B8C4756A467DF6834AB54BBC9DB"
           }
       }, {
           "ModifiedNode": {
               "FinalFields": {
                   "ExchangeRate": "4C1BA999A513EF78",
                   "Flags": 0,
                   "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                   "TakerGetsCurrency": "0000000000000000000000000000000000000000",
                   "TakerGetsIssuer": "0000000000000000000000000000000000000000",
                   "TakerPaysCurrency": "0000000000000000000000005553440000000000",
                   "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230"
               },
               "LedgerEntryType": "DirectoryNode",
               "LedgerIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78"
           }
       }, {
           "CreatedNode": {
               "LedgerEntryType": "Offer",
               "LedgerIndex": "92E235EE80D2B28A89BEE2C905D4545C2A004FD5D4097679C8A3FB25507FD9EB",
               "NewFields": {
                   "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                   "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                   "Expiration": 508543674,
                   "OwnerNode": "00000000000022F4",
                   "Sequence": 12142920,
                   "TakerGets": "6537121438",
                   "TakerPays": {
                       "currency": "USD",
                       "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                       "value": "50.9"
                   }
               }
           }
       }, {
           "DeletedNode": {
               "FinalFields": {
                   "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                   "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                   "BookNode": "0000000000000000",
                   "Expiration": 508543133,
                   "Flags": 0,
                   "OwnerNode": "00000000000022F4",
                   "PreviousTxnID": "58B3279C2D56AAC3D9B06106E637C01E3D911E9D31E2FE4EA0D886AC9F4DEE1E",
                   "PreviousTxnLgrSeq": 18851945,
                   "Sequence": 12142889,
                   "TakerGets": "6537121438",
                   "TakerPays": {
                       "currency": "USD",
                       "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                       "value": "50.9"
                   }
               },
               "LedgerEntryType": "Offer",
               "LedgerIndex": "D3436CE21925E1CB12C5C444963B47D7EA0CD9A0E387926DC76B23FE5CD1C15F"
           }
       }],
       "TransactionIndex": 26,
       "TransactionResult": "tesSUCCESS"
   },
   "status": "closed",
   "transaction": {
       "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
       "Expiration": 508543674,
       "Fee": "11000",
       "Flags": 2147483648,
       "LastLedgerSequence": 18852106,
       "OfferSequence": 12142889,
       "Sequence": 12142920,
       "SigningPubKey": "034841BF24BD72C7CC371EBD87CCBF258D8ADB05C18DE207130364A97D8A3EA524",
       "TakerGets": "6537121438",
       "TakerPays": {
           "currency": "USD",
           "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
           "value": "50.9"
       },
       "TransactionType": "OfferCreate",
       "TxnSignature": "3045022100B9AD678A773FB61F8F9B565713C80CBF187A2F9EB8E9CE0DAC7B839CA6F4B04C02200613D173A0636CD9BE13F2E3EBD13A16932B5B7D8A96BB5F6D561CA5CDBC4AD3",
       "date": 508543090,
       "hash": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
       "owner_funds": "3070197374272"
   },
   "type": "transaction",
   "validated": true
}
```

オーダーブックストリームメッセージの形式は、[トランザクションストリームメッセージ](#トランザクションストリーム)と同様ですが、`OfferCreate`トランザクションに以下のフィールドも含まれている点が異なります。

| `Field`                   | 値  | 説明                             |
|:--------------------------|:-------|:----------------------------------------|
| `transaction.owner_funds` | 文字列 | このOfferCreateトランザクションを送信する`Account`が、このトランザクション実行後に有する`TakerGets`通貨の金額。この通貨額が[凍結](freezes.html)されているかどうかはチェックされません。 |


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
