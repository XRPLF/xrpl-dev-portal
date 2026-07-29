---
seo:
  description: Create, spend, top up, and delete a pre-funded sponsorship pool on the XRP Ledger.
labels:
  - Accounts
  - Fees
  - Sponsorship
status: not_enabled
---
# Manage a Sponsorship Pool

This tutorial shows you how to manage a pre-funded [sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) pool as a sponsor. The example creates a pool, checks what it spends, tops it up, and deletes it to reclaim any unspent XRP.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a sponsorship pool and track what it spends.
- Update a pool to adjust its fee allocation and reserve allowance.
- Delete a pool to return the remaining funds to the sponsor.

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
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `SponsorshipSetFlags` holds the flags that update and delete the pool.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `SponsorshipSetFlag` holds the flags that update and delete the pool.
- `json`: Used for formatting JSON data.
- `sys`: Used to exit on transaction failures.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

### 3. Create the wallets

Create and fund the sponsor and the sponsee accounts.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Create the sponsor and sponsee wallets" before="// Prepare SponsorshipSet transaction --" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Create the sponsor and sponsee wallets" before="# Prepare SponsorshipSet transaction --" /%}
{% /tab %}
{% /tabs %}

### 4. Create the pool

Submit a [SponsorshipSet transaction][] to create the pool.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction --" before="// Submit the SponsorshipSet transaction --" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction --" before="# Submit the SponsorshipSet transaction --" /%}
{% /tab %}
{% /tabs %}

Only the sponsor can create a pool, so it signs and submits the transaction alone. The metadata returns the new Sponsorship entry's ID.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Submit the SponsorshipSet transaction --" before="// Spend part of the pool" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Submit the SponsorshipSet transaction --" before="# Spend part of the pool" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Warning" %}
The Sponsorship entry appears in both accounts' owner directories, which makes it a [deletion blocker](../../../concepts/accounts/deleting-accounts.md#deletion-blockers) for the sponsor and the sponsee alike. Neither account can be deleted until the pool is.
{% /admonition %}

### 5. Spend part of the pool

Spend part of the pool by submitting a [DepositPreauth transaction][] that draws the fee and one owner reserve from the pool.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Spend part of the pool" before="// Prepare SponsorshipSet transaction to top up the pool" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Spend part of the pool" before="# Prepare SponsorshipSet transaction to top up the pool" /%}
{% /tab %}
{% /tabs %}

The Sponsorship entry's `FeeAmount` and `RemainingOwnerCount` fields drop accordingly.

### 6. Top up the pool

Send another SponsorshipSet transaction for the same sponsee to change the pool's allowances. 

`FeeAmountDelta` and `RemainingOwnerCountDelta` apply changes to the current allowances. Positive deltas add budget and negative deltas reduce it. `MaxFee` remains an absolute per-transaction cap.

{% admonition type="info" name="Note" %}
The pool doesn't automatically regain `RemainingOwnerCount` when a sponsored ledger entry is deleted or reassigned. Those actions free the sponsor's reserve and lower its `SponsoringOwnerCount`, but the pool's spent reserve allowance stays spent. Top the pool up with `RemainingOwnerCountDelta` to sponsor more ledger entries.
{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction to top up the pool" before="// Submit the SponsorshipSet transaction to top up the pool" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction to top up the pool" before="# Submit the SponsorshipSet transaction to top up the pool" /%}
{% /tab %}
{% /tabs %}

The sponsor submits the update, and the metadata shows the entry's raised `FeeAmount` and `RemainingOwnerCount`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Submit the SponsorshipSet transaction to top up the pool" before="// Prepare SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Submit the SponsorshipSet transaction to top up the pool" before="# Prepare SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}
{% /tabs %}

### 7. Delete the pool

Submit a SponsorshipSet transaction with the `tfDeleteObject` flag enabled to delete the Sponsorship entry and return the unspent `FeeAmount` to the sponsor. Check the sponsor's balance first so you can compare it afterwards.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction to delete the sponsorship" before="// Submit the SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction to delete the sponsorship" before="# Submit the SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}
{% /tabs %}

The sponsor submits the deletion, and the metadata confirms the Sponsorship entry is deleted.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Submit the SponsorshipSet transaction to delete the sponsorship" before="// Show the reclaimed XRP" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Submit the SponsorshipSet transaction to delete the sponsorship" before="# Show the reclaimed XRP" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
Deleting a pool does not revoke sponsorship on ledger entries that already consumed its reserve allowance. Those entries stay sponsored until the sponsorship ends through a [SponsorshipTransfer transaction][] with the `tfSponsorshipEnd` flag, or until the entries are deleted.
{% /admonition %}

### 8. Verify the sponsor reclaimed XRP

Compare the sponsor's balance before and after the deletion. The sponsor gets the pool's unspent `FeeAmount` back, minus the transaction fee paid to submit the delete transaction.

Deleting the Sponsorship entry also releases the sponsor's owner reserve requirement, but that does not appear as an XRP balance increase. The balance check only shows the returned `FeeAmount` minus the delete transaction fee.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Show the reclaimed XRP" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Show the reclaimed XRP" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts:**
  - [Sponsored Fees and Reserves](../../../concepts/accounts/sponsored-fees-and-reserves.md)
  - [Reserves](../../../concepts/accounts/reserves.md)
- **Tutorials:**
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction-by-co-signing.md)
  - [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
  - [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- **References:**
  - [SponsorshipSet transaction][]
  - [DepositPreauth transaction][]
  - [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
