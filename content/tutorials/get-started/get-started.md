---
html: get-started.html
parent: tutorials.html
template: template-doc.html
blurb: Get up and running with some of the resources you'll use to work with the XRP Ledger.
filters:
    - js_editor
---
# Get Started

The XRP Ledger is always online and entirely public. Anyone can access it **directly from a web browser** with source code like what's on this page.

The following example gets the latest [ledger version](ledgers.html) and a list of transactions that were newly-validated in that ledger version, using the [`getLedger()` method](rippleapi-reference.html#getledger). Try running it as-is, or change the code and see what happens.

**Tip:** If you can, open your browser's Developer Tools by pressing **F12**. The "Console" tab provides a native JavaScript console and can give insight into what code is running on any webpage. <!-- SPELLING_IGNORE: f12 -->

<!-- ripple-lib & prerequisites -->
{{currentpage.lodash_tag}}
{{currentpage.ripple_lib_tag}}

<!-- JS_EDITOR_START step2 -->

```js
const mainnet = new ripple.RippleAPI({
  server: 'wss://s1.ripple.com'
});

(async function(api) {
  await api.connect();

  let response = await api.getLedger({
    includeTransactions: true
  });
  console.log(response);

})(mainnet);
```

```js
const mainnet = new ripple.RippleAPI({
  server: 'wss://s.altnet.rippletest.net/'
});

(async function(api) {
  await api.connect();

  let response = await api.getLedger({
      includeTransactions: true
    });
  console.log(response);

})(mainnet);
```

```js
const mainnet = new ripple.RippleAPI({
  server: 'wss://s1.ripple.com'
});

(async function(api) {
  await api.connect();

  let response = await api.getLedger({
      includeTransactions: true
    });
  let tx_id = response.transactionHashes[0];
  let response2 = await api.getTransaction(tx_id);
  console.log(response2);

})(mainnet);
```

```js
const mainnet = new ripple.RippleAPI({
  server: 'wss://s1.ripple.com'
});

(async function(api) {
  await api.connect();

  let response = await api.getLedger({
      includeTransactions: true
    });
  console.log('Total XRP: '+api.dropsToXrp(response.totalDrops));

})(mainnet);
```

<!-- JS_EDITOR_END -->


## Suggestions

Try editing the code above to do something different:

- Connect to the [Testnet](parallel-networks.html) public server at `wss://s.altnet.rippletest.net/` instead. [Answer >](javascript:js_interactives.step2.ex_1())
- Look up the details of a transaction using the [`getTransaction()` method](rippleapi-reference.html#gettransaction). For the `id`, use one of the `transactionHashes` from the `getLedger()` response! [Answer >](javascript:js_interactives.step2.ex_2())
- Convert the `totalDrops` from the response to decimal XRP. [Answer >](javascript:js_interactives.step2.ex_3())


## Setup Steps

This page has the necessary prerequisites already loaded, but you can access the XRP Ledger from **any webpage** if you load [Lodash](https://lodash.com/) and [RippleAPI for JavaScript (ripple-lib)](rippleapi-reference.html) in that page's HTML. For example:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
<script src="https://unpkg.com/ripple-lib@1.9.1/build/ripple-latest-min.js"></script>
```

<!-- SPELLING_IGNORE: lodash -->

## Further Reading

When you're ready to move on, continue using the XRP Ledger with these resources:

- [Understand the Concepts](concepts.html) behind the XRP Ledger's design.
- [Use the RippleAPI Reference](rippleapi-reference.html) to see what else you can do.
- [Install `rippled`](install-rippled.html) to participate in the network.
- [Get Testnet XRP](xrp-testnet-faucet.html) to try sending and receiving payments.
