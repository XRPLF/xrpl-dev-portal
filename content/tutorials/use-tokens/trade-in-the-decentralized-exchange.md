---
parent: use-tokens.html
blurb: Buy or sell fungible tokens for each other or for XRP in the decentralized exchange.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Decentralized Exchange
  - Tokens
---
# Trade in the Decentralized Exchange

This tutorial demonstrates how you can buy and sell tokens in the [decentralized exchange](decentralized-exchange.html) (DEX).

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<script src='https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/bignumber.min.js'></script>
<script type="application/javascript" src="assets/js/tutorials/trade-in-the-dex.js"></script>

This page provides JavaScript examples that use the [xrpl.js](https://js.xrpl.org/) library. See [Get Started Using JavaScript](get-started-using-javascript.html) for setup instructions.

Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.

## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Trade in the Decentralized Exchange](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/trade-in-the-decentralized-exchange/) in the source repository for this website.


## Steps
{% set n = cycler(* range(1,99)) %}

This tutorial demonstrates how to buy a fungible token in the decentralized exchange by selling XRP. (Other types of trades are possible, but selling a token, for example, requires you to have it first.) The example token used in this tutorial is as follows:

| Currency Code | Issuer | Notes |
|---|---|---|
| TST | `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd` | A test token pegged to XRP at a rate of approximately 10 XRP per 1 TST. The issuer has existing Offers on the XRP Ledger Testnet to buy and sell these tokens.  |


### {{n.next()}}. Connect to Network

You must be connected to the network to submit transactions to it. Additionally, some languages (including JavaScript) require a high-precision number library for performing calculations on currency amounts you may find in the ledger. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html) with the appropriate dependencies.

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/base-with-bignumber.js", language="js") }}

<!-- MULTICODE_BLOCK_END -->

**Note:** The JavaScript code samples in this tutorial use the [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address, a secret key, and some XRP. For development purposes, you can get these on the [{{use_network}}](parallel-networks.html) using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html). The following code shows how to create a `Wallet` instance to use your keys:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js", language="js", start_with="// Get credentials", end_before="// Define the proposed trade") }}

<!-- MULTICODE_BLOCK_END -->

### {{n.next()}}. Look Up Offers

Before you buy or sell a token, you usually want to look up what others are buying and selling for, to get a sense of how others value it. In the XRP Ledger, you can look up existing offers for any currency pair using the [book_offers method][].

**Tip:** Technically, this step is not a requirement for placing an Offer, but it is a good practice to confirm the current situation before trading anything with real value.

The following code shows how to look up existing Offers and compare them to a proposed Offer to estimate how it would execute:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js", language="js", start_with="// Define the proposed trade", end_before="// Send OfferCreate") }}

<!-- MULTICODE_BLOCK_END -->

**Note:** Other users of the XRP Ledger can also make trades at any time, so this is only an estimate of what would happen if nothing else changes. The outcome of a transaction is not guaranteed until it is [final](finality-of-results.html).

The following block demonstrates these calculations in action:

{{ start_step("Look Up Offers") }}
<form>
  <h5>TakerPays</h5>
  <div class="form-group row">
    <label for="taker-pays-currency-1" class="col-form-label col-sm-3">currency</label>
    <div class="input-group col">
      <input type="text" class="form-control" id="taker-pays-currency-1" value="TST" disabled="disabled" />
    </div>
  </div>
  <div class="form-group row">
    <label for="taker-pays-issuer-1" class="col-form-label col-sm-3">issuer</label>
    <div class="input-group col">
      <input type="text" class="form-control" id="taker-pays-issuer-1" value="rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" disabled="disabled" />
    </div>
  </div>
  <div class="form-group row">
    <label for="taker-pays-amount-1" class="col-form-label col-sm-3">value</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="taker-pays-amount-1" value="10" step="0.000001" min="0" max="1000" />
    </div>
  </div>
  <h5>TakerGets</h5>
  <div class="form-group row">
    <label for="taker-gets-amount-1" class="col-form-label col-sm-3">XRP:</label>
    <div class="input-group col">
      <input type="number" class="form-control" value="115" id="taker-gets-amount-1"
      aria-label="Amount of XRP, as a decimal" aria-describedby="xrp-amount-label"
      min=".000001" max="100000000000" step="any" />
    </div>
  </div>
  <h5>Exchange Rate</h5>
  <div class="form-group row">
    <label for="exchange-rate-1" class="col-form-label col-sm-3">XRP cost per 1 TST:</label>
    <div class="input-group col">
      <input type="number" class="form-control" value="11.5" id="exchange-rate-1" step="any" disabled="disabled" />
    </div>
  </div>
</form>
<button id="look-up-offers" class="btn btn-primary previous-steps-required">Look Up Offers</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Querying...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Send OfferCreate Transaction

To actually make a trade, send an [OfferCreate transaction][]. In this case, you want to buy TST using XRP, so you should set the parameters as follows:

| Field | Type | Description |
|---|---|---|
| `TakerPays` | [Token Amount object][Currency Amount] | How much of what currency you want to buy, in total. For this tutorial, buy some amount of **TST** issued by `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd`. |
| `TakerGets` | [XRP, in drops][] | How much of what currency you are offering to pay in total. For this tutorial, you should specify about 11.5 XRP per TST or slightly more. |

The following code shows how to prepare, sign, and submit the transaction:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js", language="js", start_with="// Send OfferCreate", end_before="// Check metadata") }}

<!-- MULTICODE_BLOCK_END -->

You can use this interface to send the transaction specified by the amounts in the previous step:

{{ start_step("Send OfferCreate") }}
<button id="send-offercreate" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send OfferCreate</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}

### {{n.next()}}. Check Metadata

You can use the validated transaction's [metadata](transaction-metadata.html) to determine exactly what it did. (Don't use metadata from tentative transaction results, because it may be different from the [final result](finality-of-results.html), especially when using the decentralized exchange.) In case of an OfferCreate transaction, likely results include:

- Some or all of the Offer may have been filled by matching with existing Offers in the ledger.
- The unmatched remainder, if any, has been placed into the ledger to await new matching Offers. <!-- STYLE_OVERRIDE: remainder -->
- Other bookkeeping may have occurred, such as removing expired or unfunded Offers that would have matched.

The following code demonstrates how to check the metadata of the transaction:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js", language="js", start_with="// Check metadata", end_before="// Check balances") }}

<!-- MULTICODE_BLOCK_END -->

You can use this interface to test it out:

{{ start_step("Check Metadata") }}
<button id="check-metadata" class="btn btn-primary previous-steps-required">Check Metadata</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Checking...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Check Balances and Offers

This is also a good time to look up the balances and outstanding Offers owned by your account as of the latest validated ledger. This shows any changes caused by your transaction as well as any others that executed in the same ledger version.

The following code demonstrates how to look up balances using the [account_lines method][] and look up Offers using the [account_offers method][].

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js", language="js", start_with="// Check balances", end_before="client.disconnect()") }}

<!-- MULTICODE_BLOCK_END -->

You can use this interface to test it out:

{{ start_step("Check Balances and Offers") }}
<button id="check-balances-and-offers" class="btn btn-primary previous-steps-required">Check Balances and Offers</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Checking...</div>
<div class="output-area"></div>
{{ end_step() }}

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
