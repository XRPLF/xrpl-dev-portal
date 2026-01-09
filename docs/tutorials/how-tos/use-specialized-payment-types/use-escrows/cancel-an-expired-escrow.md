---
seo:
    description: Cancel an expired escrow.
labels:
  - Escrow
---
# Cancel an Expired Escrow

This tutorial demonstrates how to cancel an [escrow](../../../../concepts/payment-types/escrow.md) that has passed its expiration time. You can use this to reclaim funds that you escrowed but were never claimed by the recipient, or to remove an expired escrow that is stopping you from deleting your account.

## Goals

By following this tutorial, you should learn how to:

- Compare a timestamp from the ledger to the current time.
- Cancel an expired escrow.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Already know how to send a [timed](./send-a-timed-escrow.md) or [conditional](./send-a-conditional-escrow.md) escrow.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/escrow/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

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
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" before="# Create an escrow" /%}
{% /tab %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" before="// Create an escrow" /%}
{% /tab %}
{% /tabs %}

### 3. Create an escrow

For the purposes of this tutorial, you need an escrow to cancel, so create one that won't be finished before it expires. The sample code uses a conditional escrow with a made-up condition full of zeroes, so nobody knows the fulfillment, and an expiration time 30 seconds into the future. A timed escrow could also work, but it's possible someone else would finish the escrow between its maturity and expiration time.

Anyone can cancel _any_ expired escrow; you don't have to be the sender or receiver. That said, the sender has the most financial incentive to do so, since they get the funds back.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Create an escrow" before="// Wait for the escrow to expire" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Create an escrow" before="# Wait for the escrow to expire" /%}
{% /tab %}
{% /tabs %}

{% admonition type="success" name="Tip" %}For a more detailed explanation of creating an escrow, see [Send a Timed Escrow](./send-a-timed-escrow.md) or [Send a Conditional Escrow](./send-a-conditional-escrow.md).{% /admonition %}

### 4. Wait for the escrow to expire

An escrow can only be canceled after it has expired, so you have to wait until its `CancelAfter` (expiration) time has passed. Since the expiration time is compared to the official close time of the previous ledger, which may be rounded up to 10 seconds, waiting an extra 10 seconds makes it very likely that the escrow has officially expired.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Wait for the escrow to expire" before="// Look up the official close time" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Wait for the escrow to expire" before="# Look up the official close time" /%}
{% /tab %}
{% /tabs %}

### 5. Look up the official close time of the latest validated ledger

Use the [ledger method][] to get the official close time of the most recently validated ledger version. You can use this number to confirm when an escrow has officially expired.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Look up the official close time" before="// Look up escrows" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Look up the official close time" before="# Look up escrows" /%}
{% /tab %}
{% /tabs %}

### 6. Look for expired escrows by account

This is one of several ways to find expired escrows. Use the [account_objects method][] to look up escrows linked to your account. (This includes both incoming and outgoing escrows, potentially.) You may need to look through multiple [paginated][Marker] results if you have a lot of objects linked to your account.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Look up escrows" before="// Find the sequence number" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Look up escrows" before="# Find the sequence number" /%}
{% /tab %}
{% /tabs %}

### 7. Find the sequence number of the expired escrow

To cancel an escrow, you need to know its owner and the sequence number of the transaction that created it. If you already know the sequence number (for example, you saved it when you created the escrow) you can skip this step. The sample code shows how you can look it up for an unknown escrow using the escrow ledger entry's transaction history.

The `PreviousTxnID` field contains the identifying hash of the last transaction to modify the escrow. Generally, this is the EscrowCreate transaction, so you can look up that transaction, using the [tx method][] to get the sequence number from the `Sequence` field. If the transaction used a [Ticket](../../../../concepts/accounts/tickets.md), then the `Sequence` field has a value of `0` and you need to use value of the `TicketSequence` field instead.

{% admonition type="success" name="Tip" %}The {% amendment-disclaimer name="fixIncludeKeyletFields" compact=true /%} adds a `Sequence` field to new Escrow ledger entries. For any escrow created after that amendment goes live, you can get the sequence number directly from that field.{% /admonition %}

In the case that the previous transaction is not an EscrowCreate transaction, you can use _that_ transaction's metadata to find the prior value of the same escrow's `PreviousTxnID`, and repeat the process until you find the actual EscrowCreate. In the current XRP Ledger protocol (as of late 2025), this case is extremely rare to impossible, so the sample code does not demonstrate this process.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Find the sequence number" before="// Send EscrowCancel transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Find the sequence number" before="# Send EscrowCancel transaction" /%}
{% /tab %}
{% /tabs %}

### 8. Cancel the escrow

Once you have all the necessary information, send an [EscrowCancel transaction][] to cancel the escrow. If the transaction succeeds, it deletes the escrow entry and returns the escrowed funds to their source.

{% tabs %}
{% tab label="JavaScript" %}
In xrpl.js, you can use the [`getBalanceChanges(metadata)`](https://js.xrpl.org/functions/getBalanceChanges.html) utility to parse the validated transaction's metadata for a simplified list of balance changes.

{% code-snippet file="/_code-samples/escrow/js/cancel-escrow.js" language="js" from="// Send EscrowCancel transaction" /%}
{% /tab %}

{% tab label="Python" %}
In xrpl-py, you can use the [`get_balance_changes(metadata)`](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.utils.html#xrpl.utils.get_balance_changes) utility to parse the validated transaction's metadata for a simplified list of balance changes.

{% code-snippet file="/_code-samples/escrow/py/cancel_escrow.py" language="py" from="# Send EscrowCancel transaction" /%}
{% /tab %}
{% /tabs %}

## See Also

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
    - [account_objects method][]
    - [ledger method][]
    - [tx method][]
    - [Escrow ledger entry](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
