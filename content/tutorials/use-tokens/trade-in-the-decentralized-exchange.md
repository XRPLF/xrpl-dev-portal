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

### {{n.next()}}. Wait for Confirmation
