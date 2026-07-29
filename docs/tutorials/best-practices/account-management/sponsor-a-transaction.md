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

This tutorial shows how to use the co-signed [sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) flow, where the sponsor approves a single transaction by adding a signature to it. In this example, a sponsor creates an account for a new user who holds no XRP, then covers the fee and the object reserve for a transaction that user sends.

Co-signing suits cases where the sponsor wants to review each transaction before paying for it. If you want the sponsee to transact on its own, use a [pre-funded pool](./sponsor-a-transaction-with-a-pre-funded-pool.md) instead.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create an account for a sponsee and pay its account reserve.
- Co-sign a transaction so the sponsor pays its fee and object reserve.
- Confirm from the transaction metadata who paid what.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
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

### 2. Set up client and load the tutorial data

Import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `signAsSponsor` adds the sponsor's signature to the sponsee's transaction.
- `fs`: Used to check for and load the tutorial setup data.
- `./sponsoredFeesAndReservesSetup.js`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `sign_as_sponsor` adds the sponsor's signature to the sponsee's transaction.
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `asyncio`: Used to run the async tutorial set up function.
- `sponsored_fees_and_reserves_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

The example loads an [MPT](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance created by the setup script, which the sponsored transaction authorizes. You can replace it with an issuance of your own.

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

Send a [Payment transaction][] with the `tfSponsorCreatedAccount` flag enabled. The flag places the account reserve on the sponsor, so the payment itself only needs to deliver 1 drop.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Prepare Payment transaction to create the sponsee's account" before="// Prepare the sponsored MPTokenAuthorize transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Prepare Payment transaction to create the sponsee's account" before="# Prepare the sponsored MPTokenAuthorize transaction" /%}
{% /tab %}
{% /tabs %}

The `AccountRoot` entry the transaction creates records the sponsor in its `Sponsor` field.

### 5. Prepare the sponsored transaction

The sponsee sends an [MPTokenAuthorize transaction][] to authorize receiving the MPT. The `Sponsor` field names the account that pays, and the `SponsorFlags` field states what it pays for: `spfSponsorFee` for the transaction fee and `spfSponsorReserve` for the reserve of the new `MPToken` entry.

Autofill the transaction before either party signs so the sponsor's signature approves the exact fee amount.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Prepare the sponsored MPTokenAuthorize transaction" before="// Sign as the sponsee" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Prepare the sponsored MPTokenAuthorize transaction" before="# Sign as the sponsee" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
This example sponsors an MPTokenAuthorize transaction, but many other transaction types can be sponsored. See [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field) for the transactions that allow `spfSponsorReserve`.
{% /admonition %}

### 6. Co-sign the transaction

A sponsored transaction needs a signature from both parties, and each one has its own place in the transaction.

The sponsee signs first, because it's the sending account. Its signature fills the usual `SigningPubKey` and `TxnSignature` fields. The sponsor then signs the transaction the sponsee already signed, and its signature goes into a separate `SponsorSignature` field.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/sponsorATransaction.js" language="js" from="// Sign as the sponsee" before="// Submit the fully signed transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/sponsor_a_transaction.py" language="py" from="# Sign as the sponsee" before="# Submit the fully signed transaction" /%}
{% /tab %}
{% /tabs %}

### 7. Submit the transaction and confirm the sponsorship

Submit the fully signed transaction and wait for validation. The transaction printed here is the one that goes to the network, carrying the sponsee's signature in `TxnSignature` and the sponsor's in `SponsorSignature`.

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
  - [MPTokenAuthorize transaction][]
  - [Common Fields](../../../references/protocol/transactions/common-fields.md#sponsorflags-field)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
