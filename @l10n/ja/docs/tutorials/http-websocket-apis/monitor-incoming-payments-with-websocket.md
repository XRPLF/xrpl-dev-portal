---
html: monitor-incoming-payments-with-websocket.html
parent: http-websocket-apis-tutorials.html
seo:
    description: WebSocket APIを使用して、新しいXRPペイメントなどを積極的に監視します。
filters:
  - interactive_steps
labels:
  - 支払い
---
# WebSocketを使用した着信ペイメントの監視

このチュートリアルでは、[WebSocket `rippled` API](../../references/http-websocket-apis/index.md)を使用して、着信[ペイメント](../../concepts/payment-types/index.md)を監視する方法を説明します。すべてのXRP Ledgerトランザクションは公開されているため、誰もが任意のアドレスへの着信ペイメントを監視できます。

WebSocketは、クライアントとサーバが1つの接続を確立し、その接続を経由して両方向にメッセージを送信するモデルに従います。この接続は、明示的に閉じる（または接続に障害が発生する）まで続きます。これは、リクエストごとにクライアントが新しい接続を開いて閉じるHTTPベースのAPIモデル（JSON-RPCやRESTful APIなど）とは対照的です[¹](#footnote-1)<a id="from-footnote-1"></a>。

**ヒント:** このページの例はJavaScriptを使用しているため、Webブラウザーでネイティブに実行できます。JavaScriptで開発している場合は、[JavaScript向けxrpl.jsライブラリ](https://js.xrpl.org/)も利用すると、一部の作業を簡素化できます。このチュートリアルでは、xrpl.jsを使用できないその他のプログラミング言語にステップを適合できるよう、xrpl.jsを使用 _しない_ でトランザクションを監視する方法を説明します。

## 前提条件

- このページの例では、すべての主要な最新ブラウザーで使用できるJavaScriptおよびWebSocketプロトコルを使用しています。JavaScriptにある程度習熟し、WebSocketクライアントを使用する他のプログラミング言語の専門知識があれば、選択する言語に手順を適合させながら進めていくことができます。
- 安定したインターネット接続と`rippled`サーバへアクセスが必要です。埋め込まれている例では、Rippleの公開サーバのプールに接続します。[独自の`rippled`サーバを運用](../../infrastructure/installation/index.md)する場合は、ローカルでそのサーバに接続することもできます。
- 丸め方によるエラーを発生させることなくXRPの価値を適切に処理するには、64ビット符号なし整数で計算できる数値タイプを使用できる必要があります。このチュートリアルの例では、[big.js](https://github.com/MikeMcl/big.js/)を使用しています。[トークン](../../concepts/tokens/index.md)を使用する場合は、さらに高い精度が求められます。詳細は、[通貨の精度](../../references/protocol/data-types/currency-formats.md#xrpの精度)をご覧ください。

<!-- Helper for interactive tutorial breadcrumbs -->
<script type="application/javascript" src="/vendor/big.min.js"></script>
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript">
// Helper stuff for this interactive tutorial specifically

function writeToConsole(console_selector, message) {
  let write_msg = "<div class='console-entry'>" + message + "</div>"
  $(console_selector).find(".placeholder").remove()
  $(console_selector).append(write_msg)
  // TODO: JSON pretty-printing, maybe w/ multiple input args?
}

</script>

## 1. XRP Ledgerへの接続

着信ペイメントを監視する最初のステップとして、XRP Ledger、つまり`rippled`サーバに接続します。

以下のJavaScriptコードでは、Rippleの公開サーバのクラスターの1つに接続します。その後、コンソールにメッセージを記録し、[pingメソッド][]を使用してリクエストを送信します。次に、サーバ側からのメッセージを受信するときに、ハンドラーを設定してコンソールに再度メッセージを記録します。

```js
const socket = new WebSocket('wss://s.altnet.rippletest.net:51233')
socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  console.log("Connected!")
  const command = {
    "id": "on_open_ping_1",
    "command": "ping"
  }
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  console.log('Got message from server:', event.data)
})
socket.addEventListener('close', (event) => {
  // Use this event to detect when you have become disconnected
  // and respond appropriately.
  console.log('Disconnected...')
})
```

上記の例では、[Test Net](/resources/dev-tools/xrp-faucets)上にあるRippleの公開APIサーバの1つに対して、安全な接続（`wss://`）を開きます。代わりにデフォルトの構成を使用してローカルで運用している`rippled`サーバに接続するには、最初の行に以下を使用して、ローカルのポート**6006**で _安全ではない_ 接続（`ws://`）を開きます。

```js
const socket = new WebSocket('ws://localhost:6006')
```

**ヒント:** デフォルトでは、ローカル`rippled`サーバに接続することで、インターネット上の公開サーバに接続する際に使用できる[パブリックメソッド](../../references/http-websocket-apis/public-api-methods/index.md)以外に、すべての[管理メソッド](../../references/http-websocket-apis/admin-api-methods/index.md)と、[server_info][server_infoメソッド]などの一部のレスポンスに含まれる管理者専用データを利用できます。

例:

{% interactive-block label="Connect" steps=$frontmatter.steps %}

<button id="connect-socket-button" class="btn btn-primary">Connect</button>
<strong>Connection status:</strong>
<span id="connection-status">Not connected</span>
<h5>Console:</h5>
<div class="ws-console" id="monitor-console-connect"><span class="placeholder">(Log is empty)</span></div>

{% /interactive-block %}

<script type="application/javascript">
let socket;
$("#connect-socket-button").click((event) => {
  socket = new WebSocket('wss://s.altnet.rippletest.net:51233')
  socket.addEventListener('open', (event) => {
    // This callback runs when the connection is open
    writeToConsole("#monitor-console-connect", "Connected!")
    $("#connection-status").text("Connected")
    const command = {
      "id": "on_open_ping_1",
      "command": "ping"
    }
    socket.send(JSON.stringify(command))

    complete_step("Connect")
    $("#connect-button").prop("disabled", "disabled")
    $("#enable_dispatcher").prop("disabled",false)
  })
  socket.addEventListener('close', (event) => {
    $("#connection-status").text("Disconnected")
    $("#connect-button").prop("disabled", false)
  })
  socket.addEventListener('message', (event) => {
    writeToConsole("#monitor-console-connect", "Got message from server: " +
          JSON.stringify(event.data))
  })
})
</script>


## 2. ハンドラーへの着信メッセージのディスパッチ

WebSocket接続では、複数のメッセージをどちらの方向にも送信することが可能で、リクエストとレスポンスの間に厳密な1:1の相互関係がないため、各着信メッセージに対応する処理を識別する必要があります。この処理をコーディングする際の優れたモデルとして、「ディスパッチャー」関数の設定が挙げられます。この関数は着信メッセージを読み取り、各メッセージを正しいコードのパスに中継して処理します。メッセージを適切にディスパッチできるように、`rippled`サーバでは、すべてのWebSocketメッセージで`type`フィールドを使用できます。

- クライアント側からのリクエストへの直接のレスポンスとなるメッセージの場合、`type`は文字列の`response`です。この場合、サーバは以下も提供します。

  - このレスポンスに対するリクエストで指定された`id`に一致する`id`フィールド（レスポンスが順序どおりに到着しない可能性があるため、これは重要です）。

  - APIがリクエストの処理に成功したかどうかを示す`status`フィールド。文字列値`success`は、[成功したレスポンス](../../references/http-websocket-apis/api-conventions/response-formatting.md)を示します。文字列値`error`は、[エラー](../../references/http-websocket-apis/api-conventions/error-formatting.md)を示します。

    **警告:** トランザクションを送信する際、WebSocketメッセージの先頭にある`success`の`status`は、必ずしもトランザクション自体が成功したことを意味しません。これは、サーバによってリクエストが理解されたということのみを示します。トランザクションの実際の結果を確認するには、[トランザクションの結果の確認](../../concepts/transactions/finality-of-results/look-up-transaction-results.md)をご覧ください。

- [サブスクリプション](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md)からのフォローアップメッセージの場合、`type`は、新しいトランザクション、レジャーまたは検証の通知など、フォローアップメッセージのタイプを示します。または継続している[pathfindingリクエスト](../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/path_find.md)のフォローアップを示します。クライアントがこれらのメッセージを受信するのは、それらをサブスクライブしている場合のみです。

**ヒント:** [JavaScript向けxrpl.js](https://js.xrpl.org/)は、デフォルトでこのステップに対応しています。すべての非同期APIリクエストはPromiseを使用してレスポンスを提供します。また[`.on(event, callback)`メソッド](https://js.xrpl.org/classes/Client.html#on)を使用して、ストリームをリッスンできます。

以下のJavaScriptコードでは、APIリクエストを便利な非同期[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)に変換するヘルパー関数を定義し、他のタイプのメッセージをグローバルハンドラーにマップするインターフェイスを設定します。

```js
const AWAITING = {}
const handleResponse = function(data) {
  if (!data.hasOwnProperty("id")) {
    console.error("Got response event without ID:", data)
    return
  }
  if (AWAITING.hasOwnProperty(data.id)) {
    AWAITING[data.id].resolve(data)
  } else {
    console.error("Response to un-awaited request w/ ID " + data.id)
  }
}

let autoid_n = 0
function api_request(options) {
  if (!options.hasOwnProperty("id")) {
    options.id = "autoid_" + (autoid_n++)
  }

  let resolveHolder;
  AWAITING[options.id] = new Promise((resolve, reject) => {
    // Save the resolve func to be called by the handleResponse function later
    resolveHolder = resolve
    try {
      // Use the socket opened in the previous example...
      socket.send(JSON.stringify(options))
    } catch(error) {
      reject(error)
    }
  })
  AWAITING[options.id].resolve = resolveHolder;
  return AWAITING[options.id]
}

const WS_HANDLERS = {
  "response": handleResponse
  // Fill this out with your handlers in the following format:
  // "type": function(event) { /* handle event of this type */ }
}
socket.addEventListener('message', (event) => {
  const parsed_data = JSON.parse(event.data)
  if (WS_HANDLERS.hasOwnProperty(parsed_data.type)) {
    // Call the mapped handler
    WS_HANDLERS[parsed_data.type](parsed_data)
  } else {
    console.log("Unhandled message from server", event)
  }
})

// Demonstrate api_request functionality
async function pingpong() {
  console.log("Ping...")
  const response = await api_request({command: "ping"})
  console.log("Pong!", response)
}
pingpong()
```

{% interactive-block label="Dispatch Messages" steps=$frontmatter.steps %}

<button id="enable_dispatcher" class="btn btn-primary" disabled="disabled">Enable Dispatcher</button>
<button id="dispatch_ping" class="btn btn-primary" disabled="disabled">Ping!</button>
<h5>Responses</h5>
<div class="ws-console" id="monitor-console-ping"><span class="placeholder">(Log is empty)</span></div>

{% /interactive-block %}

<script type="application/javascript">
const AWAITING = {}
const handleResponse = function(data) {
  if (!data.hasOwnProperty("id")) {
    writeToConsole("#monitor-console-ping", "Got response event without ID:", data)
    return
  }
  if (AWAITING.hasOwnProperty(data.id)) {
    AWAITING[data.id].resolve(data)
  } else {
    writeToConsole("#monitor-console-ping", "Response to un-awaited request w/ ID " + data.id)
  }
}

let autoid_n = 0
function api_request(options) {
  if (!options.hasOwnProperty("id")) {
    options.id = "autoid_" + (autoid_n++)
  }
  let resolveFunc;
  AWAITING[options.id] = new Promise((resolve, reject) => {
    // Save the resolve func to be called by the handleResponse function later
    resolveFunc = resolve
    try {
      // Use the socket opened in the previous example...
      socket.send(JSON.stringify(options))
    } catch(error) {
      reject(error)
    }
  })
  AWAITING[options.id].resolve = resolveFunc
  return AWAITING[options.id]
}

const WS_HANDLERS = {
  "response": handleResponse
}
$("#enable_dispatcher").click((clickEvent) => {
  socket.addEventListener('message', (event) => {
    const parsed_data = JSON.parse(event.data)
    if (WS_HANDLERS.hasOwnProperty(parsed_data.type)) {
      // Call the mapped handler
      WS_HANDLERS[parsed_data.type](parsed_data)
    } else {
      writeToConsole("#monitor-console-ping", "Unhandled message from server: " + event)
    }
  })
  complete_step("Dispatch Messages")
  $("#dispatch_ping").prop("disabled", false)
  $("#tx_subscribe").prop("disabled", false)
})

async function pingpong() {
  const response = await api_request({command: "ping"})
  writeToConsole("#monitor-console-ping", "Pong! " + JSON.stringify(response))
}

$("#dispatch_ping").click((event) => {
  pingpong()
})
</script>

## 3. アカウントのサブスクライブ

トランザクションがアカウントに影響を及ぼすたびに即座に通知を取得するには、[subscribeメソッド][]を使用してアカウントをサブスクライブします。実際には、このアカウントはあなた自身のアカウントでなくてもかまいません。すべてのトランザクションは公開されているため、任意のアカウントで、または複数のアカウントでもサブスクライブできます。

1つ以上のアカウントをサブスクライブした場合、指定したアカウントのいずれかに何らかの影響を及ぼす各検証済みトランザクションについて、`"type": "transaction"`が含まれるメッセージがサーバから送信されます。これを確認するには、トランザクションメッセージで`"validated": true`を探します。

以下のコードサンプルは、Test Net Faucetの送信側アドレスをサブスクライブします。このコードサンプルでは、前のステップのディスパッチャーにハンドラーを追加することで、該当する各トランザクションのメッセージを記録します。

```js
async function do_subscribe() {
  const sub_response = await api_request({
    command:"subscribe",
    accounts: ["rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"]
  })
  if (sub_response.status === "success") {
    console.log("Successfully subscribed!")
  } else {
    console.error("Error subscribing: ", sub_response)
  }
}
do_subscribe()

const log_tx = function(tx) {
  console.log(tx.transaction.TransactionType + " transaction sent by " +
              tx.transaction.Account +
              "\n  Result: " + tx.meta.TransactionResult +
              " in ledger " + tx.ledger_index +
              "\n  Validated? " + tx.validated)
}
WS_HANDLERS["transaction"] = log_tx
```

以下の例では、別のウィンドウまたは別のデバイスで[Transaction Sender](/resources/dev-tools/tx-sender)を開くことと、サブスクライブしているアドレスへのトランザクションの送信を試みます。

{% interactive-block label="Subscribe" steps=$frontmatter.steps %}

<label for="subscribe_address">Test Net Address:</label>
<input type="text" class="form-control" id="subscribe_address" value="rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM">
<button id="tx_subscribe" class="btn btn-primary" disabled="disabled">Subscribe</button>
<h5>Transactions</h5>
<div class="ws-console" id="monitor-console-subscribe"><span class="placeholder">(Log is empty)</span></div>

{% /interactive-block %}

<script type="application/javascript">
async function do_subscribe() {
  const sub_address = $("#subscribe_address").val()
  const sub_response = await api_request({
    command:"subscribe",
    accounts: [sub_address]
  })
  if (sub_response.status === "success") {
    writeToConsole("#monitor-console-subscribe", "Successfully subscribed!")
  } else {
    writeToConsole("#monitor-console-subscribe",
                   "Error subscribing: " + JSON.stringify(sub_response))
  }
}
$("#tx_subscribe").click((event) => {
  do_subscribe()
  complete_step("Subscribe")
  $("#tx_read").prop("disabled", false)
})

const log_tx = function(tx) {
  writeToConsole("#monitor-console-subscribe",
                  tx.transaction.TransactionType + " transaction sent by " +
                  tx.transaction.Account +
                  "<br/>&nbsp;&nbsp;Result: " + tx.meta.TransactionResult +
                  " in ledger " + tx.ledger_index +
                  "<br/>&nbsp;&nbsp;Validated? " + tx.validated)
}
WS_HANDLERS["transaction"] = log_tx
</script>

## 4. 着信ペイメントの読み取り

アカウントをサブスクライブすると、 _アカウントへのすべてのトランザクションとアカウントからのすべてのトランザクション_ 、および _アカウントに間接的に影響を及ぼすトランザクション_ に関するメッセージが表示されます。この例として、[トークン](../../concepts/tokens/index.md)の取引があります。アカウントが着信ペイメントを受け取った日時を認識することを目的とする場合、トランザクションストリームを絞り込んで、実際に支払われた額に基づいて支払いを処理する必要があります。以下の情報を探します。

- **`validated`フィールド**は、トランザクションの結果が[最終的である](../../concepts/transactions/finality-of-results/index.md)ことを示します。これは、`accounts`をサブスクライブする場合に常に当てはまりますが、`accounts_proposed`または`transactions_proposed`ストリーム _も_ サブスクライブしている場合は、サーバは未確認のトランザクションに関して同様のメッセージを同じ接続で送信します。予防策として、`validated`フィールドを常に確認することをお勧めします。

- **`meta.TransactionResult`フィールド**は、[トランザクションの結果](../../references/protocol/transactions/transaction-results/index.md)です。結果が`tesSUCCESS`でない場合は、トランザクションは失敗したため、値を送信できません。

- **`transaction.Account`** フィールドはトランザクションの送信元です。他の人が送信したトランザクションのみを探している場合は、このフィールドがあなたのアドレスと一致するトランザクションを無視できます（自身に対するクロスカレンシー支払いが _可能である_ 点に注意してください）。

- **`transaction.TransactionType`フィールド**はトランザクションのタイプです。アカウントに通貨を送金できる可能性があるトランザクションのタイプは以下のとおりです。

  - **[Paymentトランザクション][]** はXRPまたは[トークン](../../concepts/tokens/index.md)を送金できます。受取人のアドレスを含んでいる`transaction.Destination`フィールドによってこれらを絞り込み、必ず`meta.delivered_amount`を使用して実際に支払われた額を確認します。XRPの額は、[文字列のフォーマットで記述されます](../../references/protocol/data-types/basic-data-types.md#通貨額の指定)。

    **警告:** 代わりに`transaction.Amount`フィールドを使用すると、[Partial Paymentの悪用](../../concepts/payment-types/partial-payments.md#partial-paymentの悪用)に対して脆弱になる可能性があります。不正使用者はこの悪用を行ってあなたをだまし、あなたが支払ったよりも多くの金額を交換または引き出すことができます。

  - **[CheckCashトランザクション][]**では、アカウントは別のアカウントの[CheckCreateトランザクション][]によって承認された金額を受け取ることができます。**CheckCashトランザクション**のメタデータを確認すると、アカウントが受け取った通貨の額を確認できます。

  - **[EscrowFinishトランザクション][]** は、以前の[EscrowCreateトランザクション][]によって作成された[Escrow](../../concepts/payment-types/escrow.md)を終了することでXRPを送金できます。**EscrowFinishトランザクション**のメタデータを確認すると、escrowからXRPを受け取ったアカウントと、その額を確認できます。

  - **[OfferCreateトランザクション][]** はアカウントがXRP Ledgerの[分散型取引所](../../concepts/tokens/decentralized-exchange/index.md)で以前発行したオファーを消費することで、XRPまたはトークンを送金できます。オファーを発行しないと、この方法で金額を受け取ることはできません。メタデータを確認して、アカウントが受け取った通貨（この情報がある場合）と、金額を確認します。

  - **[PaymentChannelClaimトランザクション][]** では、[Payment Channel](../../concepts/payment-types/payment-channels.md)からXRPを送金できます。メタデータを確認して、トランザクションからXRPを受け取ったアカウント（この情報がある場合）を確認します。

  - **[PaymentChannelFundトランザクション][]** は、閉鎖された（期限切れの）Payment Channelから送金元にXRPを返金することができます。

- **`meta`フィールド**には、1つまたは複数の通貨の種類とその正確な金額、その送金先などを示す[トランザクションメタデータ](../../references/protocol/transactions/metadata.md)が示されています。トランザクションメタデータを理解する方法の詳細は、[トランザクションの結果の確認](../../concepts/transactions/finality-of-results/look-up-transaction-results.md)をご覧ください。

以下のサンプルコードは、上に示したすべてのトランザクションのタイプのトランザクションメタデータを確認し、アカウントが受け取ったXRPの金額をレポートします。

{% code-snippet file="/_code-samples/monitor-payments-websocket/js/read-amount-received.js" language="js" /%}

{% interactive-block label="Read Payments" steps=$frontmatter.steps %}

<button id="tx_read" class="btn btn-primary" disabled="disabled">Start Reading</button>
<h5>Transactions</h5>
<div class="ws-console" id="monitor-console-read"><span class="placeholder">(Log is empty)</span></div>

{% /interactive-block %}

<script type="application/javascript">
function CountXRPDifference(affected_nodes, address) {
  // Helper to find an account in an AffectedNodes array and see how much
  // its balance changed, if at all. Fortunately, each account appears at most
  // once in the AffectedNodes array, so we can return as soon as we find it.

  // Note: this reports the net balance change. If the address is the sender,
  // any XRP balance changes combined with the transaction cost.

  for (let i=0; i<affected_nodes.length; i++) {
    if ((affected_nodes[i].hasOwnProperty("ModifiedNode"))) {
      // modifies an existing ledger entry
      let ledger_entry = affected_nodes[i].ModifiedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.FinalFields.Account === address) {
        if (!ledger_entry.PreviousFields.hasOwnProperty("Balance")) {
          writeToConsole("#monitor-console-read", "XRP balance did not change.")
        }
        // Balance is in PreviousFields, so it changed. Time for
        // high-precision math!
        const old_balance = new Big(ledger_entry.PreviousFields.Balance)
        const new_balance = new Big(ledger_entry.FinalFields.Balance)
        const diff_in_drops = new_balance.minus(old_balance)
        const xrp_amount = diff_in_drops.div(1e6)
        if (xrp_amount.gte(0)) {
          writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString()+" XRP.")
          return
        } else {
          writeToConsole("#monitor-console-read", "Spent " + xrp_amount.abs().toString() + " XRP.")
          return
        }
      }
    } else if ((affected_nodes[i].hasOwnProperty("CreatedNode"))) {
      // created a ledger entry. maybe the account got funded?
      let ledger_entry = affected_nodes[i].CreatedNode
      if (ledger_entry.LedgerEntryType === "AccountRoot" &&
          ledger_entry.NewFields.Account === address) {
        const balance_drops = new Big(ledger_entry.NewFields.Balance)
        const xrp_amount = balance_drops.div(1e6)
        writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString() + " XRP (account funded).")
        return
      }
    } // accounts cannot be deleted at this time, so we ignore DeletedNode
  }

  writeToConsole("#monitor-console-read", "Did not find address in affected nodes.")
  return
}

function CountXRPReceived(tx, address) {
  if (tx.meta.TransactionResult !== "tesSUCCESS") {
    writeToConsole("#monitor-console-read", "Transaction failed.")
    return
  }
  if (tx.transaction.TransactionType === "Payment") {
    if (tx.transaction.Destination !== address) {
      writeToConsole("#monitor-console-read", "Not the destination of this payment. (We're " +
                      address + "; they're " + tx.transaction.Destination + ")")
      return
    }
    if (typeof tx.meta.delivered_amount === "string") {
      const amount_in_drops = new Big(tx.meta.delivered_amount)
      const xrp_amount = amount_in_drops.div(1e6)
      writeToConsole("#monitor-console-read", "Received " + xrp_amount.toString() + " XRP.")
      return
    } else {
      writeToConsole("#monitor-console-read", "Received non-XRP currency.")
      return
    }
  } else if (["PaymentChannelClaim", "PaymentChannelFund", "OfferCreate",
          "CheckCash", "EscrowFinish"].includes(
          tx.transaction.TransactionType)) {
    CountXRPDifference(tx.meta.AffectedNodes, address)
  } else {
    writeToConsole("#monitor-console-read", "Not a currency-delivering transaction type (" +
                tx.transaction.TransactionType + ").")
  }
}

$("#tx_read").click((event) => {
  // Wrap the existing "transaction" handler to do the old thing and also
  // do the CountXRPReceived thing
  const sub_address = $("#subscribe_address").val()
  const old_handler = WS_HANDLERS["transaction"]
  const new_handler = function(data) {
    old_handler(data)
    CountXRPReceived(data, sub_address)
  }
  WS_HANDLERS["transaction"] = new_handler
  // Disable the button so you can't stack up multiple levels of the new handler
  $("#tx_read").prop("disabled", "disabled")
  complete_step("Read Payments")
})
</script>

## 次のステップ

- [トランザクションの結果の確認](../../concepts/transactions/finality-of-results/look-up-transaction-results.md)で、トランザクションの実行内容を確認し、適切に対応するソフトウェアを構築します。
- あなた自身のアドレスから[XRPの送金](../how-tos/send-xrp.md)を試します。
- [Escrow](../../concepts/payment-types/escrow.md)、[Checks](../../concepts/payment-types/checks.md)または[Payment Channel](../../concepts/payment-types/payment-channels.md)のような高度なタイプのトランザクションの監視と着信通知へのレスポンスを試します。
<!--{# TODO: uncomment when it's ready. - To more robustly handle internet instability, [Follow a Transaction Chain](follow-a-transaction-chain.html) to detect if you missed a notification. #}-->

## その他のプログラミング言語

多くのプログラミング言語には、WebSocket接続を使用して、データの送受信を行うためのライブラリが用意されています。JavaScript以外の言語で`rippled`のWebSocket APIとの通信を効率良く始めるには、同様な機能を利用している以下の例を参考にしてください。

{% tabs %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/monitor-payments-websocket/go/monitor-incoming-payments.go" language="go" /%}
{% /tab %}

{% /tabs %}

**ヒント:** 目的のプログラミング言語の例がない場合があります。このページの最上部にある「GitHubで編集する」リンクをクリックして、作成したサンプルコードを提供してください。

## 脚注

[1.](#from-footnote-1)<a id="footnote-1"></a>実際には、HTTPベースのAPIを何度も呼び出す場合、クライアントとサーバは複数のリクエストとレスポンスを処理する際に同じ接続を再利用できます。この方法は、[HTTP永続接続、またはキープアライブ](https://en.wikipedia.org/wiki/HTTP_persistent_connection)と呼ばれます。開発の観点から見ると、基本となる接続が新しい場合でも、再利用される場合でも、HTTPベースのAPIを使用するコードは同じです。

## 関連項目

- **コンセプト:**
  - [トランザクション](../../concepts/transactions/index.md)
  - [結果のファイナリティー](../../concepts/transactions/finality-of-results/index.md) - トランザクションの成功また失敗が最終的なものとなるタイミングを判断する方法（簡単な説明: トランザクションが検証済みレジャーにある場合は、その結果とメタデータは最終的なものです）。
- **チュートリアル:**
  - [信頼できるトランザクションの送信](../../concepts/transactions/reliable-transaction-submission.md)
  - [トランザクションの結果の確認](../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
- **リファレンス:**
  - [トランザクションのタイプ](../../references/protocol/transactions/types/index.md)
  - [トランザクションのメタデータ](../../references/protocol/transactions/metadata.md) - メタデータフォーマットとメタデータに表示されるフィールドの概要
  - [トランザクションの結果](../../references/protocol/transactions/transaction-results/index.md) - トランザクションのすべての結果コードを掲載した表一覧

{% raw-partial file="/docs/_snippets/common-links.md" /%}
