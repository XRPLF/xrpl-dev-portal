---
html: require-destination-tags.html
parent: manage-account-settings.html
seo:
    description: Require users to specify a destination tag when sending to your address.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Accounts
steps: ['Generate', 'Connect', 'Send AccountSet', 'Wait', 'Confirm Settings', 'Test Payments']
---
# Require Destination Tags

The Require Destination Tag setting is designed for addresses that host balances for multiple people or purposes, to prevent people from sending money and forgetting to use a [destination tag](../../../concepts/transactions/source-and-destination-tags.md) to identify whom to credit. When this setting is enabled on your address, the XRP Ledger rejects [any payment](../../../concepts/payment-types/index.md) to your address if it does not specify a destination tag.

This tutorial demonstrates how to enable the Require Destination Tag flag on your account.

**Note:** The meanings of specific destination tags are entirely up to the logic built on top of the XRP Ledger. The ledger has no way of knowing whether any specific tag is valid in your system, so you must still be ready to receive transactions with the wrong destination tag. Typically, this involves providing a customer support experience that can track down payments made incorrectly and credit customers accordingly, and possibly also bouncing unwanted payments.

## Prerequisites

- You need a funded XRP Ledger account, with an address, secret key, and some XRP. For production, you can use the same address and secret consistently. For this tutorial, you can generate new test credentials as needed.
- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup steps.
    - **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](../../python/build-apps/get-started.md) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/require-destination-tags.js"></script>

## Example Code

Complete sample code for all the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Require Destination Tags](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/require-destination-tags/) in the source repository for this website.

## Steps

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these using the following interface:

{% partial file="/docs/_snippets/interactive-tutorials/generate-step.md" /%}

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md).

### 2. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](../../../references/client-libraries.md):

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/get-started/py/base-async.py" language="py" /%}
{% /tab %}

{% /tabs %}

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}

### 3. Send AccountSet Transaction

To enable the `RequireDest` flag, set the [`asfRequireDest` value (`1`)](../../../references/protocol/transactions/types/accountset.md#accountset-flags) in the `SetFlag` field of an [AccountSet transaction][]. To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/require-destination-tags/js/require-destination-tags.js" from="// Send AccountSet" before="// Confirm Account" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/require-destination-tags/py/require-destination-tags.py" from="# Send AccountSet" before="# Confirm Account" language="py" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Send AccountSet" steps=$frontmatter.steps %}

<button id="send-accountset" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send AccountSet</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 4. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).)

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### 5. Confirm Account Settings

After the transaction is validated, you can check your account's settings to confirm that the Require Destination Tag flag is enabled.


{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/require-destination-tags/js/require-destination-tags.js" from="// Confirm Account" before="// End main()" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/require-destination-tags/py/require-destination-tags.py" from="# Confirm Account" before="# End main()" language="py" /%}
{% /tab %}

{% /tabs %}


{% interactive-block label="Confirm Settings" steps=$frontmatter.steps %}

<button id="confirm-settings" class="btn btn-primary previous-steps-required">Confirm Settings</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}

For further confirmation, you can send test transactions (from a different address) to confirm that the setting is working as you expect it to. If you a payment with a destination tag, it should succeed, and if you send one _without_ a destination tag, it should fail with the error code [`tecDST_TAG_NEEDED`](../../../references/protocol/transactions/transaction-results/tec-codes.md).

{% interactive-block label="Test Payments" steps=$frontmatter.steps %}

<button class="test-payment btn btn-primary" data-dt="10">Send XRP (with Destination Tag)</button>
<button class="test-payment btn btn-primary" data-dt="">Send XRP (without Destination Tag)</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


## See Also

- **Concepts:**
    - [Accounts](../../../concepts/accounts/index.md)
    - [Source and Destination Tags](../../../concepts/transactions/source-and-destination-tags.md)
    - [Transaction Cost](../../../concepts/transactions/transaction-cost.md)
    - [Payment Types](../../../concepts/payment-types/index.md)
- **References:**
    - [account_info method][]
    - [AccountSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
