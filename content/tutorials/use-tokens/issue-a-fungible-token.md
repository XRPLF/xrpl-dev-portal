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

To transact on the XRP Ledger, you need an address and secret key, and some XRP. You also need one or more recipients who are willing to hold the tokens you issue: unlike in some other blockchains, in the XRP Ledger you cannot force someone to hold a token they do not want.

The best practice is to use ["cold" and "hot" addresses](issuing-and-operational-addresses.html). The cold address is the **issuer** of the token. The hot address is like a regular user's address that you control. It receives tokens from the cold address, which you can then transfer to other users. A hot address is not strictly necessary, since you could send tokens directly to users from the cold address, but it is useful for this tutorial since you need _someone_ to accept the tokens you issue. In production, you should take extra care of the cold address's cryptographic keys (for example, keeping them offline) because it is much harder to replace a cold address than a hot address, if its cryptographic keys are compromised.



For purposes of this tutorial, you can get the keys for two addresses using the following interface.

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


### {{n.next()}}. Configure Issuer Settings

First, configure the settings for your cold address (which will become the issuer of your token). Most settings can be reconfigured later, with the following exceptions: <!-- STYLE_OVERRIDE: will -->

- [Default Ripple](rippling.html): **This setting is required** so that users can send your token to each other. It's best to enable it _before_ setting up any trust lines or issuing any tokens.
- [Require Auth](authorized-trust-lines.html): (Optional) This setting limits your tokens to being held _only_ by accounts you've explicitly approved. You cannot enable this setting if you already have any trust lines or offers for _any_ token.

Other settings you may want to, optionally, configure for your cold address (issuer):

| Setting | Recommended Value | Summary |
|---|---|---|
| [Require Destination Tags](require-destination-tags.html) | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP | Enabled | Enable if this address isn't meant to process XRP payments. |
| [Transfer Fee](transfer-fees.html) | 0–1% | Charge a percentage fee when users send your token to each other. |
| [Tick Size](tick-size) | 5 | Limit the number of decimal places in exchange rates for your token in the [decentralized exchange](decentralized-exchange.html). Reduces churn of almost-equivalent offers and speeds up price discovery. |

**Note:** Many issuing settings apply equally to all tokens issued by an address, regardless of the currency code. If you want to issue multiple types of tokens in the XRP Ledger with different settings, you should use a different address to issue each different token.

```
TODO: CODE SAMPLE
```

### {{n.next()}}. Configure Hot Address Settings


### {{n.next()}}. Create Trust Line from Hot to Cold Address


### {{n.next()}}. Send Token


### {{n.next()}}. Confirm Token Balances
