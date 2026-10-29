---
seo:
    description: Send a Batch transaction from a single account.
metadata:
  indexPage: true
labels:
  - Batch
  - Transactions
---
# Send a Single Account Batch Transaction

A [Batch transaction][] allows you to group multiple transactions together and execute them as a single atomic operation.

This tutorial shows you how to create a `Batch` transaction where a single account submits multiple transactions that either all succeed together or all fail together.

## Goals

By the end of this tutorial, you will be able to:

- Create a `Batch` transaction with multiple inner transactions, signed and submitted by a single account.
- Configure the `Batch` transaction to ensure atomicity, so that either all inner transactions succeed or they all fail.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../../references/client-libraries.md) installed. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/batch/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

The example in this tutorial demonstrates a scenario where an account sends multiple payments that must be processed atomically in one `Batch` transaction.

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```bash
npm install
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}

{% tab label="Go" %}
From the code sample folder, use `go` to install dependencies:

```bash
go mod tidy
```
{% /tab %}
{% /tabs %}

### 2. Set up client and accounts

To get started, import the client library and instantiate a client to connect to the XRPL. For this tutorial you need a funded account for the `Batch` transaction **sender**, and two other accounts to **receive** the payments.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="import xrpl" before="// Create inner transactions" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="import json" before="# Create inner transactions" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="package main" before="// Create inner transactions" /%}
{% /tab %}
{% /tabs %}

### 3. Prepare inner transactions

Next, prepare the inner transactions that will be included in the batch.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Create inner transactions" before="// Prepare Batch transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Create inner transactions" before="# Prepare Batch transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Create inner transactions" before="// Prepare Batch transaction" /%}
{% /tab %}
{% /tabs %}

The first transaction sends a payment of 2 XRP from the sender to `wallet1`, and the second transaction sends 5 XRP from the sender to `wallet2`. Both transactions must include the `tfInnerBatchTxn` (0x40000000) flag to indicate that they are inner transactions of a batch.

Inner transactions must have a Fee of **0** and an empty string for the `SigningPubKey`. The outer `Batch` transaction handles the overall fee and signing for all inner transactions.

{% admonition type="info" name="Note" %}
The `Fee` and `SigningPubKey` fields are omitted as the client library's _autofill_ functionality automatically populates these when submitting the `Batch` transaction.

You typically don't need to set these manually, but if you do, ensure `Fee` is set to 0 and `SigningPubKey` is an empty string.
{% /admonition %}

### 4. Prepare Batch transaction

Create the `Batch` transaction and provide the inner transactions. The key fields to note are:

| Field            | Value      |
|:---------------- |:---------- |
| TransactionType  | The type of transaction, in this case `Batch`.|
| Account          | The wallet address of the account that is sending the `Batch` transaction. |
| Flags            | The flags for the `Batch` transaction. For this example the transaction is configured with the `tfAllOrNothing` (0x00010000) flag to ensure that either all inner transactions succeed or they all fail atomically. See [Batch Flags](../../../references/protocol/transactions/types/batch.md#batch-flags) for other options. |
| RawTransactions  | Contains the list of inner transactions to be applied. Must include a minimum of **2** transactions and a maximum of **8** transactions. These transactions can come from one account or multiple accounts. |

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Prepare Batch transaction" before="// Submit" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Prepare Batch transaction" before="# Submit" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Prepare Batch transaction" before="// Submit" /%}
{% /tab %}
{% /tabs %}

### 5. Submit Batch transaction

Now the sender can submit the `Batch` transaction:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Submit" before="// Check Batch transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Submit" before="# Check Batch transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Submit" before="// Check Batch transaction" /%}
{% /tab %}
{% /tabs %}

Because `autofill` is enabled, the client library automatically fills in any missing fields, like the `Fee` and `SigningPubKey`, before submitting the batch.

### 6. Check Batch transaction result

To check the result of the `Batch` transaction submission:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Check Batch transaction" before="// Calculate and verify" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Check Batch transaction" before="# Calculate and verify" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Check Batch transaction" before="// Calculate and verify" /%}
{% /tab %}
{% /tabs %}

The code checks for a `tesSUCCESS` result and displays the response details.

{% admonition type="warning" name="Warning" %}
A `tesSUCCESS` result indicates that the `Batch` transaction was processed successfully, but does not guarantee the inner transactions succeeded. For example, see the [following transaction on the XRPL Explorer](https://devnet.xrpl.org/transactions/20CFCE5CF75E93E6D1E9C1E42F8E8C8C4CB1786A65BE23D2EA77EAAB65A455C5/simple).
{% /admonition %}

Because the `Batch` transaction is configured with a `tfAllOrNothing` flag, if any inner transaction fails, **all** inner transactions will fail, and only the `Batch` transaction fee is deducted from the **sender**.

### 7. Verify inner transactions

Since there is no way to check the status of inner transactions in the `Batch` transaction result, you need to calculate the inner transaction hashes and look them up on the ledger:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Calculate and verify" before="// Verify balances after transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Calculate and verify" before="# Verify balances after transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Calculate and verify" before="// Verify balances after transaction" /%}
{% /tab %}
{% /tabs %}

The code extracts the actual inner transactions from the batch response, calculates the hash of each inner transaction and looks up each transaction on the ledger using its hash.

### 8. Verify balances

You can also verify that the inner transactions executed successfully by checking the account balances to confirm the expected changes.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/singleAccountBatch.js" language="js" from="// Verify balances after transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_single_account_batch.py" language="py" from="# Verify balances after transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-single-account-batch/main.go" language="go" from="// Verify balances after transaction" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts**:
  - [Batch Transactions](../../../concepts/transactions/batch-transactions.md)
- **Tutorials**:
  - [Send a Multi-Account Batch Transaction](send-a-multi-account-batch-transaction.md)
- **References**:
  - [Batch Transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
