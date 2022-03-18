---
parent: use-tokens.html
blurb: Buy or sell fungible tokens for each other or for XRP in the decentralized exchange.
filters:
  - interactive_steps
  - include_code
labels:
  - Tokens
---
# Trade in the Decentralized Exchange

This tutorial demonstrates how you can buy and sell tokens in the [decentralized exchange](decentralized-exchange.html).

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/dex-trade.js"></script>

This page provides JavaScript examples that use the [xrpl.js](https://js.xrpl.org/) library. See [Get Started Using JavaScript](get-started-using-javascript.html) for setup instructions.

Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.

## Steps
{% set n = cycler(* range(1,99)) %}

This tutorial demonstrates how to conduct two trades: first, buying a token by selling XRP; then, selling that token to buy a different token. The two test tokens used in this tutorial are:

| Currency Code | Issuer | Notes |
|---|---|---|
| TST | rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd | A test token with a [`TickSize` setting](ticksize.html) of 5, pegged to XRP at a rate of 10 XRP per 1 TST. |
| TS2 | ***TODO: TS2 issuer setup*** | A test token with a 2% [transfer fee](transfer-fees.html). |


### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these on the [{{use_network}}](parallel-networks.html) using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).


### {{n.next()}}. Connect to Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

<!-- MULTICODE_BLOCK_END -->

**Note:** The JavaScript code samples in this tutorial use the [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}

### {{n.next()}}. Look Up Offers

Before you buy or sell a token, you usually want to look up what others are buying and selling for, to get a sense of how others value it. In the XRP Ledger, you can look up existing offers for any currency pair using the [book_offers method][].

***TODO: interactive block, code samples, explanation of results***

### {{n.next()}}. Send OfferCreate Transaction

To actually make a trade, send an [OfferCreate transaction][]. In this case, you want to buy TST using XRP, so you should set the parameters as follows:

| Field | Type | Description |
|---|---|---|
| `TakerPays` | [Token Amount object](#specifying-currency-amounts) | How much of what currency you want to buy, in total. For this tutorial, buy some amount of **TST** issued by `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd`. |
| `TakerGets` | [XRP, in drops][] | How much of what currency you are offering to pay in total. For this tutorial, you should offer approximately slightly over 10 XRP per TST. |

{{ start_step("Send OfferCreate") }}
<form>
  <div class="row"><h5>TakerPays</h5></div>
  <div class="form-group row">
    <label for="taker-pays-currency-1" class="col-form-label col-sm-3">currency</label>
    <div class="input-group col">
      <input type="text" class="form-control" id="taker-pays-currency-1" value="FOO" disabled="disabled" />
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
  <div class="row"><h5>TakerGets</h5></div>
  <div class="form-group row">
    <label for="taker-gets-amount-1" class="col-form-label col-sm-3">XRP:</label>
    <div class="input-group col">
      <input type="number" class="form-control" value="115" id="taker-gets-amount-1"
      aria-label="Amount of XRP, as a decimal" aria-describedby="xrp-amount-label"
      min=".000001" max="100000000000" step="any" />
    </div>
  </div>
  <div class="row"><h5>Exchange Rate</h5></div>
  <div class="form-group row">
    <label for="taker-gets-amount-1" class="col-form-label col-sm-3">XRP cost per 1 FOO:</label>
    <div class="input-group col">
      <input type="number" class="form-control" value="" id="exchange-rate-1" />
    </div>
  </div>
</form>
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

The [transaction metadata](transaction-metadata.html) describes the outcome of a transaction. You can use a validated transaction's metadata to determine exactly what it did. (Don't use metadata from tentative transaction results, because it may be different from the [final result](finality-of-results.html), especially when using the decentralized exchange.) In case of an OfferCreate transaction, likely results include:

- Some or all of the Offer may have been filled by matching with existing Offers in the ledger.
- The unmatched remainder, if any, has been placed into the ledger.
- Other bookkeeping may have occurred, such as removing expired or unfunded Offers that would have matched.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
