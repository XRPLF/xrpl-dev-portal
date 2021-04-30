---
html: require-destination-tags.html
parent: manage-account-settings.html
blurb: Require users to specify a destination tag when sending to your address.
embed_ripple_lib: true
filters:
    - interactive_steps
---
# Require Destination Tags

The Require Destination Tag setting is designed for addresses that host balances for multiple people or purposes, to prevent people from sending money and forgetting to use a [destination tag](source-and-destination-tags.html) to identify whom to credit. When this setting is enabled on your address, the XRP Ledger rejects [any payment](payment-types.html) to your address if it does not specify a destination tag.

This tutorial demonstrates how to enable the Require Destination Tag flag on your account.

**Note:** The meanings of specific destination tags are entirely up to the logic built on top of the XRP Ledger. The ledger has no way of knowing whether any specific tag is valid in your system, so you must still be ready to receive transactions with the wrong destination tag. Typically, this involves providing a customer support experience that can track down payments made incorrectly and credit customers accordingly, and possibly also bouncing unwanted payments.

## Prerequisites

- You need a funded XRP Ledger account, with an address, secret key, and some XRP. For production, you can use the same address and secret consistently. For this tutorial, you can generate new test credentials as needed.
- You need a connection to the XRP Ledger network.

This page provides examples that use [ripple-lib for JavaScript](get-started-with-rippleapi-for-javascript.html). Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/require-destination-tags.js"></script>


## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building actual production-ready software](production-readiness.html), you'll instead use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it.

The following code uses a [ripple-lib for JavaScript](rippleapi-reference.html) instance to connect to a public XRP Testnet server:

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

### {{n.next()}}. Send AccountSet Transaction

To enable the `RequireDest` flag, set the [`asfRequireDest` value (`1`)](accountset.html#accountset-flags) in the `SetFlag` field of an [AccountSet transaction][]. To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

For example:

```js
const prepared = await api.prepareTransaction({
  "TransactionType": "AccountSet",
  "Account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
  "SetFlag": 1 // RequireDest
})
console.log("Prepared transaction:", prepared.txJSON)
const max_ledger = prepared.instructions.maxLedgerVersion

const signed = api.sign(prepared.txJSON, "s████████████████████████████")
console.log("Transaction hash:", signed.id)
const tx_id = signed.id
const tx_blob = signed.signedTransaction

const prelim_result = await api.request("submit", {"tx_blob": tx_blob})
console.log("Preliminary result:", prelim_result)
const min_ledger = prelim_result.validated_ledger_index

// min_ledger, max_ledger, and tx_id are useful for looking up the transaction's
// status later.
```

{{ start_step("Send AccountSet") }}
<button id="send-accountset" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Confirm Account Settings

After the transaction is validated, you can check your account's settings to confirm that the Require Destination Tag flag is enabled.

```js
let account_info = await api.request("account_info", {
    "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "ledger_index": "validated"
})
const flags = api.parseAccountFlags(account_info.account_data.Flags)
console.log(JSON.stringify(flags, null, 2))
// Look for "requireDestinationTag": true
```

{{ start_step("Confirm Settings") }}
<button id="confirm-settings" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Confirm Settings</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

For further confirmation, you can send test transactions (from a different address) to confirm that the setting is working as you expect it to. If you a payment with a destination tag, it should succeed, and if you send one _without_ a destination tag, it should fail with the error code [`tecDST_TAG_NEEDED`](tec-codes.html).

{{ start_step("Test Payments") }}
<button class="test-payment btn btn-primary" data-dt="10">Send XRP (with Destination Tag)</button>
<button class="test-payment btn btn-primary" data-dt="">Send XRP (without Destination Tag)</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


## See Also

- **Concepts:**
    - [Accounts](accounts.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
    - [Transaction Cost](transaction-cost.html)
    - [Payment Types](payment-types.html)
- **Tutorials:**
    - [XRP Ledger Businesses](xrp-ledger-businesses.html)
- **References:**
    - [account_info method][]
    - [AccountSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
