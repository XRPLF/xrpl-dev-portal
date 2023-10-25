---
html: use-tickets.html
parent: manage-account-settings.html
blurb: チケットは、通常のシーケンス順序以外でトランザクションを送信するために使用します。
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - アカウント
---
# チケットの使用

[チケット](ticket.html)は、通常の順序ではないトランザクションを送信する方法を提供します。このチュートリアルでは、チケットを作成し、それを使って別のトランザクションを送信する手順を説明します。

## 前提条件

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="static/js/tutorials/use-tickets.js"></script>
{% set use_network = "Devnet" %}<!--TODO: change to Testnet eventually. NOTE, Testnet is a few days behind Mainnet in getting the amendment one enabled -->

このページでは、[xrpl.js](https://js.xrpl.org/)ライブラリを使用したJavaScriptのサンプルを提供しています。設定方法は、[JavaScriptを使ってみよう](get-started-using-javascript.html)をご覧ください。

JavaScriptはWebブラウザ上で動作するため、セットアップなしで読み進められ、インタラクティブな手順を利用することができます。



## 手順
{% set n = cycler(* range(1,99)) %}

このチュートリアルはいくつかの段階に分かれています。

- (Steps 1-2) **準備:** XRP Ledgerのアドレスとシークレットが必要です。本番環境では、同じアドレスとシークレットを一貫して使用することができます。このチュートリアルでは、必要に応じて新しいテスト認証情報を生成することができます。また、ネットワークに接続されている必要があります。
- (Steps 3-6) **チケットの作成:** トランザクションを送信して、いくつかのチケットを確保します。
- (任意) **休憩:** チケットを作成した後、以下のステップの前、中、後にいつでも様々な他のトランザクションを送信することができます。
- (Steps 7-10) **チケットの使用:** 設定されているチケットのうち1枚を使ってトランザクションを送信します。使用するチケットが1枚でも残っていれば、前の部分を飛ばしてこの手順を繰り返すことができます。

### {{n.next()}}. クレデンシャルの入手

XRP Ledgerでトランザクションを送信するには、アドレスと秘密鍵、そしてXRPが必要です。開発用には、[{{use_network}}](parallel-networks.html)で以下のようなインターフェースを使ってこれらを入手することができます。

{% include '_snippets/interactive-tutorials/generate-step.md' %}

[本番環境のソフトウェアを作成する場合](production-readiness.html)には、既存のアカウントを使用し、[安全な署名](secure-signing.html)を使用して鍵を管理する必要があります。


### {{n.next()}}. ネットワークへの接続

トランザクションをネットワークに送信するには、ネットワークに接続している必要があります。チケットは今のところDevnetでしか利用できないので、Devnetサーバーに接続する必要があります。例えば、以下のようになります。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Connect to", end_before="// Get credentials") }}

<!-- MULTICODE_BLOCK_END -->

**注記:** このチュートリアルのコードサンプルでは、JavaScriptの[`async`/`await`パターン](https://javascript.info/async-await)を使用しています。`await`は`async`関数の中で使用する必要があるため、残りのコードサンプルはここから始まる`main()`関数の中で続けるように書かれています。なお、`async`/`await`の代わりにPromiseのメソッド`.then()`や`.catch()`を使うこともできます。

このチュートリアルでは、以下のボタンをクリックして接続します。

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. シーケンス番号の確認

チケットを作成する前に、自分のアカウントの[シーケンス番号][]を確認しておきましょう。次のステップのために現在のシーケンス番号が必要であり、設定されるチケットのシーケンス番号はこの番号から始まります。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Check Sequence", end_before="// Prepare and Sign TicketCreate") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Check Sequence") }}
<button id="check-sequence" class="btn btn-primary previous-steps-required">Check Sequence Number</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Querying...</div>
<div class="output-area"></div>
{{ end_step() }}



### {{n.next()}}. TicketCreateの準備と署名

前のステップで決定したシーケンス番号を使用して、[TicketCreate トランザクション][]を構築します。`TicketCount`フィールドを使って、作成するチケットの枚数を指定します。例えば、10枚のチケットを作成するトランザクションを準備するには、次のようにします。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Prepare and Sign TicketCreate", end_before="// Submit TicketCreate") }}

<!-- MULTICODE_BLOCK_END -->

トランザクションのハッシュと`LastLedgerSequence`の値を記録しておけば、[後で検証されたかどうかを確認](reliable-transaction-submission.html)することができます。


{{ start_step("Prepare & Sign") }}
<button id="prepare-and-sign" class="btn btn-primary previous-steps-required">Prepare & Sign</button>
<div class="output-area"></div>
{{ end_step() }}



### {{n.next()}}. TicketCreateの提出

前のステップで作成した署名付きトランザクションBlobを送信します。例えば、以下のようになります。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Submit TicketCreate", end_before="// Wait for Validation") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Submit") }}
<button id="ticketcreate-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob" data-wait-step-name="Wait">Submit</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. 検証の待機

ほとんどのトランザクションは、送信された後に次の台帳のバージョンに受け入れられます。つまり、トランザクションの結果が確定するまでに4～7秒かかることがあります。XRP Ledgerが混雑している場合や、ネットワークの接続性が悪いためにトランザクションがネットワーク全体に中継されない場合は、トランザクションが確定するまでに時間がかかることがあります。(トランザクションの有効期限を設定する方法については、[信頼できるトランザクションの送信](reliable-transaction-submission.html)を参照してください)。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Wait for Validation", end_before="// Check Available") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### (任意) 休憩

チケットの強みは、チケットを使ったトランザクションの準備をしている間も、アカウントの業務を通常通り行うことができる点にあります。チケットを使用してトランザクションを送信する場合、別のチケットを使用しているものも含め、他のトランザクションの送信と並行して行うことができ、いつでもチケット付きトランザクションを送信することができます。唯一の制約は、1つのチケットは1回しか使用できないということです。

**ヒント:** 以下のステップの間または途中で、ここに戻ってきてシーケンス取引を送信することができますが、その際、チケット取引の成功を妨げることはありません。

{{ start_step("Intermission") }}
<button id="intermission-payment" class="btn btn-primary previous-steps-required">Payment</button>
<button id="intermission-escrowcreate" class="btn btn-primary previous-steps-required">EscrowCreate</button>
<button id="intermission-accountset" class="btn btn-primary previous-steps-required">AccountSet</button>
<div class="output-area"></div>
{{ end_step() }}



### {{n.next()}}. 有効なチケットの確認

チケット付きのトランザクションを送信したい場合、どのチケットシーケンス番号を使用するかを知る必要があります。アカウントを注意深く管理していれば、どのチケットを持っているかはすでにわかっていると思いますが、よくわからない場合は、[account_objects メソッド][]を使って、利用可能なチケットを調べることができます。例えば、以下のようになります。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Check Available Tickets", end_before="// Prepare and Sign Ticketed") }}

<!-- MULTICODE_BLOCK_END -->


{{ start_step("Check Tickets") }}
<button id="check-tickets" class="btn btn-primary previous-steps-required">Check Tickets</button>
<div class="output-area"></div>
{{ end_step() }}

**ヒント:** チケットが残っている限り、ここから最後まで同じ手順を繰り返すことができます。

### {{n.next()}}. チケット付きトランザクションの準備

チケットが利用できるようになったので、それを使用するトランザクションを準備します。

ここでは、好きな[トランザクションのタイプ](transaction-types.html)を使用することができます。次の例では、何も行わない[AccountSet トランザクション][]を使用していますが、これはレジャーに他の設定を必要としないからです。`Sequence`フィールドを`0`に設定して、利用可能なチケットの1つのチケットシーケンス番号を持つ`TicketSequence`フィールドを含めます。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Prepare and Sign Ticketed", end_before="// Submit Ticketed Transaction") }}

<!-- MULTICODE_BLOCK_END -->

> **ヒント:** TicketCreateトランザクションをすぐに送信する予定がない場合は、トランザクションが期限切れにならないように、`LastLedgerSequence`を設定しないようにする必要があります。これを行う方法はライブラリによって異なります。
>
> - **xrpl.js:** トランザクションの自動入力の際に、`"LastLedgerSequence": null`を指定する。
> - **`rippled`:** 用意された指示から`LastLedgerSequence`を省略します。サーバーはデフォルトでは値を提供しません。

{{ start_step("Prepare Ticketed Tx") }}
<div id="ticket-selector">
  <h4>Select a Ticket:</h4>
  <div class="form-area"></div>
</div>
<button id="prepare-ticketed-tx" class="btn btn-primary previous-steps-required">Prepare Ticketed Transaction</button>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. チケット付きトランザクションの送信

前のステップで作成した署名付きトランザクションBlobを送信します。例えば、以下のようになります。

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/use-tickets/js/use-tickets.js", language="js", start_with="// Submit Ticketed Transaction", end_before="// Wait for Validation (again)") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Submit Ticketed Tx") }}
<button id="ticketedtx-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob_t" data-wait-step-name="Wait Again">Submit</button>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. 検証の待機

チケット付きトランザクションは、シーケンス付きトランザクションと同じようにコンセンサスプロセスを経ます。

{{ start_step("Wait Again") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}

## マルチシグで使用する

チケットの主な使用例としては、複数の[マルチシグ](multi-signing.html)を並行して集めることができます。チケットを使用することで、複数署名されたトランザクションが完全に署名されて準備が整った時点で、どれが先に準備されるかを気にすることなく送信することができます。

このシナリオでは、[step8,「チケット付きトランザクションの準備」](#8-チケット付きトランザクションの準備)が若干異なります。準備と署名を一度に行うのではなく、[任意のマルチシグトランザクションの送信](send-a-multi-signed-transaction.html)の手順に従うことになります。まずトランザクションを準備し、次に信頼できる署名者の間でトランザクションを循環させて署名を集め、最後に署名を組み合わせて最終的なマルチシグトランザクションを作成します。

複数の異なるトランザクションを処理する場合、それぞれが異なるチケットを使用する限り、この作業を並行して行うことができます。


## 関連項目

- **Concepts:**
    - [チケット](tickets.html)
    - [マルチシグ](multi-signing.html)
- **Tutorials:**
    - [マルチシグの設定](set-up-multi-signing.html)
    - [信頼出来るトランザクションの送信](reliable-transaction-submission.html)
- **References:**
    - [account_objects メソッド][]
    - [sign_for メソッド][]
    - [submit_multisigned メソッド][]
    - [TicketCreate トランザクション][]
    - [トランザクションの共通フィールド](transaction-common-fields.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
