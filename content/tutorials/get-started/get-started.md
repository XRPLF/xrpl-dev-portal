---
html: get-started.html
parent: tutorials.html
blurb: Get up and running with some of the resources you'll use to work with the XRP Ledger.
filters:
  - js_editor
labels:
  - Development
---
# Get Started

The XRP Ledger is always online and entirely public. Anyone can access it **directly from a web browser** with source code like what's on this page.

The following example gets the latest [ledger version](ledgers.html) and a list of transactions that were newly-validated in that ledger version, using the [ledger method][]. Try running it as-is, or change the code and see what happens.

**Tip:** If you can, open your browser's Developer Tools by pressing **F12**. The "Console" tab provides a native JavaScript console and can give insight into what code is running on any webpage. <!-- SPELLING_IGNORE: f12 -->

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


## Suggestions

Try editing the code above to do something different:

- Connect to the [Testnet](parallel-networks.html) public server at `wss://s.altnet.rippletest.net/` instead. [Answer >](javascript:js_interactives.step2.ex_1())
- Look up the details of one of the ledger's transaction using the [tx method][]. [Answer >](javascript:js_interactives.step2.ex_2())
- Convert the `total_coins` from the response to decimal XRP. [Answer >](javascript:js_interactives.step2.ex_3())


## Setup Steps

This page has the necessary prerequisites already loaded, but you can access the XRP Ledger from **any webpage** if you load [xrpl.js](https://github.com/XRPLF/xrpl.js/) in that page's HTML. For example:

```html
<script src="https://unpkg.com/xrpl@2.0.0/build/xrpl-latest-min.js"></script>
```


## Further Reading

When you're ready to move on, continue using the XRP Ledger with these resources:

- [Send XRP](send-xrp.html) to send your first transaction.
- [Understand the Concepts](concepts.html) behind the XRP Ledger's design.
- [Install `rippled`](install-rippled.html) to participate in the network.
- [Get Testnet XRP](xrp-testnet-faucet.html) to try sending and receiving payments.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
