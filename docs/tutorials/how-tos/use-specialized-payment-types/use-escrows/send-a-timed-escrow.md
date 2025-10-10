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

### 2. Import dependencies and define main function

After importing the XRPL client library, the tutorial code defines the main function which controls the flow of the script. This function does several things:

1. Connect to the network and get a new wallet from the testnet faucet.
2. Define the properties of the escrow as hard-coded constants.
3. Use helper functions to create the escrow, wait for it to be ready, and then finish it. These functions are defined later in the file.
4. Disconnect from the network when done.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" before="/* send_timed_escrow" /%}
{% /tab %}
{% /tabs %}

### 3. Create the escrow

Next, the `send_timed_escrow(...)` function implements the following:

1. Calculate the maturity time of the escrow (when it should be possible to finish it), and convert it to the correct format ([seconds since the Ripple Epoch][]).
    {% admonition type="danger" name="Warning" %}If you use a UNIX time in the `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!{% /admonition %}
2. Construct an [EscrowCreate transaction][].
    {% admonition type="info" name="Note" %}If you are sending a token escrow, you must also add an expiration time in the `CancelAfter` field, in the same time format. This time must be after the maturity time.{% /admonition %}
3. Submit the transaction to the network and wait for it to be validated by consensus.
4. Return the details of the escrow, particularly the autofilled sequence number. You need this sequence number to identify the escrow in later transactions.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="/* send_timed_escrow" before="/* wait_for_escrow" /%}
{% /tab %}
{% /tabs %}


### 4. Wait for the escrow

The `wait_for_escrow(...)` function implements the following:

1. Check the official close time of the most recent validated ledger.
2. Wait a number of seconds based on the difference between that close time and the time when the escrow is ready to be finished.
3. Repeat until the escrow is ready. The actual, official close time of ledgers [is rounded](../../../../concepts/ledgers/ledger-close-times.md) by up to 10 seconds, so there is some variance in how long it actually takes for an escrow to be ready.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="/* wait_for_escrow" before="/* Sleep function" /%}

Additionally, since JavaScript doesn't have a native `sleep(...)` function, the sample code implements one to be used with `await`, as a convenience:

{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="/* Sleep function" before="/* finish_escrow" /%}

{% /tab %}
{% /tabs %}

### 5. Finish the escrow

The `finish_escrow(...)` function implements the following:

1. Construct an [EscrowFinish transaction][], using the sequence number recorded when the escrow was created.
    {% admonition type="success" name="Tip" %}Anyone can finish a timed escrow when it is ready. Regardless of who does so—the sender, receiver, or even a third party—the escrow delivers the funds to its intended recipient.{% /admonition %}
2. Submit the transaction to the network and wait for it to be validated by consensus.
3. Display the details of the validated transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/send-timed-escrow.js" language="js" from="/* finish_escrow" /%}
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
