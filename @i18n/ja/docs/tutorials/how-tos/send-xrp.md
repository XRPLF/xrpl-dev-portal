---
html: send-xrp.html
parent: tasks.html
seo:
    description: Test Netを使用してXRPの送金をテストします。
cta_text: XRPを送金しよう
embed_xrpl_js: true
filters:
    - interactive_steps
labels:
  - 支払い
  - XRP
top_nav_grouping: 人気ページ
steps: ['Generate', 'Connect', 'Prepare', 'Sign', 'Submit', 'Wait', 'Check']
---
# XRPの送金

このチュートリアルでは、xrpl.jsを使用してシンプルなXRP送金を行う方法について説明します。まずは、XRP Testnetを使用してプロセスを順に進めます。次に、そのプロセスと、本番で同様の処理を行う場合に発生する追加要件とを比較します。

## 前提条件

<!-- このチュートリアルのインタラクティブ部分のソースコード： -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/send-xrp.js"></script>

- このページでは、xrpl.jsライブラリーを使用するJavaScriptの例を紹介します。[xrpl.js入門ガイド](../javascript/build-apps/get-started.md)に、xrpl.jsを使用してJavaScriptからXRP Ledgerデータにアクセスする方法の説明があります。

- XRP Ledgerでトランザクションを送信するには、まずアドレスと秘密鍵、そしていくらかのXRPが必要となります。次のインターフェイスを使用して、XRP Test NetにあるアドレスとTestnet XRPを入手できます。

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/generate-step.md" /%}

## Testnetでの送金

### 1. Testnetサーバへの接続

必須の自動入力可能フィールドに入力されるようにするために、ripple-libを、アカウントの現在のステータスと共有レジャー自体を取得できるサーバに接続する必要があります。（セキュリティを高めるために、トランザクションの署名はオフライン中に行うことを推奨します。ただしその場合は、自動入力可能フィールドに手動で入力する必要があります。）トランザクションの送信先となるネットワークに接続する必要があります。

以下のサンプルコードでは公開XRP Testnetサーバに接続します。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Connect" before="# Get credentials" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Connect" before="// Prepare transaction" language="java" /%}
{% /tab %}

{% /tabs %}


このチュートリアルでは、以下のボタンをクリックすることでブラウザーから直接接続できます。

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 2. トランザクションの準備

通常は、XRP LedgerトランザクションをオブジェクトとしてJSON[トランザクションフォーマット](../../references/protocol/transactions/index.md)で作成します。以下の例に、必要最小限の送金仕様を示します。

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

技術上、一部の追加のフィールドは実行可能なトランザクションに含める必要があり、また、省略可能なフィールドでも、`LastLedgerSequence`などは含めることを強く推奨します。[`autofill()`メソッド](https://js.xrpl.org/classes/Client.html#autofill)は、トランザクションの残りのフィールドに適切なデフォルトを自動的に入力します。上記の送金を準備する際の例を示します。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Prepare" before="// Sign" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Prepare" before="# Sign" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Prepare" before="// Sign" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Prepare" steps=$frontmatter.steps %}

<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">送金する額：</span>
  </div>
  <input type="number" class="form-control" value="22" id="xrp-amount"
  aria-label="XRPの額（小数）" aria-describedby="xrp-amount-label"
  min=".000001" max="100000000000" step="any">
  <div class="input-group-append">
    <span class="input-group-text" id="xrp-amount-label"> XRP</span>
  </div>
</div>
<button id="prepare-button" class="btn btn-primary previous-steps-required">サンプルトランザクションを準備する</button>
<div class="output-area"></div>

{% /interactive-block %}

### 3. トランザクションの指示への署名

xrpl.jsの[Wallet.sign()メソッド](https://js.xrpl.org/classes/Wallet.html#sign)を使用して、トランザクションに署名します。最初の引数は、署名するJSONトランザクションの文字列バージョンです。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Sign" before="// Submit" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Sign" before="# Submit" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Sign" before="// Submit" language="java" /%}
{% /tab %}

{% /tabs %}


署名処理の結果は、署名を含むトランザクションオブジェクトになります。通常、XRP Ledger APIは、署名済みトランザクションがトランザクションの正規の[バイナリーフォーマット](../../references/protocol/binary-format.md)（「ブロブ」と呼ばれる）の16進数表現になることを想定しています。

署名APIは、トランザクションのID、つまり識別用ハッシュを返します。この識別用ハッシュは、後でトランザクションを検索する際に使用します。識別用ハッシュは、このトランザクションに固有の64文字の16進文字列です。

{% interactive-block label="Sign" steps=$frontmatter.steps %}

<button id="sign-button" class="btn btn-primary previous-steps-required">サンプルトランザクションに署名する</button>
<div class="output-area"></div>

{% /interactive-block %}


### 4. 署名済みブロブの送信

トランザクションをネットワークに送信します。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Submit" before="// Wait" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Submit" before="# Wait" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Submit" before="// Wait" language="java" /%}
{% /tab %}

{% /tabs %}

このメソッドは、ローカルでトランザクションを適用しようと試みたときの**一時的な**結果を返します。この結果は、トランザクションが検証済みレジャーに含まれた時点で変わる_可能性があります_。当初は成功していたトランザクションが最終的に失敗となったり、当初失敗していたトランザクションが最終的に成功する場合があります。しかしながら、一時的な結果はほとんどの場合は最終結果と一致するため、ここで`tesSUCCESS`が表示されたらひとまず安心しても問題ありません。😁

他の結果が表示された場合は、以下の点を確認します。

- 送信元および送信先の正しいアドレスを使用しているか。
- トランザクションの他のフィールドへの入力漏れ、ステップのスキップ、その他の入力ミスがないか。
- トランザクションの送信に必要なTest Net XRPが十分にあるか。送金できるXRPの額は、[必要準備金](../../concepts/accounts/reserves.md)によって制限されています。現時点では、20XRPに加えて、レジャー内に保有している各「オブジェクト」につき5XRPずつ追加となります。（Test Net Faucetを使用して新しいアドレスを生成した場合は、保有するオブジェクトはありません。）
- テストネットワークのサーバに接続しているか。

他の可能性については、[トランザクション結果](../../references/protocol/transactions/transaction-results/index.md)の完全なリストをご覧ください。

{% interactive-block label="Submit" steps=$frontmatter.steps %}

<button id="submit-button" class="btn btn-primary previous-steps-required" data-tx-blob-from="#signed-tx-blob" data-wait-step-name="Wait">サンプルトランザクションを送信する</button>

{% loading-icon message=" 送信中..." /%}

<div class="output-area"></div>

{% /interactive-block %}

### 5. 検証の待機

ほとんどのトランザクションは送信後の次のレジャーバージョンに承認されます。つまり、4～7秒でトランザクションの結果が最終的なものになる可能性があります。XRP Ledgerがビジーになっているか、ネットワーク接続の品質が悪いためにトランザクションをネットワーク内で中継する処理が遅延した場合は、トランザクション確定までにもう少し時間がかかることがあります。（トランザクションの有効期限を設定する方法については、[信頼できるトランザクションの送信](../../concepts/transactions/reliable-transaction-submission.md)をご覧ください。）

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Wait" before="// Check" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Wait" before="# Check" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Wait" before="// Check" language="java" /%}
{% /tab %}

{% /tabs %}

{% partial file="/@i18n/ja/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### 6. トランザクションステータスの確認

トランザクションが行った内容を正確に把握するために、トランザクションが検証済みレジャーバージョンに記録されたときにトランザクションの結果を調べる必要があります。例えば、[txメソッド][]を使用して、トランザクションのステータスを確認できます。

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" from="// Check" before="// End of" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" from="# Check" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/send-xrp/java/SendXrp.java" from="// Check" language="java" /%}
{% /tab %}

{% /tabs %}


**注意:** APIは、まだ検証されていないレジャーバージョンからの暫定的な結果を返す場合があります。例えば、`rippled` APIの[txメソッド][]を使用した場合は、レスポンス内の`"validated": true`を探して、データが検証済みレジャーバージョンからのものであることを確認してください。検証済みレジャーバージョンからのものではないトランザクション結果は、変わる可能性があります。詳細は、[結果のファイナリティー](../../concepts/transactions/finality-of-results/index.md)をご覧ください。

{% interactive-block label="Check" steps=$frontmatter.steps %}

<button id="get-tx-button" class="btn btn-primary previous-steps-required">トランザクションステータスを確認する</button>
<div class="output-area"></div>

{% /interactive-block %}


## 本番環境の場合の相違点

本番XRP LedgerでXRPを送金する場合も、大部分の手順は同じです。ただし、必要なセットアップでは重要な相違点がいくつかあります。

- [実際のXRPは無料で取得できません。](#実際のxrpアカウントの取得)
- [本番XRP Ledgerネットワークと同期されているサーバに接続する必要があります。](#本番xrp-ledgerへの接続)

### 実際のXRPアカウントの取得

このチュートリアルでは、Test Net XRPがすでに資金供給されているアドレスをボタンで取得しましたが、それが可能だったのはTest Net XRPに何の価値もないからです。実際のXRPでは、XRPを所有している他者からXRPを入手する必要があります。（たとえば、取引所で購入する方法など。）[xrpl.jsのWallet()クラス](https://js.xrpl.org/classes/Wallet.html)を使用して、本番またはTestnetで機能するアドレスとシークレットを生成できます。

{% tabs %}

{% tab label="JavaScript" %}
```js
const wallet = new xrpl.Wallet()
console.log(wallet.address) // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
console.log(wallet.seed) // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% tab label="Python" %}
```py
from xrpl.wallet import Wallet
my_wallet = Wallet.create()
print(my_wallet.address) # Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
print(my_wallet.seed)            # Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% tab label="Java" %}
```java
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
SeedWalletGenerationResult generationResult = walletFactory.randomWallet(false);
Wallet wallet = generationResult.wallet();
System.out.println(wallet.classicAddress()); // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
System.out.println(generationResult.seed()); // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```
{% /tab %}

{% /tabs %}

**警告:** ローカルマシンで安全な方法で生成したアドレスとシークレットのみを使用してください。別のコンピュータでアドレスとシークレットを生成して、ネットワーク経由でそれらを自分に送信した場合は、ネットワーク上の他の人がその情報を見ることができる可能性があります。その情報見ることができる人は、あなたと同じようにあなたのXRPを操作できます。また、Test Netと本番で同じアドレスを使用しないことも推奨します。指定したパラメーターによっては、一方のネットワークに向けて作成したトランザクションが、もう一方のネットワークでも実行可能になるおそれがあるためです。

アドレスとシークレットを生成しても、直接XRPを入手できるわけではありません。単に乱数を選択しているだけです。また、そのアドレスでXRPを受け取って[アカウントに資金供給](../../concepts/accounts/index.md#アカウントの作成)する必要があります。XRPを取得する方法として最も一般的なのは、取引所から購入し、所有しているアドレスに入れる方法です。詳細は、[XRP Overview](/about/xrp)をご覧ください。

### 本番XRP Ledgerへの接続

XRP Ledgerと同期しているサーバを指定する必要があります。多くの場合は公開サーバを、以下のスニペットなどで使用できます。

{% tabs %}

{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')
const api = new xrpl.Client('wss://xrplcluster.com')
api.connect()
```
{% /tab %}

{% tab label="Python" %}
```py
from xrpl.clients import JsonRpcClient
client = JsonRpcClient("https://xrplcluster.com")
```
{% /tab %}

{% tab label="Java" %}
```java
final HttpUrl rippledUrl = HttpUrl.get("https://xrplcluster.com");
XrplClient xrplClient = new XrplClient(rippledUrl);
```
{% /tab %}

{% /tabs %}

**ヒント:** ローカル接続では、WebSocketプロトコルのTLSで暗号化されたバージョン（`wss`）ではなく、暗号化されていないバージョン（`ws`）を使用します。この方式は、通信が同じマシンの中だけで行われてマシンの外に出て行かないという点で安全で、TLS証明書が不要であるため設定が簡単です。外部ネットワークとの接続では、必ず`wss`を使用してください。

## 次のステップ

このチュートリアルを完了後は、以下を試してみてください。

- 本番システム向けに[信頼できるトランザクションの送信](../../concepts/transactions/reliable-transaction-submission.md)を構築する
- [xrpl.jsリファレンス](https://js.xrpl.org/)を参照して、XRP Ledgerの全機能を確認する
- [アカウント設定](../how-tos/manage-account-settings/index.md)をカスタマイズする
- [トランザクションのメタデータ](../../references/protocol/transactions/metadata.md)にトランザクションの結果の詳細がどのように記述されているかを知る
- escrowやPayment Channelなどの[複雑な支払いタイプ](../../concepts/payment-types/index.md)について調べる

{% raw-partial file="/docs/_snippets/common-links.md" /%}
