---
parent: use-tokens.html
seo:
    description: Buy or sell fungible tokens for each other or for XRP in the decentralized exchange.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Decentralized Exchange
  - Tokens
steps: ['Connect', 'Generate', 'Look Up Offers',' Send OfferCreate', 'Wait', 'Check Metadata', 'Check Balances and Offers']
---
# Trade in the Decentralized Exchange

This tutorial demonstrates how you can buy and sell tokens in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md) (DEX).

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup steps.
    - **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](../../python/build-apps/get-started.md) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script src='https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/bignumber.min.js'></script>
<script type="application/javascript" src="/js/tutorials/trade-in-the-dex.js"></script>

## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Trade in the Decentralized Exchange](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/trade-in-the-decentralized-exchange/) in the source repository for this website.


## Steps

This tutorial demonstrates how to buy a fungible token in the decentralized exchange by selling XRP. (Other types of trades are possible, but selling a token, for example, requires you to have it first.) The example token used in this tutorial is as follows:

| Currency Code | Issuer | Notes |
|---|---|---|
| TST | `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd` | A test token pegged to XRP at a rate of approximately 10 XRP per 1 TST. The issuer has existing Offers on the XRP Ledger Testnet to buy and sell these tokens.  |


### 1. Connect to Network

You must be connected to the network to submit transactions to it. Additionally, some languages (including JavaScript) require a high-precision number library for performing calculations on currency amounts you may find in the ledger. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](../../../references/client-libraries.md) with the appropriate dependencies.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/base-with-bignumber.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/get-started/py/base-async.py" language="py" /%}
{% /tab %}

{% /tabs %}

**Note:** The JavaScript code samples in this tutorial use the [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}

### 2. Get Credentials

To transact on the XRP Ledger, you need an address, a secret key, and some XRP. For development purposes, you can get these on the [Testnet](../../../concepts/networks-and-servers/parallel-networks.md) using the following interface:

{% partial file="/docs/_snippets/interactive-tutorials/generate-step.md" /%}

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md). The following code shows how to create a `Wallet` instance to use your keys:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js" from="// Get credentials" before="// Define the proposed trade" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/py/trade-in-the-dex.py" from="# Get credentials" before="# Define the proposed trade" language="py" /%}
{% /tab %}

{% /tabs %}

### 3. Look Up Offers

Before you buy or sell a token, you usually want to look up what others are buying and selling for, to get a sense of how others value it. In the XRP Ledger, you can look up existing offers for any currency pair using the [book_offers method][].

**Tip:** Technically, this step is not a requirement for placing an Offer, but it is a good practice to confirm the current situation before trading anything with real value.

The following code shows how to look up existing Offers and compare them to a proposed Offer to estimate how it would execute:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js" from="// Define the proposed trade" before="// Send OfferCreate" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/py/trade-in-the-dex.py" from="# Define the proposed trade" before="# Send OfferCreate" language="py" /%}
{% /tab %}

{% /tabs %}

**Note:** Other users of the XRP Ledger can also make trades at any time, so this is only an estimate of what would happen if nothing else changes. The outcome of a transaction is not guaranteed until it is [final](../../../concepts/transactions/finality-of-results/index.md).

The following block demonstrates these calculations in action:

{% interactive-block label="Look Up Offers" steps=$frontmatter.steps %}

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

{% loading-icon message="Querying..." /%}

<div class="output-area"></div>

{% /interactive-block %}

### 4. Send OfferCreate Transaction

To actually make a trade, send an [OfferCreate transaction][]. In this case, you want to buy TST using XRP, so you should set the parameters as follows:

| Field | Type | Description |
|---|---|---|
| `TakerPays` | [Token Amount object][Currency Amount] | How much of what currency you want to buy, in total. For this tutorial, buy some amount of **TST** issued by `rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd`. |
| `TakerGets` | [XRP, in drops][] | How much of what currency you are offering to pay in total. For this tutorial, you should specify about 11.5 XRP per TST or slightly more. |

The following code shows how to prepare, sign, and submit the transaction:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js" from="// Send OfferCreate" before="// Check metadata" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/py/trade-in-the-dex.py" from="# Send OfferCreate" before="# Check metadata" language="py" /%}
{% /tab %}

{% /tabs %}

You can use this interface to send the transaction specified by the amounts in the previous step:

{% interactive-block label="Send OfferCreate" steps=$frontmatter.steps %}

<button id="send-offercreate" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send OfferCreate</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}

### 5. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).)

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### 6. Check Metadata

You can use the validated transaction's [metadata](../../../references/protocol/transactions/metadata.md) to determine exactly what it did. (Don't use metadata from tentative transaction results, because it may be different from the [final result](../../../concepts/transactions/finality-of-results/index.md), especially when using the decentralized exchange.) In case of an OfferCreate transaction, likely results include:

- Some or all of the Offer may have been filled by matching with existing Offers in the ledger.
- The unmatched remainder, if any, has been placed into the ledger to await new matching Offers. <!-- STYLE_OVERRIDE: remainder -->
- Other bookkeeping may have occurred, such as removing expired or unfunded Offers that would have matched.

The following code demonstrates how to check the metadata of the transaction:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js" from="// Check metadata" before="// Check balances" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/py/trade-in-the-dex.py" from="# Check metadata" before="# Check balances" language="py" /%}
{% /tab %}

{% /tabs %}

You can use this interface to test it out:

{% interactive-block label="Check Metadata" steps=$frontmatter.steps %}

<button id="check-metadata" class="btn btn-primary previous-steps-required">Check Metadata</button>

{% loading-icon message="Checking..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 7. Check Balances and Offers

This is also a good time to look up the balances and outstanding Offers owned by your account as of the latest validated ledger. This shows any changes caused by your transaction as well as any others that executed in the same ledger version.

The following code demonstrates how to look up balances using the [account_lines method][] and look up Offers using the [account_offers method][].

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/js/trade-in-the-dex.js" from="// Check balances" before="client.disconnect()" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/trade-in-the-decentralized-exchange/py/trade-in-the-dex.py" from="# Check balances" before="# End main()" language="py" /%}
{% /tab %}

{% /tabs %}

You can use this interface to test it out:

{% interactive-block label="Check Balances and Offers" steps=$frontmatter.steps %}

<button id="check-balances-and-offers" class="btn btn-primary previous-steps-required">Check Balances and Offers</button>

{% loading-icon message="Checking..." /%}

<div class="output-area"></div>

{% /interactive-block %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
