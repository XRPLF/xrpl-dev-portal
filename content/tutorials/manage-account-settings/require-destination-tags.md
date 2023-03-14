---
html: require-destination-tags.html
parent: manage-account-settings.html
blurb: Require users to specify a destination tag when sending to your address.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Accounts
---
# Require Destination Tags

The Require Destination Tag setting is designed for addresses that host balances for multiple people or purposes, to prevent people from sending money and forgetting to use a [destination tag](source-and-destination-tags.html) to identify whom to credit. When this setting is enabled on your address, the XRP Ledger rejects [any payment](payment-types.html) to your address if it does not specify a destination tag.

This tutorial demonstrates how to enable the Require Destination Tag flag on your account.

**Note:** The meanings of specific destination tags are entirely up to the logic built on top of the XRP Ledger. The ledger has no way of knowing whether any specific tag is valid in your system, so you must still be ready to receive transactions with the wrong destination tag. Typically, this involves providing a customer support experience that can track down payments made incorrectly and credit customers accordingly, and possibly also bouncing unwanted payments.

## Prerequisites

- You need a funded XRP Ledger account, with an address, secret key, and some XRP. For production, you can use the same address and secret consistently. For this tutorial, you can generate new test credentials as needed.
- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
    - **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](get-started-using-python.html) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/require-destination-tags.js"></script>

## Example Code

Complete sample code for all the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Require Destination Tags](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/require-destination-tags/) in the source repository for this website.

## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

_Python_

{{ include_code("_code-samples/get-started/py/base-async.py", language="py") }}

<!-- MULTICODE_BLOCK_END -->

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}

### {{n.next()}}. Send AccountSet Transaction

To enable the `RequireDest` flag, set the [`asfRequireDest` value (`1`)](accountset.html#accountset-flags) in the `SetFlag` field of an [AccountSet transaction][]. To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

For example:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/require-destination-tags/js/require-destination-tags.js", language="js", start_with="// Send AccountSet", end_before="// Confirm Account") }}

_Python_

{{ include_code("_code-samples/require-destination-tags/py/require-destination-tags.py", language="py", start_with="# Send AccountSet", end_before="# Confirm Account") }}

<!-- MULTICODE_BLOCK_END -->

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


<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/require-destination-tags/js/require-destination-tags.js", language="js", start_with="// Confirm Account", end_before="// End main()") }}

_Python_

{{ include_code("_code-samples/require-destination-tags/py/require-destination-tags.py", language="py", start_with="# Confirm Account", end_before="# End main()") }}

<!-- MULTICODE_BLOCK_END -->


{{ start_step("Confirm Settings") }}
<button id="confirm-settings" class="btn btn-primary previous-steps-required">Confirm Settings</button>
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
