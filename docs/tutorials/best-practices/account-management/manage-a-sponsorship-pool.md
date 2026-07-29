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

This tutorial walks through the life cycle of a pre-funded [sponsorship](../../../concepts/accounts/sponsored-fees-and-reserves.md#how-sponsorship-works) pool. In this example, a sponsor creates the [Sponsorship entry][] with a [SponsorshipSet transaction][], the sponsee spends part of it, and the sponsor tops it up before deleting it to reclaim the unspent XRP.

This tutorial covers the sponsor's side of the pre-funded flow: funding a pool and adjusting it over time. To see how a sponsee draws on one, read [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md) first.

{% amendment-disclaimer name="Sponsor" /%}

## Goals

By the end of this tutorial, you should be able to:

- Create a sponsorship pool and track what it spends.
- Update a pool to adjust its fee allocation and reserve allowance.
- Delete a pool to return the remaining funds to the sponsor.

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
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `SponsorshipSetFlags` holds the flags that update and delete the pool.
- `fs`: Used to check for and load the tutorial setup data.
- `./sponsoredFeesAndReservesSetup.js`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" before="// Create the sponsor and sponsee wallets" /%}
{% /tab %}

{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling. `SponsorshipSetFlag` holds the flags that update and delete the pool.
- `json`: Used for loading and formatting JSON data.
- `os` and `sys`: Used to check for setup data and exit on transaction failures.
- `asyncio`: Used to run the async tutorial set up function.
- `sponsored_fees_and_reserves_setup`: The tutorial set up script, imported and called directly.

{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" before="# Create the sponsor and sponsee wallets" /%}
{% /tab %}
{% /tabs %}

The example loads an [MPT](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance created by the setup script, which the sponsored transaction authorizes. You can replace it with an issuance of your own.

### 3. Create the wallets

Fund both the sponsor and the sponsee. Both accounts already exist on the ledger in this example, so the sponsor only covers the costs the sponsee opts into.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Create the sponsor and sponsee wallets" before="// Prepare SponsorshipSet transaction --" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Create the sponsor and sponsee wallets" before="# Prepare SponsorshipSet transaction --" /%}
{% /tab %}
{% /tabs %}

### 4. Create the pool

Submit a [SponsorshipSet transaction][] to create the pool. `FeeAmount` funds it with 1 XRP for fees, `MaxFee` caps the pool's contribution to any single transaction, and `RemainingOwnerCount` allows five sponsored objects.

The sponsor pays the `FeeAmount` up front, so it needs that much XRP above its own reserve. It also takes on one owner reserve for the Sponsorship entry itself, on top of any reserves the pool later covers. If it can't cover both, the transaction fails with `tecUNFUNDED`.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction --" before="// Spend part of the pool" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction --" before="# Spend part of the pool" /%}
{% /tab %}
{% /tabs %}

{% admonition type="warning" name="Warning" %}
The Sponsorship entry appears in both accounts' owner directories, which makes it a [deletion blocker](../../../concepts/accounts/deleting-accounts.md#deletion-blockers) for the sponsor and the sponsee alike. Neither account can be deleted until the pool is.
{% /admonition %}

### 5. Spend part of the pool

The sponsee submits an [MPTokenAuthorize transaction][] that draws the fee and one owner reserve from the pool. The Sponsorship entry's `FeeAmount` and `RemainingOwnerCount` fields drop accordingly.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Spend part of the pool" before="// Prepare SponsorshipSet transaction to top up the pool" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Spend part of the pool" before="# Prepare SponsorshipSet transaction to top up the pool" /%}
{% /tab %}
{% /tabs %}

### 6. Top up the pool

Send another SponsorshipSet transaction for the same sponsee to change the pool's allowances. The new values replace the current ones rather than adding to them, so set them to the totals you want. Raising `FeeAmount` deducts the difference from the sponsor, and lowering it refunds the difference.

The entry must keep some budget to draw on. An update that leaves both `FeeAmount` and `RemainingOwnerCount` at zero fails with `tecNO_PERMISSION`, because an empty entry would still consume an owner reserve while giving the sponsee nothing. Delete the pool instead.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction to top up the pool" before="// Prepare SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction to top up the pool" before="# Prepare SponsorshipSet transaction to delete the sponsorship" /%}
{% /tab %}
{% /tabs %}

### 7. Delete the pool

Send a SponsorshipSet transaction with the `tfDeleteObject` flag to delete the Sponsorship entry and return the unspent `FeeAmount` to the sponsor. Record the sponsor's balance first so you can compare it afterwards.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/js/manageSponsorshipPool.js" language="js" from="// Prepare SponsorshipSet transaction to delete the sponsorship" before="// Show the reclaimed XRP" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/sponsored-fees-and-reserves/py/manage_sponsorship_pool.py" language="py" from="# Prepare SponsorshipSet transaction to delete the sponsorship" before="# Show the reclaimed XRP" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
Deleting a pool does not revoke sponsorship on objects that already consumed its reserve allowance. Those objects stay sponsored until the sponsorship ends through a [SponsorshipTransfer transaction][] with the `tfSponsorshipEnd` flag, or until the objects are deleted.
{% /admonition %}

### 8. Check the reclaimed XRP

Compare the sponsor's balance before and after the deletion. The delete transaction pays its own fee, which is separate from the pool refund.

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
  - [Sponsor a Transaction by Co-Signing](./sponsor-a-transaction.md)
  - [Sponsor a Transaction with a Pre-funded Pool](./sponsor-a-transaction-with-a-pre-funded-pool.md)
  - [Transfer a Reserve Sponsorship](./transfer-a-reserve-sponsorship.md)
- **References:**
  - [SponsorshipSet transaction][]
  - [MPTokenAuthorize transaction][]
  - [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
