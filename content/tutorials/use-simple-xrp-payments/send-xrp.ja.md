---
html: send-xrp.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Test Netを使用してXRPの送金をテストします。
cta_text: XRPを送金しよう
filters:
    - interactive_steps
---
# XRPの送金

このチュートリアルでは、RippleAPI for JavaScriptを使用してシンプルなXRP送金を行う方法について説明します。まずは、XRP Test Netを使用してプロセスを順に進めます。次に、そのプロセスと、本番で同様の処理を行う場合に発生する追加要件とを比較します。

## 前提条件

<!-- Interactive example use ripple-lib and its prerequisites -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>
<script type="application/javascript" src="{{target.ripple_lib_url}}"></script>
<!-- Helper for interactive tutorial breadcrumbs -->
<script type="application/javascript" src="assets/js/interactive-tutorial.js"></script>

- このページでは、ripple-lib（RippleAPI）ライブラリーバージョン1.8.2を使用するJavaScriptの例を紹介します。[RippleAPI入門ガイド](get-started-with-rippleapi-for-javascript.html)に、RippleAPIを使用してJavaScriptからXRP Ledgerデータにアクセスする方法の説明があります。

- XRP Ledgerでトランザクションを送信するには、まずアドレスと秘密鍵、そしていくらかのXRPが必要となります。次のインターフェイスを使用して、XRP Test NetにあるアドレスとTest Net XRPを入手できます。

{% include '_snippets/generate-step.ja.md' %}

## Test Netでの送金
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Test Netサーバーへの接続

必須の自動入力可能フィールドに入力されるようにするために、ripple-libを、アカウントの現在のステータスと共有レジャー自体を取得できるサーバーに接続する必要があります。（セキュリティを高めるために、トランザクションの署名はオフライン中に行うことを推奨します。ただしその場合は、自動入力可能フィールドに手動で入力する必要があります。）トランザクションの送信先となるネットワークに接続する必要があります。

以下のサンプルコードでは、新しいRippleAPIインスタンスを作成し、Rippleが運用している公開XRP Test Netサーバーに接続します。

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
```

このチュートリアルでは、以下のボタンをクリックすることでブラウザーから直接接続できます。

{{ start_step("Connect") }}
<button id="connect-button" class="btn btn-primary">TestNetに接続する</button>
<div>
  <strong>Connection status:</strong>
  <span id="connection-status">Not connected</span>
  <div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"></div>
</div>
{{ end_step() }}

<script type="application/javascript">
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.on('connected', () => {
  $("#connection-status").text("Connected")
  $("#connect-button").prop("disabled", true)
  $("#loader-{{n.current}}").hide()

  // Update breadcrumbs & active next step
  complete_step("Connect")
  $("#interactive-prepare button").prop("disabled", false)
  $("#interactive-prepare button").prop("title", "")
})
api.on('disconnected', (code) => {
  $("#connection-status").text( "Disconnected ("+code+")" )
  $("#connect-button").prop("disabled", false)
  $(".connection-required").prop("disabled", true)
  $(".connection-required").prop("title", "Connection to Test Net required")
})
$("#connect-button").click(() => {
  $("#connection-status").text( "Connecting..." )
  $("#loader-{{n.current}}").show()
  api.connect()
})
</script>


### {{n.next()}}. トランザクションの準備

通常は、XRP LedgerトランザクションをオブジェクトとしてJSON[トランザクションフォーマット](transaction-formats.html)で作成します。以下の例に、必要最小限の送金仕様を示します。

```json
{
  "TransactionType": "Payment",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

XRP送金に対して指定する必要がある必要最小限の指示は次のとおりです。

- これが送金であることを示すインディケーター（`"TransactionType": "Payment"`）
- 送信元アドレス（`"Account"`）
- XRPを受け取るアドレス（`"Destination"`）。このアドレスは送信元アドレスと同じものではいけません。
- 送金するXRP額（`"Amount"`）。通常、XRPの「drop数」を示す整数として指定します。1,000,000ドロップは1 XRPです。

技術上、一部の追加のフィールドは実行可能なトランザクションに含める必要があり、また、省略可能なフィールドでも、`LastLedgerSequence`などは含めることを強く推奨します。[`prepareTransaction()`メソッド](rippleapi-reference.html#preparetransaction)は、トランザクションの残りのフィールドに適切なデフォルトを自動的に入力します。上記の送金を準備する際の例を示します。

```js
// Continuing after connecting to the API
async function doPrepare() {
  const sender = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sender,
    "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
    "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
  }, {
    // Expire this transaction if it doesn't execute within ~5 minutes:
    "maxLedgerVersionOffset": 75
  })
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
  console.log("Prepared transaction instructions:", preparedTx.txJSON)
  console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
  console.log("Transaction expires after ledger:", maxLedgerVersion)
  return preparedTx.txJSON
}
txJSON = doPrepare()
```

{{ start_step("Prepare") }}
<button id="prepare-button" class="btn btn-primary connection-required"
    title="Connect to Test Net first" disabled>サンプルトランザクションを準備する</button>
  <div id="prepare-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#prepare-button").click( async function() {
    // Wipe existing results
    $("#prepare-output").html("")

    const sender = $("#use-address").text() || "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sender,
      "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
      "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
    }, {
      // Expire this transaction if it doesn't execute within ~5 minutes:
      "maxLedgerVersionOffset": 75
    })
    const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
    $("#tx-lls").text(maxLedgerVersion) //for the table in the later step

    $("#prepare-output").html(
      "<div><strong>Prepared transaction instructions:</strong> <pre><code id='prepared-tx-json'>" +
      JSON.stringify(JSON.parse(preparedTx.txJSON), null, 2) + "</code></pre></div>" +
      "<div><strong>Transaction cost:</strong> " +
      preparedTx.instructions.fee + " XRP</div>" +
      "<div><strong>Transaction expires after ledger:</strong> " +
      maxLedgerVersion + "</div>"
    )

    // Update breadcrumbs & active next step
    complete_step("Prepare")
    $("#interactive-sign button").prop("disabled", false)
    $("#interactive-sign button").prop("title", "")
  })
</script>

### {{n.next()}}. トランザクションの指示への署名

RippleAPIの[sign()メソッド](rippleapi-reference.html#sign)を使用して、トランザクションに署名します。最初の引数は、署名するJSONトランザクションの文字列バージョンです。

```js
// Continuing from the previous step...
const response = api.sign(txJSON, "s████████████████████████████")
const txID = response.id
console.log("Identifying hash:", txID)
const txBlob = response.signedTransaction
console.log("Signed blob:", txBlob)
```

署名処理の結果は、署名を含むトランザクションオブジェクトになります。通常、XRP Ledger APIは、署名済みトランザクションがトランザクションの正規の[バイナリーフォーマット](serialization.html)（「ブロブ」と呼ばれる）の16進数表現になることを想定しています。

署名APIは、トランザクションのID、つまり識別用ハッシュを返します。この識別用ハッシュは、後でトランザクションを検索する際に使用します。識別用ハッシュは、このトランザクションに固有の64文字の16進文字列です。

{{ start_step("Sign") }}
<button id="sign-button" class="btn btn-primary connection-required"
title="Complete all previous steps first" disabled>サンプルトランザクションに署名する</button>
<div id="sign-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#sign-button").click( function() {
    // Wipe previous output
    $("#sign-output").html("")

    const preparedTxJSON = $("#prepared-tx-json").text()
    const secret = $("#use-secret").text()

    if (!secret) {
      alert("Can't sign transaction without a real secret. Generate credentials first.")
      return
    }

    signResponse = api.sign(preparedTxJSON, secret)

    $("#sign-output").html(
      "<div><strong>Signed Transaction blob:</strong> <code id='signed-tx-blob' style='overflow-wrap: anywhere; word-wrap: anywhere'>" +
      signResponse.signedTransaction + "</code></div>" +
      "<div><strong>Identifying hash:</strong> <span id='signed-tx-hash'>" +
      signResponse.id + "</span></div>"
    )

    // Update all breadcrumbs & activate next step
    complete_step("Sign")
    $("#interactive-submit button").prop("disabled", false)
  })
</script>


### {{n.next()}}. 署名済みブロブの送信

[submit()メソッド](rippleapi-reference.html#submit)を使用して、トランザクションをネットワークに送信します。送信する前に、[getLedgerVersion()メソッド](rippleapi-reference.html#getledgerversion)を使用して最新の検証済みレジャーインデックスを書き留めておくことをお勧めします。この送信の結果としてトランザクションが追加される可能性のある最も古いレジャーバージョンは、送信時に最新の検証済みレジャーより1つ大きなバージョンとなります。

ただし、同じトランザクションが以前に送信されたことがある場合、そのトランザクションはすでに以前のレジャーに入っています。（2回目の送信は成功しませんが、正しいレジャーバージョンの中を確認しないと、すでに成功していたことに気付かない可能性があります。）

```js
// use txBlob from the previous example
async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion()

  const result = await api.submit(txBlob)

  console.log("Tentative result code:", result.resultCode)
  console.log("Tentative result message:", result.resultMessage)

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1
}
const earliestLedgerVersion = doSubmit(txBlob)
```

このメソッドは、ローカルでトランザクションを適用しようと試みたときの**一時的な**結果を返します。この結果は、トランザクションが検証済みレジャーに含まれた時点で変わる_可能性があります_。当初は成功していたトランザクションが最終的に失敗となったり、当初失敗していたトランザクションが最終的に成功する場合があります。しかしながら、一時的な結果はほとんどの場合は最終結果と一致するため、ここで`tesSUCCESS`が表示されたらひとまず安心しても問題ありません。😁

他の結果が表示された場合は、以下の点を確認します。

- 送信元および送信先の正しいアドレスを使用しているか。
- トランザクションの他のフィールドへの入力漏れ、ステップのスキップ、その他の入力ミスがないか。
- トランザクションの送信に必要なTest Net XRPが十分にあるか。送金できるXRPの額は、[必要準備金](reserves.html)によって制限されています。現時点では、20XRPに加えて、レジャー内に保有している各「オブジェクト」につき5XRPずつ追加となります。（Test Net Faucetを使用して新しいアドレスを生成した場合は、保有するオブジェクトはありません。）
- テストネットワークのサーバーに接続しているか。

他の可能性については、[トランザクション結果](transaction-results.html)の完全なリストを参照してください。

{{ start_step("Submit") }}
  <button id="submit-button" class="btn btn-primary connection-required"
    title="Connection to Test Net required" disabled>サンプルトランザクションを送信する</button>
    <div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"></div>
    <div id="submit-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#submit-button").click( async function() {
    $("#submit-output").html("") // Wipe previous output
    $("#loader-{{n.current}}").show()

    const txBlob = $("#signed-tx-blob").text()
    const earliestLedgerVersion = await api.getLedgerVersion()
    $("#earliest-ledger-version").text(earliestLedgerVersion)

    try {
      const result = await api.submit(txBlob)
      $("#loader-{{n.current}}").hide()
      $("#submit-output").html(
        "<div><strong>Tentative result:</strong> " +
        result.resultCode + " - " +
        result.resultMessage +
        "</div>"
      )

      // Update breadcrumbs & active next step
      complete_step("Submit")
    }
    catch(error) {
      $("#loader-{{n.current}}").hide()
      $("#submit-output").text("Error: "+error)
    }

  })
</script>

### {{n.next()}}. 検証の待機

ほとんどのトランザクションは送信後の次のレジャーバージョンに承認されます。つまり、4～7秒でトランザクションの結果が最終的なものになる可能性があります。XRP Ledgerがビジーになっているか、ネットワーク接続の品質が悪いためにトランザクションをネットワーク内で中継する処理が遅延した場合は、トランザクション確定までにもう少し時間がかかることがあります。（トランザクションの有効期限を設定する方法については、[信頼できるトランザクションの送信](reliable-transaction-submission.html)を参照してください。）

RippleAPIの`ledger`イベントタイプを使用して、新しい検証済みレジャーバージョンがあるときにコードが実行されるようにしておきます。例:

```js
api.on('ledger', ledger => {
  console.log("Ledger version", ledger.ledgerVersion, "was validated.")
  if (ledger.ledgerVersion > maxLedgerVersion) {
    console.log("If the transaction hasn't succeeded by now, it's expired")
  }
})
```

{{ start_step("Wait") }}
<table>
  <tr>
    <th>Latest Validated Ledger Version:</th>
    <td id="current-ledger-version">(Not connected)</td>
  </tr>
    <tr>
      <th>Ledger Version at Time of Submission:</th>
      <td id="earliest-ledger-version">(Not submitted)</td>
    </tr>
  <tr>
    <th>Transaction LastLedgerSequence:</th>
    <td id="tx-lls"></td>
  </tr>
</table>
{{ end_step() }}

<script type="application/javascript">
api.on('ledger', ledger => {
  $("#current-ledger-version").text(ledger.ledgerVersion)

  if ( $(".breadcrumb-item.bc-wait").hasClass("active") ) {
    // Advance to "Check" as soon as we see a ledger close
    complete_step("Wait")
    $("#get-tx-button").prop("disabled", false)
  }
})
</script>


### {{n.next()}}. トランザクションステータスの確認

トランザクションが行った内容を正確に把握するために、トランザクションが検証済みレジャーバージョンに記録されたときにトランザクションの結果を調べる必要があります。例えば、[getTransaction()メソッド](rippleapi-reference.html#gettransaction)を使用して、トランザクションのステータスを確認できます。

```js
// Continues from previous examples.
// earliestLedgerVersion was noted when the transaction was submitted.
// txID was noted when the transaction was signed.
try {
  tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})
  console.log("Transaction result:", tx.outcome.result)
  console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
} catch(error) {
  console.log("Couldn't get transaction outcome:", error)
}

```

RippleAPIの`getTransaction()`メソッドは、トランザクションが検証済みレジャーバージョンに登録された場合にのみ成功を返します。登録されなかった場合は、`await`式が例外を発生させます。

**注意:** 他のAPIは、まだ検証されていないレジャーバージョンからの暫定的な結果を返す場合があります。例えば、`rippled` APIの[txメソッド][]を使用した場合は、応答内の`"validated": true`を探して、データが検証済みレジャーバージョンからのものであることを確認してください。検証済みレジャーバージョンからのものではないトランザクション結果は、変わる可能性があります。詳細は、[結果のファイナリティー](finality-of-results.html)を参照してください。

{{ start_step("Check") }}
<button id="get-tx-button" class="btn btn-primary connection-required"
  title="Connection to Test Net required" disabled>トランザクションステータスを確認する</button>
<div id="get-tx-output"></div>
{{ end_step() }}

<script type="application/javascript">
  $("#get-tx-button").click( async function() {
    // Wipe previous output
    $("#get-tx-output").html("")

    const txID = $("#signed-tx-hash").text()
    const earliestLedgerVersion = parseInt($("#earliest-ledger-version").text(), 10)

    try {
      const tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})

      $("#get-tx-output").html(
        "<div><strong>Transaction result:</strong> " +
        tx.outcome.result + "</div>" +
        "<div><strong>Balance changes:</strong> <pre><code>" +
        JSON.stringify(tx.outcome.balanceChanges, null, 2) +
        "</pre></code></div>"
      )

      complete_step("Check")
    } catch(error) {
      $("#get-tx-output").text("Couldn't get transaction outcome:" + error)
    }

  })
</script>

## 本番環境の場合の相違点

本番XRP LedgerでXRPを送金する場合も、大部分の手順は同じです。ただし、必要なセットアップでは重要な相違点がいくつかあります。

- [実際のXRPは無料で取得できません。](#実際のxrpアカウントの取得)
- [本番XRP Ledgerネットワークと同期されているサーバーに接続する必要があります。](#本番xrp-ledgerへの接続)

### 実際のXRPアカウントの取得

このチュートリアルでは、Test Net XRPがすでに資金供給されているアドレスをボタンで取得しましたが、それが可能だったのはTest Net XRPに何の価値もないからです。実際のXRPでは、XRPを所有している他者からXRPを入手する必要があります。（たとえば、取引所で購入する方法など。）RippleAPIの[generateAddress()メソッド](rippleapi-reference.html#generateaddress)を使用して、本番またはTest Netで機能するアドレスとシークレットを生成できます。

```js
const generated = api.generateAddress()
console.log(generated.address) // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
console.log(generated.secret) // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```

**警告:** ローカルマシンで安全な方法で生成したアドレスとシークレットのみを使用してください。別のコンピューターでアドレスとシークレットを生成して、ネットワーク経由でそれらを自分に送信した場合は、ネットワーク上の他の人がその情報を見ることができる可能性があります。その情報見ることができる人は、あなたと同じようにあなたのXRPを操作できます。また、Test Netと本番で同じアドレスを使用しないことも推奨します。指定したパラメーターによっては、一方のネットワークに向けて作成したトランザクションが、もう一方のネットワークでも実行可能になるおそれがあるためです。

アドレスとシークレットを生成しても、直接XRPを入手できるわけではありません。単に乱数を選択しているだけです。また、そのアドレスでXRPを受け取って[アカウントに資金供給](accounts.html#アカウントの作成)する必要があります。XRPを取得する方法として最も一般的なのは、取引所から購入し、所有しているアドレスに入れる方法です。詳細は、Rippleの[XRP購入ガイド](https://ripple.com/xrp/buy-xrp/)を参照してください。

### 本番XRP Ledgerへの接続

`RippleAPI`オブジェクトのインスタンスを作成するときに、適切なXRP Ledgerと同期しているサーバーを指定する必要があります。多くの場合はRippleの公開サーバーを、以下のスニペットなどで使用できます。

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s1.ripple.com:51233'})
api.connect()
```

自分で[`rippled`をインストール](install-rippled.html)した場合は、デフォルトで本番ネットワークに接続されます。（代わりに、[Test Netに接続するように構成](connect-your-rippled-to-the-xrp-test-net.html)することもできます。）サーバーが同期されると（通常は起動から約15分以内）、RippleAPIをサーバーにローカルで接続することができます。そうすると、[さまざまなメリット](rippled-server-modes.html#ストックサーバーを運用する理由)があります。以下の例は、RippleAPIをデフォルト構成で運用されているサーバーに接続する方法を示しています。

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'ws://localhost:6006'})
api.connect()
```

**ヒント:** ローカル接続では、WebSocketプロトコルのTLSで暗号化されたバージョン（`wss`）ではなく、暗号化されていないバージョン（`ws`）を使用します。この方式は、通信が同じマシンの中だけで行われてマシンの外に出て行かないという点で安全で、TLS証明書が不要であるため設定が簡単です。外部ネットワークとの接続では、必ず`wss`を使用してください。

## 次のステップ

このチュートリアルを完了後は、以下を試してみてください。

- 本番システム向けに[信頼できるトランザクションの送信](reliable-transaction-submission.html)を構築する
- [RippleAPI JavaScriptリファレンス](rippleapi-reference.html)を参照して、XRP Ledgerの全機能を確認する
- [アカウント設定](manage-account-settings.html)をカスタマイズする
- [トランザクションのメタデータ](transaction-metadata.html)にトランザクションの結果の詳細がどのように記述されているかを知る
- escrowやPayment Channelなどの[複雑な支払いタイプ](complex-payment-types.html)について調べる
- [XRP Ledgerビジネス](xrp-ledger-businesses.html)のベストプラクティスを読む

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
