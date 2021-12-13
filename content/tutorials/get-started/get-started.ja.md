---
html: get-started.html
parent: tutorials.html
blurb: XRP Ledgerを使用する際に必要となるリソースの一部をご紹介します。
filters:
  - js_editor
labels:
  - 開発
---
# 始めましょう

XRP Ledgerは常にオンラインで、完全に公開されています。このページにあるようなソースコードがあれば、誰でも**ブラウザから直接**アクセスすることができます。

次の例では、最新の[レジャーバージョン](ledgers.html)と、そのレジャーバージョンで新たに検証されたトランザクションのリストを、[レジャー method][]を使って取得しています。このまま実行してみたり、コードを変更して何が起こるか見てみましょう。

**ヒント：**可能であれば、**F12**を押して、ブラウザの開発者ツールを開いてください。コンソールタブには、JavaScriptのネイティブコンソールが用意されており、どのウェブページでどのようなコードが実行されているかを知ることができます。 <!-- SPELLING_IGNORE: f12 -->

<!-- ripple-lib & prerequisites -->
{{currentpage.ripple_lib_tag}}

<!-- JS_EDITOR_START step2 -->

```js
async function main() {
  const api = new xrpl.Client('wss://xrplcluster.com');
  await api.connect();

  let response = await api.request({
    "command": "ledger",
    "ledger_index": "validated",
    "transactions": true
  });
  console.log(response);
}
main();
```

```js
async function main() {
  const api = new xrpl.Client('wss://s.altnet.rippletest.net/');
  await api.connect();

  let response = await api.request({
    "command": "ledger",
    "ledger_index": "validated",
    "transactions": true
  });
  console.log(response);
}
main();
```

```js
async function main() {
  const api = new xrpl.Client('wss://xrplcluster.com');
  await api.connect();

  let response = await api.request({
    "command": "ledger",
    "ledger_index": "validated",
    "transactions": true
  });

  let tx_id = response.result.ledger.transactions[0];
  let response2 = await api.request({
    "command": "tx",
    "transaction": tx_id
  });
  console.log(response2);
}
main();
```

```js
async function main() {
  const api = new xrpl.Client('wss://xrplcluster.com');
  await api.connect();

  let response = await api.request({
    "command": "ledger",
    "ledger_index": "validated",
    "transactions": true
  });
  console.log('Total XRP: '+xrpl.dropsToXrp(response.result.ledger.total_coins));
}
main();
```

<!-- JS_EDITOR_END -->


## 提案

上のコードを編集して、何か別のことをしてみてください。

- 代わりに、`wss://s.altnet.rippletest.net/`の[Testnet](parallel-networks.html)公開サーバに接続してみましょう。 [Answer >](javascript:js_interactives.step2.ex_1())
- [tx メソッド][]を使って、台帳の取引の1つの詳細を調べてみましょう。[Answer >](javascript:js_interactives.step2.ex_2())
- レスポンスの`total_coins`を10進数のXRPに変換してみましょう。 [Answer >](javascript:js_interactives.step2.ex_3())


## セットアップ手順

このページには必要な前提条件がすでに読み込まれていますが、そのページのHTMLに[xrpl.js](https://github.com/XRPLF/xrpl.js/)を読み込めば、**あらゆるウェブページ**からXRP Ledgerにアクセスすることができます。
例えば、以下のようになります。

```html
<script src="https://unpkg.com/xrpl@2.0.0/build/xrpl-latest-min.js"></script>
```


## 参考文献

準備ができたら、これらのリソースを使ってXRP Ledgerを使い続けましょう。

- [XRPを送信](send-xrp.html)して、最初の取引を行う。
- XRP Ledgerの設計の背景にある[コンセプトを理解](concepts.html)する。
- ネットワークに参加するために[`rippled`をインストール](install-rippled.html)する。
- [Testnet XRPを入手](xrp-testnet-faucet.html)して、支払いの送受信を試す。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
