---
seo:
  description: Claw back a holder's entire confidential Multi-Purpose Token (MPT) balance as the issuer, then verify the result as the holder, the issuer, and the auditor.
metadata:
  indexPage: true
labels:
  - Multi-Purpose Token
  - MPT
  - Confidential Transfers
status: not_enabled
---
# Claw Back Confidential Balances

This tutorial shows you how to claw back a holder's [confidential Multi-Purpose Token (MPT)](../../../concepts/tokens/fungible-tokens/confidential-transfers.md) balance. A confidential clawback takes the holder's total confidential balance (spending + inbox balance), so there is no partial clawback. The clawback amount is publicly visible, so the holder's total confidential balance at that moment can be seen by everyone.

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Goals

By the end of this tutorial, you will be able to:

- Lock an MPT issuance for a holder so that a clawback proof stays valid.
- Claw back the holder's entire confidential balance, and verify the result as the holder, the issuer, and the auditor.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and the [Confidential Transfers](../../../concepts/tokens/fungible-tokens/confidential-transfers.md) concept, in particular [Confidential Clawback](../../../concepts/tokens/fungible-tokens/confidential-transfers.md#confidential-clawback).
- Have an MPT issued with both the **Can Clawback** and **Can Lock** flags, the issuer and auditor encryption keys registered on it, and a holder with a confidential balance. See [Issue an MPT for Confidential Transfers](./issue-mpt-for-confidential-transfers.md). The setup script for this tutorial creates them for you.
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
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `xrpl/confidential`: Used for key derivation, ledger entry lookups, the confidential clawback builder, and decryption.
- `./confidentialTransfersSetup.js`: The tutorial setup script, imported and called directly.

{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" before="// Load setup data" /%}
{% /tab %}

{% tab label="Python" %}
- `asyncio`: Used to run the async tutorial setup function.
- `json`, `os`: Used to check for and load the tutorial setup data.
- `xrpl`: Used for XRPL client connection, transaction submission, ledger entry lookups, and wallet handling.
- `xrpl.ext.confidential`: Used for the confidential clawback builder and decryption.
- `confidential_transfers_setup`: The tutorial setup script, imported and called directly.

{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" before="# Load setup data" /%}
{% /tab %}
{% /tabs %}

Load the issuer, the holder, the auditor, and the issuance the clawback applies to. Only the issuer can claw back, and it needs its own encryption keys to read the holder's balance and build the proof.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" from="// Load setup data" before="// Lock the issuance for the holder" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" from="# Load setup data" before="# Lock the issuance for the holder" /%}
{% /tab %}
{% /tabs %}

This example uses pre-configured data from a setup script, including public and private keys, but you can replace these with your own values.

{% admonition type="warning" name="Caution" %}
For testing purposes, the example's private keys are stored in a JSON file by the setup script. In production, private keys should be stored in a secure, encrypted key store.
{% /admonition %}

### 3. Lock the issuance for the holder

A clawback proof is built against the balance the issuer reads. If the holder spends or receives anything before the clawback, the balance changes, the proof goes stale, and the clawback fails.

Submit an [MPTokenIssuanceSet transaction][] with the `tfMPTLock` flag to [lock](../../../concepts/tokens/fungible-tokens/deep-freeze.md#how-does-mpt-freezelock-behavior-differ-from-iou) the MPT issuance for the holder. This requires the issuance to have the **Can Lock** flag enabled.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" from="// Lock the issuance for the holder" before="// Read the confidential supply before the clawback" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" from="# Lock the issuance for the holder" before="# Read the confidential supply before the clawback" /%}
{% /tab %}
{% /tabs %}

### 4. Read the confidential supply

The issuance's `ConfidentialOutstandingAmount` is the total confidential supply and is public, so the issuer can watch the clawback take effect without decrypting anything.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" from="// Read the confidential supply before the clawback" before="// Claw back the confidential balance" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" from="# Read the confidential supply before the clawback" before="# Claw back the confidential balance" /%}
{% /tab %}
{% /tabs %}

### 5. Claw back the confidential balance

The holder's [MPToken entry][] also carries an `IssuerEncryptedBalance`, which holds the holder's spending and inbox balances added together, encrypted with the issuer's public key. That single total is what makes an unassisted clawback possible, because the issuer can read the exact amount without any cooperation from the holder.

Submit a [ConfidentialMPTClawback transaction][] to claw back the holder's total confidential balance. The transaction carries the amount in the clear, along with a Zero-Knowledge Proof (ZKP) that the amount matches the `IssuerEncryptedBalance` it was read from. The two libraries split that work differently.

{% tabs %}
{% tab label="JavaScript" %}
`prepareConfidentialClawback` needs only the issuer's keypair. It fetches the holder's `MPToken` entry, decrypts `IssuerEncryptedBalance`, and sets `MPTAmount` on the prepared transaction, which is where this example reads the amount from.
{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" from="// Claw back the confidential balance" before="// Verify the clawback" /%}
{% /tab %}

{% tab label="Python" %}
`prepare_confidential_clawback` needs the amount and the ciphertext it was read from, so this example fetches the holder's `MPToken` entry and decrypts `IssuerEncryptedBalance` itself before calling it.
{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" from="# Claw back the confidential balance" before="# Verify the clawback" /%}
{% /tab %}
{% /tabs %}

### 6. Verify the clawback

The clawback sets both the spending balance and the inbox to encrypted zero, so every key that could read the holder's balance now reads zero. Decrypt all four copies to confirm this, one per key that has access.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/confidential-transfers/js/clawbackConfidentialMPT.js" language="js" from="// Verify the clawback" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/confidential-transfers/py/clawback_confidential_mpt.py" language="py" from="# Verify the clawback" /%}
{% /tab %}
{% /tabs %}

The clawed back tokens leave circulation entirely, which the issuance shows in public. `ConfidentialOutstandingAmount` drops by the amount clawed back, and `OutstandingAmount` drops with it.

## See Also

- **Concepts**:
  - [Confidential Transfers](../../../concepts/tokens/fungible-tokens/confidential-transfers.md)
  - [Multi-Purpose Tokens (MPT)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)
  - [Clawing Back Tokens](../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md)
- **Tutorials**:
  - [Issue an MPT for Confidential Transfers](./issue-mpt-for-confidential-transfers.md)
  - [Send Confidential MPT Payments](../../payments/send-confidential-payments.md)
- **References**:
  - [ConfidentialMPTClawback transaction][]
  - [MPTokenIssuanceSet transaction][]
  - [MPToken entry][]
  - [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
