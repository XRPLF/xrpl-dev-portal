---
html: xrpljs2-migration-guide.html
seo:
    description: JavaScriptコードをより新しいクライアントライブラリに移行する方法を学びましょう。
parent: https://js.xrpl.org/
---
# ripple-lib 1.xからxrpl.js 2.xへの移行ガイド

**ripple-lib** (1.x)ライブラリからJavaScript / TypeScriptコードを移行し、代わりにXRP Ledger用**xrpl.js** (2.x)ライブラリーを使用するためには、以下の手順に従ってください。

**ヒント:** 必要な場合は、依然[legacy 1.x "RippleAPI"用ドキュメンテーション](https://github.com/XRPLF/xrpl.js/blob/1.x/docs/index.md)にアクセスできます。

## 差異の概略

xrpl.js v2.0では、多くのフィールドと機能に"新しい"名前があります。より正確には、xrpl.jsは現在、[HTTP / WebSocket APIs](http-websocket-apis/index.md)と同じ名前を使用しています。XRP Ledgerで実行可能な"OfferCancel"のような[トランザクションタイプ](protocol/transactions/types/index.md)をライブラリが使用する場所では、"orderCancellation"オブジェクトのようなripple-libに特有の構造はなくなりました。ripple-lib 1.xでこれらの構造をリターンする多くのAPIメソッドはなくなりました。2.0では、WebSocket APIと同じフォーマットでリクエスト、レスポンスを行います。

ripple-lib 1.xからの包括的な`RippleAPI`クラスもなくなりました。xrpl.js 2.xでは、ネットワーク運用のための`Client`クラスがあり、その他全ての運用は厳格にオフラインです。アドレスとキーのための新しい`Wallet`クラス、また、トップレベルの`xrpl`オブジェクトの下にその他のクラスとプロパティがあります。
## 定型文での比較

**ripple-lib 1.10.0:**

```js
const ripple = require('ripple-lib');

(async function() {
  const api = new ripple.RippleAPI({
    server: 'wss://xrplcluster.com'
  });

  await api.connect();

  // Your code here

  api.disconnect();
})();
```

**xrpl.js 2.0.0:**

```js
const xrpl = require("xrpl");

(async function() {
  const client = new xrpl.Client('wss://xrplcluster.com');

  await client.connect();

  // Your code here

  client.disconnect();
})();
```


## バリデーション結果

デフォルトでは、ripple-lib 1.xにおけるほとんどのメソッドは、[コンセンサスプロセス](../concepts/consensus-protocol/index.md)によって検証された最終結果をリターンするのみでした。xrpl.jsと同等の多くのメソッドは、WebSocket APIをコールするために[`Client.request()`メソッド](https://js.xrpl.org/classes/Client.html#request)を使用します。WebSocket APIにおいて、XRP Ledgerサーバのデフォルト設定では、検証済みデータだけはなく未検証のデータを含むことがあります。

[分散型取引所](../concepts/tokens/decentralized-exchange/index.md)の状態を調べる時のように、完了見込みの多数のトランザクション結果が保留中であるため、現時点のオープンレジャーを使用したい場合があります。また、完了したトランザクション結果を取り込んだ検証済みのレジャーを使用したい場合もあります。

xrpl.js 2.0が`Client.request()`を使用してAPIリクエストをする際、明確に[使用するレジャー番号を指定する](protocol/data-types/basic-data-types.md#specifying-ledgers)必要があります。例えば、最新の _検証済みレジャー_ を使用してトラストラインを調べるためには:

**ripple-lib 1.x:**

```js
const trustlines = await api.getTrustlines("rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn")
console.log(trustlines)
```

**xrpl.js 2.0:**

```js
const trustlines = await client.request({
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
})
console.log(trustlines.result)
```


## トランザクションの送信

xrpl.jsには、トランザクションの署名および送信のための、また、XRP Ledgerブロックチェーンのトランザクション最終結果の確認を待機するための特有の補助機能があります:

- トランザクション送信および[最終結果](../concepts/transactions/finality-of-results/index.md)の待機のために`submitAndWait()`を使用します。トランザクションが検証された場合、これは[txメソッド][]レスポンスにリゾルブし、そうでない場合、例外処理(exception)となります。例外処理(exception)は、トランザクションが検証されなかったことを保証しません。例えば、サーバに[より大きなギャップ](../concepts/transactions/reliable-transaction-submission.md#ledger-gaps)がある場合、トランザクションは、そのギャップの中で検証される可能性があります。
- 即時の送信およびリターンのために`submit()`を使用します。これは[submitメソッド][]レスポンスにリゾルブし、仮の(最終ではない)結果を表示します。もしXRP Ledgerサーバへのトランザクション送信に問題があった場合、このメソッドは例外処理(exception)のみとなります。

どちらのメソッドに関しても、準備済みトランザクション説明と[`Wallet`インスタンス](#キーおよびウォレット)をパスすることによって、署名済みトランザクションをメソッドに直接パス、もしくは、送信直前にトランザクションに署名することができます。

```js
const tx_json = await client.autofill({
  "TransactionType": "AccountSet",
  "Account": wallet.address, // "wallet"はWalletクラスのインスタンス
  "SetFlag": xrpl.AccountSetAsfFlags.asfRequireDest
})
try {
  const submit_result = await client.submitAndWait(tx_json, wallet)
  // submitAndWait() はトランザクションの結果が確定するまでreturnしません。
  // トランザクションがネットワークに確認されなかった場合、XrplErrorが発生します。
  // ディザスタリカバリには対応しません。
  console.log("Transaction result:", submit_result)
} catch(err) {
  console.log("Error submitting transaction:", err)
}
```

もしくは、トランザクション署名のためにwalletの`sign`メソッドを、送信のために`submitAndWait(tx_blob)`を使用することができます。
停電やその他災害から復旧させる[信頼できるトランザクションの送信](../concepts/transactions/reliable-transaction-submission.md)のビルドに便利です。(ライブラリは単独でディザスタリカバリに対処しません。)

### LastLedgerSequenceのコントロール

ripple-lib 1.xでは、トランザクションを準備し、準備済みトランザクションの`LastLedgerSequence`パラメータを、その時点で最新の検証済みレジャー番号 _以降_ のレジャー番号を指定する際、`instructions.maxLedgerVersionOffset`を利用できました。2.0では、最新の検証済みレジャー番号を調べ、トランザクションのオートフィル前に`LastLedgerSequence`を明確に指定することが可能です。

**xrpl.js 2.0:**

```js
const vli = await client.getLedgerIndex()

const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": xrpl.xrpToDrops("50.2"),
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "LastLedgerSequence": vli+75 // デフォルトの1分以内ではなく5分以内
})
```

旧メソッド同様、デフォルトでは、`Client.autofill()`は合理的な`LastLedgerSequence`値を提示します。`LastLedgerSequence`フィールドが _ない_ トランザクションを準備するには、`null`値の`LastLedgerSequence`を提示します:

```js
const prepared = await client.autofill({
  "TransactionType": "Payment",
  "Account": sender,
  "Amount": xrpl.xrpToDrops("50.2"),
  "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "LastLedgerSequence": null // トランザクションは有効期限切れになりません
})
```


## キーおよびウォレット

xrpl.js 2.0は、[暗号鍵](../concepts/accounts/cryptographic-keys.md)の管理およびトランザクションの署名のために、新しい[`Wallet`クラス](https://js.xrpl.org/classes/Wallet.html)を採用します。
これは、ripple-lib 1.xにおいてシードや秘密鍵を取得していた機能に代わるもので、多様なアドレス符号化やタスク生成も処理します。

### キーの生成

**ripple-lib 1.x:**

```js
const api = new RippleAPI()
const {address, secret} = api.generateAddress({algorithm: "ed25519"})
console.log(address, secret)
// rJvMQ3cwtyrNpVJDTW4pZzLnGeovHcdE6E s████████████████████████████
```

**xrpl.js 2.0:**

```js
const wallet = xrpl.Wallet.generate("ed25519")
console.log(wallet)
// Wallet {
//   publicKey: 'ED872A4099B61B0C187C6A27258F49B421AC384FBAD23F31330E666A5F50E0ED7E',
//   privateKey: 'ED224D2BDCF6382030C7612654D2118C5CEE16344C81CB36EC7A01EC7D95C5F737',
//   classicAddress: 'rMV3CPSXAdRpW96bvvnSu4zHTZ6ETBkQkd',
//   seed: 's████████████████████████████'
// }
```

### シードおよび署名からの取得

**ripple-lib 1.x:**

```js
const api = new RippleAPI()
const seed = 's████████████████████████████';
const keypair = api.deriveKeypair(seed)
const address = api.deriveAddress(keypair.publicKey)
const tx_json = {
  "Account": address,
  "TransactionType":"Payment",
  "Destination":"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923,
  "Fee":"13",
  "Sequence":2
}
const signed = api.sign(JSON.stringify(tx_json), seed)
```

**xrpl.js 2.0:**

```js
const wallet = xrpl.Wallet.fromSeed('s████████████████████████████')
const tx_json = {
  "Account": wallet.address,
  "TransactionType":"Payment",
  "Destination":"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount":"13000000",
  "Flags":2147483648,
  "LastLedgerSequence":7835923,
  "Fee":"13",
  "Sequence":2
}
const signed = wallet.sign(tx_json)
```


## イベントおよびサブスクリプション

1.xでは、`RippleAPI`クラスの`.on()`メソッドを使用してレジャーイベントとAPIエラーにサブスクリプションできました。もしくは、`.connection.on()`を使用して特定のWebSocketメッセージタイプにサブスクリプションできました。これらは、[`Client.on()`メソッド](https://js.xrpl.org/classes/Client.html#on)に統合されました。さらに、XRP Ledgerサーバに接続する際、クライアントライブラリは、自動的にレジャークローズイベントにサブスクリプションしなくなったため、ハンドラを追加するだけでなく、レジャークローズイベントを取得するために **明確に台帳ストリームにサブスクリプションする必要があります** 。

レジャークローズイベントにサブスクリプションするには、`Client.(method)`を使用し、`"streams": ["ledger"]`で[subscribeメソッド][]をコールします。イベントハンドラを追加するには、`Client.on(event_type, callback)`を使用します。これらのコールは任意の順で実行可能です。

1.xからのRippleAPI特有の`ledger`イベントタイプは削除され、代わりに、`ledgerClosed`イベントを使用します。これらのイベントメッセージは同じデータを含んでいますが、フォーマットはWebSocket APIの[レジャーストリーム](http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#レジャーストリーム)メッセージに対応しています。

例:

**ripple-lib 1.x:**

```js
api.on("ledger", (ledger) => {
  console.log(`Ledger #${ledger.ledgerVersion} closed!
    It contains ${ledger.transactionCount} transaction(s) and has
    the ledger_hash ${ledger.ledgerHash}.`
  )
})
// "ledger"イベントはAPI接続が確立後自動的に開始します。
```

**xrpl.js 2.0:**

```js
client.on("ledgerClosed", (ledger) => {
  console.log(`Ledger #${ledger.ledger_index} closed!
    It contains ${ledger.txn_count} transaction(s) and has
    the ledger_hash ${ledger.ledger_hash}.`
  )
})
// ”ledgerClosed "イベントを取得するには、"ledger "ストリームを明示的にサブスクライブする必要があります。
client.request({
  "command": "subscribe",
  "streams": ["ledger"]
})
```


## 比較対照

ripple-lib 1.xでは、全てのメソッドとプロパティは、`RippleAPI`クラスのインスタンスでした。xrpl.js 2.xでは、ライブラリの静的メソッドと特定のクラスに属するメソッドがあります。以下のテーブルにおいて、`Client.method()`という表記方法は、`method()`が`Client`クラスのインスタンスに属することを意味します。

**注記: 以下のテーブルには、3カラムあります。縦にスクロールすると、全ての情報を確認できます。**

| RippleAPIインスタンスメソッド/プロパティ | xrpl.jsメソッド/プロパティ | 注記 |
|-------------------|----------------|---|
| `new ripple.RippleAPI({server: url})` | [`new xrpl.Client(url)`](https://js.xrpl.org/classes/Client.html#constructor) | 複数のサーバに接続するには`xrpl.BroadcastClient([url1, url2, ..])` を使用してください。 |
| `request(command, options)` | [`Client.request(options)`](https://js.xrpl.org/classes/Client.html#request) | WebSocket API との一貫性を保つために `command` フィールドを `options` オブジェクトに移動しました。1.x では、このメソッドの戻り値 (Promise がリゾルブしたとき) は `result` オブジェクトのみでした。現在は、[WebSocket レスポンスのフォーマット](http-websocket-apis/api-conventions/response-formatting.md) 全体が返されます。同様の値を得るには、戻り値の `result` フィールドを読み取ってください。 |
| `hasNextPage()` | [`xrpl.hasNextPage(response)`](https://js.xrpl.org/modules.html#hasNextPage) | こちらもご覧ください。 [`Client.requestNextPage()`](https://js.xrpl.org/classes/Client.html#requestNextPage) および [`Client.requestAll()`](https://js.xrpl.org/classes/Client.html#requestAll) |
| `requestNextPage()` | [`Client.requestNextPage()`](https://js.xrpl.org/classes/Client.html#requestNextPage) | |
| `computeBinaryTransactionHash()` | [`xrpl.hashes.hashTx()`](https://js.xrpl.org/modules.html#hashes) | |
| `classicAddressToXAddress()` | [`xrpl.classicAddressToXAddress()`](https://js.xrpl.org/modules.html#classicAddressToXAddress) | 現在は、モジュールの静的メソッドです。 |
| `xAddressToClassicAddress()` | [`xrpl.xAddressToClassicAddress()`](https://js.xrpl.org/modules.html#xAddressToClassicAddress) | 現在は、モジュールの静的メソッドです。 |
| `renameCounterpartyToIssuer(object)` | (削除済み - 注記カラムを参照) | xrpl.jsは常に`issuer`を既に使用しているので、今後は必要ありません。 |
| `formatBidsAndAsks()` | (削除済み - 注記カラムを参照) | No longer needed after changes to `getOrderbook()`. |
| `connect()` | [`Client.connect()`](https://js.xrpl.org/classes/Client.html#connect) | |
| `disconnect()` | [`Client.disconnect()`](https://js.xrpl.org/classes/Client.html#disconnect) | |
| `isConnected()` | [`Client.isConnected()`](https://js.xrpl.org/classes/Client.html#isConnected) | |
| `getServerInfo()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [server_info メソッド][] を呼び出してください。 |
| `getFee()` | (削除済み - 注記カラムを参照) | [トランザクションコスト][]を自動的に提供するには [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使ってください。または `Client.request({"command": "fee"})` を使って、現在のトランザクションコスト ( _XRPのdrops_ ) についての情報を調べることができます。 |
| `getLedgerVersion()` | [`Client.getLedgerIndex()`](https://js.xrpl.org/classes/Client.html#getLedgerIndex) | |
| `getTransaction()` | [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [tx メソッド][] を呼び出してください。**警告:** `getTransaction()` とは異なり、`tx` メソッドは [検証されていない最終結果](#バリデーション結果) を返すことがあります。トランザクションに対してアクションを起こす前に、レスポンスオブジェクトの中に `"validated": true` があるかどうかを必ず確認するようにしてください。 |
| `getTransactions()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_txメソッド][] を呼び出してください。 |
| `getTrustlines()` |  (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_lines メソッド][] を呼び出してください。**警告:** `getTrustlines()` とは異なり、`account_lines` は [検証されていない最終結果](#バリデーション結果) を返すことがあります。 |
| `getBalances()` | [`Client.getBalances()`](https://js.xrpl.org/classes/Client.html#getBalances) | |
| `getBalanceSheet()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.getBalances()`](https://js.xrpl.org/classes/Client.html#getBalances) を使うか、 [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [gateway_balancesメソッド][] を呼び出してください。 |
| `getPaths()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [ripple_path_findメソッド][] を呼び出してください。 |
| `getOrders()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_offers メソッド][] を呼び出してください。 |
| `getOrderbook()` | [`Client.getOrderbook()`](https://js.xrpl.org/classes/Client.html#getOrderbook) | |
| `getSettings()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_info メソッド][] を呼び出してください。個々のフラグ設定のブール値を取得するには、 `Flags` フィールドで `xrpl.parseAccountRootFlags()` を使用します。**警告:** `getSettings()`とは異なり、`account_info` は [検証されていない最終結果](#バリデーション結果)を返すことがあります。 |
| `getAccountInfo(address, options)` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_info メソッド][] を呼び出してください。**警告:** `getAccountInfo()` とは異なり、`account_info` は [検証されていない最終結果](#バリデーション結果) を返すことがあります。 |
| `getAccountObjects(address, options)` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [account_objects メソッド][] を呼び出してください。**警告:** `getAccountObjects()` とは異なり、`account_objects` は [検証されていない最終結果](#バリデーション結果) を返すことがあります。 |
| `getPaymentChannel()` | (削除済み - 注記カラムを参照) | 代わりに [`Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って [ledger_entry method](http-websocket-apis/public-api-methods/ledger-methods/ledger_entry.md#get-paychannel-object) を呼び出してください。**警告:** `getPaymentChannel()`とは異なり、`ledger_entry` は [検証されていない最終結果](#バリデーション結果)を返す可能性があります。|
| `getLedger()` | (削除済み - 注記カラムを参照) | `Client.request()`](https://js.xrpl.org/classes/Client.html#request) を使って、正確に [ledger メソッド][] を呼び出してください。**渓谷:** `getLedger()`とは異なり、`ledger` は [検証されていない最終的なレジャー](#バリデーション結果)を返すことがあります。 |
| `parseAccountFlags()` | [`xrpl.parseAccountRootFlags()`](https://js.xrpl.org/modules.html#parseAccountRootFlags) | 現在は、モジュールの静的メソッドです。 |
| `prepareTransaction()` | [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) | 詳しくは、[トランザクション送信](#トランザクションの送信)をご覧ください。 |
| `preparePayment()` | (削除済み - 注記カラムを参照) | [Paymentトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareTrustline()` | (削除済み - 注記カラムを参照) | [TrustSetトランザクション][]を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareOrder()` | (削除済み - 注記カラムを参照) | [OfferCreateトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareOrderCancellation()` | (削除済み - 注記カラムを参照) | [OfferCancelトランザクション][]を構築し、[`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill)を代わりに使用することができます。 |
| `prepareSettings()` | (削除済み - 注記カラムを参照) | ほとんどの設定には、代わりに [AccountSetトランザクション][]を構築します。通常キーをローテート変更するには、[SetRegularKeyトランザクション][]を作成します。マルチシグの設定を追加または更新するには、代わりに[SignerListSetトランザクション][]を構築してください。これら3つの場合とも、トランザクションを準備するために [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareEscrowCreation()` | (削除済み - 注記カラムを参照) | [EscrowCreateトランザクション][]を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareEscrowCancellation()` | (削除済み - 注記カラムを参照) | [EscrowCancelトランザクション][]を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareEscrowExecution()` | (削除済み - 注記カラムを参照) | [EscrowFinishトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `preparePaymentChannelCreate()` | (削除済み - 注記カラムを参照) | [PaymentChannelCreateトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `preparePaymentChannelClaim()` | (削除済み - 注記カラムを参照) | [PaymentChannelClaimトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `preparePaymentChannelFund()` | (削除済み - 注記カラムを参照) | [PaymentChannelFundトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareCheckCreate()` | (削除済み - 注記カラムを参照) | [CheckCreateトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareCheckCancel()` | (削除済み - 注記カラムを参照) | [CheckCancelトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareCheckCash()` | (削除済み - 注記カラムを参照) | [CheckCashトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `prepareTicketCreate()` | (削除済み - 注記カラムを参照) | [TicketCreateトランザクション][] を構築し、代わりに [`Client.autofill()`](https://js.xrpl.org/classes/Client.html#autofill) を使用します。 |
| `sign()` | [`Wallet.sign()`](https://js.xrpl.org/classes/Wallet.html#sign) | 詳しくは、[キーおよびウォレット](#キーおよびウォレット)をご覧ください。 |
| `combine()` | [`xrpl.multisign()`](https://js.xrpl.org/modules.html#multisign) | |
| `submit()` | [`Client.submit()`](https://js.xrpl.org/classes/Client.html#submit) | また、信頼性の高いトランザクション送信も可能になりました。詳細は、[トランザクション送信](#トランザクションの送信)をご覧ください。 |
| `generateXAddress()` | [`xrpl.Wallet.generate()`](https://js.xrpl.org/classes/Wallet.html#generate) | `xrpl.Wallet.generate()` で [`Wallet` インスタンス](https://js.xrpl.org/classes/Wallet.html) を作成し、ウォレットのインスタンスで `.getXAddress()` を呼び出して X-address を取得します。 詳しくは、[キーおよびウォレット](#キーおよびウォレット)をご覧ください。 |
| `generateAddress()` | [`xrpl.Wallet.generate()`](https://js.xrpl.org/classes/Wallet.html#generate) | [`Wallet`インスタンス](https://js.xrpl.org/classes/Wallet.html)を作成します。詳しくは、[キーおよびウォレット](#キーおよびウォレット)をご覧ください。 |
| `isValidAddress()` | [`xrpl.isValidAddress()`](https://js.xrpl.org/modules.html#isValidAddress) | 現在は、モジュールの静的メソッドです。 |
| `isValidSecret()` | [`xrpl.isValidSecret()`](https://js.xrpl.org/modules.html#isValidSecret) | 現在は、モジュールの静的メソッドです。 |
| `deriveKeypair()` | [`xrpl.deriveKeypair()`](https://js.xrpl.org/modules.html#deriveKeypair) | 現在は、モジュールの静的メソッドです。 |
| `deriveAddress()` | (削除済み - 注記カラムを参照) | 公開鍵からX Addressを取得するために `xrpl.decodeXAddress()` を使用し、必要であれば `xAddressToClassicAddress()` を使用してクラシックアドレスを取得します。 |
| `generateFaucetWallet()` | [`Client.fundWallet()`](https://js.xrpl.org/classes/Client.html#fundWallet) | `on_testnet`ブール変数は削除されました。ライブラリは、接続しているネットワークに適したDevnetまたはTestnetのfaucetを自動的に選択します。オプションで [`Wallet` インスタンス](https://js.xrpl.org/classes/Wallet.html) を提供すると、faucetは関連するアドレスに資金を供給/補充します。そうでなければ、メソッドは新しいWalletインスタンスを作成します。そうでなければ、このメソッドは新しいウォレットインスタンスを作成します。戻り値は現在、`{wallet: <object: Wallet instance>, balance: <str: XRP of drops>}という形のオブジェクトになります。 |
| `signPaymentChannelClaim()` | [`xrpl.signPaymentChannelClaim()`](https://js.xrpl.org/modules.html#signPaymentChannelClaim) | 現在は、モジュールの静的メソッドです。 |
| `verifyPaymentChannelClaim()` | [`xrpl.verifyPaymentChannelClaim()`](https://js.xrpl.org/modules.html#verifyPaymentChannelClaim) | 現在は、モジュールの静的メソッドです。 |
| `computeLedgerHash()` | [`xrpl.hashes.hashLedger()`](https://js.xrpl.org/modules.html#hashes) | |
| `xrpToDrops()` | [`xrpl.xrpToDrops()`](https://js.xrpl.org/modules.html#xrpToDrops) | 現在は、モジュールの静的メソッドです。 |
| `dropsToXrp()` | [`xrpl.dropsToXrp()`](https://js.xrpl.org/modules.html#dropsToXrp) | 現在は、モジュールの静的メソッドです。 |
| `iso8601ToRippleTime()` | [`xrpl.isoTimeToRippleTime()`](https://js.xrpl.org/modules.html#isoTimeToRippleTime) | 現在は、モジュールの静的メソッドです。 |
| `rippleTimeToISO8601()` | [`xrpl.rippleTimeToISOTime()`](https://js.xrpl.org/modules.html#rippleTimeToISOTime) | 現在は、モジュールの静的メソッドです。 また、新しいメソッド [`rippleTimeToUnixTime()`](https://js.xrpl.org/modules.html#rippleTimeToUnixTime) を使うと、UNIXエポック 1970-01-01 00:00:00 UTC からのミリ秒単位のUNIXスタイルのタイムスタンプを取得することができます。 |
| `txFlags.Universal.FullyCanonicalSig` | (削除済み - 注記カラムを参照) | [RequireFullyCanonicalSig amendment][]に伴い、不要となりました。 |
| `txFlags.Payment.NoRippleDirect` | `xrpl.PaymentFlags.tfNoDirectRipple` | |
| `txFlags.Payment.PartialPayment` | `xrpl.PaymentFlags.tfPartialPayment` | |
| `txFlags.Payment.LimitQuality` | `xrpl.PaymentFlags.tfLimitQuality` | |
| `txFlags.OfferCreate.Passive` | `xrpl.OfferCreateFlags.tfPassive` | |
| `txFlags.OfferCreate.ImmediateOrCancel` | `xrpl.OfferCreateFlags.tfImmediateOrCancel` | |
| `txFlags.OfferCreate.FillOrKill` | `xrpl.OfferCreateFlags.tfFillOrKill` | |
| `txFlags.OfferCreate.Sell` | `xrpl.OfferCreateFlags.tfSell` | |
| `accountSetFlags` | `xrpl.AccountSetAsfFlags` | モジュールレベルでEnumになりました。 |
| `schemaValidator` | (削除済み - 注記カラムを参照) | TypeScriptを使用して、ほとんどの型を検証することができます。 |
| `schemaValidate()` | (削除済み - 注記カラムを参照) | TypeScriptを使用して、ほとんどの型を検証することができます。 トランザクションオブジェクトの検証を行うために `xrpl.validate(transaction)` を呼び出すこともできます。 |
| `.on("ledger", callback)` | [`Client.on("ledgerClosed", callback)`](https://js.xrpl.org/classes/Client.html#on) | **注意:** ledger streamもサブスクライブする必要があります。例と詳細については、[イベントとサブスクリプション](#イベントおよびサブスクリプション)をご覧ください。 |
| `.on("error", callback)` | [`Client.on("error", callback)`](https://js.xrpl.org/classes/Client.html#on) | |
| `.on("connected", callback)` | [`Client.on("connected", callback)`](https://js.xrpl.org/classes/Client.html#on) | |
| `.on("disconnected", callback)` | [`Client.on("connected", callback)`](https://js.xrpl.org/classes/Client.html#on) | |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
