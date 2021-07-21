---
html: issue-a-fungible-token.html
parent: use-tokens.html
blurb: Create your own token and issue it on the XRP Ledger Testnet.
embed_ripple_lib: true
filters:
  - interactive_steps
labels:
  - Tokens
---
# Issue a Fungible Token

Anyone can issue various types of tokens in the XRP Ledger, ranging from informal "IOUs" to fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more. This tutorial demonstrates the technical steps of creating a token in the ledger. For more information on how XRP Ledger tokens work, see [Issued Currencies](issued-currencies.html); for more on the business decisions involved in issuing a stablecoin, see [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html).


## Prerequisites

- You need two funded XRP Ledger accounts, each with an address, secret key, and some XRP. For production, you can use the same addresses and secrets consistently. For this tutorial, you can generate new test credentials as needed.
    - For purposes of this address, one account is the main issuer and the other is a recipient or
- You need a connection to the XRP Ledger network.

This page provides examples that use [ripple-lib for JavaScript](get-started-with-rippleapi-for-javascript.html). Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/issue-a-token.js"></script>


## Steps
{% set n = cycler(* range(1,99)) %}
### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these using the following interface:

<!-- Special version of generate-step.md for getting sender AND receiver credentials -->
{% if use_network is undefined or use_network == "Testnet" %}
  {% set use_network = "Testnet" %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% elif use_network == "Devnet" %}
  {% set faucet_url = "https://faucet.devnet.rippletest.net/accounts" %}
{# No faucet for Mainnet! #}
{% endif %}
{{ start_step("Generate") }}
<button id="generate-2x-creds-button" class="btn btn-primary" data-fauceturl="{{faucet_url}}">Get {{use_network}} credentials</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Generating Keys...</div>
<div class="output-area"></div>
{{ end_step() }}

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.


When you're [building actual production-ready software](production-readiness.html), you'll instead use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it.

The following code uses a [ripple-lib for JavaScript](rippleapi-reference.html) instance to connect to a public XRP Ledger Testnet server:

```js
ripple = require('ripple-lib') // Node.js only. Use a <script> tag in browsers.

async function main() {
  api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
  await api.connect()

  // Code in the following examples continues here...
}

main()
```

**Note:** The code samples in this tutorial use JavaScript's [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, you can connect directly from your browser by pressing the following button:

{% include '_snippets/interactive-tutorials/connect-step.md' %}
