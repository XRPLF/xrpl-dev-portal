---
html: use-tickets.html
parent: manage-account-settings.html
seo:
    description: チケットは、通常のシーケンス順序以外でトランザクションを送信するために使用します。
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - アカウント
---
# チケットの使用

[チケット](../../../references/protocol/ledger-data/ledger-entry-types/ticket.md)は、通常の順序ではないトランザクションを送信する方法を提供します。このチュートリアルでは、チケットを作成し、それを使って別のトランザクションを送信する手順を説明します。

## 前提条件

<!-- Source for this tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/how-tos/use-tickets.js"></script>

このページでは、[xrpl.js](https://js.xrpl.org/)ライブラリを使用したJavaScriptのサンプルを提供しています。設定方法は、[JavaScriptを使ってみよう](../../javascript/build-apps/get-started.md)をご覧ください。

JavaScriptはWebブラウザ上で動作するため、セットアップなしで読み進められ、インタラクティブな手順を利用することができます。



## 手順

このチュートリアルはいくつかの段階に分かれています。

- (Steps 1-2) **準備:** XRP Ledgerのアドレスとシークレットが必要です。本番環境では、同じアドレスとシークレットを一貫して使用することができます。このチュートリアルでは、必要に応じて新しいテスト認証情報を生成することができます。また、ネットワークに接続されている必要があります。
- (Steps 3-6) **チケットの作成:** トランザクションを送信して、いくつかのチケットを確保します。
- (任意) **休憩:** チケットを作成した後、以下のステップの前、中、後にいつでも様々な他のトランザクションを送信することができます。
- (Steps 7-10) **チケットの使用:** 設定されているチケットのうち1枚を使ってトランザクションを送信します。使用するチケットが1枚でも残っていれば、前の部分を飛ばしてこの手順を繰り返すことができます。

### 1. クレデンシャルの入手

XRP Ledgerでトランザクションを送信するには、アドレスと秘密鍵、そしてXRPが必要です。開発用には、[Testnet](../../../concepts/networks-and-servers/parallel-networks.md)で以下のようなインターフェースを使ってこれらを入手することができます。

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/generate-step.md" /%}

[本番環境のソフトウェアを作成する場合](/docs/tutorials)には、既存のアカウントを使用し、[安全な署名](../../../concepts/transactions/secure-signing.md)を使用して鍵を管理する必要があります。


### 2. ネットワークへの接続

トランザクションをネットワークに送信するには、ネットワークに接続している必要があります。チケットは今のところDevnetでしか利用できないので、Devnetサーバに接続する必要があります。例えば、以下のようになります。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Connect to" before="// Get credentials" language="js" /%}
{% /tab %}

{% /tabs %}

**注記:** このチュートリアルのコードサンプルでは、JavaScriptの[`async`/`await`パターン](https://javascript.info/async-await)を使用しています。`await`は`async`関数の中で使用する必要があるため、残りのコードサンプルはここから始まる`main()`関数の中で続けるように書かれています。なお、`async`/`await`の代わりにPromiseのメソッド`.then()`や`.catch()`を使うこともできます。

このチュートリアルでは、以下のボタンをクリックして接続します。

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 3. シーケンス番号の確認

チケットを作成する前に、自分のアカウントの[シーケンス番号][]を確認しておきましょう。次のステップのために現在のシーケンス番号が必要であり、設定されるチケットのシーケンス番号はこの番号から始まります。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Check Sequence" before="// Prepare and Sign TicketCreate" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Check Sequence" steps=$frontmatter.steps %}

<button id="check-sequence" class="btn btn-primary previous-steps-required">Check Sequence Number</button>

{% loading-icon message="Querying..." /%}

<div class="output-area"></div>

{% /interactive-block %}



### 4. TicketCreateの準備と署名

前のステップで決定したシーケンス番号を使用して、[TicketCreate トランザクション][]を構築します。`TicketCount`フィールドを使って、作成するチケットの枚数を指定します。例えば、10枚のチケットを作成するトランザクションを準備するには、次のようにします。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Prepare and Sign TicketCreate" before="// Submit TicketCreate" language="js" /%}
{% /tab %}

{% /tabs %}

トランザクションのハッシュと`LastLedgerSequence`の値を記録しておけば、[後で検証されたかどうかを確認](../../../concepts/transactions/reliable-transaction-submission.md)することができます。


{% interactive-block label="Prepare & Sign" steps=$frontmatter.steps %}

<button id="prepare-and-sign" class="btn btn-primary previous-steps-required">Prepare & Sign</button>
<div class="output-area"></div>

{% /interactive-block %}



### 5. TicketCreateの提出

前のステップで作成した署名付きトランザクションBlobを送信します。例えば、以下のようになります。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Submit TicketCreate" before="// Wait for Validation" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Submit" steps=$frontmatter.steps %}

<button id="ticketcreate-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob" data-wait-step-name="Wait">Submit</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 6. 検証の待機

ほとんどのトランザクションは、送信された後に次の台帳のバージョンに受け入れられます。つまり、トランザクションの結果が確定するまでに4～7秒かかることがあります。XRP Ledgerが混雑している場合や、ネットワークの接続性が悪いためにトランザクションがネットワーク全体に中継されない場合は、トランザクションが確定するまでに時間がかかることがあります。(トランザクションの有効期限を設定する方法については、[信頼できるトランザクションの送信](../../../concepts/transactions/reliable-transaction-submission.md)をご覧ください)。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Wait for Validation" before="// Check Available" language="js" /%}
{% /tab %}

{% /tabs %}

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### (任意) 休憩

チケットの強みは、チケットを使ったトランザクションの準備をしている間も、アカウントの業務を通常通り行うことができる点にあります。チケットを使用してトランザクションを送信する場合、別のチケットを使用しているものも含め、他のトランザクションの送信と並行して行うことができ、いつでもチケット付きトランザクションを送信することができます。唯一の制約は、1つのチケットは1回しか使用できないということです。

**ヒント:** 以下のステップの間または途中で、ここに戻ってきてシーケンス取引を送信することができますが、その際、チケット取引の成功を妨げることはありません。

{% interactive-block label="Intermission" steps=$frontmatter.steps %}

<button id="intermission-payment" class="btn btn-primary previous-steps-required">Payment</button>
<button id="intermission-escrowcreate" class="btn btn-primary previous-steps-required">EscrowCreate</button>
<button id="intermission-accountset" class="btn btn-primary previous-steps-required">AccountSet</button>
<div class="output-area"></div>

{% /interactive-block %}



### 7. 有効なチケットの確認

チケット付きのトランザクションを送信したい場合、どのチケットシーケンス番号を使用するかを知る必要があります。アカウントを注意深く管理していれば、どのチケットを持っているかはすでにわかっていると思いますが、よくわからない場合は、[account_objects メソッド][]を使って、利用可能なチケットを調べることができます。例えば、以下のようになります。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Check Available Tickets" before="// Prepare and Sign Ticketed" language="js" /%}
{% /tab %}

{% /tabs %}


{% interactive-block label="Check Tickets" steps=$frontmatter.steps %}

<button id="check-tickets" class="btn btn-primary previous-steps-required">Check Tickets</button>
<div class="output-area"></div>

{% /interactive-block %}

**ヒント:** チケットが残っている限り、ここから最後まで同じ手順を繰り返すことができます。

### 8. チケット付きトランザクションの準備

チケットが利用できるようになったので、それを使用するトランザクションを準備します。

ここでは、好きな[トランザクションのタイプ](../../../references/protocol/transactions/types/index.md)を使用することができます。次の例では、何も行わない[AccountSet トランザクション][]を使用していますが、これはレジャーに他の設定を必要としないからです。`Sequence`フィールドを`0`に設定して、利用可能なチケットの1つのチケットシーケンス番号を持つ`TicketSequence`フィールドを含めます。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Prepare and Sign Ticketed" before="// Submit Ticketed Transaction" language="js" /%}
{% /tab %}

{% /tabs %}

{% admonition type="success" name="ヒント" %}
TicketCreateトランザクションをすぐに送信する予定がない場合は、トランザクションが期限切れにならないように、`LastLedgerSequence`を設定しないようにする必要があります。これを行う方法はライブラリによって異なります。

- **xrpl.js:** トランザクションの自動入力の際に、`"LastLedgerSequence": null`を指定する。
- **`rippled`:** 用意された指示から`LastLedgerSequence`を省略します。サーバはデフォルトでは値を提供しません。
{% /admonition %}

{% interactive-block label="Prepare Ticketed Tx" steps=$frontmatter.steps %}

<div id="ticket-selector">
  <h4>Select a Ticket:</h4>
  <div class="form-area"></div>
</div>
<button id="prepare-ticketed-tx" class="btn btn-primary previous-steps-required">Prepare Ticketed Transaction</button>
<div class="output-area"></div>

{% /interactive-block %}


### 9. チケット付きトランザクションの送信

前のステップで作成した署名付きトランザクションBlobを送信します。例えば、以下のようになります。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Submit Ticketed Transaction" before="// Wait for Validation (again)" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Submit Ticketed Tx" steps=$frontmatter.steps %}

<button id="ticketedtx-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob_t" data-wait-step-name="Wait Again">Submit</button>
<div class="output-area"></div>

{% /interactive-block %}


### 10. 検証の待機

チケット付きトランザクションは、シーケンス付きトランザクションと同じようにコンセンサスプロセスを経ます。

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait Again"} /%}

## マルチシグで使用する

チケットの主な使用例としては、複数の[マルチシグ](../../../concepts/accounts/multi-signing.md)を並行して集めることができます。チケットを使用することで、複数署名されたトランザクションが完全に署名されて準備が整った時点で、どれが先に準備されるかを気にすることなく送信することができます。

このシナリオでは、[step8,「チケット付きトランザクションの準備」](#8-チケット付きトランザクションの準備)が若干異なります。準備と署名を一度に行うのではなく、[任意のマルチシグトランザクションの送信](send-a-multi-signed-transaction.md)の手順に従うことになります。まずトランザクションを準備し、次に信頼できる署名者の間でトランザクションを循環させて署名を集め、最後に署名を組み合わせて最終的なマルチシグトランザクションを作成します。

複数の異なるトランザクションを処理する場合、それぞれが異なるチケットを使用する限り、この作業を並行して行うことができます。


## 関連項目

- **Concepts:**
    - [チケット](../../../concepts/accounts/tickets.md)
    - [マルチシグ](../../../concepts/accounts/multi-signing.md)
- **Tutorials:**
    - [マルチシグの設定](set-up-multi-signing.md)
    - [信頼出来るトランザクションの送信](../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [account_objects メソッド][]
    - [sign_for メソッド][]
    - [submit_multisigned メソッド][]
    - [TicketCreate トランザクション][]
    - [トランザクションの共通フィールド](../../../references/protocol/transactions/common-fields.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
