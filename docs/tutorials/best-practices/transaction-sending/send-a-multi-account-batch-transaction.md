---
seo:
    description: Send a Batch transaction containing transactions from multiple accounts.
metadata:
  indexPage: true
labels:
  - Batch
  - Transactions
---
# Send a Multi-Account Batch Transaction

This tutorial shows you how to create a [Batch transaction][] containing transactions from multiple accounts, where each account must sign the `Batch` transaction. Any account, even one not involved in the inner transactions, can submit the batch.

## Goals

By the end of this tutorial, you will be able to:

- Create a `Batch` transaction with multiple inner transactions, signed by multiple accounts, and submitted by a third party account.
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

The example in this tutorial demonstrates a scenario where Bob and Charlie both owe Alice 50 XRP each, and a third-party (such as a payment processor) submits the `Batch` transaction atomically to ensure Alice is paid by both parties.

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

To get started, import the client library and instantiate a client to connect to the XRPL. Then, create the accounts for Alice, Bob, Charlie, and the third-party.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="import xrpl" before="// Create inner transactions" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="import json" before="# Create inner transactions" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="package main" before="// Create inner transactions" /%}
{% /tab %}
{% /tabs %}

### 3. Prepare inner transactions

Next, prepare the inner transactions that will be included in the batch.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Create inner transactions" before="// Prepare Batch transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Create inner transactions" before="# Prepare Batch transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Create inner transactions" before="// Prepare Batch transaction" /%}
{% /tab %}
{% /tabs %}

The first transaction sends a payment of 50 XRP from Charlie to Alice, and the second sends a payment of 50 XRP from Bob to Alice. Both transactions must include the `tfInnerBatchTxn` (0x40000000) flag to indicate that they are inner transactions of a batch.

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
| BatchSigners     | The list of signatures required for the `Batch` transaction. This is required because there are multiple accounts' transactions included in the batch. |

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Prepare Batch transaction" before="// Gather batch signatures" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Prepare Batch transaction" before="# Gather batch signatures" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Prepare Batch transaction" before="// Gather batch signatures" /%}
{% /tab %}
{% /tabs %}

Because we used `autofill`, the client library automatically fills in any missing fields, like `Fee` and `SigningPubKey`. Additionally, we specify the expected number of signers (2 in this case).

### 5. Gather batch signatures

To add the `BatchSigners` field, you need to collect signatures from each account that's sending a transaction within the batch. In this case we need two signatures, one from Charlie and one from Bob. Each sender must sign the `Batch` transaction to authorize their payment.

{% tabs %}
{% tab label="JavaScript" %}
The **xrpl.js** library provides a helper function, `signMultiBatch()`, to sign the `Batch` transaction for each account.

Then, to combine the signatures into a single signed `Batch` transaction, use the `combineBatchSigners()` utility function.
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Gather batch signatures" before="// Submit" /%}
{% /tab %}

{% tab label="Python" %}
The **xrpl-py** library provides a helper function, `sign_multiaccount_batch()`, to sign the `Batch` transaction for each account.

Then, to combine the signatures into a single signed `Batch` transaction, use the `combine_batch_signers()` utility function.
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Gather batch signatures" before="# Submit" /%}
{% /tab %}

{% tab label="Go" %}
The **xrpl-go** library provides a helper function, `wallet.SignMultiBatch()`, to sign the `Batch` transaction for each account.

Then, to combine the signatures into a single signed `Batch` transaction, use the `wallet.CombineBatchSigners()` utility function. This function expects `transaction.Batch` structs, so the example converts each signed flat transaction back into a struct with the `toBatch()` helper defined at the top of the file.
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Gather batch signatures" before="// Submit" /%}
{% /tab %}
{% /tabs %}

### 6. Submit Batch transaction

With all the required signatures gathered, the third-party wallet can now submit the `Batch` transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Submit" before="// Check Batch transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Submit" before="# Check Batch transaction" /%}
{% /tab %}

{% tab label="Go" %}
The combined transaction is a blob, so the example decodes it back into a transaction map, signs it with the third-party wallet, and submits the signed blob.
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Submit" before="// Check Batch transaction" /%}
{% /tab %}
{% /tabs %}

### 7. Check Batch transaction result

To check the result of the `Batch` transaction submission:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Check Batch transaction" before="// Calculate and verify" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Check Batch transaction" before="# Calculate and verify" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Check Batch transaction" before="// Calculate and verify" /%}
{% /tab %}
{% /tabs %}

The code checks for a `tesSUCCESS` result and displays the response details.

{% admonition type="warning" name="Warning" %}
A `tesSUCCESS` result indicates that the `Batch` transaction was processed successfully, but does not guarantee the inner transactions succeeded. For example, see the [following transaction on the XRPL Explorer](https://devnet.xrpl.org/transactions/20CFCE5CF75E93E6D1E9C1E42F8E8C8C4CB1786A65BE23D2EA77EAAB65A455C5/simple).
{% /admonition %}

Because the `Batch` transaction is configured with a `tfAllOrNothing` flag, if any inner transaction fails, **all** inner transactions will fail, and only the `Batch` transaction fee is deducted from the **third-party wallet**.

### 8. Verify inner transactions

Since there is no way to check the status of inner transactions in the `Batch` transaction result, you need to calculate the inner transaction hashes and look them up on the ledger:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Calculate and verify" before="// Verify balances after transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Calculate and verify" before="# Verify balances after transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Calculate and verify" before="// Verify balances after transaction" /%}
{% /tab %}
{% /tabs %}

The code extracts the actual inner transactions from the batch response, calculates the hash of each inner transaction and looks up each transaction on the ledger using its hash.

### 9. Verify balances

You can also verify that the inner transactions executed successfully by checking the account balances to confirm the expected changes.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/batch/js/multiAccountBatch.js" language="js" from="// Verify balances after transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/batch/py/send_multi_account_batch.py" language="py" from="# Verify balances after transaction" /%}
{% /tab %}

{% tab label="Go" %}
{% code-snippet file="/_code-samples/batch/go/send-multi-account-batch/main.go" language="go" from="// Verify balances after transaction" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts**:
  - [Batch Transactions](../../../concepts/transactions/batch-transactions.md)
- **Tutorials**:
  - [Send a Single Account Batch Transaction](send-a-single-account-batch-transaction.md)
- **References**:
  - [Batch Transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
