---
seo:
    description: Send an escrow whose only condition for release is that a specific time has passed.
labels:
  - Escrow
---
# Send a Timed Escrow

This tutorial demonstrates how to send an [escrow](../../../../concepts/payment-types/escrow.md) whose only condition for release is that a specific time has passed. You can use this to set aside money for yourself or others so that it absolutely cannot be used until the specified time.

This tutorial shows how to escrow XRP. If the [TokenEscrow amendment][] is enabled, you can also escrow tokens.

## Goals

By following this tutorial, you should learn how to:

- Convert a timestamp into the XRP Ledger's native format.
- Create and finish an escrow.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger
- Have an XRP Ledger client library, such as **xrpl.js**, installed.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/escrow/send-timed-escrow.js" %}code samples section of this website's repository{% /repo-link %}.

##  Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use npm to install dependencies:

```sh
npm i
```
{% /tab %}
{% /tabs %}

### 2. Set up client and account

To get started, import the client library and instantiate an API client. For this tutorial, you also need one account, which you can get from the faucet.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" before="// Set the escrow finish time" /%}
{% /tab %}
{% /tabs %}

### 3. Calculate the finish time

To make a timed escrow, you need to set the maturity time of the escrow, which is a timestamp after which the escrow can be finished, formatted as [seconds since the Ripple Epoch][]. You can calculate the maturity time by adding a delay to the current time and then using the client library's conversion function. The sample code uses a delay of 30 seconds:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Set the escrow finish time" before="// Send EscrowCreate transaction" /%}
{% /tab %}
{% /tabs %}

{% admonition type="danger" name="Warning" %}If you use a UNIX time without converting to the equivalent Ripple time first, that sets the maturity time to an extra **30 years** in the future!{% /admonition %}

If you want your escrow to have an expiration time, after which it can only be canceled, you can calculate it the same way.

### 4. Create the escrow

To send the escrow, construct an [EscrowCreate transaction][] and then submit it to the network. The fields of this transaction define the properties of the escrow. The sample code uses hard-coded values to send 0.123456 XRP back to the Testnet faucet:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Send EscrowCreate transaction" before="// Save the sequence number" /%}

{% admonition type="info" name="Note" %}To give the escrow an expiration time, add a `CancelAfter` field to the transaction. An expiration time is optional for timed XRP escrows but required for token escrows. This time must be after the maturity time.{% /admonition %}

Save the sequence number of the EscrowCreate transaction. (In this example, the sequence number is autofilled.) You need this sequence number to identify the escrow when you want to finish (or cancel) it later.

{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Save the sequence number" before="// Wait for the escrow" /%}
{% /tab %}
{% /tabs %}


### 5. Wait for the escrow

With the escrow successfully created, the funds are now locked up until the maturity time. Since this tutorial used a delay of 30 seconds, have the script sleep for that long:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Wait for the escrow" before="/* Sleep function" /%}

JavaScript doesn't have a native `sleep(...)` function, but you can implement one to be used with `await`, as a convenience:

{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="/* Sleep function" before="// Check if escrow can be finished" /%}
{% /tab %}
{% /tabs %}

At this point, the escrow should be mature, but that depends on the official close time of the previous ledger. Ledger close times can vary based on the consensus process, and [are rounded](../../../../concepts/ledgers/ledger-close-times.md) by up to 10 seconds. To account for this variance, use an approach such as the following:

1. Check the official close time of the most recent validated ledger.
2. Wait a number of seconds based on the difference between that close time and the maturity time of the escrow.
3. Repeat until the escrow is mature. 

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Check if escrow can be finished" before="// Send EscrowFinish transaction" /%}
{% /tab %}
{% /tabs %}

### 6. Finish the escrow

Now that the escrow is mature, you can finish it. Construct an [EscrowFinish transaction][], using the sequence number that you recorded when you created the escrow, then submit it to the network.

{% admonition type="success" name="Tip" %}Anyone can finish a timed escrow when it is ready. Regardless of who does so—the sender, receiver, or even a third party—the escrow delivers the funds to its intended recipient.{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="// Send EscrowFinish transaction" /%}
{% /tab %}
{% /tabs %}


## See Also

- **Concepts:**
    - [What is XRP?](../../../../introduction/what-is-xrp.md)
    - [Payment Types](../../../../concepts/payment-types/index.md)
        - [Escrow](../../../../concepts/payment-types/escrow.md)
- **Tutorials:**
    - [Send XRP](../../send-xrp.md)
    - [Look Up Transaction Results](../../../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
    - [Reliable Transaction Submission](../../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [account_objects method][]
    - [tx method][]
    - [Escrow ledger object](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
