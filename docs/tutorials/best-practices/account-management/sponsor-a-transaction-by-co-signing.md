---
seo:
  description: Cover another account's transaction fee and reserve requirement by co-signing a single transaction.
labels:
  - Accounts
  - Fees
  - Sponsorship
status: not_enabled
---
# Sponsor a Transaction by Co-Signing

This tutorial shows you how to use the co-signed [sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) flow, where the sponsor approves a single transaction by adding a signature to it. In this example, a sponsor creates an account for a new user who holds no XRP, then covers the fee and the owner reserve for a transaction that user sends.

Use this flow when the sponsor needs to review each sponsored transaction before it is submitted. If the sponsee needs to be able to transact without waiting on the sponsor, use a [pre-funded pool](./sponsor-a-transaction-with-a-pre-funded-pool.md) instead.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create an account for a sponsee and pay its account reserve as the sponsor.
- Co-sign a transaction so the sponsor pays the fee and the new ledger entry's reserve.
- Confirm that the sponsor paid the fee and reserve.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger and [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md).
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js). See [Get Started Using JavaScript](../../get-started/get-started-javascript.md) for setup steps.
  - **Python** with the [xrpl-py library](https://github.com/XRPLF/xrpl-py). See [Get Started Using Python](../../get-started/get-started-python.md) for setup steps.

## Source Code

You can find the complete source code for this tutorial's example in the [code samples section of this website's repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/sponsored-fees-and-reserves).

## Steps

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
{% /tabs %}

### 2. Set up the client

Import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for formatting JSON data.
- `sys`: Used to exit on transaction failures.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

### 3. Create the wallets

Fund the sponsor and generate a key pair for the sponsee. The sponsee has no account on the ledger yet, and no XRP to pay for one.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Create the sponsor and sponsee wallets" before="// Prepare Payment transaction to create the sponsee's account" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Create the sponsor and sponsee wallets" before="# Prepare Payment transaction to create the sponsee's account" /%}
{% /tab %}
{% /tabs %}

### 4. Create the sponsee's account

Create a [Payment transaction][] with the `tfSponsorCreatedAccount` flag enabled to create the sponsee's account. The flag makes the sponsor responsible for the new account's reserve, so the payment only needs to deliver the smallest possible XRP amount.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Prepare Payment transaction to create the sponsee's account" before="// Prepare the sponsored DepositPreauth transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Prepare Payment transaction to create the sponsee's account" before="# Prepare the sponsored DepositPreauth transaction" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare the sponsored transaction

In this example, the sponsee submits a [DepositPreauth transaction][], but many other transaction types can also be sponsored; see [SponsorFlags field](../../../references/protocol/transactions/common-fields.md#sponsorflags-field) to learn more.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Prepare the sponsored DepositPreauth transaction" before="// Sign as the sponsee" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Prepare the sponsored DepositPreauth transaction" before="# Sign as the sponsee" /%}
{% /tab %}
{% /tabs %}

The `Sponsor` field names the account that pays, and the `SponsorFlags` field states what it pays for:

- `spfSponsorFee` for the transaction fee.
- `spfSponsorReserve` for the reserve of the new `DepositPreauth` entry.

The sponsor must sign the transaction with the exact `Fee` amount it agrees to pay. Autofill the transaction before signing so the `Fee` field is set; if the fee is added or changed after signing, the signature no longer matches the transaction.

### 6. Co-sign the transaction

A sponsored transaction needs a signature from both parties, and each one has its own place in the transaction.

The sponsee's signature fills the usual `SigningPubKey` and `TxnSignature` fields. The sponsor's goes into a separate `SponsorSignature` field, which carries its own `SigningPubKey` and `TxnSignature`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Sign as the sponsee" before="// Submit the fully signed transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Sign as the sponsee" before="# Submit the fully signed transaction" /%}
{% /tab %}
{% /tabs %}

### 7. Submit the transaction and confirm the sponsorship

Submit the fully signed transaction and wait for validation.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Submit the fully signed transaction" before="// Extract sponsorship information" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Submit the fully signed transaction" before="# Extract sponsorship information" /%}
{% /tab %}
{% /tabs %}

Finally, inspect the affected nodes to confirm the sponsor paid the fee and reserve.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Extract sponsorship information" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Extract sponsorship information" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts:**
  - [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md)
  - [Reserves](../../../concepts/accounts/reserves.md)
- **Tutorials:**
  - [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
  - [Manage a Sponsorship Pool](./manage-a-sponsorship-pool.md)
  - [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- **References:**
  - [Payment transaction][]
  - [DepositPreauth transaction][]
  - [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
