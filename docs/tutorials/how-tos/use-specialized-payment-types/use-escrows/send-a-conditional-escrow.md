---
seo:
    description: Create an escrow whose release is based on a condition being fulfilled.
labels:
  - Escrow
---
# Send a Conditional Escrow

This tutorial demonstrates how to send an [escrow](../../../../concepts/payment-types/escrow.md) that can be released when a specific crypto-condition is fulfilled. Essentially, a crypto-condition is like a random password that unlocks the escrow to be sent to its indicated destination. You can use this as part of an app that reveals the fulfillment only when specific actions take place.

This tutorial shows how to escrow XRP. If the [TokenEscrow amendment][] is enabled, you can also escrow tokens.

## Goals

By following this tutorial, you should learn how to:

- Convert a timestamp into the XRP Ledger's native format.
- Create a crypto-condition and fulfillment in the format needed for the XRP Ledger.
- Create and finish an escrow.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library, such as **xrpl.js**, installed.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/escrow/" %}code samples section of this website's repository{% /repo-link %}.

##  Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up client and account

To get started, import the client library and instantiate an API client. For this tutorial, you also need one account, which you can get from the faucet. You also need the address of another account to send the escrow to. You can fund a second account using the faucet, or use the address of an existing account like the faucet.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-conditional-escrow.js" language="js" before="// Create the crypto-condition" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_conditional_escrow.py" language="py" before="# Create the crypto-condition" /%}
{% /tab %}
{% /tabs %}

### 3. Create a condition and fulfillment

Conditional escrows require a fulfillment and its corresponding condition in the format of a PREIMAGE-SHA-256 _crypto-condition_, represented as hexadecimal. To calculate these in the correct format, use a crypto-conditions library. Generally, you want to generate the fulfillment using at least 32 random bytes from a cryptographically secure source of randomness.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-conditional-escrow.js" language="js" from="// Create the crypto-condition" before="// Set the escrow expiration" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_conditional_escrow.py" language="py" from="# Create the crypto-condition" before="# Set the escrow expiration" /%}
{% /tab %}
{% /tabs %}

### 4. Calculate the expiration time

Conditional escrows also need an expiration time, so that the escrow can be canceled if the correct fulfillment isn't provided by the scheduled time. This timestamp must be formatted as [seconds since the Ripple Epoch][]. The sample code calculates an expiration time 30 seconds after the current time.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-conditional-escrow.js" language="js" from="// Set the escrow expiration" before="// Send EscrowCreate transaction" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_conditional_escrow.py" language="py" from="# Set the escrow expiration" before="# Send EscrowCreate transaction" /%}
{% /tab %}
{% /tabs %}

### 5. Create the escrow

To send the escrow, construct an [EscrowCreate transaction][] and then submit it to the network. The fields of this transaction define the properties of the escrow. The sample code uses hard-coded values to send 0.123456 XRP back to the Testnet faucet:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-conditional-escrow.js" language="js" from="// Send EscrowCreate transaction" before="// Save the sequence number" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_conditional_escrow.py" language="py" from="# Send EscrowCreate transaction" before="# Save the sequence number" /%}
{% /tab %}
{% /tabs %}

### 6. Finish the escrow

Anyone with the correct fulfillment can immediately finish a conditional escrow (unless it's a timed conditinal escrow with a `FinishAfter` time). To do this, construct an [EscrowFinish transaction][], using the sequence number that you recorded when you created the escrow, and the matching condition and fulfillment for the escrow, then submit it to the network.

{% admonition type="warning" name="Caution" %}A conditional EscrowFinish requires a [higher than normal transaction cost](../../../../concepts/transactions/transaction-cost.md#special-transaction-costs) based on the size of the fulfillment in bytes. Most libraries should specify an appropriate amount of XRP when autofilling, but you should be mindful of this when specifying the `Fee` field manually.{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-conditional-escrow.js" language="js" from="// Send EscrowFinish transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/send_conditional_escrow.py" language="py" from="# Send EscrowFinish transaction" /%}
{% /tab %}
{% /tabs %}


## See Also

- [Crypto-Conditions Specification][]
- **Concepts:**
    - [Escrow](../../../../concepts/payment-types/escrow.md)
- **Tutorials:**
    - [Send XRP](../../send-xrp.md)
    - [Look Up Transaction Results](../../../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
    - [Reliable Transaction Submission](../../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [Escrow ledger object](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
