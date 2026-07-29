---
seo:
  description: Settle two confidential Multi-Purpose Token (MPT) payments atomically with a Batch transaction, then read the result as a holder and as an auditor.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Confidential Transfers
  - Payments
status: not_enabled
---
# Send Confidential MPT Payments

This tutorial shows you how to send a [confidential Multi-Purpose Token (MPT) payment](../../concepts/tokens/fungible-tokens/confidential-transfers.md), where the amount sent is encrypted instead of being publicly visible.

In the example, a _seller_ sends a tokenized fund and a _buyer_ pays for it with a different token (for example, a stablecoin). This is coordinated by an _orchestrator_, which represents a third party, such as an exchange. The orchestrator uses a [Batch transaction][] to settle both confidential payments atomically, without ever knowing the amounts involved.

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Goals

By the end of this tutorial, you will be able to:

- Prepare a confidential MPT payment, including the Zero-Knowledge Proof (ZKP) that the ledger validates it against.
- Settle two confidential payments atomically with a [Batch transaction][].
- Confirm each payment settled, and decrypt the resulting balances as a holder and as an auditor.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and the [Confidential Transfers](../../concepts/tokens/fungible-tokens/confidential-transfers.md) concept.
- Have two accounts that each hold a confidential balance of a different MPT, with their encryption public keys registered on-ledger. See [Issue an MPT for Confidential Transfers](../tokens/mpts/issue-mpt-for-confidential-transfers.md#7-convert-the-public-balance-to-a-confidential-balance). The setup script for this tutorial creates them for you.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/confidential-transfers/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the `js/` folder, use `npm` to install dependencies.

```sh
npm install
```
{% /tab %}

{% tab label="Python" %}
From the `py/` folder, set up a virtual environment and use `pip` to install dependencies.

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up the client and accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRP Ledger. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `fs`: Used to check for and load the tutorial setup data.
- `xrpl`: Used for XRPL client connection, transaction submission, wallet handling, `Batch` validation and signing, and hashing each inner transaction of the `Batch`.
- `xrpl/confidential`: Used for key generation, confidential transaction builders, and decryption.
- `./confidentialTransfersSetup.js`: The tutorial setup script, imported and called directly.

{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" before="// Load setup data" /%}
{% /tab %}

{% tab label="Python" %}
- `asyncio`: Used to run the async tutorial setup function.
- `json`, `os`: Used to check for and load the tutorial setup data.
- `xrpl`: Used for XRPL client connection, transaction submission, wallet handling, `Batch` signing, and hashing each inner transaction of the `Batch`.
- `xrpl.ext.confidential`: Used for key generation, confidential transaction builders, and decryption.
- `confidential_transfers_setup`: The tutorial setup script, imported and called directly.

{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Load the accounts, MPT issuance IDs, and encryption keys. This example uses pre-configured data from the setup script, including public and private keys, but you can replace these with your own values.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Load setup data" before="// Make each holder's balance spendable" /%}

In `xrpl.js`, the `deriveConfidentialKeypair` function rebuilds a confidential encryption keypair from an account seed, so the same seed always gives you the same keypair.
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Load setup data" before="# Make each holder's balance spendable" /%}

`xrpl-py` generates a confidential encryption keypair at random and can't rebuild it from an account seed, so this example reads back the keys that the setup script saved.
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Caution" %}
For testing purposes, the example private keys are stored in a JSON file by the setup script. In production, private keys should be stored in a secure, encrypted key store.
{% /admonition %}

### 4. Make each holder's balance spendable

The starting balances that the setup script distributed are in each holder's `ConfidentialBalanceInbox`, and a confidential payment can only spend from `ConfidentialBalanceSpending`.  

Submit a [ConfidentialMPTMergeInbox transaction][] to move those funds into each holder's spending balance.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Make each holder's balance spendable" before="// Build both confidential payments" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Make each holder's balance spendable" before="# Build both confidential payments" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare the ConfidentialMPTSend transactions

To make a confidential payment, you must submit a [ConfidentialMPTSend transaction][].

Create each transaction with the "prepare confidential send" helper function. The helper encrypts the amount under the four public keys, and generates the Zero-Knowledge Proof in the transaction's `ZKProof` field that the ledger validates the transfer against. Without revealing the amount, the proof shows that:

- Every encrypted amount on the transaction encrypts the same value.
- The balance being spent is the one the ledger holds for the sender.
- The sender's remaining balance doesn't go negative.

The proof is also bound to the sender's sequence number, so don't submit anything else from either account between preparing the payments and submitting the `Batch`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Build both confidential payments" before="// Settle both payments atomically" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Build both confidential payments" before="# Settle both payments atomically" /%}

The `prepare_confidential_send` helper function fills in a `Fee`, so you have to set it back to `0` before adding the confidential payment to a Batch.
{% /tab %}
{% /tabs %}

### 6. Submit confidential payments

Use a [Batch transaction][] to submit both confidential payments atomically with the `tfAllOrNothing` flag. This ensures that if there is a failure on either side, it reverts the whole transaction.

Inner transactions must have a `Fee` of `0`, so the outer `Batch` pays for everything inside it. That means 10 times the standard [transaction cost](../../concepts/transactions/transaction-cost.md) for each confidential payment, plus twice the standard cost for the `Batch` itself, plus one standard cost for each signer.

{% tabs %}
{% tab label="JavaScript" %}
`autofill` covers each payment's full cost, so you only need to tell it how many inner signers to expect.
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Settle both payments atomically" before="// Verify each payment individually" /%}
{% /tab %}

{% tab label="Python" %}
`autofill` only charges the standard cost for each inner transaction, so you have to add the rest of each payment's cost to the `Batch` cost.
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Settle both payments atomically" before="# Verify each payment individually" /%}
{% /tab %}
{% /tabs %}

The _seller_ and _buyer_ sign the Batch for their own inner payment, then the two sets of signers are combined and the _orchestrator_ submits it.

### 7. Verify each payment individually

A `tesSUCCESS` on the `Batch` only means the `Batch` itself was well-formed. Each inner payment has its own result, so you must verify the result of each inner transaction.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Verify each payment individually" before="// Merge the received amounts into each spending balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Verify each payment individually" before="# Merge the received amounts into each spending balance" /%}
{% /tab %}
{% /tabs %}

With `tfAllOrNothing`, both inner results are either `tesSUCCESS` or reverted together, so this check confirms the settlement applied as intended.

### 8. Merge the received confidential amounts

Now that each confidential payment has settled, each amount is in its recipient's `ConfidentialBalanceInbox`. A holder can decrypt an inbox amount, but can't spend it.

Merge the confidential balances so both holders can spend them later.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Merge the received amounts into each spending balance" before="// Decrypt balances as each holder" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Merge the received amounts into each spending balance" before="# Decrypt balances as each holder" /%}
{% /tab %}
{% /tabs %}

### 9. Decrypt the balances and settled amounts

Reading a confidential amount requires an encryption private key, so only the two holders and the auditor can decrypt anything here.

First, decrypt each holder's balance on both issuances.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Decrypt balances as each holder" before="// Decrypt the balances and amounts as the auditor" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Decrypt balances as each holder" before="# Decrypt the balances and amounts as the auditor" /%}
{% /tab %}
{% /tabs %}

Each holder reads `ConfidentialBalanceSpending`, and only with its own encryption private key, so neither can read the other's balance.

Then, as the auditor, decrypt both balances along with the amount each payment moved.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/sendConfidentialPayments.js" language="js" from="// Decrypt the balances and amounts as the auditor" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/send_confidential_payments.py" language="py" from="# Decrypt the balances and amounts as the auditor" /%}
{% /tab %}
{% /tabs %}

The auditor decrypts `AuditorEncryptedBalance` on the same entries with its own encryption private key, so one key reads both sides of the settlement. The same key decrypts `AuditorEncryptedAmount` on each payment, which is the amount that moved rather than the balance it landed in.

Everyone else (for example, the _orchestrator_) only sees the encrypted amounts, on the balances and on the payments that moved them.

## See Also

- **Concepts**:
  - [Confidential Transfers](../../concepts/tokens/fungible-tokens/confidential-transfers.md)
  - [Batch Transactions](../../concepts/transactions/batch-transactions.md)
  - [Multi-Purpose Tokens (MPT)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
- **Tutorials**:
  - [Issue an MPT for Confidential Transfers](../tokens/mpts/issue-mpt-for-confidential-transfers.md)
- **References**:
  - [Batch transaction][]
  - [ConfidentialMPTMergeInbox transaction][]
  - [ConfidentialMPTSend transaction][]
  - [MPToken entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
