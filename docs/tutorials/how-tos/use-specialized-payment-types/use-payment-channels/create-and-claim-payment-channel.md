---
seo:
    description: Learn how to create and claim a payment channel using the XRP Ledger SDKs.
cta_text: Create and Claim a Payment Channel with the XRPL SDKs
labels:
  - Payment Channels
---
# Create and Claim a Payment Channel with the SDK Libraries

This tutorial explains how to create, verify, and claim a payment channel using `xrpl.js` for JavaScript, and `xrpl-py` for Python.

{% admonition type="success" name="Tip" %}Check out the [Code Samples](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/claim-payment-channel) for a complete version of the code used in this tutorial.{% /admonition %}

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<!-- <script type="application/javascript" src="/js/interactive-tutorial.js"></script> -->
<!-- <script type="application/javascript" src="/js/tutorials/send-xrp.js"></script> -->

To interact with the XRP Ledger, you need to set up a dev environment with the necessary tools. This tutorial provides examples using the following options:

- **JavaScript** with the [`xrpl.js` library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../../../javascript/build-apps/get-started.md) for setup steps.
- **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](../../../python/build-apps/get-started.md) for setup steps.

## 1. Connect to a Testnet Server

First, you must connect to an XRP Ledger server. The following code initializes the XRP Ledger client and connects to a public Testnet server:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="import" before="// Creating wallets" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/claim-payment-channel/py/claim_pay_channel.py" from="xrpl.clients" before="try:" language="py" /%}
{% /tab %}

{% /tabs %}

<!-- For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%} -->

## 2. Create Testnet Wallets

Create two Testnet wallets and log their initial XRP balances:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="// Creating wallets" before="// Create a Payment Channel" language="js" /%}
{% /tab %}

{% /tabs %}

For this example, `wallet1` represents the _payer_, and `wallet2` is the _payee_.

The payer can be an individual person or institution using the XRP Ledger who is a customer of the payee. The payee is a person or business who receives XRP or fungible tokens as payment for goods or services.

## 3. Create and Submit the Payment Channel Transaction

Next, prepare the [`PaymentChannelCreate`](../../../../references/protocol/transactions/types/paymentchannelcreate) transaction.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="// Create a Payment Channel" before="// Submit and wait for the transaction" language="js" /%}
{% /tab %}

{% /tabs %}

The key fields in this transaction are:

| Field                   | Description |
| :---------------------- | :---------- |
| `TransactionType`       | The type of transaction to be submitted (i.e., `PaymentChannelCreate`). |
| `Account`               | The _payer_ (source) address of the transaction, which in this example is `wallet1`. |
| `Amount`                | The amount of XRP, in drops, to deduct from the sender's balance and set aside in the payment channel. For this example, we are setting this to 3 XRP. |
| `SettleDelay`           | The amount of time the source address must wait before closing the channel if it has unclaimed XRP. This is set to 1 day (in seconds). |
| `PublicKey`             | The public key of the key pair used to sign claims against the payment channel. |
| `Destination`           | The _payee_ (destination) address to receive claims against this channel, which in this example is `wallet2`. |

Submit and wait for the transaction to be validated on the ledger:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="// Submit and wait for the transaction" before="// Check that the object " language="js" /%}
{% /tab %}

{% /tabs %}

## 4. Verify the Payment Channel is Created

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="// Check that the object" before="// Destination claims" language="js" /%}
{% /tab %}

{% /tabs %}

## 5. Claim the Payment Channel

Create a `PaymentChannelClaim` transaction:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="// Destination claims" before="" language="js" /%}
{% /tab %}

{% /tabs %}

Submit and wait for the transaction to be validated:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="console.log(\"Submitting" before="console.log('Balances" language="js" /%}
{% /tab %}

{% /tabs %}

## 6. Check Balances after Payment Channel is Claimed

Finally, we check the balance of both `wallet1` and `wallet2`, after the claiming the payment channel. Then, we close the client connection.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/claim-payment-channel/js/claimPayChannel.ts" from="console.log('Balances" language="js" /%}
{% /tab %}

{% /tabs %}
