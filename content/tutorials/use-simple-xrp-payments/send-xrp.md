---
html: send-xrp.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Learn how to send test payments right from your browser.
cta_text: Send XRP
embed_ripple_lib: true
filters:
    - interactive_steps
    - include_code
---
# Send XRP

This tutorial explains how to send a simple XRP Payment using RippleAPI for JavaScript. First, we step through the process with the XRP Test Net. Then, we compare that to the additional requirements for doing the equivalent in production.

**Tip:** Check out the [Code Samples](https://github.com/ripple/xrpl-dev-portal/tree/master/content/_code-samples) for a complete version of the code used in this tutorial.

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/send-xrp.js"></script>
{% set use_network = "Testnet" %}

- This page provides JavaScript examples that use the ripple-lib (RippleAPI) library. The [RippleAPI Beginners Guide](get-started-with-rippleapi-for-javascript.html) describes how to get started using RippleAPI to access XRP Ledger data from JavaScript.


## Send a Payment on the Test Net
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. The address and secret key look like this:

{{ include_code("_code-samples/send-xrp/send-xrp.js", end_before="// Connect", language="js") }}

For development purposes, you can get these using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building actual production-ready software](production-readiness.html), you'll instead use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).


### {{n.next()}}. Connect to a Testnet Server

To provide the necessary auto-fillable fields, ripple-lib must be connected to a server where it can get the current status of your account and the shared ledger itself. (For more security, you should sign transactions while being offline, but you must provide the auto-fillable fields manually if you do so.) You must be connected to the network to submit transactions to it.

The following code sample creates a new RippleAPI instance and connects to one of the public Testnet servers that Ripple runs:

{{ include_code("_code-samples/send-xrp/send-xrp.js", start_with="// Connect", end_before="// Get credentials", language="js") }}

For this tutorial, you can connect directly from your browser by pressing the following button:

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. Prepare Transaction

Typically, we create XRP Ledger transactions as objects in the JSON [transaction format](transaction-formats.html). The following example shows a minimal Payment specification:

```json
{
  "TransactionType": "Payment",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "Amount": "2000000",
  "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
}
```

The bare minimum set of instructions you must provide for an XRP Payment is:

- An indicator that this is a payment. (`"TransactionType": "Payment"`)
- The sending address. (`"Account"`)
- The address that should receive the XRP (`"Destination"`). This can't be the same as the sending address.
- The amount of XRP to send (`"Amount"`). Typically, this is specified as an integer in "drops" of XRP, where 1,000,000 drops equals 1 XRP.

Technically, a viable transaction must contain some additional fields, and certain optional fields such as `LastLedgerSequence` are strongly recommended. The [`prepareTransaction()` method](rippleapi-reference.html#preparetransaction) automatically fills in good defaults for the remaining fields of a transaction. Here's an example of preparing the above payment:

{{ include_code("_code-samples/send-xrp/send-xrp.js", start_with="// Prepare", end_before="// Sign", language="js" ) }}

{{ start_step("Prepare") }}
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">Send: </span>
  </div>
  <input type="number" class="form-control" value="22" id="xrp-amount"
  aria-label="Amount of XRP, as a decimal" aria-describedby="xrp-amount-label"
  min=".000001" max="100000000000" step="any">
  <div class="input-group-append">
    <span class="input-group-text" id="xrp-amount-label"> XRP</span>
  </div>
</div>
<button id="prepare-button" class="btn btn-primary previous-steps-required">Prepare
  example transaction</button>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Sign the Transaction Instructions

Use the [sign() method](rippleapi-reference.html#sign) to sign the transaction with RippleAPI. The first argument is a string version of the JSON transaction to sign.

{{ include_code("_code-samples/send-xrp/send-xrp.js",
    start_with="// Sign", end_before="// Submit", language="js" ) }}

The result of the signing operation is a transaction object containing a signature. Typically, XRP Ledger APIs expect a signed transaction to be the hexadecimal representation of the transaction's canonical [binary format](serialization.html), called a "blob".

The signing API also returns the transaction's ID, or identifying hash, which you can use to look up the transaction later. This is a 64-character hexadecimal string that is unique to this transaction.

{{ start_step("Sign") }}
<button id="sign-button" class="btn btn-primary previous-steps-required">Sign
  example transaction</button>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Submit the Signed Blob

Use the [submit() method](rippleapi-reference.html#submit) to submit a transaction to the network. It's also a good idea to use the [`getLedgerVersion()` method](rippleapi-reference.html#getledgerversion) to take note of the latest validated ledger index before you submit. The earliest ledger version that your transaction could get into as a result of this submission is one higher than the latest validated ledger when you submit it.

Of course, if the same transaction was previously submitted, it could already be in a previous ledger. (It can't succeed a second time, but you may not realize it succeeded if you aren't looking in the right ledger versions.)

{{ include_code("_code-samples/send-xrp/send-xrp.js", start_with="// Submit", end_before="// Wait", language="js" ) }}

This method returns the **tentative** result of trying to apply the transaction locally. This result _can_ change when the transaction is included in a validated ledger: transactions that succeed initially might ultimately fail, and transactions that fail initially might ultimately succeed. Still, the tentative result often matches the final result, so it's OK to get excited if you see `tesSUCCESS` here. 😁

If you see any other result, you should check the following:

- Are you using the correct addresses for the sender and destination?
- Did you forget any other fields of the transaction, skip any steps, or make any other typos?
- Do you have enough Test Net XRP to send the transaction? The amount of XRP you can send is limited by the [reserve requirement](reserves.html), which is currently 20 XRP with an additional 5 XRP for each "object" you own in the ledger. (If you generated a new address with the Test Net Faucet, you don't own any objects.)
- Are you connected to a server on the test network?

See the full list of [transaction results](transaction-results.html) for more possibilities.


{{ start_step("Submit") }}
<button id="submit-button" class="btn btn-primary previous-steps-required" data-tx-blob-from="#signed-tx-blob" data-wait-step-name="Wait">Submit
example transaction</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png"> Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

Use an account [subscription](rippleapi-reference.html#listening-to-streams) to listen for an event when the transaction is confirmed. Use the `ledger` event type to trigger your code to run whenever there is a new validated ledger version so that you can know if the transaction can no longer be confirmed. For example:

{{ include_code("_code-samples/send-xrp/send-xrp.js", start_with="// Wait", end_before="// There are other", language="js" ) }}

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Check Transaction Status

To know for sure what a transaction did, you must look up the outcome of the transaction when it appears in a validated ledger version. For example, you can use the [`getTransaction()` method](rippleapi-reference.html#gettransaction) to check the status of a transaction:

{{ include_code("_code-samples/send-xrp/send-xrp.js",
    start_with="// Check", language="js" ) }}

The RippleAPI `getTransaction()` method only returns success if the transaction is in a validated ledger version. Otherwise, the `await` expression raises an exception.

**Caution:** Other APIs may return tentative results from ledger versions that have not yet been validated. For example, if you use the `rippled` APIs' [tx method][], be sure to look for `"validated": true` in the response to confirm that the data comes from a validated ledger version. Transaction results that are not from a validated ledger version are subject to change. For more information, see [Finality of Results](finality-of-results.html).

{{ start_step("Check") }}
<button id="get-tx-button" class="btn btn-primary previous-steps-required">Check transaction status</button>
<div class="output-area"></div>
{{ end_step() }}


## Differences for Production

To send an XRP payment on the production XRP Ledger, the steps you take are largely the same. However, there are some key differences in the necessary setup:

- [Getting real XRP isn't free.](#getting-a-real-xrp-account)
- [You must connect to a server that's synced with the production XRP Ledger network.](#connecting-to-the-production-xrp-ledger)

### Getting a Real XRP Account

This tutorial uses a button to get an address that's already funded with Test Net XRP, which only works because Test Net XRP is not worth anything. For actual XRP, you need to get XRP from someone who already has some. (For example, you might buy it on an exchange.) You can generate an address and secret that'll work on either production or the test net using RippleAPI's [`generateAddress()` method](rippleapi-reference.html#generateaddress):

```js
const generated = api.generateAddress()
console.log(generated.address) // Example: rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f
console.log(generated.secret) // Example: sp6JS7f14BuwFY8Mw6bTtLKWauoUs
```

**Warning:** You should only use an address and secret that you generated securely, on your local machine. If another computer generated the address and secret and sent it to you over a network, it's possible that someone else on the network may see that information. If they do, they'll have as much control over your XRP as you do. It's also recommended not to use the same address for the Testnet and Mainnet, because transactions that you created for use on one network could potentially also be viable on the other network, depending on the parameters you provided.

Generating an address and secret doesn't get you XRP directly; you're only choosing a random number. You must also receive XRP at that address to [fund the account](accounts.html#creating-accounts). A common way to acquire XRP is to buy it from an [exchange](exchanges.html), then withdraw it to your own address.

### Connecting to the Production XRP Ledger

When you instantiate the `RippleAPI` object, you must specify a server that's synced with the appropriate XRP Ledger. For many cases, you can use Ripple's public servers, such as in the following snippet:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s1.ripple.com:51233'})
api.connect()
```

If you [install `rippled`](install-rippled.html) yourself, it connects to the production network by default. (You can also [configure it to connect to the test net](connect-your-rippled-to-the-xrp-test-net.html) instead.) After the server has synced (typically within about 15 minutes of starting it up), you can connect RippleAPI to it locally, which has [various benefits](the-rippled-server.html). The following example shows how to connect RippleAPI to a server running the default configuration:

```js
ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'ws://localhost:6006'})
api.connect()
```

**Tip:** The local connection uses the WebSocket protocol (`ws`) unencrypted rather than the TLS-encrypted version (`wss`). This is secure only because the communications never leave the same machine, and is easier to set up because it does not require a TLS certificate. For connections on an outside network, always use `wss`.

## Next Steps

After completing this tutorial, you may want to try the following:

- Build [Reliable transaction submission](reliable-transaction-submission.html) for production systems.
- Consult the [RippleAPI JavaScript Reference](rippleapi-reference.html) for the full range of XRP Ledger functionality.
- Customize your [Account Settings](manage-account-settings.html).
- Learn how [Transaction Metadata](transaction-metadata.html) describes the outcome of a transaction in detail.
- Explore [Complex Payment Types](complex-payment-types.html) like escrow and payment channels.
- Read best practices for [XRP Ledger Businesses](xrp-ledger-businesses.html).



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
